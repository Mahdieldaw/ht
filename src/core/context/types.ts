/**
 * Defines the type for the session context.
 */

/**
 * Represents the state of a single step within a workflow execution.
 */
export interface WorkflowStepState {
  stepName: string;
  modelUsed?: string | string[]; // Can be single or multiple models
  promptSent?: string;
  rawResponse?: any; // Raw response from the model before normalization or array of responses
  output?: string | ModelResponse | ModelResponse[]; // Output of the step
  error?: string;
  timestamp: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped' | 'awaiting_synthesis';
  synthesisMethod?: 'manual' | 'ai';
}

/**
 * Defines the structure for the session context, which tracks all inputs,
 * outputs, and intermediate data throughout a user's session or a workflow execution.
 */
export interface SessionContext {
  /** A unique identifier for the session. */
  sessionId: string;
  /** Version of the SessionContext schema for migration purposes. */
  version: string;
  /** Timestamp of when the session was created. */
  createdAt: string;
  /** Timestamp of the last update to the session. */
  lastUpdatedAt: string;
  /** The initial input provided by the user or that started the workflow. */
  initialInput?: any;
  /** Stores outputs from various steps, keyed by a unique identifier (e.g., step name or a custom key). */
  stepOutputs: Record<string, any>; // Flexible store for {{variable}} interpolation
  /** Detailed log of each step executed in a workflow. */
  executionHistory: WorkflowStepState[];
  /** The final synthesized output, if applicable. */
  finalOutput?: string;
  /** Metadata related to the workflow being executed, if any. */
  workflowInfo?: {
    name: string;
    status?: 'idle' | 'running' | 'completed' | 'failed';
    currentStepIndex?: number;
  };
  /** Any other dynamic data that needs to be tracked. */
  [key: string]: any; // Allows for dynamic properties
}
