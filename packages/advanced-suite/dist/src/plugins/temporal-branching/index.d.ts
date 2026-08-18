import { Service, Context } from 'cordis';
export interface Turn {
    id: string;
    content: string;
}
export interface Branch {
    name: string;
    turns: Turn[];
    parent?: string;
}
export interface SystemState {
    currentBranch: string;
    branches: Map<string, Branch>;
}
declare module 'cordis' {
    interface Context {
        temporalBranching: TemporalBranchingEngine;
    }
}
export declare class TemporalBranchingEngine extends Service {
    private state;
    constructor(ctx: Context);
    createBranch(name: string): void;
    checkout(target: string): void;
    merge(sourceBranchName: string): void;
    diff(turnA: Turn, turnB: Turn): string;
    replay(turnIndex: number, modifications: Partial<Turn>): void;
}
