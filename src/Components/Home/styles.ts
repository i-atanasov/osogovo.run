import styled from "styled-components";

export const HomeContainer = styled.div`
    background-color: #f0f0f0;
    color: #333;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .route-svg {
        animation: 2s fadeIn;
            animation-fill-mode: forwards;
            visibility: hidden;
        }
        @keyframes fadeIn {
            99% {
                visibility: hidden;
            }
            100% {
                visibility: visible;
            }
    }
`;

export const ProductFieldWrapper = styled.div`
    width: 100%;
`

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
    > h1 {
        position: absolute;
        font-size: 20px;
        top: 10px;
        padding: 0 5vw 0;
        @media (min-width: 768px) {
            padding: 0 5vw 0;

        }
        text-align: left;
        margin: 0 auto;
        @media (min-width: 768px) {
            top: 80px;
            font-size: 40px;
            margin: 0 auto 0 0;
        }
        @media (min-width: 1200px) {
            font-size: 80px;
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

export const AnimatedSign = styled.span<{ delay?: string, top?: string, left?: string, color?: string }>`
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
    @media (min-width: 768px) {
        font-size: 12px;
    }
    @media (min-width: 1200px) {
        font-size: 16px;
    }
    span {
        text-wrap: nowrap;
    }
    animation: fadeIn ${props => props.delay || '4s'} forwards;
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