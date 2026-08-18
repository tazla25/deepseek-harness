import { describe, it, expect, beforeEach } from 'vitest'
import { Context } from 'cordis'
import { TemporalBranchingEngine } from '../../../src/plugins/temporal-branching/index.js'

describe('TemporalBranchingEngine', () => {
  let ctx: Context
  let engine: TemporalBranchingEngine

  beforeEach(() => {
    ctx = new Context()
    engine = new TemporalBranchingEngine(ctx)
  })

  it('creates and checks out branches', () => {
    engine.createBranch('feature')
    engine.checkout('feature')
    expect((engine as any).state.currentBranch).toBe('feature')
  })

  it('merges branches', () => {
    engine.createBranch('feature')
    engine.checkout('feature')
    const current = (engine as any).state.branches.get('feature')
    current.turns.push({ id: '1', content: 'hello' })
    engine.checkout('main')
    engine.merge('feature')
    expect((engine as any).state.branches.get('main').turns.length).toBe(1)
  })
})
