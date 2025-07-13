import styled from "styled-components";
import { colors } from "../../config/constants";

export const CourseFieldWrapper = styled.div`
    display: flex;
    max-width: 1560px;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    padding-bottom: 40px;
    img.course-profile {
        width: 80%;
        max-width: 1260px;
    }
`;

export const CourseDescriptionWrapper = styled.div`
    display: flex;
    flex-direction: column;
    padding-bottom: 40px;
    @media (min-width: 1200px) {
        max-width: 615px;
    }
`

export const CourseDescription = styled.div`
    display: flex;
    flex-direction: column;
    color: ${colors.OsogovoBlack};
    text-align: left;
    padding: 0 40px;;
    h2 {
        color: ${colors.RuenOrange};
        font-size: 32px;
        font-family: 'Oswald', sans-serif;
        font-weight: 500;
        margin: 20px 0;
    }
    p {
        margin: 0 auto 40px;
    }
    @media (min-width: 768px) {
    }
`

export const FeeDescription = styled(CourseDescription)`
    background: ${colors.RuenOrange};
    color: white;
    padding: 0 40px;
    font-family: 'Oswald', sans-serif;
    h2 {
        text-align: left;
        color: ${colors.OsogovoBlack};
        margin: 15px 0 0;
        font-weight: 500;
    }
    table {
        width: 100%;
        text-align: left;
    }
    tr {
        display: inline-flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 20px 40px 20px 0;
    }
    th {
        border-bottom: 1px solid ${colors.OsogovoBlack};
    }
    td {
        color: ${colors.OsogovoBlack};
        font-size: 16px;    
        > span {
            font-weight: 500;
            color: white;
            font-size: 24px;
            padding: 10px 5px 0 0;
    }
`

export const MapWrapper = styled.div`
    padding: 10px;
    @media (min-width: 1200px) {
        padding: 40px;
    }
    iframe {
        width: 80vw;
        height: 60vw;
        @media (min-width: 1200px) {
            width: 40vw;
            height: 30vw;
            max-width: 640px;
            max-height: 480px;
        }
    }
`