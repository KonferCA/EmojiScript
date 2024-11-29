import {
    BooleanEmojis,
    ControlFlowEmojis,
    DataTypeEmojis,
    IOEmojis,
    MathOperatorEmojis,
    NumberEmojis,
    ProgrammingEmojis,
    RelationalEmojis,
    type ProgrammingSymbolEmoji
} from '../emojiConstants';

// token types as specified in spec
export enum TokenType {
    // types
    NumberType,
    StringType,
    BooleanType,
    ArrayType,

    // literals
    Number,
    String,
    Boolean,

    // math operators
    AdditionOp,
    SubtractionOp,
    MultiplicationOp,
    DivisionOp,
    ModuloOp,

    // control flow
    IfOp,
    ThenOp,
    EqualOp,
    GreaterOp,
    LesserOp,
    NotOp,
    StopOp,
    LoopOp,
    BarrierOp,
    ThinkOp,

    // stack operations
    PushOp,
    PopOp,
    RotateOp,
    ShuffleOp,

    // comparison operators
    IncreaseOp,
    DecreaseOp,
    NotEqualOp,

    // function
    FuncDef,
    ConstructOp,

    // io
    Print,
    Read,

    // misc
    Emojis,
    EOF,
    Illegal,
}

// position tracking
export interface Position {
    line: number;
    column: number;
}

// lexeme type as specified in spec
export type Literal = string | number | boolean | null;
export type Lexeme = {
    type: TokenType;
    literal: Literal;
    position: Position;
}

export class Lexer {
    private position: number = 0;
    private readPosition: number = 0;
    private char: string = '';
    private line: number = 1;
    private column: number = 0;

    constructor(private input: string) {
        this.readChar();
    }

    // reads the next character and advances position
    private readChar(): void {
        if (this.readPosition >= this.input.length) {
            this.char = '';
        } else {
            this.char = this.input[this.readPosition];
        }
        this.position = this.readPosition;
        this.readPosition++;

        // track position
        if (this.char === '\n') {
            this.line++;
            this.column = 0;
        } else {
            this.column++;
        }
    }

    // peeks at next character without advancing
    private peekChar(): string {
        if (this.readPosition >= this.input.length) {
            return '';
        }
        return this.input[this.readPosition];
    }

    // skips whitespace
    private skipWhitespace(): void {
        while (this.char === ' ' || this.char === '\t' || this.char === '\n' || this.char === '\r') {
            this.readChar();
        }
    }

    // gets current position
    private currentPosition(): Position {
        return { line: this.line, column: this.column };
    }

    // reads an emoji (can be multiple chars)
    private readEmoji(): string {
        const startPos = this.position;
        // read until we hit a non-emoji character or whitespace
        while (this.position < this.input.length && !this.isWhitespace(this.char)) {
            this.readChar();
        }
        return this.input.slice(startPos, this.position);
    }

    private isWhitespace(char: string): boolean {
        return char === ' ' || char === '\t' || char === '\n' || char === '\r';
    }

    // checks if we've reached the end
    public end(): boolean {
        return this.position >= this.input.length;
    }

    // gets next token without advancing
    public peek(): Lexeme {
        const currentPos = this.position;
        const currentChar = this.char;
        const currentLine = this.line;
        const currentColumn = this.column;
        const currentReadPos = this.readPosition;

        const token = this.next();

        // restore state
        this.position = currentPos;
        this.char = currentChar;
        this.line = currentLine;
        this.column = currentColumn;
        this.readPosition = currentReadPos;

        return token;
    }

    // gets next token
    public next(): Lexeme {
        this.skipWhitespace();

        if (this.char === '') {
            return { type: TokenType.EOF, literal: null, position: this.currentPosition() };
        }

        const emoji = this.readEmoji();
        const pos = this.currentPosition();

        // check for number emojis
        if (Object.values(NumberEmojis).includes(emoji as any)) {
            return { type: TokenType.Number, literal: this.emojiToNumber(emoji), position: pos };
        }

        // check for data types
        switch (emoji) {
            case DataTypeEmojis.NUMBER:
                return { type: TokenType.NumberType, literal: emoji, position: pos };
            case DataTypeEmojis.STRING:
                return { type: TokenType.StringType, literal: emoji, position: pos };
            case DataTypeEmojis.BOOLEAN:
                return { type: TokenType.BooleanType, literal: emoji, position: pos };
            case DataTypeEmojis.ARRAY:
                return { type: TokenType.ArrayType, literal: emoji, position: pos };
        }

        // check for boolean values
        switch (emoji) {
            case BooleanEmojis.TRUE:
            case BooleanEmojis.FALSE:
                return { type: TokenType.Boolean, literal: emoji === BooleanEmojis.TRUE, position: pos };
        }

        // check for math operators
        switch (emoji) {
            case MathOperatorEmojis.ADD:
                return { type: TokenType.AdditionOp, literal: emoji, position: pos };
            case MathOperatorEmojis.SUBTRACT:
                return { type: TokenType.SubtractionOp, literal: emoji, position: pos };
            case MathOperatorEmojis.MULTIPLY:
                return { type: TokenType.MultiplicationOp, literal: emoji, position: pos };
            case MathOperatorEmojis.DIVIDE:
                return { type: TokenType.DivisionOp, literal: emoji, position: pos };
        }

        // check for control flow
        switch (emoji) {
            case ControlFlowEmojis.IF:
                return { type: TokenType.IfOp, literal: emoji, position: pos };
            case ControlFlowEmojis.IF_THEN:  // Using IF_THEN for 💭
                return { type: TokenType.ThinkOp, literal: emoji, position: pos };
            case ControlFlowEmojis.STOP:
                return { type: TokenType.StopOp, literal: emoji, position: pos };
        }

        // check for stack operations
        switch (emoji) {
            case '⬆️':
                return { type: TokenType.PushOp, literal: emoji, position: pos };
            case '⬇️':
                return { type: TokenType.PopOp, literal: emoji, position: pos };
            case '🔄':
                return { type: TokenType.RotateOp, literal: emoji, position: pos };
            case '🔀':
                return { type: TokenType.ShuffleOp, literal: emoji, position: pos };
        }

        // check for comparison operators
        switch (emoji) {
            case '📈':
                return { type: TokenType.IncreaseOp, literal: emoji, position: pos };
            case '📉':
                return { type: TokenType.DecreaseOp, literal: emoji, position: pos };
            case '🚫':
                return { type: TokenType.NotEqualOp, literal: emoji, position: pos };
        }

        // check for barriers
        if (emoji === '🚧') {
            return { type: TokenType.BarrierOp, literal: emoji, position: pos };
        }

        // check for construction operator
        if (emoji === '👉') {
            return { type: TokenType.ConstructOp, literal: emoji, position: pos };
        }

        // check for function definition
        if (emoji === '📎') {
            return { type: TokenType.FuncDef, literal: emoji, position: pos };
        }

        // check for io operations
        switch (emoji) {
            case IOEmojis.PRINT:
                return { type: TokenType.Print, literal: emoji, position: pos };
            case IOEmojis.READ_INPUT:
                return { type: TokenType.Read, literal: emoji, position: pos };
        }

        // check if it's a regular text identifier
        if (this.isIdentifier(emoji)) {
            return { type: TokenType.Emojis, literal: emoji, position: pos };
        }

        // if we get here, check if it's an emoji for variable names
        if (this.isEmoji(emoji)) {
            return { type: TokenType.Emojis, literal: emoji, position: pos };
        }

        return { type: TokenType.Illegal, literal: emoji, position: pos };
    }

    // helper to convert emoji numbers to actual numbers
    private emojiToNumber(emoji: string): number {
        const numberMap: { [key: string]: number } = {
            [NumberEmojis.ZERO]: 0,
            [NumberEmojis.ONE]: 1,
            [NumberEmojis.TWO]: 2,
            [NumberEmojis.THREE]: 3,
            [NumberEmojis.FOUR]: 4,
            [NumberEmojis.FIVE]: 5,
            [NumberEmojis.SIX]: 6,
            [NumberEmojis.SEVEN]: 7,
            [NumberEmojis.EIGHT]: 8,
            [NumberEmojis.NINE]: 9,
        };

        return numberMap[emoji] ?? NaN;
    }

    // helper to check if a string is an emoji
    private isEmoji(str: string): boolean {
        const emojiRegex = /\p{Emoji}/u;
        return emojiRegex.test(str);
    }

    private isIdentifier(str: string): boolean {
        // Allow regular text (letters, numbers, underscores) for identifiers
        return /^[a-zA-Z0-9_]+$/.test(str);
    }
}
