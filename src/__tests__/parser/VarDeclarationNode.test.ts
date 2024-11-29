import { describe, it, expect } from "vitest";
import { ASTVisitor } from "@/lib/parser/astVisitor";
import {
    IdentifierNode,
    NumberLiteralNode,
    VariableDeclarationNode,
} from "@/lib/parser/nodes";

describe("Test Variable Declaration Node", () => {
    const visitor = new ASTVisitor();
    const position = { line: 0, column: 0 };
    const ident = new IdentifierNode("a", position);
    const value = new NumberLiteralNode(0, position);

    it("should create a new variable declaration node", () => {
        const n = new VariableDeclarationNode(ident, value, position);
        expect(n.name).toBeInstanceOf(IdentifierNode);
        expect(n.value).toBeInstanceOf(NumberLiteralNode);
        expect(n.position).toEqual(position);
        expect(n.accept).toBeTypeOf("function");
        expect(n.debug).toBeTypeOf("function");
    });

    it("should construct a string for var declaration for javascript", () => {
        const n = new VariableDeclarationNode(ident, value, position);
        const identStr = ident.accept(visitor);
        const valueStr = value.accept(visitor);
        const varStr = n.accept(visitor);
        const expectedStr = `let ${identStr}=${valueStr}`;
        expect(varStr).toEqual(expectedStr);
    });
});
