

# Hybrid Thinking

  

**An operating system for AI-native thought: modular, multi-model orchestration with traceable workflows, synthesis, and exports.**

  

Hybrid Thinking is a web-first, plugin-based framework that helps professionals orchestrate multi-stage AI workflows—across API-based, browser-based, and local LLMs—while ensuring full traceability and extensibility.  

  

 

  

## Table of Contents

  

1. [Introduction & Vision](#introduction--vision)  

2. [Installation & Prerequisites](#installation--prerequisites)  

3. [Getting Started](#getting-started)  

4. [How Workflows Work](#how-workflows-work)  

5. [Plugin Support](#plugin-support)  

6. [Example Usage](#example-usage)  

7. [Extending Hybrid Thinking](#extending-hybrid-thinking)  

8. [Testing Strategy](#testing-strategy)  

9. [Troubleshooting & FAQs](#troubleshooting--faqs)  

10. [License](#license)  

  

---

  

## Introduction & Vision

  

Hybrid Thinking is a modular, plugin-driven orchestration engine for AI-native productivity.  

- **Problem Solved:** Orchestrates multi-model reasoning workflows in a systematic, auditable manner.  

- **Key Differentiators:**  

  1. **Universal Model Access** – Seamless use of API (OpenAI, Gemini, Anthropic), browser (ChatGPT, Claude via Puppeteer), or local LLMs (Ollama, LM Studio).  

  2. **Prompt Systematization** – Structured, YAML-defined workflows replace ad-hoc prompts; every step is traceable and templated.  

  3. **Synthesis as First-Class Citizen** – Responses from multiple models are compared, merged, and refined, either manually or via AI.  

  4. **Export-Oriented Output** – Every step’s output is exportable as Markdown (with YAML frontmatter), JSON, or YAML—ready for Obsidian, Notion, or any other tool.  

  5. **Human-AI Co-Piloting** – Designed for professionals who want to orchestrate AI, not just consume outputs. Manual overrides, validation, and contextual control are always available.

  

---

  

## Installation & Prerequisites

  

1. **Node.js** (LTS recommended, e.g., v18.x or v20.x)  

2. **NPM or Yarn**  

3. **Supported Browsers (for Browser-Bridge)**:  

   - Chrome 100+  

   - Firefox 90+  

   - Edge 100+  

4. _(Optional)_ **Docker** – for spinning up a local LLM bridge or consistent dev environment.

  

```bash

# Clone the repo

git clone https://github.com/your-org/hybrid-thinking.git

cd hybrid-thinking

  

# Install dependencies

npm install

# or

yarn install

  

  

  

  

  

Getting Started

  

  

  

Development Server

  

# Start the development server (React + local bridge)

npm start

# or

yarn start

Open your browser at http://localhost:3000.

  

- The app runs entirely in the browser for MVP (no backend DB required).
- For Browser-Bridge connectors (e.g., Claude via Puppeteer), ensure your Puppeteer bridge service is running (if configured).
- For local LLM connectors (Ollama, LM Studio), start your local LLM server on its default port so Hybrid Thinking can auto-detect it.

  

  

  

Environment Variables

  

  

Create a .env file in the project root with any of the following (example):

REACT_APP_DEFAULT_MODEL=gemini

REACT_APP_PUPPETEER_BRIDGE_URL=http://localhost:8080

REACT_APP_API_KEYS_GEMINI=<your_gemini_api_key>

REACT_APP_API_KEYS_OPENAI=<your_openai_api_key>

  

  

  

  

  

How Workflows Work

  

  

  

1. Workflow Structure (YAML)

  

  

Every workflow is defined in YAML. Example:

name: "Content Strategy"

description: "Generate a blog post outline and first draft."

steps:

  - id: analyze

    archetype: RESEARCH_AND_ANALYSIS

    model: "gemini"

    prompt: |

      Analyze the following market data and extract key themes: {{initial_input}}

    output: "analysis"

  

  - id: brainstorm

    archetype: IDEATION_AND_EXPLORATION

    model: "claude"

    prompt: |

      Use the analysis from step “analysis” to brainstorm five unique blog topics.

      Analysis: {{analysis}}

    output: "ideas"

  

  - id: draft

    archetype: DRAFTING_AND_CREATION

    multiModelConfig:

      models: ["gemini", "openai"]

      synthesisMethod: "ai"

    prompt: |

      Write a blog post draft based on the chosen topic: {{ideas[0]}}.

    output: "draft"

Key Fields:

  

- id (string): Unique identifier for the step.
- archetype (string): Stage archetype (e.g., RESEARCH_AND_ANALYSIS, IDEATION_AND_EXPLORATION, DRAFTING_AND_CREATION, VALIDATION_AND_QUALITY_ASSURANCE).
- model (string) or multiModelConfig (object): Which model(s) to run this step on.  
    

- For single-model: model: "gemini".
- For multi-model synthesis:

-   
    

  

multiModelConfig:

  models: ["gemini", "openai"]

  synthesisMethod: "ai" # or "manual", "firstSuccess", "majorityVote"

  

-   
    
- prompt: The template string, using {{variable}} or {{object.property}} for interpolation.
- output (string): Variable name under which to store the result in SessionContext.

  

  

  

2. Execution Flow

  

  

1. Load Workflow  
    

- The YAML is parsed and validated.
- Missing fields are filled from stageArchetypeDefaults if not explicitly provided (e.g., default model, default validator).

3.   
    
4. Prompt Templating  
    

- PromptRenderer interpolates variables from SessionContext.
- Supports nested dot-notation ({{user.name}}, {{analysis.sentiment.score}}).
- Silent fallback for null/undefined → empty string.

6.   
    
7. Model Execution  
    

- WorkflowExecutor calls ModelRouter.runWithFallback(prompt, candidateModels):  
    

- Checks each connector’s isAvailable() in priority order.
- If primary fails or is unavailable, falls back to the next.
- Retries per each model based on step’s retries setting (default 1).

-   
    

9.   
    
10. Context Mutation  
    

- On success, the step’s output is stored in SessionContext under the key named by output.
- On failure, the step’s error is recorded, the workflow halts or skips based on onError policy.

12.   
    
13. Synthesis (if multiModelConfig)  
    

- If synthesisMethod: "ai", pass all model responses to SynthesisEngine → returns merged text.
- If "manual", present side-by-side responses in the UI for manual merge.
- If "firstSuccess" or "majorityVote", perform simple algorithmic merge.

15.   
    
16. Validation  
    

- Each step can specify a validator (e.g., LLMValidator, RegexValidator, or ManualValidator).
- After obtaining output, WorkflowExecutor calls validator.validate(output, context):  
    

- If returns { valid: false, reason }, the step fails.
- If true, continues to next step.

-   
    

18.   
    
19. Snapshot & Resume  
    

- SnapshotManager.save({ workflowId, stepId, context, output, prompt }) is called after each successful step.
- To resume: SnapshotManager.load(workflowId) returns an array of StepSnapshot; WorkflowExecutor.resumeFromStep(stepId) rebuilds SessionContext and skips prior steps.

21.   
    
22. Export  
    

- Once complete, OutputFormatter generates:  
    

- Markdown: With YAML frontmatter per step (workflow, step, model_used, timestamp, tags).
- YAML: Full SessionContext dump.
- JSON: Full SessionContext dump.

-   
    
- Optionally zipped with any associated assets (images, attachments).

24.   
    

  

  

  

  

  

Plugin Support

  

  

Hybrid Thinking supports a plugin ecosystem for connectors, synthesizers, formatters, and future workflow hooks.

Plugins let advanced users and third-party developers extend core capabilities without modifying the main codebase.

  

  

Plugin Manifest (

plugin.json

)

  

  

Every plugin must include a plugin.json with at least:

{

  "id": "my-translator-plugin",

  "version": "0.1.0",

  "entryPoint": "./dist/index.js",

  "contributions": {

    "modelConnectors": [

      {

        "name": "MyTranslatorV1",

        "type": "api",

        "displayName": "My Translator V1",

        "description": "A custom translation connector"

      }

    ],

    "synthesizers": [

      {

        "method": "custom-ai-merge",

        "displayName": "Custom AI Merge",

        "description": "An AI-powered merge strategy"

      }

    ],

    "outputFormatters": [

      {

        "formatId": "html-report",

        "displayName": "HTML Report Formatter",

        "fileExtension": "html",

        "description": "Exports session as a styled HTML report"

      }

    ]

  },

  "meta": {

    "author": "Dev Name",

    "license": "MIT",

    "repository": "https://github.com/dev/my-translator-plugin"

  }

}

  

Plugin Interfaces

  

// src/interfaces/Plugin.ts

export interface Plugin {

  register(): {

    modelConnectors?: ModelConnector[];

    synthesizers?: Synthesizer[];

    outputFormatters?: OutputFormatter[];

    workflowHooks?: WorkflowHook[]; // Future extension

  };

}

  

// src/interfaces/ModelConnector.ts

export interface ModelConnector {

  id: string;

  modelName: string;

  isAvailable(): Promise<boolean>;

  execute(prompt: string, context?: any): Promise<any>;

}

  

// src/interfaces/Synthesizer.ts

export interface Synthesizer {

  method: string; // e.g., "ai", "custom-ai-merge", "firstSuccess"

  synthesize(responses: ModelResponse[], context?: any): Promise<string>;

}

  

// src/interfaces/OutputFormatter.ts

export interface OutputFormatter {

  formatId: string; // e.g., "markdown", "yaml", "html-report"

  toFormat(context: SessionContext): string | Blob;

}

  

Registering Plugins

  

  

The system uses a PluginRegistry to collect and expose plugins:

// src/core/PluginRegistry.ts

import type { Plugin } from '@/interfaces/Plugin';

  

class PluginRegistry {

  private connectors: ModelConnector[] = [];

  private synthesizers: Synthesizer[] = [];

  private formatters: OutputFormatter[] = [];

  

  async registerPlugin(pathOrModule: string | Plugin): Promise<void> {

    try {

      let module: any;

      if (typeof pathOrModule === 'string') {

        module = await import(pathOrModule);

        module = module.default || module;

      } else {

        module = pathOrModule;

      }

      const contributions = module.register();

      this.connectors.push(...(contributions?.modelConnectors ?? []));

      this.synthesizers.push(...(contributions?.synthesizers ?? []));

      this.formatters.push(...(contributions?.outputFormatters ?? []));

    } catch (err) {

      console.error('Plugin registration failed:', err);

    }

  }

  

  getConnectors(): ModelConnector[] {

    return this.connectors;

  }

  getSynthesizers(): Synthesizer[] {

    return this.synthesizers;

  }

  getFormatters(): OutputFormatter[] {

    return this.formatters;

  }

}

  

export const pluginRegistry = new PluginRegistry();

Sample Plugin (src/plugins/my-translator-plugin/index.ts):

import { Plugin } from '@/interfaces/Plugin';

import type { ModelConnector } from '@/interfaces/ModelConnector';

  

export default class MyTranslatorPlugin implements Plugin {

  register() {

    return {

      modelConnectors: [new MyTranslatorConnector()],

    };

  }

}

  

class MyTranslatorConnector implements ModelConnector {

  id = 'my-translator';

  modelName = 'MyTranslatorV1';

  async isAvailable(): Promise<boolean> {

    // e.g., test an endpoint or offline token

    return true;

  }

  async execute(prompt: string): Promise<string> {

    // Call your custom translation API

    const res = await fetch('https://api.mytranslator.com/translate', {

      method: 'POST',

      body: JSON.stringify({ text: prompt }),

      headers: { 'Content-Type': 'application/json' },

    });

    const data = await res.json();

    return data.translatedText;

  }

}

  

  

  

  

  

Example Usage

  

  

  

1. Loading and Running a Workflow Programmatically (Node.js)

  

import fs from 'fs';

import YAML from 'js-yaml';

import { WorkflowExecutor } from '@/core/WorkflowExecutor';

  

async function main() {

  const yamlText = fs.readFileSync('workflows/content-strategy.yaml', 'utf8');

  const workflow = YAML.load(yamlText) as any;

  

  // Initialize executor

  const executor = new WorkflowExecutor({ workflowId: 'content-strategy' });

  

  // Optional: Register plugins dynamically

  await executor.registerPlugin('./src/plugins/my-translator-plugin/index.ts');

  

  // Execute workflow

  const result = await executor.executeWorkflow(workflow, {

    initial_input: 'Market data: Q1 sales up 15%',

  });

  

  console.log('Final Output:', result);

}

  

main().catch(console.error);

  

2. Simple Workflow YAML (Put in 

workflows/

)

  

name: "Simple Email Draft"

description: "Generate an email draft from a short prompt."

steps:

  - id: outline

    archetype: DRAFTING_AND_CREATION

    model: "gemini"

    prompt: |

      Create a bullet-point outline for an email about: {{initial_input}}

    output: "outline"

  - id: draft

    archetype: DRAFTING_AND_CREATION

    model: "gemini"

    prompt: |

      Based on this outline, write a professional email: {{outline}}

    output: "emailDraft"

  

3. Running in the Browser (UI Flow)

  

  

1. Open http://localhost:3000.
2. Select Models (checkboxes for Gemini, Claude, Ollama).
3. Load Workflow (from library or upload your own YAML).
4. Enter Initial Input in the prompt box.
5. Run – view parallel responses side-by-side.
6. Synthesize – toggle “AI Synthesis” or use manual merge in the Diff Workspace.
7. Export – click “Download” → choose Markdown, YAML, or JSON.

  

  

  

  

  

Extending Hybrid Thinking

  

  

  

Adding a New Model Connector

  

  

1. Implement the ModelConnector interface in TypeScript (see above).
2. Create a plugin.json manifest in your plugin folder.
3. Export a default class MyPlugin implements Plugin with a register() returning your connector instance.
4. Load dynamically via pluginRegistry.registerPlugin(pathToYourPlugin).

  

  

Connector Example Recap:

class MyCustomConnector implements ModelConnector {

  id = "my-custom";

  modelName = "MyCustomV1";

  async isAvailable(): Promise<boolean> {

    // e.g., check API token or local LLM binary

    return true;

  }

  async execute(prompt: string): Promise<string> {

    // Custom API or local model call

    return "custom response";

  }

}

  

Adding a New Synthesis Method

  

  

1. Implement the Synthesizer interface:

  

import { Synthesizer } from '@/interfaces/Synthesizer';

  

export class MyMergeSynthesizer implements Synthesizer {

  method = 'custom-ai-merge';

  async synthesize(responses: string[], context?: any): Promise<string> {

    // Your custom merge logic, e.g., call another LLM with combined text

    return responses.join('\n\n');

  }

}

  

1.   
    
2. Include it in your plugin’s register() call under synthesizers.
3. Use in YAML with

  

multiModelConfig:

  models: ["gemini", "openai"]

  synthesisMethod: "custom-ai-merge"

  

  

  

Adding a New Output Formatter

  

  

1. Implement the OutputFormatter interface:

  

import { OutputFormatter } from '@/interfaces/OutputFormatter';

import type { SessionContext } from '@/core/SessionContext';

  

export class HtmlReportFormatter implements OutputFormatter {

  formatId = 'html-report';

  toFormat(context: SessionContext): string {

    // Example: generate a styled HTML page from context

    return `

      <html>

        <body>

          <h1>Workflow Report: ${context.workflowName}</h1>

          <pre>${JSON.stringify(context, null, 2)}</pre>

        </body>

      </html>

    `;

  }

}

  

1.   
    
2. Register under outputFormatters in your plugin.
3. Download by selecting “HTML Report” in the UI export menu (requires UI integration).

  

  

  

Contributing to Core Modules

  

  

- Coding Standards:  
    

- TypeScript 4.x+ (strict mode enabled).
- ESLint + Prettier for style.

-   
    
- Branching Strategy:  
    

- main for stable releases.
- develop for integration.
- Feature branches: feat/<description>, fix/<description>, doc/<description>.

-   
    
- Pull Requests:  
    

- Follow commit message conventions: feat:, fix:, refactor:, docs:, etc.
- Include tests for new features.

-   
    

  

  

  

  

  

Testing Strategy

  

  

Hybrid Thinking uses Jest for unit tests and Playwright (or Puppeteer) for E2E.

  

  

Setup

  

npm install --save-dev jest @types/jest ts-jest

npm run test

# For E2E (if configured)

npm run test:e2e

  

Covered Areas

  

  

1. PromptRenderer  
    

- Nested variable interpolation ({{user.name}}).
- Null/undefined value handling.

3.   
    
4. ModelRouter  
    

- Connector availability checks.
- Fallback routing logic when primary is unavailable.

6.   
    
7. WorkflowExecutor  
    

- Context propagation across steps.
- Retry/fallback on model failures.
- Snapshot save & resume (if enabled).

9.   
    
10. Validators  
    

- RegexValidator, LLMValidator, ManualValidator behave as expected.
- Step-level validation passes/fails correctly.

12.   
    

  

  

  

Adding New Tests

  

  

- Place unit tests under src/__tests__/.
- Use .test.ts suffix.
- Name tests by module (PromptRenderer.test.ts, ModelRouter.test.ts, etc.).
- For E2E workflows, add Playwright specs under e2e/.

  

  

  

  

  

Troubleshooting & FAQs

  

  

  

Common Issues

  

  

- “Connector is unavailable”  
    

- Ensure you’ve provided a valid API key for API connectors (OpenAI, Gemini).
- For Browser-Bridge: confirm your Puppeteer bridge service is running.
- For Local LLM: start Ollama or LM Studio before launching Hybrid Thinking.

-   
    
- “Workflow failed at step X”  
    

- Check your YAML syntax—missing fields or invalid {{variable}}.
- Look at console logs; “Validation failed: ” indicates your Validator returned false.

-   
    
- “Cannot find module ‘@/core/WorkflowExecutor’”  
    

- Ensure tsconfig.json has baseUrl: "./src" and paths: { "@/*": ["*"] }.
- Run npm run build to compile TypeScript if importing compiled code in Node.

-   
    
- “Exported Markdown looks wrong”  
    

- Check OutputFormatter for correct frontmatter keys (workflow, step, model_used, timestamp).
- Ensure each step’s timestamp is a valid ISO string.

-   
    

  

  

  

  

  

License

  

  

Hybrid Thinking is released under the MIT License. See [LICENSE](LICENSE.md) for details.

  

  

  

This README was generated and refined based on your architecture blueprint, implementation details, and extensibility roadmap. It’s ready to publish or commit as README.md.