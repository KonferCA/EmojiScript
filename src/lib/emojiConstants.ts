// Data Types
export const ArrayEmojis = {
    START: "📦" as const,
    END: "🎁" as const,
} as const;

// Boolean Values
export const BooleanEmojis = {
    TRUE: "✅" as const,
    FALSE: "❌" as const,
} as const;

// Numbers
export const NumberEmojis = {
    ZERO: "0️⃣" as const,
    ONE: "1️⃣" as const,
    TWO: "2️⃣" as const,
    THREE: "3️⃣" as const,
    FOUR: "4️⃣" as const,
    FIVE: "5️⃣" as const,
    SIX: "6️⃣" as const,
    SEVEN: "7️⃣" as const,
    EIGHT: "8️⃣" as const,
    NINE: "9️⃣" as const,
} as const;

// Strings
export const StringEmojis = {
    QUOTE: "📋" as const,
} as const;

// Operators
export const MathOperatorEmojis = {
    ADD: "➕" as const,
    SUBTRACT: "➖" as const,
    MULTIPLY: "✖️" as const,
    DIVIDE: "➗" as const,
} as const;

// Relational Operators
export const RelationalEmojis = {
    EQUAL: "🎯" as const,
    GREATER_OR_EQUAL: "📈" as const,
    LESS_OR_EQUAL: "📉" as const,
    GREATER: "⬆️" as const,
    LESS: "⬇️" as const,
    NOT: "🚫" as const,
    AND: "🤝" as const,
    OR: "🙌" as const,
} as const;

// Control Flow
export const ControlFlowEmojis = {
    LOOP: "🔄" as const,
    IF: "🤔" as const,
    IF_THEN: "👉" as const,
    ELSE: "💭" as const,
    STOP: "⏹️" as const,
    PRECEDENCE: "🚧" as const,
} as const;

// Programming
export const ProgrammingEmojis = {
    FUNCTION_DEF: "📎" as const,
    FUNCTION_CALL_START: "🫑" as const,
    FUNCTION_CALL_END: "🍴" as const,
    POINTER: "👉" as const,
    INDEXING: "🔎" as const,
    ASSIGNMENT: "📥" as const,
    COMMA: "🌚" as const,
    VAR_DECLARATION: "📝" as const,
} as const;

// IO
export const IOEmojis = {
    PRINT: "📢" as const,
} as const;

// Derive types from the constants
export type DataTypeEmoji = (typeof ArrayEmojis)[keyof typeof ArrayEmojis];
export type BooleanEmoji = (typeof BooleanEmojis)[keyof typeof BooleanEmojis];
export type NumberEmoji = (typeof NumberEmojis)[keyof typeof NumberEmojis];
export type StringEmoji = (typeof StringEmojis)[keyof typeof StringEmojis];
export type MathOperatorEmoji =
    (typeof MathOperatorEmojis)[keyof typeof MathOperatorEmojis];
export type RelationalEmoji =
    (typeof RelationalEmojis)[keyof typeof RelationalEmojis];
export type ControlFlowEmoji =
    (typeof ControlFlowEmojis)[keyof typeof ControlFlowEmojis];
export type ProgrammingEmoji =
    (typeof ProgrammingEmojis)[keyof typeof ProgrammingEmojis];
export type IOEmoji = (typeof IOEmojis)[keyof typeof IOEmojis];

// Union type of all emojis
export type ProgrammingSymbolEmoji =
    | DataTypeEmoji
    | BooleanEmoji
    | NumberEmoji
    | StringEmoji
    | MathOperatorEmoji
    | RelationalEmoji
    | ControlFlowEmoji
    | ProgrammingEmoji
    | IOEmoji;

// Utility type to get the category of an emoji
export type EmojiCategory<T extends ProgrammingSymbolEmoji> =
    T extends DataTypeEmoji
        ? "Array"
        : T extends BooleanEmoji
          ? "Boolean"
          : T extends NumberEmoji
            ? "Number"
            : T extends StringEmoji
              ? "String"
              : T extends MathOperatorEmoji
                ? "MathOperator"
                : T extends RelationalEmoji
                  ? "Relational"
                  : T extends ControlFlowEmoji
                    ? "ControlFlow"
                    : T extends ProgrammingEmoji
                      ? "Programming"
                      : T extends IOEmoji
                        ? "IO"
                        : never;

// Utility function to get emoji category
export function getEmojiCategory(
    emoji: ProgrammingSymbolEmoji
): EmojiCategory<typeof emoji> {
    // Check which category the emoji belongs to and return the corresponding string
    if (Object.values(ArrayEmojis).includes(emoji as any)) return "Array";
    if (Object.values(BooleanEmojis).includes(emoji as any)) return "Boolean";
    if (Object.values(NumberEmojis).includes(emoji as any)) return "Number";
    if (Object.values(MathOperatorEmojis).includes(emoji as any))
        return "MathOperator";
    if (Object.values(RelationalEmojis).includes(emoji as any))
        return "Relational";
    if (Object.values(ControlFlowEmojis).includes(emoji as any))
        return "ControlFlow";
    if (Object.values(ProgrammingEmojis).includes(emoji as any))
        return "Programming";
    if (Object.values(IOEmojis).includes(emoji as any)) return "IO";
    // If the emoji doesn't belong to any category, throw an error
    throw new Error("Unknown emoji category");
}
