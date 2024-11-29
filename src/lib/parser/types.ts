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
    accept(visitor: NodeVisitor): string;
    debug(visitor: NodeVisitor): string;
}

export interface NodeVisitor {
    visitProgram(node: ProgramNode): string;
    visitNumberLiteral(node: NumberLiteralNode): string;
    visitStringLiteral(node: StringLiteralNode): string;
    visitBooleanLiteral(node: BooleanLiteralNode): string;
    visitArrayLiteral(node: ArrayLiteralNode): string;
    visitVariableDeclaration(node: VariableDeclarationNode): string;
    visitIdentifier(node: IdentifierNode): string;
    visitMathOperation(node: MathOperationNode): string;
    visitComparisonOperation(node: ComparisonOperationNode): string;
    visitStackOperation(node: StackOperationNode): string;
    visitIfStatement(node: IfStatementNode): string;
    visitLoopStatement(node: LoopStatementNode): string;
    visitFunctionDefinition(node: FunctionDefinitionNode): string;
    visitIOOperation(node: IOOperationNode): string;
    visitIndexExpression(node: IndexExpressionNode): string;
    visitExpression(node: ExpressionNode): string;

    // DEBUGGING
    debugProgram(node: ProgramNode): string;
    debugNumberLiteral(node: NumberLiteralNode): string;
    debugStringLiteral(node: StringLiteralNode): string;
    debugBooleanLiteral(node: BooleanLiteralNode): string;
    debugArrayLiteral(node: ArrayLiteralNode): string;
    debugVariableDeclaration(node: VariableDeclarationNode): string;
    debugIdentifier(node: IdentifierNode): string;
    debugMathOperation(node: MathOperationNode): string;
    debugComparisonOperation(node: ComparisonOperationNode): string;
    debugStackOperation(node: StackOperationNode): string;
    debugIfStatement(node: IfStatementNode): string;
    debugLoopStatement(node: LoopStatementNode): string;
    debugFunctionDefinition(node: FunctionDefinitionNode): string;
    debugIOOperation(node: IOOperationNode): string;
    debugIndexExpression(node: IndexExpressionNode): string;
    debugExpression(node: ExpressionNode): string;
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
    condition: ExpressionNode;
    consequent: Node[];
    alternative?: Node[];
    position: Position;
}

export interface ExpressionNode extends Node {
    left: Node;
    operator: RelationalEmoji | MathOperatorEmoji | null;
    right: Node | null;
    setParenthesis: boolean;
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
