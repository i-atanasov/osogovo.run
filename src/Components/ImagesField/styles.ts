import styled from "styled-components";

export const ImagesFieldWrapper = styled.div`
    display: flex;
    justify-content: center;
    overflow-x: scroll;
    overflow-y: hidden;
    margin: 40px 0 0;
    width: 100%;
    > img {
        width: 100%;
        height: 400px;
        object-fit: cover;
        scale: 1.2;
        aspect-ratio: 1 / 1;
    }
`