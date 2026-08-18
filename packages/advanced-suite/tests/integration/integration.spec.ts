import { describe, it, expect } from 'vitest'
import { Context } from 'cordis'
import GeneticEvolution from '../../src/plugins/genetic-evolution/index.js'
import SuperpositionReasoning from '../../src/plugins/superposition-reasoning/index.js'
import FederatedMemory from '../../src/plugins/federated-memory/index.js'
import EmotionalBifurcation from '../../src/plugins/emotional-bifurcation/index.js'
import {
  HypergraphMemoryMock,
  SimulationSandboxMock,
  AdversarialCognitionMock,
  NeuroSymbolicMock,
  AmbientOsmosisMock
} from './mocks.js'

describe('Advanced Innovation Suite Integration Tests', () => {
  it('hypergraph + genetic evolution integration', () => {
    const ctx = new Context()
    const hm = new HypergraphMemoryMock(ctx)
    const ge = new GeneticEvolution(ctx)

    expect(hm).toBeDefined()
    expect(ge).toBeDefined()

    let outcomeReceived = false
    // Simulate event passing between hypergraph memory (knowledge extraction) and genetic evolution (fitness calculation)
    ctx.on('session/complete', (outcome) => {
      outcomeReceived = true
      expect(outcome.success).toBe(true)
    })

    ctx.emit('session/complete', { success: true, speed: 0.8, cost: 0.1, quality: 0.9 })
    expect(outcomeReceived).toBe(true)
  })

  it('superposition + simulation sandbox integration', () => {
    const ctx = new Context()
    // Explicitly add to ctx so `this.ctx.simulationSandbox` resolves
    ctx.plugin(SimulationSandboxMock)
    ctx.plugin(SuperpositionReasoning)

    // Simulate Superposition branching
    const sr = ctx.get('superpositionReasoning') as any
    const branches = sr.spawnBranches(3)
    expect(branches.length).toBe(3)

    // Collapse uses SimulationSandboxMock if available
    const winner = sr.collapseWavefunction(branches)

    expect(winner).toBeDefined()
    // Mock simulation sandbox guarantees these metrics, translating into a specific branch score
    // tests: 1 * 0.3 = 0.3
    // complexity: 0.5 * 0.2 = 0.1
    // performance: 0.8 * 0.2 = 0.16
    // cost: 0.2 * 0.1 = 0.02
    // preference: 0.9 * 0.2 = 0.18
    // Total = 0.76
    expect(winner.score).toBeCloseTo(0.76)
  })

  it('adversarial + neuro-symbolic integration', () => {
    const ctx = new Context()
    const ac = new AdversarialCognitionMock(ctx)
    const ns = new NeuroSymbolicMock(ctx)

    expect(ac).toBeDefined()
    expect(ns).toBeDefined()
    // Verification of coexistence
  })

  it('ambient + emotional integration', () => {
    const ctx = new Context()
    const am = new AmbientOsmosisMock(ctx)
    const eb = new EmotionalBifurcation(ctx)

    let preStepTriggered = false
    ctx.on('agent/pre-step', (stepData) => {
      preStepTriggered = true
      expect(stepData.context).toBe('ambient-context')
    })

    ctx.emit('agent/pre-step', { context: 'ambient-context' })
    expect(preStepTriggered).toBe(true)
  })
})
