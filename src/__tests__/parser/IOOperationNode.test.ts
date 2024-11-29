import { describe, it, expect } from "vitest";
import { IOOperationNode, NumberLiteralNode } from "@/lib/parser/nodes";
import { ASTVisitor } from "@/lib/parser/astVisitor";
import { IOEmojis } from "@/lib/emojiConstants";

describe("Test IO Operation Node", () => {
    const visitor = new ASTVisitor();

    it("should use window.alert for print io operation", () => {
        const n = new IOOperationNode(
            IOEmojis.PRINT,
            new NumberLiteralNode(1, { line: 0, column: 0 }),
            { line: 0, column: 0 }
        );
        expect(n.position).toEqual({ line: 0, column: 0 });
        expect(n.accept).toBeTypeOf("function");
        expect(n.debug).toBeTypeOf("function");
        expect(n.accept(visitor)).toEqual("window.alert(1)");
    });

    it("should fallback to console.log if window is undefined", () => {
        const { window } = global;
        // @ts-ignore
        delete global.window;
        const n = new IOOperationNode(
            IOEmojis.PRINT,
            new NumberLiteralNode(1, { line: 0, column: 0 }),
            { line: 0, column: 0 }
        );
        expect(n.position).toEqual({ line: 0, column: 0 });
        expect(n.accept).toBeTypeOf("function");
        expect(n.debug).toBeTypeOf("function");
        expect(n.accept(visitor)).toEqual("console.log(1)");
        global.window = window;
    });
});
