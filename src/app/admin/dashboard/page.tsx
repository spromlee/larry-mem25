'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Container,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Tabs,
  Tab,
  Pagination,
  Modal,
  TextField,
  IconButton,
} from '@mui/material';
import { AddPhotoAlternate, Close } from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import Cookies from 'js-cookie';

import Link from 'next/link';


interface GalleryImage {
  _id: string;
  imageUrl: string;
  caption: string;
  email: string;
  uploadedAt: string;
  isApproved: boolean;
}

interface Memory {
  _id: string;
  fullName: string;
  email: string;
  message: string;
  photos?: string[];
  createdAt: string;
  isApproved: boolean;
}

interface Notice {
  _id: string;
  title?: string;
  description: string;
  imageUrl?: string;
  location?: string;
  time?: string;
  date?: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState<string | null>(null);
  const [removing, setRemoving] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [noticeModalOpen, setNoticeModalOpen] = useState(false);
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeDescription, setNoticeDescription] = useState('');
  const [noticeLocation, setNoticeLocation] = useState('');
  const [noticeDate, setNoticeDate] = useState('');
  const [noticeTime, setNoticeTime] = useState('');
  const [noticeImage, setNoticeImage] = useState<File | null>(null);
  const [noticeImagePreview, setNoticeImagePreview] = useState('');
  const rowsPerPage = 8;

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setNoticeImage(file);
        setNoticeImagePreview(URL.createObjectURL(file));
      }
    },
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
    },
    maxFiles: 1,
  });

  useEffect(() => {
    const isAuthenticated = Cookies.get('admin_authenticated') === 'true';
    if (!isAuthenticated) {
      router.push('/admin');
      return;
    }
    // Initial data load
    fetchData();
  }, [router]);

  useEffect(() => {
    if (activeTab === 0) {
      fetchImages();
    } else if (activeTab === 1) {
      fetchMemories();
    } else {
      fetchNotices();
    }
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 0) {
        await fetchImages();
      } else if (activeTab === 1) {
        await fetchMemories();
      } else {
        await fetchNotices();
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchImages = async () => {
    try {
      const response = await fetch('/api/gallery?showAll=true');
      const data = await response.json();
      if (data.success) {
        setImages(data.images);
        setTotalPages(Math.ceil(data.images.length / rowsPerPage));
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const fetchMemories = async () => {
    try {
      const response = await fetch('/api/memories?showAll=true');
      const data = await response.json();
      if (data.success) {
        setMemories(data.memories);
        setTotalPages(Math.ceil(data.memories.length / rowsPerPage));
      }
    } catch (error) {
      console.error('Error fetching memories:', error);
    }
  };

  const fetchNotices = async () => {
    try {
      const response = await fetch('/api/notices');
      const data = await response.json();
      if (data.success) {
        setNotices(data.notices);
        setTotalPages(Math.ceil(data.notices.length / rowsPerPage));
      }
    } catch (error) {
      console.error('Error fetching notices:', error);
    }
  };

  const handleApprove = async (id: string, type: 'gallery' | 'memory') => {
    try {
      setApproving(id);
      const endpoint = type === 'gallery' ? '/api/gallery' : '/api/memories';
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          isApproved: true,
        }),
      });

      const data = await response.json();
      if (data.success) {
        if (type === 'gallery') {
          setImages(images.map(img => 
            img._id === id ? { ...img, isApproved: true } : img
          ));
        } else {
          setMemories(memories.map(mem => 
            mem._id === id ? { ...mem, isApproved: true } : mem
          ));
        }
      }
    } catch (error) {
      console.error('Error approving item:', error);
    } finally {
      setApproving(null);
    }
  };

  const handleRemove = async (id: string, type: 'gallery' | 'memory') => {
    try {
      setRemoving(id);
      const endpoint = type === 'gallery' ? '/api/gallery' : '/api/memories';
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          isApproved: false,
        }),
      });

      const data = await response.json();
      if (data.success) {
        if (type === 'gallery') {
          setImages(images.map(img => 
            img._id === id ? { ...img, isApproved: false } : img
          ));
        } else {
          setMemories(memories.map(mem => 
            mem._id === id ? { ...mem, isApproved: false } : mem
          ));
        }
      }
    } catch (error) {
      console.error('Error removing item:', error);
    } finally {
      setRemoving(null);
    }
  };

  const handlePublishNotice = async () => {
    try {
      setLoading(true);
      let imageUrl = '';

      if (noticeImage) {
        const storageRef = ref(storage, `notices/${Date.now()}_${noticeImage.name}`);
        const snapshot = await uploadBytes(storageRef, noticeImage);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      const response = await fetch('/api/notices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: noticeTitle,
          description: noticeDescription,
          imageUrl,
          location: noticeLocation,
          time: noticeTime,
          date: noticeDate,
        }),
      });

      if (!response.ok) throw new Error('Failed to publish notice');

      // Reset form
      setNoticeTitle('');
      setNoticeDescription('');
      setNoticeLocation('');
      setNoticeDate('');
      setNoticeTime('');
      setNoticeImage(null);
      setNoticeImagePreview('');
      setNoticeModalOpen(false);
      
      // Refresh notices
      fetchNotices();
    } catch (error) {
      console.error('Error publishing notice:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNotice = async (id: string) => {
    try {
      setRemoving(id);
      const response = await fetch(`/api/notices/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setNotices(notices.filter(notice => notice._id !== id));
      }
    } catch (error) {
      console.error('Error deleting notice:', error);
    } finally {
      setRemoving(null);
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const getCurrentPageData = () => {
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    if (activeTab === 0) {
      return images.slice(startIndex, endIndex);
    } else if (activeTab === 1) {
      return memories.slice(startIndex, endIndex);
    } else {
      return notices.slice(startIndex, endIndex);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="xl" className="flex justify-center items-center min-h-[90vh]">
        <CircularProgress className="text-primary" />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" className="py-8 !font-inter">
      <div>
        <div className="flex items-center justify-between">
          <Typography variant="h5" className="!font-roboto-condensed !text-primary !text-3xl">
            Admin Dashboard
          </Typography>
          <Link href="/" className="text-white bg-primary hover:bg-primaryLight py-2 px-4 rounded-xl">
            Go Home
          </Link>
        </div>
          <div className="h-0.5 w-[120px] bg-primary mb-8"></div>
      </div>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs 
          value={activeTab} 
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: '#4CB6D4',
            },
            '& .Mui-selected': {
              color: '#4CB6D4 !important',
            },
          }}
        >
          <Tab label="Gallery" className="!font-semibold" />
          <Tab label="Memory Wall" className="!font-semibold" />
          <Tab label="Notices" className="!font-semibold" />
        </Tabs>
      </Box>

      {activeTab === 2 && (
        <Button
          variant="contained"
          startIcon={<AddPhotoAlternate />}
          onClick={() => setNoticeModalOpen(true)}
          className="!mb-4 !bg-primary !hover:bg-primaryLight !text-white !py-2 !px-6 !rounded-xl"
        >
          Publish Notice
        </Button>
      )}
      
      <TableContainer component={Paper} className="mt-4">
        <Table>
          <TableHead>
            <TableRow className='!font-semibold'>
              {activeTab === 0 ? (
                <>
                  <TableCell className='!font-semibold'>Image</TableCell>
                  <TableCell className='!font-semibold'>Caption</TableCell>
                  <TableCell className='!font-semibold'>Email</TableCell>
                  <TableCell className='!font-semibold !whitespace-nowrap'>Upload Date</TableCell>
                  <TableCell className='!font-semibold'>Status</TableCell>
                  <TableCell className='!font-semibold'>Action</TableCell>
                </>
              ) : activeTab === 1 ? (
                <>
                  <TableCell className='!font-semibold'>Name</TableCell>
                  <TableCell className='!font-semibold'>Message</TableCell>
                  <TableCell className='!font-semibold'>Email</TableCell>
                  <TableCell className='!font-semibold'>Photos</TableCell>
                  <TableCell className='!font-semibold'>Date</TableCell>
                  <TableCell className='!font-semibold'>Status</TableCell>
                  <TableCell className='!font-semibold'>Action</TableCell>
                </>
              ) : (
                <>
                  <TableCell className='!font-semibold'>Title</TableCell>
                  <TableCell className='!font-semibold'>Description</TableCell>
                  <TableCell className='!font-semibold'>Location</TableCell>
                  <TableCell className='!font-semibold'>Date</TableCell>
                  <TableCell className='!font-semibold'>Time</TableCell>
                  <TableCell className='!font-semibold'>Image</TableCell>
                  <TableCell className='!font-semibold'>Action</TableCell>
                </>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {getCurrentPageData().map((item) => {
              if (activeTab === 0) {
                const galleryItem = item as GalleryImage;
                return (
                  <TableRow key={galleryItem._id}>
                    <TableCell className="w-40">
                      <div className="relative h-24 w-24">
                        <Image
                          src={galleryItem.imageUrl}
                          alt={galleryItem.caption}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    </TableCell>
                    <TableCell className=" !lg:pr-10 !pr-6 min-w-[300px]">{galleryItem.caption}</TableCell>
                    <TableCell>{galleryItem.email}</TableCell>
                    <TableCell>
                      {new Date(galleryItem.uploadedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {galleryItem.isApproved ? (
                        <span className="text-green-600">Approved</span>
                      ) : (
                        <span className="text-yellow-600">Pending</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {galleryItem.isApproved ? (
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleRemove(galleryItem._id, 'gallery')}
                          disabled={removing === galleryItem._id}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          {removing === galleryItem._id ? (
                            <CircularProgress size={24} />
                          ) : (
                            'Remove'
                          )}
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleApprove(galleryItem._id, 'gallery')}
                          disabled={approving === galleryItem._id}
                          className="bg-gray-800 hover:bg-gray-700"
                        >
                          {approving === galleryItem._id ? (
                            <CircularProgress size={24} />
                          ) : (
                            'Approve'
                          )}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              } else if (activeTab === 1) {
                const memoryItem = item as Memory;
                return (
                  <TableRow key={memoryItem._id}>
                    <TableCell>{memoryItem.fullName}</TableCell>
                    <TableCell className="max-w-md">
                      <div className="truncate">{memoryItem.message}</div>
                    </TableCell>
                    <TableCell>{memoryItem.email}</TableCell>
                    <TableCell>
                      {memoryItem.photos && memoryItem.photos.length > 0 && (
                        <div className="flex gap-2">
                          {memoryItem.photos.slice(0, 2).map((photo, index) => (
                            <div key={index} className="relative h-16 w-16">
                              <Image
                                src={photo}
                                alt={`Photo ${index + 1}`}
                                fill
                                className="object-cover rounded"
                              />
                            </div>
                          ))}
                          {memoryItem.photos.length > 2 && (
                            <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded">
                              <Typography variant="body2">
                                +{memoryItem.photos.length - 2}
                              </Typography>
                            </div>
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(memoryItem.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {memoryItem.isApproved ? (
                        <span className="text-green-600">Approved</span>
                      ) : (
                        <span className="text-yellow-600">Pending</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {memoryItem.isApproved ? (
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleRemove(memoryItem._id, 'memory')}
                          disabled={removing === memoryItem._id}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          {removing === memoryItem._id ? (
                            <CircularProgress size={24} />
                          ) : (
                            'Remove'
                          )}
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleApprove(memoryItem._id, 'memory')}
                          disabled={approving === memoryItem._id}
                          className="bg-gray-800 hover:bg-gray-700"
                        >
                          {approving === memoryItem._id ? (
                            <CircularProgress size={24} />
                          ) : (
                            'Approve'
                          )}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              } else {
                const noticeItem = item as Notice;
                return (
                  <TableRow key={noticeItem._id}>
                    <TableCell>{noticeItem.title || '-'}</TableCell>
                    <TableCell>
                      <div className="max-w-md truncate" dangerouslySetInnerHTML={{ __html: noticeItem.description }} />
                    </TableCell>
                    <TableCell>{noticeItem.location || '-'}</TableCell>
                    <TableCell>{noticeItem.date || '-'}</TableCell>
                    <TableCell>{noticeItem.time || '-'}</TableCell>
                    <TableCell>
                      {noticeItem.imageUrl && (
                        <div className="relative h-16 w-16">
                          <Image
                            src={noticeItem.imageUrl}
                            alt={noticeItem.title || 'Notice image'}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDeleteNotice(noticeItem._id)}
                        disabled={removing === noticeItem._id}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        {removing === noticeItem._id ? (
                          <CircularProgress size={24} />
                        ) : (
                          'Delete'
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              }
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Box className="mt-4 flex justify-center">
        <Pagination 
          count={totalPages} 
          page={page} 
          onChange={handlePageChange}
          color="primary"
        />
      </Box>

      {/* Notice Modal */}
      <Modal
        open={noticeModalOpen}
        onClose={() => {
          setNoticeModalOpen(false);
          setNoticeTitle('');
          setNoticeDescription('');
          setNoticeLocation('');
          setNoticeDate('');
          setNoticeTime('');
          setNoticeImage(null);
          setNoticeImagePreview('');
        }}
      >
        <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-2xl flex flex-col gap-4">
          <div className="flex justify-between items-center mb-4">
            <Typography variant="h6">Publish Notice</Typography>
            <IconButton onClick={() => setNoticeModalOpen(false)}>
              <Close />
            </IconButton>
          </div>

          <TextField
            fullWidth
            label="Title (Optional)"
            value={noticeTitle}
            onChange={(e) => setNoticeTitle(e.target.value)}
            className="mb-4"
          />

          <div className="mb-4">
            <Typography variant="subtitle2" className="mb-2">Description</Typography>
            <TextField
              fullWidth
              multiline
              rows={6}
              value={noticeDescription}
              onChange={(e) => setNoticeDescription(e.target.value)}
              placeholder="Enter your notice description..."
              className="bg-white"
            />
          </div>

          <TextField
            fullWidth
            label="Location (Optional)"
            value={noticeLocation}
            onChange={(e) => setNoticeLocation(e.target.value)}
            className="!mb-4"
          />

          <div className="grid grid-cols-2 gap-4 mb-4">
            <TextField
              fullWidth
              label="Date (Optional)"
              type="date"
              value={noticeDate}
              onChange={(e) => setNoticeDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Time (Optional)"
              type="time"
              value={noticeTime}
              onChange={(e) => setNoticeTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </div>

          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-4 mb-4 text-center cursor-pointer ${
              isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
          >
            <input {...getInputProps()} />
            {noticeImagePreview ? (
              <div className="relative h-48 w-full">
                <Image
                  src={noticeImagePreview}
                  alt="Preview"
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <p>Drag and drop an image here, or click to select (Optional)</p>
            )}
          </div>

          <Button
            fullWidth
            variant="contained"
            onClick={handlePublishNotice}
            disabled={!noticeDescription || loading}
            className="!bg-primary !hover:bg-primaryLight !text-white !py-2 !px-6 rounded-lg"
          >
            {loading ? <CircularProgress size={24} /> : 'Publish'}
          </Button>
        </Box>
      </Modal>
    </Container>
  );
}
