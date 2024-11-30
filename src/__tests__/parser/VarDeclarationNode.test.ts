import { describe, it, expect, beforeEach } from "vitest";
import { ASTVisitor } from "@/lib/parser/astVisitor";
import {
    IdentifierNode,
    NumberLiteralNode,
    VariableDeclarationNode,
} from "@/lib/parser/nodes";

describe("Test Variable Declaration Node", () => {
    let visitor: ASTVisitor = new ASTVisitor();

    beforeEach(() => {
        visitor = new ASTVisitor();
    });

    const position = { line: 0, column: 0 };
    const ident = "a";
    const value = "1";

    it("should create a new variable declaration node", () => {
        const n = new VariableDeclarationNode(
            new IdentifierNode("a", position),
            new NumberLiteralNode(1, position),
            position
        );
        expect(n.name).toBeInstanceOf(IdentifierNode);
        expect(n.value).toBeInstanceOf(NumberLiteralNode);
        expect(n.position).toEqual(position);
        expect(n.accept).toBeTypeOf("function");
        expect(n.debug).toBeTypeOf("function");
    });

    it("should construct a string for var declaration for javascript", () => {
        const n = new VariableDeclarationNode(
            new IdentifierNode("a", position),
            new NumberLiteralNode(1, position),
            position
        );
        const varStr = n.accept(visitor);
        expect(varStr).toEqual(`let ${ident}=${value}`);
    });

    it("should throw an error when variable is redeclared", () => {
        const n = new VariableDeclarationNode(
            new IdentifierNode("a", position),
            new NumberLiteralNode(1, position),
            position
        );
        const varStr = n.accept(visitor);
        expect(varStr).toEqual(`let ${ident}=${value}`);
        const m = new VariableDeclarationNode(
            new IdentifierNode("a", position),
            new NumberLiteralNode(1, position),
            position
        );
        expect(() => m.accept(visitor)).toThrow();
    });
});
