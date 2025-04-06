
// src/App.jsx
import React, { useState } from 'react';
import AgentCard from '../src/components/AgentCard';
import AgentModal from '../src/components/AgentModal';
import Navbar from '../src/components/Navbar';

const AgentPlayground = () => {
  const [selectedAgent, setSelectedAgent] = useState(null);
  
  // List of agents based on your backend endpoints
  const agents = [
    {
      id: 1,
      name: "Comment Analyzer",
      description: "Analyze and summarize   tweet comments",
      icon: "💬",
      color: "bg-purple-100",
      endpoint: "/api/summarize-comments/",
    },
    {
      id: 2,
      name: "Context Bridge",
      description: "Process tweets with contextual understanding",
      icon: "🌉",
      color: "bg-blue-100",
      endpoint: "/api/process-tweet/",
    },
    {
      id: 3,
      name: "Fact Checker",
      description: "Verify facts in content",
      icon: "✓",
      color: "bg-green-100",
      endpoint: "/api/fact-check/",
    },
    {
      id: 4,
      name: "Celebrity Impersonator",
      description: "Generate content in celebrity styles",
      icon: "🎭",
      color: "bg-yellow-100",
      endpoint: "/api/generate/",
    },
    {
      id: 5,
      name: "Meme Generator", // Changed from "Meme Creator"
      description: "Generate creative memes",
      icon: "🖼",
      color: "bg-pink-100",
      endpoint: "/api/generate-meme/",
    },
    {
      id: 6,
      name: "Picture Perfect",
      description: "Analyze images with AI",
      icon: "📷",
      color: "bg-red-100",
      endpoint: "/api/analyze-image/",
    },
    {
      id: 7,
      name: "Screenshot Research",
      description: "Analyze screenshots for insights",
      icon: "🔍",
      color: "bg-indigo-100",
      endpoint: "/api/analyze/",
    },
    {
      id: 8,
      name: "Sentiment Analyzer",
      description: "Analyze tweet sentiment",
      icon: "😊",
      color: "bg-teal-100",
      endpoint: "/api/analyze-tweet/",
    },
    {
      id: 9,
      name: "Viral Thread Generator",
      description: "Create engaging viral threads",
      icon: "🧵",
      color: "bg-orange-100",
      endpoint: "/api/generate-thread/",
    },
  ];

  const handleAgentClick = (agent) => {
    setSelectedAgent(agent);
  };

  const closeModal = () => {
    setSelectedAgent(null);
  };

  return (
    <div className="min-h-screen ml-72 bg-gradient-to-br from-white to-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">AI Agent Playground</h1>
          <p className="text-xl text-gray-600">Explore and test various AI agents with different capabilities</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {agents.map((agent) => (
            <AgentCard 
              key={agent.id} 
              agent={agent} 
              onClick={() => handleAgentClick(agent)} 
            />
          ))}
        </div>
      </div>

      {selectedAgent && (
        <AgentModal 
          agent={selectedAgent} 
          onClose={closeModal} 
          baseUrl="http://127.0.0.1:8000"
        />
      )}
    </div>
  );
};

export default AgentPlayground;
