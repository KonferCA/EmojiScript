import { describe, it, expect } from "vitest";
import { ASTVisitor } from "@/lib/parser/astVisitor";
import {
    BooleanLiteralNode,
    ExpressionNode,
    IdentifierNode,
    IfStatementNode,
    NumberLiteralNode,
    VariableDeclarationNode,
} from "@/lib/parser/nodes";
import type { Node } from "@/lib/parser/types";

describe("Test If Statement Node", () => {
    const visitor = new ASTVisitor();
    const position = { line: 0, column: 0 };

    it("should create if statement", () => {
        const condition = new ExpressionNode(
            new BooleanLiteralNode(true, position),
            null,
            null,
            false,
            position
        );
        const consequent: Node[] = [
            new VariableDeclarationNode(
                new IdentifierNode("a", position),
                new NumberLiteralNode(1, position),
                position
            ),
            new VariableDeclarationNode(
                new IdentifierNode("b", position),
                new NumberLiteralNode(1, position),
                position
            ),
        ];
        const n = new IfStatementNode(
            condition,
            consequent,
            undefined,
            position
        );
        const stmt = n.accept(visitor);
        expect(stmt).toEqual("if(true){let a=1;let b=1}");
    });

    it("should create if statement with else", () => {
        const condition = new ExpressionNode(
            new BooleanLiteralNode(true, position),
            null,
            null,
            false,
            position
        );
        const consequent: Node[] = [
            new VariableDeclarationNode(
                new IdentifierNode("a", position),
                new NumberLiteralNode(1, position),
                position
            ),
            new VariableDeclarationNode(
                new IdentifierNode("b", position),
                new NumberLiteralNode(1, position),
                position
            ),
        ];
        const alternative: Node[] = [
            new VariableDeclarationNode(
                new IdentifierNode("a", position),
                new NumberLiteralNode(1, position),
                position
            ),
        ];
        const n = new IfStatementNode(
            condition,
            consequent,
            alternative,
            position
        );
        const stmt = n.accept(visitor);
        expect(stmt).toEqual("if(true){let a=1;let b=1}else{let a=1}");
    });
});
