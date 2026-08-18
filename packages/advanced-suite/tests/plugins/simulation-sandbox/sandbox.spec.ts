import { describe, it, expect, beforeEach } from 'vitest'
import { Context } from 'cordis'
import { SimulationSandboxEngine } from '../../../src/plugins/simulation-sandbox/index.js'
import * as fs from 'fs'

describe('SimulationSandboxEngine', () => {
  let ctx: Context
  let engine: SimulationSandboxEngine

  beforeEach(() => {
    ctx = new Context()
    engine = new SimulationSandboxEngine(ctx)
  })

  it('creates and destroys simulation worlds', () => {
    const world = engine.createSimulationWorld()
    expect(world.id).toBeDefined()
    expect(fs.existsSync(world.overlayDir)).toBe(true)

    engine.destroySimulationWorld(world.id)
    expect(fs.existsSync(world.overlayDir)).toBe(false)
  })

  it('runs validations', () => {
    const world = engine.createSimulationWorld()
    const result = engine.runValidations(world.id)
    expect(result.success).toBe(true)
    engine.destroySimulationWorld(world.id)
  })

  it('hooks into tool/before_execute', () => {
    let continued = false
    let blockedReason = ''

    const safeEvent = {
      operation: 'write',
      target: 'safe/file.txt',
      continue: () => { continued = true },
      block: (reason: string) => { blockedReason = reason }
    }

    // Simulate event emit (accessing the private handler for testing)
    ;(engine as any).handleBeforeExecute(safeEvent)
    expect(continued).toBe(true)
    expect(blockedReason).toBe('')

    continued = false
    const unsafeEvent = {
      operation: 'write',
      target: '../unsafe/file.txt',
      continue: () => { continued = true },
      block: (reason: string) => { blockedReason = reason }
    }

    ;(engine as any).handleBeforeExecute(unsafeEvent)
    expect(continued).toBe(false)
    expect(blockedReason).toBe('Unsafe write operation detected')
  })
})
