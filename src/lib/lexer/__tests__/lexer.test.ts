import { describe, it, expect } from 'vitest';
import { Lexer, TokenType } from '../lexer';

describe('Lexer', () => {
    it('should tokenize number declarations', () => {
        const input = '🔢 1️⃣';
        const lexer = new Lexer(input);
        
        const tokens = [];
        while (!lexer.end()) {
            tokens.push(lexer.next());
        }

        expect(tokens).toHaveLength(2);
        expect(tokens[0].type).toBe(TokenType.NumberType);
        expect(tokens[1].type).toBe(TokenType.Number);
        expect(tokens[1].literal).toBe(1);
    });

    it('should tokenize string declarations', () => {
        const input = '📝 👋';
        const lexer = new Lexer(input);
        
        const tokens = [];
        while (!lexer.end()) {
            tokens.push(lexer.next());
        }

        expect(tokens).toHaveLength(2);
        expect(tokens[0].type).toBe(TokenType.StringType);
        expect(tokens[1].type).toBe(TokenType.Emojis);
        expect(tokens[1].literal).toBe('👋');
    });

    it('should tokenize boolean declarations', () => {
        const input = '🏁 ✅';
        const lexer = new Lexer(input);
        
        const tokens = [];
        while (!lexer.end()) {
            tokens.push(lexer.next());
        }

        expect(tokens).toHaveLength(2);
        expect(tokens[0].type).toBe(TokenType.BooleanType);
        expect(tokens[1].type).toBe(TokenType.Boolean);
        expect(tokens[1].literal).toBe(true);
    });

    it('should tokenize math operations', () => {
        const input = '1️⃣ ➕ 2️⃣';
        const lexer = new Lexer(input);
        
        const tokens = [];
        while (!lexer.end()) {
            tokens.push(lexer.next());
        }

        expect(tokens).toHaveLength(3);
        expect(tokens[0].type).toBe(TokenType.Number);
        expect(tokens[0].literal).toBe(1);
        expect(tokens[1].type).toBe(TokenType.AdditionOp);
        expect(tokens[2].type).toBe(TokenType.Number);
        expect(tokens[2].literal).toBe(2);
    });

    it('should handle multiline input', () => {
        const input = '1️⃣ ➕ 2️⃣\n3️⃣ ➖ 4️⃣';
        const lexer = new Lexer(input);
        
        const tokens = [];
        while (!lexer.end()) {
            tokens.push(lexer.next());
        }

        expect(tokens).toHaveLength(6);
        expect(tokens[0].position.line).toBe(1);
        expect(tokens[3].position.line).toBe(2);
    });

    it('should handle array declarations', () => {
        const input = '📦 1️⃣ 2️⃣ 3️⃣ 📦';
        const lexer = new Lexer(input);
        
        const tokens = [];
        while (!lexer.end()) {
            tokens.push(lexer.next());
        }

        expect(tokens).toHaveLength(5);
        expect(tokens[0].type).toBe(TokenType.ArrayType);
        expect(tokens[1].type).toBe(TokenType.Number);
        expect(tokens[2].type).toBe(TokenType.Number);
        expect(tokens[3].type).toBe(TokenType.Number);
        expect(tokens[4].type).toBe(TokenType.ArrayType);
    });
}); 