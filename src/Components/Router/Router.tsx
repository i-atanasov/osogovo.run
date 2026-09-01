import React, { useEffect } from "react"
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import RegistrationForm from "../RegistrationForm/RegistrationForm";
import PaymentSuccessPage from "../RegistrationForm/PaymentSuccessPage";
import PaymentCancelPage from "../RegistrationForm/PaymentCancelPage";
import PaymentRequestPage from "../RegistrationForm/PaymentRequestPage";
import RetryPaymentPage from "../RegistrationForm/RetryPaymentPage";
import VolunteerForm from "../VolunteerForm/VolunteerForm";
import Home from "../Home/Home";
import { Participants } from "../Participants/Participants";
import RaceDay from "../RaceDay/RaceDay";
import Results from "../Results/Results";
import { IframeFeedback } from "../FeedbackPage/FeedbackPage";
import AdminLogin from "../Admin/AdminLogin";
import AdminDashboard from "../Admin/AdminDashboard";
import ProtectedAdminRoute from "../Admin/ProtectedAdminRoute";
import ParticipantProfile from "../ParticipantProfile/ParticipantProfile";

const HashScroller: React.FC = () => {
    const location = useLocation();

    useEffect(() => {
        if (!location.hash) {
            return;
        }

        const targetId = decodeURIComponent(location.hash.slice(1));
        const timeoutId = window.setTimeout(() => {
            document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 0);

        return () => window.clearTimeout(timeoutId);
    }, [location.hash, location.pathname]);

    return null;
};

const Router: React.FC = () => {
    return (
        <BrowserRouter>
            <HashScroller />
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
                    path="/volunteer"
                    element={<VolunteerForm />}
                />
                <Route
                    path="/participants"
                    element={<Participants />}
                />
                <Route
                    path="/participant/:name"
                    element={<ParticipantProfile />}
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
                <Route
                    path="/admin/login"
                    element={<AdminLogin />}
                />
                <Route
                    path="/admin"
                    element={
                        <ProtectedAdminRoute>
                            <AdminDashboard />
                        </ProtectedAdminRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
};

export default Router;