import { describe, it, expect } from "vitest";
import {
    BooleanLiteralNode,
    ExpressionNode,
    IOOperationNode,
    LoopStatementNode,
    StringLiteralNode,
} from "@/lib/parser/nodes";
import { ASTVisitor } from "@/lib/parser/astVisitor";
import { IOEmojis } from "@/lib/emojiConstants";

describe("Test Boolean Literal Node", () => {
    const visitor = new ASTVisitor();
    const position = { line: 0, column: 0 };

    it("should create a new boolean literal node", () => {
        const n = new LoopStatementNode(
            new ExpressionNode(
                new BooleanLiteralNode(true, position),
                null,
                null,
                false,
                position
            ),
            [
                new IOOperationNode(
                    IOEmojis.PRINT,
                    new StringLiteralNode("here", position),
                    position
                ),
            ],
            position
        );
        expect(n.position).toEqual({ line: 0, column: 0 });
        expect(n.accept).toBeTypeOf("function");
        expect(n.debug).toBeTypeOf("function");
        expect(n.accept(visitor)).toEqual('while(true){window.alert("here")}');
    });
});
