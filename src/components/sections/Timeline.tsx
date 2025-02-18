'use client';

import { useState } from 'react';
import { 
  LocationOn, 
} from '@mui/icons-material';

interface TimelineEvent {
  _id: string;
  year: number;
  month: string;
  day?: number;
  title: string;
  description?: string;
  location?: string;
  type: 'birth' | 'education' | 'meeting' | 'wedding' | 'child';
}

const timelineData: TimelineEvent[] = [
  {
    _id: '1',
    year: 1965,
    month: 'December',
    day: 13,
    title: '',
    description: 'A bright soul was born, destined to leave a lasting impact.',
    type: 'birth'
  },
  {
    _id: '2',
    year: 1984,
    month: '',
    title: '',
    description: 'Graduated from <strong>SRHS</strong>, ready to take on the world.',
    type: 'education'
  },
  {
    _id: '3',
    year: 1985,
    month: '',
    title: '',
    description: 'Joined <strong>Wasted Morality</strong>, channeling his passion for music.',
    type: 'meeting'
  },
  {
    _id: '4',
    year: 1990,
    month: '',
    title: '',
    description: 'Became a managing partner and singer for <strong>The Bleeding Stone</strong>, sharing his voice and heart.',
    type: 'wedding'
  },
  {
    _id: '5',
    year: 2006,
    month: 'May',
    day: 27,
    title: '',
    description: '<strong>Married</strong> the love of his life in <strong>Las Vegas</strong>, beginning a journey of love and adventure.',
    type: 'wedding'
  },
  {
    _id: '6',
    year: 2008,
    month: 'April',
    title: '',
    description: 'Welcomed <strong>Elljay</strong>, embracing the joy of fatherhood.',
    type: 'child'
  },
  {
    _id: '7',
    year: 2008,
    month: '',
    title: '',
    description: 'Founded <strong>Jenner Headlands Hawkwatch</strong>, dedicating himself to conservation.',
    type: 'education'
  },
  {
    _id: '8',
    year: 2009,
    month: 'July',
    title: '',
    description: 'Celebrated the birth of <strong>Preston</strong>, filling his world with more love.',
    type: 'child'
  },
  {
    _id: '9',
    year: 2011,
    month: 'June',
    day: 12,
    title: '',
    description: 'Renewed vows in a <strong>Cambodian wedding</strong>, honoring love and tradition.',
    type: 'wedding'
  },
  {
    _id: '10',
    year: 2011,
    month: '',
    title: '',
    description: 'Earned his <strong>Wildlands Conservation & Management</strong> certification at <strong>SRJC</strong>.',
    type: 'education'
  },
  {
    _id: '11',
    year: 2012,
    month: '',
    title: '',
    description: 'Welcomed <strong>Tyler</strong>, completing his beautiful family.',
    type: 'child'
  },
  {
    _id: '12',
    year: 2019,
    month: 'December',
    title: '',
    description: 'Discovered the beauty of <strong>Maui</strong> on his first island adventure.',
    type: 'meeting'
  },
  {
    _id: '13',
    year: 2024,
    month: 'June',
    title: '',
    description: 'Made priceless memories on a <strong>Disney World family vacation.</strong> ',
    type: 'meeting'
  },
  {
    _id: '14',
    year: 2024,
    month: '',
    title: '',
    description: 'Took his final flight, soaring into the great beyond, leaving behind a legacy of love, music, and passion that will forever echo in the hearts of those who knew him.',
    type: 'birth'
  }
];



export default function Timeline() {
  const [events] = useState<TimelineEvent[]>(timelineData);

  return (
    <section id="timeline" className="pt-10 pb-16 font-inter">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-roboto-condensed mb-1">Timeline</h2>
        <div className="h-1 w-[70px] bg-primary mb-8"></div>
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute md:left-[3.5rem] left-[3rem] top-3 bottom-3 w-[1.5px] bg-primary"></div>

          {/* Timeline Events */}
          <div className="space-y-5">
            {events.map((event) => (
              <div key={event._id} className="relative flex items-center gap-6 group">
                {/* Year Circle with Icon */}
                <div className="relative">
                  <div className="md:w-28 md:h-28 w-24 h-24 rounded-full bg-white shadow-md flex flex-col items-center justify-center z-10 relative">
                    <p className="text-primary font-semibold md:text-xl text-lg">
                      {event.year}
                    </p>
                    {event.month && (
                      <div className="text-gray-500 text-[11px] md:text-sm">
                        {event.month} {event.day && <span>{event.day}</span>}
                        <sup className="text-[8px] md:text-xs"></sup>
                      </div>
                    )}
                  </div>
                  {/* Event Icon */}
                </div>

                 
                {/* Content Card */}
                <div className="flex-1 relative">
                  <div className="absolute left-0 top-1/2 -translate-x-[60%] -translate-y-1/2 flex items-center">
                    
                    <div className="absolute left-[calc(100%-8px)] top-1/2 -translate-y-1/2 w-6 h-6 z-10 bg-primary transform rotate-45 shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]"></div>
                  </div>
                  {/* Left Arrow with Icon */}

                  <div className='flex-1 flex flex-col justify-center border-l-4 border-primary bg-white rounded-lg shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] md:p-4 p-3 ml-0 min-h-24 transform transition-transform duration-300 hover:-translate-y-1 relative z-20'>
                    
                    {event.description && (
                      <p  className="text-gray-600 mb-3 md:text-base text-sm text-left">
                        <span dangerouslySetInnerHTML={{ __html: event.description }} />
                      </p>
                    )}
                    {event.location && (
                      <div className="flex items-center gap-1 text-gray-500 justify-center">
                        <LocationOn className="text-gray-400" fontSize="small" />
                        <p className="text-base font-inter" >
                          {event.location}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
