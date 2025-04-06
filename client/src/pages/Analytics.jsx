import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ThemeContext } from '../ThemeContext';

const Analytics = () => {
  // Sample data for charts
  const audienceData = [
    { day: 1, followers: 22100 },
    { day: 5, followers: 22300 },
    { day: 10, followers: 22800 },
    { day: 15, followers: 23200 },
    { day: 20, followers: 23800 },
    { day: 25, followers: 24200 },
    { day: 30, followers: 24568 }
  ];
  const {theme} = useContext(ThemeContext)
  
  const contentData = [
    { type: 'Photos', views: 2800 },
    { type: 'Reels', views: 3200 },
    { type: 'Stories', views: 1800 },
    { type: 'Carousel', views: 3400 },
    { type: 'IGTV', views: 2400 },
    { type: 'Guides', views: 2900 }
  ];
  
  const sentimentData = [
    { name: 'Positive', value: 80, color: '#10B981' },
    { name: 'Neutral', value: 30, color: '#F59E0B' },
    { name: 'Negative', value: 10, color: '#EF4444' }
  ];

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <div className={`p-8 rounded-lg ml-82 shadow-sm max-w-6xl mx-auto min-h-screen ${theme === 'dark' ? 'bg-blue-900/20 text-white' : 'bg-white text-black'}`}>
    <motion.div
      className="p-6" // Removed 'ml-64'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <div className="flex space-x-2">
          <motion.button 
            className="bg-indigo-600 text-white px-4 py-2 rounded-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Instagram
          </motion.button>
          <motion.button 
            className={`${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'} px-4 py-2 rounded-md`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            YouTube
          </motion.button>
          <motion.button 
            className={`${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'} px-4 py-2 rounded-md`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Bluesky
          </motion.button>
          <div className="ml-4 flex items-center space-x-2">
            <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Last 30 Days</span>
            <motion.button 
              className={`${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-600'} px-4 py-2 rounded-md ml-4`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Export
            </motion.button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <motion.div 
        className="grid grid-cols-4 gap-6 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <motion.div
          className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'} p-4 rounded-lg shadow-md`}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <h3 className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} text-sm font-medium mb-1`}>Total Followers</h3>
          <div className="flex items-baseline">
            <p className="text-2xl font-bold">24,568</p>
            <span className="ml-2 text-green-500 text-sm font-medium">+5.2%</span>
          </div>
          <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mt-1`}>INSTAGRAM</p>
        </motion.div>

        <motion.div
          className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'} p-4 rounded-lg shadow-md`}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <h3 className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} text-sm font-medium mb-1`}>Engagement Rate</h3>
          <div className="flex items-baseline">
            <p className="text-2xl font-bold">4.7%</p>
            <span className="ml-2 text-green-500 text-sm font-medium">+0.8%</span>
          </div>
        </motion.div>

        <motion.div
          className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'} p-4 rounded-lg shadow-md`}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <h3 className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} text-sm font-medium mb-1`}>Reach</h3>
          <div className="flex items-baseline">
            <p className="text-2xl font-bold">152.3K</p>
            <span className="ml-2 text-green-500 text-sm font-medium">+12.4%</span>
          </div>
        </motion.div>

        <motion.div
          className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'} p-4 rounded-lg shadow-md`}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <h3 className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} text-sm font-medium mb-1`}>Impressions</h3>
          <div className="flex items-baseline">
            <p className="text-2xl font-bold">312.8K</p>
            <span className="ml-2 text-red-500 text-sm font-medium">-3.1%</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <motion.div
          className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'} p-4 rounded-lg shadow-md`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="font-bold mb-4">Audience Growth</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={audienceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#374151' : '#E5E7EB'} />
                <XAxis dataKey="day" tickLine={false} stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'} />
                <YAxis 
                  domain={['dataMin - 500', 'dataMax + 500']} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(value) => `${value / 1000}k`}
                  stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
                />
                <Tooltip contentStyle={theme === 'dark' ? { backgroundColor: '#1F2937', borderColor: '#374151', color: 'white' } : {}} />
                <Line 
                  type="monotone" 
                  dataKey="followers" 
                  stroke="#6366F1" 
                  strokeWidth={2}
                  dot={{ r: 3, fill: "#6366F1" }}
                  activeDot={{ r: 5 }}
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'} p-4 rounded-lg shadow-md`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3 className="font-bold mb-4">Content Performance</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={contentData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#374151' : '#E5E7EB'} />
                <XAxis dataKey="type" tickLine={false} stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'} />
                <YAxis tickLine={false} axisLine={false} stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'} />
                <Tooltip contentStyle={theme === 'dark' ? { backgroundColor: '#1F2937', borderColor: '#374151', color: 'white' } : {}} />
                <Bar 
                  dataKey="views" 
                  fill={theme === 'dark' ? '#6366F1' : '#A5B4FC'} 
                  radius={[4, 4, 0, 0]}
                  animationDuration={1500}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <motion.div
          className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'} p-4 rounded-lg shadow-md`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="font-bold mb-4">Sentiment Analysis</h3>
          <div className="h-64 flex items-center">
            <div className="w-1/2">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={sentimentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={0}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    animationDuration={1500}
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={theme === 'dark' ? { backgroundColor: '#1F2937', borderColor: '#374151', color: 'white' } : {}} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2">
              {sentimentData.map((item, index) => (
                <div key={index} className="flex items-center mb-2">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                  <span>{item.name} ({item.value}%)</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'} p-4 rounded-lg shadow-md`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h3 className="font-bold mb-4">Top Performing Content</h3>
          <div className="space-y-4 p-1">
            {[
              { name: 'Product Showcase Reel', likes: '8.2K Likes' },
              { name: 'Customer Testimonial', likes: '6.5K Likes' },
              { name: 'Behind the Scenes', likes: '5.4K Likes' }
            ].map((item, index) => (
              <motion.div 
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg border ${theme === 'dark' ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-100 hover:bg-gray-50'}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.6 + (index * 0.1) }}
                whileHover={{ backgroundColor: theme === 'dark' ? '#374151' : '#F9FAFB' }}
              >
                <div className="flex items-center">
                  <div className="w-3 h-12 bg-pink-500 rounded-md mr-3"></div>
                  <span>{item.name}</span>
                </div>
                <span className="font-medium">{item.likes}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Cards */}
      <motion.div 
        className="grid grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <motion.div
          className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'} p-4 rounded-lg shadow-md`}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <h3 className="font-bold mb-2">Best Posting Time</h3>
          <p>Wednesdays @ 7:00 PM</p>
        </motion.div>

        <motion.div
          className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'} p-4 rounded-lg shadow-md`}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <h3 className="font-bold mb-2">Top Hashtag</h3>
          <p>#productlaunch (+255%)</p>
        </motion.div>

        <motion.div
          className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'} p-4 rounded-lg shadow-md`}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <h3 className="font-bold mb-2">Top Demographic</h3>
          <p>Women, 25-34, US</p>
        </motion.div>

        <motion.div
          className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'} p-4 rounded-lg shadow-md`}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <h3 className="font-bold mb-2 text-indigo-600">AI Recommendation</h3>
          <p>Create more carousel posts</p>
        </motion.div>
      </motion.div>
    </motion.div>
    </div>
  );
};

export default Analytics;