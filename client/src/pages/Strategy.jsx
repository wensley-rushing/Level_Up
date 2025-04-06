import { motion } from 'framer-motion';
import React, { useState, useContext } from 'react';
import { ThemeContext } from '../ThemeContext';

const Strategy = () => {
  const [activeTimeframe, setActiveTimeframe] = useState('30 Days');
  const [appliedRecommendations, setAppliedRecommendations] = useState(13);
  const totalRecommendations = 24;
  const [hoveredMonth, setHoveredMonth] = useState(null);
  const [selectedCalendarView, setSelectedCalendarView] = useState('Weekly');
  const { theme } = useContext(ThemeContext);
  
  const timeframes = ['30 Days', '90 Days', 'All Time'];
  const calendarViews = ['Weekly', 'Monthly', 'Quarterly'];
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };
  
  const chartVariants = {
    hidden: { scaleY: 0, originY: 1 },
    visible: i => ({
      scaleY: 1,
      transition: {
        duration: 0.8,
        delay: i * 0.1,
        ease: "easeOut"
      }
    })
  };

  // Platform content
  const platforms = [
    {
      name: 'Instagram',
      color: 'bg-pink-500',
      recommendations: [
        { text: 'Switch to Reels-first Strategy', status: 'yellow' },
        { text: '+42% potential engagement increase', status: 'green' },
        { text: 'Optimize 5 posts per week (currently 3)', status: 'green' },
        { text: 'Trending hashtag groups', status: 'green' }
      ]
    },
    {
      name: 'YouTube',
      color: 'bg-red-500',
      recommendations: [
        { text: 'Optimize video lengths', status: 'red' },
        { text: '12-15 minutes videos perform best in your niche', status: 'red' },
        { text: 'Create topic clusters', status: 'yellow' },
        { text: 'Custom thumbnail strategy', status: 'green' }
      ]
    },
    {
      name: 'Bluesky',
      color: 'bg-blue-500',
      recommendations: [
        { text: 'Engage with creators', status: 'blue' },
        { text: 'Targeted list of 15 tech influencers to connect with', status: 'blue' },
        { text: 'Utilize threads format', status: 'yellow' },
        { text: 'Join emerging communities', status: 'green' }
      ]
    }
  ];

  // Enhanced Content Gap Analysis with more detailed data
  const contentGapBars = [
    { label: 'Tutorials', value: 60, potential: 85, gap: 25 },
    { label: 'Industry', value: 45, potential: 75, gap: 30 },
    { label: 'Reviews', value: 70, potential: 95, gap: 25 },
    { label: 'Tips', value: 35, potential: 80, gap: 45 },
    { label: 'Interview', value: 55, potential: 70, gap: 15 },
    { label: 'Features', value: 40, potential: 85, gap: 45 },
    { label: 'Case', value: 42, potential: 68, gap: 26 },
  ];

  // Generate audience trend data
  const generateTrendData = (count, baseValue, volatility) => {
    let value = baseValue;
    return Array.from({ length: count }, () => {
      value += (Math.random() - 0.5) * volatility;
      return Math.max(10, Math.min(100, value));
    });
  };

  const techNewsData = generateTrendData(12, 65, 15);
  const tutorialsData = generateTrendData(12, 50, 10);
  const reviewsData = generateTrendData(12, 55, 12);

  // Create points for SVG paths
  const createPath = (data) => {
    const width = 300;
    const height = 100;
    const segment = width / (data.length - 1);
    
    return data.map((value, index) => {
      const x = index * segment;
      const y = height - (value / 100 * height);
      return `${x},${y}`;
    }).join(' L ');
  };

  const techNewsPath = `M ${createPath(techNewsData)}`;
  const tutorialsPath = `M ${createPath(tutorialsData)}`;
  const reviewsPath = `M ${createPath(reviewsData)}`;

  // Generate enhanced monthly engagement data
  const engagementData = [
    { month: 'Jan', value: 45, growth: 2.3, interactions: 12500 },
    { month: 'Feb', value: 52, growth: 15.6, interactions: 15800 },
    { month: 'Mar', value: 49, growth: -5.8, interactions: 14900 },
    { month: 'Apr', value: 63, growth: 28.6, interactions: 19200 },
    { month: 'May', value: 59, growth: -6.3, interactions: 18000 },
    { month: 'Jun', value: 67, growth: 13.5, interactions: 20400 },
    { month: 'Jul', value: 72, growth: 7.5, interactions: 22000 },
    { month: 'Aug', value: 78, growth: 8.3, interactions: 23800 },
  ];

  // Revenue conversion data
  const conversionData = [
    { label: 'Views', percentage: 100, color: 'bg-blue-200' },
    { label: 'Clicks', percentage: 42, color: 'bg-blue-300' },
    { label: 'Leads', percentage: 18, color: 'bg-blue-400' },
    { label: 'Sales', percentage: 7, color: 'bg-blue-500' },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'red': return 'text-red-500';
      case 'yellow': return 'text-yellow-500';
      case 'green': return 'text-green-500';
      case 'blue': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  // Content consumption time data
  const consumptionTimeData = [
    { platform: 'YouTube', minutes: 26 },
    { platform: 'Instagram', minutes: 18 },
    { platform: 'Website', minutes: 14 },
    { platform: 'Email', minutes: 8 },
    { platform: 'Bluesky', minutes: 12 },
  ];

  // Audience growth projection
  const audienceProjection = [
    { month: 'Current', value: 12500 },
    { month: '+1', value: 15000 },
    { month: '+2', value: 18200 },
    { month: '+3', value: 22500 },
  ];

  // Enhanced Content Calendar Data
  const weeklyCalendarData = [
    [
      { id: 1, type: 'instagram', title: 'Product Reel: New Tech Review', time: '10:00 AM', engagement: 'High', status: 'scheduled' },
      { id: 2, type: 'bluesky', title: 'Thread: Industry News', time: '2:00 PM', engagement: 'Medium', status: 'draft' },
      null,
      { id: 3, type: 'youtube', title: 'Tutorial: Advanced Features', time: '3:00 PM', engagement: 'Very High', status: 'scheduled' },
      { id: 4, type: 'newsletter', title: 'Weekly Digest', time: '9:00 AM', engagement: 'Medium', status: 'scheduled' },
      { id: 5, type: 'instagram', title: 'Behind the Scenes', time: '5:00 PM', engagement: 'Medium', status: 'idea' },
      { id: 6, type: 'live', title: 'Q&A Session', time: '7:00 PM', engagement: 'High', status: 'scheduled' }
    ],
    [
      { id: 7, type: 'bluesky', title: 'Tech News Breakdown', time: '11:00 AM', engagement: 'Medium', status: 'scheduled' },
      { id: 8, type: 'youtube', title: 'Product Comparison', time: '1:00 PM', engagement: 'High', status: 'draft' },
      { id: 9, type: 'instagram', title: 'Quick Tips Carousel', time: '4:00 PM', engagement: 'Medium', status: 'scheduled' },
      null,
      { id: 10, type: 'podcast', title: 'Industry Expert Interview', time: '2:00 PM', engagement: 'High', status: 'confirmed' },
      { id: 11, type: 'instagram', title: 'User Testimonial Reel', time: '6:00 PM', engagement: 'Medium', status: 'idea' },
      { id: 12, type: 'youtube', title: 'Live Unboxing', time: '8:00 PM', engagement: 'Very High', status: 'scheduled' }
    ]
  ];

  const monthlyCalendarData = Array.from({ length: 31 }, (_, i) => {
    if (i % 7 === 3 || i % 11 === 5) return null; // Some empty days
    
    const types = ['instagram', 'youtube', 'bluesky', 'newsletter', 'podcast', 'live'];
    const statuses = ['scheduled', 'draft', 'confirmed', 'idea'];
    const engagements = ['Low', 'Medium', 'High', 'Very High'];
    
    return {
      id: i + 100,
      type: types[Math.floor(Math.random() * types.length)],
      title: `Content ${i + 1}`,
      time: `${Math.floor(Math.random() * 12 + 1)}:00 ${Math.random() > 0.5 ? 'AM' : 'PM'}`,
      engagement: engagements[Math.floor(Math.random() * engagements.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)]
    };
  });

  const getContentTypeColor = (type) => {
    switch(type) {
      case 'instagram': return { bg: 'bg-pink-100', text: 'text-pink-800', border: 'border-pink-500' };
      case 'youtube': return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-500' };
      case 'bluesky': return { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-500' };
      case 'newsletter': return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-500' };
      case 'podcast': return { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-500' };
      case 'live': return { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-500' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-500' };
    }
  };

  const ContentCalendarItem = ({ item }) => {
    if (!item) return <div className="h-full bg-gray-50 rounded-lg"></div>;
    
    const typeColors = getContentTypeColor(item.type);
    const statusColors = {
      scheduled: 'bg-green-500',
      draft: 'bg-yellow-500',
      confirmed: 'bg-blue-500',
      idea: 'bg-gray-500'
    };
    
    return (
      <motion.div
        className={`${typeColors.bg} rounded-lg p-2 text-xs h-full flex flex-col relative overflow-hidden`}
        whileHover={{ scale: 1.03, boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}
      >
        <div className="flex justify-between items-center mb-1">
          <span className={`font-medium ${typeColors.text} capitalize`}>{item.type}</span>
          <span className="text-gray-500 text-xs">{item.time}</span>
        </div>
        <div className={`${typeColors.text} font-semibold mb-1 border-l-4 ${typeColors.border} pl-1`}>
          {item.title}
        </div>
        <div className="mt-auto flex justify-between items-center">
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full ${statusColors[item.status]} mr-1`}></div>
            <span className="text-gray-600 text-xs capitalize">{item.status}</span>
          </div>
          <span className={`text-xs ${
            item.engagement === 'Very High' ? 'text-green-600' : 
            item.engagement === 'High' ? 'text-green-500' : 
            item.engagement === 'Medium' ? 'text-yellow-500' : 'text-red-500'
          }`}>
            {item.engagement}
          </span>
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div
      className={`p-6 ml-82 rounded-xl ${
        theme === 'dark' 
        ? 'bg-blue-900/20 text-white' 
        : 'bg-gray-50 text-black'
      }`}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div className="flex justify-between items-center mb-6" variants={itemVariants}>
        <motion.h2 className={`text-2xl font-bold ${
          theme === 'dark' ? 'text-white' : 'text-gray-800'
        }`} variants={itemVariants}>
          Strategy Recommendations
        </motion.h2>
        <div className="flex items-center gap-4">
          <div className={`flex p-1 ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
          } rounded-lg`}>
            {timeframes.map((timeframe) => (
              <motion.button
                key={timeframe}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTimeframe === timeframe
                    ? 'bg-indigo-500 text-white'
                    : theme === 'dark'
                      ? 'bg-transparent text-gray-300'
                      : 'bg-transparent text-gray-700'
                }`}
                onClick={() => setActiveTimeframe(timeframe)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {timeframe}
              </motion.button>
            ))}
          </div>
          <motion.button
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium flex items-center gap-2"
            whileHover={{ scale: 1.05, backgroundColor: "#4338ca" }}
            whileTap={{ scale: 0.95 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Apply All ({appliedRecommendations}/{totalRecommendations})
          </motion.button>
        </div>
      </motion.div>
      
      <div className="grid grid-cols-2 gap-6 mb-6">
        <motion.div
          className={`${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } p-5 rounded-xl shadow-md`}
          variants={itemVariants}
          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
        >
          <h3 className={`font-bold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-700'
          } flex items-center`}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 ${
              theme === 'dark' ? 'text-indigo-400' : 'text-indigo-500'
            }`} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Strategy Health Score
          </h3>
          <div className="flex items-center">
            <div className="relative w-24 h-24">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  className="text-gray-200"
                  strokeWidth="10"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
                <motion.circle
                  className="text-indigo-500"
                  strokeWidth="10"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                  initial={{ strokeDasharray: "251.2, 251.2", strokeDashoffset: 251.2 }}
                  animate={{ strokeDashoffset: 251.2 * (1 - 83/100) }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />
              </svg>
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                <motion.div 
                  className="flex flex-col items-center justify-center" 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <p className="text-2xl font-bold">83%</p>
                  <p className="text-xs text-gray-500">Excellent</p>
                </motion.div>
              </div>
            </div>
            <div className="ml-4">
              <div className="flex items-center mb-1">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <p className="text-green-500 font-medium">+5% from last month</p>
              </div>
              <div className="flex items-center mb-1">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                <p className="text-blue-500 font-medium">Top 12% in your niche</p>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-indigo-500 mr-2"></div>
                <p className="text-indigo-500 font-medium">92% strategy consistency</p>
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          className={`${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } p-5 rounded-xl shadow-md`}
          variants={itemVariants}
          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
        >
          <h3 className={`font-bold mb-3 ${
            theme === 'dark' ? 'text-white' : 'text-gray-700'
          } flex items-center`}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 ${
              theme === 'dark' ? 'text-indigo-400' : 'text-indigo-500'
            }`} viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
              <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
            </svg>
            Audience Interest Evolution
          </h3>
          <p className="text-xs text-gray-500 mb-2">How interests have shifted in your niche</p>
          <div className="h-32 mb-3 overflow-hidden">
            <svg width="100%" height="100%" viewBox="0 0 300 100" preserveAspectRatio="none">
              {/* Grid Lines */}
              <g className="text-gray-200" strokeWidth="1" stroke="currentColor">
                <line x1="0" y1="25" x2="300" y2="25" />
                <line x1="0" y1="50" x2="300" y2="50" />
                <line x1="0" y1="75" x2="300" y2="75" />
              </g>
              
              <motion.path
                d={techNewsPath}
                fill="none"
                stroke="#4f46e5"
                strokeWidth="3"
                initial={{ pathLength: 0, opacity: 0.3 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
              <motion.path
                d={tutorialsPath}
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                initial={{ pathLength: 0, opacity: 0.3 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2, ease: "easeInOut", delay: 0.3 }}
              />
              <motion.path
                d={reviewsPath}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2"
                initial={{ pathLength: 0, opacity: 0.3 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2, ease: "easeInOut", delay: 0.6 }}
              />
              
              {/* Data points with animation */}
              {techNewsData.map((value, index) => {
                const x = index * (300 / (techNewsData.length - 1));
                const y = 100 - (value / 100 * 100);
                return (
                  <motion.circle
                    key={`tech-${index}`}
                    cx={x}
                    cy={y}
                    r="3"
                    fill="#4f46e5"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.8 + index * 0.05 }}
                  />
                );
              })}
            </svg>
          </div>
          <div className="flex space-x-4 text-sm mb-2">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-indigo-500 mr-1"></div>
              <span>Tech News</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
              <span>Tutorials</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
              <span>Reviews</span>
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>Jan</span>
            <span>Mar</span>
            <span>May</span>
            <span>Jul</span>
            <span>Sep</span>
            <span>Nov</span>
          </div>
          <p className="text-gray-500 mb-2 text-sm">Recommended: Focus more on emerging tech news (+37% growth trend)</p>
          <motion.button
            className="px-4 py-1 bg-indigo-500 text-white rounded-lg text-sm flex items-center gap-1"
            whileHover={{ scale: 1.05, backgroundColor: "#4338ca" }}
            whileTap={{ scale: 0.95 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Apply
          </motion.button>
        </motion.div>
      </div>
      
      <div className="grid grid-cols-2 gap-6 mb-6">
        <motion.div
          className={`${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } p-5 rounded-xl shadow-md`}
          variants={itemVariants}
          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
        >
          <h3 className={`font-bold mb-3 ${
            theme === 'dark' ? 'text-white' : 'text-gray-700'
          } flex items-center justify-between`}>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 ${
                theme === 'dark' ? 'text-indigo-400' : 'text-indigo-500'
              }`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm9 4a1 1 0 10-2 0v6a1 1 0 102 0V7zm-3 2a1 1 0 10-2 0v4a1 1 0 102 0V9zm-3 3a1 1 0 10-2 0v1a1 1 0 102 0v-1z" clipRule="evenodd" />
              </svg>
              Content Gap Analysis
            </div>
            <div className="text-xs bg-indigo-100 text-indigo-700 rounded-full px-2 py-1">
              Opportunity: High
            </div>
          </h3>
          <p className="text-xs text-gray-500 mb-2">Areas where your content is missing audience interest</p>
          <div className="h-40 flex items-end space-x-2 mb-4 relative">
            {contentGapBars.map((bar, index) => (
              <div key={index} className="flex-1 flex flex-col items-center relative" 
                   onMouseEnter={() => setHoveredMonth(index)}
                   onMouseLeave={() => setHoveredMonth(null)}>
                {/* Potential bar (lighter color) */}
                <div 
                  className="w-full bg-indigo-200 rounded-t-md absolute bottom-0" 
                  style={{ height: `${bar.potential}%`, zIndex: 1 }}
                ></div>
                
                {/* Current value bar */}
                <motion.div
                  className="w-full bg-indigo-500 rounded-t-md relative z-10"
                  style={{ height: `${bar.value}%` }}
                  variants={chartVariants}
                  custom={index}
                  whileHover={{ backgroundColor: "#4f46e5" }}
                ></motion.div>
                
                {/* Tooltip on hover */}
                {hoveredMonth === index && (
                  <div className="absolute bottom-full mb-2 bg-gray-800 text-white text-xs py-1 px-2 rounded z-20 w-32">
                    <div className="font-bold">{bar.label}</div>
                    <div className="flex justify-between">
                      <span>Current:</span>
                      <span>{bar.value}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Potential:</span>
                      <span>{bar.potential}%</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>Gap:</span>
                      <span className="text-green-400">+{bar.gap}%</span>
                    </div>
                    <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-800"></div>
                  </div>
                )}
                
                <p className="text-xs mt-2">{bar.label}</p>
              </div>
            ))}
            
            {/* Legends */}
            <div className="absolute top-2 right-0 flex flex-col gap-1 text-xs bg-white/70 p-1 rounded">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-indigo-500 mr-1 rounded-sm"></div>
                <span>Current</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-indigo-200 mr-1 rounded-sm"></div>
                <span>Potential</span>
              </div>
            </div>
          </div>
          <div className="bg-green-50 border-l-4 border-green-500 p-2 rounded mb-2">
            <p className="text-green-700 text-sm font-medium">Insight: Product review content has 25% untapped potential</p>
          </div>
          <div className="flex gap-2">
            <motion.button
              className="px-4 py-1 bg-indigo-500 text-white rounded-lg text-sm flex items-center gap-1 flex-1"
              whileHover={{ scale: 1.05, backgroundColor: "#4338ca" }}
              whileTap={{ scale: 0.95 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
              </svg>
              Export Insights
            </motion.button>
            <motion.button
              className="px-4 py-1 border border-indigo-500 text-indigo-500 rounded-lg text-sm flex items-center gap-1 flex-1"
              whileHover={{ scale: 1.05, backgroundColor: "#f5f3ff" }}
              whileTap={{ scale: 0.95 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
                <path d="M9 13h2v5a1 1 0 11-2 0v-5z" />
              </svg>
              Automate
            </motion.button>
          </div>
        </motion.div>
        
        <motion.div
          className={`${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } p-5 rounded-xl shadow-md`}
          variants={itemVariants}
          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
        >
          <h3 className={`font-bold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-700'
          } flex items-center justify-between`}>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 ${
                theme === 'dark' ? 'text-indigo-400' : 'text-indigo-500'
              }`} viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
              </svg>
              Performance by Platform
            </div>
          </h3>
          
          {platforms.map((platform, index) => (
            <motion.div 
              key={index} 
              className="mb-4 last:mb-0"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full ${platform.color} mr-2`}></div>
                  <h4 className="font-medium">{platform.name}</h4>
                </div>
                <motion.button
                  className="px-3 py-1 bg-indigo-500 text-white rounded-lg text-xs"
                  whileHover={{ scale: 1.05, backgroundColor: "#4338ca" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Apply All
                </motion.button>
              </div>
              <div className="pl-6 space-y-1">
                {platform.recommendations.map((rec, recIndex) => (
                  <div key={recIndex} className="flex items-center justify-between text-sm">
                    <p className={`${getStatusColor(rec.status)}`}>{rec.text}</p>
                    <motion.button
                      className="p-1 hover:bg-gray-100 rounded-md"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </motion.button>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
      
      <div className="grid grid-cols-3 gap-6 mb-6">
        <motion.div
          className={`${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } p-5 rounded-xl shadow-md`}
          variants={itemVariants}
          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
        >
          <h3 className={`font-bold mb-3 ${
            theme === 'dark' ? 'text-white' : 'text-gray-700'
          } flex items-center`}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 ${
              theme === 'dark' ? 'text-indigo-400' : 'text-indigo-500'
            }`} viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
            Monthly Engagement
          </h3>
          <div className="h-48 flex items-end space-x-1.5 mb-1">
            {engagementData.map((month, index) => (
              <div key={index} className="flex-1 flex flex-col items-center"
                   onMouseEnter={() => setHoveredMonth(index)}
                   onMouseLeave={() => setHoveredMonth(null)}>
                <motion.div
                  className={`w-full ${month.growth > 0 ? 'bg-green-500' : 'bg-red-500'} rounded-t-md relative`}
                  style={{ height: `${month.value}%` }}
                  initial={{ height: 0 }}
                  animate={{ height: `${month.value}%` }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ filter: "brightness(110%)" }}
                >
                  {/* Growth indicator */}
                  <div className={`absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium ${month.growth > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {month.growth > 0 ? '+' : ''}{month.growth}%
                  </div>
                </motion.div>
                
                {/* Tooltip on hover */}
                {hoveredMonth === index && (
                  <div className="absolute bottom-1/2 mb-2 bg-gray-800 text-white text-xs py-1 px-2 rounded z-20 w-32">
                    <div className="font-bold">{month.month} {new Date().getFullYear()}</div>
                    <div className="flex justify-between">
                      <span>Engagement:</span>
                      <span>{month.value}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Growth:</span>
                      <span className={month.growth > 0 ? 'text-green-400' : 'text-red-400'}>
                        {month.growth > 0 ? '+' : ''}{month.growth}%
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Interactions:</span>
                      <span>{month.interactions.toLocaleString()}</span>
                    </div>
                    <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-800"></div>
                  </div>
                )}
                
                <p className="text-xs mt-2">{month.month}</p>
              </div>
            ))}
          </div>
          <div className="bg-gray-100 p-2 rounded-lg mt-2">
            <p className="text-gray-700 text-sm">Avg. Monthly Growth: <span className="font-medium text-green-500">+7.9%</span></p>
            <p className="text-gray-700 text-sm">Est. Audience Retention: <span className="font-medium">62%</span></p>
          </div>
        </motion.div>
        
        <motion.div
          className={`${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } p-5 rounded-xl shadow-md`}
          variants={itemVariants}
          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
        >
          <h3 className={`font-bold mb-3 ${
            theme === 'dark' ? 'text-white' : 'text-gray-700'
          } flex items-center`}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 ${
              theme === 'dark' ? 'text-indigo-400' : 'text-indigo-500'
            }`} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Conversion Funnel
          </h3>
          <div className="h-32 pt-4 my-4 mx-auto relative">
            {conversionData.map((item, index) => (
              <motion.div
                key={index}
                className={`h-8 ${item.color} mb-1 rounded-sm flex items-center px-3`}
                style={{ width: `${item.percentage}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${item.percentage}%` }}
                transition={{ duration: 0.7, delay: index * 0.2 }}
              >
                <span className={`text-xs font-medium ${index > 1 ? 'text-white' : 'text-gray-700'}`}>
                  {item.label} {item.percentage}%
                </span>
              </motion.div>
            ))}
            
            {/* Conversion arrows */}
            <div className="absolute left-[38%] top-[15%] text-indigo-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="absolute left-[16%] top-[45%] text-indigo-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="absolute left-[5%] top-[75%] text-indigo-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-2 rounded text-sm">
            <p className="text-blue-700 font-medium">Insights:</p>
            <ul className="list-disc pl-4 text-blue-700 text-xs mt-1">
              <li>Click rate above industry avg by 7%</li>
              <li>Lead conversion needs improvement (-3% from benchmark)</li>
              <li>Sales conversion is on target</li>
            </ul>
          </div>
        </motion.div>
        
        <motion.div
          className={`${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } p-5 rounded-xl shadow-md`}
          variants={itemVariants}
          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
        >
          <h3 className={`font-bold mb-3 ${
            theme === 'dark' ? 'text-white' : 'text-gray-700'
          } flex items-center`}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 ${
              theme === 'dark' ? 'text-indigo-400' : 'text-indigo-500'
            }`} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            Content Consumption Time
          </h3>
          <div className="h-48 pt-4 my-4 mx-auto relative">
            {consumptionTimeData.map((item, index) => (
              <motion.div
                key={index}
                className="mb-3 relative"
              >
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium">{item.platform}</span>
                  <span className="text-gray-500">{item.minutes} min</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: `${(item.minutes / 30) * 100}%` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.minutes / 30) * 100}%` }}
                    transition={{ duration: 0.7, delay: index * 0.15 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
          <div className="bg-indigo-50 border-l-4 border-indigo-500 p-2 rounded text-sm">
            <p className="text-indigo-700 font-medium">Recommendations:</p>
            <ul className="list-disc pl-4 text-indigo-700 text-xs mt-1">
              <li>Optimize YouTube content to reach 30min avg view time</li>
              <li>Create Instagram carousel posts to increase time on page</li>
              <li>Add more interactive elements to email content</li>
            </ul>
          </div>
        </motion.div>
      </div>
      
      <motion.div
        className={`${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        } p-5 rounded-xl shadow-md mb-6`}
        variants={itemVariants}
        whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
      >
        <h3 className={`font-bold mb-3 ${
          theme === 'dark' ? 'text-white' : 'text-gray-700'
        } flex items-center justify-between`}>
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 ${
              theme === 'dark' ? 'text-indigo-400' : 'text-indigo-500'
            }`} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            Content Calendar Planning
          </div>
          <div className={`flex p-1 ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
          } rounded-lg`}>
            {calendarViews.map((view) => (
              <motion.button
                key={view}
                className={`px-4 py-1 rounded-lg font-medium transition-colors ${
                  selectedCalendarView === view
                    ? 'bg-indigo-500 text-white'
                    : theme === 'dark'
                      ? 'bg-transparent text-gray-300'
                      : 'bg-transparent text-gray-700'
                }`}
                onClick={() => setSelectedCalendarView(view)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {view}
              </motion.button>
            ))}
          </div>
        </h3>
        
        {selectedCalendarView === 'Weekly' && (
          <div className="mt-4">
            <div className="grid grid-cols-7 gap-2 mb-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <div key={day} className="text-center font-medium text-gray-700">{day}</div>
              ))}
            </div>
            
            {weeklyCalendarData.map((week, weekIndex) => (
              <div key={weekIndex} className="grid grid-cols-7 gap-2 mb-2">
                {week.map((item, dayIndex) => (
                  <div key={`${weekIndex}-${dayIndex}`} className="h-28">
                    <ContentCalendarItem item={item} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
        
        {selectedCalendarView === 'Monthly' && (
          <div className="mt-4">
            <div className="grid grid-cols-7 gap-2 mb-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <div key={day} className="text-center font-medium text-gray-700">{day}</div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-2">
              {monthlyCalendarData.map((item, index) => (
                <div key={index} className="h-16 relative">
                  {/* Day number */}
                  <div className="absolute top-1 left-1 text-xs font-medium text-gray-500">{index + 1}</div>
                  
                  {item && (
                    <div className="absolute inset-0 mt-5">
                      <div 
                        className={`${getContentTypeColor(item.type).bg} rounded-md p-1 text-xxs h-full overflow-hidden text-ellipsis flex flex-col`}
                      >
                        <div className={`${getContentTypeColor(item.type).text} font-medium truncate`}>{item.type}</div>
                        <div className="truncate">{item.title}</div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {selectedCalendarView === 'Quarterly' && (
          <div className="mt-4 text-center p-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h4 className="text-gray-600 font-medium mb-2">Quarterly Calendar View</h4>
            <p className="text-gray-500 mb-4">Get a broader perspective on your content strategy</p>
            <motion.button
              className="px-4 py-2 bg-indigo-500 text-white rounded-lg mx-auto"
              whileHover={{ scale: 1.05, backgroundColor: "#4338ca" }}
              whileTap={{ scale: 0.95 }}
            >
              Generate Quarterly Plan
            </motion.button>
          </div>
        )}
      </motion.div>
      
      <motion.div
        className="grid grid-cols-2 gap-6"
        variants={itemVariants}
      >
        <motion.div
          className={`${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } p-5 rounded-xl shadow-md`}
          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
        >
          <h3 className={`font-bold mb-3 ${
            theme === 'dark' ? 'text-white' : 'text-gray-700'
          } flex items-center`}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 ${
              theme === 'dark' ? 'text-indigo-400' : 'text-indigo-500'
            }`} viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            Audience Growth Projection
          </h3>
          
          <div className="h-48 pt-4 my-4 mx-auto relative">
            <svg width="100%" height="100%" viewBox="0 0 300 100" preserveAspectRatio="none">
              {/* Grid Lines */}
              <g className="text-gray-200" strokeWidth="1" stroke="currentColor">
                <line x1="0" y1="25" x2="300" y2="25" />
                <line x1="0" y1="50" x2="300" y2="50" />
                <line x1="0" y1="75" x2="300" y2="75" />
              </g>
              
              <defs>
                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              
              {/* Area chart */}
              <motion.path
                d={`M0,${100 - (audienceProjection[0].value / 25000 * 100)} 
                   L${300 / (audienceProjection.length - 1)},${100 - (audienceProjection[1].value / 25000 * 100)}
                   L${300 / (audienceProjection.length - 1) * 2},${100 - (audienceProjection[2].value / 25000 * 100)}
                   L${300 / (audienceProjection.length - 1) * 3},${100 - (audienceProjection[3].value / 25000 * 100)}
                   L${300},${100 - (audienceProjection[3].value / 25000 * 100)}
                   L${300},100 L0,100 Z`}
                fill="url(#areaGradient)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              />
              
              {/* Line */}
              <motion.path
                d={`M0,${100 - (audienceProjection[0].value / 25000 * 100)} 
                   L${300 / (audienceProjection.length - 1)},${100 - (audienceProjection[1].value / 25000 * 100)}
                   L${300 / (audienceProjection.length - 1) * 2},${100 - (audienceProjection[2].value / 25000 * 100)}
                   L${300 / (audienceProjection.length - 1) * 3},${100 - (audienceProjection[3].value / 25000 * 100)}`}
                fill="none"
                stroke="#4f46e5"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
              
              {/* Data points */}
              {audienceProjection.map((point, index) => {
                const x = (300 / (audienceProjection.length - 1)) * index;
                const y = 100 - (point.value / 25000 * 100);
                return (
                  <motion.g key={index}>
                    <motion.circle
                      cx={x}
                      cy={y}
                      r="4"
                      fill="#4f46e5"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.5 + index * 0.1 }}
                    />
                    <motion.text
                      x={x}
                      y={y - 10}
                      textAnchor="middle"
                      fill="#4f46e5"
                      fontSize="10"
                      fontWeight="500"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.8 + index * 0.1 }}
                    >
                      {point.value.toLocaleString()}
                    </motion.text>
                  </motion.g>
                );
              })}
            </svg>
          </div>
          
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            {audienceProjection.map((point, index) => (
              <span key={index}>{point.month}</span>
            ))}
          </div>
          
          <div className="bg-indigo-50 border-l-4 border-indigo-500 p-2 rounded text-sm">
            <p className="text-indigo-700 font-medium">Projection Insights:</p>
            <ul className="list-disc pl-4 text-indigo-700 text-xs mt-1">
              <li>Estimated 80% growth in 3 months with current strategy</li>
              <li>Potential to reach 30,000 with optimized content</li>
              <li>Key growth drivers: YouTube tutorials and Instagram Reels</li>
            </ul>
          </div>
        </motion.div>

        <motion.div
          className={`${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } p-5 rounded-xl shadow-md`}
          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
        >
          <h3 className={`font-bold mb-3 ${
            theme === 'dark' ? 'text-white' : 'text-gray-700'
          } flex items-center`}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 ${
              theme === 'dark' ? 'text-indigo-400' : 'text-indigo-500'
            }`} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z" clipRule="evenodd" />
            </svg>
            Content Performance Benchmarks
          </h3>
          
          <div className="h-48 pt-4 my-4 mx-auto relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">Your Performance</span>
              <span className="text-xs text-gray-500">Industry Average</span>
            </div>
            
            {[
              { label: 'Engagement Rate', yourValue: 7.2, industryValue: 5.8 },
              { label: 'Click-Through', yourValue: 4.5, industryValue: 3.2 },
              { label: 'Shares', yourValue: 2.8, industryValue: 1.9 },
              { label: 'Comments', yourValue: 1.5, industryValue: 1.2 },
            ].map((metric, index) => (
              <div key={index} className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span>{metric.label}</span>
                  <span className="font-medium">{metric.yourValue}% vs {metric.industryValue}%</span>
                </div>
                <div className="flex h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="bg-indigo-500"
                    style={{ width: `${(metric.yourValue / 10) * 100}%` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(metric.yourValue / 10) * 100}%` }}
                    transition={{ duration: 0.7, delay: index * 0.2 }}
                  />
                  <motion.div
                    className="bg-gray-400"
                    style={{ width: `${(metric.industryValue / 10) * 100}%` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(metric.industryValue / 10) * 100}%` }}
                    transition={{ duration: 0.7, delay: index * 0.2 + 0.1 }}
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-green-50 border-l-4 border-green-500 p-2 rounded text-sm">
            <p className="text-green-700 font-medium">Performance Summary:</p>
            <ul className="list-disc pl-4 text-green-700 text-xs mt-1">
              <li>Above average in all key metrics</li>
              <li>Engagement rate is 24% higher than industry</li>
              <li>Click-through performance is strongest (+41%)</li>
            </ul>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Strategy;