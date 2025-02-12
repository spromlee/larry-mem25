'use client';

import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import profileImage from '@/assets/ProfileImage.jpg';
import coverImg from '@/assets/coverImg.jpg';
import { BsCalendar2Heart } from 'react-icons/bs';
import { GrLocation } from 'react-icons/gr';

export default function Header() {
  const [isSticky, setIsSticky] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (profileRef.current) {
        const profileRect = profileRef.current.getBoundingClientRect();
        setIsSticky(profileRect.top <= 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="w-full">
      {/* Cover Image Section - Not Sticky */}
      <div className="relative w-full h-[25vh] lg:h-[40vh]">
        <Image
          src={coverImg}
          alt="White rose background"
          fill
          style={{ objectFit: 'cover' }}
          priority
          className="brightness-100 shadow-[0_3px_10px_rgb(0,0,0,0.2)]"
        />
      </div>

      {/* Profile Section */}
      <div ref={profileRef}>
        <div className={`container mx-auto px-4 transition-all duration-300 ${isSticky ? 'opacity-0 invisible' : 'opacity-100 visible'}`}>
          <div className="relative -mt-[70px] lg:-mt-[40px]">
            <div className="flex flex-col justify-center items-center">
              <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-20">
                {/* Profile Image */}
                <div className="flex-shrink-0 xl:w-[330px] xl:h-[330px] lg:w-[290px] lg:h-[290px] w-[250px] h-[250px] mx-auto lg:mx-0 relative mb-4 lg:mb-0">
                  <Image
                    src={profileImage}
                    alt="David I. Campbell"
                    fill
                    className="rounded-md lg:rounded-lg border-[6px] border-white shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] object-cover"
                  />
                </div>

                {/* Name and Details */}
                <div className="text-center lg:text-left self-end">
                  <h1 className="text-[40px] font-playfair-display font-normal text-[#2D2D2D] tracking-wide">
                   Larry Broderick 
                  </h1>
                  <div className="text-[#666666] mt-1 ">
                    <p className="text-base font-light flex items-center gap-2">
                      <span><BsCalendar2Heart className='text-lg text-primary'/></span>
                      <span>December 13<sup>th</sup>, 1965</span>
                      <span className='text-primary text-xl'>•</span>
                      <span>December 31<sup>st</sup>, 2024</span>
                      
                    </p>
                    <p className="text-base font-light mt-2 flex items-center gap-2"><GrLocation className='text-xl text-primary' /> San Francisco, CA</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Condensed Header */}
      <div
        className={`fixed top-0 left-0 w-full bg-white shadow-md transition-transform duration-600 z-50 ${
          isSticky ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="container mx-auto xl:px-60 lg:px-32 md:px-14 px-4 py-2">
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-12 relative">
              <Image
                src={profileImage}
                alt="David I. Campbell"
                fill
                className="rounded-full object-cover"
              />
            </div>
            <h2 className="text-xl font-playfair-display text-gray-800">Larry Broderick</h2>
          </div>
        </div>
      </div>
    </header>
  );
}
