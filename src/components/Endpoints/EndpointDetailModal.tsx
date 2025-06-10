import React from 'react';
import { Code, Play, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { MockEndpoint } from '../../types';

interface EndpointDetailModalProps {
  endpoint: MockEndpoint | null;
  testResponse?: any;
  testError?: string | null;
  onClose: () => void;
}

const EndpointDetailModal: React.FC<EndpointDetailModalProps> = ({
  endpoint,
  testResponse,
  testError,
  onClose
}) => {
  if (!endpoint) return null;

  const getMethodColor = (method: string) => {
    const colors: Record<string, string> = {
      GET: 'text-green-400 bg-green-400/10 border-green-400/20',
      POST: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
      PUT: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
      DELETE: 'text-red-400 bg-red-400/10 border-red-400/20',
      PATCH: 'text-purple-400 bg-purple-400/10 border-purple-400/20'
    };
    return colors[method] || 'text-gray-400 bg-gray-400/10 border-gray-400/20';
  };

  const hasTestData = testResponse || testError;
  const displayResponse = testResponse || endpoint.mockResponse;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className={`px-2 py-1 text-xs font-mono font-medium rounded border ${getMethodColor(endpoint.method)}`}>
                {endpoint.method}
              </span>
              <span className="text-white font-mono">{endpoint.path}</span>
              {hasTestData && (
                <div className="flex items-center space-x-2">
                  {testError ? (
                    <div className="flex items-center space-x-1 px-2 py-1 bg-red-500/10 border border-red-500/20 rounded">
                      <AlertCircle className="h-3 w-3 text-red-400" />
                      <span className="text-red-400 text-xs">Test Failed</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1 px-2 py-1 bg-green-500/10 border border-green-500/20 rounded">
                      <CheckCircle className="h-3 w-3 text-green-400" />
                      <span className="text-green-400 text-xs">Test Success</span>
                    </div>
                  )}
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          {endpoint.summary && (
            <p className="text-gray-300 mt-2">{endpoint.summary}</p>
          )}
        </div>
        
        <div className="p-6 space-y-6">
          {/* Test Results Section */}
          {hasTestData && (
            <div className="space-y-4">
              <h4 className="text-white font-medium flex items-center space-x-2">
                <Play className="h-4 w-4 text-violet-400" />
                <span>Test Results</span>
              </h4>
              
              {testError ? (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-red-400 font-medium mb-1">Test Failed</h5>
                      <p className="text-red-300 text-sm">{testError}</p>
                    </div>
                  </div>
                </div>
              ) : testResponse && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      <span className="text-green-400 font-medium">Test Successful</span>
                    </div>
                    {testResponse._meta && (
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{testResponse._meta.responseTime}ms</span>
                        </div>
                        <span>Status: {testResponse._meta.statusCode}</span>
                      </div>
                    )}
                  </div>
                  {testResponse._meta && (
                    <p className="text-green-300 text-sm">
                      Tested at {new Date(testResponse._meta.timestamp).toLocaleTimeString()}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Response Section */}
          <div>
            <h4 className="text-white font-medium mb-4 flex items-center space-x-2">
              <Code className="h-4 w-4" />
              <span>{hasTestData && !testError ? 'Live Test Response' : 'Mock Response'}</span>
            </h4>
            
            {testError ? (
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-gray-400 text-sm italic">
                  No response data available due to test failure
                </p>
              </div>
            ) : endpoint.method === 'DELETE' && testResponse === null ? (
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-gray-400 text-sm italic">
                  No content (204) - DELETE operations typically return empty responses
                </p>
              </div>
            ) : (
              <pre className="bg-gray-800 p-4 rounded-lg text-sm text-gray-300 overflow-x-auto">
                {JSON.stringify(displayResponse, null, 2)}
              </pre>
            )}
          </div>

          {/* Original Mock Response (if showing test results) */}
          {hasTestData && !testError && testResponse !== endpoint.mockResponse && (
            <div>
              <h4 className="text-white font-medium mb-4 flex items-center space-x-2">
                <Code className="h-4 w-4" />
                <span>Original Mock Response</span>
              </h4>
              <pre className="bg-gray-800/50 p-4 rounded-lg text-sm text-gray-400 overflow-x-auto">
                {JSON.stringify(endpoint.mockResponse, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EndpointDetailModal;