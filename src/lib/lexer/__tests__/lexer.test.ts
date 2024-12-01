import { describe, it, expect } from 'vitest';
import { Lexer, TokenType } from '../lexer';

describe('Lexer', () => {
    const getTokens = (input: string) => {
        const lexer = new Lexer(input);
        const tokens = [];
        while (!lexer.end()) {
            const token = lexer.next();
            if (token.type !== TokenType.EOF) {
                tokens.push(token);
            }
        }
        return tokens;
    };

    describe('Data Types and Literals', () => {
        it('should tokenize number declarations', () => {
            const input = '🔢 1️⃣';
            const tokens = getTokens(input);
            
            expect(tokens).toHaveLength(2);
            expect(tokens[0].type).toBe(TokenType.NumberType);
            expect(tokens[1].type).toBe(TokenType.Number);
            expect(tokens[1].literal).toBe(1);
        });

        it('should tokenize string declarations', () => {
            const input = '📝 👋';
            const tokens = getTokens(input);
            
            expect(tokens).toHaveLength(2);
            expect(tokens[0].type).toBe(TokenType.StringType);
            expect(tokens[1].type).toBe(TokenType.Emojis);
            expect(tokens[1].literal).toBe('👋');
        });

        it('should tokenize boolean declarations', () => {
            const input = '🏁 ✅';
            const tokens = getTokens(input);
            
            expect(tokens).toHaveLength(2);
            expect(tokens[0].type).toBe(TokenType.BooleanType);
            expect(tokens[1].type).toBe(TokenType.Boolean);
            expect(tokens[1].literal).toBe(true);
        });

        it('should tokenize array declarations', () => {
            const input = '📦 1️⃣ 2️⃣ 3️⃣ 📦';
            const tokens = getTokens(input);
            
            expect(tokens).toHaveLength(5);
            expect(tokens[0].type).toBe(TokenType.ArrayType);
            expect(tokens[1].type).toBe(TokenType.Number);
            expect(tokens[2].type).toBe(TokenType.Number);
            expect(tokens[3].type).toBe(TokenType.Number);
            expect(tokens[4].type).toBe(TokenType.ArrayType);
        });
    });

    describe('IO Operations', () => {
        it('should tokenize print statements', () => {
            const input = '📢 👋';
            const tokens = getTokens(input);
            
            expect(tokens).toHaveLength(2);
            expect(tokens[0].type).toBe(TokenType.Print);
            expect(tokens[1].type).toBe(TokenType.Emojis);
        });
    });

    describe('Position Tracking', () => {
        it('should track line numbers correctly', () => {
            const input = '1️⃣ ➕\n2️⃣ ➖\n3️⃣';
            const tokens = getTokens(input);
            
            expect(tokens[0].position.line).toBe(1);
            expect(tokens[2].position.line).toBe(2);
            expect(tokens[4].position.line).toBe(3);
        });
    });

    describe('Edge Cases', () => {
        it('should handle empty input', () => {
            const tokens = getTokens('');
            expect(tokens).toHaveLength(0);
        });

        it('should handle whitespace-only input', () => {
            const tokens = getTokens('   \n   \t   ');
            expect(tokens).toHaveLength(0);
        });

        it('should handle illegal tokens', () => {
            const input = '❓';
            const tokens = getTokens(input);
            expect(tokens[0].type).toBe(TokenType.Emojis);
        });

        it('should handle consecutive tokens with spaces', () => {
            const input = '1️⃣ ➕ 2️⃣';
            const tokens = getTokens(input);
            
            expect(tokens).toHaveLength(3);
            expect(tokens[0].type).toBe(TokenType.Number);
            expect(tokens[1].type).toBe(TokenType.AdditionOp);
            expect(tokens[2].type).toBe(TokenType.Number);
        });
    });

    describe('Peek Functionality', () => {
        it('should peek next token without advancing', () => {
            const lexer = new Lexer('1️⃣ ➕');
            const peeked = lexer.peek();
            const next = lexer.next();
            
            expect(peeked).toEqual(next);
            expect(lexer.peek().type).toBe(TokenType.AdditionOp);
        });
    });
});