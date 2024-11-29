import { describe, it, expect } from "vitest";
import {
    ExpressionNode,
    FunctionCallNode,
    IdentifierNode,
    NumberLiteralNode,
} from "@/lib/parser/nodes";
import { ASTVisitor } from "@/lib/parser/astVisitor";
import { MathOperatorEmojis } from "@/lib/emojiConstants";

describe("Test Function Call Node", () => {
    const visitor = new ASTVisitor();
    const position = { line: 0, column: 0 };

    it("should create a function call without parameters javascript string", () => {
        const n = new FunctionCallNode(
            new IdentifierNode("a", position),
            [],
            position
        );
        expect(n.name.accept(visitor)).toEqual("a");
        expect(n.position).toEqual({ line: 0, column: 0 });
        expect(n.accept).toBeTypeOf("function");
        expect(n.debug).toBeTypeOf("function");
        expect(n.accept(visitor)).toEqual("a()");
    });

    it("should create a function call with parameters javascript string", () => {
        const n = new FunctionCallNode(
            new IdentifierNode("a", position),
            [
                new ExpressionNode(
                    new NumberLiteralNode(1, position),
                    MathOperatorEmojis.ADD,
                    new NumberLiteralNode(1, position),
                    false,
                    position
                ),
                new IdentifierNode("b", position),
            ],
            position
        );
        expect(n.name.accept(visitor)).toEqual("a");
        expect(n.position).toEqual({ line: 0, column: 0 });
        expect(n.accept).toBeTypeOf("function");
        expect(n.debug).toBeTypeOf("function");
        expect(n.accept(visitor)).toEqual("a(1+1,b)");
    });
});
