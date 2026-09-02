import styled from 'styled-components';
import { CountdownUnit, RaceCountdownWrapper } from '../RaceCountdown/styles';

export const Header = styled.header<{ video?: string; image?: string }>`
    color: white;
    width: 100%;
    text-align: center; 
    height: 300px;
    position: relative;
    z-index: auto;
    background: transparent;
    ${props => (props.video || props.image) && `
        @media (min-width: 768px) {
            height: 400px;
        }
        @media (min-width: 1200px) {
            height: 500px;
        }
        background-color: white;
    `}
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
        height: 300px;
        width: 80vw;
        width: 100%;
        object-fit: cover;
        @media (min-width: 768px) {
            height: 400px;
        }
        @media (min-width: 1200px) {
            height: 500px;
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
            bottom: 30px;
            left: 0;
        }
    `}

    ${RaceCountdownWrapper} {
        border: none;
        width: 60%;
        background: transparent;
        margin: 0;
        border-radius: 0;
        h2 {
            display: none;
        }
        ${CountdownUnit} {
            background: transparent;
            > span {
                color: white;
            }
        }
    }
`

export const CountdownWrapper = styled.div`
    width: 30%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: transparent;
    position: absolute;
    bottom: 0;
    right: 0;
    z-index: 1;
`;

export const Logo = styled.a<{ top?: string, left?: string }>`
    position: absolute;
    top: ${props => props.top ? props.top : '20px'};
    left: ${props => props.left ? props.left : '80px'};
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

export const MenuWrapper = styled.div`
    position: fixed;
    top: max(20px, env(safe-area-inset-top));
    right: max(20px, env(safe-area-inset-right));
    z-index: 1000;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    font-family: 'Oswald', sans-serif;
`;

export const MenuButton = styled.button`
    width: 48px;
    height: 48px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(255, 255, 255, 0.7);
    border-radius: 50%;
    background: rgba(48, 51, 47, 0.72);
    color: white;
    cursor: pointer;
    backdrop-filter: blur(8px);
    transition: background 0.2s ease, border-color 0.2s ease;

    &:hover {
        background: rgba(239, 82, 35, 0.92);
        border-color: white;
    }
`;

export const MenuIcon = styled.span`
    position: relative;
    width: 22px;
    height: 2px;
    border-radius: 2px;
    background: currentColor;

    &:before,
    &:after {
        content: '';
        position: absolute;
        left: 0;
        width: 22px;
        height: 2px;
        border-radius: 2px;
        background: currentColor;
    }

    &:before {
        top: -7px;
    }

    &:after {
        top: 7px;
    }
`;

export const MenuDropdown = styled.nav`
    z-index: 20;
    width: min(82vw, 280px);
    margin-top: 10px;
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 2px;
    border: 1px solid rgba(48, 51, 47, 0.14);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.96);
    box-shadow: 0 18px 50px rgba(0, 0, 0, 0.18);
`;

export const MenuItem = styled.a`
    display: flex;
    align-items: center;
    min-height: 42px;
    padding: 0 14px;
    border-radius: 6px;
    color: #30332F;
    font-size: 18px;
    line-height: 1.1;
    text-align: left;
    text-decoration: none;
    text-transform: uppercase;

    &:hover,
    &:focus-visible {
        background: #ef5223;
        color: white;
        outline: none;
    }
`;

export const LanguageSwitcher = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
    min-height: 38px;
    padding: 8px 14px 2px;
    color: #30332F;
    font-size: 16px;
`;

export const LanguageButton = styled.button<{ active?: boolean }>`
    border: 0;
    padding: 0;
    background: transparent;
    color: ${props => props.active ? '#ef5223' : '#30332F'};
    cursor: pointer;
    font-family: inherit;
    font-size: 16px;
    font-weight: ${props => props.active ? 700 : 400};

    &:hover,
    &:focus-visible {
        color: #ef5223;
        outline: none;
    }
`;

export const LanguageSeparator = styled.span`
    color: rgba(48, 51, 47, 0.42);
`;

export const Date = styled.div`
    position: absolute;
    font-family: 'Oswald', sans-serif;
    font-size: 36px;
    bottom: 60px;
    left: 20px;
    font-weight: bold;
    color: #FFF;
    text-align: left;
    line-height: 36px;
    text-transform: uppercase;
    -webkit-text-fill-color: transparent;
    text-fill-color: transparent;
    -webkit-text-stroke: 2px;
    text-stroke: 2px;
    @media (min-width: 1200px) {
        font-size: 96px;
        line-height: 96px;
        -webkit-text-stroke: 3px;
        text-stroke: 3px;
    }
`;
