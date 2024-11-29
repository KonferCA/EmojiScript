import { describe, it, expect } from "vitest";
import { ASTVisitor } from "@/lib/parser/astVisitor";
import {
    ArrayLiteralNode,
    BooleanLiteralNode,
    NumberLiteralNode,
    StringLiteralNode,
} from "@/lib/parser/nodes";
import type { Node } from "@/lib/parser/types";

describe("Test Array Literal Node", () => {
    const visitor = new ASTVisitor();
    const nodes: Node[] = [
        new NumberLiteralNode(0, { line: 0, column: 0 }),
        new StringLiteralNode("🔥", { line: 0, column: 0 }),
        new BooleanLiteralNode(true, { line: 0, column: 0 }),
    ];

    it("should create a new array literal node", () => {
        const n = new ArrayLiteralNode(nodes, { line: 0, column: 0 });
        expect(n.elements).toHaveLength(nodes.length);
        expect(n.elements).toBe(nodes);
        expect(n.position).toEqual({ line: 0, column: 0 });
        expect(n.accept).toBeTypeOf("function");
        expect(n.debug).toBeTypeOf("function");
    });

    it("should construct a string with literal array for javascript", () => {
        const n = new ArrayLiteralNode(nodes, { line: 0, column: 0 });
        const s = n.accept(visitor);
        // get the string from all the nodes
        const strs: string[] = [];
        nodes.forEach((n) => {
            strs.push(n.accept(visitor));
        });
        const expectedArrayStr = "[" + strs.join(",") + "]";
        expect(s).toEqual(expectedArrayStr);
    });
});
