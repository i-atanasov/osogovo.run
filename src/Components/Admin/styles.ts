import styled from "styled-components";
import { colors } from "../../config/constants";

export const AdminShell = styled.main`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 32px 16px;
    background: linear-gradient(135deg, #f6f3ee 0%, #ffffff 48%, #ebe6dd 100%);
    color: ${colors.OsogovoBlack};
    font-family: 'Oswald', sans-serif;
`;

export const AdminLoginCard = styled.section`
    width: min(100%, 380px);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    padding: 32px 24px;
    border: 1px solid rgba(48, 51, 47, 0.14);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.92);
    box-shadow: 0 22px 70px rgba(48, 51, 47, 0.12);
`;

export const AdminDashboardCard = styled.section`
    width: min(100%, 960px);
    min-height: 320px;
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    gap: 24px;
    padding: 32px;
    border: 1px solid rgba(48, 51, 47, 0.14);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.92);
    box-shadow: 0 22px 70px rgba(48, 51, 47, 0.12);
`;

export const AdminUserWrapper = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    img {
        border-radius: 50%;
        width: 24px;
        height: 24px;
        object-fit: cover;
    }
`;

export const AdminTitle = styled.h1`
    margin: 0;
    font-size: clamp(28px, 5vw, 44px);
    line-height: 1;
    letter-spacing: 0;
    text-transform: uppercase;
`;

export const AdminUser = styled.p`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin: 0;
    color: rgba(48, 51, 47, 0.72);
    font-size: 18px;
`;

export const AdminStatusText = styled.p`
    margin: 0;
    color: rgba(48, 51, 47, 0.7);
    font-size: 15px;
`;

export const AdminErrorText = styled.p`
    margin: 0;
    color: ${colors.RuenOrange};
    font-size: 15px;
    text-align: center;
`;

export const SignOutButton = styled.button`
    min-height: 44px;
    padding: 0 20px;
    border: 0;
    border-radius: 6px;
    background: ${colors.RuenOrange};
    color: white;
    font-family: inherit;
    font-size: 16px;
    text-transform: uppercase;
    cursor: pointer;

    &:hover {
        background: ${colors.OsogovoBlack};
    }
`;
