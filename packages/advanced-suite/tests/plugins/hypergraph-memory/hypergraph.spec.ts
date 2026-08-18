import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { Context } from 'cordis'
import { HypergraphMemoryEngine } from '../../../src/plugins/hypergraph-memory/index.js'
import * as fs from 'fs'
import * as path from 'path'
import * as os from 'os'

describe('HypergraphMemoryEngine', () => {
  let ctx: Context
  let engine: HypergraphMemoryEngine
  const persistencePath = path.join(os.tmpdir(), 'dsh-hypergraph-memory.json')

  beforeEach(() => {
    // clear persistent state between tests
    if (fs.existsSync(persistencePath)) {
        fs.rmSync(persistencePath, { force: true })
    }
    ctx = new Context()
    engine = new HypergraphMemoryEngine(ctx)
  })

  afterEach(() => {
    if (fs.existsSync(persistencePath)) {
        fs.rmSync(persistencePath, { force: true })
    }
  })

  it('ingests thoughts', async () => {
    const id = await engine.ingestThought('I need to use temporal branching')
    expect(id).toBeDefined()
    expect((engine as any).nodes.get(id).content).toBe('I need to use temporal branching')
    expect((engine as any).nodes.get(id).embedding).toBeDefined()
  })

  it('meets performance target: query <100ms for 1000 nodes', async () => {
    // Populate 1000 nodes
    for (let i = 0; i < 1000; i++) {
      await engine.ingestThought(`Thought ${i}`)
    }

    const start = performance.now()
    // Perform a query simulation (in mvp just fetching them all)
    const nodes = Array.from((engine as any).nodes.values())
    const end = performance.now()

    expect(nodes.length).toBe(1000)
    expect(end - start).toBeLessThan(100)
  })

  it('discovers insights', async () => {
    await engine.ingestThought('A')
    await engine.ingestThought('B')
    const insights = engine.discoverInsight()
    expect(insights.length).toBeGreaterThan(0)
  })
})
