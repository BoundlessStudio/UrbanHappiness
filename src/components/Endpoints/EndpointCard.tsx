import React from 'react';
import { 
  Clock, 
  Globe, 
  Tag, 
  Copy, 
  Play, 
  CheckCircle,
  Loader
} from 'lucide-react';
import { MockEndpoint } from '../../types';

interface EndpointCardProps {
  endpoint: MockEndpoint;
  projectId: string;
  onClick: () => void;
  onCopy: (text: string, id: string) => void;
  onTest: (projectId: string, endpoint: MockEndpoint) => void;
  copiedId: string | null;
  isLoading: boolean;
}

const EndpointCard: React.FC<EndpointCardProps> = ({
  endpoint,
  projectId,
  onClick,
  onCopy,
  onTest,
  copiedId,
  isLoading
}) => {
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

  const handleTestClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onTest(projectId, endpoint);
  };

  return (
    <div
      className="bg-gray-800/30 rounded-lg p-4 hover:bg-gray-800/50 transition-all duration-300 cursor-pointer border border-gray-700/50 hover:border-gray-600"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <span className={`px-2 py-1 text-xs font-mono font-medium rounded border ${getMethodColor(endpoint.method)}`}>
            {endpoint.method}
          </span>
          <span className="text-white font-mono text-sm">{endpoint.path}</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCopy(`${endpoint.method} ${endpoint.path}`, endpoint.id);
            }}
            className="p-1 text-gray-400 hover:text-white transition-colors"
            title="Copy endpoint"
          >
            {copiedId === endpoint.id ? (
              <CheckCircle className="h-4 w-4 text-green-400" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
          <button 
            onClick={handleTestClick}
            disabled={isLoading}
            className={`p-1 transition-colors ${
              isLoading 
                ? 'text-violet-400 cursor-not-allowed' 
                : 'text-gray-400 hover:text-violet-400'
            }`}
            title="Test endpoint"
          >
            {isLoading ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {endpoint.summary && (
        <p className="text-gray-300 text-sm mb-3">{endpoint.summary}</p>
      )}

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 text-gray-400">
            <Clock className="h-3 w-3" />
            <span>{endpoint.responseTime}ms</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-400">
            <Globe className="h-3 w-3" />
            <span>{endpoint.statusCode}</span>
          </div>
        </div>
        {endpoint.tags.length > 0 && (
          <div className="flex items-center space-x-1">
            <Tag className="h-3 w-3 text-gray-400" />
            <span className="text-gray-400 text-xs">{endpoint.tags[0]}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default EndpointCard;