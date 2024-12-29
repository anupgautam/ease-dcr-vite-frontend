import React, { useCallback, useEffect } from "react";
import { Button as MuiButton } from "@mui/material";

export default function SubmitButton(props) {
    const { text, size, color, variant, onClick, backgroundColor, className, disabled } = props;

    const handleKeyDown = useCallback(
        (e) => {
            if (e.key === "Enter" && !disabled) {
                e.preventDefault();
                onClick(e);
            }
        },
        [onClick, disabled]
    );

    useEffect(() => {
        if (!disabled) {
            window.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleKeyDown, disabled]);

    return (
        <MuiButton
            variant={variant || "contained"}
            onClick={onClick}
            className={className}
            // style={!disabled ? { pointerEvents: "none", opacity: 0.6 } : {}}
            // disabled={!disabled}
        >
            {text}
        </MuiButton>
    );
}
