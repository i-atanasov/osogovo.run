import styled from "styled-components";
import { colors } from "../../config/constants";

export const DetailsWrapper = styled.div`
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    max-width: 1560px;
    font-family: 'Oswald', sans-serif;
    h2 {
        font-size: 32px;
        font-weight: 500;
        margin: 0;
    }
    p {
        font-size: 20px;
    }
    @media (min-width: 1200px) {
        flex-direction: row;
    }
`

export const Conditions = styled.div`
    flex-grow: 0.8;
    flex-basis: 0;
    background: linear-gradient(to bottom, #EA2B25, ${colors.RuenOrange} 80%);
    color: white;
    text-align: left;
    padding: 40px;
    > h2 {
        color: ${colors.OsogovoBlack};
        line-height: 75%;
    }
    > p:first-child {
        min-height: 240px;
        @media (min-width: 1200px) {
            min-height: unset;
        }
    }
    > hr {
        margin: 40px 0;
    }
    @media (min-width: 1200px) {
        max-width: 600px;
        padding: 80px 80px 160px 80px;
    }
    position: relative;
    &:after {
        content: '';
        position: absolute;
        bottom: 0;
        right: 0;
        height: 120px;
        width: 0;
        @media (min-width: 482px) {
            width: 100%;
        }
        background: linear-gradient(-5deg, #f0f0f0 0 50%, ${colors.RuenOrange} 50% 100%);
        @media (min-width: 1200px) {    
            background: linear-gradient(-5deg, ${colors.OsogovoBlack} 0 50%, ${colors.RuenOrange} 50% 100%);
        }
    }
`

export const Program = styled.div`
    display: flex;
    flex-direction: column;
    max-width: 600px;
    padding: 40px;
    > h2 {
        color: ${colors.RuenOrange};
    }
    @media (min-width: 1200px) {
        padding: 80px;
        padding-bottom: 0px;
    }
`

export const IconsContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    padding: 40px 0 0;
    @media (min-width: 482px) {
        flex-direction: row;
        align-items: flex-start;
    }
`

export const IconWrapper = styled.div`
    display: flex;
    flex-direction: column;
    max-width: 200px;
    flex-grow: 1;
    flex-basis: 0;
    align-items: center;
    > p {
        text-align: center;
        font-weight: 100;
        line-height: 25px;
        letter-spacing: 0px;
        overflow: hidden;
    }
`

export const IconRegistration = styled.div`
    content: url(https://pvmolqp98bhv9my7.public.blob.vercel-storage.com/registration.svg);
    width: 94px;
`

export const IconStart = styled.div`
    content: url(https://pvmolqp98bhv9my7.public.blob.vercel-storage.com/start.svg);
    width: 94px;
`

export const IconFinish = styled.div`
    content: url(https://pvmolqp98bhv9my7.public.blob.vercel-storage.com/finish.svg);
    width: 94px;
`

export const ContactsContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 0.75;
    flex-basis: 0;
    padding: 20px 20px 10px 20px;
    background-color: ${colors.OsogovoBlack};
    color: ${colors.RuenOrange};
    @media (min-width: 1200px) {
        max-width: 600px;
        padding: 80px 80px 40px 80px;
    }
`

export const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex-grow: 1;
    flex-basis: 0;
    position: relative;
`

export const ContactsWrapper = styled.div`
    display: flex;
    flex-direction: column;
    padding: 20px 0;
    gap: 40px;
    @media (min-width: 1200px) {
        flex-direction: row;
    }
`

export const FilteredIcon = styled.div`
    padding: 10px 10px 10px 0;
    width: 28px;
`

export const PhoneIcon = styled(FilteredIcon)`
    content: url(https://pvmolqp98bhv9my7.public.blob.vercel-storage.com/phone.svg);
`

export const EmailIcon = styled(FilteredIcon)`
    content: url(https://pvmolqp98bhv9my7.public.blob.vercel-storage.com/letter.svg);
`

export const InstaIcon = styled(FilteredIcon)`
    content: url(https://pvmolqp98bhv9my7.public.blob.vercel-storage.com/insta.svg);
    margin: 15px 0 0 20px;
    &:hover {
        filter: brightness(0) saturate(100%) invert(100%) sepia(100%) saturate(0%) hue-rotate(305deg) brightness(103%) contrast(103%);
    }
`

export const FacebookIcon = styled(FilteredIcon)`
    content: url(https://pvmolqp98bhv9my7.public.blob.vercel-storage.com/fb.svg);
    margin: 15px 0 0;
    &:hover {
        filter: brightness(0) saturate(100%) invert(50%) sepia(95%) saturate(4603%) hue-rotate(351deg) brightness(99%) contrast(89%);
    }
`

export const Socials = styled.div`
    display: flex;
    flex-direction: column;
    max-width: 100%;
    span, p {
        font-weight: 100;
        font-size: 24px;
        font-family: 'Oswald', sans-serif;
        color: white;
        margin: 0;
    }
`

export const IconText = styled.div`
    display: flex;
    align-items: center;
`