import styled from 'styled-components';
import { colors } from '../../config/constants';

export const ButtonWrapper = styled.button<{ highlight?: boolean, disabled?: boolean }>`
    ${props => props.highlight && `
        position: absolute;
        display: none;
        top: 20px;
        right: 20px;
        @media (min-width: 768px) {
            display: block;
        }
    `}
    padding: 20px 30px;
    background-color: ${colors.RuenOrange};
    color: white;
    line-height: 100%;
    border: 1px solid transparent;
    border-radius: 40px;
    text-transform: uppercase;
    font-family: 'Oswald-Bold', sans-serif;
    cursor: pointer;
    font-size: 20px;
    width: fit-content;
    &:hover {
        filter: brightness(0.6);       
        border-color: grey;
    }
    &:active {
        filter: brightness(0.8); 
        color: white;
    }
    &:visited {
        filter: grayscale(1);
    }
    &:disabled {
        background-color: grey;
        cursor: not-allowed;
    }
    transition: all 0.3s ease-in-out;
`;