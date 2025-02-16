'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { IoClose } from 'react-icons/io5';
import { BsChevronLeft, BsChevronRight, BsShuffle } from 'react-icons/bs';
import { IoMdVolumeHigh, IoMdVolumeOff } from 'react-icons/io';

interface SlideshowProps {
  images: Array<{
    imageUrl: string;
    caption: string;
  }>;
  isOpen: boolean;
  onClose: () => void;
}

export default function Slideshow({ images, isOpen, onClose }: SlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isRandom, setIsRandom] = useState(false);
  const [areImagesLoaded, setAreImagesLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const preloadImages = async () => {
    const promises = images.map((image) => {
      return new Promise((resolve, reject) => {
        const img = new window.Image();
        img.src = image.imageUrl;
        img.onload = resolve;
        img.onerror = reject;
      });
    });

    await Promise.all(promises);
    setAreImagesLoaded(true);
  };

  useEffect(() => {
    if (!isOpen) return;

    preloadImages().catch((error) => {
      console.error('Error preloading images:', error);
      setAreImagesLoaded(true); // Fallback in case of error
    });

    if (audioRef.current) {
      audioRef.current.volume = 0.2;
      audioRef.current.play().catch(error => {
        console.log('Audio autoplay failed:', error);
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [isOpen]);

  const toggleRandom = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRandom(!isRandom);
  };

  useEffect(() => {
    if (!isOpen || !areImagesLoaded) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (isRandom) {
          return Math.floor(Math.random() * images.length);
        }
        return (prev + 1) % images.length;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [isOpen, images.length, areImagesLoaded, isRandom]);

  const handleAudioLoad = () => {
    if (audioRef.current) {
      audioRef.current.volume = 0.2;
    }
  };

  if (!isOpen) return null;

  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center"
      onClick={handleClose}
    >
      <audio
        ref={audioRef}
        src="/assets/music/background-music.mp3"
        loop
        preload="auto"
        onLoadedData={handleAudioLoad}
      />

      {!areImagesLoaded ? (
        <div className="text-white text-xl animate-pulse">
          Please wait for a while!
        </div>
      ) : (
        <div 
          className="relative w-full h-full flex items-center justify-center"
          onClick={e => e.stopPropagation()}
        >
          <div className="absolute top-6 left-6 flex gap-2 z-[110]">
            <button
              onClick={toggleMute}
              className="flex items-center gap-1 bg-white rounded-full px-4 py-1.5 text-black text-sm hover:bg-gray-100 transition-colors"
            >
              {isMuted ? (
                <>
                  <IoMdVolumeOff className="md:text-2xl text-xl" />
                  <span className='md:text-sm text-xs'>Play Music</span>
                </>
              ) : (
                <>
                  <IoMdVolumeHigh className="md:text-2xl text-xl" />
                  <span className='md:text-sm text-xs'>Mute Music</span>
                </>
              )}
            </button>
            <button
              onClick={toggleRandom}
              className="flex items-center gap-1 bg-white rounded-full px-4 py-1.5 text-black md:text-sm text-xs hover:bg-gray-100 transition-colors"
            >
              <BsShuffle className="md:text-2xl text-xl" />
              {isRandom ? 'Random On' : 'Random Off'}
            </button>
          </div>

          <button
            onClick={handleClose}
            className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors z-[110] cursor-pointer"
          >
            <IoClose className="text-4xl" />
          </button>

          <button
            onClick={handlePrevious}
            className="absolute left-6 text-white hover:text-gray-300 transition-colors z-[110] cursor-pointer"
          >
            <BsChevronLeft className="text-4xl" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-6 text-white hover:text-gray-300 transition-colors z-[110] cursor-pointer"
          >
            <BsChevronRight className="text-4xl" />
          </button>

          <div className="relative w-[95%] h-[98%] p-20">
            <Image
              key={currentIndex}
              src={images[currentIndex].imageUrl}
              alt={images[currentIndex].caption}
              fill
              className="object-contain animate-fade-in transition-opacity duration-1000"
              quality={100}
              priority
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white lg:mx-28 mx-4 p-4 pb-6 text-center">
              <p className="font-roboto-condensed lg:text-base text-sm">{images[currentIndex].caption}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
