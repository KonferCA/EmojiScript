import { describe, it, expect, beforeEach } from "vitest";
import {
    ExpressionNode,
    FunctionCallNode,
    FunctionDefinitionNode,
    IdentifierNode,
    NumberLiteralNode,
} from "@/lib/parser/nodes";
import { ASTVisitor } from "@/lib/parser/astVisitor";
import { MathOperatorEmojis } from "@/lib/emojiConstants";

describe("Test Function Call Node", () => {
    let visitor = new ASTVisitor();
    const position = { line: 0, column: 0 };
    const funcName = "a";

    beforeEach(() => {
        visitor = new ASTVisitor();
        // define the function for each test
        const f = new FunctionDefinitionNode(
            new IdentifierNode(funcName, position),
            [],
            [],
            position
        );
        f.accept(visitor);
    });

    it("should create a function call without parameters javascript string", () => {
        const n = new FunctionCallNode(
            new IdentifierNode(funcName, position),
            [],
            position
        );
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
