import type { Context } from '@deepseek-ai/cordis'
import type { PromptAssembly } from '@deepseek-ai/dsh-system-prompt'

export const name = 'ambient-osmosis'
export const inject = ['systemPrompt']

export interface Sensor {
  gatherContext(): Promise<string[]>
}

export class GitSensor implements Sensor {
  async gatherContext(): Promise<string[]> {
    return ['[GitSensor]: Repo up-to-date.']
  }
}

export class FileSystemSensor implements Sensor {
  async gatherContext(): Promise<string[]> {
    return ['[FileSystemSensor]: No pending files.']
  }
}

export class ProcessSensor implements Sensor {
  async gatherContext(): Promise<string[]> {
    return ['[ProcessSensor]: CPU load normal.']
  }
}

export class ContextFusionEngine {
  private sensors: Sensor[] = [new GitSensor(), new FileSystemSensor(), new ProcessSensor()]

  async generateContext(): Promise<string> {
    const rawData = await Promise.all(this.sensors.map(s => s.gatherContext()))
    const flatData = rawData.flat()
    const deduped = [...new Set(flatData)]

    // Simulate ranking and token budget
    const fusedContext = deduped.join('\n')
    // Naive token budget check: truncating string length to approx 2000 chars
    return fusedContext.slice(0, 8000)
  }
}

export function apply(ctx: Context): void {
  const engine = new ContextFusionEngine()

  ctx.on('system-prompt/assemble', async (_assembly: PromptAssembly, _context, next) => {
    const ambientContext = await engine.generateContext()

    const original = await next()
    return {
      ...original,
      contexts: [
        ...original.contexts,
        {
          name: 'ambient-context',
          text: ambientContext,
        },
      ],
    }
  })
}
