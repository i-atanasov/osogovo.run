import React from "react";
import { SponsorCard, SponsorsFieldWrapper } from "./styles";
import { sponsors } from "../../config/constants";

const SponsorsField = () => {
    return (
        <SponsorsFieldWrapper>
            {sponsors.map((sponsor) => (
                <SponsorCard href={sponsor.url} key={sponsor.name}>
                    <img src={sponsor.logo} alt={sponsor.name} />
                </SponsorCard>
            ))}
        </SponsorsFieldWrapper>
    );
}

export default SponsorsField;
