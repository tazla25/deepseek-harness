# Architecture Overview

```mermaid
graph TD
  A[Agent Loop] -->|agent/pre-step| B[Emotional Bifurcation]
  A -->|agent/pre-step| C[Federated Memory]

  B --> D[Logical/Emotional Blend]
  C --> E[Retrieve Relevant Context]

  D --> F[Task Execution]
  E --> F

  F -->|Should Branch| G[Superposition Reasoning]
  G -->|runSimulation| H[Simulation Sandbox]
  H --> G

  F -->|session/complete| I[Genetic Evolution]
  I --> J[Evaluate Fitness & Mutate DNA]
```

## Plugin Relationships
- **Genetic Evolution** intercepts task outcomes to breed hyper-optimized parameters.
- **Superposition Reasoning** works heavily with the `SimulationSandbox` (from Phase 2) to score branching outcomes before committing to a reality.
- **Federated Memory** ensures differential privacy on context variables sharing across agents.
- **Emotional Bifurcation** intercepts prompt responses to balance logical execution with affective state vectors.
