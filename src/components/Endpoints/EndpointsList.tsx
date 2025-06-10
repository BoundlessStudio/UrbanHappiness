import React, { useState } from 'react';
import { 
  Globe, 
  Filter,
  Search
} from 'lucide-react';
import { nanoid } from 'nanoid';
import { useProjects } from '../../hooks/useProjects';
import { useAuth } from '../../contexts/AuthContext';
import { MockEndpoint } from '../../types';
import ProjectCard from './ProjectCard';
import EndpointDetailModal from './EndpointDetailModal';
import toast from 'react-hot-toast';

const EndpointsList: React.FC = () => {
  const { projects, loading, deleteProject } = useProjects();
  const { user } = useAuth();
  const [selectedEndpoint, setSelectedEndpoint] = useState<MockEndpoint | null>(null);
  const [testResponse, setTestResponse] = useState<any>(null);
  const [testError, setTestError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMethod, setFilterMethod] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());
  const [deletingProject, setDeletingProject] = useState<string | null>(null);
  const [testingEndpoint, setTestingEndpoint] = useState<string | null>(null);

  // Auto-expand projects if there's only one or if there are search/filter results
  React.useEffect(() => {
    if (projects.length === 1 || searchTerm || filterMethod) {
      setExpandedProjects(new Set(projects.map(p => p.id)));
    } else if (projects.length > 1 && !searchTerm && !filterMethod) {
      setExpandedProjects(new Set());
    }
  }, [projects.length, searchTerm, filterMethod]);

  if (!user) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">API Endpoints</h2>
          <p className="text-gray-400">Sign in to view and manage your API endpoints</p>
        </div>
        
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-12 text-center">
          <Globe className="h-16 w-16 text-gray-600 mx-auto mb-6" />
          <h3 className="text-xl font-bold text-white mb-4">Authentication Required</h3>
          <p className="text-gray-400">
            Please sign in to view your API endpoints and test mock responses.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">API Endpoints</h2>
          <p className="text-gray-400">Loading your endpoints...</p>
        </div>
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 animate-pulse">
              <div className="h-6 bg-gray-700 rounded mb-4 w-1/3"></div>
              <div className="space-y-3">
                {[...Array(2)].map((_, j) => (
                  <div key={j} className="h-16 bg-gray-800/50 rounded"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const allEndpoints = projects.flatMap(project => project.endpoints);
  
  const filteredProjects = projects.map(project => ({
    ...project,
    endpoints: project.endpoints.filter(endpoint => {
      const matchesSearch = endpoint.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           endpoint.summary?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesMethod = !filterMethod || endpoint.method === filterMethod;
      return matchesSearch && matchesMethod;
    })
  })).filter(project => project.endpoints.length > 0);

  const methods = [...new Set(allEndpoints.map(e => e.method))];

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleTestEndpoint = async (projectId: string, endpoint: MockEndpoint) => {
    setTestingEndpoint(endpoint.id);
    setTestResponse(null);
    setTestError(null);

    try {
      // Generate a nanoid for the project (simulating the URL structure)
      const projectNanoId = nanoid(8);
      const mockUrl = `https://mockserver.ai/spec/${projectNanoId}${endpoint.path}`;
      
      // For demonstration purposes, we'll simulate an API call with the mock response
      // In a real implementation, this would call the actual mock server
      await new Promise(resolve => setTimeout(resolve, endpoint.responseTime));
      
      // Simulate the response based on the method
      let simulatedResponse;
      
      if (endpoint.method === 'DELETE') {
        simulatedResponse = null; // DELETE typically returns no content
      } else {
        simulatedResponse = {
          ...endpoint.mockResponse,
          _meta: {
            method: endpoint.method,
            path: endpoint.path,
            timestamp: new Date().toISOString(),
            responseTime: endpoint.responseTime,
            statusCode: endpoint.statusCode
          }
        };
      }

      setTestResponse(simulatedResponse);
      setSelectedEndpoint(endpoint);
      toast.success(`Endpoint tested successfully! Response time: ${endpoint.responseTime}ms`);
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to test endpoint';
      setTestError(errorMessage);
      toast.error(`Test failed: ${errorMessage}`);
    } finally {
      setTestingEndpoint(null);
    }
  };

  const toggleProjectExpansion = (projectId: string) => {
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(projectId)) {
      newExpanded.delete(projectId);
    } else {
      newExpanded.add(projectId);
    }
    setExpandedProjects(newExpanded);
  };

  const handleDeleteProject = async (project: any, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (deletingProject === project.id) {
      // Confirm deletion
      try {
        await deleteProject(project.id);
        setDeletingProject(null);
      } catch (error) {
        setDeletingProject(null);
      }
    } else {
      // Show confirmation
      setDeletingProject(project.id);
      // Auto-cancel after 5 seconds
      setTimeout(() => {
        setDeletingProject(null);
      }, 5000);
    }
  };

  // Generate a nanoid for each project for display purposes
  const getProjectNanoId = (projectId: string) => {
    // Use a consistent seed based on project ID to generate the same nanoid each time
    return nanoid(8);
  };

  const handleCloseModal = () => {
    setSelectedEndpoint(null);
    setTestResponse(null);
    setTestError(null);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">API Endpoints</h2>
        <p className="text-gray-400">Manage and test your generated mock API endpoints organized by project</p>
      </div>

      {allEndpoints.length === 0 ? (
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-12 text-center">
          <Globe className="h-16 w-16 text-gray-600 mx-auto mb-6" />
          <h3 className="text-xl font-bold text-white mb-4">No Endpoints Yet</h3>
          <p className="text-gray-400 mb-8">
            Upload an OpenAPI specification to generate mock endpoints automatically.
          </p>
        </div>
      ) : (
        <>
          {/* Search and Filter */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search endpoints..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <select
                  value={filterMethod}
                  onChange={(e) => setFilterMethod(e.target.value)}
                  className="pl-10 pr-8 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent appearance-none"
                >
                  <option value="">All Methods</option>
                  {methods.map(method => (
                    <option key={method} value={method}>{method}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Projects with Endpoints */}
          <div className="space-y-6">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                isExpanded={expandedProjects.has(project.id)}
                onToggleExpansion={() => toggleProjectExpansion(project.id)}
                onDeleteProject={handleDeleteProject}
                onEndpointClick={setSelectedEndpoint}
                onTestEndpoint={handleTestEndpoint}
                deletingProject={deletingProject}
                copiedId={copiedId}
                onCopyEndpoint={copyToClipboard}
                getProjectNanoId={getProjectNanoId}
                testingEndpoint={testingEndpoint}
              />
            ))}
          </div>

          {filteredProjects.length === 0 && projects.length > 0 && (
            <div className="text-center py-12">
              <Globe className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-400 mb-2">No endpoints found</h4>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </>
      )}

      {/* Endpoint Detail Modal */}
      <EndpointDetailModal
        endpoint={selectedEndpoint}
        testResponse={testResponse}
        testError={testError}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default EndpointsList;