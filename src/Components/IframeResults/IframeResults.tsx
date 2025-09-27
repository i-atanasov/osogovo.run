import React from "react";
import { HomeContainer } from "../Home/styles";
import { HeaderComponent } from "../Header/Header";

export const IframeResults: React.FC = () => {
    return (
        <HomeContainer>
            <HeaderComponent video='http://www.osogovo.run/media/osogovo-run-21-sec-low.mp4' />
            <iframe src="https://marathon.bg/osogovo2025r" width="100%" height="2000px" />
        </HomeContainer>
    );
}