import styled from "styled-components";
import { colors } from "../../config/constants";

export const SponsorsFieldWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 60px;
    justify-content: center;
    padding: 20px;
    background-color: ${colors.OsogovoBlack};
    @media (min-width: 1200px) {
        max-width: 1360px;
        padding: 80px;
    }
`;

export const SponsorCard = styled.a`
    filter: grayscale(100%);
    width: 220px;
    cursor: pointer;
    display: flex;
    align-items: center;
    img {
        width: 100%;
    }
    &:hover {
        filter: grayscale(0);
        transform: scale(1.2);
    }
`;
