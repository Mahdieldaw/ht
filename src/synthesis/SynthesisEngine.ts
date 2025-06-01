import { ModelResponse } from '../models/types';
import { Synthesizer } from './types';
import { ModelConnector } from '../models/types';

class ManualSynthesizer implements Synthesizer {
  public method: 'manual' = 'manual';

  async synthesize(responses: ModelResponse[]): Promise<string> {
    // For programmatic use, this might return a structured representation or instructions.
    return responses.map(r => r.content || '').join('\n---\n');
  }
}

class AiSynthesizer implements Synthesizer {
  public method: 'ai' = 'ai';
  private synthesisModel: ModelConnector;

  constructor(synthesisModel: ModelConnector) {
    this.synthesisModel = synthesisModel;
  }

  async synthesize(responses: ModelResponse[], instructions?: string): Promise<string> {
    const validResponses = responses.filter(r => r.success && r.content);
    const responseTexts = validResponses.map((r, index) => `\nResponse ${index + 1} (from model: ${r.modelName || 'Unknown'}):\n\u0060\u0060\u0060\n${r.content}\n\u0060\u0060\u0060`).join('\n---\n');
    const defaultInstructions = 'Please synthesize the following model responses into a single, clear, and accurate answer.';
    const synthesisPrompt = `\n${instructions || defaultInstructions}\n\nThe original prompt might have been complex, but focus on the provided responses. Here are the responses to synthesize:\n\n${responseTexts}\n\nSynthesized Response:\n`;
    try {
      const result = await this.synthesisModel.execute(synthesisPrompt);
      if (result.success && result.content) {
        return result.content;
      }
      throw new Error(result.error || 'AI synthesis failed');
    } catch (error) {
      throw new Error(`AI synthesis process encountered an error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

export class SynthesisEngine {
  private synthesizers: Map<string, Synthesizer>;

  constructor(aiSynthesisModel?: ModelConnector) {
    this.synthesizers = new Map();
    this.registerSynthesizer(new ManualSynthesizer());
    if (aiSynthesisModel) {
      this.registerSynthesizer(new AiSynthesizer(aiSynthesisModel));
    }
  }

  public registerSynthesizer(synthesizer: Synthesizer): void {
    this.synthesizers.set(synthesizer.method, synthesizer);
  }

  public getSynthesizer(method: 'manual' | 'ai'): Synthesizer | undefined {
    return this.synthesizers.get(method);
  }

  public async synthesize(
    responses: ModelResponse[],
    method: 'manual' | 'ai' = 'manual',
    instructions?: string
  ): Promise<string> {
    const synthesizer = this.getSynthesizer(method);
    if (!synthesizer) throw new Error(`No synthesizer registered for method: ${method}`);
    return synthesizer.synthesize(responses, instructions);
  }
}
