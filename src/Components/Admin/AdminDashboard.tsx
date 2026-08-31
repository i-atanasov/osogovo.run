import React from "react";
import { useAdminAuth } from "./AdminAuthContext";
import { AdminDashboardCard, AdminShell, AdminTitle, AdminUser, SignOutButton, AdminUserWrapper } from "./styles";
import { HeaderComponent } from "../Header/Header";

const AdminDashboard: React.FC = () => {
    const { admin, signOut } = useAdminAuth();

    return (
        <>
            <HeaderComponent hideDate video='https://media.osogovo.run/media/osogovo-run-21-sec-low.mp4' />
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
        </>
    );
};

export default AdminDashboard;
