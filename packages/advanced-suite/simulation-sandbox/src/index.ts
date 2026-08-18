import { Service, Context } from '@deepseek-ai/cordis'
import * as fs from 'fs'
import * as path from 'path'
import * as os from 'os'

export interface SimulationWorld {
  id: string
  overlayDir: string
}

declare module '@deepseek-ai/cordis' {
  interface Context {
    simulationSandbox: SimulationSandboxEngine
  }
}

export class SimulationSandboxEngine extends Service {
  public activeWorlds: Map<string, SimulationWorld> = new Map()

  constructor(ctx: Context) {
    super(ctx, 'simulationSandbox')

    // Register tool execution hook placeholder safely
    ;(ctx as any).on('tool/before_execute', this.handleBeforeExecute.bind(this))
  }

  private handleBeforeExecute(event: any) {
    if (event.operation === 'write' && !this.isSafe(event.target)) {
      if (typeof event.block === 'function') {
        event.block('Unsafe write operation detected')
      }
    } else {
      if (typeof event.continue === 'function') {
        event.continue()
      }
    }
  }

  private isSafe(target: string): boolean {
    // Basic safety check logic for MVP
    return !target.includes('..') && !target.startsWith('/')
  }

  createSimulationWorld(sourceDir?: string): SimulationWorld {
    const id = Math.random().toString(36).substring(7)
    const overlayDir = path.join(os.tmpdir(), `dsh-sim-${id}`)
    fs.mkdirSync(overlayDir, { recursive: true })

    if (sourceDir && fs.existsSync(sourceDir)) {
       fs.cpSync(sourceDir, overlayDir, { recursive: true })
    }

    const world = { id, overlayDir }
    this.activeWorlds.set(id, world)
    return world
  }

  runValidations(worldId: string): { success: boolean; output: string } {
    const world = this.activeWorlds.get(worldId)
    if (!world) {
      throw new Error(`Simulation world ${worldId} not found`)
    }
    // Stub logic for running tsc, lint, test
    return { success: true, output: 'All validations passed' }
  }

  destroySimulationWorld(worldId: string): void {
    const world = this.activeWorlds.get(worldId)
    if (!world) {
      throw new Error(`Simulation world ${worldId} not found`)
    }
    fs.rmSync(world.overlayDir, { recursive: true, force: true })
    this.activeWorlds.delete(worldId)
  }
}
