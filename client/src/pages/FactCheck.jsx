import { useState, useEffect, useRef, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, RefreshCw, FileText, Target, Award, Zap, Database, Shield, Eye, Brain, Radio, Network, Cpu } from 'lucide-react';
import { ThemeContext } from '../ThemeContext';

const FactCheck = () => {
  const [facts, setFacts] = useState([]);
  const [agents, setAgents] = useState([]);
  const [connections, setConnections] = useState([]);
  const [messages, setMessages] = useState([]);
  const [animationActive, setAnimationActive] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef(null);
  const { theme } = useContext(ThemeContext);
  
  // Create agent types with different roles and behaviors
  const agentTypes = [
    { type: 'Scraper', icon: <Database size={20} />, color: '#4CAF50', role: 'Data Collection', speed: 0.8 },
    { type: 'Validator', icon: <Shield size={20} />, color: '#2196F3', role: 'Source Verification', speed: 0.6 },
    { type: 'Analyzer', icon: <Eye size={20} />, color: '#9C27B0', role: 'Content Analysis', speed: 0.7 },
    { type: 'Contextualizer', icon: <Brain size={20} />, color: '#FF9800', role: 'Historical Context', speed: 0.5 },
    { type: 'Synthesizer', icon: <Radio size={20} />, color: '#E91E63', role: 'Summary Generation', speed: 0.65 },
    { type: 'Bias Detector', icon: <Target size={20} />, color: '#795548', role: 'Bias Identification', speed: 0.55 },
    { type: 'Language Expert', icon: <FileText size={20} />, color: '#607D8B', role: 'Semantic Analysis', speed: 0.75 },
    { type: 'Domain Expert', icon: <Network size={20} />, color: '#F44336', role: 'Subject Matter Expertise', speed: 0.6 },
  ];

  // Simulated facts that would be analyzed
  const factDatabase = [
    "Mount Everest is the tallest mountain in the world",
    "The Great Wall of China is visible from space",
    "Humans use only 10% of their brains",
    "Einstein failed math as a student",
    "Climate change is primarily caused by human activities",
    "Drinking alcohol kills brain cells permanently",
    "You need to drink 8 glasses of water daily",
    "Carrots significantly improve eyesight",
    "Goldfish have a three-second memory",
    "Eating before swimming causes cramps"
  ];

  // Initialize the system
  useEffect(() => {
    if (!containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const width = containerRect.width;
    const height = containerRect.height;
    
    // Create agents with initial positions spread out evenly
    const initialAgents = [];
    agentTypes.forEach((agentType, index) => {
      // Calculate positions in a more organized way
      const gridSize = Math.ceil(Math.sqrt(agentTypes.length));
      const row = Math.floor(index / gridSize);
      const col = index % gridSize;
      
      const cellWidth = width / gridSize;
      const cellHeight = height / gridSize;
      
      // Add some randomness but keep agents in their "zone"
      const baseX = col * cellWidth + cellWidth / 2;
      const baseY = row * cellHeight + cellHeight / 2;
      
      // Add some random offset (but not too much)
      const x = baseX + (Math.random() - 0.5) * cellWidth * 0.5;
      const y = baseY + (Math.random() - 0.5) * cellHeight * 0.5;
      
      initialAgents.push({
        id: index + 1,
        ...agentType,
        x: x,
        y: y,
        targetX: x,
        targetY: y,
        size: 50, // Make agents slightly larger and uniform size
        processing: false,
        velocity: {
          x: 0,
          y: 0
        }
      });
    });
    
    // Generate connections between agents (fewer, more meaningful connections)
    const initialConnections = [];
    initialAgents.forEach(agent => {
      // Connect to 1-2 other agents based on logical relationships
      // We'll make connections more meaningful rather than random
      const potentialTargets = [];
      
      if (agent.type === 'Scraper') {
        // Scrapers connect to Validators and Analyzers
        potentialTargets.push(...initialAgents.filter(a => 
          a.type === 'Validator' || a.type === 'Analyzer'));
      } 
      else if (agent.type === 'Validator') {
        // Validators connect to Analyzers and Bias Detectors
        potentialTargets.push(...initialAgents.filter(a => 
          a.type === 'Analyzer' || a.type === 'Bias Detector'));
      }
      else if (agent.type === 'Analyzer') {
        // Analyzers connect to Contextualizers and Language Experts
        potentialTargets.push(...initialAgents.filter(a => 
          a.type === 'Contextualizer' || a.type === 'Language Expert'));
      }
      else if (agent.type === 'Contextualizer' || agent.type === 'Language Expert') {
        // These connect to Synthesizers
        potentialTargets.push(...initialAgents.filter(a => 
          a.type === 'Synthesizer' || a.type === 'Domain Expert'));
      }
      else {
        // Others connect to 1-2 random agents
        potentialTargets.push(...initialAgents.filter(a => a.id !== agent.id));
      }
      
      // Shuffle and take 1-2 connections
      potentialTargets.sort(() => Math.random() - 0.5);
      const numConnections = Math.min(1 + Math.floor(Math.random() * 2), potentialTargets.length);
      
      for (let i = 0; i < numConnections; i++) {
        if (i < potentialTargets.length) {
          initialConnections.push({
            id: `${agent.id}-${potentialTargets[i].id}`,
            source: agent.id,
            target: potentialTargets[i].id,
            active: false,
            pulsePosition: 0,
            pulseSpeed: 0.005 + Math.random() * 0.01, // Slower pulse speed
            strength: 0.5 + Math.random() * 0.5,
          });
        }
      }
    });
    
    setAgents(initialAgents);
    setConnections(initialConnections);
  }, []);

  // Animation loop for agent movement (slower and more controlled)
  useEffect(() => {
    if (!animationActive || !containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const width = containerRect.width;
    const height = containerRect.height;
    
    const interval = setInterval(() => {
      // Update agent positions
      setAgents(prevAgents => {
        return prevAgents.map(agent => {
          // Check if agent needs a new target (less frequently)
          const needsNewTarget = Math.random() < 0.005 || 
            (Math.abs(agent.x - agent.targetX) < 5 && Math.abs(agent.y - agent.targetY) < 5);
          
          // Keep targets within reasonable bounds from initial position
          const agentBaseX = agent.x;
          const agentBaseY = agent.y;
          const maxDeviation = 100; // Maximum movement from base position
          
          const newTargetX = needsNewTarget ? 
            agentBaseX + (Math.random() - 0.5) * maxDeviation : 
            agent.targetX;
            
          const newTargetY = needsNewTarget ? 
            agentBaseY + (Math.random() - 0.5) * maxDeviation : 
            agent.targetY;
          
          // Keep agents inside container
          const boundedTargetX = Math.max(50, Math.min(width - 50, newTargetX));
          const boundedTargetY = Math.max(50, Math.min(height - 50, newTargetY));
          
          // Calculate direction to target
          const dx = boundedTargetX - agent.x;
          const dy = boundedTargetY - agent.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Update velocity with smoother movement
          let newVelX = agent.velocity.x;
          let newVelY = agent.velocity.y;
          
          if (distance > 2) {
            newVelX = agent.velocity.x * 0.95 + (dx / distance) * agent.speed * 0.05;
            newVelY = agent.velocity.y * 0.95 + (dy / distance) * agent.speed * 0.05;
          } else {
            // Very close to target, slow down
            newVelX *= 0.9;
            newVelY *= 0.9;
          }
          
          // Add minimal random movement
          newVelX += (Math.random() - 0.5) * 0.05;
          newVelY += (Math.random() - 0.5) * 0.05;
          
          // Limit speed
          const speed = Math.sqrt(newVelX * newVelX + newVelY * newVelY);
          if (speed > agent.speed) {
            newVelX = (newVelX / speed) * agent.speed;
            newVelY = (newVelY / speed) * agent.speed;
          }
          
          // Calculate new position
          let newX = agent.x + newVelX;
          let newY = agent.y + newVelY;
          
          // Boundary checks
          if (newX < 50) {
            newX = 50;
            newVelX = Math.abs(newVelX) * 0.5;
          } else if (newX > width - 50) {
            newX = width - 50;
            newVelX = -Math.abs(newVelX) * 0.5;
          }
          
          if (newY < 50) {
            newY = 50;
            newVelY = Math.abs(newVelY) * 0.5;
          } else if (newY > height - 50) {
            newY = height - 50;
            newVelY = -Math.abs(newVelY) * 0.5;
          }
          
          return {
            ...agent,
            x: newX,
            y: newY,
            targetX: boundedTargetX,
            targetY: boundedTargetY,
            velocity: {
              x: newVelX,
              y: newVelY
            }
          };
        });
      });
      
      // Update connection pulses (slower)
      setConnections(prevConnections => {
        return prevConnections.map(conn => {
          const newPosition = (conn.pulsePosition + conn.pulseSpeed) % 1;
          return {
            ...conn,
            pulsePosition: newPosition,
            active: conn.active && Math.random() > 0.005 ? true : Math.random() < 0.003
          };
        });
      });
      
      // Create new data messages occasionally (less frequently)
      if (Math.random() < 0.03) {
        const randomFact = factDatabase[Math.floor(Math.random() * factDatabase.length)];
        
        // Find a valid connection to activate
        if (connections.length > 0 && agents.length > 0) {
          const randomConnection = connections[Math.floor(Math.random() * connections.length)];
          const sourceAgent = agents.find(a => a.id === randomConnection.source);
          const targetAgent = agents.find(a => a.id === randomConnection.target);
          
          if (sourceAgent && targetAgent) {
            // Activate the connection
            setConnections(prevConnections => {
              return prevConnections.map(conn => {
                if (conn.id === randomConnection.id) {
                  return { ...conn, active: true };
                }
                return conn;
              });
            });
            
            // Add a message
            setMessages(prevMessages => [
              ...prevMessages, 
              {
                id: Date.now(),
                text: randomFact.length > 30 ? randomFact.substring(0, 30) + "..." : randomFact,
                sourceId: sourceAgent.id,
                targetId: targetAgent.id,
                sourceX: sourceAgent.x,
                sourceY: sourceAgent.y,
                targetX: targetAgent.x,
                targetY: targetAgent.y,
                progress: 0,
                color: sourceAgent.color,
                created: Date.now()
              }
            ].slice(-5)); // Limit to 5 messages at a time to reduce clutter
            
            // Set agent as processing
            setAgents(prevAgents => {
              return prevAgents.map(agent => {
                if (agent.id === targetAgent.id) {
                  return { ...agent, processing: true };
                }
                return agent;
              });
            });
          }
        }
      }
      
      // Update message positions and remove old ones
      setMessages(prevMessages => {
        return prevMessages
          .filter(msg => Date.now() - msg.created < 8000)
          .map(msg => {
            // Find current positions of source and target agents
            const sourceAgent = agents.find(agent => agent.id === msg.sourceId);
            const targetAgent = agents.find(agent => agent.id === msg.targetId);
            
            if (!sourceAgent || !targetAgent) return msg;
            
            // Update source and target positions
            let progress = msg.progress + 0.008; // Slower movement
            if (progress > 1) progress = 1;
            
            // When reached target, turn off agent processing
            if (progress === 1 && msg.progress < 1) {
              setAgents(prevAgents => {
                return prevAgents.map(agent => {
                  if (agent.id === msg.targetId) {
                    return { ...agent, processing: false };
                  }
                  return agent;
                });
              });
              
              // Add a fact occasionally
              if (Math.random() < 0.3) {
                setFacts(prevFacts => {
                  const newFact = {
                    id: Date.now(),
                    claim: factDatabase[Math.floor(Math.random() * factDatabase.length)],
                    truth: Math.random() > 0.3 ? 'True' : Math.random() > 0.5 ? 'Misleading' : 'False',
                    confidence: Math.floor(65 + Math.random() * 30), // Higher confidence values
                    sourceAgent: sourceAgent.type,
                    analyzedBy: targetAgent.type,
                    timestamp: new Date().toLocaleTimeString()
                  };
                  return [newFact, ...prevFacts].slice(0, 5);
                });
              }
            }
            
            return {
              ...msg,
              sourceX: sourceAgent.x,
              sourceY: sourceAgent.y,
              targetX: targetAgent.x,
              targetY: targetAgent.y,
              progress
            };
          });
      });
    }, 40); // Slightly slower update interval
    
    return () => clearInterval(interval);
  }, [agents, connections, animationActive]);

  // Simulated search action
  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    // Clear previous facts and add loading state
    setFacts([{ id: 'loading', isLoading: true }]);
    
    // Simulate searching and analyzing
    setTimeout(() => {
      // Generate results
      const results = [];
      for (let i = 0; i < 3; i++) {
        results.push({
          id: Date.now() + i,
          claim: searchQuery,
          truth: Math.random() > 0.3 ? 'True' : Math.random() > 0.5 ? 'Misleading' : 'False',
          confidence: Math.floor(60 + Math.random() * 35),
          sourceAgent: agentTypes[Math.floor(Math.random() * agentTypes.length)].type,
          analyzedBy: agentTypes[Math.floor(Math.random() * agentTypes.length)].type,
          timestamp: new Date().toLocaleTimeString()
        });
      }
      
      setFacts(results);
      setSearchQuery('');
    }, 2000);
  };

  return (
    <div className={`${theme === 'dark' ? 'bg-blue-900/20 text-white' : 'bg-white text-gray-800'} ml-72 w-full h-full rounded-lg shadow-xl overflow-hidden`} style={{ minHeight: '600px' }}>
      {/* Header with controls */}
      <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} p-4 border-b ${theme === 'dark' ? 'border-gray-600' : 'border-gray-700'}`}>
        <div className="flex justify-between items-center mb-2">
          <h2 className={`text-2xl font-bold flex items-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            <Cpu className={`mr-2 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
            Autonomous Fact Verification System
          </h2>
          <div className="flex gap-2">
            <button 
              onClick={() => setAnimationActive(!animationActive)}
              className={`px-3 py-1 rounded text-sm font-bold ${animationActive ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`}
            >
              {animationActive ? 'Pause Agents' : 'Resume Agents'}
            </button>
          </div>
        </div>
        
        <div className="flex gap-2">
          <div className="relative flex-grow">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Enter a claim to verify..."
              className={`w-full p-3 pr-10 ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-600' 
                  : 'bg-gray-700 border-gray-600'
              } border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-white`}
            />
            <Search className="absolute right-3 top-3 text-gray-400" size={20} />
          </div>
          <button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Analyze
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-4 h-full" style={{ height: 'calc(100% - 124px)' }}>
        {/* Agent network visualization */}
        <div className={`col-span-3 relative ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-100/90 text-gray-800'} border-r ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`} ref={containerRef}>
          {/* Render connections */}
          {connections.map((conn) => {
            const sourceAgent = agents.find(a => a.id === conn.source);
            const targetAgent = agents.find(a => a.id === conn.target);
            
            if (!sourceAgent || !targetAgent) return null;
            
            return (
              <svg 
                key={conn.id} 
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
                style={{ zIndex: 1 }}
              >
                <line
                  x1={sourceAgent.x}
                  y1={sourceAgent.y}
                  x2={targetAgent.x}
                  y2={targetAgent.y}
                  stroke={conn.active ? `rgba(100, 200, 255, 0.6)` : theme === 'dark' ? `rgba(150, 150, 150, 0.2)` : `rgba(100, 100, 100, 0.15)`}
                  strokeWidth={conn.active ? 2 : 1}
                  strokeDasharray={conn.active ? "" : "5,5"}
                />
                
                {conn.active && (
                  <circle
                    cx={sourceAgent.x + (targetAgent.x - sourceAgent.x) * conn.pulsePosition}
                    cy={sourceAgent.y + (targetAgent.y - sourceAgent.y) * conn.pulsePosition}
                    r={4}
                    fill="#00FFFF"
                  >
                    <animate attributeName="r" values="3;5;3" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                )}
              </svg>
            );
          })}
          
          {/* Render message packets */}
          {messages.map((msg) => {
            const currentX = msg.sourceX + (msg.targetX - msg.sourceX) * msg.progress;
            const currentY = msg.sourceY + (msg.targetY - msg.sourceY) * msg.progress;
            
            return (
              <motion.div
                key={msg.id}
                className="absolute flex items-center justify-center pointer-events-none"
                style={{
                  left: currentX,
                  top: currentY,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 30
                }}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.9 }}
                exit={{ scale: 0.5, opacity: 0 }}
              >
                <div 
                  className="px-2 py-1 rounded-lg text-xs font-bold shadow-lg"
                  style={{ 
                    backgroundColor: msg.color, 
                    color: '#fff',
                    maxWidth: '150px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {msg.text}
                </div>
              </motion.div>
            );
          })}
          
          {/* Agent labels - separate from agents for clarity */}
          {agents.map((agent) => (
            <div
              key={`label-${agent.id}`}
              className={`absolute ${
                theme === 'dark' 
                  ? 'bg-gray-900 bg-opacity-90' 
                  : 'bg-gray-800 bg-opacity-80'
              } px-2 py-0.5 rounded text-xs font-bold whitespace-nowrap z-10`}
              style={{
                left: agent.x,
                top: agent.y + agent.size/2 + 8,
                transform: 'translate(-50%, 0)'
              }}
            >
              {agent.type}
            </div>
          ))}
          
          {/* Render agents */}
          {agents.map((agent) => (
            <motion.div
              key={agent.id}
              className="absolute flex items-center justify-center cursor-pointer"
              style={{
                left: agent.x,
                top: agent.y,
                transform: 'translate(-50%, -50%)',
                zIndex: 20
              }}
              whileHover={{ scale: 1.1 }}
            >
              <motion.div 
                className="relative flex items-center justify-center rounded-full shadow-lg"
                style={{ 
                  width: agent.size, 
                  height: agent.size, 
                  backgroundColor: agent.color,
                  opacity: 0.9
                }}
                animate={{
                  scale: agent.processing ? [1, 1.1, 1] : 1,
                  transition: { 
                    scale: { repeat: agent.processing ? Infinity : 0, duration: 1 }
                  }
                }}
              >
                <div className="text-white">
                  {agent.icon}
                </div>
                
                {agent.processing && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2"
                    style={{ borderColor: agent.color }}
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [1, 0.4, 1]
                    }}
                    transition={{ 
                      repeat: Infinity,
                      duration: 2
                    }}
                  />
                )}
              </motion.div>
            </motion.div>
          ))}
        </div>
        
        {/* Real-time results panel */}
        <div className={`col-span-1 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'} p-4 overflow-y-auto`}>
          <h3 className={`font-bold text-lg mb-3 flex items-center ${theme === 'dark' ? '' : 'text-gray-800'}`}>
            <Zap className={`mr-2 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`} size={18} />
            Live Verification Results
          </h3>
          
          <AnimatePresence>
            {facts.map((fact, index) => (
              <motion.div
                key={fact.id}
                className={`mb-4 p-3 ${
                  theme === 'dark' 
                    ? 'bg-gray-800' 
                    : 'bg-gray-700'
                } rounded-lg border-l-4 shadow-md`}
                style={{ borderLeftColor: fact.truth === 'True' ? '#4CAF50' : fact.truth === 'Misleading' ? '#FF9800' : '#F44336' }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                {fact.isLoading ? (
                  <div className="flex items-center justify-center h-20">
                    <RefreshCw className="animate-spin text-blue-400" size={24} />
                    <span className="ml-2">Analyzing facts...</span>
                  </div>
                ) : (
                  <>
                    <p className="font-medium mb-2">{fact.claim}</p>
                    <div className="flex justify-between items-center mb-2">
                      <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                        fact.truth === 'True' ? 'bg-green-900 text-green-300' : 
                        fact.truth === 'Misleading' ? 'bg-yellow-900 text-yellow-300' : 
                        'bg-red-900 text-red-300'
                      }`}>
                        {fact.truth} ({fact.confidence}% confidence)
                      </span>
                      <span className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-400'}`}>{fact.timestamp}</span>
                    </div>
                    <div className={`flex justify-between text-xs ${theme === 'dark' ? 'text-gray-300 border-gray-700' : 'text-gray-400 border-gray-600'} pt-2 border-t`}>
                      <span>Source: {fact.sourceAgent}</span>
                      <span>Analysis: {fact.analyzedBy}</span>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          
          {facts.length === 0 && (
            <div className={`text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mt-10`}>
              <RefreshCw className="animate-spin mx-auto mb-3" size={24} />
              Waiting for facts to analyze...
            </div>
          )}
        </div>
      </div>
      
      {/* Status bar */}
      <div className={`${theme === 'dark' ? 'bg-gray-900 border-gray-600 text-gray-300' : 'bg-gray-100 border-gray-300 text-gray-600'} border-t p-2 text-xs flex justify-between`}>
        <div>Active Agents: {agents.length}</div>
        <div>Network Connections: {connections.length}</div>
        <div>Processing: {agents.filter(a => a.processing).length} agents</div>
        <div>System Status: <span className="text-green-400">Online</span></div>
        <div className="flex items-center">
          <span className="mr-1">System Pulse</span>
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default FactCheck;