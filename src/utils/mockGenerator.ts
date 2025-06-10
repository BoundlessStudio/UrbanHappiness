import { Schema, OpenAPISpec } from '../types';
import { nanoid } from 'nanoid';

export class MockDataGenerator {
  private static getRandomString(length: number = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private static getRandomEmail(): string {
    const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'example.com'];
    const name = this.getRandomString(6).toLowerCase();
    const domain = domains[Math.floor(Math.random() * domains.length)];
    return `${name}@${domain}`;
  }

  private static getRandomDate(): string {
    const start = new Date(2020, 0, 1);
    const end = new Date();
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.toISOString();
  }

  private static generateFromSchema(schema: Schema): any {
    if (schema.example !== undefined) {
      return schema.example;
    }

    if (schema.enum) {
      return schema.enum[Math.floor(Math.random() * schema.enum.length)];
    }

    switch (schema.type) {
      case 'string':
        if (schema.format === 'email') return this.getRandomEmail();
        if (schema.format === 'date' || schema.format === 'date-time') return this.getRandomDate();
        if (schema.format === 'uuid') return nanoid();
        return this.getRandomString();
      
      case 'integer':
      case 'number':
        return Math.floor(Math.random() * 1000) + 1;
      
      case 'boolean':
        return Math.random() > 0.5;
      
      case 'array':
        const arrayLength = Math.floor(Math.random() * 5) + 1;
        return Array.from({ length: arrayLength }, () => 
          schema.items ? this.generateFromSchema(schema.items) : this.getRandomString()
        );
      
      case 'object':
        if (!schema.properties) return {};
        
        const obj: any = {};
        Object.entries(schema.properties).forEach(([key, propSchema]) => {
          const isRequired = schema.required?.includes(key) ?? Math.random() > 0.3;
          if (isRequired) {
            obj[key] = this.generateFromSchema(propSchema);
          }
        });
        return obj;
      
      default:
        return this.getRandomString();
    }
  }

  static generateMockResponse(responseSchema?: Schema): any {
    if (!responseSchema) {
      return {
        message: "Success",
        timestamp: new Date().toISOString(),
        data: {}
      };
    }

    return this.generateFromSchema(responseSchema);
  }

  static generateRealisticResponse(operationPath: string, method: string, responseSchema?: Schema): any {
    // Generate more realistic responses based on common API patterns
    const pathSegments = operationPath.split('/').filter(segment => segment);
    const resourceName = pathSegments[pathSegments.length - 1]?.replace(/\{.*\}/, '');

    if (method === 'GET' && pathSegments.includes('users')) {
      return {
        id: nanoid(),
        name: `User ${Math.floor(Math.random() * 1000)}`,
        email: this.getRandomEmail(),
        createdAt: this.getRandomDate(),
        isActive: true
      };
    }

    if (method === 'POST') {
      return {
        success: true,
        message: `${resourceName || 'Resource'} created successfully`,
        id: nanoid(),
        timestamp: new Date().toISOString()
      };
    }

    if (responseSchema) {
      return this.generateFromSchema(responseSchema);
    }

    return {
      success: true,
      message: "Operation completed successfully",
      timestamp: new Date().toISOString()
    };
  }
}