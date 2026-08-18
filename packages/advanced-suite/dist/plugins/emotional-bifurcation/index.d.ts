import { Context, Service } from 'cordis';
export interface EmotionalState {
    frustration: number;
    urgency: number;
    confusion: number;
    trust: number;
}
export declare class EmotionalBifurcation extends Service {
    constructor(ctx: Context);
    analyzeEmotionalState(input: string): EmotionalState;
    calculateWeights(state: EmotionalState): {
        logical: number;
        emotional: number;
    };
    generateLogical(input: string): string;
    generateEmotional(input: string, state: EmotionalState): string;
    blendResponses(logical: string, emotional: string, weights: {
        logical: number;
        emotional: number;
    }): string;
}
export default EmotionalBifurcation;
