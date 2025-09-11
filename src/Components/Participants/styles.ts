import styled from "styled-components";

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
`

export const Paid = styled.td<{ paid: boolean }>`
    color: ${props => props.paid ? "green" : ""};
`