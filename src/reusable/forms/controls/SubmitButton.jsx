import React, { useCallback, useEffect } from "react";
import { Button as MuiButton } from "@mui/material";

export default function SubmitButton(props) {
    const { text, size, color, variant, onClick, backgroundColor, className, disabled } = props;

    //! Disable true = validation error 
    //! Disable false = true  

    const handleKeyDown = useCallback(
        (e) => {
            // Only handle Enter key if the button is not disabled
            if (e.key === "Enter" && !disabled) {
                e.preventDefault();
                onClick(e); // Trigger onClick if enabled
            } else if (e.key === "Enter" && disabled) {
                e.preventDefault(); // Prevent Enter action when disabled
                console.log("Button is disabled. Enter key is blocked.");
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

    const handleClick = (e) => {
        if (!disabled) {
            onClick(e);
        }
    };

    return (
        <MuiButton
            variant={variant || "contained"}
            onClick={handleClick}
            className={className}
            style={{
                opacity: disabled ? 0.6 : 1,  // Reduce opacity when disabled
                pointerEvents: disabled ? "none" : "auto",  // Disable pointer events when disabled
            }}
            disabled={disabled}
        >
            {text}
        </MuiButton>
    );
}
