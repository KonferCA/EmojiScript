import { describe, it, expect, beforeEach } from "vitest";
import {
    ExpressionNode,
    FunctionDefinitionNode,
    IdentifierNode,
    IfStatementNode,
    IOOperationNode,
    NumberLiteralNode,
} from "@/lib/parser/nodes";
import { ASTVisitor } from "@/lib/parser/astVisitor";
import { IOEmojis, RelationalEmojis } from "@/lib/emojiConstants";

describe("Test Function Definition Node", () => {
    let visitor = new ASTVisitor();
    beforeEach(() => {
        visitor = new ASTVisitor();
    });

    const position = { line: 0, column: 0 };

    it("should create a function definition without parameters and empty body javascript string", () => {
        const n = new FunctionDefinitionNode(
            new IdentifierNode("a", position),
            [],
            [],
            position
        );
        expect(n.name.accept(visitor)).toEqual("a");
        expect(n.position).toEqual({ line: 0, column: 0 });
        expect(n.accept).toBeTypeOf("function");
        expect(n.debug).toBeTypeOf("function");
        expect(n.accept(visitor)).toEqual("function a(){}");
    });

    it("should create a function definition without parameters and non-empty body javascript string", () => {
        const n = new FunctionDefinitionNode(
            new IdentifierNode("a", position),
            [],
            [
                new IfStatementNode(
                    new ExpressionNode(
                        new NumberLiteralNode(1, position),
                        RelationalEmojis.LESS,
                        new NumberLiteralNode(2, position),
                        false,
                        position
                    ),
                    [
                        new IOOperationNode(
                            IOEmojis.PRINT,
                            new NumberLiteralNode(1, position),
                            position
                        ),
                        new IOOperationNode(
                            IOEmojis.PRINT,
                            new NumberLiteralNode(2, position),
                            position
                        ),
                    ],
                    undefined,
                    position
                ),
            ],
            position
        );
        expect(n.name.accept(visitor)).toEqual("a");
        expect(n.position).toEqual({ line: 0, column: 0 });
        expect(n.accept).toBeTypeOf("function");
        expect(n.debug).toBeTypeOf("function");
        expect(n.accept(visitor)).toEqual(
            "function a(){if(1<2){window.alert(1);window.alert(2)}}"
        );
    });

    it("should create a function definition with parameters javascript string", () => {
        const n = new FunctionDefinitionNode(
            new IdentifierNode("a", position),
            [
                new IdentifierNode("param1", position),
                new IdentifierNode("param2", position),
            ],
            [],
            position
        );
        expect(n.name.accept(visitor)).toEqual("a");
        expect(n.position).toEqual({ line: 0, column: 0 });
        expect(n.accept).toBeTypeOf("function");
        expect(n.debug).toBeTypeOf("function");
        expect(n.accept(visitor)).toEqual("function a(param1,param2){}");
    });

    it("should create a function definition with parameters and body javascript string", () => {
        const n = new FunctionDefinitionNode(
            new IdentifierNode("a", position),
            [
                new IdentifierNode("param1", position),
                new IdentifierNode("param2", position),
            ],
            [
                new IfStatementNode(
                    new ExpressionNode(
                        new IdentifierNode("param1", position),
                        RelationalEmojis.LESS,
                        new IdentifierNode("param2", position),
                        false,
                        position
                    ),
                    [
                        new IOOperationNode(
                            IOEmojis.PRINT,
                            new NumberLiteralNode(1, position),
                            position
                        ),
                        new IOOperationNode(
                            IOEmojis.PRINT,
                            new NumberLiteralNode(2, position),
                            position
                        ),
                    ],
                    undefined,
                    position
                ),
            ],
            position
        );
        expect(n.name.accept(visitor)).toEqual("a");
        expect(n.position).toEqual({ line: 0, column: 0 });
        expect(n.accept).toBeTypeOf("function");
        expect(n.debug).toBeTypeOf("function");
        expect(n.accept(visitor)).toEqual(
            "function a(param1,param2){if(param1<param2){window.alert(1);window.alert(2)}}"
        );
    });

    it("should throw an error if function with the same name is re-defined", () => {
        const n = new FunctionDefinitionNode(
            new IdentifierNode("a", position),
            [],
            [],
            position
        );
        expect(n.accept(visitor)).toEqual("function a(){}");
        const m = new FunctionDefinitionNode(
            new IdentifierNode("a", position),
            [],
            [],
            position
        );
        expect(() => m.accept(visitor)).toThrow();
    });
});
