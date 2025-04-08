import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, ArrowUpRight, Clock, Eye, Globe, Heart, MessageSquare, MessageCircle, Zap, TrendingUp, Cpu, Share2, Maximize2, PieChart, Target, User, BarChart2 } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Real Mapbox token
const MAPBOX_TOKEN = 'pk.eyJ1IjoiYmhhbnVoYXJzIiwiYSI6ImNtOTRscWoxcDB5dWUyanNmYjNkeHlxNzQifQ.q7GqDW2lxlQWu6hzJ4t8XA';

// Disable Mapbox telemetry collection to prevent blocking by ad blockers
mapboxgl.config.COLLECT_RESOURCE_TIMING = false;
mapboxgl.config.SEND_EVENT_TIMING = false;

mapboxgl.accessToken = 'pk.eyJ1IjoiYmhhbnVoYXJzIiwiYSI6ImNtOTRscWoxcDB5dWUyanNmYjNkeHlxNzQifQ.q7GqDW2lxlQWu6hzJ4t8XA';

const ContentCreatorDashboard = () => {
  const [currentPhase, setCurrentPhase] = useState('input'); // input, generating, preview, posting, analytics
  const [description, setDescription] = useState('');
  const [postData, setPostData] = useState(null);
  const [engagementData, setEngagementData] = useState({ views: 0, likes: 0, comments: 0, shares: 0 });
  const [hotspots, setHotspots] = useState([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  const [realtimeEvents, setRealtimeEvents] = useState([]);
  const [mapStyle, setMapStyle] = useState('dark'); // dark, satellite, light
  const [mapView, setMapView] = useState('3d'); // 3d, 2d
  const [showSidebar, setShowSidebar] = useState(true);
  const [is3DView, setIs3DView] = useState(true);
  const [trending, setTrending] = useState([]);
  const [pulsing, setPulsing] = useState(true);
  const [img1, setImg1] = useState(null);
    const [img2, setImg2] = useState(null);
    const [tweet, setTweet] = useState(null);
  
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const videoRef = useRef(null);
  const navigate = useNavigate();
  
  // Initialize map when container is loaded and we're in analytics phase
  useEffect(() => {
    if (currentPhase === 'analytics' && mapContainerRef.current && !mapInstanceRef.current) {
      try {
        // Initialize real Mapbox map
        const mapInstance = new mapboxgl.Map({
          container: mapContainerRef.current,
          style: mapStyle === 'dark' 
            ? 'mapbox://styles/mapbox/dark-v11' 
            : mapStyle === 'satellite'
            ? 'mapbox://styles/mapbox/satellite-streets-v12'
            : 'mapbox://styles/mapbox/light-v11',
          center: [0, 20], // Starting position [lng, lat]
          zoom: 1.8, // Starting zoom
          pitch: is3DView ? 45 : 0, // Pitch in degrees (3D effect)
          bearing: is3DView ? 15 : 0, // Bearing in degrees
          trackResize: true,
          attributionControl: false, // Disable attribution to reduce blocked resources
        });
        
        mapInstanceRef.current = mapInstance;
        
        mapInstance.on('load', () => {
          setMapLoaded(true);
          
          // Generate initial hotspots
          const initialHotspots = [];
          for (let i = 0; i < 10; i++) {
            initialHotspots.push({
              id: `initial-${i}`,
              lat: (Math.random() * 170) - 85,
              lng: (Math.random() * 360) - 180,
              intensity: Math.random(),
              radius: Math.random() * 20 + 10,
              viewers: Math.floor(Math.random() * 500) + 100
            });
          }
          setHotspots(initialHotspots);
        });
        
        // Add error handling for map operations
        mapInstance.on('error', (e) => {
          console.error('Mapbox error:', e);
        });
      } catch (error) {
        console.error('Error initializing Mapbox:', error);
        setMapLoaded(false);
      }
    }
    
    // Clean up map on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [currentPhase, mapStyle, is3DView]);
  
  // Update hotspots on the map
  useEffect(() => {
    if (mapLoaded && mapInstanceRef.current && hotspots.length > 0) {
      // Clear existing markers if needed
      const markers = document.querySelectorAll('.hotspot-marker');
      markers.forEach(marker => marker.remove());
      
      // Add hotspot markers to the map
      hotspots.forEach(spot => {
        const el = document.createElement('div');
        el.className = 'hotspot-marker';
        
        el.style.width = `${spot.radius}px`;
        el.style.height = `${spot.radius}px`;
        el.style.borderRadius = '50%';
        el.style.backgroundColor = `rgba(50, 100, 255, ${spot.intensity * 0.5})`;
        el.style.boxShadow = `0 0 ${spot.radius}px rgba(50, 150, 255, ${spot.intensity * 0.7})`;
        
        const popup = new mapboxgl.Popup({ offset: 25 })
          .setHTML(`<div class="text-white text-xs font-bold">${spot.viewers} viewers</div>`);
        
        new mapboxgl.Marker(el)
          .setLngLat([spot.lng, spot.lat])
          .setPopup(popup)
          .addTo(mapInstanceRef.current);
      });
    }
  }, [hotspots, mapLoaded]);
  
  // Toggle map style between dark, satellite, and light
  const toggleMapStyle = () => {
    const styles = ['dark', 'satellite', 'light'];
    const currentIndex = styles.indexOf(mapStyle);
    const nextIndex = (currentIndex + 1) % styles.length;
    setMapStyle(styles[nextIndex]);
    
    if (mapInstanceRef.current) {
      const style = styles[nextIndex] === 'dark' 
        ? 'mapbox://styles/mapbox/dark-v11' 
        : styles[nextIndex] === 'satellite'
        ? 'mapbox://styles/mapbox/satellite-streets-v12'
        : 'mapbox://styles/mapbox/light-v11';
        
      mapInstanceRef.current.setStyle(style);
    }
  };
  
  // Toggle 3D/2D view
  const toggle3DView = () => {
    setIs3DView(!is3DView);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.easeTo({
        pitch: is3DView ? 0 : 45,
        bearing: is3DView ? 0 : 15,
        duration: 1000
      });
    }
  };
  
  // Generate random engagement data when in analytics phase
  useEffect(() => {
    if (currentPhase === 'analytics') {
      const interval = setInterval(() => {
        // Update engagement metrics
        setEngagementData(prev => ({
          views: prev.views + Math.floor(Math.random() * 25) + 5,
          likes: prev.likes + Math.floor(Math.random() * 12) + 3,
          comments: prev.comments + Math.floor(Math.random() * 4) + 1,
          shares: prev.shares + Math.floor(Math.random() * 6) + 2
        }));
        
        // Update viewer count with some fluctuation
        setViewerCount(prev => {
          const change = Math.floor(Math.random() * 50) - 10; // Can go down sometimes
          return Math.max(100, prev + change);
        });
        
        // Generate random hotspots
        if (Math.random() > 0.7) {
          const newHotspot = {
            id: Date.now(),
            lat: (Math.random() * 170) - 85,
            lng: (Math.random() * 360) - 180,
            intensity: Math.random(),
            radius: Math.random() * 30 + 15,
            viewers: Math.floor(Math.random() * 1000) + 200
          };
          setHotspots(prev => [...prev.slice(-20), newHotspot]);
        }
        
        // Generate real-time events
        if (Math.random() > 0.5) {
          const eventTypes = [
            { type: 'share', icon: Share2, color: 'text-blue-400' },
            { type: 'like', icon: Heart, color: 'text-red-400' },
            { type: 'comment', icon: MessageSquare, color: 'text-green-400' },
            { type: 'view', icon: Eye, color: 'text-purple-400' }
          ];
          
          const randomEvent = eventTypes[Math.floor(Math.random() * eventTypes.length)];
          const locations = ['Tokyo', 'New York', 'London', 'Mumbai', 'Sydney', 'Berlin', 'Rio', 'Mexico City', 'Cairo', 'Seoul'];
          const randomLocation = locations[Math.floor(Math.random() * locations.length)];
          
          const newEvent = {
            id: Date.now(),
            type: randomEvent.type,
            icon: randomEvent.icon,
            color: randomEvent.color,
            location: randomLocation,
            time: `${Math.floor(Math.random() * 59) + 1}s ago`,
            username: `user${Math.floor(Math.random() * 9999)}`
          };
          
          setRealtimeEvents(prev => [newEvent, ...prev.slice(0, 6)]);
        }
        
        // Update trending topics/hashtags
        if (Math.random() > 0.9) {
          const trendOptions = [
            '#ContentRevolution', '#CreatorEconomy', '#ViralNow', '#TrendAlert', 
            '#NextLevel', '#InnovationStation', '#FutureOfContent', '#DigitalCreators',
            '#TrendingNow', '#ContentStrategy', '#CreatorLifestyle', '#ContentMagic',
            '#EngagementHacks', '#GlobalReach', '#ContentSuccess', '#NovaCreator'
          ];
          
          const randomTrend = trendOptions[Math.floor(Math.random() * trendOptions.length)];
          const growth = Math.floor(Math.random() * 200) + 50;
          
          if (!trending.some(t => t.name === randomTrend)) {
            setTrending(prev => [...prev.slice(-4), { 
              name: randomTrend, 
              growth: `+${growth}%`, 
              count: Math.floor(Math.random() * 10000) + 1000 
            }]);
          }
        }
        
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [currentPhase, trending]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) return;
  
    setCurrentPhase('generating');
  
    try {
      const response = await axios.post('http://localhost:5005/generate', {
        text: description,
      });
  
      if (response.data) {
        setImg1(response.data.image1);
        setTweet(response.data.tweet);
        setCurrentPhase('preview');
      }
    } catch (error) {
      console.error('Error generating content:', error);
      setCurrentPhase('input'); // Revert to input phase on error
    }
  };
  
  const generateContent = (desc) => {
    const templates = [
      `✨ Breaking all limits with this ${desc}! The future is NOW and we're creating it together!`,
      `🔥 This ${desc} will completely transform how you think about content. No limits, just pure creativity!`,
      `🚀 Just dropped: A game-changing ${desc} that's about to revolutionize everything you thought you knew!`
    ];
    return templates[Math.floor(Math.random() * templates.length)];
  };
  
  const generateHashtags = (desc) => {
    const tags = ['#ContentRevolution', '#CreatorEconomy', '#ViralNow', '#TrendAlert', '#NextLevel', '#InnovationStation', '#FutureOfContent'];
    return tags.slice(0, 5).join(' ');
  };
  
  const handlePost = async() => {
    setCurrentPhase('posting');
    
    try {
      // Convert base64 string to blob
      const base64Response = await fetch(`data:image/png;base64,${img1}`);
      const blob = await base64Response.blob();
      
      // Create form data and append image as file
      const formData = new FormData();
      formData.append('image', blob, 'image.png');
      formData.append('caption', tweet);
      
      // Send form data to backend
      const response = await axios.post('https://11b1-2409-40c0-1073-720-2509-282c-2252-e880.ngrok-free.app/post', 
        formData, 
        {
          headers: {
            'ngrok-skip-browser-warning': 'true',
            'Content-Type': 'multipart/form-data'
          },
        }
      );
      
      if(response.data){
        setCurrentPhase('analytics');
      }
    } catch (error) {
      console.error('Error posting content:', error);
      // Optionally handle the error state
    }
  };
  
  // Render different phases
  const renderPhase = () => {
    switch(currentPhase) {
      case 'input':
        return (
          <div className="flex flex-col items-center justify-center w-full h-screen bg-gradient-to-br from-black to-blue-950 text-white p-8">
            <div 
              className="relative mb-8 w-full max-w-4xl"
              style={{background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.2), rgba(0, 0, 0, 0))', padding: '40px'}}
            >
              <div className="absolute -top-4 -left-4 w-16 h-16 rounded-full bg-blue-500 blur-xl opacity-30"></div>
              <div className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full bg-indigo-500 blur-xl opacity-20"></div>
              
              <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-500 to-blue-600 text-center mb-6">
                NOVA X
              </h1>
              <h2 className="text-2xl text-center text-gray-300 mb-12">Next-Gen Content Creation Engine</h2>
              
              <form onSubmit={handleSubmit} className="relative z-10">
                <div className="flex flex-col items-center">
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your next viral content... (e.g., 'An immersive tech showcase with futuristic 3D visuals and global market reach')"
                    className="w-full bg-black bg-opacity-50 text-white border border-blue-500 rounded-xl p-6 h-40 focus:ring-2 focus:ring-blue-500 focus:outline-none mb-8 resize-none text-lg backdrop-blur-sm"
                  />
                  <button 
                    type="submit" 
                    className="relative group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-12 rounded-xl text-xl transition-all duration-300 overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center">
                      <Zap className="mr-2" size={24} />
                      GENERATE CONTENT
                    </span>
                    <span className="absolute top-0 left-0 w-full h-full bg-white opacity-20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                  </button>
                </div>
              </form>
            </div>
            
            {/* Floating elements decoration */}
            <div className="absolute w-full h-full overflow-hidden pointer-events-none">
              {[...Array(15)].map((_, i) => (
                <div 
                  key={i}
                  className={`absolute rounded-full bg-blue-500 blur-xl opacity-10 animate-pulse`}
                  style={{
                    width: `${Math.random() * 300 + 50}px`,
                    height: `${Math.random() * 300 + 50}px`,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDuration: `${Math.random() * 8 + 5}s`
                  }}
                ></div>
              ))}
            </div>
            
            {/* "Powered by" section */}
            <div className="absolute bottom-8 text-center text-gray-500 text-sm">
              <p>POWERED BY ADVANCED AI | REAL-TIME ANALYTICS | GLOBAL ENGAGEMENT TRACKING</p>
            </div>
          </div>
        );
        
      case 'generating':
        return (
          <div className="flex flex-col items-center justify-center w-full h-screen bg-black text-white p-8 relative overflow-hidden">
            {/* Background animation */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute w-full h-full">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute bg-blue-600 opacity-20 rounded-full blur-xl animate-pulse"
                    style={{
                      width: `${Math.random() * 500 + 100}px`,
                      height: `${Math.random() * 500 + 100}px`,
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      animationDuration: `${Math.random() * 10 + 5}s`,
                      animationDelay: `${Math.random() * 5}s`
                    }}
                  ></div>
                ))}
              </div>
            </div>
            
            <div className="relative z-10 text-center mb-12">
              <h2 className="text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">Generating Breakthrough Content</h2>
              <p className="text-xl text-gray-400">Leveraging advanced AI to craft content with global impact potential...</p>
            </div>
            
            <div className="relative w-64 h-64 mb-8">
              {/* Complex spinning animations */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 rounded-full border-t-4 border-b-4 border-blue-500 animate-spin" style={{animationDuration: '8s'}}></div>
              </div>
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 rounded-full border-r-4 border-l-4 border-indigo-500 animate-spin" style={{animationDuration: '5s'}}></div>
              </div>
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full border-t-4 border-l-4 border-blue-400 animate-spin" style={{animationDuration: '3s'}}></div>
              </div>
              
              {/* Pulsing core */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 animate-pulse" style={{animationDuration: '1.5s'}}></div>
                <div className="absolute w-16 h-16 rounded-full bg-blue-400 blur-xl"></div>
              </div>
              
              {/* Orbiting particles */}
              {[...Array(8)].map((_, i) => {
                const angle = (i / 8) * Math.PI * 2;
                const x = Math.cos(angle) * 100;
                const y = Math.sin(angle) * 100;
                return (
                  <div 
                    key={i}
                    className="absolute w-3 h-3 bg-blue-400 rounded-full animate-pulse"
                    style={{
                      top: `calc(50% + ${y}px)`,
                      left: `calc(50% + ${x}px)`,
                      transform: 'translate(-50%, -50%)',
                      animationDelay: `${i * 0.2}s`
                    }}
                  ></div>
                );
              })}
            </div>
            
            <div className="relative z-10 grid grid-cols-3 gap-16 mb-10">
              <div className="flex flex-col items-center animate-pulse">
                <div className="w-16 h-16 rounded-full bg-blue-900 flex items-center justify-center mb-3">
                  <Cpu size={28} className="text-blue-400" />
                </div>
                <span className="text-lg text-blue-300">AI Processing</span>
              </div>
              
              <div className="flex flex-col items-center animate-pulse" style={{animationDelay: '0.3s'}}>
                <div className="w-16 h-16 rounded-full bg-blue-900 flex items-center justify-center mb-3">
                  <Globe size={28} className="text-blue-400" />
                </div>
                <span className="text-lg text-blue-300">Global Optimization</span>
              </div>
              
              <div className="flex flex-col items-center animate-pulse" style={{animationDelay: '0.6s'}}>
                <div className="w-16 h-16 rounded-full bg-blue-900 flex items-center justify-center mb-3">
                  <TrendingUp size={28} className="text-blue-400" />
                </div>
                <span className="text-lg text-blue-300">Trend Analysis</span>
              </div>
            </div>
            
            {/* Status indicators */}
            <div className="relative z-10 w-full max-w-md bg-black bg-opacity-50 rounded-lg p-3 border border-blue-900">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Content Generation Progress</span>
                <span className="text-blue-400">73%</span>
              </div>
              <div className="w-full h-2 bg-blue-900 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 animate-pulse" style={{width: '73%'}}></div>
              </div>
            </div>
          </div>
        );
        
        case 'preview':
            return (
              <div className="flex flex-col w-full min-h-screen bg-gradient-to-br from-black to-blue-950 text-white p-8">
                <h2 className="text-5xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">Content Preview</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                  <div className="bg-black bg-opacity-70 p-6 rounded-2xl border border-blue-500 backdrop-blur-sm">
                    <h3 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Message & Tags</h3>
                    <div className="mb-6">
                      {/* Display tweet in larger text */}
                      <p className="text-3xl font-semibold mb-4 text-blue-300">{tweet}</p>
                      {/* Optional hashtags - you can generate these dynamically if needed */}
                      <p className="text-blue-400">{generateHashtags(description)}</p>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-lg mb-2 text-gray-400">Reach Potential</h4>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 h-3 bg-blue-900 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500" style={{width: '78%'}}></div>
                        </div>
                        <span className="text-blue-400 font-bold">78%</span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-lg mb-2 text-gray-400">Target Demographics</h4>
                      <div className="flex space-x-2">
                        <span className="bg-blue-900 text-blue-300 text-sm py-1 px-3 rounded-full">Tech Enthusiasts</span>
                        <span className="bg-blue-900 text-blue-300 text-sm py-1 px-3 rounded-full">Creators</span>
                        <span className="bg-blue-900 text-blue-300 text-sm py-1 px-3 rounded-full">Early Adopters</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-black bg-opacity-70 p-6 rounded-2xl border border-indigo-500 backdrop-blur-sm">
                    <h3 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Visual Elements</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Image Element */}
                      <div className="p-4 rounded-lg border border-blue-900 bg-black bg-opacity-50">
                        <h4 className="text-lg mb-2 text-gray-400">Image</h4>
                        <div className="relative overflow-hidden rounded-lg h-40">
                          {img1 ? (
                            <img 
                              src={`data:image/png;base64,${img1}`} 
                              alt="Generated Image" 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">No Image Available</div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                          <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-xs text-blue-400 px-2 py-1 rounded">AI Generated</div>
                        </div>
                      </div>
                      
                      {/* Video Element */}
                      <div className="p-4 rounded-lg border border-blue-900 bg-black bg-opacity-50">
                        <h4 className="text-lg mb-2 text-gray-400">Video</h4>
                        <div className="relative overflow-hidden rounded-lg h-40">
                          <video 
                            src="https://qidfczpzupcbyusrfspc.supabase.co/storage/v1/object/public/yaao//351970777-1e440ace-8560-4e12-850e-c532740711e7.mp4"
                            className="w-full h-full object-cover"
                            autoPlay
                            loop
                            muted
                            playsInline
                            controlsList="nodownload"
                          ></video>
                          <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-xs text-blue-400 px-2 py-1 rounded">Companion Video</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="text-lg mb-2 text-gray-400">Platform Optimization</h4>
                      <div className="grid grid-cols-4 gap-2">
                        {['Instagram', 'Twitter', 'TikTok', 'LinkedIn'].map((platform, i) => (
                          <div key={platform} className="bg-blue-900 bg-opacity-30 rounded-lg py-2 flex flex-col items-center">
                            <div className="text-xs text-gray-400">{platform}</div>
                            <div className={`text-lg font-bold ${i < 2 ? 'text-green-400' : 'text-blue-400'}`}>
                              {i < 2 ? 'Optimal' : 'Good'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center mb-12">
                  <button 
                    onClick={handlePost}
                    className="relative group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-12 rounded-xl text-xl transition-all duration-300 overflow-hidden flex items-center space-x-3"
                  >
                    <span className="relative z-10">LAUNCH CAMPAIGN</span>
                    <Zap size={20} className="relative z-10" />
                    <span className="absolute top-0 left-0 w-full h-full bg-white opacity-20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                  </button>
                </div>
              </div>
            );
        
      case 'posting':
        return (
          <div className="flex flex-col items-center justify-center w-full h-screen bg-black text-white p-8 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
            
            <div className="relative w-40 h-40 mb-12">
              <div className="absolute inset-0 rounded-full border-4 border-gray-800"></div>
              <div className="absolute inset-0 rounded-full border-t-4 border-r-4 border-blue-500 animate-spin"></div>
              <div className="absolute inset-0 rounded-full border-4 border-transparent flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 animate-pulse" style={{animationDuration: '1.5s'}}></div>
              </div>
            </div>
            
            <h2 className="text-5xl font-bold mb-6 relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600 animate-pulse">Deploying Content</h2>
            <p className="text-xl text-gray-400 relative z-10 mb-8">Launching your creation across global networks...</p>
            
            <div className="w-full max-w-md mb-4">
              <div className="flex justify-between text-sm text-gray-400 mb-1">
                <span>Deployment Progress</span>
                <span className="text-blue-400">67%</span>
              </div>
              <div className="w-full h-2 bg-blue-900 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500" style={{width: '67%'}}></div>
              </div>
            </div>
            
            <div className="flex space-x-8 text-sm text-gray-500">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mb-1"></div>
                <span>Content Verified</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mb-1"></div>
                <span>Networks Connected</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse mb-1"></div>
                <span>Distribution Active</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-gray-700 mb-1"></div>
                <span>Analytics Ready</span>
              </div>
            </div>
          </div>
        );
        
      case 'analytics':
        return (
          <div className="flex flex-col w-full h-screen bg-black text-white overflow-hidden">
            {/* Top header with controls */}
            <div className="bg-black p-4 border-b border-blue-900 flex justify-between items-center sticky top-0 z-40">
              <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
                NOVA X | COMMAND CENTER
              </div>
              <div className="flex items-center m-4 space-x-2">
                <div className="flex items-center space-x-2 bg-blue-900 bg-opacity-30 px-4 py-2 rounded-full">
                  <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                  <span className="text-gray-300">LIVE</span>
                  <span className="text-white font-bold ml-2">{viewerCount.toLocaleString()} active viewers</span>
                </div>
                <button 
                  className="bg-blue-800 hover:bg-blue-700 p-4 rounded-full" 
                  onClick={() => navigate('/home')}
                >
                  Home
                </button>
                <button 
                  className="bg-blue-800 hover:bg-blue-700 p-2 rounded-full" 
                  onClick={() => setShowSidebar(!showSidebar)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                  </svg>
                </button>

              </div>
            </div>
            
            {/* Main content */}
            <div className="flex flex-1 h-full overflow-hidden">
              {/* Sidebar */}
              {showSidebar && (
                <div className="w-64 bg-blue-950 bg-opacity-30 border-r border-blue-900 p-4 flex flex-col overflow-y-auto z-30">
                  <div className="mb-6">
                    <h3 className="text-gray-400 text-sm mb-3">CONTENT STATS</h3>
                    <div className="space-y-3">
                      {Object.entries(engagementData).map(([key, value]) => {
                        let Icon;
                        switch(key) {
                          case 'views': Icon = Eye; break;
                          case 'likes': Icon = Heart; break;
                          case 'comments': Icon = MessageSquare; break;
                          case 'shares': Icon = Share2; break;
                          default: Icon = Eye;
                        }
                        
                        return (
                          <div key={key} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Icon size={16} className="text-blue-400 mr-2" />
                              <span className="capitalize text-gray-300">{key}</span>
                            </div>
                            <span className="font-bold">{value.toLocaleString()}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                  <h3 className="text-white text-xl mb-3">successfully posted on Instagram</h3>
                    <h3 className="text-gray-400 text-sm mb-3">REAL-TIME EVENTS</h3>
                    <div className="space-y-2 max-h-56 overflow-y-auto fancy-scrollbar">
                      {realtimeEvents.map(event => (
                        <div key={event.id} className="flex items-center p-2 bg-blue-900 bg-opacity-20 rounded-lg">
                          <event.icon size={16} className={event.color + " mr-2"} />
                          <div className="text-xs">
                            <span className="text-gray-400">{event.username}</span> <span className={event.color}>
                              {event.type}d
                            </span> from <span className="text-gray-300">{event.location}</span>
                            <div className="text-gray-500 text-xs">{event.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-gray-400 text-sm mb-3">TRENDING WITH POST</h3>
                    <div className="space-y-2">
                      {trending.map((trend, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-blue-900 bg-opacity-20 rounded-lg">
                          <div className="flex items-center">
                            <TrendingUp size={16} className="text-blue-400 mr-2" />
                            <span className="text-blue-300">{trend.name}</span>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-green-400 text-xs">{trend.growth}</span>
                            <span className="text-gray-500 text-xs">{trend.count.toLocaleString()} posts</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-auto">
                    <div className="relative bg-gradient-to-r from-blue-900 to-indigo-900 p-4 rounded-lg overflow-hidden">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500 rounded-full blur-xl opacity-20"></div>
                      <h3 className="font-bold mb-2">AI Recommendations</h3>
                      <p className="text-sm text-gray-300 mb-3">Your content is performing well with tech professionals. Consider a follow-up post highlighting innovation aspects.</p>
                      <button className="bg-blue-700 hover:bg-blue-600 text-sm px-3 py-1 rounded flex items-center">
                        Generate Follow-up <ArrowUpRight size={14} className="ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Main analytics area */}
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Global map view */}
                <div className="relative h-2/3 bg-blue-950 bg-opacity-10">
                  {/* Loading indicator (outside map container) */}
                  {!mapLoaded && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black">
                      <div className="text-blue-400 flex items-center">
                        <Globe className="animate-pulse mr-2" />
                        <span>Loading global engagement map...</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Empty map container - keeping it completely empty for Mapbox */}
                  <div ref={mapContainerRef} className="absolute inset-0 bg-black"></div>
                  
                  {/* Map simulation overlay - only shown when map is loaded */}
                  {mapLoaded && (
                    <div className="absolute inset-0 z-10">
                      {/* Hotspots rendered on top of the map */}
                      {hotspots.map(spot => {
                        // Convert lat/lng to x/y positions
                        const x = ((spot.lng + 180) / 360) * 100;
                        const y = ((90 - spot.lat) / 180) * 100;
                        
                        return (
                          <div 
                            key={spot.id}
                            className={`absolute rounded-full ${pulsing ? 'animate-pulse' : ''}`}
                            style={{
                              top: `${y}%`,
                              left: `${x}%`,
                              width: `${spot.radius}px`,
                              height: `${spot.radius}px`,
                              backgroundColor: `rgba(50, 100, 255, ${spot.intensity * 0.5})`,
                              boxShadow: `0 0 ${spot.radius}px rgba(50, 150, 255, ${spot.intensity * 0.7})`,
                              transform: 'translate(-50%, -50%)',
                              zIndex: Math.floor(spot.viewers / 100)
                            }}
                          >
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 text-xs text-blue-300 font-bold whitespace-nowrap">
                              {spot.viewers}
                            </div>
                          </div>
                        );
                      })}
                      
                      {/* Particle effect */}
                      {[...Array(30)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute rounded-full bg-blue-400"
                          style={{
                            width: '2px',
                            height: '2px',
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            opacity: Math.random() * 0.5 + 0.2,
                            filter: 'blur(1px)',
                            animation: `float ${Math.random() * 10 + 10}s linear infinite`
                          }}
                        ></div>
                      ))}
                    </div>
                  )}
                  
                  {/* Map controls */}
                  <div className="absolute top-4 right-4 flex flex-col space-y-2 z-30">
                    <button 
                      onClick={toggleMapStyle}
                      className="bg-gray-900 bg-opacity-70 p-2 rounded-lg hover:bg-opacity-90 transition-colors"
                      title="Toggle Map Style"
                    >
                      <Globe size={20} className="text-blue-400" />
                    </button>
                    <button 
                      onClick={toggle3DView}
                      className="bg-gray-900 bg-opacity-70 p-2 rounded-lg hover:bg-opacity-90 transition-colors"
                      title="Toggle 3D View"
                    >
                      <Maximize2 size={20} className="text-blue-400" />
                    </button>
                    <button 
                      onClick={() => setPulsing(!pulsing)}
                      className="bg-gray-900 bg-opacity-70 p-2 rounded-lg hover:bg-opacity-90 transition-colors"
                      title="Toggle Pulse Animation"
                    >
                      <Zap size={20} className={pulsing ? "text-blue-400" : "text-gray-400"} />
                    </button>
                  </div>
                  
                  {/* Floating status indicators */}
                  <div className="absolute bottom-4 left-4 z-30 bg-black bg-opacity-70 backdrop-blur-sm rounded-lg p-3 border border-blue-900">
                    <div className="flex items-center space-x-2 text-sm">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                        <span className="text-gray-300">Connected</span>
                      </div>
                      <div className="flex items-center">
                        <Clock size={14} className="text-blue-400 mr-1" />
                        <span className="text-gray-300">Real-time view</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Legend */}
                  <div className="absolute bottom-4 right-4 z-30 bg-black bg-opacity-70 backdrop-blur-sm rounded-lg p-3 border border-blue-900">
                    <div className="flex items-center space-x-1 text-xs mb-1">
                      <span className="text-gray-400">Engagement intensity:</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 rounded-full bg-blue-900"></div>
                      <div className="w-3 h-3 rounded-full bg-blue-700"></div>
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <div className="w-3 h-3 rounded-full bg-blue-300"></div>
                      <span className="text-xs text-gray-400">Low</span>
                      <div className="flex-1 h-1 bg-gradient-to-r from-blue-900 to-blue-300"></div>
                      <span className="text-xs text-gray-400">High</span>
                    </div>
                  </div>
                </div>
                
                {/* Analytics dashboard tiles */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-black overflow-y-auto">
                  {/* Engagement Metrics */}
                  <div className="bg-blue-950 bg-opacity-20 rounded-xl p-4 border border-blue-900">
                    <h3 className="text-gray-400 text-sm mb-2 flex items-center">
                      <Eye size={14} className="mr-1" /> ENGAGEMENT BREAKDOWN
                    </h3>
                    <div className="h-40 relative flex items-end justify-around">
                      {Object.entries(engagementData).map(([key, value], index) => {
                        const maxValue = Math.max(...Object.values(engagementData));
                        const height = (value / maxValue) * 100;
                        const colors = [
                          'from-blue-600 to-blue-400',
                          'from-indigo-600 to-indigo-400',
                          'from-purple-600 to-purple-400',
                          'from-pink-600 to-pink-400'
                        ];
                        
                        return (
                          <div key={key} className="flex flex-col items-center">
                            <div 
                              className={`w-8 rounded-t-lg bg-gradient-to-t ${colors[index]}`}
                              style={{ height: `${height}%` }}
                            ></div>
                            <div className="mt-2 text-xs capitalize">{key}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Demographics Breakdown */}
                  <div className="bg-blue-950 bg-opacity-20 rounded-xl p-4 border border-blue-900">
                    <h3 className="text-gray-400 text-sm mb-2 flex items-center">
                      <User size={14} className="mr-1" /> DEMOGRAPHIC REACH
                    </h3>
                    <div className="h-40 flex items-center justify-center">
                      <div className="w-full h-full flex justify-center items-center relative">
                        {/* Simulated pie chart */}
                        <svg width="100%" height="100%" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="40" fill="transparent" stroke="#1e3a8a" strokeWidth="20" strokeDasharray="251.2" strokeDashoffset="50.24" transform="rotate(-90 50 50)" />
                          <circle cx="50" cy="50" r="40" fill="transparent" stroke="#3b82f6" strokeWidth="20" strokeDasharray="251.2" strokeDashoffset="176.84" transform="rotate(-18 50 50)" />
                          <circle cx="50" cy="50" r="40" fill="transparent" stroke="#60a5fa" strokeWidth="20" strokeDasharray="251.2" strokeDashoffset="213.52" transform="rotate(90 50 50)" />
                        </svg>
                        <div className="absolute text-2xl font-bold text-blue-400">75%</div>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs mt-2">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-blue-800 mr-1"></div>
                        <span>18-24 (40%)</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
                        <span>25-34 (35%)</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-blue-300 mr-1"></div>
                        <span>35+ (25%)</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Performance Metrics */}
                  <div className="bg-blue-950 bg-opacity-20 rounded-xl p-4 border border-blue-900">
                    <h3 className="text-gray-400 text-sm mb-2 flex items-center">
                      <BarChart2 size={14} className="mr-1" /> PERFORMANCE
                    </h3>
                    <div className="h-40 relative">
                      {/* Simulated line chart */}
                      <svg width="100%" height="100%" className="overflow-visible">
                        <defs>
                          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <path 
                          d="M0,80 C20,70 40,30 60,50 C80,70 100,20 120,40 C140,60 160,30 180,20 C200,10 220,30 240,20" 
                          fill="none" 
                          stroke="#3b82f6" 
                          strokeWidth="3"
                        />
                        <path 
                          d="M0,80 C20,70 40,30 60,50 C80,70 100,20 120,40 C140,60 160,30 180,20 C200,10 220,30 240,20 L240,100 L0,100 Z" 
                          fill="url(#lineGradient)" 
                        />
                      </svg>
                      <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500">
                        <span>1h</span>
                        <span>2h</span>
                        <span>3h</span>
                        <span>Now</span>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm mt-2">
                      <div>
                        <div className="text-gray-400">Performance Score</div>
                        <div className="text-blue-400 font-bold">94/100</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Growth Rate</div>
                        <div className="text-green-400 font-bold">+28%</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* AI Insights */}
                  <div className="bg-blue-950 bg-opacity-20 rounded-xl p-4 border border-blue-900">
                    <h3 className="text-gray-400 text-sm mb-2 flex items-center">
                      <Zap size={14} className="mr-1" /> AI INSIGHTS
                    </h3>
                    <div className="h-40 overflow-y-auto text-sm fancy-scrollbar pr-2">
                      <div className="mb-3 pb-3 border-b border-blue-900">
                        <div className="flex items-center text-blue-300 mb-1">
                          <AlertTriangle size={12} className="mr-1" />
                          <span className="font-semibold">Key Observation</span>
                        </div>
                        <p className="text-gray-400">Engagement spikes when tech innovation aspects are emphasized. Recommend adjusting future content.</p>
                      </div>
                      <div className="mb-3 pb-3 border-b border-blue-900">
                        <div className="flex items-center text-blue-300 mb-1">
                          <Target size={12} className="mr-1" />
                          <span className="font-semibold">Audience Insight</span>
                        </div>
                        <p className="text-gray-400">Tech professionals engaging 43% more than anticipated. Strong potential for technical deep-dives.</p>
                      </div>
                      <div>
                        <div className="flex items-center text-blue-300 mb-1">
                          <PieChart size={12} className="mr-1" />
                          <span className="font-semibold">Content Strategy</span>
                        </div>
                        <p className="text-gray-400">Current momentum optimal for product announcement or tech showcase within next 48 hours.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return <div>Unknown phase</div>;
    }
  };
  
  return (
    <div className="w-full min-h-screen bg-black">
      {renderPhase()}
      
      {/* Global CSS */}
      <style jsx global>{`
        .fancy-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        
        .fancy-scrollbar::-webkit-scrollbar-track {
          background: rgba(30, 58, 138, 0.2);
          border-radius: 10px;
        }
        
        .fancy-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.5);
          border-radius: 10px;
        }
        
        @keyframes float {
          0% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(10px, 10px);
          }
          100% {
            transform: translate(0, 0);
          }
        }
        
        /* Fix for mapboxgl popup styling */
        .mapboxgl-popup-content {
          background-color: rgba(0, 0, 0, 0.7) !important;
          border: 1px solid #3b82f6 !important;
          padding: 5px !important;
          border-radius: 5px !important;
          color: white !important;
        }
        
        .mapboxgl-popup-tip {
          border-top-color: #3b82f6 !important;
          border-bottom-color: #3b82f6 !important;
        }
        
        .hotspot-marker {
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default ContentCreatorDashboard;