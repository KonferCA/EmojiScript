import { describe, it, expect } from "vitest";
import { MathOperationNode, NumberLiteralNode } from "@/lib/parser/nodes";
import { ASTVisitor } from "@/lib/parser/astVisitor";
import { MathOperatorEmojis } from "@/lib/emojiConstants";

describe("Test Math Operation Node", () => {
    const visitor = new ASTVisitor();
    const position = { line: 0, column: 0 };

    it("should handle addition operation", () => {
        const addition = MathOperatorEmojis.ADD;
        const lhs = new NumberLiteralNode(1, position);
        const rhs = new NumberLiteralNode(1, position);
        const n = new MathOperationNode(addition, lhs, rhs, position);
        expect(n.operator).toEqual(addition);
        expect(n.accept).toBeTypeOf("function");
        expect(n.debug).toBeTypeOf("function");

        const expectedStr = "1+1";
        const mathStr = n.accept(visitor);
        expect(mathStr).toEqual(expectedStr);
    });

    it("should handle substraction operation", () => {
        const addition = MathOperatorEmojis.SUBTRACT;
        const lhs = new NumberLiteralNode(1, position);
        const rhs = new NumberLiteralNode(1, position);
        const n = new MathOperationNode(addition, lhs, rhs, position);
        expect(n.operator).toEqual(addition);
        expect(n.accept).toBeTypeOf("function");
        expect(n.debug).toBeTypeOf("function");

        const expectedStr = "1-1";
        const mathStr = n.accept(visitor);
        expect(mathStr).toEqual(expectedStr);
    });

    it("should handle division operation", () => {
        const addition = MathOperatorEmojis.DIVIDE;
        const lhs = new NumberLiteralNode(1, position);
        const rhs = new NumberLiteralNode(1, position);
        const n = new MathOperationNode(addition, lhs, rhs, position);
        expect(n.operator).toEqual(addition);
        expect(n.accept).toBeTypeOf("function");
        expect(n.debug).toBeTypeOf("function");

        const expectedStr = "1/1";
        const mathStr = n.accept(visitor);
        expect(mathStr).toEqual(expectedStr);
    });

    it("should handle multiplication operation", () => {
        const addition = MathOperatorEmojis.MULTIPLY;
        const lhs = new NumberLiteralNode(1, position);
        const rhs = new NumberLiteralNode(1, position);
        const n = new MathOperationNode(addition, lhs, rhs, position);
        expect(n.operator).toEqual(addition);
        expect(n.accept).toBeTypeOf("function");
        expect(n.debug).toBeTypeOf("function");

        const expectedStr = "1*1";
        const mathStr = n.accept(visitor);
        expect(mathStr).toEqual(expectedStr);
    });
});
