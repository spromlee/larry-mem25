'use client';

import { useState } from 'react';
import { 
  LocationOn, 
  Cake, 
  School, 
  Favorite, 
  Celebration, 
  ChildCare 
} from '@mui/icons-material';

interface TimelineEvent {
  _id: string;
  year: number;
  month: string;
  day: number;
  title: string;
  description?: string;
  location?: string;
  type: 'birth' | 'education' | 'meeting' | 'wedding' | 'child';
}

const timelineData: TimelineEvent[] = [
  {
    _id: '1',
    year: 1973,
    month: 'March',
    day: 16,
    title: 'Birth in San Jose',
    location: 'San Jose, California',
    type: 'birth'
  },
  {
    _id: '2',
    year: 1982,
    month: 'July',
    day: 1,
    title: 'Graduate from University',
    location: 'University of California - Los Angeles',
    type: 'education'
  },
  {
    _id: '3',
    year: 1984,
    month: 'February',
    day: 14,
    title: 'Met with Anthony',
    description: 'Anthony and Joanne met in a school reunion organized by a common friend. Few years later, they will get married',
    type: 'meeting'
  },
  {
    _id: '4',
    year: 1989,
    month: 'June',
    day: 9,
    title: 'Wedding',
    description: 'Anthony and Joanne got married in a beautiful yet intimate wedding',
    location: 'California',
    type: 'wedding'
  },
  {
    _id: '5',
    year: 1992,
    month: 'October',
    day: 18,
    title: 'Birth of Emily',
    description: 'Birth of Emily, their first child',
    type: 'child'
  },
];

const getEventIcon = (type: TimelineEvent['type']) => {
  switch (type) {
    case 'birth':
      return <Cake className="text-pink-500" />;
    case 'education':
      return <School className="text-blue-500" />;
    case 'meeting':
      return <Favorite className="text-red-500" />;
    case 'wedding':
      return <Celebration className="text-purple-500" />;
    case 'child':
      return <ChildCare className="text-green-500" />;
  }
};

export default function Timeline() {
  const [events, setEvents] = useState<TimelineEvent[]>(timelineData);

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
                    <p className="text-primary font-medium md:text-lg text-base">
                      {event.year}
                    </p>
                    <div className="text-gray-500 text-[11px] md:text-sm">
                      {event.month} {event.day}
                      <sup className="text-[8px] md:text-xs">th</sup>
                    </div>
                  </div>
                  {/* Event Icon */}
                </div>

                 
                {/* Content Card */}
                <div className="flex-1 relative">
                  <div className="absolute left-0 top-1/2 -translate-x-[60%] -translate-y-1/2 flex items-center">
                    
                    <div className="absolute left-[calc(100%-8px)] top-1/2 -translate-y-1/2 w-6 h-6 z-10 bg-white transform rotate-45 shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]"></div>
                  </div>
                  {/* Left Arrow with Icon */}

                  <div className='flex-1 bg-white rounded-lg shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] md:p-4 p-3 ml-0 min-h-28 transform transition-transform duration-300 hover:-translate-y-1 relative z-20'>
                    <h2  className="text-primary mb-2 text-base md:text-lg ">
                      {event.title}
                    </h2>
                    
                    {event.description && (
                      <p  className="text-gray-600 mb-3 md:text-base text-sm">
                        {event.description}
                      </p>
                    )}
                    {event.location && (
                      <div className="flex items-center gap-1 text-gray-500">
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
