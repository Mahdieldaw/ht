import { ModelConnector, ModelResponse } from '../types';

export class ApiConnector implements ModelConnector {
  public name: string;
  public type: 'api' = 'api';
  private apiKey: string | null = null;
  private apiEndpoint: string;

  constructor(name: string, apiEndpoint: string, apiKey?: string) {
    this.name = name;
    this.apiEndpoint = apiEndpoint;
    if (apiKey) this.apiKey = apiKey;
  }

  public setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  async isAvailable(): Promise<boolean> {
    if (!this.apiKey) return false;
    // Optionally ping the endpoint
    return true;
  }

  async execute(prompt: string, options?: Record<string, any>): Promise<ModelResponse> {
    if (!this.apiKey) {
      return { success: false, error: 'API key not set', modelName: this.name };
    }
    // Simulate API call
    return {
      success: true,
      content: `API response for prompt: ${prompt}`,
      modelName: this.name,
    };
  }
}
