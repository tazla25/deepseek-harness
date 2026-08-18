import { Context, Service } from 'cordis';
declare module 'cordis' {
    interface Events {
        'agent/pre-step': (_stepData: any) => void;
    }
}
export declare class FederatedMemory extends Service {
    constructor(ctx: Context);
    extractMemory(data: any): any;
    addPrivacyNoise(value: number, epsilon?: number): number;
    shareToHub(memory: any): void;
    retrieveRelevant(_query: string): any[];
}
export default FederatedMemory;
//# sourceMappingURL=index.d.ts.map