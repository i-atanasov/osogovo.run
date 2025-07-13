import styled from "styled-components";
import { colors } from "../../config/constants";

export const ProductBoxWrapper = styled.div`    
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: white;
    color: black;
    width: 90%;
    height: 650px;
    max-width: 400px;
    overflow: hidden;
    @media (min-width: 768px) {
        width: 70%;
    }
    @media (min-width: 1200px) {
        width: 30%;
    }
    > a.gpx-path {
        color: ${colors.RuenOrange};
        padding: 25px;
        font-family: 'Oswald', sans-serif;
        font-weight: 500;
        position: relative;
    }
    > a.gpx-path:hover {
        color: black;
        text-decoration: none;
        &:after {
            content: 'Очаквайте скоро';
            position: absolute;
            width: 130%;
            height: 25px;
            border-radius: 5px;
            padding: 5px 10px;
            background-color: grey;
            color: white;
            font-family: 'Oswald', sans-serif;
            left: 90%;
            top: 25%;
            transform: translateX(0);
            transition: transform 0.3s ease-in-out;
        }
    }
`

export const ImageWrapper = styled.div`
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 230px;
    > img {
        object-fit: cover;
        scale: 1.2;
        height: 100%;
        width: 100%;
        position: relative;
        filter: brightness(0.6);
    }
    &:hover {
        scale: 1.1;
        transition: scale 0.3s ease-in-out;
    }
`

export const DistanceSign = styled.span`
    position: absolute;
    font-family: 'Oswald', sans-serif;
    font-weight: 500;
    font-size: 96px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
`

export const TextWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 26px 16px;
    font-family: 'Oswald', sans-serif;
    p {
        margin: 0;
        line-height: 35px;
    }
    p.highlight {
        color: ${colors.RuenOrange};
    }
`