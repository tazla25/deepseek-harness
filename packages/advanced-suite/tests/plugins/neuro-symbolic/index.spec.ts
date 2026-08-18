import { describe, it, expect } from 'vitest'
import { Context } from 'cordis'
import NeuroSymbolic, { TypeScriptChecker, PythonTypeChecker } from '../../../src/plugins/neuro-symbolic/index.js'

describe('Neuro Symbolic', () => {
  it('TypeScript checker warns on any', () => {
    const checker = new TypeScriptChecker()
    const result = checker.check('const x: any = 1;')
    expect(result.passed).toBe(false)
    expect(result.severity).toBe('warning')
  })

  it('Python checker warns on missing return type', () => {
    const checker = new PythonTypeChecker()
    const result = checker.check('def foo(x):')
    expect(result.passed).toBe(false)
    expect(result.severity).toBe('warning')
  })

  it('evaluates code with all checkers', () => {
    const ctx = new Context()
    const plugin = new NeuroSymbolic(ctx)
    const results = plugin.evaluate('const x: any = 1;')
    expect(results.length).toBe(2)
    expect(results[0].passed).toBe(false)
  })

  it('does not block on warnings', () => {
    const ctx = new Context()
    const plugin = new NeuroSymbolic(ctx)
    const results = plugin.evaluate('const x: any = 1;')
    expect(plugin.shouldBlock(results)).toBe(false)
  })
})
