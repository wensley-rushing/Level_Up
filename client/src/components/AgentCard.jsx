
// src/components/AgentCard.jsx
import React, { useState } from 'react';

const AgentCard = ({ agent, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className={`${agent.color} p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform ${isHovered ? 'scale-105' : ''} cursor-pointer`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-4xl">{agent.icon}</span>
        <div className="bg-white rounded-full h-8 w-8 flex items-center justify-center shadow-sm">
          <span className="text-gray-600 text-xs">AI</span>
        </div>
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{agent.name}</h3>
      <p className="text-gray-600">{agent.description}</p>
      <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
        <span className="text-sm text-gray-500">Try Now</span>
        <span className={`text-purple-600 text-2xl transition-transform duration-300 ${isHovered ? 'translate-x-2' : ''}`}>→</span>
      </div>
    </div>
  );
};

export default AgentCard;

