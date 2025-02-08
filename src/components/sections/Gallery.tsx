'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import Masonry from 'react-masonry-css';
import {
  Modal,
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  CircularProgress,
  MenuItem,
} from '@mui/material';
import { Close, Add } from '@mui/icons-material';
import ImageDialog from './ImageDialog';
import { MdOutlineAddPhotoAlternate } from 'react-icons/md';
import { BsPlayCircle } from 'react-icons/bs';
import Slideshow from './Slideshow';
import { IoCloudUploadOutline } from 'react-icons/io5';

interface GalleryImage {
  _id: string;
  imageUrl: string;
  caption: string;
  email: string;
  category: string;
  uploadedAt: string;
}

export default function Gallery() {
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [mounted, setMounted] = useState(false);
  const [imageDimensions, setImageDimensions] = useState<{[key: string]: number}>({});
  const [isSlideshow, setIsSlideshow] = useState(false);

  const categories = ['All', 'Portrait', 'Family activities', 'Loving couple'];

  useEffect(() => {
    fetchImages();
    
    // Refresh images every 30 seconds
    const interval = setInterval(fetchImages, 30000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Get image dimensions when images change
    images.forEach(image => {
      if (!imageDimensions[image._id]) {
        const imgElement = document.createElement('img');
        imgElement.onload = () => {
          setImageDimensions(prev => ({
            ...prev,
            [image._id]: (imgElement.height / imgElement.width) * 100
          }));
        };
        imgElement.src = image.imageUrl;
      }
    });
  }, [images, imageDimensions]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
    },
    maxFiles: 1,
  });

  const handleUpload = async () => {
    if (!uploadedFile || !caption || !email || !category) return;

    try {
      setLoading(true);
      // Upload to Firebase Storage
      const storageRef = ref(storage, `gallery/${Date.now()}_${uploadedFile.name}`);
      const snapshot = await uploadBytes(storageRef, uploadedFile);
      const downloadUrl = await getDownloadURL(snapshot.ref);

      // Save to MongoDB
      const response = await fetch('/api/gallery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: downloadUrl,
          caption,
          email,
          category,
        }),
      });

      if (!response.ok) throw new Error('Failed to save image');

      // Reset form
      setUploadedFile(null);
      setCaption('');
      setEmail('');
      setCategory('');
      setPreviewUrl('');
      setOpen(false);
      
      // Refresh images
      fetchImages();
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchImages = async () => {
    try {
      const response = await fetch('/api/gallery');
      const data = await response.json();
      if (data.success) {
        setImages(data.images);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const filteredImages = images.filter(image => 
    selectedCategory === 'All' || image.category === selectedCategory
  );

  return (
    <section id="gallery" className="pt-10 pb-16 bg-white font-inter">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
          <h2 className="text-3xl font-roboto-condensed mb-1">Gallery</h2>
          <div className="h-1 w-[60px] bg-primary mb-8"></div>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="md:text-base text-sm px-4 py-1.5 rounded-xl transition-all duration-500 border bg-primary text-white flex items-center gap-2"
          >
            <MdOutlineAddPhotoAlternate className='text-[1.5rem]' />
            Add Photo
          </button>
        </div>

        {/* Category Filter Buttons */}
        <div className="flex gap-2 mb-6 flex-wrap items-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`md:text-sm text-xs px-4 py-1.5 rounded-xl transition-all duration-500 border border-primary ${selectedCategory === cat ? 'font-bold bg-primary text-white' : 'text-primary'}`}
            >
              {cat}
            </button>
          ))}
          <button
            onClick={() => setIsSlideshow(true)}
            className="md:text-sm text-xs px-4 py-1.5 rounded-xl transition-all duration-500 border border-primary text-primary flex items-center gap-2 hover:bg-primary hover:text-white"
          >
            <BsPlayCircle className="text-lg" />
            Start Slideshow
          </button>
        </div>

        {/* Image Grid */}
        <style jsx global>{`
          .my-masonry-grid {
            display: flex;
            width: auto;
            gap: 1rem;
          }
          .my-masonry-grid_column {
            background-clip: padding-box;
          }
          .masonry-item {
            margin-bottom: 1rem;
            width: 100%;
          }
          @media (max-width: 640px) {
            .my-masonry-grid {
              gap: 1rem;
            }
            .masonry-item {
              margin-bottom: 0.5rem;
            }
          }
        `}</style>
        
        {mounted && (
          <Masonry
            breakpointCols={{
              default: 4,
              1536: 4,
              1024: 4,
              640: 3
            }}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {filteredImages.map((image) => (
              <div key={image._id} className="masonry-item relative overflow-hidden group rounded-xl">
                <div 
                  className="relative w-full rounded-xl bg-gray-50 lg:p-2 p-1" 
                  style={{ 
                    paddingBottom: `${imageDimensions[image._id] || 100}%`,
                    backgroundColor: '#f3f4f6'
                  }}
                >
                  <Image
                    src={image.imageUrl}
                    alt={image.caption}
                    fill
                    className="object-cover rounded-xl transition-transform duration-300 lg:p-2 p-1"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    priority={true}
                    width={0}
                    height={0}
                    unoptimized={false}
                    quality={75}
                  />
                  <div 
                    className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer"
                    onClick={() => setSelectedImage(image)}
                  >
                    <div className='xl:w-24 xl:h-24 lg:w-16 lg:h-16 w-10 h-10 rounded-full bg-gray-600 bg-opacity-60 flex items-center justify-center'>
                      <Add className="text-white opacity-100 xl:text-4xl lg:text-2xl text-base"  />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Masonry>
        )}
        
        {/* Upload Modal */}
        <Modal
          open={open}
          onClose={() => {
            setOpen(false);
            setUploadedFile(null);
            setPreviewUrl('');
            setCaption('');
            setEmail('');
            setCategory('');
          }}
        >
          <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-lg flex flex-col gap-4">
            <div className="flex justify-between items-center mb-4">
              <Typography variant="h6" className='text-primary'>Add Photo</Typography>
              <IconButton onClick={() => setOpen(false)}>
                <Close />
              </IconButton>
            </div>

            {/* Dropzone */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-4 mb-4 text-center cursor-pointer ${
                isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              }`}
            >
              <input {...getInputProps()} />
              {previewUrl ? (
                <div className="relative h-48 w-full">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className='flex flex-col items-center justify-center gap-2'>
                  <IoCloudUploadOutline className='text-2xl text-gray-500' />
                  <p className='text-gray-500 text-sm'>Drag and drop an image here, or click to select</p>
                </div>
              )}
            </div>

            <TextField
              select
              fullWidth
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mb-4"
            >
              {categories.slice(1).map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="Caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="mb-4"
            />

            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-4"
            />


            <Button
              fullWidth
              variant="contained"
              onClick={handleUpload}
              disabled={!uploadedFile || !caption || !email || !category || loading}
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

        {/* Slideshow */}
        <Slideshow
          images={filteredImages}
          isOpen={isSlideshow}
          onClose={() => setIsSlideshow(false)}
        />

        {/* Image Dialog */}
        <ImageDialog
          open={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          imageUrl={selectedImage?.imageUrl || ''}
          caption={selectedImage?.caption || ''}
        />
      </div>
    </section>
  );
}
