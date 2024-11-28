import { describe, it, expect } from "vitest";
import { BooleanLiteralNode } from "@/lib/parser/nodes";
import { ASTVisitor } from "@/lib/parser/astVisitor";

describe("Test Boolean Literal Node", () => {
    const visitor = new ASTVisitor();
    const b = true;

    it("should create a new boolean literal node", () => {
        const n = new BooleanLiteralNode(b, { line: 0, column: 0 });
        expect(n.value).toEqual(b);
        expect(n.position).toEqual({ line: 0, column: 0 });
        expect(n.accept).toBeTypeOf("function");
        expect(n.debug).toBeTypeOf("function");
    });

    it("should construct a string with literal boolean for javascript", () => {
        const n = new BooleanLiteralNode(b, { line: 0, column: 0 });
        const s = n.accept(visitor);
        expect(s).toEqual(`${b}`);
    });
});
