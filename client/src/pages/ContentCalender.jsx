import React, { useState, useContext } from 'react';
import { ThemeContext } from '../ThemeContext';

const ContentCalendar = () => {
  const [viewMode, setViewMode] = useState('Month');
  const { theme } = useContext(ThemeContext);
  
  // Calendar data
  const calendarEvents = [
    { id: 1, title: 'Weekly Tips', platform: 'Instagram', date: '30', time: '10:00 AM', color: 'bg-blue-100' },
    { id: 2, title: 'Team Spotlight', platform: 'YouTube', date: '31', time: '9:00 AM', color: 'bg-yellow-100' },
    { id: 3, title: 'Customer Story', platform: 'YouTube', date: '1', time: '3:30 PM', color: 'bg-pink-100' },
    { id: 4, title: 'Industry News', platform: 'Bluesky', date: '2', time: '11:00 AM', color: 'bg-green-100' },
    { id: 5, title: 'Quick Poll', platform: 'Bluesky', date: '3', time: '4:15 PM', color: 'bg-purple-100' },
    { id: 6, title: 'Product Launch', platform: 'YouTube', date: '5', time: '2:00 PM', color: 'bg-blue-100' },
    { id: 7, title: 'Case Study', platform: 'YouTube', date: '7', time: '1:00 PM', color: 'bg-indigo-100' },
    { id: 8, title: 'Product Demo', platform: 'Bluesky', date: '8', time: '2:00 PM', color: 'bg-blue-100' },
    { id: 9, title: 'Testimonial', platform: 'Instagram', date: '10', time: '11:30 AM', color: 'bg-yellow-100' },
    { id: 10, title: 'Live Stream', platform: 'YouTube', date: '12', time: '3:00 PM', color: 'bg-red-100' },
    { id: 11, title: 'Weekly Tips', platform: 'Instagram', date: '13', time: '10:00 AM', color: 'bg-blue-100' },
    { id: 12, title: 'How-To Guide', platform: 'Bluesky', date: '14', time: '2:30 PM', color: 'bg-green-100' },
    { id: 13, title: 'Q&A Session', platform: 'YouTube', date: '18', time: '4:30 PM', color: 'bg-indigo-100' },
    { id: 14, title: 'Weekly Tips', platform: 'Instagram', date: '20', time: '10:00 AM', color: 'bg-blue-100' },
    { id: 15, title: 'New Feature', platform: 'YouTube', date: '22', time: '1:15 PM', color: 'bg-pink-100' }
  ];

  // AI suggested slots
  const aiSlots = [16, 17, 19, 26];
  
  // Calendar days
  const days = [
    [30, 31, 1, 2, 3, 4, 5],
    [6, 7, 8, 9, 10, 11, 12],
    [13, 14, 15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24, 25, 26],
    [27, 28, 29, 30, 1, 2, 3]
  ];
  
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  // Get events for a specific day
  const getEventsForDay = (day) => {
    return calendarEvents.filter(event => event.date === day.toString());
  };
  
  // Check if day has AI recommendation
  const hasAiRecommendation = (day) => {
    return aiSlots.includes(day);
  };

  return (
    <div className={`w-full ml-72 rounded-lg p-6 ${theme === 'dark' ? 'bg-blue-900/20' : 'bg-white'}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-black' : 'text-gray-800'}`}>Content Calendar</h1>
        <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>April 2025</div>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-2">
          <button 
            className={`px-6 py-2 rounded-full text-sm ${
              viewMode === 'Month' 
                ? 'bg-indigo-500 text-white' 
                : theme === 'dark' 
                  ? 'bg-gray-700 text-white' 
                  : 'bg-gray-100 text-gray-700'
            }`}
            onClick={() => setViewMode('Month')}
          >
            Month
          </button>
          <button 
            className={`px-6 py-2 rounded-full text-sm ${
              viewMode === 'Week' 
                ? 'bg-indigo-500 text-white' 
                : theme === 'dark' 
                  ? 'bg-gray-700 text-white' 
                  : 'bg-gray-100 text-gray-700'
            }`}
            onClick={() => setViewMode('Week')}
          >
            Week
          </button>
          <button 
            className={`px-6 py-2 rounded-full text-sm ${
              viewMode === 'Day' 
                ? 'bg-indigo-500 text-white' 
                : theme === 'dark' 
                  ? 'bg-gray-700 text-white' 
                  : 'bg-gray-100 text-gray-700'
            }`}
            onClick={() => setViewMode('Day')}
          >
            Day
          </button>
        </div>
        
        <div className="flex items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search events..."
              className={`pl-3 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200 text-sm ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-200 text-black'
              }`}
            />
            <div className={`absolute right-3 top-2.5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-400'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <button className="ml-4 px-4 py-2 bg-indigo-500 text-white rounded-md flex items-center text-sm">
            <span className="mr-1">+</span> NewPost
          </button>
        </div>
      </div>
      
      <div className="flex mb-6 space-x-2">
        <div className={`flex items-center px-4 py-2 rounded-md ${
          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
        }`}>
          <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>All Platforms</span>
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ml-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
        
        <div className={`flex items-center px-4 py-2 rounded-md ${
          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
        }`}>
          <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>All Categories</span>
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ml-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
        
        <div className={`flex items-center px-4 py-2 rounded-md ${
          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
        }`}>
          <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>All Status</span>
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ml-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <button className={`p-1 rounded-full ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button className={`px-4 py-1 text-sm rounded-md ${
          theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-700'
        }`}>Today</button>
        
        <button className={`p-1 rounded-full ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      <div className={`border rounded-lg overflow-hidden ${theme === 'dark' ? 'border-gray-700' : ''}`}>
        <div className={`grid grid-cols-7 border-b ${theme === 'dark' ? 'border-gray-700' : ''}`}>
          {daysOfWeek.map((day, index) => (
            <div key={index} className={`p-3 text-sm text-center font-medium border-r last:border-r-0 ${
              theme === 'dark' 
                ? 'text-gray-300 border-gray-700' 
                : 'text-gray-700'
            }`}>
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7">
          {days.map((week, weekIndex) => (
            <React.Fragment key={weekIndex}>
              {week.map((day, dayIndex) => {
                const events = getEventsForDay(day);
                const hasAiRec = hasAiRecommendation(day);
                const isHighlighted = day === 5;
                
                return (
                  <div 
                    key={`${weekIndex}-${dayIndex}`} 
                    className={`min-h-32 p-2 border-r border-b last:border-r-0 relative ${
                      theme === 'dark' 
                        ? 'border-gray-700 ' + ((weekIndex === 0 && day > 7) || (weekIndex === 4 && day < 7) ? 'bg-gray-800' : 'bg-gray-900/50') 
                        : (weekIndex === 0 && day > 7) || (weekIndex === 4 && day < 7) ? 'bg-gray-50' : 'bg-white'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className={`text-sm ${
                        isHighlighted 
                          ? 'h-6 w-6 rounded-full bg-indigo-500 text-black flex items-center justify-center' 
                          : theme === 'dark' ? 'text-gray-300' : 'text-gray-70'
                      }`}>
                        {day}
                      </span>
                      
                      {hasAiRec && (
                        <div className={`flex items-center justify-center h-5 w-5 rounded-full ${
                          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                        }`}>
                          <span className="text-indigo-500 text-xs">+</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-1 space-y-1">
                      {events.map(event => (
                        <div key={event.id} className={`${event.color} px-2 py-1 rounded text-xs ${
                          theme === 'dark' ? 'bg-opacity-30 text-black' : ''
                        }`}>
                          <div className="font-medium">{event.title}</div>
                          <div className={theme === 'dark' ? 'text-black text-xs' : 'text-gray-600 text-xs'}>{event.time}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
      
      <div className="flex mt-4 space-x-6 text-xs">
        <div className="flex items-center">
          <div className="h-3 w-3 rounded-full bg-pink-500 mr-2"></div>
          <span>Instagram</span>
        </div>
        <div className="flex items-center">
          <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
          <span>YouTube</span>
        </div>
        <div className="flex items-center">
          <div className="h-3 w-3 rounded-full bg-blue-500 mr-2"></div>
          <span>Bluesky</span>
        </div>
        <div className="flex items-center">
          <div className={`h-3 w-3 rounded-full mr-2 flex items-center justify-center ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
          }`}>
            <span className="text-indigo-500 text-xs">+</span>
          </div>
          <span>AI Recommended Slots</span>
        </div>
      </div>
    </div>
  );
};

export default ContentCalendar;