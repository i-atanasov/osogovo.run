import styled from 'styled-components';

export const Header = styled.header<{ video?: string; image?: string }>`
    background-color: white;
    color: white;
    width: 100%;
    text-align: center; 
    height: 300px;
    position: relative;
    z-index: 1;
    @media (min-width: 768px) {
        height: 400px;
    }
    @media (min-width: 1200px) {
        height: 500px;
    }
    video {
        width: 100%;
        height: 300px;
        object-fit: cover;
        @media (min-width: 768px) {
            height: 400px;
        }
        @media (min-width: 1200px) {
            height: 500px;
        }
    }
    img {
        width: 100%;
        height: 300px;
        object-fit: cover;
        // padding: 120px 0 40px;
        @media (min-width: 768px) {
            height: 400px;
            // padding: 100px 0 40px;
        }
        @media (min-width: 1200px) {
            width: 100%;
            height: 500px;
            // padding: 120px 40px;
        }
    }
    ${props => props.video && `
        &:before {
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
            box-shadow: inset 0px 50px 80px 0px rgba(0,0,0,0.75);
            top: 0;
            left: 0;
        }
        &:after {
            content: '';
            position: absolute;
            width: 100%;
            height: 30%;
            background: linear-gradient(0deg,rgba(48, 51, 47, 1) 0%, rgba(0, 0, 0, 0) 100%);
            bottom: 0;
            left: 0;
        }
    `}
`

export const Logo = styled.a<{ top?: string, left?: string }>`
    position: absolute;
    top: ${props => props.top ? props.top : '20px'};
    left: ${props => props.left ? props.left : '50%'};
    width: 100px;
    height: 100px;
    transform: translateX(-50%);
    @media (min-width: 768px) {
        top: ${props => props.top ? props.top : '20px'};
        left: ${props => props.left ? props.left : '80px'};
        transform: translateX(-50%);
    }
    background-image: url(https://pvmolqp98bhv9my7.public.blob.vercel-storage.com/osogovo-run-logo.svg);
    background-size: contain;
    background-repeat: no-repeat;
    &:hover {
        filter: brightness(0.6);
    }
    &:active {
        filter: brightness(0.8);
    }
    transition: filter 0.3s ease-in-out;
`;

export const Date = styled.div`
    position: absolute;
    font-family: 'Oswald', sans-serif;
    font-size: 48px;
    bottom: 60px;
    left: 20px;
    font-weight: bold;
    color: #FFF;
    text-align: left;
    line-height: 56px;
    text-transform: uppercase;
    -webkit-text-fill-color: transparent;
    text-fill-color: transparent;
    -webkit-text-stroke: 2px;
    text-stroke: 2px;
    @media (min-width: 1200px) {
        font-size: 128px;
        line-height: 136px;
        -webkit-text-stroke: 3px;
        text-stroke: 3px;
    }
`
