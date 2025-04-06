import { useState, useEffect } from 'react';
import { Calendar, ChevronDown, ChevronUp, Moon, Sun, Stars, Sparkles } from 'lucide-react';

const CalendarView = ({ scheduledTweets = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);
  const [expandedDay, setExpandedDay] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [theme, setTheme] = useState('dark'); // 'dark' or 'cosmic'
  
  // Function to get all days in a month
  const getDaysInMonth = (year, month) => {
    const date = new Date(year, month, 1);
    const days = [];
    
    // Add days from previous month to fill first week
    const firstDay = new Date(year, month, 1).getDay();
    const prevMonthDays = new Date(year, month, 0).getDate();
    
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthDays - i),
        isCurrentMonth: false
      });
    }
    
    // Add days from current month
    while (date.getMonth() === month) {
      days.push({
        date: new Date(date),
        isCurrentMonth: true
      });
      date.setDate(date.getDate() + 1);
    }
    
    // Add days from next month to fill last week
    const lastDay = new Date(year, month + 1, 0).getDay();
    for (let i = 1; i < 7 - lastDay; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false
      });
    }
    
    return days;
  };
  
  // Parse scheduled tweet dates and associate with calendar days
  const parseTweetDates = (days, tweets) => {
    return days.map(day => {
      const dayStr = day.date.toDateString();
      const tweetsForDay = tweets.filter(tweet => {
        const tweetDate = new Date(tweet.datetime); // Use `datetime` from the scheduledTweets array
        return tweetDate.toDateString() === dayStr;
      });
      
      // Sort tweets by datetime to ensure proper sequence
      tweetsForDay.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
      
      return {
        ...day,
        tweets: tweetsForDay
      };
    });
  };
  
  // Update calendar when month changes
  useEffect(() => {
    console.log('Scheduled Tweets:', scheduledTweets);
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const days = getDaysInMonth(year, month);
    const daysWithTweets = parseTweetDates(days, scheduledTweets);
    
    // Animate month change
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 500);
    
    setCalendarDays(daysWithTweets);
  }, []);
  
  // Navigate to previous month with animation
  const prevMonth = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    }, 100);
  };
  
  // Navigate to next month with animation
  const nextMonth = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    }, 100);
  };
  
  // Navigate to today
  const goToToday = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentDate(new Date());
    }, 100);
  };
  
  // Format time for display
  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Toggle theme
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'cosmic' : 'dark');
  };
  
  // Day name headers
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Get theme-specific classes
  const getThemeClasses = () => {
    if (theme === 'cosmic') {
      return {
        container: "bg-indigo-900 bg-gradient-to-br from-indigo-900 to-purple-900",
        dayHeader: "bg-indigo-950 text-indigo-300",
        dayCell: "bg-indigo-900/90",
        inactiveDayCell: "opacity-30",
        buttonBg: "bg-purple-800 hover:bg-purple-700",
        todayBg: "bg-pink-600",
        tweetBg: "bg-indigo-700/60 border-l-2 border-pink-500",
      };
    }
    
    return {
      container: "bg-gray-800",
      dayHeader: "bg-gray-900 text-gray-400",
      dayCell: "bg-gray-900",
      inactiveDayCell: "opacity-40",
      buttonBg: "bg-gray-700 hover:bg-gray-600",
      todayBg: "bg-blue-600",
      tweetBg: "bg-blue-900/50 border-l-2 border-blue-500",
    };
  };
  
  const themeClasses = getThemeClasses();
  const randomDelay = () => Math.floor(Math.random() * 5) * 100;
  
  return (
    <div className={`${themeClasses.container} rounded-xl p-6 shadow-lg transition-all duration-500 ease-in-out ${theme === 'cosmic' ? 'shadow-purple-500/30' : 'shadow-blue-500/20'}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center">
          <Calendar className={`${theme === 'cosmic' ? 'text-pink-500' : 'text-blue-500'} mr-2 animate-pulse`} size={20} />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
            Calendar Vision
          </span>
        </h2>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={toggleTheme}
            className={`p-2 ${themeClasses.buttonBg} rounded-lg transition-colors`}
          >
            {theme === 'dark' ? <Stars size={18} /> : <Sun size={18} />}
          </button>
          
          <button 
            onClick={prevMonth}
            className={`p-2 ${themeClasses.buttonBg} rounded-lg transition-colors`}
          >
            <ChevronUp className="rotate-90" size={18} />
          </button>
          
          <span className="font-medium">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </span>
          
          <button 
            onClick={nextMonth}
            className={`p-2 ${themeClasses.buttonBg} rounded-lg transition-colors`}
          >
            <ChevronDown className="rotate-90" size={18} />
          </button>
          
          <button 
            onClick={goToToday}
            className={`ml-2 px-3 py-1 ${theme === 'cosmic' ? 'bg-pink-600 hover:bg-pink-700' : 'bg-blue-600 hover:bg-blue-700'} rounded-lg text-sm transition-colors`}
          >
            Today
          </button>
        </div>
      </div>
      
      {/* Calendar Grid */}
      <div className={`border ${theme === 'cosmic' ? 'border-indigo-700' : 'border-gray-700'} rounded-lg overflow-hidden transition-all duration-300 ${isAnimating ? 'transform scale-95 opacity-50' : 'transform scale-100 opacity-100'}`}>
        {/* Day headers */}
        <div className="grid grid-cols-7">
          {dayNames.map((day, index) => (
            <div 
              key={index} 
              className={`py-2 text-center font-medium text-sm border-b ${theme === 'cosmic' ? 'border-indigo-700' : 'border-gray-700'} ${themeClasses.dayHeader}`}
            >
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar days */}
        <div className={`grid grid-cols-7 gap-px ${theme === 'cosmic' ? 'bg-indigo-700' : 'bg-gray-700'}`}>
          {calendarDays.map((dayInfo, index) => {
            const isToday = dayInfo.date.toDateString() === new Date().toDateString();
            const hasTweets = dayInfo.tweets && dayInfo.tweets.length > 0;
            const randomAnimClass = theme === 'cosmic' ? 
              ['opacity-80', 'opacity-90', 'opacity-100'][Math.floor(Math.random() * 3)] : '';
            
            return (
              <div 
                key={index}
                className={`min-h-24 ${themeClasses.dayCell} p-1 relative 
                  ${!dayInfo.isCurrentMonth ? themeClasses.inactiveDayCell : ''} 
                  ${theme === 'cosmic' ? randomAnimClass : ''} 
                  transition-all duration-300 hover:scale-[0.98] group`}
                onClick={() => setExpandedDay(expandedDay === dayInfo.date.toDateString() ? null : dayInfo.date.toDateString())}
                style={theme === 'cosmic' ? {animationDelay: `${randomDelay()}ms`} : {}}
              >
                <div className={`p-1 text-sm ${isToday ? `${themeClasses.todayBg} rounded-full w-6 h-6 flex items-center justify-center` : ''}`}>
                  {dayInfo.date.getDate()}
                </div>
                
                {hasTweets ? (
                  <div className="mt-1 space-y-1">
                    {dayInfo.tweets.map((tweet, idx) => (
                      <div 
                        key={idx}
                        className={`${themeClasses.tweetBg} p-1 rounded text-xs truncate`}
                        title={`Tweet ${idx + 1}: ${formatTime(tweet.datetime)}`}
                      >
                        {`Tweet ${idx + 1} • ${formatTime(tweet.datetime)}`}
                      </div>
                    ))}
                  </div>
                ) : (
                  // Empty day visual enhancement
                  theme === 'cosmic' && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-20">
                      <Sparkles size={16} className="text-pink-300" />
                    </div>
                  )
                )}
                
                {/* Expanded day view */}
                {expandedDay === dayInfo.date.toDateString() && (
                  <div className={`absolute top-full left-0 z-10 w-64 ${theme === 'cosmic' ? 'bg-indigo-800 border-indigo-600' : 'bg-gray-800 border-gray-700'} border rounded-lg p-3 shadow-lg shadow-black/50 mt-2 animate-fadeIn`}>
                    <h4 className="font-medium mb-2">
                      {dayInfo.date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                    </h4>
                    
                    <div className="space-y-2 max-h-64 overflow-y-auto py-1">
                      {hasTweets ? (
                        dayInfo.tweets.map((tweet, idx) => (
                          <div 
                            key={idx}
                            className={`${theme === 'cosmic' ? 'bg-indigo-900/80 border-l-2 border-pink-500' : 'bg-gray-900 border-l-2 border-blue-500'} p-2 rounded text-sm animate-slideIn`}
                            style={{animationDelay: `${idx * 100}ms`}}
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-medium">Tweet {idx + 1}</span>
                              <span className={`text-xs ${theme === 'cosmic' ? 'bg-pink-900/50' : 'bg-blue-900/50'} px-2 py-0.5 rounded`}>
                                {formatTime(tweet.datetime)}
                              </span>
                            </div>
                            
                            {tweet.content && (
                              <div className="text-xs text-gray-400 mt-1 line-clamp-2">
                                {tweet.content}
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className={`text-sm p-3 ${theme === 'cosmic' ? 'text-indigo-300' : 'text-gray-400'} text-center`}>
                          No events scheduled for this day
                        </div>
                      )}
                    </div>
                    
                    <button 
                      className="absolute top-1 right-1 p-1 text-gray-400 hover:text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedDay(null);
                      }}
                    >
                      <ChevronUp size={16} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Legend */}
      <div className="mt-4 flex items-center text-sm text-gray-400">
        <div className="flex items-center mr-4">
          <div className={`w-3 h-3 ${theme === 'cosmic' ? 'bg-pink-600' : 'bg-blue-500'} rounded mr-1`}></div>
          <span>Today</span>
        </div>
        <div className="flex items-center">
          <div className={`w-3 h-3 ${theme === 'cosmic' ? 'border-l-2 border-pink-500 bg-indigo-700/60' : 'border-l-2 border-blue-500 bg-blue-900/50'} mr-1`}></div>
          <span>Scheduled Tweet</span>
        </div>
        <div className="ml-auto">
          <span className="text-xs">Click any day to expand</span>
        </div>
      </div>
      
      {/* Add some global CSS for animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes pulse {
          0% { opacity: 0.7; }
          50% { opacity: 1; }
          100% { opacity: 0.7; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
        }
        
        .animate-pulse {
          animation: pulse 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default CalendarView;
