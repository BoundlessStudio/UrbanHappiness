import React, { useState } from 'react';
import { 
  Book, 
  Globe, 
  Code, 
  Copy, 
  CheckCircle, 
  Terminal,
  Zap
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Documentation: React.FC = () => {
  const { user } = useAuth();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Generate a sample spec ID for demonstration
  const sampleSpecId = user ? user.id.substring(0, 8) : 'abc12345';
  const baseUrl = `https://mockserver.ai/spec/${sampleSpecId}/`;

  const codeExamples = {
    curl: `curl -X GET "${baseUrl}users" \\
  -H "Content-Type: application/json"`,
    
    javascript: `const response = await fetch('${baseUrl}users', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data);`,

    python: `import requests

response = requests.get('${baseUrl}users')
data = response.json()
print(data)`,

    node: `const axios = require('axios');

axios.get('${baseUrl}users')
  .then(response => console.log(response.data))
  .catch(error => console.log(error));`
  };

  if (!user) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">API Documentation</h2>
          <p className="text-gray-400">Sign in to access your API documentation</p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-12 text-center">
          <Book className="h-16 w-16 text-gray-600 mx-auto mb-6" />
          <h3 className="text-xl font-bold text-white mb-4">Authentication Required</h3>
          <p className="text-gray-400">
            Please sign in to view your API documentation and access your mock endpoints.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">API Documentation</h2>
        <p className="text-gray-400">Learn how to interact with your mock API endpoints</p>
      </div>

      {/* Base URL Section */}
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-8">
        <div className="flex items-start space-x-4 mb-6">
          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <Globe className="h-5 w-5 text-blue-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-2">Base URL</h3>
            <p className="text-gray-300 mb-4">
              Your mock API endpoints are available at the following base URL. Replace <code className="bg-gray-800 px-2 py-1 rounded text-violet-400">{sampleSpecId}</code> with your actual spec ID:
            </p>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex items-center justify-between">
              <code className="text-blue-400 font-mono text-sm">{baseUrl}</code>
              <button
                onClick={() => copyToClipboard(baseUrl, 'base-url')}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                {copiedCode === 'base-url' ? (
                  <CheckCircle className="h-4 w-4 text-green-400" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
            <div className="mt-4 bg-violet-500/10 border border-violet-500/20 rounded-lg p-4">
              <p className="text-violet-300 text-sm">
                <strong>Note:</strong> Each project has its own unique spec ID. You can find your spec ID in the project details or by checking the Endpoints tab.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-8">
        <div className="flex items-start space-x-4 mb-6">
          <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <Terminal className="h-5 w-5 text-green-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-2">How It Works</h3>
            <p className="text-gray-300 mb-4">
              Your mock API endpoints are automatically generated from your OpenAPI specification. Simply append your endpoint paths to the base URL:
            </p>
            
            <div className="space-y-4">
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-2">Example endpoints:</div>
                <div className="space-y-2 font-mono text-sm">
                  <div className="flex items-center space-x-3">
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">GET</span>
                    <code className="text-gray-300">{baseUrl}users</code>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">POST</span>
                    <code className="text-gray-300">{baseUrl}users</code>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">GET</span>
                    <code className="text-gray-300">{baseUrl}users/123</code>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs">PUT</span>
                    <code className="text-gray-300">{baseUrl}users/123</code>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs">DELETE</span>
                    <code className="text-gray-300">{baseUrl}users/123</code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Code Examples Section */}
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-8">
        <div className="flex items-start space-x-4 mb-6">
          <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <Code className="h-5 w-5 text-orange-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-2">Code Examples</h3>
            <p className="text-gray-300 mb-6">
              Here are examples of how to call your mock API endpoints in different programming languages:
            </p>

            <div className="space-y-6">
              {Object.entries(codeExamples).map(([language, code]) => (
                <div key={language} className="border border-gray-700 rounded-lg overflow-hidden">
                  <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
                    <span className="text-white font-medium capitalize">{language}</span>
                    <button
                      onClick={() => copyToClipboard(code, language)}
                      className="p-1 text-gray-400 hover:text-white transition-colors"
                    >
                      {copiedCode === language ? (
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <div className="p-4 bg-gray-900">
                    <pre className="text-sm text-gray-300 overflow-x-auto">
                      <code>{code}</code>
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Response Format Section */}
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-8">
        <div className="flex items-start space-x-4 mb-6">
          <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <Zap className="h-5 w-5 text-cyan-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-2">Response Format</h3>
            <p className="text-gray-300 mb-4">
              Mock responses are generated based on your OpenAPI specification and return realistic data:
            </p>
            
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <pre className="text-sm text-gray-300 overflow-x-auto">
                <code>{`{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "createdAt": "2024-01-01T00:00:00Z",
  "isActive": true
}`}</code>
              </pre>
            </div>

            <div className="mt-4 space-y-2">
              <h4 className="text-white font-medium">HTTP Status Codes</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="w-12 text-green-400">200</span>
                    <span className="text-gray-300">Success (GET, PUT)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-12 text-green-400">201</span>
                    <span className="text-gray-300">Created (POST)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-12 text-green-400">204</span>
                    <span className="text-gray-300">No Content (DELETE)</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="w-12 text-red-400">400</span>
                    <span className="text-gray-300">Bad Request</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-12 text-red-400">404</span>
                    <span className="text-gray-300">Not Found</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-12 text-red-400">500</span>
                    <span className="text-gray-300">Server Error</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documentation;