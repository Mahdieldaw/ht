<blueprint>
📐 Hybrid Thinking — Architecture & Strategy Blueprint (v1)






🎯 Vision

Hybrid Thinking is a web-first, modular AI orchestration system designed to empower professionals with systematic, multi-model reasoning workflows. It’s not just another AI interface — it’s an operating system for AI-native thought: multi-model, context-aware, and export-ready. The architecture is built around the idea of seamless orchestration across API-based, browser-based, and local LLMs with intelligent response synthesis, traceability, and modular extensibility.

⸻

🧠 Strategic Pillars
	1.	Universal Model Access
Access any model—API, browser, or local—without depending on a single provider. Designed for resilience, flexibility, and the real-world diversity of LLM interfaces.
	2.	Prompt Systematization
Users interact through structured workflows, not ad-hoc prompts. Every step is traceable, auditable, and templated for repeatability and improvement.
	3.	Synthesis as First-Class Citizen
Hybrid Thinking doesn’t just collect outputs; it intelligently compares, merges, and refines them using both manual and AI-driven methods.
	4.	Export-Oriented Output
Outputs are markdown-based, enriched with YAML frontmatter and ready for integration into tools like Obsidian or Notion. No lock-in, full traceability.
	5.	Human-AI Co-Piloting
Designed for professionals who want to orchestrate AI, not just consume it. Every step supports manual intervention, overrides, and contextual control.

⸻

🏗️ System Architecture Overview

1. Frontend (Web Interface)
	•	Built with: React 18 + TypeScript + Tailwind CSS
	•	Key Interfaces:
	•	Prompt Entry & Execution
	•	Multi-Model Response Comparison
	•	Synthesis Workspace
	•	Workflow Builder
	•	Markdown Export Viewer

State is managed in-browser (React hooks, localStorage). No backend database required for MVP.

⸻

2. Model Access Layer

Supports heterogeneous connection methods via pluggable connectors:

Method	Use Case	Example Models
API Connector	Users with API keys	OpenAI, Gemini, Anthropic
Browser Bridge	Logged-in users via Puppeteer	ChatGPT, Claude, Gemini UI
Local LLM	Offline/open-source model support	Ollama, LM Studio

Each connector implements a unified interface:

interface ModelConnector {
  name: string;
  type: 'api' | 'browser' | 'local';
  isAvailable(): Promise<boolean>;
  execute(prompt: string): Promise<ModelResponse>;
}



⸻

3. Workflow Engine

Executes multi-step processes using YAML-defined workflows:

name: "Content Strategy"
steps:
  - name: "analyze"
    prompt: "Analyze this: {{input}}"
    model: "gemini"
    output: "analysis"

  - name: "synthesize"
    prompt: "Use {{analysis}} to create..."
    model: "claude"
    output: "final_output"

Key Engine Responsibilities:
	•	Prompt templating with variable interpolation ({{var}})
	•	Context tracking across steps
	•	Execution orchestration with manual fallback
	•	Synthesis step recognition and AI-assisted merging

⸻

4. Synthesis Engine

Combines model outputs through:
	•	Manual comparison (side-by-side diff, annotation, merge)
	•	AI-driven synthesis (best-response extraction, deduplication)

Synthesis is modular:

interface Synthesizer {
  method: 'manual' | 'ai';
  synthesize(responses: ModelResponse[]): string;
}



⸻

5. Context Manager

Session-scoped key-value store:
	•	Tracks inputs, outputs, step context
	•	Used for prompt interpolation and synthesis
	•	Stored in browser memory or localStorage

Example:

{
  "input": "Webinar transcript...",
  "analysis": "Themes: strategy, automation",
  "final_output": "Blog post with CTA..."
}



⸻

6. Output Formatter & Exporter

Outputs every step in Markdown with rich metadata:

---
workflow: content_strategy
step: synthesize
model_used: claude
timestamp: 2025-06-01T13:00:00Z
tags: [synthesized, ai_generated]
---

Merged content: [final output here]

Exports:
	•	Markdown (.md)
	•	YAML (.yaml)
	•	JSON (.json)
	•	All optionally zipped with assets

⸻

🔁 Execution Flow
	1.	User selects models (checkbox UI)
	2.	User enters initial prompt or workflow
	3.	System executes prompts in parallel or sequence
	4.	Responses are shown side-by-side
	5.	User (or AI) synthesizes responses
	6.	Final result + full session is exportable

⸻

🧩 Module Overview

Module	Responsibility
ModelRouter	Selects and runs model connector
PromptRenderer	Interpolates prompt templates with context
WorkflowExecutor	Runs multi-step workflows using context
SynthesisEngine	Merges responses from multiple models
OutputFormatter	Converts outputs to markdown + metadata
SessionContext	Stores all inputs, outputs, and step data



⸻

🔧 Extensibility Strategy
	•	New Models → Add a new connector that conforms to ModelConnector
	•	New Output Types → Plug into OutputFormatter with export type
	•	Advanced Features → Add middleware/hooks to WorkflowExecutor

⸻

🎯 MVP Definition
	•	Gemini API integration (via SDK)
	•	Basic prompt → response UI
	•	Side-by-side response comparison
	•	Simple synthesis tool (manual + AI)
	•	Markdown export with YAML metadata
	•	Claude via Puppeteer (Bridge)
	•	Ollama local detection (optional)

⸻

🚀 Success Metrics
	•	Users can connect to at least 2 models
	•	Single prompt → multiple model responses
	•	Synthesis produces usable content
	•	Export works with full metadata
	•	All logic runs in browser or via bridge (no backend required)

⸻

✨ Summary

This is not just a wrapper for APIs — Hybrid Thinking is an AI-native productivity engine. The architecture supports:
	•	Multi-model, multi-path execution
	•	Transparent orchestration logic
	•	Human-AI co-piloting
	•	Long-term extensibility

</blueprint>

<system_spec>
🧱 System Implementation Blueprint

<!-- Section A: Overview -->
... ## A. Gaps & Supplemental Artifacts



1. **Detailed Module Specifications**

   * **Interface Definitions & Type Schemas**

     * For each interface (`ModelConnector`, `Synthesizer`, `WorkflowExecutor`, etc.), provide precise TypeScript type definitions (e.g., input shapes, return shapes, error models).
     * Clarify optional vs. required fields, possible states (`isAvailable()` boolean logic), error-handling conventions (exceptions, return codes).
   * **State Machine / Lifecycle Diagrams**

     * Map out step-by-step flows within the Workflow Engine (e.g., “Idle → Fetch Connector Availability → Execute Prompt → Collect Response → Error/Retry → Synthesize”).
     * Illustrate context transitions: where `SessionContext` is read, updated, or persisted.
   * **Connector Implementation Templates**

     * Provide skeleton code examples for each connector type:

       * **API Connector** (e.g., OpenAI, Gemini) – authentication flow, rate-limit handling, back-off strategy.
       * **Browser Bridge** (Puppeteer) – headless browser launch, login flow (cookie/credential storage), navigation, prompt injection, response scraping.
       * **Local LLM** (Ollama, LM Studio) – model discovery, process spawning, IPC patterns, fallback handling.
     * Define a minimal set of utility functions (e.g., `normalizeResponse(modelName: string, raw: any): ModelResponse`) to unify response shapes.

2. **UX/UI Wireframes & Interaction Flow**

   * **Component Tree & Layout Sketches**

     * Rough wireframes (ASCII‐style or guidance) for:

       1. **Model Selection Panel** (checkbox list, status icon per connector).
       2. **Prompt Entry / Workflow Input** (text area + “Load Workflow” dropdown + variable substitution preview).
       3. **Parallel Responses View** (split pane with side-by-side responses, each labeled by model, with “Select as Source” checkboxes).
       4. **Synthesis Workspace** (diff/merge editor, manual annotate vs. “Use AI Synthesize” button).
       5. **Export Modal** (checkboxes for Markdown, YAML, JSON; “Download ZIP” button; toggle to include assets).
   * **User Journey Mapping**

     * Detail the steps the user takes from landing on the page to exporting:

       1. **Onboarding / Key Management**: How do they input API keys? (Guided form → localStorage encryption?).
       2. **Workflow Creation**: How do they define a new YAML workflow? (In-app editor vs. upload?).
       3. **Execution Path**: How do they rerun a previous workflow, modify variables, or debug a failed step?

3. **Data Models & Storage Plan**

   * **SessionContext Schema**

     * Define the shape (e.g., `Record<string, any>` vs. typed object). Which keys are reserved (`input`, `analysis`, `final_output`), which are dynamic?
     * Determine serialization format (JSON string stored in `localStorage` under a versioned key, e.g., `ht-session-v1`).
   * **Prompt / Workflow Library Structure**

     * Define how saved workflows/prompts are stored for reuse:

       * **Prompt Library**: `{ id: string, name: string, promptTemplate: string, createdAt: string, tags: string[] }`
       * **Workflow Library**: `{ id: string, name: string, yamlDefinition: string, createdAt: string, stageArchetype: string }`
     * Clarify indexing/search strategy (in-browser search vs. external service for full-text?).

4. **Error Handling & Edge Cases**

   * **Connector Failures**

     * What if Puppeteer fails? Define: retry counts, fallbacks (e.g., move to next connector), user notifications.
     * Local LLM unavailable: detect GPU vs. CPU limitations; show “Not Available” instead of allowing execution.
   * **YAML Validation Rules**

     * Enforce schema:

       * Each `step` must have `name`, `prompt`, and `model`.
       * Disallow circular variable references (e.g., `{{foo}}` referring to a step that doesn’t exist).
     * Provide a JSON Schema file or ajv ruleset snippet to validate workflows client-side.
   * **Synthesis Failures**

     * If the AI-driven synthesizer crashes (e.g., timeouts), fallback to manual mode.
     * Version conflicts: if two responses are identical or contradictory, prompt user for override.

5. **Testing & QA Strategy**

   * **Unit Tests**

     * For each module interface (`ModelConnector`, `Synthesizer`, etc.), create test stubs that simulate a fake connector returning sample JSON; validate that `WorkflowExecutor` correctly interpolates variables, sequences steps, and populates `SessionContext`.
   * **Integration Tests**

     * Simulate a full “Hello World” workflow:

       1. Use a stubbed API Connector returning `{ text: "Hello" }`.
       2. Use a stubbed Claude Puppeteer returning `{ text: "Bonjour" }`.
       3. Run synthesis; assert that output merges both (“Hello / Bonjour”).
   * **End-to-End Tests (Puppeteer/Playwright)**

     * Automate a browser session that:

       1. Opens the page, inputs a dummy API key, selects both connectors, types a simple prompt.
       2. Clicks “Run Workflow,” waits for responses, clicks “Synthesize with AI,” and downloads the Markdown.
     * Validate that the downloaded file follows the correct YAML frontmatter schema.

6. **Roadmap & Iteration Plan**

   * **MVP Roadmap (0–3 months)**

     1. Finalize core connectors (Gemini, Claude, Ollama).
     2. Build minimal UI: prompt input, response panes, manual synth tool.
     3. Exporter (Markdown with YAML).
     4. Local storage for sessions & basic prompt library.
     5. Basic unit/integration tests.
   * **Post-MVP (3–6 months)**

     1. Add UI for workflow building (drag-and-drop, variable mapping).
     2. AI-driven recommendation engine: suggest which models to run for given tasks.
     3. Publish NPM package / Chrome Extension for “Hybrid Thinking Panel.”
     4. Add real-time collaboration: sync context across multiple users.
     5. Integrate third-party tools (Notion API, Obsidian publish).
 

<!-- Section B: File/Module Plan -->
... ## B. Multi-Layered Requirements & Priorities

When thinking “in layers” (short-term execution, mid-term viability, long-term extensibility), surface each layer explicitly. This will guide the next LLM to generate appropriately scoped content.

1. **Short-Term (Immediate MVP Tasks)**

   * **Component Skeletons**: The LLM should output basic React+TypeScript files for each module (e.g., `ModelRouter.tsx`, `PromptRenderer.ts`, `WorkflowExecutor.ts`, `SynthesisEngine.tsx`).
   * **YAML Workflow Examples**: Have it generate 2–3 representative workflows (e.g., “Content Strategy”, “Research Summary”, “Email Draft”) using your YAML schema.
   * **Basic Test Cases**: Ask it to produce unit-test files (e.g., `WorkflowExecutor.test.ts`) with mock connectors and sample assertions.
   * **LocalStorage Strategy**: Request code snippet for saving/retrieving a typed `SessionContext` to/from `localStorage` with version checks.

2. **Mid-Term (Stabilization & UX Polish)**

   * **Error-Handling Patterns**: Prompt it to generate standard hooks/middleware for catching connector errors, displaying toast notifications, and retry logic.
   * **UX Copy & Micro-Interactions**: Ask for microcopy recommendations (button labels, tooltip text, success/failure messages).
   * **Security Best Practices**: Request a brief on how to securely store API keys in the browser (e.g., ephemeral in-memory encryption, warnings about localStorage limitations).
   * **Accessibility Audit Checklist**: Have it produce a list of WCAG 2.1 checkpoints tailored to your UI components (e.g., proper ARIA roles for split-pane diff editor).

3. **Long-Term (Scaling & Extensibility)**

   * **Plugin Architecture Proposal**: Instruct it to draft a plugin API for third-party contributions: how to register new connectors, synth methods, or export formats without touching core code.
   * **Performance Benchmarks & Profiling Plan**: Ask for a plan to measure latency for parallel model calls, synthetic benchmark scripts to run in variety of environments.
   * **Documentation Outline**: A structure for a user guide (e.g., “Getting Started,” “Defining Workflows,” “API Connector Development,” “Extending Synthesis Methods,” “Troubleshooting”).
   * **Commercialization & Licensing Considerations**: Request a summary of licensing options (MIT vs. Apache 2.0 vs. dual licensing) and advice on how to position open source vs. paid features.

--- 

<!-- Section C: Implementation Details -->
... ## C. Concrete Prompts to Feed the Next LLM

Below is a set of carefully crafted prompts. You can concatenate these (with your v1 blueprint) when you hand off to the LLM. Each prompt is labeled by category and intended output:

---

### 1. **Module & Interface Scaffolding**

> **Prompt A1**
> “Using the following high-level architecture (‹paste your v1 blueprint›), generate TypeScript interface and class skeleton files for each core module. Specifically:
>
> 1. `ModelConnector` interface with methods `isAvailable(): Promise<boolean>` and `execute(prompt: string): Promise<ModelResponse>`; include JSDoc comments explaining parameter types and return types.
> 2. `Synthesizer` interface supporting `method: 'manual' | 'ai'` and an implementation stub for each.
> 3. `WorkflowExecutor` class that iterates through YAML-defined workflows and populates a typed `SessionContext`; include placeholder methods for `loadWorkflow(yaml: string): void`, `runStep(step: WorkflowStep): Promise<void>`, and `onError(error: Error): void`.
> 4. `OutputFormatter` utility with methods `toMarkdown(context: SessionContext): string`, `toYAML(context: SessionContext): string`, `toJSON(context: SessionContext): string`.
> 5. Provide minimal error-handling stubs, e.g., `try/catch` with comments on retry logic.”

**Expected Output:** A set of `.ts` files (e.g., `ModelConnector.ts`, `Synthesizer.ts`, `WorkflowExecutor.ts`) with filled-in interfaces and stub methods including JSDoc.

---

### 2. **Connector Implementation Templates**

> **Prompt B1**
> “Given the three connector types—API, Browser (Puppeteer), and Local LLM—produce three example connector implementations in TypeScript that conform to `ModelConnector`. For each:
>
> * Show authentication flow or initialization (e.g., reading an API key from environment or prompting the user).
> * Implement `isAvailable()` (for API: ping test; for Puppeteer: headless browser launch + login test; for Local: check local model binary existence).
> * Implement `execute(prompt: string)`: for API, call a mocked HTTP endpoint; for Puppeteer, demonstrate navigating to chat UI, typing prompt, scraping response; for Local, spawn a child process and parse stdout.
> * Include comments on error handling, rate limits, and fallback logic.”

**Expected Output:** Three fully commented `.ts` files: `ApiConnector.ts`, `BrowserConnector.ts`, `LocalConnector.ts`.

---

### 3. **YAML Workflow Examples & Validation Schema**

> **Prompt C1**
> “Create:
>
> 1. Three example YAML workflows using the blueprint’s schema. Use illustrative names: ‘Content Strategic Brief,’ ‘Research Synthesis,’ ‘Email Response Draft.’ Each should have at least two steps, using different models (e.g., Gemini → Claude). Show how variables flow (e.g., `analysis` passed to the next prompt).
> 2. A JSON Schema (draft-07) that enforces:
>
>    * `name` (string),
>    * `steps` (non-empty array),
>    * Each `step` has required `name`, `prompt`, `model`, optional `output`.
>    * No additional properties.
>    * Variable interpolation strings match the pattern `\{\{[a-zA-Z0-9_]+\}\}`.
> 3. Provide a short JS snippet using `ajv` that validates a YAML-loaded object against this schema and logs errors.”

**Expected Output:**

* Three `.yaml` snippets.
* A `schema.json` file.
* A small `validateWorkflow.js` snippet using `ajv`.

---

### 4. **Frontend Component Wireframes (Textual)**

> **Prompt D1**
> “Produce a textual wireframe and React component hierarchy for:
>
> 1. **ModelSelectionPanel** – checkbox list, connector status indicators, ‘Add API Key’ button.
> 2. **PromptInputArea** – textarea with syntax highlighting for `{{vars}}`, ‘Load Workflow’ dropdown.
> 3. **ResponseComparisonView** – split pane showing up to N model outputs, with model labels, a ‘Select Primary’ toggle.
> 4. **SynthesisWorkspace** – diff editor stub (placeholder), `AI Synthesize` button, manual merge instructions.
> 5. **ExportModal** – export options (checkboxes), ‘Generate & Download’ button, preview of YAML frontmatter.
>    For each component, listProps, state variables, and lifecycle methods / hooks that are necessary.”

**Expected Output:**

* A hierarchical list (e.g., `App → Header, ModelSelectionPanel, MainView → PromptInputArea, ResponseComparisonView, SynthesisWorkspace, Footer`).
* For each component: a bullet‐list of props, internal state, and any side effects (e.g., `useEffect` to poll `isAvailable()`).

---

### 5. **SessionContext & LocalStorage Strategy**

> **Prompt E1**
> “Define a TypeScript `SessionContext` type that captures:
>
> * A record of all inputs (`input`, `analysis`, `final_output`, plus dynamic step outputs).
> * Metadata (timestamps, models used per step).
> * Versioning (`version: string`).
>   Provide functions `saveSession(context: SessionContext): void` and `loadSession(): SessionContext | null` that store/retrieve from `localStorage` under key `hybridSession_v1`. Include version check logic: if `version` doesn’t match current, discard or archive old session. Also provide a `migrateSession(old: any): SessionContext` stub for future migrations.”

**Expected Output:**

* A `SessionContext.ts` with typed interface and storage functions.

---

### 6. **Error-Handling & Fallback Patterns**

> **Prompt F1**
> “Draft a reusable error-handling middleware for React that wraps API calls or connector calls. It should:
>
> * Catch exceptions from `execute()`.
> * Display a dismissible toast notification with error details.
> * Automatically retry up to two times with exponential back-off.
> * If retry fails, mark connector as unavailable (update UI).
> * Return a standardized error object `{ errorCode: string, message: string }`.
>   Provide both the React hook (`useConnectorWithRetry`) and a higher-order function (`withRetry`) for generic functions.”

**Expected Output:**

* A `useConnectorWithRetry.tsx` hook.
* A `withRetry.ts` HOF.
* Sample usage in a component.

---

### 7. **Unit & Integration Test Cases**

> **Prompt G1**
> “Generate a set of Jest unit tests (in TypeScript) for:
>
> 1. Validating that a stubbed `ApiConnector` returns a normalized `ModelResponse`. Use `jest.mock` to simulate HTTP responses.
> 2. Testing `WorkflowExecutor.runStep()` with a fake `ModelConnector` that returns predefined output, and asserting that `SessionContext` is updated correctly.
> 3. Testing `OutputFormatter.toMarkdown()` against a sample `SessionContext` containing two steps; verify frontmatter and content format.
>
> Then, provide one integration test using Playwright that:
>
> * Launches a headless browser, navigates to `localhost:3000` (assume dev server),
> * Enters a dummy API key, selects both connectors, inputs “Test” as prompt,
> * Clicks “Run,” waits for fake responses (you can stub them in test),
> * Clicks “Generate & Download,”
> * Verifies that a file named `session.md` is downloaded and contains correct YAML frontmatter.”

**Expected Output:**

* `ApiConnector.test.ts`, `WorkflowExecutor.test.ts`, `OutputFormatter.test.ts`.
* `e2e.spec.ts` (Playwright) with comments on stub injection.

---

### 8. **Documentation & Roadmap Outline**

> **Prompt H1**
> “Produce an outline for a developer‐facing README and a user‐guide.
> **README Structure**:
>
> 1. Introduction & Vision (brief).
> 2. Installation & Prerequisites (Node.js, browser support).
> 3. Getting Started (cloning, `npm install`, `npm start`).
> 4. Key Concepts (Modules, Connectors, Workflows, Context, Synthesis).
> 5. Example Usage (snippet showing a simple prompt → multi-model call → manual synth).
> 6. Extending Hybrid Thinking (adding new connectors, synth methods, export formats).
> 7. Testing (unit, integration, e2e).
>
> **User‐Guide Structure**:
>
> 1. Overview: What is Hybrid Thinking & why use it?
> 2. Managing API Keys & Connectors: step-by-step.
> 3. Creating & Saving Workflows: YAML syntax, examples, best practices.
> 4. Executing Workflows: UI walkthrough, interpreting side-by-side results.
> 5. Synthesizing Outputs: manual vs. AI, editing tips.
> 6. Exporting & Integrating: Markdown/YAML/JSON, importing into Obsidian/Notion.
> 7. Troubleshooting & FAQs.
> 8. Advanced Topics: Versioning, plugin architecture roadmap, local LLM setup.
>
> For each section, provide 2–3 bullet points on what content to include.”

**Expected Output:**

* A markdown outline with nested bullet lists.

--- 

--- 

<!-- Section D: LLM Generation Rounds -->
D. Suggested Workflows for the Next LLM Interaction
Step 1: Ingest Blueprint + Supplemental Specs

Provide the v1 blueprint, plus any high-level system notes (your choice to copy/paste some of the above “Gaps & Supplemental Artifacts”).

Then append the set of prompts (A1 → H1) in one request.

Step 2: Iterative Refinement

Round 1: Ask the LLM to generate all scaffolding and code stubs (prompts A1, B1, E1).

Round 2: Provide the scaffolding output back, then ask for the wireframes & UX mapping (prompt D1), error handling (F1), and tests (G1). At each round, validate the output against your handwritten expectations.

Round 3: Once code components exist, ask for documentation outline (H1), and roadmap fleshing (from “Multi-Layered Requirements”).

Step 3: Validation & Integration

Automated Check: After receiving code stubs, run a quick script that searches for missing methods or untyped variables.

Manual Spot Check: Ensure the YAML examples actually parse against the JSON Schema.

UX Preview: If the LLM produces textual wireframes, convert those into rough Figma or pen-and-paper sketches to validate flows before coding. 

<!-- "D. Round Definitions — see prompt task below" -->
</system_spec>

<prompt>
🎯 TASK: Round 1 — Scaffold Generation

You are a senior TypeScript/React/AI systems engineer. Using the architecture and implementation blueprints above as your only constraints, generate the full code **scaffolding and type-safe stubs** for the system described — including:

- Frontend React/TypeScript components
- Backend execution logic (including model connector interfaces, orchestration engine)
- LLM prompt stub generators for Stage A1, B1, E1 (referenced in section D)

⚠️ You are only to generate *scaffolds and empty logic shells*. Do **not** implement inner logic or actual prompt strings unless they are needed to define function signatures. Focus on:
- File structure
- Types and interfaces
- Module boundaries
- Integration points between UI ↔ Execution ↔ Connector layers

Wrap all generated code in appropriate file name comments for clarity.

After scaffolding is complete, pause. Do not continue to Round 2 or 3 unless explicitly asked.
</prompt>













