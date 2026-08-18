# Configuration

All configuration is provided via the standard DeepSeek Harness profiles in `cordis.yml`.

## Genetic Evolution
```yaml
plugins:
  geneticEvolution:
    populationSize: 100
    elitePercentage: 0.2
    mutationRate: 0.05
```

## Superposition Reasoning
```yaml
plugins:
  superpositionReasoning:
    maxBranches: 5
    complexityThreshold: 0.7
```

## Federated Memory
```yaml
plugins:
  federatedMemory:
    epsilon: 1.0
    hubUrl: https://federation.deepseek.ai/
```

## Emotional Bifurcation
```yaml
plugins:
  emotionalBifurcation:
    defaultTrust: 0.8
    blendBias: "logical"
```
