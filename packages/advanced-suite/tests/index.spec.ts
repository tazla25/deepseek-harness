import { describe, it, expect } from 'vitest'
import { Context } from '@deepseek-ai/cordis'
import * as plugin from '../src/index.ts'

describe('advanced-suite', () => {
  it('should load properly', () => {
    const ctx = new Context()
    ctx.plugin(plugin)
    expect(ctx.registry.has(plugin)).toBe(true)
  })
})
