// TODO: Get imported position when lexer is merged in
// import { Position } from '../lexer/idk yet';
// temp s:lution
type Position = {
    line: number;
    column: number;
};

import type {
    ControlFlowEmoji,
    IOEmoji,
    MathOperatorEmoji,
    RelationalEmoji,
} from "../emojiConstants";

export interface Node {
    accept<T>(visitor: NodeVisitor<T>): T;
}

export interface NodeVisitor<T> {
    visitProgram(node: ProgramNode): T;
    visitNumberLiteral(node: NumberLiteralNode): T;
    visitStringLiteral(node: StringLiteralNode): T;
    visitBooleanLiteral(node: BooleanLiteralNode): T;
    visitArrayLiteral(node: ArrayLiteralNode): T;
    visitVariableDeclaration(node: VariableDeclarationNode): T;
    visitIdentifier(node: IdentifierNode): T;
    visitMathOperation(node: MathOperationNode): T;
    visitComparisonOperation(node: ComparisonOperationNode): T;
    visitStackOperation(node: StackOperationNode): T;
    visitIfStatement(node: IfStatementNode): T;
    visitLoopStatement(node: LoopStatementNode): T;
    visitFunctionDefinition(node: FunctionDefinitionNode): T;
    visitIOOperation(node: IOOperationNode): T;
    visitIndexExpression(node: IndexExpressionNode): T;
    visitComparisonExpression(node: ComparisonExpressionNode): T;
}

export interface AST {
    isValid: boolean;
    error?: string;
    program: ProgramNode;
}

export interface ProgramNode extends Node {
    statements: Node[];
    position: Position;
}

export interface NumberLiteralNode extends Node {
    value: number;
    position: Position;
}

export interface StringLiteralNode extends Node {
    value: string;
    position: Position;
}

export interface BooleanLiteralNode extends Node {
    value: boolean;
    position: Position;
}

export interface ArrayLiteralNode extends Node {
    elements: Node[];
    position: Position;
}

export interface VariableDeclarationNode extends Node {
    name: IdentifierNode;
    value: Node;
    position: Position;
}

export interface IdentifierNode extends Node {
    name: string;
    position: Position;
}

export interface MathOperationNode extends Node {
    // TODO: Update to take variable
    operator: MathOperatorEmoji;
    position: Position;
}

export interface ComparisonOperationNode extends Node {
    // TODO: Update to take variable
    operator: RelationalEmoji;
    position: Position;
}

export interface StackOperationNode extends Node {
    // TODO: Update to take variable
    operator: ControlFlowEmoji;
    position: Position;
}

export interface IfStatementNode extends Node {
    condition: ComparisonExpressionNode;
    consequent: Node[];
    alternative?: Node[];
    position: Position;
}

export interface ComparisonExpressionNode extends Node {
    left: Node;
    operator: ComparisonOperationNode;
    right: Node;
    position: Position;
}

export interface LoopStatementNode extends Node {
    body: Node[];
    position: Position;
}

export interface FunctionDefinitionNode extends Node {
    body: Node[];
    position: Position;
}

export interface IOOperationNode extends Node {
    type: IOEmoji;
    position: Position;
}

export interface IndexExpressionNode extends Node {
    expression: Node;
    index: number;
    position: Position;
}

export enum ParserErrorType {
    UnexpectedToken = "UnexpectedToken",
    InvalidExpression = "InvalidExpression",
    MissingToken = "MissingToken",
    InvalidStatement = "InvalidStatement",
}

export class ParserError extends Error {
    constructor(
        public type: ParserErrorType,
        public message: string,
        public position: Position
    ) {
        super(message);
        this.name = "ParserError";
    }
}
