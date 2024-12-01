## Grammar Spec

```
program = statement*

statement = data_push
          | operation
          | control_flow
          | io_operation
          | var_declaration

var_declaration = type emoji_char+ literal

inline_literal = type literal

var_assignment = "📥" emoji_char+ "👉" var | "📥" emoji_char+ "👉" literal

type = "📝" | "🔢" | "🏁"

literal = number | string | boolean | array

emoji_char = "any emoji that is not a reserved emoji"

data_push = number | string | boolean | array

number = emoji_digit+
emoji_digit = "0️⃣" | "1️⃣" | "2️⃣" | "3️⃣" | "4️⃣" | "5️⃣" | "6️⃣" | "7️⃣" | "8️⃣" | "9️⃣"

string = "📋" emoji_char* "📋"

boolean = "✅" | "❌"

array = "📦" expression* "📦"
array_indexing = var "🔎" number

operation = math_op | comparison_op

math_op = "➕" | "➖" | "✖️" | "➗"

comparison_op = "⬆️" | "⬇️" | "🎯" | "📈" | "📉" | "🚫"

op = math_op | comparison_op

control_flow = if_statement | loop | function

if_statement = "🤔" expression "👉" statement* ["💭" statement*] "⏹️"

expression = expression op expression | "🚧" expression "🚧" | literal | func_call | var | array_indexing

func_call = "🫑" emoji_chars+ "🍴" parameters "🍴"

parameters = expression | expression "🌚" parameter'
parameter' = expression | E

loop = "🔁" expression "👉" statement* "⏹️"

function = "📎" emoji_char* "👉" parameters "👉" statement* "⏹️"

io_operation = "📢"
```

## Function Signatures

### Lexer

```
// Related types
Lexeme = (TokenType, Literal, Line, Column)

enum TokenType {
    NumberType,
    Number,

    StringType,
    String,

    BooleanType,

    // start/end of array uses the same package emoji
    ArrayType,

    AdditionOp,
    SubstractionOp,
    MultiplicationOp,
    DivisionOp,
    ModuloOp,

    IfOp,
    ThenOp,
    EqualOp,
    GreaterOp,
    LesserOp,
    NotOp,

    PushOp,
    PopOp,
    LoopOp,
    StopOp,

    FuncDef,

    // controls precedence
    ConstructionOp,

    Print,
    Read,

    // identifiers etc...
    Emojis,

    // end of file
    EOF,
    // illegal token encountered
    Illegal,
}

new Lexer(input: string)

// gets the next lexeme, if EOF has been reached, lexeme with TokenType::EOF should be returned.
Lexer.next() -> Lexeme

// checks if end of file has been reached or not
Lexer.end() -> boolean

// peeks at the next lexeme without moving the window pointers.
Lexer.peek() -> Lexeme
```

### Parser

```
new Parser(l: Lexer)

Parser.parse() -> AST

AST {
    isValid: boolean
    error: string
    program: Node
}

// different types of node should be created
// this will allow the IR to properly traverse it
// based on the node type. A node should implement
// the visitor pattern so that the IR can expect
// one type of interface when visiting nodes.
// https://refactoring.guru/design-patterns/visitor/typescript/example#lang-features
Node {
    ... any relevant property
}
```

### IR/Evaluator

```
new IR(ast: AST)

// returns javascript from AST
IR.build() -> string

// runs AST while traversing it and returns a list with all
// outputs from each statement that was evaluated.
IR.eval() -> any[]
```
