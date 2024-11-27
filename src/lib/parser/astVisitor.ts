import { NodeVisitor } from "./types";
import * as Nodes from "./nodes";

export class ASTVisitor implements NodeVisitor<string> {
    private indent: number = 0;

    constructor() {}

    private getIndentation(): string {
        return "  ".repeat(this.indent);
    }

    visitProgram(node: Nodes.ProgramNode): string {
        this.indent++;
        const statements = node.statements
            .map((stmt) => stmt.accept(this))
            .join("\n");
        this.indent--;
        return `Program:\n${statements}`;
    }

    visitNumberLiteral(node: Nodes.NumberLiteralNode): string {
        return `${this.getIndentation()}NumberLiteral: ${node.value}`;
    }

    visitStringLiteral(node: Nodes.StringLiteralNode): string {
        return `${this.getIndentation()}StringLiteral: "${node.value}"`;
    }

    visitBooleanLiteral(node: Nodes.BooleanLiteralNode): string {
        return `${this.getIndentation()}BooleanLiteral: ${node.value}`;
    }

    visitArrayLiteral(node: Nodes.ArrayLiteralNode): string {
        this.indent++;
        const elements = node.elements
            .map((elem) => elem.accept(this))
            .join("\n");
        this.indent--;
        return `${this.getIndentation()}ArrayLiteral:\n${elements}`;
    }

    visitVariableDeclaration(node: Nodes.VariableDeclarationNode): string {
        this.indent++;
        const name = node.name.accept(this);
        const value = node.value.accept(this);
        this.indent--;
        return `${this.getIndentation()}VariableDeclaration:\n${name}\n${value}`;
    }

    visitIdentifier(node: Nodes.IdentifierNode): string {
        return `${this.getIndentation()}Identifier: ${node.name}`;
    }

    visitMathOperation(node: Nodes.MathOperationNode): string {
        return `${this.getIndentation()}MathOperation: ${node.operator}`;
    }

    visitComparisonOperation(node: Nodes.ComparisonOperationNode): string {
        return `${this.getIndentation()}ComparisonOperation: ${node.operator}`;
    }

    visitStackOperation(node: Nodes.StackOperationNode): string {
        return `${this.getIndentation()}StackOperation: ${node.operator}`;
    }

    visitIfStatement(node: Nodes.IfStatementNode): string {
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

    visitComparisonExpression(node: Nodes.ComparisonExpressionNode): string {
        this.indent++;
        const left = node.left.accept(this);
        const operator = node.operator.accept(this);
        const right = node.right.accept(this);
        this.indent--;
        return `${this.getIndentation()}ComparisonExpression:\n${left}\n${operator}\n${right}`;
    }

    visitLoopStatement(node: Nodes.LoopStatementNode): string {
        this.indent++;
        const body = node.body.map((stmt) => stmt.accept(this)).join("\n");
        this.indent--;
        return `${this.getIndentation()}LoopStatement:\n${body}`;
    }

    visitFunctionDefinition(node: Nodes.FunctionDefinitionNode): string {
        this.indent++;
        const body = node.body.map((stmt) => stmt.accept(this)).join("\n");
        this.indent--;
        return `${this.getIndentation()}FunctionDefinition:\n${body}`;
    }

    visitIOOperation(node: Nodes.IOOperationNode): string {
        return `${this.getIndentation()}IOOperation: ${node.type}`;
    }

    visitIndexExpression(node: Nodes.IndexExpressionNode): string {
        this.indent++;
        const expression = node.expression.accept(this);
        this.indent--;
        return `${this.getIndentation()}IndexExpression:\n${expression}\n${this.getIndentation()}  Index: ${node.index}`;
    }
}
