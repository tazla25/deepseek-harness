# API Reference

## Genetic Evolution
- `calculateFitness(outcome: TaskOutcome): number`
- `evolveGeneration(population: ...): PluginDNA[]`
- `detectSpecies(workspaceFiles: string[]): string`

## Superposition Reasoning
- `spawnBranches(count: number): Branch[]`
- `collapseWavefunction(branches: Branch[]): Branch`
- `evaluateBranch(outcome: SimulationOutcome): number`

## Federated Memory
- `addPrivacyNoise(value: number, epsilon: number): number`
- `shareToHub(memory: any): void`

## Emotional Bifurcation
- `calculateWeights(state: EmotionalState): { logical, emotional }`
- `blendResponses(logical: string, emotional: string, weights: object): string`
