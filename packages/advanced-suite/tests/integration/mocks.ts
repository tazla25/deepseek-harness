import { Context, Service } from 'cordis'

export class HypergraphMemoryMock extends Service {
  constructor(ctx: Context) {
    super(ctx, 'hypergraphMemory', true)
  }
}

export class SimulationSandboxMock extends Service {
  constructor(ctx: Context) {
    super(ctx, 'simulationSandbox', true)
  }
  runSimulation(branch: any) {
    return {
      tests: 1,
      complexity: 0.5,
      performance: 0.8,
      cost: 0.2,
      preference: 0.9
    }
  }
}

export class AdversarialCognitionMock extends Service {
  constructor(ctx: Context) {
    super(ctx, 'adversarialCognition', true)
  }
}

export class NeuroSymbolicMock extends Service {
  constructor(ctx: Context) {
    super(ctx, 'neuroSymbolic', true)
  }
}

export class AmbientOsmosisMock extends Service {
  constructor(ctx: Context) {
    super(ctx, 'ambientOsmosis', true)
  }
}
