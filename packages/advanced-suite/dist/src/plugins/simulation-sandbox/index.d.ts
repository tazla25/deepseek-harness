import { Service, Context } from 'cordis';
export interface SimulationWorld {
    id: string;
    overlayDir: string;
}
declare module 'cordis' {
    interface Context {
        simulationSandbox: SimulationSandboxEngine;
    }
}
export declare class SimulationSandboxEngine extends Service {
    activeWorlds: Map<string, SimulationWorld>;
    constructor(ctx: Context);
    private handleBeforeExecute;
    private isSafe;
    createSimulationWorld(sourceDir?: string): SimulationWorld;
    runValidations(worldId: string): {
        success: boolean;
        output: string;
    };
    destroySimulationWorld(worldId: string): void;
}
