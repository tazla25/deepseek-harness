import { Service, Context } from '@deepseek-ai/cordis'
import * as fs from 'fs'
import * as path from 'path'
import * as os from 'os'

export interface HyperNode {
  id: string
  content: string
  type: string
  embedding?: number[]
}

export interface HyperEdge {
  id: string
  source: string
  target: string
  relationship: string
  weight: number
}

export interface Insight {
  id: string
  description: string
  sourceNodes: string[]
}

declare module '@deepseek-ai/cordis' {
  interface Context {
    hypergraphMemory: HypergraphMemoryEngine
  }
}

export class HypergraphMemoryEngine extends Service {
  public nodes: Map<string, HyperNode> = new Map()
  public edges: Map<string, HyperEdge> = new Map()
  public insights: Map<string, Insight> = new Map()

  private persistencePath: string
  private saveTimeout: NodeJS.Timeout | null = null

  constructor(ctx: Context) {
    super(ctx, 'hypergraphMemory')

    // MVP persistence path
    this.persistencePath = path.join(os.tmpdir(), 'dsh-hypergraph-memory.json')
    this.load()

    // Register event hooks placeholder (safely using string casting for events)
    ;(ctx as any).on('agent/reasoning', this.handleReasoning.bind(this))
    ;(ctx as any).on('tool/result', this.handleToolResult.bind(this))
    ;(ctx as any).on('system_prompt/assemble', this.handleSystemPromptAssemble.bind(this))
  }

  private load(): void {
    if (fs.existsSync(this.persistencePath)) {
      try {
        const data = JSON.parse(fs.readFileSync(this.persistencePath, 'utf-8'))
        this.nodes = new Map(Object.entries(data.nodes || {}))
        this.edges = new Map(Object.entries(data.edges || {}))
        this.insights = new Map(Object.entries(data.insights || {}))
      } catch (e) {
        this.ctx.logger('hypergraphMemory').warn('Failed to load hypergraph memory', e)
      }
    }
  }

  // Debounced save
  private save(): void {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout)
    }
    this.saveTimeout = setTimeout(() => {
        const data = {
          nodes: Object.fromEntries(this.nodes),
          edges: Object.fromEntries(this.edges),
          insights: Object.fromEntries(this.insights)
        }
        fs.writeFileSync(this.persistencePath, JSON.stringify(data, null, 2))
    }, 100)
  }

  private handleReasoning(_event: any) {
    // stub
  }

  private handleToolResult(_event: any) {
    // stub
  }

  private handleSystemPromptAssemble(_event: any) {
    // stub
  }

  // Local fallback for embedding text
  private generateLocalEmbedding(text: string): number[] {
    const chars = text.split('').map(c => c.charCodeAt(0))
    const len = 1536 // default llm dimension
    const embedding = new Array(len).fill(0)
    for (let i = 0; i < chars.length; i++) {
        embedding[i % len] += chars[i] || 0
    }
    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0)) || 1
    return embedding.map(val => val / magnitude)
  }

  async ingestThought(thought: string, type: string = 'thought'): Promise<string> {
    const id = Math.random().toString(36).substring(7)

    // Check if llm service is available for embedding
    let embedding: number[] | undefined
    try {
      const llm = (this.ctx as any).llm
      if (llm && llm.embed) {
        embedding = await llm.embed(thought)
      } else {
        embedding = this.generateLocalEmbedding(thought)
      }
    } catch {
      embedding = this.generateLocalEmbedding(thought)
    }

    if (embedding !== undefined) {
      this.nodes.set(id, { id, content: thought, type, embedding })
    } else {
      this.nodes.set(id, { id, content: thought, type })
    }
    this.save()
    return id
  }

  discoverInsight(): Insight[] {
    // stub logic for insight discovery
    const id = Math.random().toString(36).substring(7)
    const insight = {
      id,
      description: 'Found a pattern across recent thoughts',
      sourceNodes: Array.from(this.nodes.keys()).slice(0, 2)
    }
    this.insights.set(id, insight)
    this.save()
    return [insight]
  }

  detectContradictions(): string[] {
    // stub logic for contradiction detection
    return []
  }
}
