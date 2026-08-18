import { describe, it, expect } from 'vitest'
import { Context } from '@deepseek-ai/cordis'
import * as advCognition from '../../../src/plugins/adversarial-cognition/index.ts'

describe('adversarial-cognition plugin', () => {
  it('should inject synthesis when enabled', async () => {
    const ctx = new Context()
    ctx.plugin(advCognition, { enabled: true })
    await new Promise(r => setTimeout(r, 100))

    const preStepArgs = {
      agent: {} as any,
      messages: [],
      turn: 1,
      step: 1,
      signal: new AbortController().signal,
    }

    const decision = (await ctx.serial('agent/pre-step', preStepArgs as any, async () => ({ kind: 'enter', messages: [] } as any))) || { kind: 'enter', messages: [] }
    expect(decision.kind).toBe('enter')
    if (decision.kind === 'enter') {
      expect(decision.messages.length).toBeGreaterThan(0)
      const msg = decision.messages.find((m: any) => m.data?.source?.kind === 'plugin' && m.data?.source?.plugin === 'adversarial-cognition')
      expect(msg).toBeDefined()
      expect((msg as any)!.data.content[0].text).toContain('[SYNTHESIS]')
    }
  })

  it('should not inject when disabled', async () => {
    const ctx = new Context()
    ctx.plugin(advCognition, { enabled: false })
    await new Promise(r => setTimeout(r, 100))

    const preStepArgs = {
      agent: {} as any,
      messages: [],
      turn: 1,
      step: 1,
      signal: new AbortController().signal,
    }

    const decision = (await ctx.serial('agent/pre-step', preStepArgs as any, async () => ({ kind: 'enter', messages: [] } as any))) || { kind: 'enter', messages: [] }
    if (decision.kind === 'enter') {
      expect(decision.messages.length).toBe(0)
    }
  })
})
