import type { CSSProperties, ReactNode } from "react";

type ContainerProps = {
    children: ReactNode;
    style?: CSSProperties;
};

export function Container({ children, style }: ContainerProps) {
    return (
        <div
            style={{
                background: "#fff",
                border: "1px solid #e8e8e5",
                borderRadius: 10,
                padding: 6,
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                ...style,
            }}
        >
            {children}
        </div>
    );
}