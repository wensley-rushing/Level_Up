
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DragDropUserflow = () => {
  const [tools, setTools] = useState([
    { id: 'tool-1', name: 'Screenshot + Research Agent', icon: '🔍', color: '#6366f1', route: '/api/analyze/' },
    { id: 'tool-2', name: 'Impersonation Agent', icon: '👤', color: '#ec4899', route: '/api/generate/' },
    { id: 'tool-3', name: 'Viral Thread Generator', icon: '🧵', color: '#f59e0b', route: '/api/generate-thread/' },
    { id: 'tool-4', name: 'Fact-Checker Agent', icon: '✓', color: '#10b981', route: '/api/fact-check/' },
    { id: 'tool-5', name: 'Sentiment Analyzer', icon: '😊', color: '#3b82f6', route: '/api/analyze-tweet/' },
    { id: 'tool-6', name: 'Meme Creator', icon: '🖼', color: '#8b5cf6', route: '/api/generate-meme/' },
    { id: 'tool-7', name: 'Context Bridge', icon: '🌉', color: '#ef4444', route: '/api/analyze-tweet/' },
  ]);
  
  const [socialIntegrations, setSocialIntegrations] = useState([
    { id: 'social-1', name: 'Instagram Post', icon: '📸', color: '#E1306C', route: '/api/post/instagram' },
    { id: 'social-2', name: 'Bluesky Post', icon: '🔷', color: '#0085FF', route: '/api/post/bluesky' },
    { id: 'social-3', name: 'Instagram Analytics', icon: '📊', color: '#C13584', route: '/api/analytics/instagram' },
    { id: 'social-4', name: 'Bluesky Analytics', icon: '📈', color: '#1DA1F2', route: '/api/analytics/bluesky' },
    { id: 'social-5', name: 'YouTube Analytics', icon: '▶', color: '#FF0000', route: '/api/analytics/youtube' },
  ]);
  
  const [canvasItems, setCanvasItems] = useState([
    { id: 'canvas-1', toolId: 'tool-1', x: 100, y: 100, label: 'Research Competitor Content', config: {} },
    { id: 'canvas-2', toolId: 'tool-3', x: 300, y: 100, label: 'Generate Viral Thread', config: {} },
    { id: 'canvas-3', toolId: 'social-1', x: 500, y: 100, label: 'Post to Instagram', config: {} },
  ]);
  
  const [connections, setConnections] = useState([
    { id: 'conn-1', from: 'canvas-1', to: 'canvas-2', fromPoint: 'right', toPoint: 'left' },
    { id: 'conn-2', from: 'canvas-2', to: 'canvas-3', fromPoint: 'right', toPoint: 'left' },
  ]);
  
  const [draggedItem, setDraggedItem] = useState(null);
  const [draggingCanvas, setDraggingCanvas] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStart, setConnectionStart] = useState(null);
  const [connectionStartPoint, setConnectionStartPoint] = useState(null);
  const canvasRef = useRef(null);
  const [canvasScale, setCanvasScale] = useState(1);
  const [hoveredConnection, setHoveredConnection] = useState(null);
  const [workflowName, setWorkflowName] = useState('Untitled Workflow');
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isSaving, setIsSaving] = useState(false);
  const [showConfigPanel, setShowConfigPanel] = useState(false);
  const [showConnectionConfig, setShowConnectionConfig] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [showMiniMap, setShowMiniMap] = useState(true);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionProgress, setExecutionProgress] = useState(null);
  const navigate = useNavigate();

  // Save initial state to history on component mount
  useEffect(() => {
    saveToHistory();
  }, []);

  const handleToolDragStart = (e, tool) => {
    setDraggedItem({ ...tool });
    setIsDragging(true);
  };

  const handleCanvasDrop = (e) => {
    e.preventDefault();
    if (draggedItem) {
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - canvasRect.left) / canvasScale;
      const y = (e.clientY - canvasRect.top) / canvasScale;
      
      const newItem = {
        id: `canvas-${Date.now()}`,
        toolId: draggedItem.id,
        x, y,
        label: `New ${draggedItem.name}`,
        config: {}
      };
      
      setCanvasItems([...canvasItems, newItem]);
      saveToHistory();
      setDraggedItem(null);
      setIsDragging(false);
      setSelectedItem(newItem);
      setShowConfigPanel(true);
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleCanvasItemDragStart = (e, item) => {
    e.stopPropagation();
    if (!e.target.closest('.connection-point') && !e.target.closest('.config-button')) {
      const canvasRect = canvasRef.current.getBoundingClientRect();
      setStartPos({
        x: e.clientX - canvasRect.left - item.x * canvasScale,
        y: e.clientY - canvasRect.top - item.y * canvasScale
      });
      setDraggingCanvas(true);
      setSelectedItem(item);
    }
  };

  const handleConnectionPointClick = (e, item, pointType) => {
    e.stopPropagation();
    if (isConnecting) {
      if (connectionStart && connectionStart.id !== item.id) {
        const newConnection = {
          id: `conn-${Date.now()}`,
          from: connectionStart.id,
          to: item.id,
          fromPoint: connectionStartPoint,
          toPoint: pointType,
          config: { 
            transformations: [],
            condition: null
          }
        };
        if (!connections.some(conn => 
          conn.from === newConnection.from && 
          conn.to === newConnection.to &&
          conn.fromPoint === newConnection.fromPoint &&
          conn.toPoint === newConnection.toPoint
        )) {
          setConnections([...connections, newConnection]);
          setSelectedConnection(newConnection);
          setShowConnectionConfig(true);
          saveToHistory();
        }
        setIsConnecting(false);
        setConnectionStart(null);
        setConnectionStartPoint(null);
      }
    } else {
      setIsConnecting(true);
      setConnectionStart(item);
      setConnectionStartPoint(pointType);
    }
  };

  const handleCanvasMouseMove = (e) => {
    if (draggingCanvas && selectedItem) {
      e.preventDefault();
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - canvasRect.left - startPos.x) / canvasScale;
      const y = (e.clientY - canvasRect.top - startPos.y) / canvasScale;
      
      setCanvasItems(canvasItems.map(item => 
        item.id === selectedItem.id ? { ...item, x, y } : item
      ));
    }
  };

  const handleCanvasMouseUp = () => {
    if (draggingCanvas) saveToHistory();
    setDraggingCanvas(false);
  };

  const handleCanvasClick = () => {
    if (isConnecting) {
      setIsConnecting(false);
      setConnectionStart(null);
      setConnectionStartPoint(null);
    }
    setSelectedItem(null);
    setShowConfigPanel(false);
    setSelectedConnection(null);
    setShowConnectionConfig(false);
  };

  const handleNodeClick = (e, item) => {
    e.stopPropagation();
    setSelectedItem(item);
    setShowConfigPanel(true);
    setSelectedConnection(null);
    setShowConnectionConfig(false);
  };

  const handleDeleteConnection = (e, connectionId) => {
    e.stopPropagation();
    setConnections(connections.filter(conn => conn.id !== connectionId));
    if (selectedConnection && selectedConnection.id === connectionId) {
      setSelectedConnection(null);
      setShowConnectionConfig(false);
    }
    saveToHistory();
  };

  const handleConnectionClick = (e, connection) => {
    e.stopPropagation();
    setSelectedConnection(connection);
    setShowConnectionConfig(true);
    setSelectedItem(null);
    setShowConfigPanel(false);
  };

  const handleDeleteNode = (itemId) => {
    // Remove all connections related to this node
    const filteredConnections = connections.filter(
      conn => conn.from !== itemId && conn.to !== itemId
    );
    setConnections(filteredConnections);
    
    // Remove the node itself
    setCanvasItems(canvasItems.filter(item => item.id !== itemId));
    setSelectedItem(null);
    setShowConfigPanel(false);
    saveToHistory();
  };

  const handleUpdateNodeConfig = (itemId, newConfig) => {
    setCanvasItems(canvasItems.map(item => 
      item.id === itemId ? { ...item, config: { ...item.config, ...newConfig } } : item
    ));
    saveToHistory();
  };

  const handleUpdateNodeLabel = (itemId, newLabel) => {
    setCanvasItems(canvasItems.map(item => 
      item.id === itemId ? { ...item, label: newLabel } : item
    ));
    saveToHistory();
  };

  const handleUpdateConnectionConfig = (connectionId, newConfig) => {
    setConnections(connections.map(conn => 
      conn.id === connectionId ? { ...conn, config: { ...conn.config, ...newConfig } } : conn
    ));
    saveToHistory();
  };

  const getItemById = (id) => {
    const canvasItem = canvasItems.find(item => item.id === id);
    if (canvasItem) {
      const toolOrIntegration = canvasItem.toolId.startsWith('social-') 
        ? socialIntegrations.find(i => i.id === canvasItem.toolId) 
        : tools.find(i => i.id === canvasItem.toolId);
      return { ...canvasItem, details: toolOrIntegration };
    }
    return null;
  };

  const getBezierPoints = (fromX, fromY, toX, toY, fromPoint, toPoint) => {
    let dx = Math.abs(toX - fromX) * 0.5;
    let dy = Math.abs(toY - fromY) * 0.5;
    if (fromPoint === 'right' || fromPoint === 'left') {
      dx = Math.abs(toX - fromX) * 0.5;
      dy = 0;
    } else {
      dx = 0;
      dy = Math.abs(toY - fromY) * 0.5;
    }
    return {
      cp1x: fromPoint === 'left' ? fromX - dx : fromPoint === 'right' ? fromX + dx : fromX,
      cp1y: fromPoint === 'top' ? fromY - dy : fromPoint === 'bottom' ? fromY + dy : fromY,
      cp2x: toPoint === 'left' ? toX - dx : toPoint === 'right' ? toX + dx : toX,
      cp2y: toPoint === 'top' ? toY - dy : toPoint === 'bottom' ? toY + dy : toY
    };
  };

  const getNodeConnectionPoint = (itemId, pointType) => {
    const item = canvasItems.find(i => i.id === itemId);
    if (!item) return { x: 0, y: 0 };
    const itemElement = document.getElementById(item.id);
    let width = 180, height = 48;
    if (itemElement) {
      width = itemElement.offsetWidth;
      height = itemElement.offsetHeight;
    }
    switch (pointType) {
      case 'top': return { x: item.x + width/2, y: item.y };
      case 'right': return { x: item.x + width, y: item.y + height/2 };
      case 'bottom': return { x: item.x + width/2, y: item.y + height };
      case 'left': return { x: item.x, y: item.y + height/2 };
      default: return { x: item.x + width/2, y: item.y + height/2 };
    }
  };

  const renderConnections = () => {
    return connections.map(connection => {
      const fromPoint = getNodeConnectionPoint(connection.from, connection.fromPoint);
      const toPoint = getNodeConnectionPoint(connection.to, connection.toPoint);
      if (!fromPoint || !toPoint) return null;
      const isHovered = hoveredConnection === connection.id;
      const isSelected = selectedConnection && selectedConnection.id === connection.id;
      const { cp1x, cp1y, cp2x, cp2y } = getBezierPoints(
        fromPoint.x, fromPoint.y, toPoint.x, toPoint.y,
        connection.fromPoint, connection.toPoint
      );
      const pathData = `M ${fromPoint.x} ${fromPoint.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${toPoint.x} ${toPoint.y}`;
      const midX = (fromPoint.x + toPoint.x) / 2;
      const midY = (fromPoint.y + toPoint.y) / 2;
      
      // Check if this connection is part of the execution progress
      const isExecuting = executionProgress && 
                          executionProgress.currentNode === connection.to && 
                          executionProgress.previousNode === connection.from;
      
      const strokeColor = isExecuting ? "#22c55e" : 
                          isSelected ? "#8b5cf6" : 
                          isHovered ? "#6366f1" : 
                          "#475569";
      
      const strokeWidth = isExecuting ? "3" : 
                          isSelected ? "2.5" : 
                          isHovered ? "2" : "1.5";
      
      return (
        <g 
          key={connection.id} 
          className="connection"
          onMouseEnter={() => setHoveredConnection(connection.id)}
          onMouseLeave={() => setHoveredConnection(null)}
          onClick={(e) => handleConnectionClick(e, connection)}
        >
          <path
            d={pathData}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            markerEnd={`url(#arrow-${isExecuting ? 'executing' : isSelected ? 'selected' : isHovered ? 'hover' : 'default'})`}
            style={{ transition: "all 0.3s ease" }}
            className={isExecuting ? "animate-pulse" : ""}
          />
          {(isHovered || isSelected) && (
            <>
              <circle
                cx={midX}
                cy={midY}
                r="12"
                fill={darkMode ? "#1e293b" : "#f8fafc"}
                stroke={isSelected ? "#8b5cf6" : "#6366f1"}
                strokeWidth="1.5"
                style={{ pointerEvents: 'all' }}
              />
              <circle
                cx={midX}
                cy={midY}
                r="8"
                fill={isSelected ? "#8b5cf6" : "#6366f1"}
                stroke={darkMode ? "#1e293b" : "#f8fafc"}
                strokeWidth="1.5"
                className="cursor-pointer"
                onClick={(e) => handleConnectionClick(e, connection)}
                style={{ pointerEvents: 'all' }}
              />
              {isHovered && !isSelected && (
                <circle
                  cx={midX + 16}
                  cy={midY - 16}
                  r="8"
                  fill="#ef4444"
                  stroke={darkMode ? "#1e293b" : "#f8fafc"}
                  strokeWidth="1.5"
                  className="cursor-pointer"
                  onClick={(e) => handleDeleteConnection(e, connection.id)}
                  style={{ pointerEvents: 'all' }}
                />
              )}
            </>
          )}
          {connection.config && connection.config.transformations && connection.config.transformations.length > 0 && (
            <circle
              cx={midX}
              cy={midY}
              r="4"
              fill="#f59e0b"
              stroke={darkMode ? "#1e293b" : "#f8fafc"}
              strokeWidth="1"
            />
          )}
        </g>
      );
    });
  };

  const renderTempConnection = () => {
    if (!isConnecting || !connectionStart || !connectionStartPoint) return null;
    const fromPoint = getNodeConnectionPoint(connectionStart.id, connectionStartPoint);
    return (
      <line
        x1={fromPoint.x}
        y1={fromPoint.y}
        x2={startPos.x / canvasScale}
        y2={startPos.y / canvasScale}
        stroke="#8b5cf6"
        strokeWidth="2"
        strokeDasharray="4,4"
      />
    );
  };

  const handleMouseMove = (e) => {
    if (isConnecting) {
      const canvasRect = canvasRef.current.getBoundingClientRect();
      setStartPos({
        x: e.clientX - canvasRect.left,
        y: e.clientY - canvasRect.top
      });
    }
    handleCanvasMouseMove(e);
  };

  const handleWheel = (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.05 : 0.05;
      setCanvasScale(prev => Math.min(Math.max(prev + delta, 0.5), 2));
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('wheel', handleWheel, { passive: false });
      return () => canvas.removeEventListener('wheel', handleWheel);
    }
  }, []);

  const renderConnectionPoint = (item, position) => {
    const isActive = isConnecting && connectionStart && connectionStart.id === item.id && connectionStartPoint === position;
    const tool = getItemById(item.id);
    const baseColor = tool && tool.details ? tool.details.color : "#6366f1";
    
    return (
      <div 
        className={`connection-point absolute w-3 h-3 rounded-full border ${
          darkMode ? 'border-gray-800' : 'border-white'
        } cursor-pointer ${
          isActive ? 'animate-pulse' : ''
        } hover:scale-125 transition-all z-20`}
        style={{
          [position === 'left' ? 'left' : position === 'right' ? 'right' : 'left']: position === 'top' || position === 'bottom' ? '50%' : '-4px',
          [position === 'top' ? 'top' : position === 'bottom' ? 'bottom' : 'top']: position === 'left' || position === 'right' ? '50%' : '-4px',
          transform: (position === 'top' || position === 'bottom') ? 'translateX(-50%)' : 'translateY(-50%)',
          backgroundColor: isActive ? '#8b5cf6' : baseColor,
        }}
        onClick={(e) => handleConnectionPointClick(e, item, position)}
      />
    );
  };

  const saveToHistory = () => {
    const newState = { canvasItems, connections };
    const newHistory = history.slice(0, historyIndex + 1);
    setHistory([...newHistory, newState]);
    setHistoryIndex(newHistory.length);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setCanvasItems(prevState.canvasItems);
      setConnections(prevState.connections);
      setHistoryIndex(historyIndex - 1);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setCanvasItems(nextState.canvasItems);
      setConnections(nextState.connections);
      setHistoryIndex(historyIndex + 1);
    }
  };

  const handleSaveWorkflow = async () => {
    setIsSaving(true);
    const workflowData = {
      tools,
      socialIntegrations,
      canvasItems,
      connections,
      createdAt: new Date().toISOString(),
      id: `workflow-${Date.now()}`,
      name: workflowName || 'Untitled Workflow'
    };
    try {
      localStorage.setItem(workflowData.id, JSON.stringify(workflowData));
      navigate('/workflow');
    } catch (error) {
      console.error('Error saving workflow:', error);
      alert('Failed to save workflow. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportWorkflow = () => {
    const workflowData = { 
      tools, 
      socialIntegrations, 
      canvasItems, 
      connections, 
      name: workflowName 
    };
    const jsonString = JSON.stringify(workflowData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${workflowName || 'workflow'}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportWorkflow = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedData = JSON.parse(event.target.result);
          if (importedData.tools) setTools(importedData.tools);
          if (importedData.socialIntegrations) setSocialIntegrations(importedData.socialIntegrations);
          setCanvasItems(importedData.canvasItems);
          setConnections(importedData.connections);
          setWorkflowName(importedData.name);
          saveToHistory();
        } catch (error) {
          alert('Invalid workflow file');
        }
      };
      reader.readAsText(file);
    }
  };

  const simulateWorkflowExecution = async () => {
    if (canvasItems.length === 0) return;
    
    setIsExecuting(true);
    
    // Find starting nodes (nodes with no incoming connections)
    const incomingConnections = {};
    connections.forEach(conn => {
      if (!incomingConnections[conn.to]) incomingConnections[conn.to] = [];
      incomingConnections[conn.to].push(conn.from);
    });
    
    const startingNodes = canvasItems.filter(item => !incomingConnections[item.id]);
    if (startingNodes.length === 0) {
      setIsExecuting(false);
      return;
    }
    
    // Process each starting node
    for (const startNode of startingNodes) {
      await processNode(startNode.id);
    }
    
    setIsExecuting(false);
    setExecutionProgress(null);
  };
  
  const processNode = async (nodeId, previousNodeId = null) => {
    // Update execution progress
    setExecutionProgress({
      currentNode: nodeId,
      previousNode: previousNodeId,
    });
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find outgoing connections from this node
    const outgoingConnections = connections.filter(conn => conn.from === nodeId);
    
    // Process each connected node
    for (const conn of outgoingConnections) {
      await processNode(conn.to, nodeId);
    }
  };

  const renderConfigPanel = () => {
    if (!showConfigPanel || !selectedItem) return null;
    
    const itemDetails = getItemById(selectedItem.id);
    
    return (
      <div className={`absolute right-0 top-0 w-72 h-full overflow-y-auto ${
        darkMode ? 'bg-gray-900 text-gray-200' : 'bg-white text-gray-800'
      } border-l ${
        darkMode ? 'border-gray-700' : 'border-gray-200'
      } shadow-lg`}>
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-lg">Node Configuration</h3>
            <button 
              className={`p-1 rounded-full ${
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
              onClick={() => setShowConfigPanel(false)}
            >
              ✕
            </button>
          </div>
          
          <div className="mb-4">
            <label className={`block text-sm font-medium mb-1 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Label
            </label>
            <input 
              type="text" 
              value={selectedItem.label} 
              onChange={(e) => handleUpdateNodeLabel(selectedItem.id, e.target.value)}
              className={`w-full px-3 py-2 rounded-md ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'
              } border`}
            />
          </div>
          
          <div className="mb-4">
            <label className={`block text-sm font-medium mb-1 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Tool Type
            </label>
            <div className={`px-3 py-2 rounded-md ${
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'
            } border flex items-center`}>
              <span className="mr-2" style={{ color: itemDetails?.details?.color }}>
                {itemDetails?.details?.icon}
              </span>
              {itemDetails?.details?.name}
            </div>
          </div>
          
          {/* Node-specific configuration options would go here */}
          {itemDetails?.toolId === 'tool-3' && (
            <div className="mb-4">
              <label className={`block text-sm font-medium mb-1 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Thread Length
              </label>
              <select
                value={selectedItem.config?.threadLength || 5}
                onChange={(e) => handleUpdateNodeConfig(selectedItem.id, { threadLength: parseInt(e.target.value) })}
                className={`w-full px-3 py-2 rounded-md ${
                  darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'
                } border`}
              >
                <option value={3}>Short (3 tweets)</option>
                <option value={5}>Medium (5 tweets)</option>
                <option value={10}>Long (10 tweets)</option>
              </select>
            </div>
          )}
          
          <div className="mt-6">
            <button 
              onClick={() => handleDeleteNode(selectedItem.id)}
              className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
            >
              Delete Node
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderConnectionConfigPanel = () => {
    if (!showConnectionConfig || !selectedConnection) return null;
    
    const fromNode = getItemById(selectedConnection.from);
    const toNode = getItemById(selectedConnection.to);
    
    return (
      <div className={`absolute right-0 top-0 w-72 h-full overflow-y-auto ${
        darkMode ? 'bg-gray-900 text-gray-200' : 'bg-white text-gray-800'
      } border-l ${
        darkMode ? 'border-gray-700' : 'border-gray-200'
      } shadow-lg`}>
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-lg">Connection Settings</h3>
            <button 
              className={`p-1 rounded-full ${
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
              onClick={() => setShowConnectionConfig(false)}
            >
              ✕
            </button>
          </div>
          
          <div className="mb-4">
            <div className={`px-3 py-2 rounded-md ${
              darkMode ? 'bg-gray-800' : 'bg-gray-100'
            } flex items-center justify-between`}>
              <div className="flex items-center">
                <span className="mr-2" style={{ color: fromNode?.details?.color }}>
                  {fromNode?.details?.icon}
                </span>
                <span className="text-sm truncate max-w-[100px]">{fromNode?.label}</span>
              </div>
              <span className="mx-2">→</span>
              <div className="flex items-center">
                <span className="mr-2" style={{ color: toNode?.details?.color }}>
                  {toNode?.details?.icon}
                </span>
                <span className="text-sm truncate max-w-[100px]">{toNode?.label}</span>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <label className={`block text-sm font-medium mb-1 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Add Transformation
            </label>
            <div className="flex space-x-2">
              <select
                className={`flex-1 px-3 py-2 rounded-md ${
                  darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'
                } border`}
              >
                <option value="">Select...</option>
                <option value="filter">Filter Content</option>
                <option value="transform">Transform Data</option>
                <option value="delay">Add Delay</option>
              </select>
              <button 
                className={`px-3 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white transition-colors`}
              >
                +
              </button>
            </div>
          </div>
          
          {selectedConnection.config && selectedConnection.config.transformations && selectedConnection.config.transformations.length > 0 ? (
            <div className="mb-4">
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Applied Transformations
              </label>
              <ul className={`rounded-md ${
                darkMode ? 'bg-gray-800' : 'bg-gray-50'
              } border ${
                darkMode ? 'border-gray-700' : 'border-gray-300'
              } divide-y ${
                darkMode ? 'divide-gray-700' : 'divide-gray-200'
              }`}>
                {selectedConnection.config.transformations.map((transform, idx) => (
                  <li key={idx} className="p-2 flex justify-between items-center">
                    <span>{transform.type}</span>
                    <button className="text-red-500 hover:text-red-600">×</button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className={`mb-4 p-3 text-sm rounded-md ${
              darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-50 text-gray-500'
            } border ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              No transformations applied
            </div>
          )}
          
          <div className="mt-6">
            <button 
              onClick={(e) => handleDeleteConnection(e, selectedConnection.id)}
              className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
            >
              Delete Connection
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderMiniMap = () => {
    if (!showMiniMap) return null;
    
    const miniMapWidth = 200;
    const miniMapHeight = 150;
    const padding = 20;
    
    // Find bounds of all nodes
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    canvasItems.forEach(item => {
      minX = Math.min(minX, item.x);
      minY = Math.min(minY, item.y);
      maxX = Math.max(maxX, item.x + 180); // Approximate node width
      maxY = Math.max(maxY, item.y + 50);  // Approximate node height
    });
    
    // Add padding
    minX -= padding;
    minY -= padding;
    maxX += padding;
    maxY += padding;
    
    const contentWidth = maxX - minX;
    const contentHeight = maxY - minY;
    
    // Calculate scale factor
    const scaleX = miniMapWidth / contentWidth;
    const scaleY = miniMapHeight / contentHeight;
    const scale = Math.min(scaleX, scaleY);
    
    return (
      <div className={`absolute bottom-4  right-4 w-[200px] h-[150px] ${
        darkMode ? 'bg-gray-900/80' : 'bg-white/80'
      } border ${
        darkMode ? 'border-gray-700' : 'border-gray-300'
      } rounded-lg shadow-lg overflow-hidden`}>
        <svg width={miniMapWidth} height={miniMapHeight}>
          {/* Nodes */}
          {canvasItems.map(item => {
            const x = (item.x - minX) * scale;
            const y = (item.y - minY) * scale;
            const nodeWidth = 30; // Scaled width
            const nodeHeight = 10; // Scaled height
            
            const tool = getItemById(item.id);
            const color = tool && tool.details ? tool.details.color : "#6366f1";
            
            return (
              <rect
                key={item.id}
                x={x}
                y={y}
                width={nodeWidth}
                height={nodeHeight}
                rx={2}
                fill={color}
                fillOpacity={0.7}
                stroke={color}
                strokeWidth={1}
              />
            );
          })}
          
          {/* Connections */}
          {connections.map(connection => {
            const fromPoint = getNodeConnectionPoint(connection.from, connection.fromPoint);
            const toPoint = getNodeConnectionPoint(connection.to, connection.toPoint);
            if (!fromPoint || !toPoint) return null;
            
            return (
              <line
                key={connection.id}
                x1={(fromPoint.x - minX) * scale}
                y1={(fromPoint.y - minY) * scale}
                x2={(toPoint.x - minX) * scale}
                y2={(toPoint.y - minY) * scale}
                stroke="#6366f1"
                strokeWidth={1}
                strokeOpacity={0.7}
              />
            );
          })}
          
          {/* Viewport indicator */}
          {canvasRef.current && (
            <rect
              x={((canvasRef.current.scrollLeft / canvasScale) - minX) * scale}
              y={((canvasRef.current.scrollTop / canvasScale) - minY) * scale}
              width={(canvasRef.current.clientWidth / canvasScale) * scale}
              height={(canvasRef.current.clientHeight / canvasScale) * scale}
              fill="none"
              strokeWidth={1}
              stroke={darkMode ? "#f8fafc" : "#334155"}
              strokeDasharray="2,2"
            />
          )}
        </svg>
      </div>
    );
  };

  return (
    <div className={`h-screen w-full flex flex-col ${darkMode ? 'bg-gray-950 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      {/* Toolbar */}
      <div className={`px-4 py-2 flex items-center justify-between border-b ${
        darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
      } shadow-sm`}>
        <div className="flex items-center">
          <input
            type="text"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            className={`font-medium text-lg ${
              darkMode ? 'bg-gray-900 focus:bg-gray-800' : 'bg-white focus:bg-gray-50'
            } px-2 py-1 rounded-md border ${
              darkMode ? 'border-gray-700' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          />          
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            onClick={handleUndo} 
            disabled={historyIndex <= 0}
            className={`p-2 rounded-md ${
              historyIndex <= 0 ? 
                darkMode ? 'text-gray-600 bg-gray-800' : 'text-gray-400 bg-gray-100' :
                darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            ↩
          </button>
          <button 
            onClick={handleRedo} 
            disabled={historyIndex >= history.length - 1}
            className={`p-2 rounded-md ${
              historyIndex >= history.length - 1 ? 
                darkMode ? 'text-gray-600 bg-gray-800' : 'text-gray-400 bg-gray-100' :
                darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            ↪
          </button>
          <button 
            className={`p-2 rounded-md ${
              darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            }`}
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? '☀' : '🌙'}
          </button>
          <button 
            className={`p-2 rounded-md ${
              darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            }`}
            onClick={() => setShowMiniMap(!showMiniMap)}
          >
            🗺
          </button>
          <input
            type="file"
            id="import-workflow"
            className="hidden"
            accept=".json"
            onChange={handleImportWorkflow}
          />
          <button 
            className={`p-2 rounded-md ${
              darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            }`}
            onClick={() => document.getElementById('import-workflow').click()}
          >
            📂
          </button>
          <button 
            className={`p-2 rounded-md ${
              darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            }`}
            onClick={handleExportWorkflow}
          >
            💾
          </button>
          <button 
            onClick={simulateWorkflowExecution}
            disabled={isExecuting}
            className={`px-3 py-1 rounded-md ${
              isExecuting ?
                'bg-green-500 text-white' :
                'bg-indigo-600 hover:bg-indigo-700 text-white'
            } transition-colors flex items-center`}
          >
            {isExecuting ? 'Running...' : 'Execute'}
          </button>
          <button 
            onClick={handleSaveWorkflow}
            disabled={isSaving}
            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className={`w-64 h-full overflow-y-auto border-r ${
          darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
        }`}>
          <div className="p-4">
            <h3 className={`font-medium text-sm uppercase tracking-wider mb-2 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Tools
            </h3>
            <div className="space-y-2">
              {tools.map(tool => (
                <div
                  key={tool.id}
                  className={`p-3 rounded-md border ${
                    darkMode ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-200 hover:bg-gray-50'
                  } cursor-grab transition-all shadow-sm hover:shadow`}
                  draggable
                  onDragStart={(e) => handleToolDragStart(e, tool)}
                >
                  <div className="flex items-center">
                    <span className="text-xl mr-3" style={{ color: tool.color }}>{tool.icon}</span>
                    <span className="font-medium">{tool.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-4 border-t border-gray-700">
            <h3 className={`font-medium text-sm uppercase tracking-wider mb-2 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Social Integrations
            </h3>
            <div className="space-y-2">
              {socialIntegrations.map(integration => (
                <div
                  key={integration.id}
                  className={`p-3 rounded-md border ${
                    darkMode ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-200 hover:bg-gray-50'
                  } cursor-grab transition-all shadow-sm hover:shadow`}
                  draggable
                  onDragStart={(e) => handleToolDragStart(e, integration)}
                >
                  <div className="flex items-center">
                    <span className="text-xl mr-3" style={{ color: integration.color }}>{integration.icon}</span>
                    <span className="font-medium">{integration.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Canvas */}
        <div 
          ref={canvasRef}
          className="flex-1 h-full overflow-auto relative bg-grid"
          onDragOver={handleDragOver}
          onDrop={handleCanvasDrop}
          onMouseMove={handleMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onClick={handleCanvasClick}
          style={{
            backgroundSize: `${20 * canvasScale}px ${20 * canvasScale}px`,
            backgroundImage: `linear-gradient(to right, ${darkMode ? '#374151' : '#e5e7eb'} 1px, transparent 1px), linear-gradient(to bottom, ${darkMode ? '#374151' : '#e5e7eb'} 1px, transparent 1px)`,
            backgroundPosition: '0 0',
            backgroundColor: darkMode ? '#1f2937' : '#f9fafb'
          }}
        >
          <div 
            className="min-w-full min-h-full"
            style={{
              transform: `scale(${canvasScale})`,
              transformOrigin: '0 0'
            }}
          >
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <marker
                  id="arrow-default"
                  markerWidth="10"
                  markerHeight="10"
                  refX="9"
                  refY="3"
                  orient="auto"
                  markerUnits="strokeWidth"
                >
                  <path d="M0,0 L0,6 L9,3 z" fill="#475569" />
                </marker>
                <marker
                  id="arrow-hover"
                  markerWidth="10"
                  markerHeight="10"
                  refX="9"
                  refY="3"
                  orient="auto"
                  markerUnits="strokeWidth"
                >
                  <path d="M0,0 L0,6 L9,3 z" fill="#6366f1" />
                </marker>
                <marker
                  id="arrow-selected"
                  markerWidth="10"
                  markerHeight="10"
                  refX="9"
                  refY="3"
                  orient="auto"
                  markerUnits="strokeWidth"
                >
                  <path d="M0,0 L0,6 L9,3 z" fill="#8b5cf6" />
                </marker>
                <marker
                  id="arrow-executing"
                  markerWidth="10"
                  markerHeight="10"
                  refX="9"
                  refY="3"
                  orient="auto"
                  markerUnits="strokeWidth"
                >
                  <path d="M0,0 L0,6 L9,3 z" fill="#22c55e" />
                </marker>
              </defs>
              {renderConnections()}
              {renderTempConnection()}
            </svg>
            
            {canvasItems.map(item => {
              const tool = getItemById(item);
              const isSelected = selectedItem && selectedItem.id === item.id;
              const isExecutingNode = executionProgress && executionProgress.currentNode === item.id;
              
              return (
                <div
                  key={item.id}
                  id={item.id}
                  className={`absolute p-3 rounded-md ${
                    darkMode ? 'bg-gray-800' : 'bg-white'
                  } shadow-md border-2 ${
                    isExecutingNode ? 'border-green-500 animate-pulse' : 
                    isSelected ? 'border-indigo-500' : 
                    darkMode ? 'border-gray-700' : 'border-gray-200'
                  } cursor-move select-none min-w-[180px]`}
                  style={{
                    top: item.y,
                    left: item.x,
                    zIndex: isSelected ? 20 : 10
                  }}
                  onMouseDown={(e) => handleCanvasItemDragStart(e, item)}
                  onClick={(e) => handleNodeClick(e, item)}
                >
                  <div className="flex items-center justify-between relative">
                    <div className="flex items-center">
                      <span 
                        className="text-xl mr-3" 
                        style={{ 
                          color: tool?.details?.color || '#6366f1'
                        }}
                      >
                        {tool?.details?.icon || '⚙'}
                      </span>
                      <span className="font-medium text-sm truncate max-w-[100px]">{item.label}</span>
                    </div>
                    <div className="flex items-center">
                      <button 
                        className={`config-button w-5 h-5 rounded-full flex items-center justify-center ${
                          darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedItem(item);
                          setShowConfigPanel(true);
                        }}
                      >
                        ⚙
                      </button>
                    </div>
                    {renderConnectionPoint(item, 'left')}
                    {renderConnectionPoint(item, 'right')}
                    {renderConnectionPoint(item, 'top')}
                    {renderConnectionPoint(item, 'bottom')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {renderConfigPanel()}
        {renderConnectionConfigPanel()}
        {renderMiniMap()}
      </div>
    </div>
  );
};

export default DragDropUserflow;


