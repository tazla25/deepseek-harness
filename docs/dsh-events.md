# DSH Event Lifecycle

DeepSeek Harness leverages Cordis for dependency injection and lifecycle hooks. Understanding the event lifecycle is crucial for developing and integrating plugins.

## Core Events

- `session/start`: Fired when a new session begins. Plugins can initialize state here.
- `session/complete`: Fired when a session ends. Useful for cleanup and recording metrics.
- `agent/pre-step`: Fired before the agent takes an action. Allows plugins to inspect or modify the upcoming step, such as analyzing emotional states or conducting debate loops.
- `system-prompt/assemble`: Hooks into the system prompt assembly process. Plugins can inject context or modify instructions before the prompt is sent to the LLM.

## Working with Events

Plugins typically hook into these events during their initialization:

```typescript
import { Context, Service } from 'cordis'

export class MyPlugin extends Service {
  constructor(ctx: Context) {
    super(ctx, 'myPlugin', true)

    ctx.on('agent/pre-step', async (stepData: any) => {
      // Modify or inspect stepData
    })
  }
}
```

## Plugin Specific Hooks

- **Ambient Osmosis**: Hooks into `system-prompt/assemble` to inject environmental context (Git status, file system, processes).
- **Adversarial Cognition**: Hooks into `agent/pre-step` to refine user input via a debate loop before processing.
- **Emotional Bifurcation**: Hooks into `agent/pre-step` to blend logical and emotional responses.
