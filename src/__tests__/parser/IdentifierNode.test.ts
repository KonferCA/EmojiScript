import { describe, it, expect } from "vitest";
import { IdentifierNode } from "@/lib/parser/nodes";
import { ASTVisitor } from "@/lib/parser/astVisitor";

describe("Test Identifier Node", () => {
    const visitor = new ASTVisitor();
    const ident = "a";

    it("should create a new identifier node", () => {
        const n = new IdentifierNode(ident, { line: 0, column: 0 });
        expect(n.name).toEqual(ident);
        expect(n.position).toEqual({ line: 0, column: 0 });
        expect(n.accept).toBeTypeOf("function");
        expect(n.debug).toBeTypeOf("function");
    });

    it("should construct an identifier string for javascript", () => {
        const n = new IdentifierNode(ident, { line: 0, column: 0 });
        const s = n.accept(visitor);
        expect(s).toEqual(ident);
    });
});
