import {
    ArrayEmojis,
    BooleanEmojis,
    ControlFlowEmojis,
    IOEmojis,
    MathOperatorEmojis,
    NumberEmojis,
    ProgrammingEmojis,
    RelationalEmojis,
    StringEmojis,
} from "@/lib/emojiConstants";
import { IR } from "@/lib/ir/ir";
import { Lexer } from "@/lib/lexer/lexer";
import { Parser } from "@/lib/parser/parser";
import { describe, it, expect } from "vitest";

describe("Integration Test", () => {
    const parse = (input: string) => {
        const lexer = new Lexer(input);
        const parser = new Parser(lexer);
        const result = parser.parse();
        return result;
    };
    it("should output a runnable javascript code", () => {
        const input = [
            ProgrammingEmojis.VAR_DECLARATION,
            "🍿",
            ProgrammingEmojis.POINTER,
            ArrayEmojis.START,
            NumberEmojis.ONE,
            NumberEmojis.TWO,
            ProgrammingEmojis.COMMA,
            ArrayEmojis.START,
            StringEmojis.QUOTE,
            MathOperatorEmojis.ADD,
            StringEmojis.QUOTE,
            ProgrammingEmojis.COMMA,
            BooleanEmojis.FALSE,
            ArrayEmojis.END,
            ProgrammingEmojis.COMMA,
            BooleanEmojis.TRUE,
            ArrayEmojis.END,
            ProgrammingEmojis.FUNCTION_DEF,
            "😀",
            ProgrammingEmojis.POINTER,
            ControlFlowEmojis.IF,
            NumberEmojis.ONE,
            NumberEmojis.THREE,
            RelationalEmojis.GREATER_OR_EQUAL,
            "🍿",
            ControlFlowEmojis.IF_THEN,
            IOEmojis.PRINT,
            StringEmojis.QUOTE,
            BooleanEmojis.TRUE,
            StringEmojis.QUOTE,
            ControlFlowEmojis.ELSE,
            IOEmojis.PRINT,
            StringEmojis.QUOTE,
            BooleanEmojis.FALSE,
            StringEmojis.QUOTE,
            ControlFlowEmojis.STOP,
            ControlFlowEmojis.STOP,
            ProgrammingEmojis.FUNCTION_CALL_START,
            "😀",
            ProgrammingEmojis.POINTER,
            ProgrammingEmojis.FUNCTION_CALL_END,
        ].join(" ");
        const ast = parse(input);
        expect(ast.isValid).toBeTruthy();
        const ir = new IR(ast.program);
        const js = ir.build();
        expect(js).toEqual(
            `let a=[12,["➕",false],true];function b(){if(13>=a){window.alert("${BooleanEmojis.TRUE}")}else{window.alert("${BooleanEmojis.FALSE}")}};b()`
        );
    });
});
