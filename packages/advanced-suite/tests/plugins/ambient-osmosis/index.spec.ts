import { describe, it, expect } from 'vitest'
import { Context } from 'cordis'
import AmbientOsmosis, { ContextFusionEngine } from '../../../src/plugins/ambient-osmosis/index.js'

describe('Ambient Osmosis', () => {
  it('deduplicates sensor data', () => {
    const engine = new ContextFusionEngine()
    const data = [
      { source: 'git', content: 'same', relevance: 0.9 },
      { source: 'fs', content: 'same', relevance: 0.8 }
    ]
    const result = engine.dedup(data)
    expect(result.length).toBe(1)
    expect(result[0].source).toBe('git')
  })

  it('ranks sensor data', () => {
    const engine = new ContextFusionEngine()
    const data = [
      { source: 'a', content: 'a', relevance: 0.1 },
      { source: 'b', content: 'b', relevance: 0.9 }
    ]
    const result = engine.rank(data)
    expect(result[0].source).toBe('b')
  })

  it('budgets sensor data', () => {
    const engine = new ContextFusionEngine()
    const data = [
      { source: 'a', content: 'aaaa', relevance: 0.9 }, // ~1 token
      { source: 'b', content: 'bbbbbbbb', relevance: 0.8 } // ~2 tokens
    ]
    const result = engine.budget(data, 2)
    expect(result.length).toBe(1)
    expect(result[0].source).toBe('a')
  })

  it('registers in context', () => {
    const ctx = new Context()
    const plugin = new AmbientOsmosis(ctx)
    expect(plugin.engine).toBeDefined()
  })
})
