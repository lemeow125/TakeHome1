import { useState } from "react";
import type { ButtonHTMLAttributes, CSSProperties } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "ghost";
};

export function Button({
    variant = "primary",
    style,
    disabled,
    ...rest
}: ButtonProps) {
    const [hovered, setHovered] = useState(false);
    const isGhost = variant === "ghost";

    const base: CSSProperties = {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: isGhost ? "6px 12px" : "9px 16px",
        borderRadius: isGhost ? 6 : 8,
        border: "1px solid transparent",
        fontSize: isGhost ? 13 : 14,
        fontWeight: 500,
        fontFamily: "inherit",
        letterSpacing: "-0.01em",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition:
            "background 120ms ease, color 120ms ease, border-color 120ms ease",
        ...(isGhost
            ? {
                background: hovered && !disabled ? "#efefec" : "transparent",
                color: hovered && !disabled ? "#1f1f1d" : "#6b6b68",
                borderColor: hovered && !disabled ? "#e0e0dc" : "transparent",
            }
            : {
                background: hovered && !disabled ? "#000" : "#1a1a1a",
                color: "#fff",
                boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
            }),
        ...style,
    };

    return (
        <button
            style={base}
            disabled={disabled}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            {...rest}
        />
    );
}