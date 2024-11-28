import { describe, it, expect } from "vitest";
import { NumberLiteralNode } from "@/lib/parser/nodes";
import { ASTVisitor } from "@/lib/parser/astVisitor";

describe("Test Number Literal Node", () => {
    const visitor = new ASTVisitor();

    it("should create a new number literal node", () => {
        const n = new NumberLiteralNode(0, { line: 0, column: 0 });
        expect(n.value).toEqual(0);
        expect(n.position).toEqual({ line: 0, column: 0 });
        expect(n.accept).toBeTypeOf("function");
        expect(n.debug).toBeTypeOf("function");
    });

    it("should construct a string with literal number for javascript", () => {
        const n = new NumberLiteralNode(0, { line: 0, column: 0 });
        const s = n.accept(visitor);
        expect(s).toEqual("0");
    });
});
