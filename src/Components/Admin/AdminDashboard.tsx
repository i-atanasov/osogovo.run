import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAdminAuth } from "./AdminAuthContext";
import { AdminDashboardCard, AdminNavButton, AdminNavList, AdminShell, AdminTitle, AdminUser, SignOutButton, AdminUserWrapper } from "./styles";
import { HeaderComponent } from "../Header/Header";
import AdminParticipants from "./AdminParticipants";
import AdminTShirts from "./AdminTShirts";
import AdminPayments from "./AdminPayments";
import AdminTiming from "./AdminTiming";
import AdminCheckpointTiming from "./AdminCheckpointTiming";

const AdminDashboard: React.FC = () => {
    const { admin, signOut } = useAdminAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const activeView = location.pathname.startsWith('/admin/timing')
        ? 'timing'
        : location.pathname === '/admin/tshirts'
            ? 'tshirts'
            : location.pathname === '/admin/payments'
                ? 'payments'
                : 'participants';

    return (
        <>
            <HeaderComponent hideDate />
            <AdminShell>
                <AdminDashboardCard>
                    <AdminTitle>Админ табло</AdminTitle>
                    <AdminUserWrapper>
                        <AdminUser>
                            {admin?.picture && <img src={admin?.picture} alt="Admin" />}
                            {admin?.name || admin?.email}
                        </AdminUser>
                        <SignOutButton onClick={signOut}>Изход</SignOutButton>
                        
                    </AdminUserWrapper>
                    <AdminNavList>
                        <AdminNavButton
                            type="button"
                            active={activeView === 'participants'}
                            onClick={() => navigate('/admin')}
                        >
                            Участници
                        </AdminNavButton>
                        <AdminNavButton
                            type="button"
                            active={activeView === 'tshirts'}
                            onClick={() => navigate('/admin/tshirts')}
                        >
                            Тениски
                        </AdminNavButton>
                        <AdminNavButton
                            type="button"
                            active={activeView === 'payments'}
                            onClick={() => navigate('/admin/payments')}
                        >
                            Приходи
                        </AdminNavButton>
                        <AdminNavButton
                            type="button"
                            active={activeView === 'timing'}
                            onClick={() => navigate('/admin/timing')}
                        >
                            Времеизмерване
                        </AdminNavButton>
                    </AdminNavList>
                    {activeView === 'participants' && <AdminParticipants />}
                    {activeView === 'tshirts' && <AdminTShirts />}
                    {activeView === 'payments' && <AdminPayments />}
                    {activeView === 'timing' && (
                        location.pathname === '/admin/timing' ? <AdminTiming /> : <AdminCheckpointTiming />
                    )}
                </AdminDashboardCard>
            </AdminShell>
        </>
    );
};

export default AdminDashboard;
