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

type = "📝" | "🔢" | "🏁"

literal = number | string | boolean | array

emoji_char = "any emoji that is not a reserved emoji"

data_push = number | string | boolean | array

number = emoji_digit+
emoji_digit = "0️⃣" | "1️⃣" | "2️⃣" | "3️⃣" | "4️⃣" | "5️⃣" | "6️⃣" | "7️⃣" | "8️⃣" | "9️⃣"

string = emoji_char*

boolean = "✅" | "❌"

array = "📦" expression* "📦"

operation = math_op | stack_op | comparison_op

math_op = "➕" | "➖" | "✖️" | "➗"

comparison_op = "⬆️" | "⬇️" | "🎯" | "📈" | "📉" | "🚫"

stack_op = "⬆️" | "⬇️" | "🔄" | "🔀"

control_flow = if_statement | loop | function

if_statement = "🤔" comparison_expr statement* ["💭" statement*] "⏹️"

comparison_expr = "🚧" expression comparison_op expression "🚧" | boolean

expression = number | string | boolean | array | operation | array_expression "👉" emoji_digit+ | emoji_char+

loop = "🔁" statement* "⏹️"

function = "📎" emoji_char* "👉" statement* "⏹️"

io_operation = "📢" | "📥"
```
