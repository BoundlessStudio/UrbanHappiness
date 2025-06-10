import React, { useCallback, useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { OpenAPISpec } from '../../types';
import { OpenAPIParser } from '../../utils/openApiParser';
import { useProjects } from '../../hooks/useProjects';
import { useAuth } from '../../contexts/AuthContext';

interface UploadAreaProps {
  onSpecUpload?: () => void;
}

const UploadArea: React.FC<UploadAreaProps> = ({ onSpecUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { createProject } = useProjects();
  const { user } = useAuth();

  const processFile = useCallback(async (file: File) => {
    if (!user) {
      setError('You must be signed in to upload API specifications');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(false);

    try {
      const text = await file.text();
      let spec: OpenAPISpec;

      if (file.name.endsWith('.json')) {
        spec = JSON.parse(text);
      } else if (file.name.endsWith('.yaml') || file.name.endsWith('.yml')) {
        // Simple YAML parsing for basic OpenAPI specs
        // In a real implementation, you'd use a proper YAML parser
        throw new Error('YAML parsing not implemented. Please convert to JSON format.');
      } else {
        throw new Error('Unsupported file format. Please upload JSON or YAML files.');
      }

      if (!OpenAPIParser.validateSpec(spec)) {
        throw new Error('Invalid OpenAPI specification format.');
      }

      const projectName = spec.info.title || file.name.replace(/\.(json|yaml|yml)$/, '');
      
      await createProject(spec, projectName);
      
      setSuccess(true);
      setIsProcessing(false);
      
      if (onSpecUpload) {
        setTimeout(() => {
          onSpecUpload();
          setSuccess(false);
        }, 2000);
      } else {
        setTimeout(() => setSuccess(false), 3000);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process file');
      setIsProcessing(false);
    }
  }, [createProject, user, onSpecUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      processFile(files[0]);
    }
  }, [processFile]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  }, [processFile]);

  if (!user) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Upload API Specification</h2>
          <p className="text-gray-400">Sign in to upload your OpenAPI/Swagger specification</p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-12 text-center">
          <Upload className="h-16 w-16 text-gray-600 mx-auto mb-6" />
          <h3 className="text-xl font-bold text-white mb-4">Authentication Required</h3>
          <p className="text-gray-400 mb-8">
            Please sign in to upload OpenAPI specifications and create mock API projects.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Upload API Specification</h2>
        <p className="text-gray-400">Upload your OpenAPI/Swagger specification to generate mock endpoints</p>
      </div>

      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-8">
        <div
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
            isDragging
              ? 'border-violet-400 bg-violet-500/10'
              : isProcessing
              ? 'border-blue-400 bg-blue-500/10'
              : success
              ? 'border-green-400 bg-green-500/10'
              : error
              ? 'border-red-400 bg-red-500/10'
              : 'border-gray-600 hover:border-gray-500 hover:bg-gray-800/30'
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <div className="space-y-6">
            {isProcessing ? (
              <>
                <Loader className="h-12 w-12 text-blue-400 mx-auto animate-spin" />
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Processing...</h3>
                  <p className="text-gray-400">Analyzing your API specification and creating project</p>
                </div>
              </>
            ) : success ? (
              <>
                <CheckCircle className="h-12 w-12 text-green-400 mx-auto" />
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Upload Successful!</h3>
                  <p className="text-gray-400">Your API project has been created with mock endpoints</p>
                </div>
              </>
            ) : error ? (
              <>
                <AlertCircle className="h-12 w-12 text-red-400 mx-auto" />
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Upload Failed</h3>
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              </>
            ) : (
              <>
                <div className="relative">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-violet-500 rounded-full flex items-center justify-center">
                    <FileText className="h-3 w-3 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">
                    Drop your OpenAPI specification here
                  </h3>
                  <p className="text-gray-400 mb-4">
                    or click to browse files
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                    <label className="bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 text-white px-6 py-2 rounded-lg font-medium cursor-pointer transition-all duration-200">
                      Choose File
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </label>
                    <span className="text-gray-500 text-sm">
                      Supports JSON formats
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4">
            <div className="w-10 h-10 bg-violet-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-violet-400 font-bold">1</span>
            </div>
            <h4 className="font-medium text-white mb-1">Upload Spec</h4>
            <p className="text-sm text-gray-400">Drop your OpenAPI specification file</p>
          </div>
          <div className="text-center p-4">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-400 font-bold">2</span>
            </div>
            <h4 className="font-medium text-white mb-1">AI Processing</h4>
            <p className="text-sm text-gray-400">AI analyzes and generates mock responses</p>
          </div>
          <div className="text-center p-4">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-green-400 font-bold">3</span>
            </div>
            <h4 className="font-medium text-white mb-1">Ready to Use</h4>
            <p className="text-sm text-gray-400">Your mock API endpoints are live</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadArea;