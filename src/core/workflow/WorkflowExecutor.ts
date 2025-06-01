/**
 * Executes multi-step processes defined in YAML workflows.
 */
import { SessionContext, WorkflowStepState } from '../context/types';
import { Workflow, WorkflowStep } from './types';
import { ModelConnector, ModelResponse } from '../../models/types';
import { PromptRenderer } from '../templating/PromptRenderer';
import { ModelRouter } from '../../models/ModelRouter';
import { Synthesizer } from '../../synthesis/types';

interface ExecutionDependencies {
  modelRouter: ModelRouter;
  promptRenderer: PromptRenderer;
  getSynthesizer: (method: 'manual' | 'ai') => Synthesizer | undefined;
}

export class WorkflowExecutor {
  private currentWorkflow: Workflow | null = null;
  private sessionContext: SessionContext;
  private dependencies: ExecutionDependencies;

  constructor(sessionContext: SessionContext, dependencies: ExecutionDependencies) {
    this.sessionContext = sessionContext;
    this.dependencies = dependencies;
  }

  public loadWorkflow(workflow: Workflow): void {
    this.currentWorkflow = workflow;
    this.sessionContext.workflowInfo = {
      name: workflow.name,
      currentStepIndex: 0,
    };
    this.sessionContext.executionHistory = [];
    console.log(`Workflow "${workflow.name}" loaded and validated.`);
  }

  public async executeWorkflow(startStepIndex: number = 0): Promise<SessionContext> {
    if (!this.currentWorkflow) {
      this.onError(new Error('No workflow loaded.'));
      return this.getContext();
    }

    this.sessionContext.workflowInfo = {
      ...this.sessionContext.workflowInfo,
      name: this.currentWorkflow.name,
      currentStepIndex: startStepIndex,
    };

    for (let i = startStepIndex; i < this.currentWorkflow.steps.length; i++) {
      const step = this.currentWorkflow.steps[i];
      if (this.sessionContext.workflowInfo) {
        this.sessionContext.workflowInfo.currentStepIndex = i;
      }
      const stepState: WorkflowStepState = {
        stepName: step.name,
        status: 'pending',
        timestamp: new Date().toISOString(),
      };
      this.sessionContext.executionHistory.push(stepState);
      try {
        stepState.status = 'running';
        await this.runStep(step, stepState);
        stepState.status = 'completed';
      } catch (error) {
        stepState.status = 'failed';
        stepState.error = error instanceof Error ? error.message : String(error);
        this.onError(error instanceof Error ? error : new Error(String(error)), step);
        return this.getContext();
      }
    }
    return this.getContext();
  }

  public async runStep(step: WorkflowStep, stepState: WorkflowStepState): Promise<void> {
    stepState.timestamp = new Date().toISOString();
    try {
      const renderedPrompt = this.dependencies.promptRenderer.render(step.prompt, this.sessionContext.stepOutputs);
      stepState.promptSent = renderedPrompt;
      let stepOutput: string | ModelResponse | ModelResponse[];
      if (step.multiModelConfig && step.multiModelConfig.models.length > 0) {
        // Multi-model execution
        const responses: ModelResponse[] = [];
        const modelPromises = step.multiModelConfig.models.map(async modelName => {
          const connector = await this.dependencies.modelRouter.getConnector(modelName);
          if (!connector) {
            throw new Error(`Connector for model "${modelName}" not found or unavailable for step "${step.name}".`);
          }
          return connector.execute(renderedPrompt, step.params);
        });
        const results = await Promise.allSettled(modelPromises);
        results.forEach(result => {
          if (result.status === 'fulfilled') {
            responses.push(result.value);
          } else {
            responses.push({ success: false, error: String(result.reason), modelName: 'unknown' });
          }
        });
        stepState.rawResponse = responses;
        // Synthesis
        const synthesisMethod = step.multiModelConfig.synthesisMethod || 'manual';
        const synthesizer = this.dependencies.getSynthesizer(synthesisMethod);
        if (!synthesizer) {
          throw new Error(`Synthesizer method "${synthesisMethod}" not available for step "${step.name}".`);
        }
        stepOutput = await synthesizer.synthesize(responses, step.multiModelConfig.synthesisInstructions);
      } else {
        // Single model execution
        const modelName = step.model || (this.currentWorkflow?.defaultModel);
        if (!modelName) {
          throw new Error(`No model specified for step "${step.name}" and no default workflow model set.`);
        }
        const connector = await this.dependencies.modelRouter.getConnector(modelName);
        if (!connector) {
          throw new Error(`Connector for model "${modelName}" not found or unavailable for step "${step.name}".`);
        }
        stepState.modelUsed = connector.name;
        const response = await connector.execute(renderedPrompt, step.params);
        stepState.rawResponse = response;
        if (!response.success) {
          throw new Error(response.error || `Model execution failed for step "${step.name}"`);
        }
        stepOutput = response.content || '';
      }
      // Store output in session context
      const outputKey = step.output || `${step.name}_output`;
      this.sessionContext.stepOutputs[outputKey] = stepOutput;
      stepState.output = stepOutput;
    } catch (error) {
      throw error;
    }
  }

  public completeManualSynthesis(stepName: string, synthesizedContent: string): void {
    const stepState = this.sessionContext.executionHistory.find(s => s.stepName === stepName && s.status === 'awaiting_synthesis');
    // ...handle manual synthesis completion...
  }

  public onError(error: Error, step?: WorkflowStep): void {
    console.error('Workflow execution error:', error.message, step ? `at step "${step.name}"` : '');
    // ...additional error handling...
  }

  public getContext(): SessionContext {
    return this.sessionContext;
  }
}
