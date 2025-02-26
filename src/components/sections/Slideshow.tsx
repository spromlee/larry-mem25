'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { IoClose } from 'react-icons/io5';
import { BsChevronLeft, BsChevronRight, BsShuffle } from 'react-icons/bs';
import { IoMdVolumeHigh, IoMdVolumeOff } from 'react-icons/io';
import { RiFullscreenFill, RiFullscreenExitFill } from 'react-icons/ri';
import { MdOutlineMusicNote } from 'react-icons/md';

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
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [currentMusicIndex, setCurrentMusicIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const slideshowRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const isPlayingRef = useRef(false);
  const preloadedImages = useRef<{ [key: number]: HTMLImageElement }>({});

  const musicTracks = [
    '/assets/music/background-music.mp3',
    '/assets/music/2-track.mp3',
    '/assets/music/3-track.mp3',
    '/assets/music/4-track.mp3'
  ];

  const preloadImage = async (index: number) => {
    if (loadedImages.has(index) || !images[index]) return;

    return new Promise((resolve) => {
      const img = new window.Image();
      img.src = images[index].imageUrl;
      img.onload = () => {
        preloadedImages.current[index] = img;
        setLoadedImages(prev => new Set([...prev, index]));
        resolve(undefined);
      };
      img.onerror = () => {
        console.error(`Failed to load image at index ${index}`);
        resolve(undefined);
      };
    });
  };

  const preloadAdjacentImages = async (currentIdx: number) => {
    const totalImages = images.length;
    const indicesToLoad = [
      currentIdx,
      (currentIdx + 1) % totalImages,
      (currentIdx + 2) % totalImages,
      (currentIdx - 1 + totalImages) % totalImages
    ];

    const uniqueIndices = [...new Set(indicesToLoad)];
    await Promise.all(uniqueIndices.map(idx => preloadImage(idx)));
  };

  // Effect for preloading images
  useEffect(() => {
    if (!isOpen) return;
    preloadAdjacentImages(currentIndex);
  }, [isOpen, currentIndex, images.length]);

  const handleImageChange = (newIndex: number) => {
    setIsTransitioning(true);
    setCurrentIndex(newIndex);
    
    // Start preloading the next set of images
    preloadAdjacentImages(newIndex);

    // Reset transition state after animation
    setTimeout(() => {
      setIsTransitioning(false);
    }, 1000); // Match this with your CSS transition duration
  };

  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newIndex = (currentIndex - 1 + images.length) % images.length;
    handleImageChange(newIndex);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newIndex = (currentIndex + 1) % images.length;
    handleImageChange(newIndex);
  };

  // Modify the automatic slideshow interval
  useEffect(() => {
    if (!isOpen || !loadedImages.has(currentIndex)) return;

    const interval = setInterval(() => {
      const newIndex = isRandom
        ? Math.floor(Math.random() * images.length)
        : (currentIndex + 1) % images.length;
      
      handleImageChange(newIndex);
    }, 10000);

    return () => clearInterval(interval);
  }, [isOpen, images.length, loadedImages, isRandom, currentIndex]);

  const playTrack = async (index: number, retryCount = 0) => {
    if (!audioRef.current || retryCount > 3) return;
    
    try {
      const audio = audioRef.current;
      audio.src = musicTracks[index];
      
      // Wait for the audio to be loaded
      await new Promise((resolve, reject) => {
        audio.onloadeddata = resolve;
        audio.onerror = reject;
        audio.load();
      });

      audio.volume = 0.2;
      await audio.play();
      isPlayingRef.current = true;
    } catch (error) {
      console.log('Audio playback failed:', error);
      isPlayingRef.current = false;

      // If loading failed, try the next track
      if (retryCount === 0) {
        const nextIndex = (index + 1) % musicTracks.length;
        setCurrentMusicIndex(nextIndex);
        await playTrack(nextIndex, retryCount + 1);
      }
    }
  };

  const handleMusicEnd = () => {
    if (!isPlayingRef.current) return;
    const nextIndex = (currentMusicIndex + 1) % musicTracks.length;
    setCurrentMusicIndex(nextIndex);
  };

  // Effect to handle track changes
  useEffect(() => {
    let mounted = true;

    if (!isOpen) return;

    const initializeTrack = async () => {
      if (mounted) {
        await playTrack(currentMusicIndex);
      }
    };

    initializeTrack();

    return () => {
      mounted = false;
    };
  }, [currentMusicIndex, isOpen]);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (audioRef.current) {
      const newMutedState = !audioRef.current.muted;
      audioRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
    }
  };

  // Initial setup effect
  useEffect(() => {
    if (!isOpen) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        isPlayingRef.current = false;
      }
      return;
    }

    // Start playing the first track
    if (!isPlayingRef.current) {
      playTrack(currentMusicIndex);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        isPlayingRef.current = false;
      }
    };
  }, [isOpen]);

  const toggleRandom = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRandom(!isRandom);
  };

  const toggleFullscreen = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!document.fullscreenElement) {
      await slideshowRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handleChangeTrack = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextIndex = (currentMusicIndex + 1) % musicTracks.length;
    setCurrentMusicIndex(nextIndex);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black z-[100] flex items-center justify-center"
      onClick={onClose}
    >
      <audio
        ref={audioRef}
        preload="auto"
        onEnded={handleMusicEnd}
        onError={() => {
          console.log('Audio error occurred, trying next track');
          handleMusicEnd();
        }}
        onLoadedData={() => {
          if (audioRef.current) {
            audioRef.current.volume = 0.2;
          }
        }}
      />

      {!loadedImages.has(currentIndex) ? (
        <div className="text-center">
          <h2 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold mb-4 animate-fade-in">
            Rest In Peace, Larry!
          </h2>
          <div className="text-gray-300 text-lg md:text-xl animate-pulse">
            Loading memories...
          </div>
        </div>
      ) : (
        <div 
          ref={slideshowRef}
          className={`relative w-full h-full flex items-center justify-center ${isFullscreen ? 'bg-black' : ''}`}
          onClick={e => e.stopPropagation()}
        >
          {!isFullscreen && (
            <>
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

              <div className="absolute bottom-6 left-6 z-[110]">
                <button
                  onClick={handleChangeTrack}
                  className="flex items-center gap-1 bg-white rounded-full px-4 py-1.5 text-black text-sm hover:bg-gray-100 transition-colors"
                >
                  <MdOutlineMusicNote className="md:text-2xl text-xl" />
                  <span className='md:text-sm text-xs'>Change Track</span>
                </button>
              </div>

              <button
                onClick={toggleFullscreen}
                className="absolute top-7 right-20 text-white hover:text-gray-300 transition-colors z-[1100] cursor-pointer"
              >
                {isFullscreen ? (
                  <RiFullscreenExitFill className="text-3xl text-white" />
                ) : (
                  <RiFullscreenFill className="text-3xl text-white" />
                )}
              </button>
              <button
                onClick={onClose}
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
            </>
          )}

          <div className="relative w-[95%] h-[98%] p-20">
            {loadedImages.has(currentIndex) ? (
              <Image
                key={currentIndex}
                src={images[currentIndex].imageUrl}
                alt={images[currentIndex].caption}
                fill
                className={`object-contain transition-opacity duration-1000 ${
                  isTransitioning ? 'opacity-0' : 'opacity-100'
                }`}
                quality={75}
                priority
                sizes="(max-width: 768px) 100vw, 75vw"
                loading="eager"
                unoptimized
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white text-xl animate-pulse flex items-center gap-2">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Loading...
                </div>
              </div>
            )}
            
            {!isFullscreen && loadedImages.has(currentIndex) && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white lg:mx-28 mx-4 p-4 pb-6 text-center">
                <p className="font-roboto-condensed lg:text-base text-sm">{images[currentIndex].caption}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 