import { Service, Context } from 'cordis'

export interface Turn {
  id: string
  content: string
}

export interface Branch {
  name: string
  turns: Turn[]
  parent?: string
}

export interface SystemState {
  currentBranch: string
  branches: Map<string, Branch>
}

declare module 'cordis' {
  interface Context {
    temporalBranching: TemporalBranchingEngine
  }
}

export class TemporalBranchingEngine extends Service {
  private state: SystemState

  constructor(ctx: Context) {
    super(ctx, 'temporalBranching')
    this.state = {
      currentBranch: 'main',
      branches: new Map([['main', { name: 'main', turns: [] }]])
    }

    // Register commands if there is a command registry available in ctx
    if ((ctx as any).command) {
      (ctx as any).command('branch <name>', 'Create a new branch')
        .action((_any: any, name: string) => this.createBranch(name))

      (ctx as any).command('checkout <target>', 'Checkout a branch')
        .action((_any: any, target: string) => this.checkout(target))

      (ctx as any).command('merge <source>', 'Merge a branch')
        .action((_any: any, source: string) => this.merge(source))
    }
  }

  createBranch(name: string): void {
    if (this.state.branches.has(name)) {
      throw new Error(`Branch ${name} already exists`)
    }
    const current = this.state.branches.get(this.state.currentBranch)!
    this.state.branches.set(name, {
      name,
      turns: [...current.turns],
      parent: this.state.currentBranch
    })
  }

  checkout(target: string): void {
    if (!this.state.branches.has(target)) {
      throw new Error(`Branch ${target} does not exist`)
    }
    this.state.currentBranch = target
  }

  merge(sourceBranchName: string): void {
    const source = this.state.branches.get(sourceBranchName)
    const current = this.state.branches.get(this.state.currentBranch)!
    if (!source) {
      throw new Error(`Branch ${sourceBranchName} does not exist`)
    }
    // simple merge strategy for mvp
    const newTurns = source.turns.filter(t => !current.turns.some(ct => ct.id === t.id))
    current.turns.push(...newTurns)
  }

  diff(turnA: Turn, turnB: Turn): string {
    return `diff ${turnA.id} ${turnB.id}` // basic stub
  }

  replay(turnIndex: number, modifications: Partial<Turn>): void {
    const current = this.state.branches.get(this.state.currentBranch)!
    if (turnIndex < 0 || turnIndex >= current.turns.length) {
      throw new Error('Invalid turn index')
    }
    const newTurn = { ...current.turns[turnIndex], ...modifications }
    current.turns[turnIndex] = {
      id: newTurn.id || current.turns[turnIndex]!.id,
      content: newTurn.content || current.turns[turnIndex]!.content
    }
  }
}
