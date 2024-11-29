import { NodeVisitor } from "./types";
import * as Nodes from "./nodes";
import {
    MathOperatorEmoji,
    MathOperatorEmojis,
    RelationalEmoji,
    RelationalEmojis,
} from "../emojiConstants";

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
        const operator = this.emojiOperator2JsOperator(node.operator);
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

    visitExpression(node: Nodes.ExpressionNode): string {
        if (node.operator === null && node.right !== null)
            throw new Error("Missing operator for expression.");
        if (
            node.operator !== null &&
            node.operator !== RelationalEmojis.NOT &&
            node.right === null
        )
            throw new Error(
                "Missing right hand side when operator is defined."
            );

        const lhs = node.left.accept(this);
        let op: string = "";
        if (node.operator !== null) {
            op = this.emojiOperator2JsOperator(node.operator);
        }
        let rhs: string = "";
        if (node.right !== null) {
            rhs = node.right.accept(this);
        }

        let end = "";
        if (node.operator && node.operator == RelationalEmojis.NOT) {
            end = `${op}${lhs}`;
        } else {
            end = lhs + op + rhs;
        }
        if (node.setParenthesis) {
            end = `(${end})`;
        }

        return end;
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

    debugExpression(node: Nodes.ExpressionNode): string {
        this.indent++;
        const left = node.left.accept(this);
        const operator =
            node.operator !== null
                ? this.emojiOperator2JsOperator(node.operator)
                : "null";
        const right = node.right?.accept(this);
        this.indent--;
        return `${this.getIndentation()}ComparisonExpression:\n${left}\n${operator}\n${right}`;
    }

    private emojiOperator2JsOperator(
        op: RelationalEmoji | MathOperatorEmoji
    ): string {
        switch (op) {
            case RelationalEmojis.OR:
                return "||";
            case RelationalEmojis.AND:
                return "&&";
            case RelationalEmojis.NOT:
                return "!";
            case RelationalEmojis.EQUAL:
                return "===";
            case RelationalEmojis.LESS_OR_EQUAL:
                return "<=";
            case RelationalEmojis.GREATER_OR_EQUAL:
                return ">=";
            case MathOperatorEmojis.ADD:
                return "+";
            case MathOperatorEmojis.SUBTRACT:
                return "-";
            case MathOperatorEmojis.DIVIDE:
                return "/";
            case MathOperatorEmojis.MULTIPLY:
                return "*";
            default:
                throw new Error("Invalid emoji operator");
        }
    }
}
