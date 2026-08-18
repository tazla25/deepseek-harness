import type { Context } from '@deepseek-ai/cordis'

export const name = 'noop-logger'

export function apply(ctx: Context): void {
  // A noop plugin that logs relevant loop events
  ctx.on('system-prompt/assemble', (assembly, context, next) => {
    // console.log('system-prompt/assemble')
    return next()
  })

  ctx.on('agent/pre-step', (context, next) => {
    // console.log('agent/pre-step')
    return next()
  })
}
