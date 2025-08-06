import React from "react";
import { ButtonWrapper } from "./styles";


export interface ButtonProps {
    highlight?: boolean;
    onClick?: () => void;
    label: string;
    disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ highlight, onClick, label, disabled }) => {
    return (
        <ButtonWrapper highlight={highlight} onClick={onClick} disabled={disabled}>
            {label}
        </ButtonWrapper>
    );
};

export default Button;
