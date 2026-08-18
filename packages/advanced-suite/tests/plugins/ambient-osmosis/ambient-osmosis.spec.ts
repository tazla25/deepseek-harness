import { describe, it, expect } from 'vitest'
import { Context } from '@deepseek-ai/cordis'
import * as ambientOsmosis from '../../../src/plugins/ambient-osmosis/index.ts'

describe('ambient-osmosis plugin', () => {
  it('should inject ambient context into system-prompt/assemble', async () => {
    const ctx = new Context()

    // Satisfy inject condition
    ctx.provide('systemPrompt')
    ctx.systemPrompt = {} as any

    ctx.plugin(ambientOsmosis)

    // Wait for cordis lifecycle
    await new Promise(r => setTimeout(r, 100))

    const initialAssembly = {
      sections: [],
      contexts: [],
      tools: [],
      variables: {},
    }

    const result = await ctx.serial('system-prompt/assemble', initialAssembly, {}, async () => initialAssembly)

    expect(result.contexts.length).toBeGreaterThan(0)
    expect((result.contexts as any)[0].name).toBe('ambient-context')
    expect((result.contexts as any)[0].text).toContain('[GitSensor]')
  })
})
