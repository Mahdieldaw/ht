import { ModelConnector, ModelResponse } from '../types';

export class LocalConnector implements ModelConnector {
  public name: string;
  public type: 'local' = 'local';
  private modelId: string;
  private localApiEndpoint: string;

  constructor(connectorInstanceName: string, modelId: string, localApiEndpoint: string = "http://localhost:11434") {
    this.name = connectorInstanceName;
    this.modelId = modelId;
    this.localApiEndpoint = localApiEndpoint;
  }

  async isAvailable(): Promise<boolean> {
    // Simulate always available for stub
    return true;
  }

  async execute(prompt: string, options?: Record<string, any>): Promise<ModelResponse> {
    if (!await this.isAvailable()) {
      return { success: false, error: 'Local model not available', modelName: this.name };
    }
    // Simulate local model response
    return {
      success: true,
      content: `Local model (${this.modelId}) response for prompt: ${prompt}`,
      modelName: this.name,
    };
  }
}
