import React, { useState } from 'react';
import { Wand2, Loader, CheckCircle, AlertCircle, Lightbulb, Code, Send } from 'lucide-react';
import { useProjects } from '../../hooks/useProjects';
import { useAuth } from '../../contexts/AuthContext';
import { OpenAPIGenerator } from '../../utils/openApiGenerator';

interface PromptAPIProps {
  onSpecGenerated?: () => void;
}

const PromptAPI: React.FC<PromptAPIProps> = ({ onSpecGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [generatedSpec, setGeneratedSpec] = useState<any>(null);
  const { createProject } = useProjects();
  const { user } = useAuth();

  const examplePrompts = [
    "Create a REST API for a blog platform with posts, comments, and user management",
    "Design an e-commerce API with products, shopping cart, orders, and payment processing",
    "Build a social media API with user profiles, posts, likes, follows, and messaging",
    "Create a task management API with projects, tasks, assignments, and time tracking",
    "Design a restaurant API with menu items, orders, reservations, and customer reviews"
  ];

  const handleGenerate = async () => {
    if (!user) {
      setError('You must be signed in to generate API specifications');
      return;
    }

    if (!prompt.trim()) {
      setError('Please enter a description for your API');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setSuccess(false);
    setGeneratedSpec(null);

    try {
      const spec = await OpenAPIGenerator.generateFromPrompt(prompt);
      setGeneratedSpec(spec);
      
      const projectName = spec.info.title || 'Generated API';
      await createProject(spec, projectName);
      
      setSuccess(true);
      setIsGenerating(false);
      
      if (onSpecGenerated) {
        setTimeout(() => {
          onSpecGenerated();
          setSuccess(false);
          setPrompt('');
          setGeneratedSpec(null);
        }, 2000);
      } else {
        setTimeout(() => {
          setSuccess(false);
          setPrompt('');
          setGeneratedSpec(null);
        }, 3000);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate API specification');
      setIsGenerating(false);
    }
  };

  const handleExampleClick = (example: string) => {
    setPrompt(example);
  };

  if (!user) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Prompt API</h2>
          <p className="text-gray-400">Sign in to generate OpenAPI specifications using AI</p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-12 text-center">
          <Wand2 className="h-16 w-16 text-gray-600 mx-auto mb-6" />
          <h3 className="text-xl font-bold text-white mb-4">Authentication Required</h3>
          <p className="text-gray-400 mb-8">
            Please sign in to use AI-powered API specification generation.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Prompt API</h2>
        <p className="text-gray-400">Describe your API and let AI generate a complete OpenAPI specification</p>
      </div>

      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-8">
        <div className="space-y-6">
          {/* AI Generation Info */}
          <div className="bg-gradient-to-r from-violet-500/10 to-blue-500/10 border border-violet-500/20 rounded-lg p-6">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-violet-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Wand2 className="h-5 w-5 text-violet-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-white mb-2">AI-Powered API Generation</h3>
                <p className="text-gray-300 text-sm mb-3">
                  Describe your API requirements in natural language, and our AI will generate a complete OpenAPI 3.0 specification with realistic endpoints, schemas, and examples.
                </p>
                <div className="flex items-center space-x-2 text-violet-400 text-sm">
                  <Lightbulb className="h-4 w-4" />
                  <span>Be specific about your API's purpose, entities, and operations for best results</span>
                </div>
              </div>
            </div>
          </div>

          {/* Prompt Input */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-300">
              Describe your API
            </label>
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Example: Create a REST API for a task management application with users, projects, tasks, and comments. Include CRUD operations for all entities and user authentication."
                className="w-full h-32 p-4 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                disabled={isGenerating}
              />
              <div className="absolute bottom-3 right-3 text-xs text-gray-500">
                {prompt.length}/1000
              </div>
            </div>
          </div>

          {/* Example Prompts */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-300 flex items-center space-x-2">
              <Lightbulb className="h-4 w-4" />
              <span>Example Prompts</span>
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {examplePrompts.map((example, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleClick(example)}
                  className="text-left p-3 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 hover:text-white transition-colors"
                  disabled={isGenerating}
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2"
          >
            {isGenerating ? (
              <>
                <Loader className="h-5 w-5 animate-spin" />
                <span>Generating API Specification...</span>
              </>
            ) : success ? (
              <>
                <CheckCircle className="h-5 w-5" />
                <span>API Generated Successfully!</span>
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                <span>Generate API Specification</span>
              </>
            )}
          </button>

          {/* Error Display */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-red-400 font-medium mb-1">Generation Failed</h4>
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Generated Spec Preview */}
          {generatedSpec && (
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Code className="h-5 w-5 text-green-400" />
                <h4 className="text-white font-medium">Generated OpenAPI Specification</h4>
              </div>
              <div className="bg-gray-900 rounded-lg p-4 max-h-64 overflow-y-auto">
                <pre className="text-sm text-gray-300">
                  {JSON.stringify(generatedSpec, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Process Steps */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4">
            <div className="w-10 h-10 bg-violet-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-violet-400 font-bold">1</span>
            </div>
            <h4 className="font-medium text-white mb-1">Describe API</h4>
            <p className="text-sm text-gray-400">Write a natural language description of your API</p>
          </div>
          <div className="text-center p-4">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-400 font-bold">2</span>
            </div>
            <h4 className="font-medium text-white mb-1">AI Generation</h4>
            <p className="text-sm text-gray-400">AI creates a complete OpenAPI specification</p>
          </div>
          <div className="text-center p-4">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-green-400 font-bold">3</span>
            </div>
            <h4 className="font-medium text-white mb-1">Mock Endpoints</h4>
            <p className="text-sm text-gray-400">Your API endpoints are ready for testing</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptAPI;