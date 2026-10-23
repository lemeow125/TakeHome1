import { useState } from "react";
import type { ChangeEvent, CSSProperties } from "react";

type TextInputProps = {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    style?: CSSProperties;
};

export function TextInput({
    value,
    onChange,
    placeholder,
    style,
}: TextInputProps) {
    const [focused, setFocused] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) =>
        onChange(e.target.value);

    return (
        <textarea
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            rows={4}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{
                width: "100%",
                minHeight: 88,
                resize: "vertical",
                padding: "10px 12px",
                border: "none",
                outline: "none",
                borderRadius: 6,
                fontSize: 15,
                lineHeight: 1.6,
                fontFamily: "inherit",
                color: "#1f1f1d",
                background: focused ? "#fafaf8" : "transparent",
                transition: "background 140ms ease",
                boxSizing: "border-box",
                ...style,
            }}
        />
    );
}