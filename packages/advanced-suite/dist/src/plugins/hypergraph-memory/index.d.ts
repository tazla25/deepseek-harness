import { Service, Context } from 'cordis';
export interface HyperNode {
    id: string;
    content: string;
    type: string;
    embedding?: number[];
}
export interface HyperEdge {
    id: string;
    source: string;
    target: string;
    relationship: string;
    weight: number;
}
export interface Insight {
    id: string;
    description: string;
    sourceNodes: string[];
}
declare module 'cordis' {
    interface Context {
        hypergraphMemory: HypergraphMemoryEngine;
    }
}
export declare class HypergraphMemoryEngine extends Service {
    nodes: Map<string, HyperNode>;
    edges: Map<string, HyperEdge>;
    insights: Map<string, Insight>;
    private persistencePath;
    private saveTimeout;
    constructor(ctx: Context);
    private load;
    private save;
    private handleReasoning;
    private handleToolResult;
    private handleSystemPromptAssemble;
    private generateLocalEmbedding;
    ingestThought(thought: string, type?: string): Promise<string>;
    discoverInsight(): Insight[];
    detectContradictions(): string[];
}
