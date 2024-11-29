// TODO: Gestring imported position when lexer is merged in
// import { Position } from '../lexer/idk yet';
// temp solution
type Position = {
    line: number;
    column: number;
};

import type {
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

    accept(visitor: NodeVisitor): string {
        return visitor.visitProgram(this);
    }

    debug(visitor: NodeVisitor): string {
        return visitor.debugProgram(this);
    }
}

export class NumberLiteralNode implements Types.NumberLiteralNode {
    constructor(
        public value: number,
        public position: Position
    ) {}

    accept(visitor: NodeVisitor): string {
        return visitor.visitNumberLiteral(this);
    }

    debug(visitor: NodeVisitor): string {
        return visitor.debugNumberLiteral(this);
    }
}

export class StringLiteralNode implements Types.StringLiteralNode {
    constructor(
        public value: string,
        public position: Position
    ) {}

    accept(visitor: NodeVisitor): string {
        return visitor.visitStringLiteral(this);
    }

    debug(visitor: NodeVisitor): string {
        return visitor.debugStringLiteral(this);
    }
}

export class BooleanLiteralNode implements Types.BooleanLiteralNode {
    constructor(
        public value: boolean,
        public position: Position
    ) {}

    accept(visitor: NodeVisitor): string {
        return visitor.visitBooleanLiteral(this);
    }

    debug(visitor: NodeVisitor): string {
        return visitor.debugBooleanLiteral(this);
    }
}

export class ArrayLiteralNode implements Types.ArrayLiteralNode {
    constructor(
        public elements: Node[],
        public position: Position
    ) {}

    accept(visitor: NodeVisitor): string {
        return visitor.visitArrayLiteral(this);
    }

    debug(visitor: NodeVisitor): string {
        return visitor.debugArrayLiteral(this);
    }
}

export class VariableDeclarationNode implements Types.VariableDeclarationNode {
    constructor(
        public name: Types.IdentifierNode,
        public value: Node,
        public position: Position
    ) {}

    accept(visitor: NodeVisitor): string {
        return visitor.visitVariableDeclaration(this);
    }

    debug(visitor: NodeVisitor): string {
        return visitor.debugVariableDeclaration(this);
    }
}

export class IdentifierNode implements Types.IdentifierNode {
    constructor(
        public name: string,
        public position: Position
    ) {}

    accept(visitor: NodeVisitor): string {
        return visitor.visitIdentifier(this);
    }

    debug(visitor: NodeVisitor): string {
        return visitor.debugIdentifier(this);
    }
}

export class MathOperationNode implements Types.MathOperationNode {
    constructor(
        public operator: MathOperatorEmoji,
        public lhs: Node,
        public rhs: Node,
        public position: Position
    ) {}

    accept(visitor: NodeVisitor): string {
        return visitor.visitMathOperation(this);
    }

    debug(visitor: NodeVisitor): string {
        return visitor.debugMathOperation(this);
    }
}

export class IfStatementNode implements Types.IfStatementNode {
    constructor(
        public condition: Types.ExpressionNode,
        public consequent: Node[],
        public alternative: Node[] | undefined,
        public position: Position
    ) {}

    accept(visitor: NodeVisitor): string {
        return visitor.visitIfStatement(this);
    }

    debug(visitor: NodeVisitor): string {
        return visitor.debugIfStatement(this);
    }
}

export class ExpressionNode implements Types.ExpressionNode {
    constructor(
        public left: Types.ExpressionCompatibleNodes,
        public operator: RelationalEmoji | MathOperatorEmoji | null,
        public right: Types.ExpressionCompatibleNodes | null,
        public setParenthesis: boolean,
        public position: Position
    ) {}

    accept(visitor: NodeVisitor): string {
        return visitor.visitExpression(this);
    }

    debug(visitor: NodeVisitor): string {
        return visitor.debugExpression(this);
    }
}

export class LoopStatementNode implements Types.LoopStatementNode {
    constructor(
        public condition: ExpressionNode,
        public body: Node[],
        public position: Position
    ) {}

    accept(visitor: NodeVisitor): string {
        return visitor.visitLoopStatement(this);
    }

    debug(visitor: NodeVisitor): string {
        return visitor.debugLoopStatement(this);
    }
}

export class FunctionDefinitionNode implements Types.FunctionDefinitionNode {
    constructor(
        public name: Types.IdentifierNode,
        public parameters: Types.IdentifierNode[],
        public body: Node[],
        public position: Position
    ) {}

    accept(visitor: NodeVisitor): string {
        return visitor.visitFunctionDefinition(this);
    }

    debug(visitor: NodeVisitor): string {
        return visitor.debugFunctionDefinition(this);
    }
}

export class FunctionCallNode implements Types.FunctionCallNode {
    constructor(
        public name: Types.IdentifierNode,
        public parameters: Types.ExpressionCompatibleNodes[],
        public position: Position
    ) {}

    accept(visitor: NodeVisitor): string {
        return visitor.visitFunctionCall(this);
    }

    debug(visitor: NodeVisitor): string {
        return visitor.debugFunctionCall(this);
    }
}

export class IOOperationNode implements Types.IOOperationNode {
    constructor(
        public type: IOEmoji,
        public value: Types.ExpressionCompatibleNodes,
        public position: Position
    ) {}

    accept(visitor: NodeVisitor): string {
        return visitor.visitIOOperation(this);
    }

    debug(visitor: NodeVisitor): string {
        return visitor.debugIOOperation(this);
    }
}

export class IndexExpressionNode implements Types.IndexExpressionNode {
    constructor(
        public expression: Types.IndexableNodes,
        public index: number,
        public position: Position
    ) {}

    accept(visitor: NodeVisitor): string {
        return visitor.visitIndexExpression(this);
    }

    debug(visitor: NodeVisitor): string {
        return visitor.debugIndexExpression(this);
    }
}

export class AssignmentNode implements Types.AssignmentNode {
    constructor(
        public identifier: Types.IdentifierNode,
        public value: Types.ExpressionCompatibleNodes,
        public position: Position
    ) {}

    accept(visitor: NodeVisitor): string {
        return visitor.visitAssignment(this);
    }

    debug(visitor: NodeVisitor): string {
        return visitor.debugAssignment(this);
    }
}
