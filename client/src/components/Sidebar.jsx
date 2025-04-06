import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { ThemeContext } from '../ThemeContext';

const Sidebar = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  
  return (
    <div className="fixed top-0 left-0 w-64 bg-gray-900 text-white h-screen flex flex-col z-10">
      {/* SocialAI Pro Button */}
      <div className="px-4 py-4">
        <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg w-full text-center">
          SocialAI Pro
        </button>
      </div>
      
      {/* Theme Toggle Button */}
      <div className="px-4 pb-2">
        <button 
          onClick={toggleTheme} 
          className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg w-full text-center flex items-center justify-center"
        >
          {theme === "light" ? (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
              Switch to Dark Mode
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Switch to Light Mode
            </>
          )}
        </button>
      </div>
      
      {/* Navigation Menu */}
      <nav className="flex-1 px-4">
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => 
            `flex items-center py-3 px-3 ${isActive ? 'text-blue-400 bg-gray-800 rounded-lg' : 'text-gray-400 hover:text-blue-400'}`
          }
        >
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Dashboard
        </NavLink>
        
        <NavLink 
          to="/content-creation" 
          className={({ isActive }) => 
            `flex items-center py-3 px-3 ${isActive ? 'text-blue-400 bg-gray-800 rounded-lg' : 'text-gray-400 hover:text-blue-400'}`
          }
        >
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          Content Creation
        </NavLink>
        
        <NavLink 
          to="/calendar" 
          className={({ isActive }) => 
            `flex items-center py-3 px-3 ${isActive ? 'text-blue-400 bg-gray-800 rounded-lg' : 'text-gray-400 hover:text-blue-400'}`
          }
        >
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Calendar
        </NavLink>
        <NavLink 
          to="/agent" 
          className={({ isActive }) => 
            `flex items-center py-3 px-3 ${isActive ? 'text-blue-400 bg-gray-800 rounded-lg' : 'text-gray-400 hover:text-blue-400'}`
          }
        >
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Agents Playground
        </NavLink>
        <NavLink 
          to="/post" 
          className={({ isActive }) => 
            `flex items-center py-3 px-3 ${isActive ? 'text-blue-400 bg-gray-800 rounded-lg' : 'text-gray-400 hover:text-blue-400'}`
          }
        >
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Post
        </NavLink>
        <NavLink 
          to="/analyticsdashboard" 
          className={({ isActive }) => 
            `flex items-center py-3 px-3 ${isActive ? 'text-blue-400 bg-gray-800 rounded-lg' : 'text-gray-400 hover:text-blue-400'}`
          }
        >
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Analytics Dashboard
        </NavLink>
        <NavLink 
          to="/analytics" 
          className={({ isActive }) => 
            `flex items-center py-3 px-3 ${isActive ? 'text-blue-400 bg-gray-800 rounded-lg' : 'text-gray-400 hover:text-blue-400'}`
          }
        >
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Analytics
        </NavLink>
        
        <NavLink 
          to="/strategy" 
          className={({ isActive }) => 
            `flex items-center py-3 px-3 ${isActive ? 'text-blue-400 bg-gray-800 rounded-lg' : 'text-gray-400 hover:text-blue-400'}`
          }
        >
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Strategy
        </NavLink>
        
        <NavLink 
          to="/fact-check" 
          className={({ isActive }) => 
            `flex items-center py-3 px-3 ${isActive ? 'text-blue-400 bg-gray-800 rounded-lg' : 'text-gray-400 hover:text-blue-400'}`
          }
        >
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          Fact Check
        </NavLink>
        
        <NavLink 
          to="/settings" 
          className={({ isActive }) => 
            `flex items-center py-3 px-3 ${isActive ? 'text-blue-400 bg-gray-800 rounded-lg' : 'text-gray-400 hover:text-blue-400'}`
          }
        >
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Settings
        </NavLink>
        <NavLink 
          to="/call" 
          className={({ isActive }) => 
            `flex items-center py-3 px-3 ${isActive ? 'text-blue-400 bg-gray-800 rounded-lg' : 'text-gray-400 hover:text-blue-400'}`
          }
        >
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Call
        </NavLink>
      </nav>
      
      {/* Platforms Section */}
      <div className="px-4 mt-4">
        <p className="text-gray-400 mb-2">Platforms</p>
        <div className="flex space-x-2 mb-4">
          <button onClick className="w-16 h-16 bg-pink-500 rounded-lg flex items-center justify-center text-xs">
            Instagram
          </button>
          <div className="w-16 h-16 bg-red-600 rounded-lg flex items-center justify-center text-xs">
            YouTube
          </div>
          <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center text-xs">
            Bluesky
          </div>
        </div>
      </div>
      
      {/* User Profile */}
      <div className="px-4 py-4 flex items-center">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
          JD
        </div>
        <div>
          <p className="font-medium">John Doe</p>
          <p className="text-gray-400 text-sm">Admin</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;