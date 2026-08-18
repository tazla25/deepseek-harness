import type { Context } from '@deepseek-ai/cordis'
import type { PostToolDecision, ToolExecution } from '@deepseek-ai/dsh-tools'

export const name = 'neuro-symbolic'

export interface SymbolicChecker {
  check(code: string): Promise<string[]>
}

export class TypeScriptChecker implements SymbolicChecker {
  async check(code: string): Promise<string[]> {
    // In a real environment, this runs `npx tsc --noEmit` on a temp file.
    // Here we'll simulate finding errors.
    if (code.includes('var x: string = 1')) {
      return ["Type 'number' is not assignable to type 'string'."]
    }
    return []
  }
}

export class PythonTypeChecker implements SymbolicChecker {
  async check(code: string): Promise<string[]> {
    // In a real environment, this runs `mypy`.
    if (code.includes('x: str = 1')) {
      return ['Incompatible types in assignment (expression has type "int", variable has type "str")']
    }
    return []
  }
}

export function apply(ctx: Context): void {
  const tsChecker = new TypeScriptChecker()
  const pyChecker = new PythonTypeChecker()

  ctx.on('tools/post-execute', async (exec: ToolExecution, _result, next): Promise<PostToolDecision> => {
    if (exec.name === 'str_replace_editor') {
      const args = typeof exec.arguments === 'string' ? JSON.parse(exec.arguments) : exec.arguments
      const code = args?.code || args?.content || ''

      let errors: string[] = []
      if (code) {
        const tsErrors = await tsChecker.check(code)
        const pyErrors = await pyChecker.check(code)
        errors = [...tsErrors, ...pyErrors]
      }

      if (errors.length > 0) {
        return {
          kind: 'block',
          feedback: [{ type: 'text' as const, text: `Neuro-Symbolic check failed: \n${errors.join('\n')}` }],
          additionalContexts: [],
        }
      }
    }
    return next()
  })
}
