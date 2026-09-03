import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAdminAuth } from "./AdminAuthContext";
import { AdminDashboardCard, AdminNavButton, AdminNavList, AdminShell, AdminTitle, AdminUser, SignOutButton, AdminUserWrapper } from "./styles";
import { HeaderComponent } from "../Header/Header";
import AdminParticipants from "./AdminParticipants";
import AdminTShirts from "./AdminTShirts";
import AdminPayments from "./AdminPayments";
import AdminTiming from "./AdminTiming";

const AdminDashboard: React.FC = () => {
    const { admin, signOut } = useAdminAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [activeView, setActiveView] = React.useState<'participants' | 'tshirts' | 'payments' | 'timing' | null>(
        location.pathname === '/admin/timing' ? 'timing' : 'participants',
    );

    React.useEffect(() => {
        setActiveView(location.pathname === '/admin/timing' ? 'timing' : 'participants');
    }, [location.pathname]);

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
                            onClick={() => setActiveView('participants')}
                        >
                            Участници
                        </AdminNavButton>
                        <AdminNavButton
                            type="button"
                            active={activeView === 'tshirts'}
                            onClick={() => setActiveView('tshirts')}
                        >
                            Тениски
                        </AdminNavButton>
                        <AdminNavButton
                            type="button"
                            active={activeView === 'payments'}
                            onClick={() => setActiveView('payments')}
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
                    {activeView === 'timing' && <AdminTiming />}
                </AdminDashboardCard>
            </AdminShell>
        </>
    );
};

export default AdminDashboard;
