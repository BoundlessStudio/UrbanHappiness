import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export const useApiKey = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);
  const { user } = useAuth();

  const fetchApiKey = async () => {
    if (!user) {
      setApiKey(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('api_key')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      
      setApiKey(data.api_key);
    } catch (error: any) {
      console.error('Error fetching API key:', error);
      toast.error('Failed to fetch API key');
    } finally {
      setLoading(false);
    }
  };

  const resetApiKey = async () => {
    if (!user) return;

    setResetting(true);
    try {
      const { data, error } = await supabase.rpc('generate_api_key');
      
      if (error) throw error;

      const newApiKey = data;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          api_key: newApiKey,
          api_key_created_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setApiKey(newApiKey);
      toast.success('API key reset successfully!');
    } catch (error: any) {
      console.error('Error resetting API key:', error);
      toast.error('Failed to reset API key');
    } finally {
      setResetting(false);
    }
  };

  useEffect(() => {
    fetchApiKey();
  }, [user]);

  return {
    apiKey,
    loading,
    resetting,
    resetApiKey,
    refetch: fetchApiKey
  };
};