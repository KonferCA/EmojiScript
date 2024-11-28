import { NodeVisitor } from "./types";
import * as Nodes from "./nodes";
import { MathOperatorEmojis } from "../emojiConstants";

export class ASTVisitor implements NodeVisitor {
    private indent: number = 0;

    constructor() {}

    private getIndentation(): string {
        return "  ".repeat(this.indent);
    }

    visitProgram(node: Nodes.ProgramNode): string {
        const jsStrList: string[] = [];
        node.statements.forEach((stmt) => {
            jsStrList.push(stmt.accept(this));
        });
        return jsStrList.join(";");
    }

    visitNumberLiteral(node: Nodes.NumberLiteralNode): string {
        return node.value.toString();
    }

    visitStringLiteral(node: Nodes.StringLiteralNode): string {
        // all literal strings should be emojis so there is no need
        // to handle nested single/double quotes.
        return `"${node.value}"`;
    }

    visitBooleanLiteral(node: Nodes.BooleanLiteralNode): string {
        return `${node.value}`;
    }

    visitArrayLiteral(node: Nodes.ArrayLiteralNode): string {
        const builder: string[] = [];

        // go through all the elements in the node
        node.elements.forEach((e) => {
            builder.push(e.accept(this));
        });

        return "[" + builder.join(",") + "]";
    }

    visitVariableDeclaration(node: Nodes.VariableDeclarationNode): string {
        const identStr = node.name.accept(this);
        const valueStr = node.value.accept(this);
        return `let ${identStr}=${valueStr}`;
    }

    visitIdentifier(node: Nodes.IdentifierNode): string {
        // returns the string itself without quotes
        // for javascript to treat it like an actual identifier
        return node.name;
    }

    visitMathOperation(node: Nodes.MathOperationNode): string {
        const lhs = node.lhs.accept(this);
        const rhs = node.rhs.accept(this);

        // map math emoji operator with actual ascii
        let operator = "";
        switch (node.operator) {
            case MathOperatorEmojis.ADD:
                operator = "+";
                break;
            case MathOperatorEmojis.SUBTRACT:
                operator = "-";
                break;
            case MathOperatorEmojis.DIVIDE:
                operator = "/";
                break;
            case MathOperatorEmojis.MULTIPLY:
                operator = "*";
                break;
            default:
                throw new Error(
                    "Invalid math operator given when visiting math operation node."
                );
        }

        return lhs + operator + rhs;
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
