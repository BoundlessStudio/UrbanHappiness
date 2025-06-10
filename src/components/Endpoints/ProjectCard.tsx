import React, { useState, useEffect } from 'react';
import { 
  Server, 
  ChevronDown, 
  ChevronRight, 
  Trash2,
  Code
} from 'lucide-react';
import { Project, MockEndpoint } from '../../types';
import { useProjects } from '../../hooks/useProjects';
import EndpointCard from './EndpointCard';
import OpenAPISpecEditor from './OpenAPISpecEditor';

interface ProjectCardProps {
  project: Project;
  isExpanded: boolean;
  onToggleExpansion: () => void;
  onDeleteProject: (project: Project, e: React.MouseEvent) => void;
  onEndpointClick: (endpoint: MockEndpoint) => void;
  onTestEndpoint: (projectId: string, endpoint: MockEndpoint) => void;
  deletingProject: string | null;
  copiedId: string | null;
  onCopyEndpoint: (text: string, id: string) => void;
  getProjectNanoId: (projectId: string) => string;
  testingEndpoint: string | null;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project: initialProject,
  isExpanded,
  onToggleExpansion,
  onDeleteProject,
  onEndpointClick,
  onTestEndpoint,
  deletingProject,
  copiedId,
  onCopyEndpoint,
  getProjectNanoId,
  testingEndpoint
}) => {
  const { projects, updateProjectSpec } = useProjects();
  const [showSpecEditor, setShowSpecEditor] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Get the current project data from the projects state to ensure we have the latest data
  const currentProject = projects.find(p => p.id === initialProject.id) || initialProject;

  const handleSaveSpec = async (updatedSpec: any) => {
    setIsUpdating(true);
    try {
      await updateProjectSpec(currentProject.id, updatedSpec);
      // The project data will be automatically updated via optimistic updates
    } catch (error) {
      // Error handling is done in the updateProjectSpec function
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden">
      {/* Project Header */}
      <div
        className="p-6 border-b border-gray-800 cursor-pointer hover:bg-gray-800/30 transition-colors"
        onClick={onToggleExpansion}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-r from-violet-400 to-blue-400 rounded-lg flex items-center justify-center">
              <Server className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{currentProject.name}</h3>
              {currentProject.description && (
                <p className="text-gray-400 text-sm mt-1">{currentProject.description}</p>
              )}
              <div className="flex items-center space-x-4 mt-2">
                <span className="text-sm text-gray-500">
                  {currentProject.endpoints.length} endpoint{currentProject.endpoints.length !== 1 ? 's' : ''}
                </span>
                <span className="text-sm text-gray-500 font-mono">
                  ID: {getProjectNanoId(currentProject.id)}
                </span>
                {currentProject.spec?.info?.version && (
                  <span className="text-sm text-gray-500">
                    v{currentProject.spec.info.version}
                  </span>
                )}
                {isUpdating && (
                  <span className="text-sm text-blue-400 flex items-center space-x-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <span>Updating...</span>
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-green-400 text-xs">Active</span>
            </div>
            
            {/* Delete Button */}
            <button
              onClick={(e) => onDeleteProject(currentProject, e)}
              className={`p-2 rounded-lg transition-all duration-200 ${
                deletingProject === currentProject.id
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'text-gray-400 hover:text-red-400 hover:bg-red-500/10'
              }`}
              title={deletingProject === currentProject.id ? 'Click again to confirm deletion' : 'Delete project'}
            >
              <Trash2 className="h-4 w-4" />
            </button>

            {isExpanded ? (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronRight className="h-5 w-5 text-gray-400" />
            )}
          </div>
        </div>
        
        {/* Delete Confirmation Message */}
        {deletingProject === currentProject.id && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-sm">
              ⚠️ Click the delete button again to permanently delete "{currentProject.name}" and all its endpoints. This action cannot be undone.
            </p>
          </div>
        )}
      </div>

      {/* Project Content */}
      {isExpanded && (
        <div className="space-y-0">
          {/* Project Endpoints */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-white">Endpoints</h4>
            </div>
            {currentProject.endpoints.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {currentProject.endpoints.map((endpoint) => (
                  <EndpointCard
                    key={endpoint.id}
                    endpoint={endpoint}
                    projectId={currentProject.id}
                    onClick={() => onEndpointClick(endpoint)}
                    onCopy={onCopyEndpoint}
                    onTest={onTestEndpoint}
                    copiedId={copiedId}
                    isLoading={testingEndpoint === endpoint.id}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-800/30 rounded-lg">
                <Code className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No endpoints found in this project</p>
              </div>
            )}
          </div>

          {/* OpenAPI Specification Editor */}
          <div>
            <div
              className="p-6 cursor-pointer hover:bg-gray-800/30 transition-colors"
              onClick={() => setShowSpecEditor(!showSpecEditor)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Code className="h-5 w-5 text-violet-400" />
                  <div>
                    <h4 className="text-lg font-medium text-white">OpenAPI Specification</h4>
                    <p className="text-gray-400 text-sm">View and edit the complete API specification</p>
                  </div>
                </div>
                {showSpecEditor ? (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </div>

            {showSpecEditor && (
              <div className="px-6 pb-6 border-t border-gray-800">
                <div className="pt-6">
                  <OpenAPISpecEditor
                    spec={currentProject.spec}
                    onSave={handleSaveSpec}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectCard;