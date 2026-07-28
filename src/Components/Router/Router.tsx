import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegistrationForm from "../RegistrationForm/RegistrationForm";
import PaymentSuccessPage from "../RegistrationForm/PaymentSuccessPage";
import PaymentCancelPage from "../RegistrationForm/PaymentCancelPage";
import PaymentRequestPage from "../RegistrationForm/PaymentRequestPage";
import RetryPaymentPage from "../RegistrationForm/RetryPaymentPage";
import Home from "../Home/Home";
import { Participants } from "../Participants/Participants";
import RaceDay from "../RaceDay/RaceDay";
import Results from "../Results/Results";
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
                    path="/register/payment"
                    element={<PaymentRequestPage />}
                />
                <Route
                    path="/register/success"
                    element={<PaymentSuccessPage />}
                />
                <Route
                    path="/register/cancel"
                    element={<PaymentCancelPage />}
                />
                <Route
                    path="/register/retry-payment"
                    element={<RetryPaymentPage />}
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
                    element={<Results />}
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