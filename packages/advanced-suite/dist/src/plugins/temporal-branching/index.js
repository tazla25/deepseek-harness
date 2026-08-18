import { Service } from 'cordis';
export class TemporalBranchingEngine extends Service {
    state;
    constructor(ctx) {
        super(ctx, 'temporalBranching');
        this.state = {
            currentBranch: 'main',
            branches: new Map([['main', { name: 'main', turns: [] }]])
        };
        // Register commands if there is a command registry available in ctx
        if (ctx.command) {
            ctx.command('branch <name>', 'Create a new branch')
                .action((_any, name) => this.createBranch(name))(ctx).command('checkout <target>', 'Checkout a branch')
                .action((_any, target) => this.checkout(target))(ctx).command('merge <source>', 'Merge a branch')
                .action((_any, source) => this.merge(source));
        }
    }
    createBranch(name) {
        if (this.state.branches.has(name)) {
            throw new Error(`Branch ${name} already exists`);
        }
        const current = this.state.branches.get(this.state.currentBranch);
        this.state.branches.set(name, {
            name,
            turns: [...current.turns],
            parent: this.state.currentBranch
        });
    }
    checkout(target) {
        if (!this.state.branches.has(target)) {
            throw new Error(`Branch ${target} does not exist`);
        }
        this.state.currentBranch = target;
    }
    merge(sourceBranchName) {
        const source = this.state.branches.get(sourceBranchName);
        const current = this.state.branches.get(this.state.currentBranch);
        if (!source) {
            throw new Error(`Branch ${sourceBranchName} does not exist`);
        }
        // simple merge strategy for mvp
        const newTurns = source.turns.filter(t => !current.turns.some(ct => ct.id === t.id));
        current.turns.push(...newTurns);
    }
    diff(turnA, turnB) {
        return `diff ${turnA.id} ${turnB.id}`; // basic stub
    }
    replay(turnIndex, modifications) {
        const current = this.state.branches.get(this.state.currentBranch);
        if (turnIndex < 0 || turnIndex >= current.turns.length) {
            throw new Error('Invalid turn index');
        }
        const newTurn = { ...current.turns[turnIndex], ...modifications };
        current.turns[turnIndex] = {
            id: newTurn.id || current.turns[turnIndex].id,
            content: newTurn.content || current.turns[turnIndex].content
        };
    }
}
