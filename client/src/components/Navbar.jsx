
import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">🤖</span>
          <span className="text-xl font-bold text-gray-800">AI Agent Playground</span>
        </div>
        <div className="hidden md:flex space-x-6">
          <a href="#" className="text-gray-600 hover:text-gray-900">Home</a>
          <a href="#" className="text-gray-600 hover:text-gray-900">About</a>
          <a href="#" className="text-gray-600 hover:text-gray-900">Documentation</a>
        </div>
        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
          Contact
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

