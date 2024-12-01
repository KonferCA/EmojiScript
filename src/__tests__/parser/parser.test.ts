import { describe, it, expect } from "vitest";
import { Parser } from "../../lib/parser/parser";
import { Lexer } from "../../lib/lexer/lexer";
import {
    ProgramNode,
    NumberLiteralNode,
    StringLiteralNode,
    BooleanLiteralNode,
    VariableDeclarationNode,
    ExpressionNode,
    IOOperationNode,
    IdentifierNode,
    ArrayLiteralNode,
    FunctionDefinitionNode,
    FunctionCallNode,
    LoopStatementNode,
    IfStatementNode,
    IndexExpressionNode,
    AssignmentNode,
} from "../../lib/parser/nodes";
import {
    ArrayEmojis,
    BooleanEmojis,
    NumberEmojis,
    ProgrammingEmojis,
    StringEmojis,
} from "@/lib/emojiConstants";

describe("Parser", () => {
    const parse = (input: string) => {
        // console.log("Parsing input:", input);
        const lexer = new Lexer(input);
        const parser = new Parser(lexer);
        const result = parser.parse();
        // console.log("Parse result:", result);
        // console.log("Error:", result.error);
        return result;
    };

    describe("Parse Variable", () => {
        it("should define a variable", () => {
            const input = [
                ProgrammingEmojis.VAR_DECLARATION,
                "🍉",
                "🍉",
                "🍉",
                NumberEmojis.ONE,
            ].join(" ");
            const ast = parse(input);
            expect(ast.isValid).toBeTruthy();
            expect(ast.program.statements).toHaveLength(1);
            expect(ast.program.statements[0]).toBeInstanceOf(
                VariableDeclarationNode
            );
        });

        it("should define a variable with array as vallue", () => {
            const input = [
                ProgrammingEmojis.VAR_DECLARATION,
                "🍉",
                "🍉",
                "🍉",
                ArrayEmojis.START,
                StringEmojis.QUOTE,
                "🍉",
                "🍉",
                "🍉",
                StringEmojis.QUOTE,
                ArrayEmojis.END,
            ].join(" ");
            const ast = parse(input);
            expect(ast.isValid).toBeTruthy();
            expect(ast.program.statements).toHaveLength(1);
            expect(ast.program.statements[0]).toBeInstanceOf(
                VariableDeclarationNode
            );
            const v = ast.program.statements[0] as VariableDeclarationNode;
            expect(v.value).toBeInstanceOf(ArrayLiteralNode);
            const arr = v.value as ArrayLiteralNode;
            expect(arr.elements).toHaveLength(1);
            expect(arr.elements[0]).toBeInstanceOf(StringLiteralNode);
        });

        it("should return invalid ast if identifier not given", () => {
            const input = [
                ProgrammingEmojis.VAR_DECLARATION,
                NumberEmojis.ONE,
            ].join(" ");
            const ast = parse(input);
            expect(ast.isValid).toBeFalsy();
        });

        it("should return invalid ast if value not given", () => {
            const input = [
                ProgrammingEmojis.VAR_DECLARATION,
                "🍉",
                "🍉",
                "🍉",
            ].join(" ");
            const ast = parse(input);
            expect(ast.isValid).toBeFalsy();
        });
    });

    describe("Parse expressions", () => {
        it("should parse a number", () => {
            const input = [
                NumberEmojis.ONE,
                NumberEmojis.TWO,
                NumberEmojis.THREE,
            ].join(" ");
            const ast = parse(input);
            expect(ast.isValid).toBeTruthy();
            expect(ast.program.statements).toHaveLength(1);
            expect(ast.program.statements[0]).toBeInstanceOf(NumberLiteralNode);
            const n = ast.program.statements[0] as NumberLiteralNode;
            expect(n.value).toEqual(123);
        });

        it("should parse a string", () => {
            const input = [
                StringEmojis.QUOTE,
                NumberEmojis.ONE,
                NumberEmojis.TWO,
                NumberEmojis.THREE,
                StringEmojis.QUOTE,
            ].join(" ");
            const ast = parse(input);
            expect(ast.isValid).toBeTruthy();
            expect(ast.program.statements).toHaveLength(1);
            expect(ast.program.statements[0]).toBeInstanceOf(StringLiteralNode);
            const n = ast.program.statements[0] as StringLiteralNode;
            expect(n.value).toEqual(
                [NumberEmojis.ONE, NumberEmojis.TWO, NumberEmojis.THREE].join(
                    ""
                )
            );
        });

        it("should parse a boolean", () => {
            const input = [BooleanEmojis.TRUE].join(" ");
            const ast = parse(input);
            expect(ast.isValid).toBeTruthy();
            expect(ast.program.statements).toHaveLength(1);
            expect(ast.program.statements[0]).toBeInstanceOf(
                BooleanLiteralNode
            );
            const n = ast.program.statements[0] as BooleanLiteralNode;
            expect(n.value).toEqual(true);
        });

        it("should parse nested arrays", () => {
            const input = [
                ArrayEmojis.START,
                ArrayEmojis.START,
                StringEmojis.QUOTE,
                "🍉",
                StringEmojis.QUOTE,
                ArrayEmojis.END,
                ArrayEmojis.END,
            ].join(" ");
            const ast = parse(input);
            expect(ast.isValid).toBeTruthy();
            expect(ast.program.statements).toHaveLength(1);
            expect(ast.program.statements[0]).toBeInstanceOf(ArrayLiteralNode);
            const arr = ast.program.statements[0] as ArrayLiteralNode;
            expect(arr.elements).toHaveLength(1);
            expect(arr.elements[0]).toBeInstanceOf(ArrayLiteralNode);
        });

        it("should parse an array with arbitrary data types", () => {
            const input = [
                ArrayEmojis.START,
                NumberEmojis.ONE,
                ProgrammingEmojis.COMMA,
                StringEmojis.QUOTE,
                "🍉",
                StringEmojis.QUOTE,
                ProgrammingEmojis.COMMA,
                BooleanEmojis.TRUE,
                ProgrammingEmojis.COMMA,
                ArrayEmojis.START,
                StringEmojis.QUOTE,
                "🍉",
                StringEmojis.QUOTE,
                ArrayEmojis.END,
                ArrayEmojis.END,
            ].join(" ");
            const ast = parse(input);
            expect(ast.isValid).toBeTruthy();
            expect(ast.program.statements).toHaveLength(1);
            expect(ast.program.statements[0]).toBeInstanceOf(ArrayLiteralNode);
            const arr = ast.program.statements[0] as ArrayLiteralNode;
            expect(arr.elements).toHaveLength(4);
            arr.elements.forEach((el, idx) => {
                switch (idx) {
                    case 0:
                        expect(el).toBeInstanceOf(NumberLiteralNode);
                        break;
                    case 1:
                        expect(el).toBeInstanceOf(StringLiteralNode);
                        break;
                    case 2:
                        expect(el).toBeInstanceOf(BooleanLiteralNode);
                        break;
                    case 3:
                        expect(el).toBeInstanceOf(ArrayLiteralNode);
                        break;
                }
            });
        });
    });

    // Test program node structure
    // describe("Program Structure", () => {
    //     it("should create a valid program node", () => {
    //         const ast = parse("1️⃣");
    //         expect(ast.isValid).toBe(true);
    //         expect(ast.program).toBeInstanceOf(ProgramNode);
    //         expect(Array.isArray(ast.program.statements)).toBe(true);
    //         expect(ast.program.statements).toHaveLength(1);
    //     });
    //
    //     it("should handle empty programs", () => {
    //         const ast = parse("");
    //         expect(ast.isValid).toBe(true);
    //         expect(ast.program.statements).toHaveLength(0);
    //     });
    // });

    // describe("Basic Node Types", () => {
    //     it("should parse number literals", () => {
    //         const ast = parse("1️⃣");
    //         expect(ast.isValid).toBe(true);
    //         const node = ast.program.statements[0] as NumberLiteralNode;
    //         expect(node).toBeInstanceOf(NumberLiteralNode);
    //         expect(node.value).toBe(1);
    //     });
    //
    //     it("should parse string literals", () => {
    //         const ast = parse("📋 hello 📋");
    //         expect(ast.isValid).toBe(true);
    //         const node = ast.program.statements[0] as StringLiteralNode;
    //         expect(node).toBeInstanceOf(StringLiteralNode);
    //         expect(node.value).toBe("hello");
    //     });
    //
    //     it("should parse boolean literals", () => {
    //         const ast = parse("✅");
    //         expect(ast.isValid).toBe(true);
    //         const node = ast.program.statements[0] as BooleanLiteralNode;
    //         expect(node).toBeInstanceOf(BooleanLiteralNode);
    //         expect(node.value).toBe(true);
    //     });
    //
    //     it("should parse identifiers", () => {
    //         const ast = parse("👋"); // Just parse the identifier directly
    //         expect(ast.isValid).toBe(true);
    //         const node = ast.program.statements[0] as IdentifierNode;
    //         expect(node).toBeInstanceOf(IdentifierNode);
    //         expect(node.name).toBe("👋");
    //     });
    // });

    // describe("Array Operations", () => {
    //     it("should parse array literals", () => {
    //         const input = [
    //             ArrayEmojis.START,
    //             NumberEmojis.ONE,
    //             ProgrammingEmojis.COMMA,
    //             NumberEmojis.TWO,
    //             ArrayEmojis.END,
    //         ].join(" ");
    //         // console.log("Parsing array literal:", input);
    //         const ast = parse(input);
    //         // console.log("AST:", ast);
    //         expect(ast.isValid).toBe(true);
    //         expect(ast.program.statements[0]).toBeInstanceOf(ArrayLiteralNode);
    //         const node = ast.program.statements[0] as ArrayLiteralNode;
    //         expect(node.elements).toHaveLength(2);
    //     });
    //
    //     it("should parse array indexing", () => {
    //         const ast = parse(
    //             [
    //                 ArrayEmojis.START,
    //                 "👋",
    //                 ArrayEmojis.END,
    //                 ProgrammingEmojis.INDEXING,
    //                 NumberEmojis.ZERO,
    //             ].join(" ")
    //         );
    //         expect(ast.isValid).toBe(true);
    //         expect(ast.program.statements).toHaveLength(2);
    //         expect(ast.program.statements[0]).toBeInstanceOf(ArrayLiteralNode);
    //         expect(ast.program.statements[1]).toBeInstanceOf(
    //             IndexExpressionNode
    //         );
    //         // const node = ast.program.statements[0] as ArrayLiteralNode;
    //         // const node2 = ast.program.statements[1] as IndexExpressionNode;
    //         // expect(node.elements).toHaveLength(1);
    //         // expect(node.elements[0]).toBeInstanceOf(IdentifierNode);
    //         // expect(node2.index).toBe(0);
    //     });
    // });

    // describe("Functions", () => {
    //     it("should parse function definitions", () => {
    //         const ast = parse("📎 👋 👉 📢 1️⃣ ⏹️");
    //         expect(ast.isValid).toBe(true);
    //         const node = ast.program.statements[0] as FunctionDefinitionNode;
    //         expect(node.name.name).toBe("👋");
    //         expect(node.body).toHaveLength(1);
    //     });
    //
    //     it("should parse simple function calls", () => {
    //         const input = "🫑 👋 1️⃣ 🍴";
    //         // console.log("Parsing function call:", input);
    //         const ast = parse(input);
    //         // console.log("AST:", ast);
    //         expect(ast.isValid).toBe(true);
    //         const node = ast.program.statements[0] as FunctionCallNode;
    //         expect(node.name.name).toBe("👋");
    //         expect(node.parameters).toHaveLength(1);
    //     });
    //
    //     it("should parse function calls with multiple parameters", () => {
    //         const input = "🫑 👋 1️⃣ 🌚 2️⃣ 🍴";
    //         // console.log("Parsing multi-param function call:", input);
    //         const ast = parse(input);
    //         // console.log("AST:", ast);
    //         expect(ast.isValid).toBe(true);
    //         const node = ast.program.statements[0] as FunctionCallNode;
    //         expect(node.parameters).toHaveLength(2);
    //     });
    // });
    //
    // describe("Error Handling", () => {
    //     it("should handle invalid tokens", () => {
    //         const ast = parse("invalid_token");
    //         expect(ast.isValid).toBe(false);
    //         expect(ast.error).toBeDefined();
    //     });
    //
    //     it("should handle mismatched array brackets", () => {
    //         const ast = parse("📦 1️⃣ 2️⃣");
    //         expect(ast.isValid).toBe(false);
    //         expect(ast.error).toBeDefined();
    //     });
    //
    //     it("should handle mismatched function call delimiters", () => {
    //         const ast = parse("🫑 👋 1️⃣");
    //         expect(ast.isValid).toBe(false);
    //         expect(ast.error).toBeDefined();
    //     });
    // });
    //
    // describe("Literals", () => {
    //     it("should parse number literals", () => {
    //         const ast = parse("1️⃣");
    //         expect(ast.isValid).toBe(true);
    //         const node = ast.program.statements[0] as NumberLiteralNode;
    //         expect(node.value).toBe(1);
    //     });
    //
    //     it("should parse boolean literals", () => {
    //         const ast = parse("✅");
    //         expect(ast.isValid).toBe(true);
    //         const node = ast.program.statements[0] as BooleanLiteralNode;
    //         expect(node.value).toBe(true);
    //     });
    //
    //     it("should parse array literals", () => {
    //         const ast = parse("📦 1️⃣ 2️⃣ 3️⃣ 📦");
    //         expect(ast.isValid).toBe(true);
    //         const node = ast.program.statements[0] as ArrayLiteralNode;
    //         expect(node.elements).toHaveLength(3);
    //     });
    // });
    //
    // describe("Variable Operations", () => {
    //     it("should parse number variable declarations", () => {
    //         const ast = parse("🔢 👋 1️⃣");
    //         expect(ast.isValid).toBe(true);
    //         const node = ast.program.statements[0] as VariableDeclarationNode;
    //         expect(node.name.name).toBe("👋");
    //         expect((node.value as NumberLiteralNode).value).toBe(1);
    //     });
    //
    //     it("should parse array variable declarations", () => {
    //         const ast = parse("📦 👋 📦 1️⃣ 2️⃣ 📦");
    //         expect(ast.isValid).toBe(true);
    //         const node = ast.program.statements[0] as VariableDeclarationNode;
    //         expect(node.name.name).toBe("👋");
    //     });
    //
    //     it("should parse variable assignments", () => {
    //         const ast = parse("📥 👋 1️⃣");
    //         expect(ast.isValid).toBe(true);
    //         const node = ast.program.statements[0] as AssignmentNode;
    //         expect(node.identifier.name).toBe("👋");
    //         expect((node.value as NumberLiteralNode).value).toBe(1);
    //     });
    // });
    //
    // describe("Expressions", () => {
    //     it("should parse math expressions", () => {
    //         const ast = parse("1️⃣ ➕ 2️⃣");
    //         expect(ast.isValid).toBe(true);
    //         const node = ast.program.statements[0] as ExpressionNode;
    //         expect((node.left as NumberLiteralNode).value).toBe(1);
    //         expect(node.operator).toBe("➕");
    //         expect((node.right as NumberLiteralNode).value).toBe(2);
    //     });
    //
    //     it("should parse comparison expressions", () => {
    //         const ast = parse("1️⃣ 🎯 2️⃣");
    //         expect(ast.isValid).toBe(true);
    //         const node = ast.program.statements[0] as ExpressionNode;
    //         expect((node.left as NumberLiteralNode).value).toBe(1);
    //         expect(node.operator).toBe("🎯");
    //     });
    //
    //     it("should parse barrier expressions", () => {
    //         const ast = parse("🚧 1️⃣ ➕ 2️⃣ 🚧");
    //         expect(ast.isValid).toBe(true);
    //         const node = ast.program.statements[0] as ExpressionNode;
    //         expect(node.setParenthesis).toBe(true);
    //     });
    // });
    //
    // describe("Control Flow", () => {
    //     it("should parse if statements", () => {
    //         const ast = parse("🤔 1️⃣ 👉 📢 2️⃣ ⏹️");
    //         expect(ast.isValid).toBe(true);
    //         const node = ast.program.statements[0] as IfStatementNode;
    //         expect(node.consequent).toHaveLength(1);
    //         expect(node.alternative).toBeUndefined();
    //     });
    //
    //     it("should parse if-else statements", () => {
    //         const ast = parse("🤔 1️⃣ 👉 📢 2️⃣ 💭 📢 3️⃣ ⏹️");
    //         expect(ast.isValid).toBe(true);
    //         const node = ast.program.statements[0] as IfStatementNode;
    //         expect(node.consequent).toHaveLength(1);
    //         expect(node.alternative).toBeDefined();
    //         expect(node.alternative).toHaveLength(1);
    //     });
    //
    //     it("should parse loop statements", () => {
    //         const ast = parse("🔄 1️⃣ 👉 📢 2️⃣ ⏹️");
    //         expect(ast.isValid).toBe(true);
    //         const node = ast.program.statements[0] as LoopStatementNode;
    //         expect(node.body).toHaveLength(1);
    //     });
    // });
    //
    // describe("Functions", () => {
    //     it("should parse function definitions", () => {
    //         const ast = parse("📎 🎮 👤 👉 📢 👤 ⏹️");
    //         expect(ast.isValid).toBe(true);
    //         const node = ast.program.statements[0] as FunctionDefinitionNode;
    //         expect(node.name.name).toBe("🎮");
    //         expect(node.parameters).toHaveLength(1);
    //         expect(node.body).toHaveLength(1);
    //     });
    //
    //     it("should parse function calls", () => {
    //         const ast = parse("🫑 🎮 1️⃣ 🍴");
    //         expect(ast.isValid).toBe(true);
    //         const node = ast.program.statements[0] as FunctionCallNode;
    //         expect(node.name.name).toBe("🎮");
    //         expect(node.parameters).toHaveLength(1);
    //     });
    //
    //     it("should parse function calls with multiple parameters", () => {
    //         const ast = parse("🫑 🎮 1️⃣ 🌚 2️⃣ 🍴");
    //         expect(ast.isValid).toBe(true);
    //         const node = ast.program.statements[0] as FunctionCallNode;
    //         expect(node.parameters).toHaveLength(2);
    //     });
    // });
    //
    // describe("Array Operations", () => {
    //     it("should parse array indexing", () => {
    //         const ast = parse("📦 1️⃣ 2️⃣ 📦 🔎 0️⃣");
    //         expect(ast.isValid).toBe(true);
    //         const node = ast.program.statements[0] as IndexExpressionNode;
    //         expect(node.index).toBe(0);
    //     });
    // });
    //
    // describe("IO Operations", () => {
    //     it("should parse print statements", () => {
    //         const ast = parse("📢 1️⃣");
    //         expect(ast.isValid).toBe(true);
    //         const node = ast.program.statements[0] as IOOperationNode;
    //         expect(node.type).toBe("📢");
    //         expect((node.value as NumberLiteralNode).value).toBe(1);
    //     });
    // });
    //
    // describe("Complex Programs", () => {
    //     it("should parse multiple statements", () => {
    //         const input = `
    //             🔢 👋 1️⃣
    //             📢 👋
    //             🤔 👋 🎯 1️⃣ 👉
    //                 📢 2️⃣
    //             ⏹️
    //         `;
    //         const ast = parse(input);
    //         expect(ast.isValid).toBe(true);
    //         expect(ast.program.statements).toHaveLength(3);
    //     });
    //
    //     it("should parse nested control flow", () => {
    //         const input = `
    //             🤔 1️⃣ 👉
    //                 🤔 2️⃣ 👉
    //                     📢 3️⃣
    //                 ⏹️
    //             ⏹️
    //         `;
    //         const ast = parse(input);
    //         expect(ast.isValid).toBe(true);
    //         const ifNode = ast.program.statements[0] as IfStatementNode;
    //         expect(ifNode.consequent).toHaveLength(1);
    //     });
    // });
    //
    // describe("Error Handling", () => {
    //     it("should handle invalid tokens", () => {
    //         const ast = parse("❓");
    //         expect(ast.isValid).toBe(false);
    //         expect(ast.error).toBeDefined();
    //     });
    //
    //     it("should handle incomplete if statements", () => {
    //         const ast = parse("🤔 1️⃣ 👉");
    //         expect(ast.isValid).toBe(false);
    //         expect(ast.error).toBeDefined();
    //     });
    //
    //     it("should handle invalid function declarations", () => {
    //         const ast = parse("📎 👉");
    //         expect(ast.isValid).toBe(false);
    //         expect(ast.error).toBeDefined();
    //     });
    // });
});
