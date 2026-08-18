import { describe, it, expect } from 'vitest'
import { Context } from 'cordis'
import GeneticEvolution from '../src/plugins/genetic-evolution/index.js'
import SuperpositionReasoning from '../src/plugins/superposition-reasoning/index.js'
import FederatedMemory from '../src/plugins/federated-memory/index.js'
import EmotionalBifurcation from '../src/plugins/emotional-bifurcation/index.js'

describe('Genetic Evolution', () => {
  it('detects species', () => {
    const ctx = new Context()
    const plugin = new GeneticEvolution(ctx)
    expect(plugin.detectSpecies(['Cargo.toml'])).toBe('rust')
    expect(plugin.detectSpecies(['package.json'])).toBe('node')
  })
})

describe('Superposition Reasoning', () => {
  it('evaluates branch', () => {
    const ctx = new Context()
    const plugin = new SuperpositionReasoning(ctx)
    expect(plugin.evaluateBranch({ tests: 1, complexity: 1, performance: 1, cost: 1, preference: 1 })).toBeCloseTo(1.0)
  })
})

describe('Federated Memory', () => {
  it('throws on raw code', () => {
    const ctx = new Context()
    const plugin = new FederatedMemory(ctx)
    expect(() => plugin.shareToHub({ rawCode: 'abc' })).toThrow()
  })
})

describe('Emotional Bifurcation', () => {
  it('calculates weights', () => {
    const ctx = new Context()
    const plugin = new EmotionalBifurcation(ctx)
    const weights = plugin.calculateWeights({ frustration: 0.5, urgency: 0.5, confusion: 0.5, trust: 0.5 })
    expect(weights.emotional).toBeCloseTo(0.5)
    expect(weights.logical).toBeCloseTo(0.5)
  })
})
