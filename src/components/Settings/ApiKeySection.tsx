import React, { useState } from 'react';
import { 
  Key, 
  Copy, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  CheckCircle,
  AlertTriangle,
  Shield
} from 'lucide-react';
import { useApiKey } from '../../hooks/useApiKey';

const ApiKeySection: React.FC = () => {
  const { apiKey, loading, resetting, resetApiKey } = useApiKey();
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const copyToClipboard = async () => {
    if (!apiKey) return;
    
    try {
      await navigator.clipboard.writeText(apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleReset = async () => {
    await resetApiKey();
    setShowResetConfirm(false);
  };

  const maskApiKey = (key: string) => {
    if (key.length <= 8) return key;
    return key.substring(0, 8) + '•'.repeat(key.length - 12) + key.substring(key.length - 4);
  };

  if (loading) {
    return (
      <div className="bg-gray-800/50 rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-700 rounded w-2/3 mb-6"></div>
          <div className="h-12 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 rounded-lg p-6">
      <div className="flex items-start space-x-4 mb-6">
        <div className="w-10 h-10 bg-violet-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
          <Key className="h-5 w-5 text-violet-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-medium text-white mb-2">API Key</h3>
          <p className="text-gray-400 text-sm mb-4">
            Use this API key to authenticate requests to your mock API endpoints. Keep it secure and don't share it publicly.
          </p>
          
          {/* Security Notice */}
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-amber-400 font-medium text-sm mb-1">Security Notice</h4>
                <p className="text-amber-300 text-sm">
                  Your API key provides access to all your mock endpoints. Treat it like a password and store it securely. 
                  If you suspect it's been compromised, reset it immediately.
                </p>
              </div>
            </div>
          </div>

          {/* API Key Display */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Your API Key
              </label>
              <div className="flex items-center space-x-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={showKey ? (apiKey || '') : (apiKey ? maskApiKey(apiKey) : '')}
                    readOnly
                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white font-mono text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    placeholder="Loading..."
                  />
                </div>
                
                <button
                  onClick={() => setShowKey(!showKey)}
                  className="p-3 text-gray-400 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                  title={showKey ? 'Hide API key' : 'Show API key'}
                >
                  {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                
                <button
                  onClick={copyToClipboard}
                  className="p-3 text-gray-400 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                  title="Copy API key"
                >
                  {copied ? (
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Usage Example */}
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
              <h4 className="text-white font-medium text-sm mb-2">Usage Example</h4>
              <pre className="text-xs text-gray-300 overflow-x-auto">
{`curl -X GET "https://mockserver.ai/api/v1/your-endpoint" \\
  -H "Authorization: Bearer ${apiKey ? (showKey ? apiKey : maskApiKey(apiKey)) : 'your-api-key'}" \\
  -H "Content-Type: application/json"`}
              </pre>
            </div>

            {/* Reset Section */}
            <div className="pt-4 border-t border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium text-sm mb-1">Reset API Key</h4>
                  <p className="text-gray-400 text-xs">
                    Generate a new API key. This will invalidate the current key.
                  </p>
                </div>
                
                {!showResetConfirm ? (
                  <button
                    onClick={() => setShowResetConfirm(true)}
                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>Reset Key</span>
                  </button>
                ) : (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setShowResetConfirm(false)}
                      className="px-3 py-2 bg-gray-600/20 hover:bg-gray-600/30 text-gray-400 rounded-lg text-sm transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleReset}
                      disabled={resetting}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                    >
                      {resetting ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          <span>Resetting...</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="h-4 w-4" />
                          <span>Confirm Reset</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
              
              {showResetConfirm && (
                <div className="mt-3 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-red-300 text-sm">
                      <strong>Warning:</strong> This will generate a new API key and invalidate the current one. 
                      Any applications using the current key will need to be updated.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeySection;