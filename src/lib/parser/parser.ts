import { Lexer, TokenType, Position, Lexeme } from "../lexer/lexer";
import { AST, ParserError, ParserErrorType, Node, ExpressionCompatibleNodes, IndexableNodes } from "./types";
import * as Nodes from "./nodes";
import { 
    MathOperatorEmojis, 
    RelationalEmojis,
    IOEmojis,
    type MathOperatorEmoji,
    type RelationalEmoji,
    type IOEmoji 
} from "../emojiConstants";

export class Parser {
    private currentToken: Lexeme;

    constructor(private lexer: Lexer) {
        this.currentToken = this.lexer.next();
    }

    // Helper methods
    private advance(): void {
        this.currentToken = this.lexer.next();
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
                program
            };
        } catch (error) {
            if (error instanceof ParserError) {
                return {
                    isValid: false,
                    error: error.message,
                    program: new Nodes.ProgramNode([], { line: 0, column: 0 })
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
            case TokenType.NumberType:
            case TokenType.StringType:
            case TokenType.BooleanType:
                return this.parseVariableDeclaration();
            case TokenType.ArrayType:
                // Check if next token is an identifier (for var declaration) or expression (for array literal)
                const nextToken = this.lexer.peek();
                if (nextToken.type === TokenType.Emojis) {
                    return this.parseVariableDeclaration();
                } else {
                    return this.parseArrayLiteral();
                }
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
        if (this.currentToken.type === TokenType.BarrierOp) {
            return this.parseBarrierExpression();
        }

        let left = this.parsePrimary();

        while (this.isMathOperator(this.currentToken.type) || 
               this.isComparisonOperator(this.currentToken.type)) {
            const operator = this.currentToken.literal as MathOperatorEmoji | RelationalEmoji;
            const operatorPos = this.currentToken.position;
            this.advance();

            const right = this.parsePrimary();

            left = new Nodes.ExpressionNode(
                left,
                operator,
                right,
                false,
                operatorPos
            );
        }

        return left;
    }

    private parseBarrierExpression(): ExpressionCompatibleNodes {
        const position = this.currentToken.position;
        this.advance(); // consume opening barrier

        const expr = this.parseExpression();

        this.expect(TokenType.BarrierOp);

        return new Nodes.ExpressionNode(
            expr,
            null,
            null,
            true,
            position
        );
    }

    private parsePrimary(): ExpressionCompatibleNodes {
        const token = this.currentToken;
        this.advance();
        switch (token.type) {
            case TokenType.Number:
                return new Nodes.NumberLiteralNode(
                    token.literal as number,
                    token.position
                );
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
            case TokenType.ArrayType:
                return this.parseArrayLiteral();
            case TokenType.Emojis:
                // Handle identifiers and function calls
                const identifier = new Nodes.IdentifierNode(
                    token.literal as string,
                    token.position
                );
                // Check for indexing operation
                if (this.currentToken.type === TokenType.IndexingOp) {
                    return this.parseIndexExpression(identifier);
                }
                // Check for function call
                if (this.currentToken.type === TokenType.FuncCallStart) {
                    return this.parseFunctionCall(identifier);
                }
                return identifier;
            case TokenType.ArrayType:
                return this.parseArrayLiteral();
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
        this.advance(); // consume first 📦
        
        const elements: ExpressionCompatibleNodes[] = [];
        while (this.currentToken.type !== TokenType.ArrayType && 
               this.currentToken.type !== TokenType.EOF) {
            elements.push(this.parseExpression());
        }
        
        this.expect(TokenType.ArrayType);
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
                'Expected function name',
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
                'Expected 👉 after function parameters',
                this.currentToken.position
            );
        }
        this.expect(TokenType.ThenOp);
    
        // Parse function body
        const body: Node[] = [];
        while (this.currentToken.type !== TokenType.StopOp && 
               this.currentToken.type !== TokenType.EOF) {
            body.push(this.parseStatement());
        }
    
        // Expect Stop operator at end of function
        if (this.currentToken.type !== TokenType.StopOp) {
            throw new ParserError(
                ParserErrorType.UnexpectedToken,
                'Expected ⏹️ at end of function',
                this.currentToken.position
            );
        }
        this.expect(TokenType.StopOp);
    
        return new Nodes.FunctionDefinitionNode(name, parameters, body, position);
    }

    private parseFunctionCall(name: Nodes.IdentifierNode): Nodes.FunctionCallNode {
        console.log('Parsing function call');
        const position = this.currentToken.position;
        this.advance(); // consume 🫑
    
        const parameters: ExpressionCompatibleNodes[] = [];
        
        // Parse parameters until we hit 🍴
        while (this.currentToken.type !== TokenType.FuncCallEnd && 
               this.currentToken.type !== TokenType.EOF) {
            console.log('Parsing parameter, current token:', this.currentToken);
            parameters.push(this.parseExpression());
            
            if (this.currentToken.type === TokenType.CommaOp) {
                this.advance(); // consume 🌚
            }
        }
    
        if (this.currentToken.type !== TokenType.FuncCallEnd) {
            throw new ParserError(
                ParserErrorType.UnexpectedToken,
                'Expected 🍴',
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
        while (this.currentToken.type !== TokenType.FuncCallEnd && 
               this.currentToken.type !== TokenType.EOF) {
            parameters.push(this.parseExpression());
            
            if (this.currentToken.type === TokenType.CommaOp) {
                this.advance();
            }
        }
    
        this.expect(TokenType.FuncCallEnd);
        return new Nodes.FunctionCallNode(identifier, parameters, position);
    }

    private parseIndexExpression(indexable: IndexableNodes): Nodes.IndexExpressionNode {
        const position = this.currentToken.position;
        this.advance(); // consume 🔎
    
        if (this.currentToken.type !== TokenType.Number) {
            throw new ParserError(
                ParserErrorType.InvalidExpression,
                'Expected number for array index',
                this.currentToken.position
            );
        }
    
        const index = this.currentToken.literal as number;
        this.advance();
        return new Nodes.IndexExpressionNode(indexable, index, position);
    }

    private parseVariableDeclaration(): Nodes.VariableDeclarationNode {
        const position = this.currentToken.position;
        this.advance(); // consume type token

        if (this.currentToken.type !== TokenType.Emojis) {
            throw new ParserError(
                ParserErrorType.UnexpectedToken,
                'Expected identifier after type declaration',
                this.currentToken.position
            );
        }

        const name = new Nodes.IdentifierNode(
            this.currentToken.literal as string,
            this.currentToken.position
        );
        this.advance();

        const value = this.parseExpression();
        return new Nodes.VariableDeclarationNode(name, value, position);
    }

    private parseAssignment(): Nodes.AssignmentNode {
        const position = this.currentToken.position;
        this.advance(); // consume assignment operator

        const identifier = this.parseIdentifier();
        const value = this.parseExpression();

        return new Nodes.AssignmentNode(identifier, value, position);
    }

    private parseIfStatement(): Nodes.IfStatementNode {
        const position = this.currentToken.position;
        this.advance(); // consume if operator (🤔)
    
        // Wrap the condition in an ExpressionNode if it's not already one
        const conditionExpr = this.parseExpression();
        const condition = (conditionExpr instanceof Nodes.ExpressionNode) 
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
        while (![TokenType.ThinkOp, TokenType.StopOp, TokenType.EOF].includes(this.currentToken.type as number)) {
            consequent.push(this.parseStatement());
        }
    
        let alternative: Node[] | undefined;
        if (this.currentToken.type as number === TokenType.ThinkOp) {
            this.advance();
            alternative = [];
            while (![TokenType.StopOp, TokenType.EOF].includes(this.currentToken.type as number)) {
                alternative.push(this.parseStatement());
            }
        }
    
        if ((this.currentToken.type as number) !== TokenType.StopOp) {
            throw new ParserError(
                ParserErrorType.UnexpectedToken,
                'Expected ⏹️ at end of if statement',
                this.currentToken.position
            );
        }
        this.expect(TokenType.StopOp);
    
        return new Nodes.IfStatementNode(condition, consequent, alternative, position);
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
                'Expected identifier',
                this.currentToken.position
            );
        }

        const identifier = new Nodes.IdentifierNode(
            this.currentToken.literal as string,
            this.currentToken.position
        );
        this.advance();
        return identifier;
    }

    private isMathOperator(type: TokenType): boolean {
        return type === TokenType.AdditionOp ||
               type === TokenType.SubtractionOp ||
               type === TokenType.MultiplicationOp ||
               type === TokenType.DivisionOp;
    }

    private isComparisonOperator(type: TokenType): boolean {
        return type === TokenType.EqualOp ||
               type === TokenType.GreaterOp ||
               type === TokenType.LesserOp ||
               type === TokenType.NotOp ||
               type === TokenType.IncreaseOp ||
               type === TokenType.DecreaseOp ||
               type === TokenType.NotEqualOp;
    }
}