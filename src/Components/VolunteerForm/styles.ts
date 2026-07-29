import styled from 'styled-components';
import { colors } from '../../config/constants';

export const VolunteerFormWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: ${colors.OsogovoBlack};
    color: white;
    > form {
        display: flex;
        flex-direction: column;
        width: 100%;
        max-width: 1200px;
        gap: 10px;
        padding: 20px;
    }
`;

export const ImageBackground = styled.div<{ image?: string }>`
    background-image: url(${props => props.image || ''});
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    width: 100%;
    height: 100%;
    position: absolute;
    top: -100px;
    left: 0;
`;

export const FormSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    @media (min-width: 768px) {
        width: 46%;
    }
    margin-bottom: 20px;
`;

export const VolunteerCounter = styled.div<{ isFull: boolean }>`
    background: ${props => props.isFull ? '#f8d7da' : '#e8f4f8'};
    border: 2px solid ${props => props.isFull ? '#f5c6cb' : '#b8dce8'};
    border-radius: 8px;
    padding: 20px;
    margin: 20px 0;
    text-align: center;

    p {
        font-size: 18px;
        font-weight: 600;
        color: ${props => props.isFull ? '#721c24' : '#004085'};
        margin: 0;
        font-family: 'Oswald', sans-serif;
    }

    strong {
        color: ${props => props.isFull ? '#e74c3c' : '${colors.RuenOrange}'};
        font-size: 24px;
    }
`;
