import styled from "styled-components";
import { colors } from "../../config/constants";

export const HomeContainer = styled.div`
    background-color: #f0f0f0;
    color: #333;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

export const AnimationWrapper = styled.div<{ inView: boolean }>`
    animation: ${props => props.inView ? '2s fadeIn' : 'none'};
    animation-fill-mode: forwards;
    visibility: hidden;
    @keyframes fadeIn {
        99% {
            visibility: hidden;
        }
        100% {
            visibility: visible;
        }
    }
`;

export const Footer = styled.footer`
    background-color: ${colors.OsogovoBlack};
    color: white;
    text-align: center;
    padding: 20px;
    padding: 0 80px 40px;
`

export const ProductFieldWrapper = styled.div`
    width: 100%;
`;

export const ProductFieldContainer = styled.div`
    display: flex;
    flex-direction: column;
    background-color: #30332F;
    font-family: 'Oswald', sans-serif;
    position: relative;
    text-transform: uppercase;
    font-weight: 500;
    color: white;
    > div {
        max-height: 80%;
        padding: 20px 5vw 0;
        @media (min-width: 768px) {
            padding: 20px 5vw 0;
        }
        > svg {
            transform: translateY(20%);
        }
    }

    @-webkit-keyframes animate-svg-stroke-1 {
        0% {
            stroke-dashoffset: 1734.71875px;
            stroke-dasharray: 1734.71875px;
        }

        100% {
            stroke-dashoffset: 0;
            stroke-dasharray: 1734.71875px;
        }
    }

    @keyframes animate-svg-stroke-1 {
        0% {
            stroke-dashoffset: 1734.71875px;
            stroke-dasharray: 1734.71875px;
        }

        100% {
            stroke-dashoffset: 0;
            stroke-dasharray: 1734.71875px;
        }
    }

    .svg-elem-1 {
        -webkit-animation: animate-svg-stroke-1 7s cubic-bezier(0.47, 0, 0.745, 0.715) 0s both;
        animation: animate-svg-stroke-1 7s cubic-bezier(0.47, 0, 0.745, 0.715) 0s both;
    }

    @keyframes animate-svg-stroke-2 {
        0% {
            stroke-dashoffset: 110.2027587890625px;
            stroke-dasharray: 110.2027587890625px;
        }

        100% {
            stroke-dashoffset: 0;
            stroke-dasharray: 110px;
        }
    }

    @-webkit-keyframes @keyframes animate-svg-stroke-2 {
        0% {
            stroke-dashoffset: 70.2027587890625px;
            stroke-dasharray: 70.2027587890625px;
        }

        100% {
            stroke-dashoffset: 0;
            stroke-dasharray: 70.2027587890625px;
        }
    }

    .svg-elem-2 {
        -webkit-animation: animate-svg-stroke-2 2s cubic-bezier(0.47, 0, 0.745, 0.715) 4s both;
        animation: animate-svg-stroke-2 2s cubic-bezier(0.47, 0, 0.745, 0.715) 4s both;
    }

    @-webkit-keyframes animate-svg-stroke-5 {
        0% {
            stroke-dashoffset: 114.6722412109375px;
            stroke-dasharray: 114.6722412109375px;
        }
        100% {
            stroke-dashoffset: 0;
            stroke-dasharray: 114px;
        }
    }

    @keyframes animate-svg-stroke-5 {
        0% {
            stroke-dashoffset: 114.6722412109375px;
            stroke-dasharray: 114.6722412109375px;
        }
        100% {
            stroke-dashoffset: 0;
            stroke-dasharray: 114px;
        }
    }

    .svg-elem-5 {
        color: black;
        -webkit-animation: animate-svg-stroke-5 2s cubic-bezier(0.47, 0, 0.745, 0.715) 5s both;
        animation: animate-svg-stroke-5 2s cubic-bezier(0.47, 0, 0.745, 0.715) 5s both;
    }

    @-webkit-keyframes animate-svg-stroke-7 {
        0% {
            stroke-dashoffset: 90.2027587890625px;
            stroke-dasharray: 90.2027587890625px;
        }

        100% {
            stroke-dashoffset: 0;
            stroke-dasharray: 90.2027587890625px;
        }
    }

    @keyframes animate-svg-stroke-7 {
        0% {
            stroke-dashoffset: 110.30155944824219px;
            stroke-dasharray: 110.30155944824219px;
        }

        100% {
            stroke-dashoffset: 0;
            stroke-dasharray: 110.30155944824219px;
        }
    }

    .svg-elem-7 {
        -webkit-animation: animate-svg-stroke-7 2s cubic-bezier(0.47, 0, 0.745, 0.715) 6s both;
        animation: animate-svg-stroke-7 2s cubic-bezier(0.47, 0, 0.745, 0.715) 6s both;
    }

    @-webkit-keyframes animate-svg-stroke-8 {
        0% {
            stroke-dashoffset: 70.2027587890625px;
            stroke-dasharray: 70.2027587890625px;
        }

        100% {
            stroke-dashoffset: 0;
            stroke-dasharray: 70.2027587890625px;
        }
    }

    @keyframes animate-svg-stroke-8 {
        0% {
            stroke-dashoffset: 70.2027587890625px;
            stroke-dasharray: 70.2027587890625px;
        }

        100% {
            stroke-dashoffset: 0;
            stroke-dasharray: 70.2027587890625px;
        }
    }

    .svg-elem-8 {
        -webkit-animation: animate-svg-stroke-8 2s cubic-bezier(0.47, 0, 0.745, 0.715) 3s both;
        animation: animate-svg-stroke-8 2s cubic-bezier(0.47, 0, 0.745, 0.715) 3s both;
    }
`

export const AnimatedSign = styled.span<{ delay?: string, top?: string, left?: string, color?: string, inView?: boolean }>`
    position: absolute;
    top: ${props => props.top || '50%'};
    left: ${props => props.left || '50%'};
    transform: translate(-50%, -50%);
    font-size: 24px;
    color: ${props => props.color || '#ef5223'};
    text-transform: none;
    text-align: right;
    font-weight: 400;
    font-size: 10px;
    max-width: 45px;
    visibility: hidden;
    font-family: 'Oswald', sans-serif;
    font-weight: 500;
    @media (min-width: 768px) {
        font-size: 12px;
        max-width: 60px;
    }
    @media (min-width: 1200px) {
        font-size: 16px;
    }
    span {
        text-wrap: nowrap;
        font-family: 'Oswald', sans-serif;
        font-weight: 300;
        font-size: 10px;
    }
    animation: ${props => props.inView ? 'fadeIn' : 'none'} ${props => props.delay || '4s'} forwards;
    @keyframes fadeIn {
        99% {
            visibility: hidden;
        }
        100% {
            visibility: visible;
        }
    }
`

export const ProductBoxContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 32px;
    padding: 0 32px;
    flex-direction: row;
    margin-top: -50px;
    @media (min-width: 768px) {
        flex-direction: row;
        margin-top: 0;
        transform: translateY(-5%);
        gap: 64px;
    }
    @media (min-width: 1200px) {
        transform: translateY(-25%);
    }
`

export const CourseWrapper = styled.div`
    display: flex;
`

export const InfoSign = styled.h1<{ inView: boolean }>`
    visibility: ${props => props.inView ? 'visible' : 'hidden'};
    opacity: ${props => props.inView ? '1' : '0'};
    transition: opacity 0.8s ease-in-out;
    transition-delay: 0.4s;
    position: absolute;
    font-size: 20px;
    bottom: 40%;
    right: 0;
    padding: 0 5vw 0;
    @media (min-width: 768px) {
        padding: 0 5vw 0;

    }
    text-align: right;
    margin: 0 auto;
    @media (min-width: 768px) {
        font-size: 40px;
        margin: 0 auto 0 0;
    }
    @media (min-width: 1200px) {
        font-size: 80px;
    }
`;

export const Dimmer = styled.div<{ show: boolean }>`
    display: ${props => props.show ? 'block' : 'none'};
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 99;
`