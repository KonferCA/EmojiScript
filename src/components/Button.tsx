import { FC, MouseEventHandler } from "react";

export interface ButtonProps {
    text: string;
    onClick?: MouseEventHandler;
}
const Button: FC<ButtonProps> = ({ text, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="transition rounded border border-gray-300 py-2 px-4 font-medium hover:bg-gray-50 active:bg-gray-100"
        >
            {text}
        </button>
    );
};

export { Button };
