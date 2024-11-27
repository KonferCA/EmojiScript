// TODO: Get imported position when lexer is merged in
// import { Position } from '../lexer/idk yet';
// temp solution
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
import type { Node, NodeVisitor } from "./types";
import * as Types from "./types";

export class ProgramNode implements Types.ProgramNode {
    constructor(
        public statements: Node[],
        public position: Position
    ) {}

    accept<T>(visitor: NodeVisitor<T>): T {
        return visitor.visitProgram(this);
    }
}

export class NumberLiteralNode implements Types.NumberLiteralNode {
    constructor(
        public value: number,
        public position: Position
    ) {}

    accept<T>(visitor: NodeVisitor<T>): T {
        return visitor.visitNumberLiteral(this);
    }
}

export class StringLiteralNode implements Types.StringLiteralNode {
    constructor(
        public value: string,
        public position: Position
    ) {}

    accept<T>(visitor: NodeVisitor<T>): T {
        return visitor.visitStringLiteral(this);
    }
}

export class BooleanLiteralNode implements Types.BooleanLiteralNode {
    constructor(
        public value: boolean,
        public position: Position
    ) {}

    accept<T>(visitor: NodeVisitor<T>): T {
        return visitor.visitBooleanLiteral(this);
    }
}

export class ArrayLiteralNode implements Types.ArrayLiteralNode {
    constructor(
        public elements: Node[],
        public position: Position
    ) {}

    accept<T>(visitor: NodeVisitor<T>): T {
        return visitor.visitArrayLiteral(this);
    }
}

export class VariableDeclarationNode implements Types.VariableDeclarationNode {
    constructor(
        public name: Types.IdentifierNode,
        public value: Node,
        public position: Position
    ) {}

    accept<T>(visitor: NodeVisitor<T>): T {
        return visitor.visitVariableDeclaration(this);
    }
}

export class IdentifierNode implements Types.IdentifierNode {
    constructor(
        public name: string,
        public position: Position
    ) {}

    accept<T>(visitor: NodeVisitor<T>): T {
        return visitor.visitIdentifier(this);
    }
}

export class MathOperationNode implements Types.MathOperationNode {
    constructor(
        public operator: MathOperatorEmoji,
        public position: Position
    ) {}

    accept<T>(visitor: NodeVisitor<T>): T {
        return visitor.visitMathOperation(this);
    }
}

export class ComparisonOperationNode implements Types.ComparisonOperationNode {
    constructor(
        public operator: RelationalEmoji,
        public position: Position
    ) {}

    accept<T>(visitor: NodeVisitor<T>): T {
        return visitor.visitComparisonOperation(this);
    }
}

export class StackOperationNode implements Types.StackOperationNode {
    constructor(
        public operator: ControlFlowEmoji,
        public position: Position
    ) {}

    accept<T>(visitor: NodeVisitor<T>): T {
        return visitor.visitStackOperation(this);
    }
}

export class IfStatementNode implements Types.IfStatementNode {
    constructor(
        public condition: Types.ComparisonExpressionNode,
        public consequent: Node[],
        public alternative: Node[] | undefined,
        public position: Position
    ) {}

    accept<T>(visitor: NodeVisitor<T>): T {
        return visitor.visitIfStatement(this);
    }
}

export class ComparisonExpressionNode
    implements Types.ComparisonExpressionNode
{
    constructor(
        public left: Node,
        public operator: ComparisonOperationNode,
        public right: Node,
        public position: Position
    ) {}

    accept<T>(visitor: NodeVisitor<T>): T {
        return visitor.visitComparisonExpression(this);
    }
}

export class LoopStatementNode implements Types.LoopStatementNode {
    constructor(
        public body: Node[],
        public position: Position
    ) {}

    accept<T>(visitor: NodeVisitor<T>): T {
        return visitor.visitLoopStatement(this);
    }
}

export class FunctionDefinitionNode implements Types.FunctionDefinitionNode {
    constructor(
        public body: Node[],
        public position: Position
    ) {}

    accept<T>(visitor: NodeVisitor<T>): T {
        return visitor.visitFunctionDefinition(this);
    }
}

export class IOOperationNode implements Types.IOOperationNode {
    constructor(
        public type: IOEmoji,
        public position: Position
    ) {}

    accept<T>(visitor: NodeVisitor<T>): T {
        return visitor.visitIOOperation(this);
    }
}

export class IndexExpressionNode implements Types.IndexExpressionNode {
    constructor(
        public expression: Node,
        public index: number,
        public position: Position
    ) {}

    accept<T>(visitor: NodeVisitor<T>): T {
        return visitor.visitIndexExpression(this);
    }
}
