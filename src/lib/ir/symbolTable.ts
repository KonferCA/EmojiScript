export interface Symbol {
    name: string;
    value: string;
}

export class Scope {
    private symbols: Map<string, Symbol>;
    private parent: Scope | null;
    private level: number;

    constructor(level: number, parent: Scope | null = null) {
        this.symbols = new Map();
        this.parent = parent;
        this.level = level;
    }

    define(symbol: Symbol): void {
        if (this.symbols.has(symbol.name)) {
            throw new Error("⚠️📝💭💭❗");
        }
        this.symbols.set(symbol.name, symbol);
    }

    lookup(name: string, currentScopeOnly: boolean = false): Symbol | null {
        // Check current scope
        const symbol = this.symbols.get(name);
        if (symbol) {
            return symbol;
        }

        // If we only want to check current scope, return null here
        if (currentScopeOnly) {
            return null;
        }

        // Check parent scopes
        if (this.parent) {
            return this.parent.lookup(name);
        }

        return null;
    }

    getLevel(): number {
        return this.level;
    }

    getParent(): Scope | null {
        return this.parent;
    }
}

export class SymbolTable {
    private currentScope: Scope;

    constructor() {
        // Initialize with global scope
        this.currentScope = new Scope(0);
    }

    enterScope(): void {
        this.currentScope = new Scope(
            this.currentScope.getLevel() + 1,
            this.currentScope
        );
    }

    exitScope(): void {
        const parent = this.currentScope.getParent();
        if (!parent) {
            throw new Error("Cannot exit global scope");
        }
        this.currentScope = parent;
    }

    define(name: string, value: string): void {
        const symbol: Symbol = {
            name,
            value,
        };
        this.currentScope.define(symbol);
    }

    lookup(name: string, currentScopeOnly: boolean = false): Symbol | null {
        return this.currentScope.lookup(name, currentScopeOnly);
    }

    getCurrentScopeLevel(): number {
        return this.currentScope.getLevel();
    }
}
