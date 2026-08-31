import React from "react";
import { Navigate } from "react-router-dom";
import { useAdminAuth } from "./AdminAuthContext";
import { AdminShell, AdminStatusText } from "./styles";

interface ProtectedAdminRouteProps {
    children: React.ReactElement;
}

const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({ children }) => {
    const { admin, loading } = useAdminAuth();

    if (loading) {
        return (
            <AdminShell>
                <AdminStatusText>Зареждане...</AdminStatusText>
            </AdminShell>
        );
    }

    if (!admin) {
        return <Navigate to="/admin/login" replace />;
    }

    return children;
};

export default ProtectedAdminRoute;
