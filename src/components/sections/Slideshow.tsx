'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { IoClose } from 'react-icons/io5';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
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
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Start playing music when slideshow opens
    if (audioRef.current) {
      audioRef.current.volume = 0.2; // Set volume to 70%
      audioRef.current.play().catch(error => {
        console.log('Audio autoplay failed:', error);
      });
    }

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000); // Change slide every 4 seconds

    return () => {
      clearInterval(interval);
      // Stop music when slideshow closes
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [isOpen, images.length]);

  // Set initial volume when audio element is loaded
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
      <div 
        className="relative w-full h-full flex items-center justify-center"
        onClick={e => e.stopPropagation()}
      >
        {/* Background Music */}
        <audio
          ref={audioRef}
          src="/assets/music/background-music.mp3"
          loop
          preload="auto"
          onLoadedData={handleAudioLoad}
        />

        {/* Sound Control */}
        <button
          onClick={toggleMute}
          className="absolute top-6 left-6 text-white hover:text-gray-300 transition-colors z-[110] cursor-pointer"
        >
          {isMuted ? (
            <p className='flex items-center gap-1 bg-white rounded-full px-4 py-1.5 text-black text-sm'>
              <IoMdVolumeOff className="text-2xl" />
              Play Music
            </p>
          ) : (
            <p className='flex items-center gap-1 bg-white rounded-full px-4 py-1.5 text-black text-sm'>
              <IoMdVolumeHigh className="text-2xl" />
              Mute Music
            </p>
          )}
        </button>

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors z-[110] cursor-pointer"
        >
          <IoClose className="text-4xl" />
        </button>

        {/* Navigation buttons */}
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

        {/* Image */}
        <div className="relative w-full h-full p-20 duration-1000 transition-opacity">
          <Image
            src={images[currentIndex].imageUrl}
            alt={images[currentIndex].caption}
            fill
            className="object-contain"
            quality={100}
            priority
          />
          {/* Caption */}
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white lg:mx-28 mx-4 p-4 pb-6 text-center">
            <p className="font-roboto-condensed lg:text-base text-sm">{images[currentIndex].caption}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
