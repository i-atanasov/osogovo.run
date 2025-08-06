import styled from "styled-components"
import { colors } from "../../config/constants"
import { ButtonWrapper } from "../Button/styles"

export const RegistrationFormWrapper = styled.div`
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
    > h1 {
        color: ${colors.RuenOrange};
    }
    p {
        font-family: 'Oswald-Light', sans-serif;
        font-size: 15px;
        color: #30332F;
        line-height: normal;
        margin: 0 0 20px 50px;
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
        }
    }
    input {
        height: 32px;
    }
    .checkbox-label {
        position: relative;
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
        // @media (min-width: 768px) {
        //     margin-top: -30px;
        // }
    }
    .server {
        margin: 0;
            transform: translateY(-100%);
        @media (min-width: 768px) {
        }
    }
    > form {
        position: relative;
    }
    ${ButtonWrapper} {
        margin: 20px 0;
        @media (min-width: 768px) {
            transform: translateY(-100%);
        }
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
    top: 100px;
    left: 0;
    @media (min-width: 768px) {
        top: 150px;
    }
    @media (min-width: 1200px) {
        top: 300px;
    }
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
    background-color: ${colors.RuenOrange};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    min-height: 400px;
`

export const Price = styled.div`
    color: ${colors.RuenOrange};
    font-size: 24px;
    font-family: 'Oswald', sans-serif;
    font-weight: 500;
    margin: 20px 0;
    text-align: left;
`