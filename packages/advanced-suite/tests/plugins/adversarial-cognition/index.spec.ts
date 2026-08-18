import { describe, it, expect } from 'vitest'
import { Context } from 'cordis'
import AdversarialCognition from '../../../src/plugins/adversarial-cognition/index.js'

describe('Adversarial Cognition', () => {
  it('runs debate for max rounds when confidence is low', () => {
    const ctx = new Context()
    const plugin = new AdversarialCognition(ctx, { maxRounds: 3, confidenceThreshold: 2.0 }) // impossible to reach

    // override evaluateConfidence to always return low
    plugin.evaluateConfidence = () => 0.1

    const result = plugin.debate('Initial Thesis')
    expect(result.rounds).toBe(3)
  })

  it('exits early when confidence is high', () => {
    const ctx = new Context()
    const plugin = new AdversarialCognition(ctx, { maxRounds: 5, confidenceThreshold: 0.8 })

    // override evaluateConfidence to always return high
    plugin.evaluateConfidence = () => 0.9

    const result = plugin.debate('Initial Thesis')
    expect(result.rounds).toBe(1)
    expect(result.confidence).toBe(0.9)
  })

  it('generates antithesis and synthesis', () => {
    const ctx = new Context()
    const plugin = new AdversarialCognition(ctx)

    const antithesis = plugin.generateAntithesis('Thesis')
    expect(antithesis).toContain('Thesis')

    const synthesis = plugin.generateSynthesis('Thesis', 'Antithesis')
    expect(synthesis).toContain('Thesis')
    expect(synthesis).toContain('Antithesis')
  })
})
