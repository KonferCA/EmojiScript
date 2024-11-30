import {
    ChangeEventHandler,
    KeyboardEventHandler,
    useEffect,
    useRef,
    useState,
} from "react";
import { Card } from "./Card";
import { Button } from "./Button";
import Fuse from "fuse.js";
import { emojiList, EmojiObject } from "@/lib/emojiList";

const EmojiScriptEditor = () => {
    const [code, setCode] = useState("");
    const [suggestions, setSuggestions] = useState<EmojiObject[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [colonIndex, setColonIndex] = useState<number | null>(null);
    const fuseRef = useRef(
        new Fuse(emojiList, {
            keys: ["name"],
        })
    );
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const handleInput: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
        setCode(e.target.value);
    };

    const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
        switch (e.key) {
            case "ArrowDown":
                if (suggestions.length) {
                    e.preventDefault();
                    setSelectedIndex((c) => (c + 1) % suggestions.length);
                }
                break;
            case "ArrowUp":
                if (suggestions.length) {
                    e.preventDefault();
                    setSelectedIndex((c) =>
                        c > 0 ? c - 1 : suggestions.length - 1
                    );
                }
                break;
            case "Enter":
                if (suggestions.length) {
                    e.preventDefault();
                    handleSelect(selectedIndex);
                }
                break;
            case "Escape":
                setSuggestions([]);
                setSelectedIndex(-1);
                break;
            default:
                break;
        }
    };

    const handleSelect = (idx: number) => {
        if (colonIndex !== null && textareaRef.current !== null) {
            const beforeColon = code.slice(0, colonIndex);
            const afterCursor = code.slice(textareaRef.current.selectionStart);
            const emoji = suggestions[idx].emoji;
            const newCode = beforeColon + emoji + afterCursor;
            setCode(newCode);
            setSuggestions([]);
            setSelectedIndex(-1);

            setTimeout(() => {
                textareaRef.current?.focus();
                const newPosition = colonIndex + emoji.length + 1;
                textareaRef.current?.setSelectionRange(
                    newPosition,
                    newPosition
                );
            }, 0);
        }
    };

    useEffect(() => {
        const cursorPos = textareaRef.current?.selectionStart || 0;
        const textBeforeCursor = code.slice(0, cursorPos);
        const colonPos = textBeforeCursor.lastIndexOf(":");
        if (colonPos !== -1 && !textBeforeCursor.includes(" ", colonPos)) {
            const searchTerm = textBeforeCursor
                .slice(colonPos + 1)
                .toLowerCase();

            if (searchTerm.length > 0) {
                const matches = fuseRef.current.search(searchTerm, {
                    limit: 5,
                });
                setSuggestions(matches.map((m) => m.item));
                setSelectedIndex((c) => (c === -1 ? 0 : c));
                setColonIndex(colonPos);
            } else {
                setSuggestions([]);
                setSelectedIndex(-1);
                setColonIndex(null);
            }
        } else {
            setSuggestions([]);
            setSelectedIndex(-1);
            setColonIndex(null);
        }
    }, [code]);

    return (
        <Card>
            <h1 className="text-lg font-bold mb-4">EmojiScript Editor</h1>
            <textarea
                ref={textareaRef}
                value={code}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                className="w-full h-64 p-4 font-mono text-lg bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Start typing and the editor will transform everything into emojis!"
                rows={10}
            ></textarea>
            {suggestions.length > 0 && (
                <div className="mt-1 bg-white border rounded shadow-lg">
                    {suggestions.map((item, idx) => (
                        <button
                            key={item.name}
                            onClick={() => handleSelect(idx)}
                            className={`w-full px-4 py-2 text-left flex items-center space-x-2 ${idx === selectedIndex ? "bg-blue-50" : "hover:bg-gray-100"}`}
                        >
                            <span>{item.emoji}</span>
                            <span className="text-gray-600">{item.name}</span>
                        </button>
                    ))}
                </div>
            )}
            <div className="mt-4">
                <Button text="Clear" onClick={() => setCode("")} />
            </div>
        </Card>
    );
};

export { EmojiScriptEditor };
