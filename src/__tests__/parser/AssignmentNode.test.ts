import { describe, it, expect } from "vitest";
import {
    AssignmentNode,
    IdentifierNode,
    NumberLiteralNode,
} from "@/lib/parser/nodes";
import { ASTVisitor } from "@/lib/parser/astVisitor";

describe("Test Assignment Node", () => {
    const visitor = new ASTVisitor();
    const position = { line: 0, column: 0 };

    it("should create an assignment expression", () => {
        const n = new AssignmentNode(
            new IdentifierNode("a", position),
            new NumberLiteralNode(1, position),
            position
        );
        expect(n.position).toEqual({ line: 0, column: 0 });
        expect(n.accept).toBeTypeOf("function");
        expect(n.debug).toBeTypeOf("function");
        expect(n.accept(visitor)).toEqual("a=1");
    });
});
