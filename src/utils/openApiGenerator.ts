import { OpenAPISpec } from '../types';
import { nanoid } from 'nanoid';

export class OpenAPIGenerator {
  static async generateFromPrompt(prompt: string): Promise<OpenAPISpec> {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Parse the prompt to extract key information
    const apiInfo = this.parsePrompt(prompt);
    
    // Generate OpenAPI specification
    const spec: OpenAPISpec = {
      openapi: '3.0.0',
      info: {
        title: apiInfo.title,
        version: '1.0.0',
        description: apiInfo.description
      },
      servers: [
        {
          url: 'https://api.example.com/v1',
          description: 'Production server'
        }
      ],
      paths: this.generatePaths(apiInfo.entities),
      components: {
        schemas: this.generateSchemas(apiInfo.entities)
      }
    };

    return spec;
  }

  private static parsePrompt(prompt: string): {
    title: string;
    description: string;
    entities: string[];
  } {
    const lowerPrompt = prompt.toLowerCase();
    
    // Extract API type/domain
    let title = 'Generated API';
    let description = prompt;
    
    if (lowerPrompt.includes('blog')) {
      title = 'Blog API';
    } else if (lowerPrompt.includes('ecommerce') || lowerPrompt.includes('e-commerce') || lowerPrompt.includes('shop')) {
      title = 'E-commerce API';
    } else if (lowerPrompt.includes('social')) {
      title = 'Social Media API';
    } else if (lowerPrompt.includes('task') || lowerPrompt.includes('project')) {
      title = 'Task Management API';
    } else if (lowerPrompt.includes('restaurant') || lowerPrompt.includes('food')) {
      title = 'Restaurant API';
    } else if (lowerPrompt.includes('user')) {
      title = 'User Management API';
    }

    // Extract entities from the prompt
    const commonEntities = [
      'user', 'users', 'post', 'posts', 'comment', 'comments', 'product', 'products',
      'order', 'orders', 'task', 'tasks', 'project', 'projects', 'category', 'categories',
      'tag', 'tags', 'review', 'reviews', 'message', 'messages', 'notification', 'notifications',
      'payment', 'payments', 'cart', 'profile', 'profiles', 'item', 'items'
    ];

    const entities = commonEntities.filter(entity => 
      lowerPrompt.includes(entity)
    ).slice(0, 5); // Limit to 5 entities

    // If no entities found, use default ones
    if (entities.length === 0) {
      entities.push('user', 'item');
    }

    return { title, description, entities };
  }

  private static generatePaths(entities: string[]): Record<string, any> {
    const paths: Record<string, any> = {};

    entities.forEach(entity => {
      const entityPath = `/${entity}s`;
      const entityIdPath = `/${entity}s/{id}`;

      // Collection endpoints
      paths[entityPath] = {
        get: {
          summary: `Get all ${entity}s`,
          description: `Retrieve a list of all ${entity}s`,
          tags: [this.capitalize(entity)],
          parameters: [
            {
              name: 'page',
              in: 'query',
              schema: { type: 'integer', default: 1 },
              description: 'Page number'
            },
            {
              name: 'limit',
              in: 'query',
              schema: { type: 'integer', default: 10 },
              description: 'Number of items per page'
            }
          ],
          responses: {
            '200': {
              description: 'Successful response',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      data: {
                        type: 'array',
                        items: { $ref: `#/components/schemas/${this.capitalize(entity)}` }
                      },
                      pagination: {
                        type: 'object',
                        properties: {
                          page: { type: 'integer' },
                          limit: { type: 'integer' },
                          total: { type: 'integer' }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        post: {
          summary: `Create a new ${entity}`,
          description: `Create a new ${entity}`,
          tags: [this.capitalize(entity)],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: `#/components/schemas/Create${this.capitalize(entity)}` }
              }
            }
          },
          responses: {
            '201': {
              description: 'Created successfully',
              content: {
                'application/json': {
                  schema: { $ref: `#/components/schemas/${this.capitalize(entity)}` }
                }
              }
            }
          }
        }
      };

      // Individual item endpoints
      paths[entityIdPath] = {
        get: {
          summary: `Get ${entity} by ID`,
          description: `Retrieve a specific ${entity} by its ID`,
          tags: [this.capitalize(entity)],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: `${this.capitalize(entity)} ID`
            }
          ],
          responses: {
            '200': {
              description: 'Successful response',
              content: {
                'application/json': {
                  schema: { $ref: `#/components/schemas/${this.capitalize(entity)}` }
                }
              }
            },
            '404': {
              description: `${this.capitalize(entity)} not found`
            }
          }
        },
        put: {
          summary: `Update ${entity}`,
          description: `Update a specific ${entity}`,
          tags: [this.capitalize(entity)],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: `${this.capitalize(entity)} ID`
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: `#/components/schemas/Update${this.capitalize(entity)}` }
              }
            }
          },
          responses: {
            '200': {
              description: 'Updated successfully',
              content: {
                'application/json': {
                  schema: { $ref: `#/components/schemas/${this.capitalize(entity)}` }
                }
              }
            }
          }
        },
        delete: {
          summary: `Delete ${entity}`,
          description: `Delete a specific ${entity}`,
          tags: [this.capitalize(entity)],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: `${this.capitalize(entity)} ID`
            }
          ],
          responses: {
            '204': {
              description: 'Deleted successfully'
            },
            '404': {
              description: `${this.capitalize(entity)} not found`
            }
          }
        }
      };
    });

    return paths;
  }

  private static generateSchemas(entities: string[]): Record<string, any> {
    const schemas: Record<string, any> = {};

    entities.forEach(entity => {
      const capitalizedEntity = this.capitalize(entity);
      
      // Base schema
      schemas[capitalizedEntity] = {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: nanoid()
          },
          ...this.getEntityProperties(entity),
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2023-01-01T00:00:00Z'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            example: '2023-01-01T00:00:00Z'
          }
        },
        required: ['id', 'createdAt', 'updatedAt']
      };

      // Create schema (without id, timestamps)
      schemas[`Create${capitalizedEntity}`] = {
        type: 'object',
        properties: this.getEntityProperties(entity),
        required: this.getRequiredFields(entity)
      };

      // Update schema (optional fields)
      schemas[`Update${capitalizedEntity}`] = {
        type: 'object',
        properties: this.getEntityProperties(entity)
      };
    });

    return schemas;
  }

  private static getEntityProperties(entity: string): Record<string, any> {
    const commonProps = {
      name: {
        type: 'string',
        example: `Sample ${entity}`
      },
      description: {
        type: 'string',
        example: `Description for ${entity}`
      }
    };

    switch (entity) {
      case 'user':
        return {
          email: {
            type: 'string',
            format: 'email',
            example: 'user@example.com'
          },
          name: {
            type: 'string',
            example: 'John Doe'
          },
          avatar: {
            type: 'string',
            format: 'uri',
            example: 'https://example.com/avatar.jpg'
          },
          isActive: {
            type: 'boolean',
            example: true
          }
        };
      case 'post':
        return {
          title: {
            type: 'string',
            example: 'Sample Post Title'
          },
          content: {
            type: 'string',
            example: 'This is the content of the post...'
          },
          authorId: {
            type: 'string',
            example: nanoid()
          },
          published: {
            type: 'boolean',
            example: true
          }
        };
      case 'product':
        return {
          name: {
            type: 'string',
            example: 'Sample Product'
          },
          description: {
            type: 'string',
            example: 'Product description'
          },
          price: {
            type: 'number',
            format: 'float',
            example: 29.99
          },
          category: {
            type: 'string',
            example: 'Electronics'
          },
          inStock: {
            type: 'boolean',
            example: true
          }
        };
      case 'task':
        return {
          title: {
            type: 'string',
            example: 'Complete project'
          },
          description: {
            type: 'string',
            example: 'Task description'
          },
          status: {
            type: 'string',
            enum: ['todo', 'in-progress', 'completed'],
            example: 'todo'
          },
          priority: {
            type: 'string',
            enum: ['low', 'medium', 'high'],
            example: 'medium'
          },
          assigneeId: {
            type: 'string',
            example: nanoid()
          }
        };
      default:
        return commonProps;
    }
  }

  private static getRequiredFields(entity: string): string[] {
    switch (entity) {
      case 'user':
        return ['email', 'name'];
      case 'post':
        return ['title', 'content', 'authorId'];
      case 'product':
        return ['name', 'price'];
      case 'task':
        return ['title', 'status'];
      default:
        return ['name'];
    }
  }

  private static capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}