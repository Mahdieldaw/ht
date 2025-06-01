import { WorkflowExecutor } from '../workflow/WorkflowExecutor';
import { PromptRenderer } from '../templating/PromptRenderer';
import { ModelRouter } from '../../models/ModelRouter';
import { SynthesisEngine } from '../../synthesis/SynthesisEngine';
import { createNewSession, SessionContext } from '../context/SessionContext';
import { Workflow } from '../workflow/types';

// Mock ModelConnector
const mockConnector = {
  name: 'mock',
  type: 'api',
  isAvailable: jest.fn().mockResolvedValue(true),
  execute: jest.fn().mockResolvedValue({ success: true, content: 'result', modelName: 'mock' }),
};

const getSynthesizer = () => ({
  method: 'manual',
  synthesize: jest.fn().mockResolvedValue('synthesized'),
});

describe('WorkflowExecutor', () => {
  let session: SessionContext;
  let executor: WorkflowExecutor;
  let modelRouter: ModelRouter;

  beforeEach(() => {
    session = createNewSession('test');
    modelRouter = new ModelRouter();
    modelRouter.registerConnector(mockConnector as any);
    executor = new WorkflowExecutor(session, {
      modelRouter,
      promptRenderer: new PromptRenderer(),
      getSynthesizer,
    });
  });

  it('propagates context between steps', async () => {
    const workflow: Workflow = {
      name: 'test',
      steps: [
        { name: 'step1', prompt: 'foo', model: 'mock', output: 'fooOut' },
        { name: 'step2', prompt: '{{fooOut}}', model: 'mock', output: 'barOut' },
      ],
    };
    executor.loadWorkflow(workflow);
    await executor.executeWorkflow();
    expect(session.stepOutputs.fooOut).toBe('result');
    expect(session.stepOutputs.barOut).toBe('result');
  });

  it('records error and stops on failure', async () => {
    (mockConnector.execute as jest.Mock).mockResolvedValueOnce({ success: false, error: 'fail', modelName: 'mock' });
    const workflow: Workflow = {
      name: 'failtest',
      steps: [
        { name: 'failstep', prompt: 'fail', model: 'mock', output: 'failOut' },
        { name: 'shouldSkip', prompt: 'skip', model: 'mock', output: 'skipOut' },
      ],
    };
    executor.loadWorkflow(workflow);
    await executor.executeWorkflow();
    expect(session.executionHistory[0].status).toBe('failed');
    expect(session.executionHistory[0].error).toBe('fail');
    expect(session.executionHistory.length).toBe(1);
  });

  it('handles multi-model step and propagates synthesized output', async () => {
    const multiConnector = {
      name: 'multi',
      type: 'api' as const,
      isAvailable: jest.fn().mockResolvedValue(true),
      execute: jest.fn().mockResolvedValue({ success: true, content: 'multi-result', modelName: 'multi' }),
    };
    modelRouter.registerConnector(multiConnector);
    const workflow: Workflow = {
      name: 'multi',
      steps: [
        {
          name: 'multiStep',
          prompt: 'multi',
          model: 'mock',
          multiModelConfig: {
            models: ['mock', 'multi'],
            synthesisMethod: 'manual',
          },
          output: 'multiOut',
        },
      ],
    };
    executor.loadWorkflow(workflow);
    await executor.executeWorkflow();
    expect(session.stepOutputs.multiOut).toBe('synthesized');
  });
});
