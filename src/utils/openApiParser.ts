import { OpenAPISpec, MockEndpoint } from '../types';
import { MockDataGenerator } from './mockGenerator';
import { nanoid } from 'nanoid';

export class OpenAPIParser {
  static parseSpec(spec: OpenAPISpec): MockEndpoint[] {
    const endpoints: MockEndpoint[] = [];

    Object.entries(spec.paths).forEach(([path, pathItem]) => {
      // Only process actual HTTP methods, not parameters or other OpenAPI constructs
      const httpMethods = ['get', 'post', 'put', 'delete', 'patch', 'head', 'options', 'trace'];
      
      Object.entries(pathItem).forEach(([key, operation]) => {
        // Skip if this is not an HTTP method (e.g., parameters, $ref, etc.)
        if (!httpMethods.includes(key.toLowerCase())) {
          return;
        }

        if (operation && typeof operation === 'object') {
          const responseSchema = this.getResponseSchema(operation.responses);
          const mockResponse = MockDataGenerator.generateRealisticResponse(
            path, 
            key.toUpperCase(), 
            responseSchema
          );

          endpoints.push({
            id: nanoid(),
            method: key.toUpperCase(),
            path,
            summary: operation.summary,
            description: operation.description,
            mockResponse,
            responseTime: Math.floor(Math.random() * 500) + 100,
            statusCode: this.getDefaultStatusCode(key.toUpperCase()),
            tags: operation.tags || []
          });
        }
      });
    });

    return endpoints;
  }

  private static getResponseSchema(responses: Record<string, any>) {
    // Check if responses exists and is an object
    if (!responses || typeof responses !== 'object') {
      return undefined;
    }

    // Try to get schema from 200 response first, then any successful response
    const successResponse = responses['200'] || responses['201'] || responses['204'];
    if (!successResponse?.content) return undefined;

    const mediaType = successResponse.content['application/json'];
    return mediaType?.schema;
  }

  private static getDefaultStatusCode(method: string): number {
    switch (method) {
      case 'POST': return 201;
      case 'DELETE': return 204;
      default: return 200;
    }
  }

  static validateSpec(spec: any): boolean {
    return (
      spec &&
      typeof spec === 'object' &&
      spec.openapi &&
      spec.info &&
      spec.paths &&
      typeof spec.paths === 'object'
    );
  }
}