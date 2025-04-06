import React, { useState } from 'react';
import { Phone, Loader2, CheckCircle, AlertCircle, Info } from 'lucide-react';

const CallPage = () => {
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCall = async () => {
    setIsLoading(true);
    setStatus('Calling...');

    try {
      const response = await fetch('http://localhost:5000/start-call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone_number: '+917020744317',
          pathway_id: 'c5cdd9c1-8adb-43ec-9261-5638ffa9b9e5',
        }),
      });

      const data = await response.json();
      setStatus(`Status: ${response.status} - ${JSON.stringify(data)}`);
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = () => {
    if (isLoading) return <Loader2 className="animate-spin mr-2" size={20} />;
    if (status.includes('Error')) return <AlertCircle className="text-red-500 mr-2" size={20} />;
    if (status && !status.includes('Error')) return <CheckCircle className="text-green-500 mr-2" size={20} />;
    return null;
  };

  return (
    <div className="min-h-screen w-full ml-72 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-3xl p-8 bg-white rounded-2xl shadow-xl transform transition duration-500 hover:scale-105">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-800 mb-4">AI Marketing Collaboration Assistant</h1>
          <div className="bg-indigo-50 p-6 rounded-xl border-l-4 border-indigo-600">
            <h2 className="text-xl font-semibold text-indigo-700 mb-2">
              <Info className="inline mr-2" size={20} /> About This Call
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Our AI-powered marketing agent will reach out to potential collaborators on your behalf. 
              The agent specializes in identifying partnership opportunities, explaining your value proposition, 
              and scheduling follow-up meetings with interested parties. Each call is tailored to highlight your 
              unique business advantages and explore mutually beneficial collaboration possibilities.
            </p>
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-center mt-6">
          <button
            onClick={handleCall}
            disabled={isLoading}
            className="group relative bg-gradient-to-r from-indigo-600 to-blue-500 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl disabled:opacity-70 transition-all duration-300 overflow-hidden"
          >
            <span className="absolute inset-0 w-full h-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
            <div className="flex items-center">
              <Phone className="mr-2 animate-pulse" size={24} />
              <span className="font-bold text-lg">Initiate Marketing Call</span>
            </div>
          </button>
          
          {status && (
            <div className="mt-8 p-5 bg-white border border-gray-200 shadow-md rounded-xl w-full">
              <div className="flex items-start">
                {getStatusIcon()}
                <div className="break-words">
                  <h3 className="font-medium text-gray-800 mb-1">Call Status</h3>
                  <p className="text-gray-600 whitespace-pre-wrap">{status}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Powered by AI Marketing Suite | © 2025</p>
      </div>
    </div>
  );
};

export default CallPage;