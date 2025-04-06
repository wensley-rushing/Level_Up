import React, { useState, useContext } from 'react';
import { ThemeContext } from '../ThemeContext';

const ContentCreation = () => {
  // State management
  const [activeTab, setActiveTab] = useState('Post');
  const { theme } = useContext(ThemeContext);
  const [postText, setPostText] = useState('');
  const [characterCount, setCharacterCount] = useState(0);
  const [imagePrompt, setImagePrompt] = useState('');
  const [platforms, setPlatforms] = useState({
    Instagram: true,
    YouTube: false,
    Bluesky: true
  });
  const [scheduleOption, setScheduleOption] = useState('AI Recommended');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isGeneratingText, setIsGeneratingText] = useState(false);
  const [isGeneratingHashtags, setIsGeneratingHashtags] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  
  // Handler functions
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  const handleTextChange = (e) => {
    setPostText(e.target.value);
    setCharacterCount(e.target.value.length);
  };
  
  const handlePlatformToggle = (platform) => {
    setPlatforms({
      ...platforms,
      [platform]: !platforms[platform]
    });
  };
  
  const handleAIWrite = () => {
    setIsGeneratingText(true);
    // Simulate AI generating content
    setTimeout(() => {
      setPostText("Here's your AI-generated post about travel photography! Perfect for engagement on Instagram and Bluesky.\n\nCapturing moments is more than just pressing a button. It's about finding the soul of a place, the whisper of a story waiting to be told. Today's wanderings reminded me that the best shots come when you least expect them.\n\nWhat's your favorite spontaneous photo memory?");
      setCharacterCount(300);
      setIsGeneratingText(false);
    }, 1500);
  };
  
  const handleAIImprove = () => {
    if (postText.length === 0) return;
    setIsImproving(true);
    // Simulate AI improving content
    setTimeout(() => {
      setPostText(postText + "\n\nEDITED BY AI: I've enhanced your message with more engaging language and a question to boost interaction!");
      setCharacterCount(postText.length + 80);
      setIsImproving(false);
    }, 1500);
  };
  
  const handleAIHashtags = () => {
    if (postText.length === 0) return;
    setIsGeneratingHashtags(true);
    // Simulate AI generating hashtags
    setTimeout(() => {
      setPostText(postText + "\n\n#ContentCreation #CreatorEconomy #SocialMediaTips #DigitalMarketing #ContentStrategy #2025Trends");
      setCharacterCount(postText.length + 95);
      setIsGeneratingHashtags(false);
    }, 1500);
  };
  
  const handleImageGeneration = () => {
    if (imagePrompt.length === 0) return;
    setIsGeneratingImage(true);
    // Simulate image generation
    setTimeout(() => {
      setIsGeneratingImage(false);
      alert(`Image generated from prompt: "${imagePrompt}"`);
    }, 2000);
  };
  
  const handleFileDrop = (e) => {
    e.preventDefault();
    // Handle file drop logic
    alert("File upload functionality would be implemented here!");
  };
  
  const handleBrowseFiles = () => {
    // Would normally trigger file input click
    alert("File browser would open here!");
  };
  
  const handlePublish = () => {
    const selectedPlatforms = Object.keys(platforms).filter(p => platforms[p]).join(", ");
    alert(`Publishing post to: ${selectedPlatforms}\nSchedule: ${scheduleOption}\nContent length: ${characterCount} characters`);
  };
  
  const handleSaveDraft = () => {
    alert("Post saved as draft!");
  };
  
  const handleScheduleLater = () => {
    alert("Schedule picker would open here!");
  };
  
  const handleAdvancedOptions = () => {
    alert("Advanced options panel would open here!");
  };

  return (
    <div className={`p-8 ml-72 rounded-lg shadow-sm max-w-6xl mx-auto ${theme === 'dark' ? 'bg-blue-900/20 text-white' : 'bg-white text-black'}`}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Content Creation</h1>
          <p className={`mt-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Saturday, April 5, 2025</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search templates..."
              className={`px-4 py-2 rounded-full w-64 pr-10 ${
                theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'
              }`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button 
              className="absolute right-3 top-2.5"
              onClick={() => alert(`Searching for: ${searchTerm}`)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-400'}`}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </button>
          </div>
          <button 
            className={`p-2 hover:bg-gray-100 rounded-full transition-colors ${
              theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'
            }`}
            onClick={() => alert("Text editor would open here!")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
          </button>
          <button 
            className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => alert("Content saved!")}
          >
            SAVE
          </button>
        </div>
      </div>
      
      <div className="flex space-x-4 mb-6">
        {['Post', 'Thread', 'Story', 'Video'].map(tab => (
          <button 
            key={tab}
            className={`px-8 py-3 font-medium rounded-lg transition-colors ${
              activeTab === tab 
                ? "bg-blue-600 text-white" 
                : theme === 'dark'
                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            onClick={() => handleTabChange(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      
      <div className="flex gap-6">
        <div className="flex-1">
          <div className={`border rounded-lg p-6 mb-6 ${
            theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className="mb-4 flex items-center">
              <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>New Instagram Post</h3>
              <div className="ml-auto flex space-x-2">
                <button 
                  className={`p-2 rounded transition-colors ${
                    theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'
                  }`}
                  onClick={() => alert("Bold text formatting")}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path></svg>
                </button>
                <button 
                  className={`p-2 rounded transition-colors ${
                    theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'
                  }`}
                  onClick={() => alert("Add link")}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                </button>
                <button 
                  className={`p-2 rounded transition-colors ${
                    theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'
                  }`}
                  onClick={() => alert("Add hashtag")}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 9h16"></path><path d="M4 15h16"></path><path d="M10 3v18"></path><path d="M14 3v18"></path></svg>
                </button>
                <button 
                  className={`p-2 rounded transition-colors ${
                    theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'
                  }`}
                  onClick={() => alert("Mention user")}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"></path></svg>
                </button>
              </div>
            </div>
            
            <textarea
              className={`w-full h-40 p-4 rounded-lg resize-none mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                theme === 'dark' 
                  ? 'bg-gray-700 text-white focus:bg-gray-600' 
                  : 'bg-gray-50 text-gray-700 focus:bg-white'
              }`}
              placeholder="What's on your mind? Ask AI to generate content..."
              value={postText}
              onChange={handleTextChange}
            ></textarea>
            
            <div className="flex justify-between items-center">
              <div className="flex space-x-3">
                <button 
                  className={`px-6 py-2 font-medium rounded-full flex items-center transition-colors ${
                    theme === 'dark'
                      ? 'bg-purple-900/50 text-purple-300 hover:bg-purple-800/60'
                      : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                  } ${isGeneratingText ? 'opacity-75' : ''}`}
                  onClick={handleAIWrite}
                  disabled={isGeneratingText}
                >
                  {isGeneratingText ? 'Generating...' : 'AI Write'} <span className="ml-1 text-yellow-500">✨</span>
                </button>
                <button 
                  className={`px-6 py-2 font-medium rounded-full flex items-center transition-colors ${
                    theme === 'dark'
                      ? 'bg-blue-900/50 text-blue-300 hover:bg-blue-800/60'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  } ${isImproving ? 'opacity-75' : ''}`}
                  onClick={handleAIImprove}
                  disabled={isImproving || postText.length === 0}
                >
                  {isImproving ? 'Improving...' : 'AI Improve'} <span className="ml-1 text-yellow-500">✨</span>
                </button>
                <button 
                  className={`px-6 py-2 font-medium rounded-full flex items-center transition-colors ${
                    theme === 'dark'
                      ? 'bg-blue-900/50 text-blue-300 hover:bg-blue-800/60'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  } ${isGeneratingHashtags ? 'opacity-75' : ''}`}
                  onClick={handleAIHashtags}
                  disabled={isGeneratingHashtags || postText.length === 0}
                >
                  {isGeneratingHashtags ? 'Generating...' : 'AI Hashtags'} <span className="ml-1 text-yellow-500">✨</span>
                </button>
              </div>
              <div className={theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}>
                {characterCount}/2200
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <p className={`font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>Publish to:</p>
            <div className="flex items-center space-x-6">
              {Object.keys(platforms).map(platform => (
                <label key={platform} className="flex items-center cursor-pointer">
                  <div 
                    className={`w-5 h-5 rounded flex items-center justify-center mr-2 ${
                      platforms[platform] 
                        ? 'bg-blue-600' 
                        : theme === 'dark' ? 'border border-gray-500' : 'border border-gray-300'
                    }`}
                    onClick={() => handlePlatformToggle(platform)}
                  >
                    {platforms[platform] && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    )}
                  </div>
                  <span className={theme === 'dark' ? 'text-white' : ''}>
                    {platform}
                  </span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <p className={`font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>Schedule</p>
            <div className="flex items-center mb-4">
              <div className="relative">
                <button 
                  className={`border rounded-lg py-3 px-8 flex items-center transition-colors ${
                    theme === 'dark'
                      ? 'border-gray-700 text-white hover:bg-gray-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    const options = ["Post Now", "Later Today", "Tomorrow", "This Weekend", "AI Recommended"];
                    const current = options.indexOf(scheduleOption);
                    const next = (current + 1) % options.length;
                    setScheduleOption(options[next]);
                  }}
                >
                  {scheduleOption === 'AI Recommended' ? 'Post Now' : scheduleOption}
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </button>
              </div>
              <div className={`ml-4 rounded-lg py-3 px-6 flex items-center flex-1 ${
                theme === 'dark'
                  ? 'bg-blue-900/30 text-blue-300'
                  : 'bg-blue-50 text-blue-700'
              }`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                AI Recommends: Today at 4:30 PM for highest engagement
              </div>
            </div>
            
            <div className="flex space-x-4">
              <button 
                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                onClick={handlePublish}
              >
                Publish
              </button>
              <button 
                className={`px-8 py-3 font-medium rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                onClick={handleSaveDraft}
              >
                Save Draft
              </button>
              <button 
                className={`px-8 py-3 font-medium rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                onClick={handleScheduleLater}
              >
                Schedule Later
              </button>
              <button 
                className={`px-8 py-3 font-medium rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                onClick={handleAdvancedOptions}
              >
                Advanced Options
              </button>
            </div>
          </div>
        </div>
        
        <div className="w-72">
          <div className={`border rounded-lg p-6 mb-6 ${
            theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>Media</h3>
            <div 
              className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center transition-colors ${
                theme === 'dark'
                  ? 'border-gray-600 hover:border-blue-500'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
            >
              <p className={`mb-2 text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Drag & Drop Media</p>
              <p className={`mb-4 text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>or</p>
              <button 
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                onClick={handleBrowseFiles}
              >
                Browse Files
              </button>
            </div>
          </div>
          
          <div className={`border rounded-lg p-6 ${
            theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>AI Image Generator</h3>
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Describe your image..."
                className={`flex-1 p-2 border rounded-lg mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-200 text-black'
                }`}
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
              />
              <button 
                className={`px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors ${isGeneratingImage ? 'opacity-75' : ''}`}
                onClick={handleImageGeneration}
                disabled={isGeneratingImage || imagePrompt.length === 0}
              >
                {isGeneratingImage ? '...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentCreation;