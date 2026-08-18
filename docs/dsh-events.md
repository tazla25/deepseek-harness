# DeepSeek Harness Event System Documentation

This document describes the event system within DeepSeek Harness, primarily driven by Cordis. Below is a catalog of events you can use with `ctx.emit` and `ctx.on` in your plugins, specifically those relevant to agent lifecycles, loop mechanisms, and prompt compilation.

## Agent Lifecycle

- **`agent/created`**: Emitted when a new agent is instantiated.
- **`agent/session-start`**: Triggered when a session begins for an agent.
- **`agent/pre-step`**: A waterfall event right before the agent takes a step. It's often used by guard plugins to analyze current messages, inject context, or halt the loop entirely. It expects a returned decision.
- **`agent/request-error`**: Emitted if the agent's LLM request fails.
- **`agent/status`**: Emitted to notify of the agent's internal state.

## Session and Tool Events

- **`session/created`**: Global event when a new session is created.
- **`session/event`**: Fired for each action in a session (e.g., user message, tool call, tool result).
- **`session/flush`**: Triggered when the session requests to persist itself to disk.
- **`tools/change`**: Emitted when tools are added/removed.
- **`tools/post-execute`**: A waterfall event around a tool's result, before it returns to the agent.
- **`tool/result`**: A session event specifically containing the execution payload from a tool (often caught and logged).

## Compilation and Prompt Building

- **`system-prompt/assemble`**: A highly critical waterfall event. Listeners can mutate, filter, or reorder the system prompt components and the tool schemas available to the model.

## Hot Module Replacement (HMR)

- **`hmr/change`**: Fired when a module path is altered.
- **`hmr/reload`**: Fired when a reload happens to the modules.

## Diagnostic Invariants

- **`invariants-test/ping`**: Used by tests to ensure context boundaries and hooks are working correctly.

> Note: All listeners and emitters are scoped to their respective context, but global listeners (using `{ global: true }`) or those applied on root contexts can intercept events system-wide.
