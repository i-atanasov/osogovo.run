import styled from "styled-components"
import { colors } from "../../config/constants"

export const FormWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    background-color: ${colors.OsogovoBlack};
    color: white;
    min-height: 40vw;
    > form {
        display: none;
    }
`