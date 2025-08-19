import React from "react";
import { Conditions, ContactsContainer, ContactsWrapper, DetailsWrapper, EmailIcon, FacebookIcon, IconFinish, IconRegistration, IconsContainer, IconStart, IconWrapper, InstaIcon, PhoneIcon, Program, Wrapper, Socials, IconText } from "./styles";
import { details } from "../../config/constants";

const DetailsField = () => {
    return (
        <DetailsWrapper>
            <Conditions>
                <h2>{details.conditionsTitle}</h2>
                <p>
                    {details.conditions}
                </p>
                <hr />
                <h2>{details.transportTitle}</h2>
                <p dangerouslySetInnerHTML={{ __html: details.transportFinish }}></p>
                <p dangerouslySetInnerHTML={{ __html: details.transportLuggage }}></p>
            </Conditions>
            <Wrapper>
                <Program>
                    <h2>{details.programTitle}</h2>
                    <IconsContainer>
                        <IconWrapper>
                            <IconRegistration/>
                            <p dangerouslySetInnerHTML={{ __html: details.programRegistration }}></p>
                        </IconWrapper>
                        <IconWrapper>
                            <IconStart/>
                            <p dangerouslySetInnerHTML={{ __html: details.programStart }}></p>
                        </IconWrapper>
                        <IconWrapper>
                            <IconFinish/>
                            <p dangerouslySetInnerHTML={{ __html: details.programEnd }}></p>
                        </IconWrapper>
                    </IconsContainer>
                </Program>
                <ContactsContainer>
                    <h2>Контакти</h2>
                    <ContactsWrapper>
                        <Socials>
                            <IconText><PhoneIcon/><a href={`tel:${details.raceDirPhone}`}>{details.raceDirPhone}</a></IconText>
                            <IconText><EmailIcon/><a href={`mailto:${details.raceDirEmail}`}>{details.raceDirEmail}</a></IconText>
                        </Socials>
                        <Socials>
                            <p>Последвай ни в социалните ни мрежи:</p>
                            <IconText><a href="https://www.facebook.com/OsogovoRun" target="_blank" rel="noopener noreferrer"><FacebookIcon/></a><a href="https://www.instagram.com/explore/search/keyword/?q=%23osogovotrails" target="_blank" rel="noopener noreferrer"><InstaIcon/></a></IconText>
                        </Socials>
                    </ContactsWrapper>  
                </ContactsContainer>
            </Wrapper>
        </DetailsWrapper>
    );
};

export default DetailsField;
