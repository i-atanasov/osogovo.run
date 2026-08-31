import React from "react";
import { useTranslation } from "react-i18next";
import { Conditions, ContactsContainer, ContactsWrapper, DetailsWrapper, EmailIcon, FacebookIcon, IconFinish, IconRegistration, IconsContainer, IconStart, IconWrapper, InstaIcon, PhoneIcon, Program, Wrapper, Socials, IconText } from "./styles";
import { details } from "../../config/constants";

const DetailsField = () => {
    const { t } = useTranslation();

    return (
        <DetailsWrapper>
            <Conditions id="conditions">
                <h2>{t('home:details.conditionsTitle')}</h2>
                <p>
                    {t('home:details.conditions')}
                </p>
                <hr />
                <h2>{t('home:details.transportTitle')}</h2>
                <p dangerouslySetInnerHTML={{ __html: t('home:details.transportFinish') }}></p>
                <p dangerouslySetInnerHTML={{ __html: t('home:details.transportLuggage') }}></p>
            </Conditions>
            <Wrapper>
                <Program>
                    <h2>{t('home:details.programTitle')}</h2>
                    <IconsContainer>
                        <IconWrapper>
                            <IconRegistration/>
                            <p dangerouslySetInnerHTML={{ __html: t('home:details.programRegistration') }}></p>
                        </IconWrapper>
                        <IconWrapper>
                            <IconStart/>
                            <p dangerouslySetInnerHTML={{ __html: t('home:details.programStart') }}></p>
                        </IconWrapper>
                        <IconWrapper>
                            <IconFinish/>
                            <p dangerouslySetInnerHTML={{ __html: t('home:details.programEnd') }}></p>
                        </IconWrapper>
                    </IconsContainer>
                </Program>
                <ContactsContainer>
                    <h2>{t('home:details.contactsTitle')}</h2>
                    <ContactsWrapper>
                        <Socials>
                            <IconText><PhoneIcon/><a href={`tel:${details.raceDirPhone}`}>{details.raceDirPhone}</a></IconText>
                            <IconText><EmailIcon/><a href={`mailto:${details.raceDirEmail}`}>{details.raceDirEmail}</a></IconText>
                        </Socials>
                        <Socials>
                            <p>{t('home:details.socialsPrompt')}</p>
                            <IconText><a href="https://www.facebook.com/OsogovoRun" target="_blank" rel="noopener noreferrer"><FacebookIcon/></a><a href="https://www.instagram.com/explore/search/keyword/?q=%23osogovotrails" target="_blank" rel="noopener noreferrer"><InstaIcon/></a></IconText>
                        </Socials>
                    </ContactsWrapper>  
                </ContactsContainer>
            </Wrapper>
        </DetailsWrapper>
    );
};

export default DetailsField;
