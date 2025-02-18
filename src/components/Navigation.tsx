'use client';

import { IoImage } from 'react-icons/io5';
import { MdNotificationAdd, MdOutlineMenuBook, MdOutlineMessage } from 'react-icons/md';
import { TbTimelineEventMinus } from 'react-icons/tb';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    id: 'obituary',
    label: 'Obituary',
    icon: <MdOutlineMenuBook className="md:text-2xl text-xl" />,
  },
  {
    id: 'timeline',
    label: 'Timeline',
    icon: <TbTimelineEventMinus className="md:text-2xl text-xl" />,
  },
  {
    id: 'memory-wall',
    label: 'Memory Wall',
    icon: <MdOutlineMessage className="md:text-2xl text-xl" />,
  },
  {
    id: 'notice',
    label: 'Notices',
    icon: <MdNotificationAdd className="md:text-2xl text-xl" />,
  },
  {
    id: 'gallery',
    label: 'Gallery',
    icon: <IoImage className="md:text-2xl text-xl" />,
  },
];

export default function Navigation() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerHeight = 140; // Combined height of sticky header and navigation
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav className="py-1.5 md:py-2 sticky top-[60px] mt-10 z-40 w-full shadow-lg rounded-xl bg-white">
      <div className="container mx-auto px-4 overflow-x-auto scrollbar-hide">
        <ul className="flex justify-start md:justify-center items-center w-max md:w-full mx-auto px-4 md:px-20 py-2 rounded-lg gap-12 md:gap-28">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => scrollToSection(item.id)}
                className="flex flex-col items-center gap-1 md:gap-1 group text-primary transition-colors whitespace-nowrap"
              >
                <span className='group-hover:scale-110 transition-all duration-300 group-hover:animate-bounce'>{item.icon}</span>
                <span className="text-xs md:text-sm font-medium text-secondary">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
