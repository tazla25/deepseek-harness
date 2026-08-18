import { Context, Service } from 'cordis';
export interface Gene {
    id: string;
    value: number;
}
export interface PluginDNA {
    genes: Gene[];
    mutationRate: number;
}
export interface TaskOutcome {
    success: boolean;
    speed: number;
    cost: number;
    quality: number;
}
declare module 'cordis' {
    interface Events {
        'session/start': () => void;
        'session/complete': (outcome: TaskOutcome) => void;
    }
}
export declare class GeneticEvolution extends Service {
    population: {
        dna: PluginDNA;
        fitness: number;
    }[];
    constructor(ctx: Context);
    detectSpecies(workspaceFiles: string[]): string;
    calculateFitness(outcome: TaskOutcome): number;
    tournamentSelect(population: {
        dna: PluginDNA;
        fitness: number;
    }[], tournamentSize?: number): PluginDNA;
    crossover(parentA: PluginDNA, parentB: PluginDNA): PluginDNA;
    mutate(dna: PluginDNA): PluginDNA;
    evolveGeneration(population: {
        dna: PluginDNA;
        fitness: number;
    }[]): PluginDNA[];
}
export default GeneticEvolution;
//# sourceMappingURL=index.d.ts.map