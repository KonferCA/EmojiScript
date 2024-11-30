import { EmojiScriptEditor } from "@/components";
import { useState } from "react";
import { Link } from "react-router-dom";

const emojiTitle = "🖥️👩‍💻👨‍💻👴‍💻👵‍💻👦‍💻👧‍💻📝🔮✨🎨🚀💫🌈🎯";
const normalTitle = "EmojiScript 🤪📝";

const links = [{ text: "Lexer IDE", route: "/lexer" }];

const Landing = () => {
    const [title, setTitle] = useState(normalTitle);

    return (
        <div className="space-y-4">
            <nav className="flex justify-between px-10 py-2 border-b border-gray-600">
                <h1
                    className="font-bold"
                    onMouseOver={() => setTitle(emojiTitle)}
                    onMouseLeave={() => setTitle(normalTitle)}
                >
                    {title}
                </h1>

                <ul>
                    {links.map((l) => (
                        <li key={l.route}>
                            <Link to={l.route}>{l.text}</Link>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="p-4">
                <EmojiScriptEditor />
            </div>
        </div>
    );
};

export { Landing };
