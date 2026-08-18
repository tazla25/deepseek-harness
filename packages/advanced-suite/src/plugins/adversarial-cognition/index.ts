import { Context, Service } from 'cordis'

export interface DebateState {
  thesis: string
  antithesis: string
  synthesis: string
  rounds: number
  confidence: number
}

declare module 'cordis' {
  interface Context {
    adversarialCognition: AdversarialCognition
  }
}

export class AdversarialCognition extends Service {
  public maxRounds: number
  public confidenceThreshold: number

  constructor(ctx: Context, config: { maxRounds?: number, confidenceThreshold?: number } = {}) {
    super(ctx, 'adversarialCognition', true)
    this.maxRounds = config.maxRounds || 3
    this.confidenceThreshold = config.confidenceThreshold || 0.9

    // Assuming TS will check the event name, let's use a cast to bypass strict checking
    ;(ctx as any).on('agent/pre-step', async (stepData: any) => {
      if (stepData && stepData.input) {
         const result = this.debate(stepData.input)
         stepData.debatedInput = result.synthesis
      }
    })
  }

  generateAntithesis(thesis: string): string {
    return `Counter-argument to: ${thesis}`
  }

  generateSynthesis(thesis: string, antithesis: string): string {
    return `Synthesis of ${thesis} and ${antithesis}`
  }

  evaluateConfidence(_synthesis: string): number {
    // Mock confidence evaluation
    return Math.random()
  }

  debate(initialThesis: string): DebateState {
    let currentThesis = initialThesis
    let currentAntithesis = ''
    let currentSynthesis = ''
    let confidence = 0
    let rounds = 0

    while (rounds < this.maxRounds && confidence < this.confidenceThreshold) {
      currentAntithesis = this.generateAntithesis(currentThesis)
      currentSynthesis = this.generateSynthesis(currentThesis, currentAntithesis)
      confidence = this.evaluateConfidence(currentSynthesis)
      currentThesis = currentSynthesis // next round's thesis is the synthesis
      rounds++
    }

    return {
      thesis: currentThesis, // this is technically the last synthesis
      antithesis: currentAntithesis,
      synthesis: currentSynthesis,
      rounds,
      confidence
    }
  }
}

export default AdversarialCognition
