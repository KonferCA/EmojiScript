import { ReactNode } from "react";

const Card = ({ children }: { children: ReactNode }) => {
    return <div className="rounded border border-gray-600 p-4">{children}</div>;
};

export { Card };
