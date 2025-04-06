
// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'https://glowing-werewolf-trusted.ngrok-free.app';

// Add default headers for all requests
const headers = {
  'ngrok-skip-browser-warning': 'true'
};

const apiService = {
  // Comment Analyzer
  summarizeComments: async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/summarize-comments/`, data, { headers });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to summarize comments');
    }
  },

  // Context Bridge
  processTweet: async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/process-tweet/`, data, { headers });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to process tweet');
    }
  },
  
  // Add to apiService object
  factCheck: async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/fact-check/`, data, { headers });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to check facts');
    }
  },

  // Add to apiService object in src/services/api.js
  impersonateCelebrity: async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/generate/`, data, { headers });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to generate celebrity impersonation');
    }
  },
  
  listCelebrities: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/celebrities/`, { headers });
      console.log('Response from listCelebrities:', response.data); // Debugging line
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch celebrities');
    }
  },

  // Add to apiService object in src/services/api.js
  generateMeme: async (data) => {
    try {
      console.log('Data being sent to generateMeme:', data); // Debugging line
      const response = await axios.post(`${API_BASE_URL}/api/generate-meme/`, data, { headers });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to generate meme');
    }
  },

  // Add to apiService object in src/services/api.js
  analyzeImage: async (formData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/analyze-image/`, formData, {
        headers: {
          ...headers,
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to analyze image');
    }
  },

  // Add to apiService object in src/services/api.js
  analyzeTweetImage: async (formData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/analyze/`, formData, {
        headers: {
          ...headers,
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to analyze tweet image');
    }
  },

  // Add to apiService object in src/services/api.js
  // Replace the existing analyzeTweetImage function with this:
  analyzeTweet: async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/analyze-tweet/`, data, { headers });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to analyze tweet');
    }
  }
};

export default apiService;
