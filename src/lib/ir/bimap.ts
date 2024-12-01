export class BiMap {
    private forwardMap: Map<string, string>;
    private reverseMap: Map<string, string>;
    private currentChar: number;

    constructor() {
        this.forwardMap = new Map();
        this.reverseMap = new Map();
        this.currentChar = 97; // ASCII code for 'a'
    }

    addMapping(original: string): string {
        // If already mapped, return existing mapping
        if (this.forwardMap.has(original)) {
            return this.forwardMap.get(original)!;
        }

        // Generate new mapping
        let mapped: string;

        // Single letter (a-z)
        if (this.currentChar <= 122) {
            mapped = String.fromCharCode(this.currentChar);
        }
        // Double letters (aa-zz)
        else {
            const base = Math.floor((this.currentChar - 123) / 26);
            const remainder = (this.currentChar - 123) % 26;
            mapped =
                String.fromCharCode(97 + base) +
                String.fromCharCode(97 + remainder);
        }

        // Store mappings in both directions
        this.forwardMap.set(original, mapped);
        this.reverseMap.set(mapped, original);

        // Increment for next mapping
        this.currentChar++;

        return mapped;
    }

    getOriginal(mapped: string): string {
        const original = this.reverseMap.get(mapped);
        if (!original) {
            throw new Error(`No original string found for mapping '${mapped}'`);
        }
        return original;
    }

    getMapped(original: string): string {
        const mapped = this.forwardMap.get(original);
        if (!mapped) {
            throw new Error(
                `No mapping found for original string '${original}'`
            );
        }
        return mapped;
    }

    getAllMappings(): Map<string, string> {
        return new Map(this.forwardMap);
    }
}
