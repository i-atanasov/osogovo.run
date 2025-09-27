import styled from "styled-components";
import { colors } from "../../config/constants";

export const ParticipantsWrapper = styled.div`
    min-height: 100vh;
    min-width: 80vw;
    padding: 20px;
    font-family: 'Oswald', sans-serif;
    font-size: 10px;
    @media (min-width: 500px) {
        font-size: 14px;
    }
    @media (min-width: 768px) {
        font-size: 18px;
    }
    > table {
        width: 100%;
        th {
            text-align: left;
        }
    }
    @media (min-width: 768px) {
        max-width: 600px;
    }   
    a {
        text-decoration: none;
        color: ${colors.RuenOrange};
    }
`

export const Paid = styled.td<{ paid: boolean }>`
    color: ${props => props.paid ? "green" : ""};
`

export const TableRow = styled.tr<{ highlighted: boolean }>`
    background-color: ${props => props.highlighted ? colors.RuenOrange : "transparent"};
    color: ${props => props.highlighted ? "white" : colors.OsogovoBlack};
    &:hover {
        background-color: ${colors.RuenOrange}; 
        color: white;
        cursor: pointer;
    }
`