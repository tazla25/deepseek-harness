import { Context, Service } from 'cordis'

export interface SymbolicCheckResult {
  passed: boolean
  severity: 'info' | 'warning' | 'error'
  message: string
}

export interface SymbolicChecker {
  check(code: string): SymbolicCheckResult
}

export class TypeScriptChecker implements SymbolicChecker {
  check(code: string): SymbolicCheckResult {
    if (code.includes('any')) {
      return { passed: false, severity: 'warning', message: 'Avoid using "any" in TypeScript' }
    }
    return { passed: true, severity: 'info', message: 'TypeScript check passed' }
  }
}

export class PythonTypeChecker implements SymbolicChecker {
  check(code: string): SymbolicCheckResult {
    if (code.includes('def ') && !code.includes('->')) {
      return { passed: false, severity: 'warning', message: 'Missing return type hint in Python function' }
    }
    return { passed: true, severity: 'info', message: 'Python check passed' }
  }
}

declare module 'cordis' {
  interface Context {
    neuroSymbolic: NeuroSymbolic
  }
}

export class NeuroSymbolic extends Service {
  private checkers: SymbolicChecker[]

  constructor(ctx: Context) {
    super(ctx, 'neuroSymbolic', true)
    this.checkers = [new TypeScriptChecker(), new PythonTypeChecker()]
  }

  evaluate(code: string): SymbolicCheckResult[] {
    return this.checkers.map(checker => checker.check(code))
  }

  shouldBlock(results: SymbolicCheckResult[]): boolean {
    return results.some(r => r.severity === 'error')
  }
}

export default NeuroSymbolic
