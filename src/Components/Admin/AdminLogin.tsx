import React from "react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { Navigate } from "react-router-dom";
import { useAdminAuth } from "./AdminAuthContext";
import { AdminErrorText, AdminLoginCard, AdminShell, AdminStatusText, AdminTitle } from "./styles";
import { HeaderComponent } from "../Header/Header";

const AdminLogin: React.FC = () => {
    const { admin, loading, error, signInWithGoogle } = useAdminAuth();
    const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

    const handleSuccess = async (response: CredentialResponse) => {
        if (!response.credential) {
            return;
        }

        await signInWithGoogle(response.credential);
    };

    if (admin) {
        return <Navigate to="/admin" replace />;
    }

    return (
        <>
            <HeaderComponent hideDate video='https://media.osogovo.run/media/osogovo-run-21-sec-low.mp4' />
            <AdminShell>
            <AdminLoginCard>
                <AdminTitle>Osogovo Run Admin</AdminTitle>
                {googleClientId ? (
                    <GoogleLogin
                        onSuccess={handleSuccess}
                        onError={() => undefined}
                        useOneTap={false}
                    />
                ) : (
                    <AdminErrorText>Missing Google client configuration.</AdminErrorText>
                )}
                {loading && <AdminStatusText>Проверка на сесията...</AdminStatusText>}
                {error && <AdminErrorText>{error}</AdminErrorText>}
            </AdminLoginCard>
            </AdminShell>
        </>
    );
};

export default AdminLogin;
