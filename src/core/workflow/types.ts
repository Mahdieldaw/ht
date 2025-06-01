/**
 * Defines types related to workflows and their execution steps.
 */

/**
 * Represents a single step within a workflow definition.
 */
export interface WorkflowStep {
  /** A unique name for this step within the workflow. */
  name: string;
  /** The prompt template for this step. May include {{variable}} placeholders. */
  prompt: string;
  /** The name or identifier of the model to be used for this step. */
  model: string; // Could be a specific model ID or a generic type like "claude", "gemini"
  /**
   * The key under which the output of this step will be stored in the SessionContext.
   * This key can then be used for variable interpolation in subsequent steps.
   * If not provided, a default naming convention might be used (e.g., stepName_output).
   */
  output?: string;
  /** Optional parameters specific to this model or step. */
  params?: Record<string, any>;
  /** Optional: Specify models to run in parallel for this step, and how to synthesize. */
  multiModelConfig?: {
    models: string[]; // Array of model names/IDs
    synthesisMethod?: 'manual' | 'ai'; // Default to manual if not specified
    synthesisInstructions?: string; // For AI synthesis
  };
  /** Optional: Condition for executing this step, expressed as a string to be evaluated. */
  condition?: string;
}

/**
 * Represents a workflow definition.
 * Typically loaded from a YAML file.
 */
export interface Workflow {
  /** The name of the workflow. */
  name: string;
  /** A brief description of what the workflow does. */
  description?: string;
  /** The version of the workflow definition. */
  version?: string;
  /** An array of steps that define the workflow. */
  steps: WorkflowStep[];
  /** Default model to use if a step doesn't specify one. */
  defaultModel?: string;
  /** Input variables expected by the workflow. */
  inputs?: Record<string, { type: string; description?: string; required?: boolean }>;
}
