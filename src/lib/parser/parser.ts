import { Lexer, TokenType, Lexeme } from "../lexer/lexer";
import {
    AST,
    ParserError,
    ParserErrorType,
    Node,
    ExpressionCompatibleNodes,
} from "./types";
import * as Nodes from "./nodes";
import {
    type MathOperatorEmoji,
    type RelationalEmoji,
    type IOEmoji,
} from "../emojiConstants";

export class Parser {
    private currentToken: Lexeme;

    constructor(private lexer: Lexer) {
        this.currentToken = this.lexer.next();
        console.log(this.currentToken);
    }

    // Helper methods
    private advance(): void {
        this.currentToken = this.lexer.next();
        console.log(this.currentToken);
    }

    private expect(type: TokenType): void {
        if (this.currentToken.type !== type) {
            throw new ParserError(
                ParserErrorType.UnexpectedToken,
                `Expected ${TokenType[type]}, got ${TokenType[this.currentToken.type]}`,
                this.currentToken.position
            );
        }
        this.advance();
    }

    public parse(): AST {
        try {
            const program = this.parseProgram();
            return {
                isValid: true,
                program,
            };
        } catch (error) {
            if (error instanceof ParserError) {
                return {
                    isValid: false,
                    error: error.message,
                    program: new Nodes.ProgramNode([], { line: 0, column: 0 }),
                };
            }
            throw error;
        }
    }

    private parseProgram(): Nodes.ProgramNode {
        const statements: Node[] = [];
        const position = this.currentToken.position;

        while (this.currentToken.type !== TokenType.EOF) {
            const statement = this.parseStatement();
            if (statement) {
                statements.push(statement);
            }
        }

        return new Nodes.ProgramNode(statements, position);
    }

    private parseStatement(): Node {
        switch (this.currentToken.type) {
            case TokenType.VariableDef:
                return this.parseVariableDeclaration();
            case TokenType.IfOp:
                return this.parseIfStatement();
            case TokenType.LoopOp:
                return this.parseLoopStatement();
            case TokenType.FuncDef:
                return this.parseFunctionDefinition();
            case TokenType.FuncCallStart:
                return this.parseFunctionCallStatement();
            case TokenType.Print:
                return this.parseIOStatement();
            case TokenType.AssignmentOp:
                return this.parseAssignment();
            default:
                return this.parseExpression();
        }
    }

    private parseExpression(): ExpressionCompatibleNodes {
        if (
            this.currentToken.type === TokenType.EOF ||
            this.currentToken.type === TokenType.Illegal
        ) {
            throw new ParserError(
                ParserErrorType.InvalidExpression,
                `Unexpected end of tokens.`,
                this.currentToken.position
            );
        }

        let parenthesis = this.currentToken.type === TokenType.BarrierOp;
        if (parenthesis) {
            // consume parenthesis
            this.advance();
        }

        let left: ExpressionCompatibleNodes;
        switch (this.currentToken.type) {
            case TokenType.Number:
            case TokenType.String:
            case TokenType.Boolean:
            case TokenType.ArrayStart:
            case TokenType.Emojis:
                left = this.parsePrimary();
                break;
            case TokenType.FuncCallStart:
                return this.parseFunctionCallStatement();
            case TokenType.IndexingOp:
                return this.parseIndexExpression();
            default:
                left = this.parseExpression();
        }

        while (
            this.isMathOperator(this.currentToken.type) ||
            this.isComparisonOperator(this.currentToken.type)
        ) {
            const operator = this.currentToken.literal as
                | MathOperatorEmoji
                | RelationalEmoji;
            const operatorPos = this.currentToken.position;
            this.advance();

            let right: ExpressionCompatibleNodes;
            switch (this.currentToken.type) {
                case TokenType.Number:
                case TokenType.String:
                case TokenType.Boolean:
                case TokenType.ArrayStart:
                    right = this.parsePrimary();
                    break;
                default:
                    right = this.parseExpression();
            }

            left = new Nodes.ExpressionNode(
                left,
                operator,
                right,
                parenthesis,
                operatorPos
            );
        }
        if (parenthesis) {
            // consume parenthesis
            this.expect(TokenType.BarrierOp);
        }

        return left;
    }

    private parsePrimary(): ExpressionCompatibleNodes {
        const token = this.currentToken;
        this.advance();
        switch (token.type) {
            case TokenType.Number:
                // consume all number tokens
                let n: number = token.literal as number;
                while (this.currentToken.type === TokenType.Number) {
                    n = n * 10;
                    n = n + (this.currentToken.literal as number);
                    this.advance();
                }
                return new Nodes.NumberLiteralNode(n, token.position);
            case TokenType.String:
                return new Nodes.StringLiteralNode(
                    token.literal as string,
                    token.position
                );
            case TokenType.Boolean:
                return new Nodes.BooleanLiteralNode(
                    token.literal as boolean,
                    token.position
                );
            case TokenType.ArrayStart:
                return this.parseArrayLiteral();
            case TokenType.Emojis:
                // Handle identifiers and function calls
                const identifier = new Nodes.IdentifierNode(
                    token.literal as string,
                    token.position
                );
                return identifier;
            default:
                throw new ParserError(
                    ParserErrorType.InvalidExpression,
                    `Unexpected token: ${TokenType[token.type]}`,
                    token.position
                );
        }
    }

    private parseArrayLiteral(): Nodes.ArrayLiteralNode {
        const position = this.currentToken.position;

        const elements: ExpressionCompatibleNodes[] = [];
        while (
            this.currentToken.type !== TokenType.ArrayEnd &&
            this.currentToken.type !== TokenType.EOF
        ) {
            // recursively parse nested arrays
            if (this.currentToken.type === TokenType.ArrayStart) {
                elements.push(this.parsePrimary());
            } else if (this.currentToken.type !== TokenType.CommaOp) {
                elements.push(this.parseExpression());
            } else {
                // consume comma
                this.advance();
            }
        }

        this.expect(TokenType.ArrayEnd);
        return new Nodes.ArrayLiteralNode(elements, position);
    }

    // private parseIdentifierOrFunctionCall(token: Lexeme): ExpressionCompatibleNodes {
    //     const identifier = new Nodes.IdentifierNode(
    //         token.literal as string,
    //         token.position
    //     );

    //     if (this.currentToken.type === TokenType.FuncCallStart) {
    //         return this.parseFunctionCall(identifier);
    //     }

    //     if (this.currentToken.type === TokenType.IndexingOp) {
    //         return this.parseIndexExpression(identifier);
    //     }

    //     return identifier;
    // }

    private parseFunctionDefinition(): Nodes.FunctionDefinitionNode {
        const position = this.currentToken.position;
        this.advance(); // consume FuncDef token (📎)

        // Parse function name
        if (this.currentToken.type !== TokenType.Emojis) {
            throw new ParserError(
                ParserErrorType.UnexpectedToken,
                "Expected function name",
                this.currentToken.position
            );
        }
        const name = this.parseIdentifier();

        // Parse parameters until we see the Then operator (👉)
        const parameters: Nodes.IdentifierNode[] = [];
        while (this.currentToken.type === TokenType.Emojis) {
            parameters.push(this.parseIdentifier());
        }

        // Expect Then operator after parameters
        if (this.currentToken.type !== TokenType.ThenOp) {
            throw new ParserError(
                ParserErrorType.UnexpectedToken,
                "Expected 👉 after function parameters",
                this.currentToken.position
            );
        }
        this.expect(TokenType.ThenOp);

        // Parse function body
        const body: Node[] = [];
        while (
            this.currentToken.type !== TokenType.StopOp &&
            this.currentToken.type !== TokenType.EOF
        ) {
            body.push(this.parseStatement());
        }

        // Expect Stop operator at end of function
        if (this.currentToken.type !== TokenType.StopOp) {
            throw new ParserError(
                ParserErrorType.UnexpectedToken,
                "Expected ⏹️ at end of function",
                this.currentToken.position
            );
        }
        this.expect(TokenType.StopOp);

        return new Nodes.FunctionDefinitionNode(
            name,
            parameters,
            body,
            position
        );
    }

    private parseFunctionCall(
        name: Nodes.IdentifierNode
    ): Nodes.FunctionCallNode {
        // console.log("Parsing function call");
        const position = this.currentToken.position;
        this.advance(); // consume 🫑

        const parameters: ExpressionCompatibleNodes[] = [];

        // Parse parameters until we hit 🍴
        while (
            this.currentToken.type !== TokenType.FuncCallEnd &&
            this.currentToken.type !== TokenType.EOF
        ) {
            // console.log("Parsing parameter, current token:", this.currentToken);
            parameters.push(this.parseExpression());

            if (this.currentToken.type === TokenType.CommaOp) {
                this.advance(); // consume 🌚
            }
        }

        if (this.currentToken.type !== TokenType.FuncCallEnd) {
            throw new ParserError(
                ParserErrorType.UnexpectedToken,
                "Expected 🍴",
                this.currentToken.position
            );
        }

        this.advance(); // consume 🍴
        return new Nodes.FunctionCallNode(name, parameters, position);
    }

    private parseFunctionCallStatement(): Nodes.FunctionCallNode {
        const position = this.currentToken.position;
        this.advance(); // consume 🫑

        const identifier = this.parseIdentifier();

        const parameters: ExpressionCompatibleNodes[] = [];
        this.expect(TokenType.ThenOp);
        while (
            this.currentToken.type !== TokenType.FuncCallEnd &&
            this.currentToken.type !== TokenType.EOF
        ) {
            parameters.push(this.parseExpression());

            if (this.currentToken.type === TokenType.CommaOp) {
                this.advance();
            }
        }

        this.expect(TokenType.FuncCallEnd);
        return new Nodes.FunctionCallNode(identifier, parameters, position);
    }

    private parseIndexExpression(): Nodes.IndexExpressionNode {
        const position = this.currentToken.position;
        this.advance(); // consume 🔎

        if (this.currentToken.type !== TokenType.Number) {
            throw new ParserError(
                ParserErrorType.InvalidExpression,
                "Expected number for array index",
                this.currentToken.position
            );
        }

        let index: number = this.currentToken.literal as number;
        // advance until there are no more numbers
        while (this.lexer.peek().type === TokenType.Number) {
            this.advance();
            index = index * 10;
            index += this.currentToken.literal as number;
        }

        this.advance(); // consumes the index
        return new Nodes.IndexExpressionNode(index, position);
    }

    private parseVariableDeclaration(): Nodes.VariableDeclarationNode {
        const position = this.currentToken.position;
        this.advance(); // consume type token

        if (this.currentToken.type !== TokenType.Emojis) {
            throw new ParserError(
                ParserErrorType.UnexpectedToken,
                "Expected identifier after type declaration",
                this.currentToken.position
            );
        }

        const ident = this.parseIdentifier();

        this.expect(TokenType.ThenOp);

        const value = this.parseExpression();
        return new Nodes.VariableDeclarationNode(ident, value, position);
    }

    private parseAssignment(): Nodes.AssignmentNode {
        const position = this.currentToken.position;
        this.advance(); // consume assignment operator

        const identifier = this.parseIdentifier();

        this.expect(TokenType.ThenOp);

        const value = this.parseExpression();

        return new Nodes.AssignmentNode(identifier, value, position);
    }

    private parseIfStatement(): Nodes.IfStatementNode {
        const position = this.currentToken.position;
        this.advance(); // consume if operator (🤔)

        // Wrap the condition in an ExpressionNode if it's not already one
        const conditionExpr = this.parseExpression();
        const condition =
            conditionExpr instanceof Nodes.ExpressionNode
                ? conditionExpr
                : new Nodes.ExpressionNode(
                      conditionExpr,
                      null,
                      null,
                      false,
                      conditionExpr.position
                  );

        this.expect(TokenType.ThenOp);

        const consequent: Node[] = [];
        while (
            ![TokenType.ThinkOp, TokenType.StopOp, TokenType.EOF].includes(
                this.currentToken.type as number
            )
        ) {
            consequent.push(this.parseStatement());
        }

        let alternative: Node[] | undefined;
        if ((this.currentToken.type as number) === TokenType.ThinkOp) {
            this.advance();
            alternative = [];
            while (
                ![TokenType.StopOp, TokenType.EOF].includes(
                    this.currentToken.type as number
                )
            ) {
                alternative.push(this.parseStatement());
            }
        }

        if ((this.currentToken.type as number) !== TokenType.StopOp) {
            throw new ParserError(
                ParserErrorType.UnexpectedToken,
                "Expected ⏹️ at end of if statement",
                this.currentToken.position
            );
        }
        this.expect(TokenType.StopOp);

        return new Nodes.IfStatementNode(
            condition,
            consequent,
            alternative,
            position
        );
    }

    private parseLoopStatement(): Nodes.LoopStatementNode {
        const position = this.currentToken.position;
        this.advance(); // consume loop operator

        const condition = this.parseExpression() as Nodes.ExpressionNode;
        this.expect(TokenType.ThenOp);

        const body: Node[] = [];
        while (this.currentToken.type !== TokenType.StopOp) {
            body.push(this.parseStatement());
        }

        this.expect(TokenType.StopOp);
        return new Nodes.LoopStatementNode(condition, body, position);
    }

    private parseIOStatement(): Nodes.IOOperationNode {
        const position = this.currentToken.position;
        const type = this.currentToken.literal as IOEmoji;
        this.advance();

        const value = this.parseExpression();
        return new Nodes.IOOperationNode(type, value, position);
    }

    private parseIdentifier(): Nodes.IdentifierNode {
        if (this.currentToken.type !== TokenType.Emojis) {
            throw new ParserError(
                ParserErrorType.UnexpectedToken,
                "Expected identifier",
                this.currentToken.position
            );
        }

        const name: string[] = [this.currentToken.literal as string];
        this.advance();
        while (this.currentToken.type === TokenType.Emojis) {
            name.push(this.currentToken.literal as string);
            this.advance();
        }

        const identifier = new Nodes.IdentifierNode(
            name.join(""),
            this.currentToken.position
        );

        return identifier;
    }

    private isMathOperator(type: TokenType): boolean {
        return (
            type === TokenType.AdditionOp ||
            type === TokenType.SubtractionOp ||
            type === TokenType.MultiplicationOp ||
            type === TokenType.DivisionOp
        );
    }

    private isComparisonOperator(type: TokenType): boolean {
        return (
            type === TokenType.EqualOp ||
            type === TokenType.GreaterOp ||
            type === TokenType.LesserOp ||
            type === TokenType.NotOp ||
            type === TokenType.IncreaseOp ||
            type === TokenType.DecreaseOp ||
            type === TokenType.NotEqualOp
        );
    }
}
