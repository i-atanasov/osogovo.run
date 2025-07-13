import React from "react";
import { ButtonWrapper } from "./styles";


export interface ButtonProps {
    highlight?: boolean;
    onClick?: () => void;
    label: string;
}

const Button: React.FC<ButtonProps> = ({ highlight, onClick, label }) => {
    return (
        <ButtonWrapper highlight={highlight} onClick={onClick}>
            {label}
        </ButtonWrapper>
    );
};

export default Button;
