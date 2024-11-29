import { describe, it, expect } from "vitest";
import {
    BooleanLiteralNode,
    ExpressionNode,
    NumberLiteralNode,
} from "@/lib/parser/nodes";
import { ASTVisitor } from "@/lib/parser/astVisitor";
import { MathOperatorEmojis, RelationalEmojis } from "@/lib/emojiConstants";

describe("Test Expression Node", () => {
    const visitor = new ASTVisitor();
    const position = { line: 0, column: 0 };

    it("should properly handle expression with operator", () => {
        const lhs = new NumberLiteralNode(0, position);
        const op = MathOperatorEmojis.ADD;
        const rhs = new NumberLiteralNode(1, position);
        const n = new ExpressionNode(lhs, op, rhs, false, position);
        const expr = n.accept(visitor);
        expect(expr).toEqual("0+1");
        expect(n.position).toEqual({ line: 0, column: 0 });
        expect(n.accept).toBeTypeOf("function");
        expect(n.debug).toBeTypeOf("function");
    });

    it("should properly handle expression with single value", () => {
        const lhs = new NumberLiteralNode(0, position);
        const n = new ExpressionNode(lhs, null, null, false, position);
        const expr = n.accept(visitor);
        expect(expr).toEqual("0");
    });

    it("should properly handle expression with single value in parenthesis", () => {
        const lhs = new NumberLiteralNode(0, position);
        const n = new ExpressionNode(lhs, null, null, true, position);
        const expr = n.accept(visitor);
        expect(expr).toEqual("(0)");
    });

    it("should properly handle nested expressions", () => {
        const lhs = new ExpressionNode(
            new NumberLiteralNode(1, position),
            RelationalEmojis.EQUAL,
            new ExpressionNode(
                new NumberLiteralNode(1, position),
                MathOperatorEmojis.ADD,
                new NumberLiteralNode(0, position),
                true,
                position
            ),
            false,
            position
        );
        const n = new ExpressionNode(lhs, null, null, true, position);
        const expr = n.accept(visitor);
        expect(expr).toEqual("(1===(1+0))");
    });

    it("should properly handle not operator", () => {
        const lhs = new BooleanLiteralNode(false, position);
        const n = new ExpressionNode(
            lhs,
            RelationalEmojis.NOT,
            null,
            false,
            position
        );
        const expr = n.accept(visitor);
        expect(expr).toEqual("!false");
    });

    it("should throw when no given operator when RHS is defined", () => {
        const lhs = new BooleanLiteralNode(false, position);
        const n = new ExpressionNode(
            lhs,
            RelationalEmojis.GREATER_OR_EQUAL,
            null,
            false,
            position
        );
        expect(() => n.accept(visitor)).toThrow();
    });

    it("should throw wehn no operator defined with RHS", () => {
        const lhs = new BooleanLiteralNode(false, position);
        const rhs = new BooleanLiteralNode(false, position);
        const n = new ExpressionNode(lhs, null, rhs, false, position);
        expect(() => n.accept(visitor)).toThrow();
    });
});
