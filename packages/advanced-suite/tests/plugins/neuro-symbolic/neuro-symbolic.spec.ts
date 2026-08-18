import { describe, it, expect } from 'vitest'
import { Context } from '@deepseek-ai/cordis'
import * as neuroSymbolic from '../../../src/plugins/neuro-symbolic/index.ts'
import type { ToolExecution } from '@deepseek-ai/dsh-tools'

describe('neuro-symbolic plugin', () => {
  it('should pass correct code', async () => {
    const ctx = new Context()
    ctx.plugin(neuroSymbolic)
    await new Promise(r => setTimeout(r, 100))

    const exec: ToolExecution = {
      name: 'str_replace_editor',
      arguments: JSON.stringify({ code: 'const a: number = 1;' }),
      callId: 'call_123' as any,
      agent: {} as any, rootCallId: 'root_123' as any, token: {} as any, signal: new AbortController().signal,
    }

    const decision = await ctx.serial('tools/post-execute', exec, {} as any, async () => ({ kind: 'return', result: {} } as any))
    expect(decision.kind).toBe('return')
  })

  it('should block on type errors', async () => {
    const ctx = new Context()
    ctx.plugin(neuroSymbolic)
    await new Promise(r => setTimeout(r, 100))

    const exec: ToolExecution = {
      name: 'str_replace_editor',
      arguments: JSON.stringify({ code: 'var x: string = 1' }),
      callId: 'call_123' as any,
      agent: {} as any, rootCallId: 'root_123' as any, token: {} as any, signal: new AbortController().signal,
    }

    const decision = await ctx.serial('tools/post-execute', exec, {} as any, async () => ({ kind: 'return', result: {} } as any))
    expect(decision.kind).toBe('block')
    if (decision.kind === 'block') {
      expect((decision.feedback as any)[0].text).toContain("Type 'number' is not assignable to type 'string'.")
    }
  })
})
