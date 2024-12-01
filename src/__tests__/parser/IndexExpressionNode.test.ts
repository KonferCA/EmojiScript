import { describe, it, expect } from "vitest";
import { IndexExpressionNode } from "@/lib/parser/nodes";
import { ASTVisitor } from "@/lib/parser/astVisitor";

describe("Test Index Expression Node", () => {
    const visitor = new ASTVisitor();
    const position = { line: 0, column: 0 };

    it("should output brackets for indexing", () => {
        const n = new IndexExpressionNode(0, position);
        expect(n.position).toEqual({ line: 0, column: 0 });
        expect(n.accept).toBeTypeOf("function");
        expect(n.debug).toBeTypeOf("function");
        expect(n.accept(visitor)).toEqual("[0]");
    });
});
