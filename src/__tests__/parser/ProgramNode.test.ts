import { describe, it, expect } from "vitest";
import {
    ArrayLiteralNode,
    BooleanLiteralNode,
    ExpressionNode,
    FunctionCallNode,
    FunctionDefinitionNode,
    IdentifierNode,
    IfStatementNode,
    IOOperationNode,
    NumberLiteralNode,
    ProgramNode,
    StringLiteralNode,
    VariableDeclarationNode,
} from "@/lib/parser/nodes";
import { ASTVisitor } from "@/lib/parser/astVisitor";
import type { Node } from "@/lib/parser/types";
import { IOEmojis, RelationalEmojis } from "@/lib/emojiConstants";

describe("Test Program Node", () => {
    const visitor = new ASTVisitor();
    const position = { line: 0, column: 0 };

    it("should handle literal values in program", () => {
        const statements: Node[] = [
            new NumberLiteralNode(0, position),
            new StringLiteralNode("🍦", position),
            new BooleanLiteralNode(true, position),
            new ArrayLiteralNode(
                [new BooleanLiteralNode(false, position)],
                position
            ),
        ];
        const n = new ProgramNode(statements, position);
        expect(n.statements).toHaveLength(statements.length);
        expect(n.accept).toBeTypeOf("function");
        expect(n.debug).toBeTypeOf("function");
        const expectedStr = `0;"🍦";true;[false]`;
        const jsStr = n.accept(visitor);
        expect(jsStr).toEqual(expectedStr);
    });

    it("should build a runnable program", () => {
        const statements: Node[] = [
            new FunctionDefinitionNode(
                new IdentifierNode("max", position),
                [
                    new IdentifierNode("a", position),
                    new IdentifierNode("b", position),
                ],
                [
                    new IfStatementNode(
                        new ExpressionNode(
                            new IdentifierNode("a", position),
                            RelationalEmojis.GREATER,
                            new IdentifierNode("b", position),
                            false,
                            position
                        ),
                        [
                            new IOOperationNode(
                                IOEmojis.PRINT,
                                new IdentifierNode("a", position),
                                position
                            ),
                        ],
                        [
                            new IOOperationNode(
                                IOEmojis.PRINT,
                                new IdentifierNode("b", position),
                                position
                            ),
                        ],
                        position
                    ),
                ],
                position
            ),
            new VariableDeclarationNode(
                new IdentifierNode("x", position),
                new NumberLiteralNode(1, position),
                position
            ),
            new VariableDeclarationNode(
                new IdentifierNode("y", position),
                new NumberLiteralNode(2, position),
                position
            ),
            new FunctionCallNode(
                new IdentifierNode("max", position),
                [
                    new IdentifierNode("x", position),
                    new IdentifierNode("y", position),
                ],
                position
            ),
        ];
        const n = new ProgramNode(statements, position);
        const expectedStr = `function a(b,c){if(b>c){window.alert(b)}else{window.alert(c)}};let d=1;let e=2;a(d,e)`;
        const jsStr = n.accept(visitor);
        expect(jsStr).toEqual(expectedStr);
    });
});
