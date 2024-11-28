import { useState } from 'react';
import { Lexer, TokenType } from '../lib/lexer/lexer';

const EXAMPLE_CODE = `🔢 number1️⃣ 1️⃣
📝 greeting 👋
🏁 isTrue ✅

📦 1️⃣ 2️⃣ 3️⃣ 📦

1️⃣ ➕ 2️⃣
3️⃣ ➖ 4️⃣
5️⃣ ✖️ 6️⃣
7️⃣ ➗ 8️⃣

🤔 🚧 number1️⃣ 📈 5️⃣ 🚧
    📢 bigger
💭
    📢 smaller
⏹️

⬆️ 1️⃣
⬇️
🔄
🔀

📎 myFunc 👉
    📢 hello
⏹️`;

export function LexerIDE() {
    const [code, setCode] = useState(EXAMPLE_CODE);
    const [output, setOutput] = useState('');

    const runLexer = () => {
        try {
            const lexer = new Lexer(code);
            const tokens = [];
            
            while (!lexer.end()) {
                const token = lexer.next();
                tokens.push({
                    ...token,
                    type: TokenType[token.type] // Convert type number to string name
                });
            }
            
            setOutput(JSON.stringify(tokens, null, 2));
        } catch (error: unknown) {
            if (error instanceof Error) {
                setOutput(`Error: ${error.message}`);
            } else {
                setOutput('An unknown error occurred');
            }
        }
    };

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">EmojiScript Lexer IDE</h1>
            
            <div className="mb-4">
                <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full h-48 p-2 font-mono bg-gray-800 text-white rounded"
                    placeholder="Enter your EmojiScript code here..."
                />
            </div>
            
            <button
                onClick={runLexer}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Run Lexer
            </button>
            
            <div className="mt-4">
                <h2 className="text-xl font-bold mb-2">Output:</h2>
                <pre className="p-4 bg-gray-800 text-white rounded overflow-auto">
                    {output || 'No output yet'}
                </pre>
            </div>
        </div>
    );
} 