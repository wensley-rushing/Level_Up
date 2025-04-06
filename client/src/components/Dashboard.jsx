// App.jsx - Main Application Component
import { useState, useEffect } from 'react';
import { Sparkles, Send, Download, Save, Calendar, Mail, ChevronDown, ChevronUp, Loader2, BarChart3, Clock, MessageSquare } from 'lucide-react';
import axios from 'axios';
import CalendarView from './calendar';
import ReactMarkdown from 'react-markdown';

const API_URL = 'http://localhost:5009';
function NewDashboard() {
  const [topic, setTopic] = useState('');
  const [tweetCount, setTweetCount] = useState(5);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [threadData, setThreadData] = useState(null);
  const [expandedTweet, setExpandedTweet] = useState(null);
  const [activeTab, setActiveTab] = useState('generator');
  const [tweetToAnalyze, setTweetToAnalyze] = useState('');
  const [analyzeResults, setAnalyzeResults] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [notification, setNotification] = useState(null);
  const [mat , setMat] = useState(null);

  // Generate a viral thread
  const generateThread = async (e) => {
    e.preventDefault();
    if (!topic) {
      showNotification('Please enter a topic', 'error');
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/generate`, {
        topic,
        thread_count: tweetCount,
        email: email || null
      });
      
      setThreadData(response.data);
      showNotification('Thread generated successfully!', 'success');
    } catch (error) {
      console.error('Error generating thread:', error);
      showNotification('Failed to generate thread', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Analyze a tweet
  const analyzeTweet = async (e) => {
    e.preventDefault();
    if (!tweetToAnalyze) {
      showNotification('Please enter a tweet to analyze', 'error');
      return;
    }
    
    setAnalyzing(true);
    try {
      const response = await axios.post(`${API_URL}/analyze`, {
        tweet: tweetToAnalyze
      });
      
      //setAnalyzeResults(response.data);
      setMat(response.data.metrics)
      setAnalyzeResults(response.data.style);
    } catch (error) {
      console.error('Error analyzing tweet:', error);
      showNotification('Failed to analyze tweet', 'error');
    } finally {
      setAnalyzing(false);
    }
  };

  // Export thread as PDF
  const exportPDF = async () => {
    if (!threadData) return;
    
    try {
      const response = await axios.post(`${API_URL}/export_pdf`, {
        thread_data: threadData
      }, { responseType: 'blob' });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `viral_thread_${threadData.topic.replace(' ', '_')}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      showNotification('PDF exported successfully!', 'success');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      showNotification('Failed to export PDF', 'error');
    }
  };

  // Schedule in calendar
  const scheduleInCalendar = async () => {
    if (!threadData || !email) {
      showNotification('Email is required for calendar scheduling', 'error');
      return;
    }
    
    try {
      const response = await axios.post(`http://localhost:5003/schedule_calendar`, {
        email,
        thread_data: threadData
      });
      
      if (response.data.success) {
        showNotification('Thread scheduled in calendar successfully!', 'success');
      }
    } catch (error) {
      console.error('Error scheduling in calendar:', error);
      showNotification('Failed to schedule in calendar', 'error');
    }
  };

  // Save thread
  const saveThread = async () => {
    if (!threadData) return;
    
    try {
      const response = await axios.post(`${API_URL}/save_thread`, {
        thread_data: threadData
      });
      
      if (response.data.success) {
        showNotification(`Thread saved with ID: ${response.data.thread_id}`, 'success');
      }
    } catch (error) {
      console.error('Error saving thread:', error);
      showNotification('Failed to save thread', 'error');
    }
  };

  // Notification system
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  return (
    <div className="ml-80 min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-black py-6 border-b border-blue-600">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="text-blue-500" size={24} />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              ViralThreads
            </h1>
          </div>
          <nav>
            <ul className="flex space-x-6">
              
              <li>
                <button 
                  className={`py-2 px-4 rounded-full transition-all ${activeTab === 'generator' ? 'bg-blue-600' : 'hover:bg-blue-900'}`}
                  onClick={() => setActiveTab('generator')}
                >
                  Thread Generator
                </button>
              </li>
              <li>
                <button 
                  className={`py-2 px-4 rounded-full transition-all ${activeTab === 'analyzer' ? 'bg-blue-600' : 'hover:bg-blue-900'}`}
                  onClick={() => setActiveTab('analyzer')}
                >
                  Tweet Analyzer
                </button>
              </li>
              <li>
                <button 
                  className={`py-2 px-4 rounded-full transition-all ${activeTab === 'calender' ? 'bg-blue-600' : 'hover:bg-blue-900'}`}
                  onClick={() => setActiveTab('calendar')}
                >
                  Calender View
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Notification */}
        {notification && (
          <div className={`p-4 rounded-lg mb-6 ${
            notification.type === 'error' ? 'bg-red-900/50 border border-red-500' :
            notification.type === 'success' ? 'bg-green-900/50 border border-green-500' :
            'bg-blue-900/50 border border-blue-500'
          }`}>
            {notification.message}
          </div>
        )}

        {/* Generator Tab */}
        {activeTab === 'generator' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg shadow-blue-500/20">
              <h2 className="text-xl font-bold mb-6 flex items-center">
                <Send className="text-blue-500 mr-2" size={20} />
                Generate Viral Thread
              </h2>
              
              <form onSubmit={generateThread} className="space-y-4">
                <div>
                  <label className="block text-gray-400 mb-2">Topic</label>
                  <input
                    type="text"
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your thread topic..."
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-gray-400 mb-2">Tweet Count</label>
                  <div className="flex items-center">
                    <input
                      type="range"
                      min="3"
                      max="10"
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      value={tweetCount}
                      onChange={(e) => setTweetCount(parseInt(e.target.value))}
                    />
                    <span className="ml-3 bg-blue-900 px-3 py-1 rounded-lg">{tweetCount}</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-400 mb-2">Email (optional)</label>
                  <input
                    type="email"
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email to receive the thread..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">We'll send you a copy of the generated thread</p>
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-800 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-blue-900 transition-all flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={20} />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2" size={20} />
                      Generate Viral Thread
                    </>
                  )}
                </button>
              </form>
            </div>
            
            {/* Results Section */}
            <div>
              {threadData ? (
                <div className="bg-gray-800 rounded-xl p-6 shadow-lg shadow-blue-500/20">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">
                      Thread: {threadData.topic}
                    </h2>
                    <div className="flex space-x-2">
                      <button 
                        onClick={exportPDF}
                        className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                        title="Export as PDF"
                      >
                        <Download size={18} />
                      </button>
                      <button 
                        onClick={saveThread}
                        className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                        title="Save Thread"
                      >
                        <Save size={18} />
                      </button>
                      <button 
                        onClick={scheduleInCalendar}
                        className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                        title="Schedule in Calendar"
                      >
                        <Calendar size={18} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                    {threadData.tweets.map((tweet, index) => (
                      <div 
                        key={index}
                        className="bg-gray-900 rounded-lg p-4 border border-gray-700 hover:border-blue-500 transition-colors"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium text-blue-400">Tweet {index + 1}</h3>
                          <button 
                            onClick={() => setExpandedTweet(expandedTweet === index ? null : index)}
                            className="text-gray-400 hover:text-white"
                          >
                            {expandedTweet === index ? (
                              <ChevronUp size={18} />
                            ) : (
                              <ChevronDown size={18} />
                            )}
                          </button>
                        </div>
                        
                        <p className="text-sm">{tweet.content}</p>
                        <img 
                              src={`data:image/png;base64,${tweet.image}`} 
                              alt="Generated content" 
                              className="rounded-md max-w-full h-auto"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/400x200?text=Invalid+Image';
                            }}
                        />
                        
                        {expandedTweet === index && tweet.metrics && (
                          <div className="mt-3 pt-3 border-t border-gray-700">
                            <h4 className="text-xs text-gray-400 mb-2">Metrics</h4>
                            <div className="grid grid-cols-2 gap-2">
                              {Object.entries(tweet.metrics).map(([key, value]) => (
                                <div key={key} className="bg-gray-800 p-2 rounded text-xs">
                                  <span className="text-gray-400">{key}: </span>
                                  <span>{typeof value === 'number' ? value.toFixed(2) : value}</span>

                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      </div>
                    ))}
                  </div>

                 
                  
                  <div className="mt-6 pt-6 border-t border-gray-700">
                    <h3 className="text-lg font-medium mb-3 flex items-center">
                      <Clock className="text-blue-500 mr-2" size={18} />
                      Posting Schedule
                    </h3>
                    <div className="space-y-2">
                      {Array.isArray(threadData?.schedule) && threadData.schedule.length > 0 ? (
                        threadData.schedule.map((item, index) => (
                          <div 
                            key={index}
                            className="bg-gray-900 p-3 rounded-lg flex justify-between items-center text-sm"
                          >
                            <span>Tweet {item.tweet_number}</span>
                            <span className="bg-blue-900/50 px-3 py-1 rounded-full text-xs">
                              {item.scheduled_time}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm">No schedule available.</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-700">
                    <h3 className="text-lg font-medium mb-3">Action Plan</h3>
                    <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-900">
                      <ReactMarkdown
                        components={{
                          p: ({ node, ...props }) => <p className="prose prose-sm prose-blue" {...props} />,
                        }}
                      >
                        {threadData.action_plan}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-800 rounded-xl p-8 shadow-lg shadow-blue-500/20 flex flex-col items-center justify-center h-full">
                  <MessageSquare className="text-gray-600 mb-4" size={64} />
                  <h3 className="text-xl font-medium text-gray-400">No Thread Generated Yet</h3>
                  <p className="text-gray-500 text-center mt-2">
                    Fill out the form and generate your first viral thread
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'calendar' && (
          <div>
            <CalendarView 
              scheduledTweets={threadData?.schedule || allScheduledTweets} 
            />
          </div>
        )}

        {/* Analyzer Tab */}
        {activeTab === 'analyzer' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Analyzer Form */}
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg shadow-blue-500/20">
              <h2 className="text-xl font-bold mb-6 flex items-center">
                <BarChart3 className="text-blue-500 mr-2" size={20} />
                Tweet Analyzer
              </h2>
              
              <form onSubmit={analyzeTweet} className="space-y-4">
                <div>
                  <label className="block text-gray-400 mb-2">Tweet Text</label>
                  <textarea
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-32"
                    placeholder="Enter a tweet to analyze..."
                    value={tweetToAnalyze}
                    onChange={(e) => setTweetToAnalyze(e.target.value)}
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={analyzing}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-800 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-blue-900 transition-all flex items-center justify-center"
                >
                  {analyzing ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={20} />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <BarChart3 className="mr-2" size={20} />
                      Analyze Tweet
                    </>
                  )}
                </button>
              </form>
            </div>
            
            {/* Analysis Results */}
            <div>
              {analyzeResults ? (
                <div className="bg-gray-800 rounded-xl p-6 shadow-lg shadow-blue-500/20">
                  <h2 className="text-xl font-bold mb-6">Analysis Results</h2>
                  
                  <div className="space-y-6">
                    {/* Metrics Section */}
                    <div>
                      <h3 className="text-lg font-medium mb-3 text-blue-400">Tweet Metrics</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {mat && Object.entries(mat).map(([key, value]) => (
                          <div key={key} className="bg-gray-900 p-4 rounded-lg">
                            <div className="text-gray-400 text-sm mb-1">{key.replace(/_/g, ' ')}</div>
                            <div className="text-lg font-medium">
                              {typeof value === 'number' ? value.toFixed(2) : value}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Style Section */}
                    <div>
                      <h3 className="text-lg font-medium mb-3 text-blue-400">Writing Style</h3>
                      <div className="bg-gray-900 p-4 rounded-lg">
                        {analyzeResults && (
                          <div className="space-y-3">
                            <div>
                              <div className="text-gray-400 text-sm mb-1">Style Tags</div>
                              <ul className="list-disc pl-5 text-sm space-y-1">
                                {analyzeResults.style_tags.length > 0 && analyzeResults.style.style_tags.map((tag, i) => (
                                  <li key={i}>{tag}</li>
                                ))}
                              </ul>
                            </div>
                            
                            <div>
                              <div className="text-gray-400 text-sm mb-1">Slang Usage</div>
                              <div className="text-md">{analyzeResults.slang_usage.toFixed(2)}</div>
                            </div>
                            
                            <div>
                              <div className="text-gray-400 text-sm mb-1">Twitter Native Score</div>
                              <div className="text-md">{analyzeResults.twitter_native_score.toFixed(2)}</div>
                            </div>
                            
                            <div>
                              <div className="text-gray-400 text-sm mb-1">Engagement Potential</div>
                              <div className="flex items-center">
                                <div className="w-full bg-gray-700 rounded-full h-2.5">
                                  <div 
                                    className="bg-blue-600 h-2.5 rounded-full" 
                                    style={{ width: `${analyzeResults.engagement_potential}%` }}
                                  />
                                </div>
                                <span className="ml-2 text-md font-medium">
                                  {analyzeResults.engagement_potential.toFixed(2)}%
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-800 rounded-xl p-8 shadow-lg shadow-blue-500/20 flex flex-col items-center justify-center h-full">
                  <BarChart3 className="text-gray-600 mb-4" size={64} />
                  <h3 className="text-xl font-medium text-gray-400">No Analysis Yet</h3>
                  <p className="text-gray-500 text-center mt-2">
                    Enter a tweet to analyze its viral potential
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-black py-6 border-t border-gray-800 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>© {new Date().getFullYear()} ViralThreads — Craft the perfect viral Twitter thread</p>
          <div className="flex justify-center space-x-4 mt-4">
            <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">Terms</a>
            <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">Privacy</a>
            <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">Contact</a>
          </div>
        </div>
      </footer>

      {/* Global Styles */}
      <style jsx="true" global="true">{`
        body {
          background-color: #111827;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1f2937;
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #374151;
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #4b5563;
        }
      `}</style>
    </div>
 );
}
export default NewDashboard;


