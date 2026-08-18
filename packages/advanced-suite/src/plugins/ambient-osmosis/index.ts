import { Context, Service } from 'cordis'
// We might need to import explicit core types if TS complains about event names.

export interface SensorData {
  source: string
  content: string
  relevance: number
}

export class GitSensor {
  read(): SensorData[] {
    return [{ source: 'git', content: 'git status', relevance: 0.8 }]
  }
}

export class FileSystemSensor {
  read(): SensorData[] {
    return [{ source: 'fs', content: 'recent files', relevance: 0.6 }]
  }
}

export class ProcessSensor {
  read(): SensorData[] {
    return [{ source: 'process', content: 'running procs', relevance: 0.4 }]
  }
}

export class ContextFusionEngine {
  dedup(data: SensorData[]): SensorData[] {
    const seen = new Set<string>()
    return data.filter(d => {
      if (seen.has(d.content)) return false
      seen.add(d.content)
      return true
    })
  }

  rank(data: SensorData[]): SensorData[] {
    return [...data].sort((a, b) => b.relevance - a.relevance)
  }

  budget(data: SensorData[], maxTokens: number): SensorData[] {
    let current = 0
    const result: SensorData[] = []
    for (const d of data) {
      // rough token estimate
      const tokens = d.content.length / 4
      if (current + tokens <= maxTokens) {
        result.push(d)
        current += tokens
      }
    }
    return result
  }

  process(data: SensorData[], maxTokens: number): SensorData[] {
    return this.budget(this.rank(this.dedup(data)), maxTokens)
  }
}

declare module 'cordis' {
  interface Context {
    ambientOsmosis: AmbientOsmosis
  }
}

export class AmbientOsmosis extends Service {
  private sensors: any[]
  public engine: ContextFusionEngine

  constructor(ctx: Context) {
    super(ctx, 'ambientOsmosis', true)
    this.sensors = [new GitSensor(), new FileSystemSensor(), new ProcessSensor()]
    this.engine = new ContextFusionEngine()

    // Assuming TS will check the event name, let's use a cast to bypass strict checking
    // if 'system-prompt/assemble' isn't explicitly defined in standard cordis events.
    ;(ctx as any).on('system-prompt/assemble', async (assembly: any, _context: any, next: any) => {
      let data: SensorData[] = []
      for (const sensor of this.sensors) {
        data = data.concat(sensor.read())
      }
      const fused = this.engine.process(data, 1000)

      const contextSection = {
        role: 'system',
        content: `Ambient Context:\n${fused.map(f => `[${f.source}] ${f.content}`).join('\n')}`
      }

      if (assembly && assembly.sections) {
        assembly.sections.push(contextSection)
      }

      if (next) return next()
      return assembly
    })
  }
}

export default AmbientOsmosis
