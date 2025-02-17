'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import {
  Modal,
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  CircularProgress,
  Card,
  CardContent,
  Select,
  MenuItem,
  InputBase,
} from '@mui/material';
import { Close, Search } from '@mui/icons-material';
import ImageDialog from './ImageDialog';
import { LuNotebookPen } from 'react-icons/lu';
import { IoCloudUploadOutline } from 'react-icons/io5';

interface Memory {
  _id: string;
  fullName: string;
  email: string;
  message: string;
  photos?: string[];
  createdAt: string;
}

const highlightText = (text: string, query: string) => {
  if (!query) return text;
  
  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return (
    <>
      {parts.map((part, index) => 
        part.toLowerCase() === query.toLowerCase() ? (
          <span key={index} className="text-primary font-medium">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
};

export default function MemoryWall() {
  const [open, setOpen] = useState(false);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMemory, setSelectedMemory] = useState<{
    memory: Memory;
    photoIndex: number;
  } | null>(null);

  useEffect(() => {
    fetchMemories();
  }, []);

  const filteredAndSortedMemories = memories
    .filter(memory => {
      const searchLower = searchQuery.toLowerCase();
      return (
        memory.message.toLowerCase().includes(searchLower) ||
        memory.fullName.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadedFiles(prev => [...prev, ...acceptedFiles]);
    const newPreviewUrls = acceptedFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
    },
    maxFiles: 5,
  });

  const handleSubmit = async () => {
    if (!fullName || !email || !message) return;

    try {
      setLoading(true);
      const photoUrls: string[] = [];

      // Upload photos if any
      if (uploadedFiles.length > 0) {
        for (const file of uploadedFiles) {
          const storageRef = ref(storage, `memories/${Date.now()}_${file.name}`);
          const snapshot = await uploadBytes(storageRef, file);
          const downloadUrl = await getDownloadURL(snapshot.ref);
          photoUrls.push(downloadUrl);
        }
      }

      // Save memory
      const response = await fetch('/api/memories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName,
          email,
          message,
          photos: photoUrls,
        }),
      });

      if (!response.ok) throw new Error('Failed to save memory');

      // Reset form
      setUploadedFiles([]);
      setFullName('');
      setEmail('');
      setMessage('');
      setPreviewUrls([]);
      setOpen(false);
      
      // Refresh memories
      fetchMemories();
    } catch (error) {
      console.error('Error submitting memory:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMemories = async () => {
    try {
      const response = await fetch('/api/memories');
      const data = await response.json();
      if (data.success) {
        setMemories(data.memories);
      }
    } catch (error) {
      console.error('Error fetching memories:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };


  const handlePhotoClick = (memory: Memory, index: number) => {
    setSelectedMemory({ memory, photoIndex: index });
  };
  
  // Add navigation handlers
  const handleNext = () => {
    if (selectedMemory) {
      const nextIndex = (selectedMemory.photoIndex + 1) % selectedMemory.memory.photos!.length;
      setSelectedMemory({ ...selectedMemory, photoIndex: nextIndex });
    }
  };
  
  const handlePrevious = () => {
    if (selectedMemory) {
      const prevIndex = (selectedMemory.photoIndex - 1 + selectedMemory.memory.photos!.length) % 
                        selectedMemory.memory.photos!.length;
      setSelectedMemory({ ...selectedMemory, photoIndex: prevIndex });
    }
  };
  

  return (
    <section id="memory-wall" className="pt-10 pb-16 bg-white font-inter">
      <div className="container mx-auto px-4">
        <div className="flex flex-col mb-8">
          <div>
            <h2 className="text-3xl font-roboto-condensed">Memory Wall</h2>
            <div className="h-1 w-[80px] bg-primary mb-8"></div>
            <p className="text-gray-600 italic lg:text-lg text-base">&ldquo;To live in the hearts we leave behind is not to die.&rdquo; <br />
            Please share your Photos and Memories about Larry.</p>
          </div>
          <div className='flex md:flex-row flex-col justify-between md:items-center items-start gap-4 mt-6 mb-6'>
            <button
              onClick={() => setOpen(true)}
              className="md:text-base text-sm px-4 py-1.5 rounded-xl transition-all duration-500 border bg-primary text-white flex items-center gap-2 hover:bg-primary/90"
            >
              <LuNotebookPen className='text-xl' />
              Contribute
            </button>

            <div className='flex items-center md:gap-3 gap-2 w-full md:w-auto'>
              <Select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'desc' | 'asc')}
                size="small"
                className="min-w-[140px] text-sm"
                sx={{
                  fontSize: '0.8rem',
                  borderRadius: '0.75rem',
                  '.MuiOutlinedInput-notchedOutline': {
                    borderColor: '#e5e7eb',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#d1d5db',
                  },
                  '.MuiSelect-select': {
                    padding: '8px 14px',
                  },
                }}
              >
                <MenuItem value="desc" className="text-xs" sx={{ fontSize: '0.8rem' }}>Recent to Old</MenuItem>
                <MenuItem value="asc" className="text-xs" sx={{ fontSize: '0.8rem' }}>Old to Recent</MenuItem>
              </Select>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.75rem',
                  padding: '3px 10px',
                  flex: 1,
                  maxWidth: '300px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: '#d1d5db',
                    boxShadow: 'rgba(0, 0, 0, 0.05) 0px 1px 2px',
                  },
                  '&:focus-within': {
                    borderColor: '#d1d5db',
                    boxShadow: 'rgba(0, 0, 0, 0.05) 0px 1px 2px',
                  },
                }}
              >
                <Search sx={{ color: 'action.active', fontSize: '1.4rem' }} />
                <InputBase
                  placeholder="Search memories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{ 
                    ml: 1.5,
                    flex: 1,
                    fontSize: '0.875rem',
                    '& input::placeholder': {
                      fontSize: '0.875rem',
                    }
                  }}
                />
              </Box>
            </div>
          </div>

          {/* Memories Grid */}
          <div className="space-y-6">
            {filteredAndSortedMemories.map((memory) => (
              <Card 
                key={memory._id} 
                className="w-full bg-white shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] hover:shadow-md transition-shadow duration-300 border-b-2 border-b-primary"
                sx={{
                  borderRadius: '1rem',
                  overflow: 'hidden'
                }}
              >
                <CardContent className="p-6" sx={{
                  padding: {lg: '1.6rem', md: '1.4rem', sm: '1rem'}
                }}>
                  <p 
                   
                    className="italic mb-2 text-sm text-gray-600 font-inter"
                    
                  >
                    {formatDate(memory.createdAt)}
                  </p>
                  
                  <p className="mb-4 whitespace-pre-line text-base font-inter">
                    {highlightText(memory.message, searchQuery)}
                  </p>

                  {memory.photos && memory.photos.length > 0 && (
                    <div className="flex gap-4 mb-4 mt-2">
                      {memory.photos.map((photo, index) => (
                        <div 
                          key={index} 
                          className="relative h-24 w-24 cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => handlePhotoClick(memory, index)}
                        >
                          <Image
                            src={photo}
                            alt={`Photo by ${memory.fullName}`}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <p 
                    
                    className="text-right text-orange-400 text-lg font-playfair-display"
                  >
                    {highlightText(memory.fullName, searchQuery)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contribution Modal */}
          <Modal
            open={open}
            onClose={() => {
              setOpen(false);
              setUploadedFiles([]);
              setPreviewUrls([]);
              setFullName('');
              setEmail('');
              setMessage('');
            }}
          >
            <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-lg flex flex-col gap-4">
              <div className="flex justify-between items-center mb-4">
                <Typography variant="h5" className='text-primary'>Share Your Memory</Typography>
                <IconButton onClick={() => setOpen(false)}>
                  <Close className='text-primary' />
                </IconButton>
              </div>

              <TextField
                size='small'
                fullWidth
                label="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                sx={{fontSize: '0.875rem'}}
                className="mb-4 border-primary outline-primary"
              />

              <TextField
                size='small'
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mb-4"
              />

              <TextField
                fullWidth
                label="Your Message"
                multiline
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mb-4"
              />

              {/* Photo Upload */}
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-4 mb-4 text-center cursor-pointer ${
                  isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                }`}
              >
                <input {...getInputProps()} />
                
                {previewUrls.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="relative aspect-square">
                        <Image
                          src={url}
                          alt={`Preview ${index + 1}`}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className='flex flex-col items-center justify-center gap-2'>
                  <IoCloudUploadOutline className='text-2xl text-gray-500' />
                  <p className='text-gray-500 text-sm'>Drag and drop an image here, or click to select - Max 20MB (Optional) </p>
                </div>
                )}
              </div>

              <Button
                fullWidth
                variant="contained"
                onClick={handleSubmit}
                disabled={!fullName || !email || !message || loading}
                sx={{
                  backgroundColor: '#4CB6D4',
                  '&:hover': {
                    backgroundColor: '#C0C0C0',
                  },
                  textTransform: 'none',
                  borderRadius: '0.75rem',
                  padding: '0.5rem 1rem',
                  fontWeight: 500,
                  '&.Mui-disabled': {
                    backgroundColor: '#4CB6D4',
                    opacity: 0.8,
                  }
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
              </Button>
            </Box>
          </Modal>

          {/* Image Dialog */}
          <ImageDialog
  open={!!selectedMemory}
  onClose={() => setSelectedMemory(null)}
  imageUrl={selectedMemory?.memory.photos?.[selectedMemory.photoIndex] || ''}
 
  onNext={handleNext}
  onPrevious={handlePrevious}
/>
        </div>
      </div>
    </section>
  );
}
