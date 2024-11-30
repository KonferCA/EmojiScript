import { ChangeEventHandler, useState } from "react";
import { Card } from "./Card";
import { Button } from "./Button";

const EmojiScriptEditor = () => {
    const [code, setCode] = useState("");

    const handleInput: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
        setCode(e.target.value);
    };

    return (
        <Card>
            <h1 className="text-lg font-bold mb-4">EmojiScript Editor</h1>
            <textarea
                value={code}
                onChange={handleInput}
                className="w-full h-64 p-4 font-mono text-lg bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Start typing and the editor will transform everything into emojis!"
                rows={10}
            ></textarea>
            <div className="mt-4">
                <Button text="Clear" onClick={() => setCode("")} />
            </div>
        </Card>
    );
};

export { EmojiScriptEditor };
