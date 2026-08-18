import { Service } from 'cordis';
export class FederatedMemory extends Service {
    constructor(ctx) {
        super(ctx, 'federatedMemory', true);
        ctx.on('session/complete', (_outcome) => {
            // Memory sharing placeholder
        });
        ctx.on('agent/pre-step', (_stepData) => {
            // Memory retrieval placeholder
        });
    }
    extractMemory(data) {
        return { ...data };
    }
    addPrivacyNoise(value, epsilon = 1.0) {
        const scale = 1 / epsilon;
        const u = Math.random() - 0.5;
        // Avoid Math.log(0)
        const logVal = 1 - 2 * Math.abs(u);
        const safeLogVal = logVal <= 0 ? 0.0001 : logVal;
        const noise = -scale * Math.sign(u) * Math.log(safeLogVal);
        return value + noise;
    }
    shareToHub(memory) {
        if (memory.rawCode) {
            throw new Error("NEVER send raw code to hub");
        }
        // Share logic placeholder
    }
    retrieveRelevant(_query) {
        // Retrieve logic placeholder
        return [];
    }
}
export default FederatedMemory;
//# sourceMappingURL=index.js.map