import styled from 'styled-components';
import { colors } from '../../config/constants';

export const RaceCountdownWrapper = styled.section`
    border: 1px solid rgba(239, 82, 35, 0.28);
    border-radius: 8px;
    background: #fff7f3;
    padding: 18px;
    margin-bottom: 24px;
`

export const CountdownHeader = styled.h2`
    color: ${colors.OsogovoBlack};
    font-family: 'Oswald', sans-serif;
    font-size: 24px;
    font-weight: 500;
    line-height: 1.2;
    margin: 0 0 16px;
`

export const CountdownGrid = styled.div`
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(2, minmax(0, 1fr));

    @media (min-width: 768px) {
        grid-template-columns: repeat(4, minmax(0, 1fr));
    }
`

export const CountdownUnit = styled.div`
    align-items: center;
    background: white;
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 48px;
    padding: 10px;

    strong {
        color: ${colors.RuenOrange};
        font-family: 'Oswald', sans-serif;
        font-size: 24px;
        font-weight: 600;
        line-height: 1;
    }

    span {
        color: ${colors.OsogovoBlack};
        font-family: 'Oswald', sans-serif;
        font-size: 15px;
        line-height: 1.2;
        margin-top: 8px;
        text-align: center;
        text-transform: uppercase;
    }
`