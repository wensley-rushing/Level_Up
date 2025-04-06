import { useState, useEffect, useContext } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Loading from './components/Loading';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import ContentCreation from './pages/ContentCreation';
import Strategy from './pages/Strategy';
import FactCheck from './pages/FactCheck';
import Settings from './pages/Settings';
import SocialAIPro from './pages/Dashboard';
import ContentCreatorDashboard from './pages/Workflow';
import { Contact2 } from 'lucide-react';
import ContentCalendar from './pages/ContentCalender';
import YouTubeAnalyticsDashboard from './pages/AnalyticsDashboard';
import { ThemeContext } from './ThemeContext';
import GTranslate from './components/GTranslate';
import NewDashboard from './components/Dashboard';
import DragDropUserflow from './components/DragDropUserflow';
import { AnimatePresence } from 'framer-motion'; 
import Preloader from './components/Preloader';
import AgentPlayground from './AgentPlayground';
import CallPage from './components/call';

function App() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const {theme} = useContext(ThemeContext);
  const [isPreloading, setIsPreloading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loading />;

  // Decide when to show sidebar
  const hideSidebarRoutes = ['/workflow' , '/'];
  const showSidebar = !hideSidebarRoutes.includes(location.pathname);

  const handlePreloadComplete = () => {
    setIsPreloading(false);
  };


  return (
    <div className={`flex h-full ${theme === 'dark' 
      ? 'bg-gray-900 text-gray-100' 
      : 'bg-gray-100 text-gray-800'}`}>
      {showSidebar && <Sidebar />}
      <GTranslate />
      <AnimatePresence mode="wait">
        {isPreloading ? (
          <Preloader key="preloader" onComplete={handlePreloadComplete} />
        ) : (

      
      <Routes>
        <Route path="/" element={<DragDropUserflow />} />
        <Route path="/home" element={<SocialAIPro />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/content-creation" element={<ContentCreation />} />
        <Route path="/strategy" element={<Strategy />} />
        <Route path="/fact-check" element={<FactCheck />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/calendar" element={<ContentCalendar/>} />
        <Route path="/workflow" element={<ContentCreatorDashboard />} />
        <Route path="/analyticsdashboard" element={<YouTubeAnalyticsDashboard />} />
        <Route path="/post" element={<NewDashboard/>} />
        <Route path="/agent" element={<AgentPlayground/>} />
        <Route path="/call" element={<CallPage/>} />
      </Routes>
        )}
        </AnimatePresence>
    </div>
  );
}

export default App;
