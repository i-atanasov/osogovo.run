import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegistrationForm from "../RegistrationForm/RegistrationForm";
import Home from "../Home/Home";
import { Participants } from "../Participants/Participants";
import RaceDay from "../RaceDay/RaceDay";
import { IframeResults } from "../IframeResults/IframeResults";
import { IframeFeedback } from "../FeedbackPage/FeedbackPage";

const Router: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        <Home />
                    }
                />
                <Route
                    path="/register"
                    element={<RegistrationForm />}
                />
                <Route
                    path="/participants"
                    element={<Participants />}
                />
                <Route
                    path="/race-day"
                    element={<RaceDay />}
                />
                <Route
                    path="/results"
                    element={<IframeResults />}
                />
                <Route
                    path="/feedback"
                    element={<IframeFeedback />}
                />
            </Routes>
        </BrowserRouter>
    );
};

export default Router;