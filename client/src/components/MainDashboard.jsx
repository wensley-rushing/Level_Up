import React from 'react';

const Dashboard = () => {
  return (
    <div className="bg-gray-50 p-6 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
          <p className="text-sm text-gray-500">Saturday, April 6, 2025</p>
        </div>
        <div className="flex items-center">
          <div className="relative mr-4">
            <input 
              type="text" 
              placeholder="Search..." 
              className="py-2 px-4 pr-10 rounded-full bg-gray-100 text-sm w-64"
            />
            <div className="absolute right-3 top-2.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
          </div>
          <button className="p-2 bg-gray-200 rounded-md mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
              <line x1="8" y1="6" x2="21" y2="6"></line>
              <line x1="8" y1="12" x2="21" y2="12"></line>
              <line x1="8" y1="18" x2="21" y2="18"></line>
              <line x1="3" y1="6" x2="3.01" y2="6"></line>
              <line x1="3" y1="12" x2="3.01" y2="12"></line>
              <line x1="3" y1="18" x2="3.01" y2="18"></line>
            </svg>
          </button>
          <button className="p-2 bg-indigo-500 text-white rounded-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Followers */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="h-1 bg-indigo-500 rounded-full w-full mb-4"></div>
          <p className="text-sm text-gray-600 mb-1">Total Followers</p>
          <h2 className="text-2xl font-bold mb-1">124,853</h2>
          <p className="text-xs text-green-500">+2.4% from last week</p>
        </div>

        {/* Engagement Rate */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="h-1 bg-green-500 rounded-full w-full mb-4"></div>
          <p className="text-sm text-gray-600 mb-1">Engagement Rate</p>
          <h2 className="text-2xl font-bold mb-1">5.2%</h2>
          <p className="text-xs text-green-500">+0.8% from last week</p>
        </div>

        {/* Scheduled Posts */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="h-1 bg-orange-500 rounded-full w-full mb-4"></div>
          <p className="text-sm text-gray-600 mb-1">Scheduled Posts</p>
          <h2 className="text-2xl font-bold mb-1">17</h2>
          <p className="text-xs text-gray-500">Next 7 days</p>
        </div>

        {/* Sentiment Score */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="h-1 bg-pink-500 rounded-full w-full mb-4"></div>
          <p className="text-sm text-gray-600 mb-1">Sentiment Score</p>
          <h2 className="text-2xl font-bold mb-1">8.7/10</h2>
          <p className="text-xs text-green-500">Mostly positive</p>
        </div>
      </div>

      {/* Charts and Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Audience Growth Chart */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="font-medium text-gray-700 mb-4">Audience Growth</h3>
          <div className="h-64 relative">
            {/* SVG Placeholder for Chart */}
            <svg viewBox="0 0 400 200" className="w-full h-full">
              {/* Blue Line (Instagram) */}
              <path d="M 20,180 L 40,160 L 60,165 L 80,150 L 100,140 L 120,130 L 140,100 L 160,105 L 180,90 L 200,80 L 220,75 L 240,60 L 260,50 L 280,40 L 300,35 L 320,30 L 340,20 L 360,15" 
                fill="none" stroke="#4F46E5" strokeWidth="3" />
              
              {/* Green Line (YouTube) */}
              <path d="M 20,170 L 40,175 L 60,160 L 80,165 L 100,155 L 120,150 L 140,145 L 160,140 L 180,130 L 200,125 L 220,120 L 240,110 L 260,105 L 280,95 L 300,90 L 320,85 L 340,75 L 360,70" 
                fill="none" stroke="#10B981" strokeWidth="3" />
            </svg>

            {/* Legend */}
            <div className="absolute bottom-0 left-0 flex items-center space-x-6">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-indigo-500 mr-2"></div>
                <span className="text-xs text-gray-600">Instagram</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-xs text-gray-600">YouTube</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Performing Content */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="font-medium text-gray-700 mb-4">Top Performing Content</h3>
          <div className="space-y-4">
            <div className="border-b pb-3">
              <h4 className="font-medium text-gray-800">10 Tips for Better Social Media...</h4>
              <p className="text-xs text-gray-500">Instagram • 2.4K Likes • 142 Comments</p>
            </div>
            <div className="border-b pb-3">
              <h4 className="font-medium text-gray-800">Behind the Scenes: Our Process</h4>
              <p className="text-xs text-gray-500">YouTube • 5.8K Views • 89 Comments</p>
            </div>
            <div className="pb-3">
              <h4 className="font-medium text-gray-800">Industry News Roundup #42</h4>
              <p className="text-xs text-gray-500">Bluesky • 976 Likes • 52 Comments</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Posts */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="font-medium text-gray-700 mb-4">Upcoming Posts</h3>
          <div className="space-y-2">
            <div className="flex mb-2">
              <div className="bg-indigo-100 rounded-md p-2 w-full mr-2">
                <h4 className="font-medium text-sm text-gray-800">Product Launch</h4>
                <p className="text-xs text-gray-500">Today, 2:00 PM</p>
              </div>
              <div className="bg-yellow-100 rounded-md p-2 w-full">
                <h4 className="font-medium text-sm text-gray-800">Team Spotlight</h4>
                <p className="text-xs text-gray-500">Apr 7, 9:00 AM</p>
              </div>
            </div>
            <div className="flex mb-2">
              <div className="bg-blue-100 rounded-md p-2 w-full mr-2">
                <h4 className="font-medium text-sm text-gray-800">Weekly Tips</h4>
                <p className="text-xs text-gray-500">Tomorrow, 10:00 AM</p>
              </div>
              <div className="bg-red-100 rounded-md p-2 w-full">
                <h4 className="font-medium text-sm text-gray-800">Customer Story</h4>
                <p className="text-xs text-gray-500">Apr 8, 2:30 PM</p>
              </div>
            </div>
            <div className="flex">
              <div className="bg-green-100 rounded-md p-2 w-full mr-2">
                <h4 className="font-medium text-sm text-gray-800">Industry News</h4>
                <p className="text-xs text-gray-500">Apr 9, 11:00 AM</p>
              </div>
              <div className="bg-blue-100 rounded-md p-2 w-full">
                <h4 className="font-medium text-sm text-gray-800">Quick Poll</h4>
                <p className="text-xs text-gray-500">Apr 10, 4:15 PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Audience Sentiment */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="font-medium text-gray-700 mb-4">Audience Sentiment</h3>
          <div className="flex justify-center">
            {/* SVG for Pie Chart */}
            <svg width="180" height="180" viewBox="0 0 100 100">
              {/* Pie slices */}
              <circle r="25" cx="50" cy="50" fill="white" />
              
              {/* Slices - Using stroke-dasharray to create pie segments */}
              <circle 
                r="40" 
                cx="50" 
                cy="50" 
                fill="transparent"
                stroke="#10B981" 
                strokeWidth="20" 
                strokeDasharray="75.4 157.1" 
                transform="rotate(-90 50 50)"
              />
              <circle 
                r="40" 
                cx="50" 
                cy="50" 
                fill="transparent"
                stroke="#3B82F6" 
                strokeWidth="20" 
                strokeDasharray="37.7 157.1" 
                strokeDashoffset="-75.4"
                transform="rotate(-90 50 50)"
              />
              <circle 
                r="40" 
                cx="50" 
                cy="50" 
                fill="transparent"
                stroke="#F59E0B" 
                strokeWidth="20" 
                strokeDasharray="25.1 157.1" 
                strokeDashoffset="-113.1"
                transform="rotate(-90 50 50)"
              />
              <circle 
                r="40" 
                cx="50" 
                cy="50" 
                fill="transparent"
                stroke="#EF4444" 
                strokeWidth="20" 
                strokeDasharray="18.8 157.1" 
                strokeDashoffset="-138.2"
                transform="rotate(-90 50 50)"
              />
            </svg>
          </div>
          
          {/* Legend */}
          <div className="flex flex-wrap justify-center mt-4">
            <div className="flex items-center mx-2">
              <div className="w-3 h-3 bg-green-500 mr-1"></div>
              <span className="text-xs">Positive (48%)</span>
            </div>
            <div className="flex items-center mx-2">
              <div className="w-3 h-3 bg-blue-500 mr-1"></div>
              <span className="text-xs">Questions (6%)</span>
            </div>
            <div className="flex items-center mx-2">
              <div className="w-3 h-3 bg-yellow-500 mr-1"></div>
              <span className="text-xs">Neutral (24%)</span>
            </div>
            <div className="flex items-center mx-2">
              <div className="w-3 h-3 bg-red-500 mr-1"></div>
              <span className="text-xs">Negative (12%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;