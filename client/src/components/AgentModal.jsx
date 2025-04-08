// src/components/AgentModal.jsx
import React, { useState, useEffect } from 'react';
import apiService from '../services/api';

const AgentModal = ({ agent, onClose, baseUrl }) => {
  // Common state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  // Comment Analyzer specific state
  const [tweetContext, setTweetContext] = useState('');
  const [comments, setComments] = useState('');

  // Context Bridge specific state
  const [tweet, setTweet] = useState('');
  const [instructions, setInstructions] = useState('');

  // Fact Checker specific state
  const [claim, setClaim] = useState('');

  // Add this with the other state declarations at the top of the component
  const [celebrities, setCelebrities] = useState([]);
  const [selectedCelebrity, setSelectedCelebrity] = useState('');
  const [originalTweet, setOriginalTweet] = useState('');

  // Add to your state declarations at the top of the component
  const [memeInput, setMemeInput] = useState('');

  // Add to your state declarations in AgentModal.jsx
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Add to your state declarations in AgentModal.jsx
  const [tweetImage, setTweetImage] = useState(null);
  const [tweetImagePreview, setTweetImagePreview] = useState(null);
  const [analysisType, setAnalysisType] = useState('default');


  const [tweetText, setTweetText] = useState('');


  // Add this after the state declarations
  useEffect(() => {
    // Only fetch celebrities when the Celebrity Impersonator agent is opened
    if (agent.name === "Celebrity Impersonator") {
      const fetchCelebrities = async () => {
        try {
          console.log('Fetching celebrities...');
          const data = await apiService.listCelebrities();
          console.log('Received celebrities:', data);
          setCelebrities(data);
          if (data.length > 0) {
            setSelectedCelebrity(data[0].name);
          }
        } catch (err) {
          console.error('Error fetching celebrities:', err);
          setError('Failed to load celebrities');
        }
      };
      
      fetchCelebrities();
    }
  }, [agent.name]);

  // Add this useEffect
  useEffect(() => {
    return () => {
      // Clean up the preview URLs when the component unmounts
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      if (tweetImagePreview) {
        URL.revokeObjectURL(tweetImagePreview);
      }
    };
  }, [imagePreview, tweetImagePreview]);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // Add a function to handle tweet image selection
  const handleTweetImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setTweetImage(file);
      
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      setTweetImagePreview(previewUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      let response;
      
      // Handle different agent types
      switch(agent.name) {
        case "Comment Analyzer":
          // Parse comments string into JSON array
          let parsedComments;
          try {
            parsedComments = JSON.parse(comments);
            if (!Array.isArray(parsedComments)) {
              throw new Error('Comments must be a valid JSON array');
            }
          } catch (err) {
            throw new Error('Invalid JSON format for comments. Please provide a valid array.');
          }
          
          response = await apiService.summarizeComments({
            tweet_context: tweetContext,
            comments: parsedComments
          });
          break;
          
        case "Context Bridge":
          response = await apiService.processTweet({
            tweet: tweet,
            instructions: instructions
          });
          break;

        case "Fact Checker":
          response = await apiService.factCheck({
            claim: claim
          });
          break;
        
          // Add this case in your switch statement in handleSubmit
        case "Celebrity Impersonator":
          if (!selectedCelebrity) {
            throw new Error('Please select a celebrity');
          }
          response = await apiService.impersonateCelebrity({
            user_command: selectedCelebrity,
            original_tweet: originalTweet
          });
          break;

        case "Meme Generator":
          response = await apiService.generateMeme({
            input_text: memeInput
          });
          break;

        case "Picture Perfect":
          const formData = new FormData();
          formData.append('image', selectedImage);
          response = await apiService.analyzeImage(formData);
          break;

        case "Tweet Analyzer":
          const tweetFormData = new FormData();
          tweetFormData.append('image', tweetImage);
          tweetFormData.append('analysis_type', analysisType);
          response = await apiService.analyzeTweetImage(tweetFormData);
          break;

          case "Sentiment Analyzer":
            response = await apiService.analyzeTweet({
              tweet_text: tweetText
            });
            break;
        
        

        default:
          // For agents not yet implemented
          response = {
            message: `This is a placeholder result for ${agent.name}`,
            data: { agent: agent.name }
          };
          break;
      }
      
      setResult(response);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // Render different input forms based on agent type
  const renderInputForm = () => {
    switch(agent.name) {
      case "Comment Analyzer":
        return (
          <>
            <div className="mb-4">
              <label className="block text-black mb-2">Tweet Context:</label>
              <textarea
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-400 focus:border-transparent text-black"
                rows="2"
                value={tweetContext}
                onChange={(e) => setTweetContext(e.target.value)}
                placeholder="Enter the original tweet text or context..."
                required
              ></textarea>
            </div>
            
            <div className="mb-4">
              <label className="block text-black mb-2">Comments (JSON Array):</label>
              <textarea
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-400 focus:border-transparent font-mono text-sm text-black"
                rows="10"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder={`[
  {
    "user": "John Doe",
    "username": "johndoe123",
    "comment": "This is awesome!",
    "likes": 42,
    "timestamp": "2023-11-12T15:30:00Z"
  },
  {
    "user": "Jane Smith",
    "username": "janesmith456",
    "comment": "I disagree...",
    "likes": 7,
    "timestamp": "2023-11-12T15:45:00Z"
  }
]`}
                required
              ></textarea>
            </div>
          </>
        );
        
      case "Context Bridge":
        return (
          <>
            <div className="mb-4">
              <label className="block text-black mb-2">Tweet:</label>
              <textarea
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-400 focus:border-transparent text-black"
                rows="3"
                value={tweet}
                onChange={(e) => setTweet(e.target.value)}
                placeholder="Enter the tweet text or context..."
                required
              ></textarea>
            </div>
            
            <div className="mb-4">
              <label className="block text-black mb-2">Instructions:</label>
              <textarea
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-400 focus:border-transparent text-black"
                rows="3"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Enter instructions for processing (e.g., 'Rewrite this tweet to be more engaging', 'Criticize this tweet', etc.)"
                required
              ></textarea>
            </div>
          </>
        );

      case "Fact Checker":
        return (
          <>
            <div className="mb-4">
              <label className="block text-black mb-2">Claim to Fact Check:</label>
              <textarea
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-400 focus:border-transparent text-black"
                rows="3"
                value={claim}
                onChange={(e) => setClaim(e.target.value)}
                placeholder="Enter the claim you want to fact check..."
                required
              ></textarea>
            </div>
          </>
        );

      // Add this case in your renderInputForm function
      case "Celebrity Impersonator":
        return (
          <>
            <div className="mb-4">
              <label className="block text-black mb-2">Select Celebrity:</label>
              <select
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-400 focus:border-transparent text-black"
                value={selectedCelebrity}
                onChange={(e) => setSelectedCelebrity(e.target.value)}
                required
              >
                <option value="">Select a celebrity...</option>
                {celebrities.map((celebrity) => (
                  <option key={celebrity.id} value={celebrity.name}>
                    {celebrity.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-black mb-2">Original Tweet:</label>
              <textarea
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-400 focus:border-transparent text-black"
                rows="4"
                value={originalTweet}
                onChange={(e) => setOriginalTweet(e.target.value)}
                placeholder="Enter the original tweet text that you want the celebrity to respond to..."
                required
              ></textarea>
            </div>
          </>
        );

        case "Meme Generator":
          return (
            <>
              <div className="mb-4">
                <label className="block mb-2 text-black">Meme Description:</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-400 focus:border-transparent text-black"
                  rows="4"
                  value={memeInput}
                  onChange={(e) => setMemeInput(e.target.value)}
                  placeholder="Describe the meme you want to generate..."
                  required
                ></textarea>
              </div>
            </>
          );

      // Add this case to your renderInputForm function
      case "Picture Perfect":
        return (
          <>
            <div className="mb-4">
              <label className="block mb-2 text-black">Upload Image:</label>
              <input
                type="file"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-400 focus:border-transparent text-black"
                accept="image/*"
                onChange={handleImageChange}
                required
              />
            </div>
            
            {imagePreview && (
              <div className="mb-4">
                <label className="block mb-2 text-black">Preview:</label>
                <div className="border border-gray-300 rounded-lg p-2 flex justify-center">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="max-h-64 object-contain"
                  />
                </div>
              </div>
            )}
          </>
        );

        case "Tweet Analyzer":
          return (
            <>
              <div className="mb-4">
                <label className="block text-black mb-2">Upload Tweet Screenshot:</label>
                <input
                  type="file"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-400 focus:border-transparent text-black"
                  accept="image/jpeg,image/png"
                  onChange={handleTweetImageChange}
                  required
                />
              </div>
              
              {tweetImagePreview && (
                <div className="mb-4">
                  <label className="block mb-2 text-black">Preview:</label>
                  <div className="border border-gray-300 rounded-lg p-2 flex justify-center">
                    <img 
                      src={tweetImagePreview} 
                      alt="Tweet Preview" 
                      className="max-h-64 object-contain"
                    />
                  </div>
                </div>
              )}
              
              <div className="mb-4">
                <label className="block mb-2 text-black">Analysis Type:</label>
                <select
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-400 focus:border-transparent text-black"
                  value={analysisType}
                  onChange={(e) => setAnalysisType(e.target.value)}
                >
                  <option value="default">Default Analysis</option>
                  <option value="detailed">Detailed Analysis</option>
                  <option value="summary">Summary Only</option>
                </select>
              </div>
            </>
          );
      
          case "Sentiment Analyzer":
            return (
              <>
                <div className="mb-4">
                  <label className="block mb-2 text-black">Tweet Text:</label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-400 focus:border-transparent text-black"
                    rows="4"
                    value={tweetText}
                    onChange={(e) => setTweetText(e.target.value)}
                    placeholder="Enter the tweet text to analyze sentiment..."
                    required
                  ></textarea>
                </div>
              </>
            );
        
      default:
        return (
          <div className="mb-4">
            <label className="block mb-2 text-black">Input:</label>
            <textarea
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-400 focus:border-transparent text-black"
              rows="4"
              placeholder={`Enter your input for ${agent.name}...`}
              required
            ></textarea>
            <p className="text-sm text-black mt-2">
              This agent is not yet fully implemented. Stay tuned!
            </p>
          </div>
        );
    }
  };

  // Render the results differently based on agent type
  const renderResults = () => {
    if (!result) return null;
    
    switch(agent.name) {
      case "Comment Analyzer":
        return (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg overflow-hidden">
            <div className="bg-green-100 p-3 border-b border-green-200">
              <h3 className="text-lg font-semibold text-black">Comment Analysis Results</h3>
            </div>
            <div className="p-4">
              {result.success ? (
                <>
                  <div className="mb-4">
                    <p className="text-sm text-black">Total Comments Analyzed: {result.total_comments}</p>
                  </div>
                  
                  {Object.entries(result.summary).map(([key, value]) => (
                    <div key={key} className="mb-4">
                      <h4 className="font-medium text-black mb-1">{key}</h4>
                      <p className="bg-white p-3 rounded border border-gray-200 text-black">{value}</p>
                    </div>
                  ))}
                </>
              ) : (
                <p className="text-red-600 text-black">Analysis failed: {result.error}</p>
              )}
            </div>
          </div>
        );
        
      case "Context Bridge":
        return (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg overflow-hidden">
            <div className="bg-blue-100 p-3 border-b border-blue-200">
              <h3 className="text-lg font-semibold text-black">Tweet Processing Result</h3>
            </div>
            <div className="p-4">
              <div className="bg-white p-3 rounded border border-gray-200 whitespace-pre-wrap text-black">
                {result.result}
              </div>
            </div>
          </div>
        );
      
      case "Fact Checker":
      return (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg overflow-hidden">
          <div className="bg-green-100 p-3 border-b border-green-200">
            <h3 className="text-lg font-semibold text-black">Fact Check Results</h3>
          </div>
          <div className="p-4">
            {result.analyses.langchain && (
              <div className="mb-4">
                <h4 className="font-medium text-black mb-1">Analysis</h4>
                <p className="bg-white p-3 rounded border border-gray-200 text-black">{result.analyses.langchain}</p>
              </div>
            )}
            
            {result.analyses.gemini && (
              <div className="mb-4">
                <h4 className="font-medium text-black mb-1">Advanced Analysis</h4>
                <p className="bg-white p-3 rounded border border-gray-200 text-black">{result.analyses.gemini}</p>
              </div>
            )}
            
            {result.analyses.wikipedia && (
              <div className="mb-4">
                <h4 className="font-medium text-black mb-1">Related Sources</h4>
                <div className="bg-white p-3 rounded border border-gray-200">
                  {result.analyses.wikipedia.found_articles > 0 ? (
                    <ul className="list-disc pl-5 text-black">
                      {result.analyses.wikipedia.articles.map((article, index) => (
                        <li key={index} className="text-black">{article.title}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-black">No relevant sources found</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      );

      // Add this case in your renderResults function
    case "Celebrity Impersonator":
      return (
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg overflow-hidden">
          <div className="bg-yellow-100 p-3 border-b border-yellow-200">
            <h3 className="text-lg font-semibold text-black">Celebrity Response</h3>
          </div>
          <div className="p-4">
            <div className="mb-4">
              <h4 className="font-medium text-black mb-1">Response from {result.celebrity_name}</h4>
              <div className="bg-white p-3 rounded border border-gray-200">
                <p className="whitespace-pre-wrap text-black">{result.response}</p>
              </div>
            </div>
            
            <div className="mt-4 text-sm text-black">
              <p>Original tweet: "{result.input_tweet}"</p>
            </div>
          </div>
        </div>
      );

      case "Meme Generator":
      return (
        <div className="mt-6 bg-pink-50 border border-pink-200 rounded-lg overflow-hidden">
          <div className="bg-pink-100 p-3 border-b border-pink-200">
            <h3 className="text-lg font-semibold text-black">Generated Meme</h3>
          </div>
          <div className="p-4">
            {result.url && (
              <div className="mb-4 flex justify-center">
                <img 
                  src={result.url} 
                  alt="Generated Meme" 
                  className="max-w-full rounded border border-gray-200"
                />
              </div>
            )}
            
            {result.template && (
              <div className="mb-4">
                <h4 className="font-medium text-black mb-1">Template Used</h4>
                <p className="bg-white p-3 rounded border border-gray-200 text-black">{result.template}</p>
              </div>
            )}
            
            {result.captions && result.captions.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-black mb-1">Captions</h4>
                <div className="bg-white p-3 rounded border border-gray-200">
                  {result.captions.map((caption, index) => (
                    <p key={index} className="mb-1 text-black">• {caption}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      );

      // Add this case to your renderResults function
      case "Picture Perfect":
        return (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-lg overflow-hidden">
            <div className="bg-red-100 p-3 border-b border-red-200">
              <h3 className="text-lg font-semibold text-black">Image Analysis Results</h3>
            </div>
            <div className="p-4">
              <div className="mb-4">
                <h4 className="font-medium text-black mb-1">Original Caption</h4>
                <p className="bg-white p-3 rounded border border-gray-200 text-black">{result.original_caption}</p>
              </div>
              
              <div className="mb-4">
                <h4 className="font-medium text-black mb-1">AI Response</h4>
                <p className="bg-white p-3 rounded border border-gray-200 whitespace-pre-wrap text-black">{result.ai_response}</p>
              </div>
            </div>
          </div>
        );

        case "Tweet Analyzer":
          return (
            <div className="mt-6 bg-teal-50 border border-teal-200 rounded-lg overflow-hidden">
              <div className="bg-teal-100 p-3 border-b border-teal-200">
                <h3 className="text-lg font-semibold text-black">Tweet Analysis Results</h3>
              </div>
              <div className="p-4">
                <div className="mb-4">
                  <h4 className="font-medium text-black mb-1">Extracted Text</h4>
                  <p className="bg-white p-3 rounded border border-gray-200 text-black">{result.extracted_text}</p>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-medium text-black mb-1">Analysis</h4>
                  <div className="bg-white p-3 rounded border border-gray-200 whitespace-pre-wrap text-black">
                    {typeof result.analysis === 'string' 
                      ? result.analysis 
                      : JSON.stringify(result.analysis, null, 2)}
                  </div>
                </div>
                
                {result.additional_processing && Object.keys(result.additional_processing).length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-black mb-1">Additional Information</h4>
                    <div className="bg-white p-3 rounded border border-gray-200">
                      {Object.entries(result.additional_processing).map(([key, value]) => (
                        <p key={key} className="text-black"><strong className="text-black">{key}:</strong> {value}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );

          case "Sentiment Analyzer":
            return (
              <div className="mt-6 bg-teal-50 border border-teal-200 rounded-lg overflow-hidden">
                <div className="bg-teal-100 p-3 border-b border-teal-200">
                  <h3 className="text-lg font-semibold text-black">Sentiment Analysis Results</h3>
                </div>
                <div className="p-4">
                  {result.analysis && result.analysis.analysis && (
                    <>
                      {/* Emotions Section */}
                      {result.analysis.analysis.emotion_percentages && (
                        <div className="mb-4">
                          <h4 className="font-medium text-black mb-1">Emotions Detected</h4>
                          <div className="bg-white p-3 rounded border border-gray-200">
                            {Object.entries(result.analysis.analysis.emotion_percentages).map(([emotion, percentage]) => (
                              <div key={emotion} className="flex justify-between items-center mb-1">
                                <span className="text-black">{emotion}</span>
                                <div className="flex items-center">
                                  <div className="w-32 bg-gray-200 rounded-full h-2.5 mr-2">
                                    <div 
                                      className="bg-teal-600 h-2.5 rounded-full" 
                                      style={{ width: `${percentage}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-sm text-black">{percentage.toFixed(1)}%</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Sentiment Description */}
                      {result.analysis.analysis.sentiment_description && (
                        <div className="mb-4">
                          <h4 className="font-medium text-black mb-1">Sentiment Description</h4>
                          <p className="bg-white p-3 rounded border border-gray-200 text-black">
                            {result.analysis.analysis.sentiment_description}
                          </p>
                        </div>
                      )}
                      
                      {/* Tweet Suggestions */}
                      {result.analysis.analysis.tweet_suggestions && result.analysis.analysis.tweet_suggestions.length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-medium text-black mb-1">Suggested Responses</h4>
                          <div className="bg-white p-3 rounded border border-gray-200">
                            {result.analysis.analysis.tweet_suggestions.map((suggestion, idx) => (
                              <div key={idx} className="p-2 mb-2 border-b border-gray-100 last:border-b-0 text-black">
                                {suggestion}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Original Tweet */}
                      <div className="mt-4 text-sm text-black">
                        <p>Original tweet: "{result.analysis.analysis.original_tweet}"</p>
                      </div>
                    </>
                  )}
                  
                  {/* Error Handling */}
                  {result.analysis && result.analysis.error && (
                    <div className="bg-red-50 p-3 rounded border border-red-200 text-black">
                      Error: {result.analysis.error}
                    </div>
                  )}
                </div>
              </div>
            );
        
      default:
        return (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="text-lg font-semibold text-black mb-2">Result:</h3>
            <pre className="bg-white p-3 rounded border border-gray-200 overflow-x-auto text-black">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        );
    }
  };

  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className={`${agent.color} p-6 flex justify-between items-center`}>
          <div className="flex items-center space-x-3">
            <span className="text-4xl">{agent.icon}</span>
            <h2 className="text-2xl font-bold text-black">{agent.name}</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 text-2xl"
          >
            ×
          </button>
        </div>
        
        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <p className="text-black mb-6">{agent.description}</p>
          
          <form onSubmit={handleSubmit}>
            {renderInputForm()}
            
            <button 
              type="submit" 
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Submit'}
            </button>
          </form>
          
          {/* Results section */}
          {error && (
            <div className="mt-6 p-4 bg-red-100 border border-red-300 rounded-lg text-red-700">
              {error}
            </div>
          )}
          
          {renderResults()}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-black text-center">
            Endpoint: {baseUrl}{agent.endpoint}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AgentModal;
