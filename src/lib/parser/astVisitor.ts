import { NodeVisitor } from "./types";
import * as Nodes from "./nodes";

export class ASTVisitor implements NodeVisitor {
    private indent: number = 0;

    constructor() {}

    private getIndentation(): string {
        return "  ".repeat(this.indent);
    }

    visitProgram(node: Nodes.ProgramNode): string {
        return "";
    }

    visitNumberLiteral(node: Nodes.NumberLiteralNode): string {
        return "";
    }

    visitStringLiteral(node: Nodes.StringLiteralNode): string {
        return "";
    }

    visitBooleanLiteral(node: Nodes.BooleanLiteralNode): string {
        return "";
    }

    visitArrayLiteral(node: Nodes.ArrayLiteralNode): string {
        return "";
    }

    visitVariableDeclaration(node: Nodes.VariableDeclarationNode): string {
        return "";
    }

    visitIdentifier(node: Nodes.IdentifierNode): string {
        return "";
    }

    visitMathOperation(node: Nodes.MathOperationNode): string {
        return "";
    }

    visitComparisonOperation(node: Nodes.ComparisonOperationNode): string {
        return "";
    }

    visitStackOperation(node: Nodes.StackOperationNode): string {
        return "";
    }

    visitIfStatement(node: Nodes.IfStatementNode): string {
        return "";
    }

    visitComparisonExpression(node: Nodes.ComparisonExpressionNode): string {
        return "";
    }

    visitLoopStatement(node: Nodes.LoopStatementNode): string {
        return "";
    }

    visitFunctionDefinition(node: Nodes.FunctionDefinitionNode): string {
        return "";
    }

    visitIOOperation(node: Nodes.IOOperationNode): string {
        return "";
    }

    visitIndexExpression(node: Nodes.IndexExpressionNode): string {
        return "";
    }

    debugProgram(node: Nodes.ProgramNode): string {
        this.indent++;
        const statements = node.statements
            .map((stmt) => stmt.debug(this), this.indent)
            .join("\n");
        this.indent--;
        return `Program:\n${statements}`;
    }

    debugNumberLiteral(node: Nodes.NumberLiteralNode): string {
        return `${this.getIndentation()}NumberLiteral: ${node.value}`;
    }

    debugStringLiteral(node: Nodes.StringLiteralNode): string {
        return `${this.getIndentation()}StringLiteral: "${node.value}"`;
    }

    debugBooleanLiteral(node: Nodes.BooleanLiteralNode): string {
        return `${this.getIndentation()}BooleanLiteral: ${node.value}`;
    }

    debugArrayLiteral(node: Nodes.ArrayLiteralNode): string {
        this.indent++;
        const elements = node.elements
            .map((elem) => elem.accept(this))
            .join("\n");
        this.indent--;
        return `${this.getIndentation()}ArrayLiteral:\n${elements}`;
    }

    debugVariableDeclaration(node: Nodes.VariableDeclarationNode): string {
        this.indent++;
        const name = node.name.accept(this);
        const value = node.value.accept(this);
        this.indent--;
        return `${this.getIndentation()}VariableDeclaration:\n${name}\n${value}`;
    }

    debugIdentifier(node: Nodes.IdentifierNode): string {
        return `${this.getIndentation()}Identifier: ${node.name}`;
    }

    debugMathOperation(node: Nodes.MathOperationNode): string {
        return `${this.getIndentation()}MathOperation: ${node.operator}`;
    }

    debugComparisonOperation(node: Nodes.ComparisonOperationNode): string {
        return `${this.getIndentation()}ComparisonOperation: ${node.operator}`;
    }

    debugStackOperation(node: Nodes.StackOperationNode): string {
        return `${this.getIndentation()}StackOperation: ${node.operator}`;
    }

    debugIfStatement(node: Nodes.IfStatementNode): string {
        this.indent++;
        const condition = node.condition.accept(this);
        const consequent = node.consequent
            .map((stmt) => stmt.accept(this))
            .join("\n");
        const alternative = node.alternative
            ? node.alternative.map((stmt) => stmt.accept(this)).join("\n")
            : null;
        this.indent--;

        return `${this.getIndentation()}IfStatement:
${condition}
${this.getIndentation()}Consequent:\n${consequent}${
            alternative
                ? `\n${this.getIndentation()}Alternative:\n${alternative}`
                : ""
        }`;
    }

    debugLoopStatement(node: Nodes.LoopStatementNode): string {
        this.indent++;
        const body = node.body.map((stmt) => stmt.accept(this)).join("\n");
        this.indent--;
        return `${this.getIndentation()}LoopStatement:\n${body}`;
    }

    debugFunctionDefinition(node: Nodes.FunctionDefinitionNode): string {
        this.indent++;
        const body = node.body.map((stmt) => stmt.accept(this)).join("\n");
        this.indent--;
        return `${this.getIndentation()}FunctionDefinition:\n${body}`;
    }

    debugIOOperation(node: Nodes.IOOperationNode): string {
        return `${this.getIndentation()}IOOperation: ${node.type}`;
    }
    debugIndexExpression(node: Nodes.IndexExpressionNode): string {
        this.indent++;
        const expression = node.expression.accept(this);
        this.indent--;
        return `${this.getIndentation()}IndexExpression:\n${expression}\n${this.getIndentation()}  Index: ${node.index}`;
    }

    debugComparisonExpression(node: Nodes.ComparisonExpressionNode): string {
        this.indent++;
        const left = node.left.accept(this);
        const operator = node.operator.accept(this);
        const right = node.right.accept(this);
        this.indent--;
        return `${this.getIndentation()}ComparisonExpression:\n${left}\n${operator}\n${right}`;
    }
}
