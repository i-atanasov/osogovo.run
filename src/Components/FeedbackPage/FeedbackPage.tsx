import React from "react";
import { HomeContainer } from "../Home/styles";
import { HeaderComponent } from "../Header/Header";

export const IframeFeedback: React.FC = () => {
    return (
        <HomeContainer>
            <HeaderComponent hideDate image='https://pvmolqp98bhv9my7.public.blob.vercel-storage.com/feedback-cover-2026.jpeg' />
            <iframe src="https://docs.google.com/forms/d/e/1FAIpQLScBqZO6AvJGrjetff2S5VQEFwQnsAX4AvdVr-x374GFz6Ik8Q/viewform?embedded=true" width="100%" height="1000px">Зарежда се…</iframe>
        </HomeContainer>
    );
}