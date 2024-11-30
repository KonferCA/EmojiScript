/*
 * Take as input a program node that has field statements (Node)
 * Go through each node and create a javascript string
 *
 */

import { ProgramNode } from "../parser/nodes";
import { ASTVisitor } from "../parser/astVisitor";

/*
 * Intermediate Representation
 *
 * Build or evaluate a program (ProgramNode)
 */
export class IR {
    private program: ProgramNode;

    constructor(program: ProgramNode) {
        this.program = program;
    }

    /*
     * Builds a javascript string given the initial program node is correct.
     */
    public build(): string {
        // loop through the statements in the program node
        const visitor = new ASTVisitor();
        const builder: string[] = [];
        for (let i = 0; i < this.program.statements.length; i++) {
            const stmt = this.program.statements[i];
            const js = stmt.accept(visitor);
            builder.push(js);
        }

        return builder.join(";");
    }

    /*
     * Evaluates the program directly instead of building a javascript string.
     * Captures the output of each executed line of emojiscript; however, more
     * complex behaviours that are possible in javascript are not supported.
     */
    public eval() {}
}
