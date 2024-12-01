import { FC, MouseEventHandler } from "react";
import { twMerge } from "tailwind-merge";

export interface ButtonProps {
    text: string;
    className?: string;
    onClick?: MouseEventHandler;
}
const Button: FC<ButtonProps> = ({ text, className, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={twMerge(
                "transition rounded border border-gray-600 py-2 px-4 font-medium hover:bg-gray-700 active:bg-gray-800",
                className
            )}
        >
            {text}
        </button>
    );
};

export { Button };
