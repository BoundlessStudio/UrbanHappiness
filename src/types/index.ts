export interface OpenAPISpec {
  openapi: string;
  info: {
    title: string;
    version: string;
    description?: string;
  };
  servers?: Array<{
    url: string;
    description?: string;
  }>;
  paths: Record<string, PathItem>;
  components?: {
    schemas?: Record<string, Schema>;
  };
}

export interface PathItem {
  get?: Operation;
  post?: Operation;
  put?: Operation;
  delete?: Operation;
  patch?: Operation;
}

export interface Operation {
  summary?: string;
  description?: string;
  parameters?: Parameter[];
  requestBody?: RequestBody;
  responses: Record<string, Response>;
  tags?: string[];
}

export interface Parameter {
  name: string;
  in: 'query' | 'path' | 'header' | 'cookie';
  required?: boolean;
  schema: Schema;
  description?: string;
}

export interface RequestBody {
  content: Record<string, MediaType>;
  required?: boolean;
}

export interface Response {
  description: string;
  content?: Record<string, MediaType>;
}

export interface MediaType {
  schema: Schema;
}

export interface Schema {
  type?: string;
  properties?: Record<string, Schema>;
  items?: Schema;
  example?: any;
  format?: string;
  enum?: any[];
  required?: string[];
}

export interface MockEndpoint {
  id: string;
  method: string;
  path: string;
  summary?: string;
  description?: string;
  mockResponse: any;
  responseTime: number;
  statusCode: number;
  tags: string[];
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  spec: OpenAPISpec;
  endpoints: MockEndpoint[];
  createdAt: Date;
  updatedAt: Date;
}