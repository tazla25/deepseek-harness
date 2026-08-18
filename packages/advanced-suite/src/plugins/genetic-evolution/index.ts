import { Context, Service } from 'cordis'

export interface Gene {
  id: string
  value: number
}

export interface PluginDNA {
  genes: Gene[]
  mutationRate: number
}

export interface TaskOutcome {
  success: boolean
  speed: number
  cost: number
  quality: number
}

declare module 'cordis' {
  interface Events {
    'session/start': () => void
    'session/complete': (outcome: TaskOutcome) => void
  }
}

export class GeneticEvolution extends Service {
  population: { dna: PluginDNA, fitness: number }[] = []

  constructor(ctx: Context) {
    super(ctx, 'geneticEvolution', true)

    ctx.on('session/start', () => {
      // detect species or prepare DNA
    })

    ctx.on('session/complete', (outcome) => {
      if (!outcome) return
      const fitness = this.calculateFitness(outcome)
      if (this.population.length > 0) {
        this.population[this.population.length - 1].fitness = fitness
      }

      // Keep track of the evolved generation by replacing old population with new one (keeping fitness=0 for now)
      const evolvedDNA = this.evolveGeneration(this.population)
      this.population = evolvedDNA.map(dna => ({ dna, fitness: 0 }))
    })
  }

  detectSpecies(workspaceFiles: string[]): string {
    if (workspaceFiles.includes('Cargo.toml')) return 'rust'
    if (workspaceFiles.includes('package.json')) return 'node'
    if (workspaceFiles.includes('requirements.txt') || workspaceFiles.includes('pyproject.toml')) return 'python'
    return 'unknown'
  }

  calculateFitness(outcome: TaskOutcome): number {
    return (
      (outcome.success ? 1 : 0) * 0.4 +
      outcome.speed * 0.2 +
      outcome.cost * 0.2 +
      outcome.quality * 0.2
    )
  }

  tournamentSelect(population: { dna: PluginDNA, fitness: number }[], tournamentSize: number = 3): PluginDNA {
    if (population.length === 0) return { genes: [], mutationRate: 0.1 }
    const tournament = []
    for (let i = 0; i < tournamentSize; i++) {
      tournament.push(population[Math.floor(Math.random() * population.length)])
    }
    tournament.sort((a, b) => b.fitness - a.fitness)
    return tournament[0].dna
  }

  crossover(parentA: PluginDNA, parentB: PluginDNA): PluginDNA {
    const midpoint = Math.floor(parentA.genes.length / 2)
    const childGenes = [
      ...parentA.genes.slice(0, midpoint),
      ...parentB.genes.slice(midpoint)
    ]
    return {
      genes: childGenes,
      mutationRate: (parentA.mutationRate + parentB.mutationRate) / 2
    }
  }

  mutate(dna: PluginDNA): PluginDNA {
    const newGenes = dna.genes.map(gene => {
      if (Math.random() < dna.mutationRate) {
        return { ...gene, value: gene.value + (Math.random() - 0.5) * 0.1 }
      }
      return gene
    })
    return { ...dna, genes: newGenes }
  }

  evolveGeneration(population: { dna: PluginDNA, fitness: number }[]): PluginDNA[] {
    if (population.length === 0) return []
    population.sort((a, b) => b.fitness - a.fitness)
    const eliteCount = Math.max(1, Math.floor(population.length * 0.2))
    const elites = population.slice(0, eliteCount).map(p => p.dna)

    const newPopulation = [...elites]

    while (newPopulation.length < population.length) {
      const parentA = this.tournamentSelect(population)
      const parentB = this.tournamentSelect(population)
      let child = this.crossover(parentA, parentB)
      child = this.mutate(child)
      newPopulation.push(child)
    }

    return newPopulation
  }
}

export default GeneticEvolution
