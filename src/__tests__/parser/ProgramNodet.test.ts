import { describe, it, expect } from "vitest";
import {
    ArrayLiteralNode,
    BooleanLiteralNode,
    NumberLiteralNode,
    ProgramNode,
    StringLiteralNode,
} from "@/lib/parser/nodes";
import { ASTVisitor } from "@/lib/parser/astVisitor";
import type { Node } from "@/lib/parser/types";

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
});
