export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          openapi_spec: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          openapi_spec: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          openapi_spec?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
      endpoints: {
        Row: {
          id: string;
          project_id: string;
          method: string;
          path: string;
          summary: string | null;
          description: string | null;
          mock_response: any;
          response_time: number;
          status_code: number;
          tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          method: string;
          path: string;
          summary?: string | null;
          description?: string | null;
          mock_response?: any;
          response_time?: number;
          status_code?: number;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          method?: string;
          path?: string;
          summary?: string | null;
          description?: string | null;
          mock_response?: any;
          response_time?: number;
          status_code?: number;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}