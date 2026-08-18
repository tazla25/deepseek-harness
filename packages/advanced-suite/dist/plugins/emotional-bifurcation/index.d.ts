import { Context, Service } from 'cordis';
export interface EmotionalState {
    frustration: number;
    urgency: number;
    confusion: number;
    trust: number;
}
export declare class EmotionalBifurcation extends Service {
    constructor(ctx: Context);
    analyzeEmotionalState(_input: string): EmotionalState;
    calculateWeights(state: EmotionalState): {
        logical: number;
        emotional: number;
    };
    generateLogical(_input: string): string;
    generateEmotional(_input: string, state: EmotionalState): string;
    blendResponses(logical: string, emotional: string, weights: {
        logical: number;
        emotional: number;
    }): string;
}
export default EmotionalBifurcation;
//# sourceMappingURL=index.d.ts.map