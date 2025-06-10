import React, { useState } from 'react';
import { Code, Edit, Save, X, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import { OpenAPISpec } from '../../types';

interface OpenAPISpecEditorProps {
  spec: OpenAPISpec;
  onSave: (updatedSpec: OpenAPISpec) => Promise<void>;
}

const OpenAPISpecEditor: React.FC<OpenAPISpecEditorProps> = ({ spec, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSpec, setEditedSpec] = useState(JSON.stringify(spec, null, 2));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
    setError(null);
    setSuccess(false);
    // Reset to current spec when starting to edit
    setEditedSpec(JSON.stringify(spec, null, 2));
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
    setSuccess(false);
    // Reset to original spec
    setEditedSpec(JSON.stringify(spec, null, 2));
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Parse the edited spec to validate JSON
      const parsedSpec = JSON.parse(editedSpec);
      
      // Basic OpenAPI validation
      if (!parsedSpec.openapi || !parsedSpec.info || !parsedSpec.paths) {
        throw new Error('Invalid OpenAPI specification: Missing required fields (openapi, info, paths)');
      }

      // Call the save function
      await onSave(parsedSpec);
      
      setSuccess(true);
      setIsEditing(false);
      
      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
      
    } catch (err) {
      if (err instanceof SyntaxError) {
        setError('Invalid JSON format. Please check your syntax.');
      } else {
        setError(err instanceof Error ? err.message : 'Failed to save specification');
      }
    } finally {
      setLoading(false);
    }
  };

  const lineCount = editedSpec.split('\n').length;
  const isValidJson = () => {
    try {
      JSON.parse(editedSpec);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-white font-medium flex items-center space-x-2">
          <Code className="h-4 w-4" />
          <span>OpenAPI Specification</span>
        </h4>
        
        {!isEditing ? (
          <button
            onClick={handleEdit}
            className="flex items-center space-x-2 px-3 py-1 bg-violet-500/20 hover:bg-violet-500/30 text-violet-400 rounded-lg text-sm transition-colors"
          >
            <Edit className="h-3 w-3" />
            <span>Edit</span>
          </button>
        ) : (
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCancel}
              className="flex items-center space-x-2 px-3 py-1 bg-gray-600/20 hover:bg-gray-600/30 text-gray-400 rounded-lg text-sm transition-colors"
            >
              <X className="h-3 w-3" />
              <span>Cancel</span>
            </button>
            <button
              onClick={handleSave}
              disabled={loading || !isValidJson()}
              className="flex items-center space-x-2 px-3 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader className="h-3 w-3 animate-spin" />
              ) : (
                <Save className="h-3 w-3" />
              )}
              <span>{loading ? 'Saving...' : 'Save'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Status Messages */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h5 className="text-red-400 font-medium text-sm">Save Failed</h5>
              <p className="text-red-300 text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <span className="text-green-400 font-medium text-sm">Specification saved successfully!</span>
          </div>
        </div>
      )}

      {/* JSON Editor */}
      <div className="relative">
        <textarea
          value={editedSpec}
          onChange={(e) => setEditedSpec(e.target.value)}
          readOnly={!isEditing}
          className={`w-full p-4 bg-gray-800 border rounded-lg text-sm font-mono text-gray-300 resize-none overflow-auto ${
            isEditing 
              ? 'border-gray-600 focus:ring-2 focus:ring-violet-500 focus:border-transparent' 
              : 'border-gray-700 cursor-default'
          } ${!isValidJson() && isEditing ? 'border-red-500' : ''}`}
          style={{ height: `${Math.min(Math.max(lineCount * 20 + 40, 200), 500)}px` }}
          spellCheck={false}
        />
        
        {/* Editor Info */}
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            <span>{lineCount} lines</span>
            <span>{editedSpec.length} characters</span>
            {isEditing && (
              <span className={`${isValidJson() ? 'text-green-400' : 'text-red-400'}`}>
                {isValidJson() ? '✓ Valid JSON' : '✗ Invalid JSON'}
              </span>
            )}
          </div>
          {isEditing && (
            <span className="text-gray-400">
              Tip: Use Ctrl+A to select all, Ctrl+Z to undo
            </span>
          )}
        </div>
      </div>

      {/* Help Text */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <div className="w-4 h-4 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-blue-400 text-xs">i</span>
          </div>
          <div className="text-blue-300 text-sm">
            <p className="font-medium mb-1">OpenAPI Specification Editor</p>
            <p>
              This is your complete OpenAPI 3.0 specification in JSON format. You can edit it directly here to modify 
              endpoints, add new paths, update schemas, or change any other aspect of your API definition. 
              {isEditing && ' Make sure your JSON is valid before saving.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpenAPISpecEditor;