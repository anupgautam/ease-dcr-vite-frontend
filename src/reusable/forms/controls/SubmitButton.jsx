import React, { useCallback, useEffect } from "react";
import { Button as MuiButton } from "@mui/material";

export default function SubmitButton(props) {
    const { text, size, color, variant, onClick, backgroundColor, className } = props;

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            onClick(e);
        }
    }, [onClick]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);

    return (
        <MuiButton
            variant={variant || "contained"}
            onClick={onClick}
            className={className}
        >
            {text}
        </MuiButton>
    );
}
