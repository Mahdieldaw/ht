/**
 * Utility for formatting session context data into various output formats like Markdown, YAML, JSON.
 */
import { SessionContext, WorkflowStepState } from '../context/types';
import { dump } from 'js-yaml'; // For YAML conversion

export class OutputFormatter {
  /**
   * Converts the relevant parts of the session context to a Markdown string.
   */
  public toMarkdown(context: SessionContext): string {
    let markdownOutput = '';
    // ...actual formatting logic would go here...
    return markdownOutput.trim();
  }
}
