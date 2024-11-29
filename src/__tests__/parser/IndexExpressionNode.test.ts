import { describe, it, expect } from "vitest";
import {
    ArrayLiteralNode,
    IdentifierNode,
    IndexExpressionNode,
    NumberLiteralNode,
    StringLiteralNode,
} from "@/lib/parser/nodes";
import { ASTVisitor } from "@/lib/parser/astVisitor";

describe("Test Index Expression Node", () => {
    const visitor = new ASTVisitor();
    const position = { line: 0, column: 0 };

    it("should ouput an indexed variable array javascript string", () => {
        const n = new IndexExpressionNode(
            new IdentifierNode("arr", position),
            0,
            position
        );
        expect(n.position).toEqual({ line: 0, column: 0 });
        expect(n.accept).toBeTypeOf("function");
        expect(n.debug).toBeTypeOf("function");
        expect(n.accept(visitor)).toEqual("arr[0]");
    });

    it("should ouput an indexed inlined array javascript string", () => {
        const n = new IndexExpressionNode(
            new ArrayLiteralNode(
                [
                    new NumberLiteralNode(1, position),
                    new StringLiteralNode("hello", position),
                ],
                position
            ),
            1,
            position
        );
        expect(n.position).toEqual({ line: 0, column: 0 });
        expect(n.accept).toBeTypeOf("function");
        expect(n.debug).toBeTypeOf("function");
        expect(n.accept(visitor)).toEqual('[1,"hello"][1]');
    });
});
