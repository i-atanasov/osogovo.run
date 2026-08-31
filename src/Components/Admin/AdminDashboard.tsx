import React from "react";
import { useAdminAuth } from "./AdminAuthContext";
import { AdminDashboardCard, AdminShell, AdminTitle, AdminUser, SignOutButton, AdminUserWrapper } from "./styles";

const AdminDashboard: React.FC = () => {
    const { admin, signOut } = useAdminAuth();

    return (
        <AdminShell>
            <AdminDashboardCard>
                <AdminTitle>Admin Dashboard</AdminTitle>
                <AdminUserWrapper>
                    <AdminUser>
                        {admin?.picture && <img src={admin?.picture} alt="Admin" />} 
                        {admin?.name || admin?.email}
                    </AdminUser>
                    <SignOutButton onClick={signOut}>Изход</SignOutButton>
                </AdminUserWrapper>
            </AdminDashboardCard>
        </AdminShell>
    );
};

export default AdminDashboard;
