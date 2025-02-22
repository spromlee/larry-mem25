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
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState('');
  const [email, setEmail] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [mounted, setMounted] = useState(false);
  const [imageDimensions, setImageDimensions] = useState<{[key: string]: number}>({});
  const [isSlideshow, setIsSlideshow] = useState(false);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const categoriesList = ['All', 'Portrait', 'Family activities', 'Loving couple'];

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
    // Limit to 100 images
    const filesToAdd = acceptedFiles.slice(0, 100 - uploadedFiles.length);
    
    const newFiles = [...uploadedFiles, ...filesToAdd];
    const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
    
    setUploadedFiles(newFiles);
    setPreviewUrls(newPreviewUrls);
  }, [uploadedFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
    },
    multiple: true,
    maxFiles: 100,
  });

  const removeFile = (indexToRemove: number) => {
    const newFiles = uploadedFiles.filter((_, index) => index !== indexToRemove);
    const newPreviewUrls = previewUrls.filter((_, index) => index !== indexToRemove);
    
    setUploadedFiles(newFiles);
    setPreviewUrls(newPreviewUrls);
  };

  const handleUpload = async () => {
    if (!uploadedFiles.length || !email) return;

    try {
      setLoading(true);
      
      // Upload images sequentially
      for (const file of uploadedFiles) {
        // Upload to Firebase Storage
        const storageRef = ref(storage, `gallery/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(snapshot.ref);

        // Save to MongoDB
        const response = await fetch('/api/gallery', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            imageUrl: downloadUrl,
            caption: caption || '',
            email,
            category: category || '',
          }),
        });

        if (!response.ok) throw new Error('Failed to save image');
        
        // Refresh images after each upload to show progressive loading
        await fetchImages();
      }

      // Reset form
      setUploadedFiles([]);
      setPreviewUrls([]);
      setCaption('');
      setCategory('');
      setEmail('');
      setOpen(false);
    } catch (error) {
      console.error('Error uploading images:', error);
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


  const handleImageClick = (image: GalleryImage) => {
    const index = filteredImages.findIndex(img => img._id === image._id);
    setCurrentImageIndex(index);
    setSelectedImage(image);
  };
  
  // Add navigation handlers
  const handleNext = () => {
    const newIndex = (currentImageIndex + 1) % filteredImages.length;
    setCurrentImageIndex(newIndex);
    setSelectedImage(filteredImages[newIndex]);
  };
  
  const handlePrevious = () => {
    const newIndex = (currentImageIndex - 1 + filteredImages.length) % filteredImages.length;
    setCurrentImageIndex(newIndex);
    setSelectedImage(filteredImages[newIndex]);
  };

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
          {categoriesList.map((cat) => (
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
                    unoptimized={true}
                    quality={75}
                  />
                  <div 
                    className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer"
                    onClick={() => handleImageClick(image)}
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
            setUploadedFiles([]);
            setPreviewUrls([]);
            setCaption('');
            setCategory('');
            setEmail('');
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
              {previewUrls.length > 0 ? (
                <div 
                  className="grid grid-cols-3 gap-2 max-h-[300px] overflow-y-auto custom-scrollbar"
                  style={{ 
                    scrollbarWidth: 'thin', 
                    scrollbarColor: '#4CB6D4 #f3f4f6' 
                  }}
                >
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative h-24 w-full group">
                      <Image
                        src={url}
                        alt={`Preview ${index + 1}`}
                        fill
                        className="object-contain"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(index);
                        }}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Close fontSize="small" />
                      </button>
                    </div>
                  ))}
                  {previewUrls.length < 100 && (
                    <div className='flex flex-col items-center justify-center gap-2 border-2 border-dashed h-24'>
                      <IoCloudUploadOutline className='text-2xl text-gray-500' />
                      <p className='text-gray-500 text-xs'>Add more</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className='flex flex-col items-center justify-center gap-2'>
                  <IoCloudUploadOutline className='text-2xl text-gray-500' />
                  <p className='text-gray-500 text-sm'>Drag and drop images here, or click to select (Max file size 20MB)</p>
                </div>
              )}
            </div>

            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-4"
            />

            <TextField
              fullWidth
              label="Caption (Optional)"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="mb-4"
            />

            <TextField
              select
              fullWidth
              label="Category (Optional)"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mb-4"
            >
              <MenuItem value="">None</MenuItem>
              {categoriesList.slice(1).map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </TextField>

            <Button
              fullWidth
              variant="contained"
              onClick={handleUpload}
              disabled={!uploadedFiles.length || !email || loading}
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
  onNext={handleNext}
  onPrevious={handlePrevious}
/>
      </div>
    </section>
  );
}
