import { Context, Service } from 'cordis';
export interface Branch {
    id: string;
    score: number;
    lessons: string[];
}
export interface SimulationOutcome {
    tests: number;
    complexity: number;
    performance: number;
    cost: number;
    preference: number;
}
declare module 'cordis' {
    interface Context {
        simulationSandbox?: {
            runSimulation: (branch: Branch) => SimulationOutcome;
        };
    }
}
export declare class SuperpositionReasoning extends Service {
    static inject: {
        simulationSandbox: {
            required: boolean;
        };
    };
    constructor(ctx: Context);
    shouldBranch(complexity: number): boolean;
    spawnBranches(count: number): Branch[];
    evaluateBranch(outcome: SimulationOutcome): number;
    collapseWavefunction(branches: Branch[]): Branch;
    applyWinner(winner: Branch): void;
    extractLessons(branch: Branch): string[];
}
export default SuperpositionReasoning;
