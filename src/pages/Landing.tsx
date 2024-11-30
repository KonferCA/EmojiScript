import { EmojiScriptEditor } from "@/components";
import { useState } from "react";

const emojiTitle = "🖥️👩‍💻👨‍💻👴‍💻👵‍💻👦‍💻👧‍💻📝🔮✨🎨🚀💫🌈🎯";
const normalTitle = "EmojiScript - Made for EVERYONE";

const Landing = () => {
    const [title, setTitle] = useState(normalTitle);

    return (
        <div className="space-y-4">
            <h1
                className="text-center text-xl font-bold"
                onMouseOver={() => setTitle(emojiTitle)}
                onMouseLeave={() => setTitle(normalTitle)}
            >
                {title}
            </h1>

            <div className="p-4">
                <EmojiScriptEditor />
            </div>
        </div>
    );
};

export { Landing };
