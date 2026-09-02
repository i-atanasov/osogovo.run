import styled from "styled-components";
import { colors } from "../../config/constants";

export const AdminShell = styled.main`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 32px;
    color: ${colors.OsogovoBlack};
    font-family: 'Oswald', sans-serif;
    transform: translateY(-200px);
    position: relative;
`;

export const AdminLoginCard = styled.section`
    width: min(95%, 380px);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    padding: 16px 24px;
    border: 1px solid rgba(48, 51, 47, 0.14);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.92);
    box-shadow: 0 22px 70px rgba(48, 51, 47, 0.12);
`;

export const AdminDashboardCard = styled.section`
    width: min(95%, 1280px);
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

export const AdminNavList = styled.nav`
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
`;

export const AdminNavButton = styled.button<{ active: boolean }>`
    min-height: 40px;
    padding: 0 16px;
    border: 1px solid ${props => props.active ? colors.RuenOrange : 'rgba(48, 51, 47, 0.24)'};
    border-radius: 6px;
    background: ${props => props.active ? colors.RuenOrange : 'transparent'};
    color: ${props => props.active ? 'white' : colors.OsogovoBlack};
    font-family: inherit;
    font-size: 16px;
    text-transform: uppercase;
    cursor: pointer;

    &:hover {
        border-color: ${colors.RuenOrange};
    }
`;

export const AdminTableWrapper = styled.div`
    max-width: 100%;
    overflow-x: auto;
    width: 100%;
`;

export const AdminTable = styled.table`
    border-collapse: collapse;
    font-size: 14px;
    min-width: 1180px;
    width: 100%;

    th,
    td {
        border-bottom: 1px solid rgba(48, 51, 47, 0.12);
        padding: 10px 12px;
        text-align: left;
        vertical-align: top;
        white-space: nowrap;
    }

    th {
        color: ${colors.OsogovoBlack};
        font-weight: 500;
    }

    td {
        color: rgba(48, 51, 47, 0.78);
        font-weight: 300;
    }
`;

export const AdminMetricsGrid = styled.div`
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(1, minmax(0, 1fr));
    width: 100%;

    @media (min-width: 640px) {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
`;

export const AdminMetric = styled.section`
    border: 1px solid rgba(48, 51, 47, 0.14);
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-height: 132px;
    padding: 20px;

    span,
    small {
        color: rgba(48, 51, 47, 0.7);
        font-size: 15px;
        font-weight: 300;
    }

    strong {
        color: ${colors.RuenOrange};
        font-size: 30px;
        font-weight: 500;
        line-height: 1.1;
    }
`;
