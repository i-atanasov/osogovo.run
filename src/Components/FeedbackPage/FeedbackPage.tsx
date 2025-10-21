import React from "react";
import { HomeContainer } from "../Home/styles";
import { HeaderComponent } from "../Header/Header";

export const IframeFeedback: React.FC = () => {
    return (
        <HomeContainer>
            <HeaderComponent hideDate image='https://pvmolqp98bhv9my7.public.blob.vercel-storage.com/start26.jpg' />
            <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSes7dT7h9xyD0MP0gEl7RbgZ8zJ1atXdn-e7K6wdkwUXgufQw/viewform?embedded=true" width="100%" height="1000px" >Зарежда се…</iframe>
        </HomeContainer>
    );
}