import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Project, OpenAPISpec } from '../types';
import { OpenAPIParser } from '../utils/openApiParser';
import toast from 'react-hot-toast';

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchProjects = async () => {
    if (!user) {
      setProjects([]);
      setLoading(false);
      return;
    }

    try {
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (projectsError) throw projectsError;

      const { data: endpointsData, error: endpointsError } = await supabase
        .from('endpoints')
        .select('*')
        .in('project_id', projectsData?.map(p => p.id) || []);

      if (endpointsError) throw endpointsError;

      const projectsWithEndpoints: Project[] = projectsData?.map(project => ({
        id: project.id,
        name: project.name,
        description: project.description,
        spec: project.openapi_spec,
        endpoints: endpointsData?.filter(endpoint => endpoint.project_id === project.id).map(endpoint => ({
          id: endpoint.id,
          method: endpoint.method,
          path: endpoint.path,
          summary: endpoint.summary,
          description: endpoint.description,
          mockResponse: endpoint.mock_response,
          responseTime: endpoint.response_time,
          statusCode: endpoint.status_code,
          tags: endpoint.tags
        })) || [],
        createdAt: new Date(project.created_at),
        updatedAt: new Date(project.updated_at)
      })) || [];

      setProjects(projectsWithEndpoints);
    } catch (error: any) {
      toast.error('Failed to fetch projects');
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (spec: OpenAPISpec, name: string) => {
    if (!user) {
      toast.error('You must be signed in to create projects');
      return;
    }

    try {
      // Create project
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert({
          user_id: user.id,
          name,
          description: spec.info.description,
          openapi_spec: spec
        })
        .select()
        .single();

      if (projectError) throw projectError;

      // Generate and create endpoints
      const endpoints = OpenAPIParser.parseSpec(spec);
      
      const { error: endpointsError } = await supabase
        .from('endpoints')
        .insert(
          endpoints.map(endpoint => ({
            project_id: project.id,
            method: endpoint.method,
            path: endpoint.path,
            summary: endpoint.summary,
            description: endpoint.description,
            mock_response: endpoint.mockResponse,
            response_time: endpoint.responseTime,
            status_code: endpoint.statusCode,
            tags: endpoint.tags
          }))
        );

      if (endpointsError) throw endpointsError;

      toast.success('Project created successfully!');
      await fetchProjects();
    } catch (error: any) {
      toast.error('Failed to create project');
      console.error('Error creating project:', error);
      throw error;
    }
  };

  const updateProjectSpec = async (projectId: string, newSpec: OpenAPISpec) => {
    if (!user) {
      toast.error('You must be signed in to update projects');
      return;
    }

    // Store the original state for rollback
    const originalProjects = [...projects];
    
    try {
      // Generate new endpoints from the updated spec
      const newEndpoints = OpenAPIParser.parseSpec(newSpec);
      
      // Immediately update the local state with complete data
      setProjects(currentProjects => 
        currentProjects.map(project => 
          project.id === projectId 
            ? { 
                ...project, 
                name: newSpec.info.title,
                description: newSpec.info.description,
                spec: newSpec,
                endpoints: newEndpoints,
                updatedAt: new Date()
              }
            : project
        )
      );

      // Update the project with new spec, name, and description in the background
      const { error: projectError } = await supabase
        .from('projects')
        .update({
          name: newSpec.info.title,
          description: newSpec.info.description,
          openapi_spec: newSpec,
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId)
        .eq('user_id', user.id);

      if (projectError) throw projectError;

      // Delete existing endpoints for this project
      const { error: deleteError } = await supabase
        .from('endpoints')
        .delete()
        .eq('project_id', projectId);

      if (deleteError) throw deleteError;

      // Generate new endpoints from the updated spec
      if (newEndpoints.length > 0) {
        const { error: endpointsError } = await supabase
          .from('endpoints')
          .insert(
            newEndpoints.map(endpoint => ({
              project_id: projectId,
              method: endpoint.method,
              path: endpoint.path,
              summary: endpoint.summary,
              description: endpoint.description,
              mock_response: endpoint.mockResponse,
              response_time: endpoint.responseTime,
              status_code: endpoint.statusCode,
              tags: endpoint.tags
            }))
          );

        if (endpointsError) throw endpointsError;
      }
      
      toast.success('OpenAPI specification updated successfully!');
      
      // Optionally refresh from database after a short delay to ensure consistency
      setTimeout(async () => {
        try {
          await fetchProjects();
        } catch (error) {
          // If fetch fails, keep the optimistic update
          console.warn('Failed to refresh data after update, keeping optimistic update:', error);
        }
      }, 500);
      
    } catch (error: any) {
      // Rollback to original state on error
      setProjects(originalProjects);
      toast.error('Failed to update OpenAPI specification');
      console.error('Error updating project spec:', error);
      throw error;
    }
  };

  const deleteProject = async (projectId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Project deleted successfully!');
      await fetchProjects();
    } catch (error: any) {
      toast.error('Failed to delete project');
      console.error('Error deleting project:', error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [user]);

  return {
    projects,
    loading,
    createProject,
    updateProjectSpec,
    deleteProject,
    refetch: fetchProjects
  };
};