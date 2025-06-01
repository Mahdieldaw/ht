// No major changes needed, the existing logic is sound for {{var}} replacement.
// Adding a check for non-string context values.
export class PromptRenderer {
  public render(templateString: string, context: Record<string, any>): string {
    const regex = /\{\{([a-zA-Z0-9_\.]+)\}\}/g;
    let renderedString = templateString;
    let match;
    while ((match = regex.exec(templateString)) !== null) {
      const varPath = match[1];
      const value = this.resolvePath(context, varPath);
      let valueStr = '';
      if (value === null || value === undefined) {
        valueStr = '';
      } else if (typeof value === 'object') {
        valueStr = JSON.stringify(value);
      } else {
        valueStr = String(value);
      }
      renderedString = renderedString.replace(new RegExp(this.escapeRegExp(match[0]), 'g'), valueStr);
    }
    return renderedString;
  }

  private resolvePath(obj: any, path: string): any {
    return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
  }

  private escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
