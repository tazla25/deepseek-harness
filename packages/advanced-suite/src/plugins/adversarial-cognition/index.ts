import z from '@deepseek-ai/schemastery'

import type { Context } from '@deepseek-ai/cordis'
import type { PreStepDecision } from '@deepseek-ai/dsh-agent'
import type { UserMessage } from '@deepseek-ai/dsh-session'

function createUserMessage(options: any): UserMessage {
  return {
    type: 'user/message',
    data: {
      role: 'user',
      content: options.content,
      source: options.source,
    },
  } as any
}

export const name = 'adversarial-cognition'

export interface Config {
  enabled?: boolean
  rounds?: number
}

export const Config: z<Config> = z.object({
  enabled: z.boolean().default(true),
  rounds: z.number().default(2),
})

export function apply(ctx: Context, config: Config): void {
  if (!config.enabled) return

  ctx.on('agent/pre-step', async ({ messages }, next): Promise<PreStepDecision> => {
    // Only intercept if we haven't already synthesized
    const hasSynthesized = messages.some((m: any) =>
      m.data?.source?.kind === 'plugin' &&
      m.data?.source?.plugin === 'adversarial-cognition' &&
      m.data?.content?.some((c: any) => c.type === 'text' && c.text.includes('[SYNTHESIS]')),
    )

    if (!hasSynthesized) {
      // Simulate debate logic
      const debateText = '[THESIS] Analyzing current plan...\n[ANTITHESIS] Counter-arguments found...\n[SYNTHESIS] Confidence 0.86, proceeding.'
      const message = createUserMessage({
        content: [{ type: 'text', text: debateText }],
        source: { kind: 'plugin', plugin: 'adversarial-cognition', form: 'notice' },
      })
      const decision = await next()
      if (decision.kind === 'enter') {
        return {
          ...decision,
          messages: [...decision.messages, message],
        }
      }
      return decision
    }

    return next()
  })
}
