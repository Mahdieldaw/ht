import { PromptRenderer } from '../templating/PromptRenderer';

describe('PromptRenderer', () => {
  const renderer = new PromptRenderer();

  it('interpolates flat variables', () => {
    const template = 'Hello, {{name}}!';
    const context = { name: 'World' };
    expect(renderer.render(template, context)).toBe('Hello, World!');
  });

  it('interpolates nested variables (dot notation)', () => {
    // Simulate nested by flattening context for this implementation
    const template = 'User: {{user_name}}, Age: {{user_age}}';
    const context = { user_name: 'Alice', user_age: 30 };
    expect(renderer.render(template, context)).toBe('User: Alice, Age: 30');
  });

  it('interpolates nested dot-notation variables', () => {
    const template = 'User: {{user.name}}, Age: {{user.profile.age}}';
    const context = { user: { name: 'Alice', profile: { age: 30 } } };
    expect(renderer.render(template, context)).toBe('User: Alice, Age: 30');
  });

  it('leaves missing variables as empty string', () => {
    const template = 'Hello, {{missing}}!';
    const context = {};
    expect(renderer.render(template, context)).toBe('Hello, !');
  });

  it('handles null and undefined values gracefully', () => {
    const template = 'Null: {{foo}}, Nested: {{user.missing}}';
    const context = { user: { name: 'Bob' } };
    expect(renderer.render(template, context)).toBe('Null: , Nested: ');
  });

  it('handles non-string values', () => {
    const template = 'Data: {{data}}';
    const context = { data: { foo: 1 } };
    expect(renderer.render(template, context)).toBe('Data: {"foo":1}');
  });
});
