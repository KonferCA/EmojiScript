import { describe, it, expect } from "vitest";
import { StringLiteralNode } from "@/lib/parser/nodes";
import { ASTVisitor } from "@/lib/parser/astVisitor";

describe("Test String Literal Node", () => {
    const visitor = new ASTVisitor();
    const fireEmoji = "🔥";

    it("should create a new number literal node", () => {
        const n = new StringLiteralNode(fireEmoji, { line: 0, column: 0 });
        expect(n.value).toEqual(fireEmoji);
        expect(n.position).toEqual({ line: 0, column: 0 });
        expect(n.accept).toBeTypeOf("function");
        expect(n.debug).toBeTypeOf("function");
    });

    it("should construct a string with literal string for javascript", () => {
        const n = new StringLiteralNode(fireEmoji, { line: 0, column: 0 });
        const s = n.accept(visitor);
        expect(s).toEqual(`"${fireEmoji}"`);
    });
});
