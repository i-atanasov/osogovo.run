import styled from "styled-components";
import { colors } from "../../config/constants";

export const PopUpWrapper = styled.div`
    z-index: 100;
    padding: 60px 30px;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 40%;
    min-width: 250px;
    border: 1px solid ${colors.RuenOrange};
    border-radius: 1em;
    box-shadow: -2px 5px 5px ${colors.RuenOrange};
    background-color: white;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    color: #011627;
    @media (min-width: 768px) {
        padding: 60px;
    }
    .close-button {
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors.OsogovoBlack};
        color: white;
        padding: 10px;
        cursor: pointer;
    }
`