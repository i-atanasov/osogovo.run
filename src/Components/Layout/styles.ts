import styled from "styled-components"
import { colors } from "../../config/constants";

export const LayoutContainer = styled.div`
    display: flex;
    flex-direction: column;
    background-color: #f0f0f0;
    color: white;
    min-height: 40vw;
`;

export const Header = styled.header`
    background-color: #282c34;
    color: white;
    text-align: center; 
    height: 400px;
    position: relative;
    @media (min-width: 1200px) {
        height: 600px;
    }
    video {
        width: 100%;
        height: 400px;
        object-fit: cover;
        @media (min-width: 1200px) {
            height: 600px;
        }
    }
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
`

export const Logo = styled.a`
    position: absolute;
    top: 20px;
    left: 50%;
    width: 100px;
    height: 100px;
    transform: translateX(-50%);
    @media (min-width: 768px) {
        top: 20px;
        left: 20px; 
        transform: translateX(0);
    }
    background-image: url(https://pvmolqp98bhv9my7.public.blob.vercel-storage.com/osogovo-run-logo.svg);
    background-size: contain;
    background-repeat: no-repeat;
    &:hover {
        filter: brightness(0.6);
        transform: scale(1.1) ;
    }
    &:active {
        filter: brightness(0.8);
    }
    transition: filter 0.3s ease-in-out, transform 0.3s ease-in-out;
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
    -webkit-text-stroke: 3px;
    @media (min-width: 1200px) {
        font-size: 128px;
        line-height: 136px;
    }
`

export const Footer = styled.footer`
    background-color: ${colors.OsogovoBlack};
    color: white;
    text-align: center;
    padding: 20px;
    position: relative;
    padding: 0 80px 40px;
`