import React from "react";
import { ButtonWrapper } from "./styles";


export interface ButtonProps {
    highlight?: boolean;
    onClick?: () => void;
    label: string;
    disabled?: boolean;
    href?: string;
    className?: string;
}

const Button: React.FC<ButtonProps> = ({ highlight, onClick, label, disabled, href, className }) => {
    return (
        <ButtonWrapper
            as={href ? "a" : "button"}
            className={className}
            disabled={disabled}
            href={href}
            highlight={highlight}
            onClick={onClick}
        >
            {label}
        </ButtonWrapper>
    );
};

export default Button;
