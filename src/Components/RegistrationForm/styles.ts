import styled from "styled-components"
import { colors } from "../../config/constants"
import { ButtonWrapper } from "../Button/styles"
import { Header } from "../Header/styles"

export const RegistrationFormWrapper = styled.div<{ distance?: number }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: ${colors.OsogovoBlack};
    color: white;
    > form {
        display: flex;
        flex-direction: column;
        width: 100%;
        max-width: 1200px;
        gap: 10px;
        padding: 20px;
    }
    ${Header} > img {
        //to do
    }
`

export const FormWrapper = styled.div<{ success?: boolean }>`
    position: absolute;
    background-color: ${props => props.success ? 'transparent' : 'white'};
    top: 450px;
    max-width: 1160px;
    padding: 40px;
    width: 60vw;
    @media (min-width: 768px) {
        width: 80vw;
        top: 550px;
    }
    @media (min-width: 1200px) {
        top: 700px;
    }
    > h1, a {
        color: ${colors.RuenOrange};
    }
    a {
        cursor: pointer;
        padding: 20px 0;
        text-decoration: none;
        &:hover {
            text-decoration: underline;
            filter: brightness(0.6);
            transition: all 0.3s ease-in-out;
        }
    }
    p {
        font-family: 'Oswald-Light', sans-serif;
        font-size: 15px;
        color: #30332F;
        line-height: normal;
    }
    label {
        color: #666666;
        font-family: 'Oswald', sans-serif;
        font-size: 20px;
        line-height: 18px;
        padding-bottom: 16px;
        margin-top: 20px;
    }   
    input, select, textarea {
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 20px;
        line-height: 24px;
        font-family: 'Oswald', sans-serif;
        color: #666666;
        -webkit-transition: 0.5s;
        transition: 0.5s;
        &::placeholder {
            font-weight: 100;
            color: #666;
            font-family: 'Noto Sans', sans-serif;
            opacity: 0.4;
        }
        &:focus {
            border-color: ${colors.RuenOrange};
            outline: none;
        }
    }
    input {
        height: 32px;
    }
    .checkbox-label {
        position: relative;
        > p {
            margin: 0 0 0 40px;
        }
        input {
            position: absolute;
            opacity: 0;
            cursor: pointer;
            height: 0;
            width: 0;
        }
        .checkmark {
            position: absolute;
            top: 0;
            left: 0;
            height: 24px;
            width: 24px;
            margin: 5px;
            background-color: white;
            border: 1px solid #ccc;
            border-radius: 4px;
        }
        &:hover input ~ .checkmark {
            filter: brightness(0.95);
            border-color: ${colors.RuenOrange};
            transition: all 0.3s ease-in-out;
        }
        input:checked ~ .checkmark {
            background-color: white;
        }
        .checkmark:after {
            content: "";
            position: absolute;
            visibility: hidden;
            opacity: 0;
            transition: all 0.3s ease-in-out;
        }
        input:checked ~ .checkmark:after {
            visibility: visible;
            opacity: 1;
            transition: all 0.6s ease-in-out;
        }
        .checkmark:after {
            left: 9px;
            top: 2px;
            width: 6px;
            height: 15px;
            border: solid ${colors.RuenOrange};
            border-width: 0 2px 2px 0;
            -webkit-transform: rotate(45deg);
            -ms-transform: rotate(45deg);
            transform: rotate(45deg);
        }
    }
    .error {
        color: ${colors.RuenOrange};
        font-size: 14px;
        font-family: 'Oswald', sans-serif;
        font-weight: normal;
        max-width: 300px;
        margin-bottom: 15px;
    }
    }
    .server {
        margin: 15px 0;
        padding: 12px;
        background-color: #ffe6e6;
        border-radius: 4px;
        border-left: 4px solid ${colors.RuenOrange};
    }
    > form {
        position: relative;
    }
    ${ButtonWrapper} {
        margin: 20px 0;
    }
`

export const ImageBackground = styled.div<{ image?: string }>`
    background-image: url(${props => props.image || ''});
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    width: 100%;
    height: 100%;
    position: absolute;
    top: -100px;
    left: 0;
`

export const FormSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    @media (min-width: 768px) {
        width: 46%;
    }
`

export const FormFields = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    @media (min-width: 768px) {
        gap: 40px;
    }
`

export const FormResult = styled.div`
    background-color: white;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 20px;
    min-height: 400px;
    > h2, p {
        margin: 20px 0;
        color: ${colors.OsogovoBlack};
    }
`

export const PaymentActions = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-top: 24px;

    ${ButtonWrapper} {
        margin: 0;
        transform: none;
    }
`

export const Price = styled.div`
    color: ${colors.RuenOrange};
    font-size: 24px;
    font-family: 'Oswald', sans-serif;
    font-weight: 500;
    margin: 20px 0;
    text-align: left;
`

export const IBANWrapper = styled.div`
    color: ${colors.OsogovoBlack};
    font-size: 16px;
    font-family: 'Oswald', sans-serif;
    font-weight: 400;
    margin: 20px 0;
    text-align: left;
    p {
        margin: 5px 0;
    }
`

export const TShirtSelector = styled.div`
    display: grid;
    gap: 16px;
    grid-template-columns: 1fr;
`

export const TShirtCardButton = styled.button<{ selected?: boolean; grayscale?: boolean }>`
    border: ${props => props.selected ? `2px solid ${colors.RuenOrange}` : '2px solid transparent'};
    border-radius: 12px;
    background: transparent;
    display: block;
    position: relative;
    width: 100%;
    padding: 10px;
    cursor: pointer;
    text-align: left;
    color: ${colors.OsogovoBlack};
    transition: border-color 0.2s ease;

    .cta {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        z-index: 3;
        padding: 10px 14px;
        border-radius: 999px;
        background: rgba(48, 51, 47, 0.85);
        color: #fff;
        font-family: 'Oswald', sans-serif;
        font-size: 16px;
        letter-spacing: 0.3px;
        opacity: 1;
        pointer-events: none;
    }

    img {
        display: block;
        width: 100%;
        aspect-ratio: 1 / 1;
        min-height: 220px;
        object-fit: cover;
        border-radius: 10px;
        overflow: hidden;
        background: #f8f8f8;
        border: 1px solid #e7e7e7;
        filter: ${props => props.grayscale ? 'grayscale(1)' : 'none'};
        &:hover {
            filter: none;
        }
    }

    .caption {
        display: block;
        margin-top: 10px;
        font-family: 'Oswald', sans-serif;
        font-size: 16px;
        color: ${colors.OsogovoBlack};
    }
`

export const TShirtSizes = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 8px;
`

export const TShirtSizeButton = styled.button<{ selected?: boolean }>`
    min-width: 54px;
    padding: 8px 12px;
    border-radius: 999px;
    border: 1px solid ${props => props.selected ? colors.RuenOrange : '#cfcfcf'};
    background: ${props => props.selected ? colors.RuenOrange : '#fff'};
    color: ${props => props.selected ? '#fff' : colors.OsogovoBlack};
    font-family: 'Oswald', sans-serif;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        border-color: ${colors.RuenOrange};
    }
`