'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, Typography, Skeleton, Button } from '@mui/material';
import NoticeDialog from './NoticeDialog';
import { CiLocationOn } from 'react-icons/ci';
import { BsCalendarDate, BsClock } from 'react-icons/bs';
import { Masonry } from '@mui/lab';
import Box from '@mui/material/Box';

interface Notice {
  _id: string;
  title?: string;
  description: string;
  imageUrl?: string;
  pdfUrl?: string;
  location?: string;
  time?: string;
  date?: string;
  createdAt: string;
}

export default function Notice() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const response = await fetch('/api/notices');
      const data = await response.json();
      if (data.success) {
        setNotices(data.notices);
      }
    } catch (error) {
      console.error('Error fetching notices:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleOpenDialog = (notice: Notice) => {
    setSelectedNotice(notice);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedNotice(null);
  };

  if (loading) {
    return (
      <section id="notice" className="pt-10 pb-16 bg-white font-roboto-condensed">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-roboto-condensed mb-1">Notice</h2>
          <div className="h-1 w-[60px] bg-primary mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="w-full">
                <CardContent>
                  <Skeleton variant="text" width="30%" height={32} />
                  <Skeleton variant="text" width="100%" height={80} />
                  <div className="flex gap-4 mt-4">
                    <Skeleton variant="text" width={100} />
                    <Skeleton variant="text" width={100} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (notices.length === 0) {
    return (
      <section id="notice" className="pt-10 pb-16 bg-white font-roboto-condensed">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-roboto-condensed mb-1">Notice</h2>
          <div className="h-1 w-[60px] bg-primary mb-8"></div>
          <Card>
            <CardContent>
              <Typography variant="body1" className="text-center text-gray-500">
                No notices available at the moment.
              </Typography>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section id="notice" className="pt-10 pb-16 bg-white font-inter">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-roboto-condensed mb-1">Notice</h2>
        <div className="h-1 w-[60px] bg-primary mb-8"></div>
        <Box>
          <Masonry
            columns={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2 }}
            spacing={3}
          >
            {notices.map((notice) => (
              <div key={notice._id}>
                <Card className="w-full hover:shadow-md transition-shadow rounded-xl" sx={{borderRadius: '15px'}}>
                  <CardContent className="lg:p-10 p-6" sx={{padding: {lg: '1.5rem', md: '1.5rem', sm: '1.5rem'}}}>
                    {notice.title && (
                      <h1 className="lg:text-[1.4rem] text-xl font-medium mb-1">
                        {notice.title}
                      </h1>
                    )}
                    <p className="text-gray-500 text-sm mb-3">
                      Posted on {formatDate(notice.createdAt)}
                    </p>

                    <div className="mb-2">
                      <span
                        onClick={() => handleOpenDialog(notice)}
                        className="mb-6 whitespace-pre-line text-sm cursor-pointer"
                      >
                        <span className='line-clamp-3'>{notice.description}</span> 
                        <span onClick={() => handleOpenDialog(notice)} className='cursor-pointer text-primary underline'>Read more</span>
                      </span>
                    </div>

                    {notice.imageUrl && (
                      <div className="relative w-full aspect-video mb-4 rounded-lg overflow-hidden">
                        <Image
                          src={notice.imageUrl}
                          alt={notice.title || 'Notice image'}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}

                    <div className="flex flex-wrap gap-4 text-gray-600 text-xs mb-2">
                      {notice.location && (
                        <div className="flex items-center gap-1">
                          <CiLocationOn className="text-gray-500 text-sm" />
                          <p className='text-xs'>{notice.location}</p>
                        </div>
                      )}
                      {notice.date && (
                        <div className="flex items-center gap-1">
                          <BsCalendarDate className="text-gray-500" />
                          <p className='text-xs'>{notice.date}</p>
                        </div>
                      )}
                      {notice.time && (
                        <div className="flex items-center gap-1">
                          <BsClock className="text-gray-500" />
                          <p className='text-xs'>{notice.time}</p>
                        </div>
                      )}
                    </div>
                      
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleOpenDialog(notice)}
                      className="mt-4 !md:text-sm !text-xs"
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
                      View Full Notice
                    </Button>
                    {notice.pdfUrl && (
                      <Button
                        variant="outlined"
                        color="primary"
                        href={notice.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 !ml-2 !md:text-sm !text-xs"
                        sx={{
                          borderColor: '#4CB6D4',
                          color: '#4CB6D4',
                          '&:hover': {
                            backgroundColor: 'rgba(76, 182, 212, 0.1)',
                            borderColor: '#4CB6D4',
                          },
                          textTransform: 'none',
                          borderRadius: '0.75rem',
                          padding: '0.4rem 1rem',
                          fontWeight: 500,
                        }}
                      >
                        Download PDF
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            ))}
          </Masonry>
        </Box>
      </div>
      <NoticeDialog
        notice={selectedNotice}
        open={dialogOpen}
        onClose={handleCloseDialog}
      />
    </section>
  );
}
