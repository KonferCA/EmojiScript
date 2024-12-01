import { describe, it, expect } from "vitest";
import { Lexer, TokenType } from "../lexer";
import {
    ArrayEmojis,
    ControlFlowEmojis,
    NumberEmojis,
    ProgrammingEmojis,
    StringEmojis,
} from "@/lib/emojiConstants";

describe("Lexer", () => {
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

    describe("Data Types and Literals", () => {
        it("should tokenize number declarations", () => {
            const input = "1️⃣";
            const tokens = getTokens(input);

            expect(tokens).toHaveLength(1);
            expect(tokens[0].type).toBe(TokenType.Number);
            expect(tokens[0].literal).toBe(1);
        });

        it("should tokenize string declarations", () => {
            const input = [StringEmojis.QUOTE, "👋", StringEmojis.QUOTE].join(
                " "
            );
            const tokens = getTokens(input);

            expect(tokens).toHaveLength(1);
            expect(tokens[0].type).toBe(TokenType.String);
            expect(tokens[0].literal).toBe("👋");
        });

        it("should tokenize boolean declarations", () => {
            const input = "✅";
            const tokens = getTokens(input);

            expect(tokens).toHaveLength(1);
            expect(tokens[0].type).toBe(TokenType.Boolean);
            expect(tokens[0].literal).toBe(true);
        });

        it("should tokenize array declarations", () => {
            const input = [
                ArrayEmojis.START,
                NumberEmojis.ONE,
                NumberEmojis.TWO,
                NumberEmojis.THREE,
                ArrayEmojis.END,
            ].join(" ");
            const tokens = getTokens(input);

            expect(tokens).toHaveLength(5);
            expect(tokens[0].type).toBe(TokenType.ArrayStart);
            expect(tokens[1].type).toBe(TokenType.Number);
            expect(tokens[2].type).toBe(TokenType.Number);
            expect(tokens[3].type).toBe(TokenType.Number);
            expect(tokens[4].type).toBe(TokenType.ArrayEnd);
        });
    });

    describe("Array Operations", () => {
        it("should correctly return index operation", () => {
            const input = [
                ArrayEmojis.START,
                NumberEmojis.ONE,
                NumberEmojis.TWO,
                NumberEmojis.THREE,
                ArrayEmojis.END,
                ProgrammingEmojis.INDEXING,
                NumberEmojis.ZERO,
            ].join(" ");
            const tokens = getTokens(input);

            expect(tokens).toHaveLength(7);
            expect(tokens[0].type).toBe(TokenType.ArrayStart);
            expect(tokens[1].type).toBe(TokenType.Number);
            expect(tokens[2].type).toBe(TokenType.Number);
            expect(tokens[3].type).toBe(TokenType.Number);
            expect(tokens[4].type).toBe(TokenType.ArrayEnd);
            expect(tokens[5].type).toBe(TokenType.IndexingOp);
            expect(tokens[6].type).toBe(TokenType.Number);
        });
    });

    describe("IO Operations", () => {
        it("should tokenize print statements", () => {
            const input = "📢 👋";
            const tokens = getTokens(input);

            expect(tokens).toHaveLength(2);
            expect(tokens[0].type).toBe(TokenType.Print);
            expect(tokens[1].type).toBe(TokenType.Emojis);
        });
    });

    describe("Position Tracking", () => {
        it("should track line numbers correctly", () => {
            const input = "1️⃣ ➕\n2️⃣ ➖\n3️⃣";
            const tokens = getTokens(input);

            expect(tokens[0].position.line).toBe(1);
            expect(tokens[2].position.line).toBe(2);
            expect(tokens[4].position.line).toBe(3);
        });
    });

    describe("Edge Cases", () => {
        it("should handle empty input", () => {
            const tokens = getTokens("");
            expect(tokens).toHaveLength(0);
        });

        it("should handle whitespace-only input", () => {
            const tokens = getTokens("   \n   \t   ");
            expect(tokens).toHaveLength(0);
        });

        it("should handle illegal tokens", () => {
            const input = "❓";
            const tokens = getTokens(input);
            expect(tokens[0].type).toBe(TokenType.Emojis);
        });

        it("should handle consecutive tokens with spaces", () => {
            const input = "1️⃣ ➕ 2️⃣";
            const tokens = getTokens(input);

            expect(tokens).toHaveLength(3);
            expect(tokens[0].type).toBe(TokenType.Number);
            expect(tokens[1].type).toBe(TokenType.AdditionOp);
            expect(tokens[2].type).toBe(TokenType.Number);
        });
    });

    describe("Control Flow", () => {
        it("should return barrier operator", () => {
            const input = ControlFlowEmojis.PRECEDENCE;
            const tokens = getTokens(input);
            expect(tokens).toHaveLength(1);
            expect(tokens[0].type).toBe(TokenType.BarrierOp);
        });

        it("should return function call tokens", () => {
            const input = [
                ProgrammingEmojis.FUNCTION_CALL_START,
                ProgrammingEmojis.POINTER,
                ProgrammingEmojis.FUNCTION_CALL_END,
            ].join(" ");
            const tokens = getTokens(input);
            expect(tokens).toHaveLength(3);
            expect(tokens[0].type).toBe(TokenType.FuncCallStart);
            expect(tokens[1].type).toBe(TokenType.ThenOp);
            expect(tokens[2].type).toBe(TokenType.FuncCallEnd);
        });
    });

    describe("Peek Functionality", () => {
        it("should peek next token without advancing", () => {
            const lexer = new Lexer("1️⃣ ➕");
            const peeked = lexer.peek();
            const next = lexer.next();

            expect(peeked).toEqual(next);
            expect(lexer.peek().type).toBe(TokenType.AdditionOp);
        });
    });
});
