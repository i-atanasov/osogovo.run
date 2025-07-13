import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegistrationForm from "../RegistrationForm/RegistrationForm";
import Home from "../Home/Home";

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
            </Routes>
        </BrowserRouter>
    );
};

export default Router;