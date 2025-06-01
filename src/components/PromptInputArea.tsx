/**
 * UI Component for entering prompts or loading workflows.
 */
import React from 'react';
import { Workflow } from '../core/workflow/types';

interface PromptInputAreaProps {
  onSubmit: (promptOrWorkflowName: string, isWorkflow: boolean, workflowDefinition?: Workflow) => void;
  isLoading: boolean;
}

export const PromptInputArea: React.FC<PromptInputAreaProps> = ({ onSubmit, isLoading }) => {
  // ...existing code...
  return <div>Prompt Input Area</div>;
};
