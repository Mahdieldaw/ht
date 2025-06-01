/**
 * Defines the types and interfaces related to response synthesis.
 */
import { ModelResponse } from '../models/types';

/**
 * Interface for a synthesizer.
 * Synthesizers are responsible for combining multiple model responses
 * into a single, refined output.
 */
export interface Synthesizer {
  /** The method of synthesis (manual or AI-driven). */
  method: 'manual' | 'ai';

  /**
   * Synthesizes an array of model responses into a single string.
   */
  synthesize(responses: ModelResponse[], instructions?: string): Promise<string>;
}
