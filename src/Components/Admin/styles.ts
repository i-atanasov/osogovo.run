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

export const AdminFilters = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin: 16px 0;

    label {
        color: ${colors.OsogovoBlack};
        display: flex;
        flex-direction: column;
        font-size: 15px;
        gap: 6px;
    }

    select, input {
        background: white;
        border: 1px solid rgba(48, 51, 47, 0.24);
        border-radius: 4px;
        color: ${colors.OsogovoBlack};
        font-family: inherit;
        font-size: 16px;
        min-height: 38px;
        padding: 0 10px;
    }
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

export const AdminTableRow = styled.tr<{ selected: boolean }>`
    background-color: ${props => props.selected ? 'rgba(48, 51, 47, 0.2)' : 'transparent'};
    cursor: pointer;
    outline: none;

    &:hover {
        background-color: ${props => props.selected ? 'rgba(48, 51, 47, 0.2)' : 'rgba(48, 51, 47, 0.06)'};
    }

    &:focus-visible {
        box-shadow: inset 3px 0 0 ${colors.OsogovoBlack};
    }
    select {
        background: white;
        border: 2px solid ${colors.RuenOrange};
        border-radius: 4px;
        color: ${colors.OsogovoBlack};
        font-family: inherit;
        font-size: 16px;
        min-height: 20px;
        padding: 0 10px;
    }
`;

export const AdminBibButton = styled.button`
    min-height: 32px;
    padding: 0 10px;
    border: 1px solid ${colors.RuenOrange};
    border-radius: 4px;
    background: transparent;
    color: ${colors.RuenOrange};
    font-family: inherit;
    font-size: 14px;
    cursor: pointer;

    &:hover {
        background: ${colors.RuenOrange};
        color: white;
    }
`;

export const AdminBibValue = styled.span`
    display: inline-flex;
    align-items: center;
    gap: 6px;
`;

export const AdminNoteCell = styled.div`
    display: grid;
    grid-template-columns: minmax(180px, 260px) auto auto;
    align-items: start;
    gap: 6px;

    textarea {
        min-height: 64px;
        resize: vertical;
        box-sizing: border-box;
        border: 1px solid rgba(48, 51, 47, 0.24);
        border-radius: 4px;
        color: ${colors.OsogovoBlack};
        font: inherit;
        padding: 8px;
        white-space: normal;

        &:disabled {
            background: rgba(48, 51, 47, 0.08);
            color: rgba(48, 51, 47, 0.68);
        }
    }

    small {
        grid-column: 1 / -1;
        color: rgba(48, 51, 47, 0.62);
        white-space: normal;
    }
`;

export const AdminIconButton = styled.button`
    width: 32px;
    height: 32px;
    display: inline-grid;
    place-items: center;
    padding: 0;
    border: 1px solid transparent;
    border-radius: 4px;
    background: transparent;
    color: ${colors.OsogovoBlack};
    cursor: pointer;

    &:hover {
        border-color: ${colors.RuenOrange};
        color: ${colors.RuenOrange};
    }
`;

export const AdminDialogBackdrop = styled.div`
    position: fixed;
    inset: 0;
    z-index: 10;
    display: grid;
    place-items: center;
    padding: 24px;
    background: rgba(48, 51, 47, 0.48);
`;

export const AdminDialog = styled.form`
    width: min(100%, 380px);
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 24px;
    border-radius: 8px;
    background: white;
    box-shadow: 0 22px 70px rgba(48, 51, 47, 0.3);

    h2,
    p {
        margin: 0;
    }

    h2 {
        font-size: 24px;
        text-transform: uppercase;
    }

    .lottery-number {
        margin: 8px 0;
        color: ${colors.RuenOrange};
        font-size: 64px;
        font-weight: 600;
        line-height: 1;
        text-align: center;
    }

    label {
        display: flex;
        flex-direction: column;
        gap: 6px;
        font-size: 16px;
    }

    input, select {
        min-height: 42px;
        box-sizing: border-box;
        border: 1px solid rgba(48, 51, 47, 0.24);
        border-radius: 4px;
        font: inherit;
        padding: 0 10px;
    }
`;

export const AdminDialogActions = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 10px;
`;

export const TimingParticipantsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(1, minmax(0, 1fr));
    gap: 24px;
    width: 100%;

    @media (min-width: 800px) {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
`;

export const TimingDistanceColumn = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    min-width: 0;
`;

export const AdminLabel = styled.label`
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 16px;
    > input {
        min-width: 250px;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 20px;
        line-height: 24px;
        font-family: 'Oswald', sans-serif;
        color: #666666;
        -webkit-transition: 0.5s;   
        transition: 0.5s;
        &::placeholder {
            font-weight: 100;
            color: #666;
            font-family: 'Noto Sans', sans-serif;
            opacity: 0.4;
        }
        &:focus {
            border-color: ${colors.RuenOrange};
            outline: none;
        }
    }
`;

export const TimingRaceControls = styled.section`
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    width: 100%;
    gap: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid rgba(48, 51, 47, 0.18);
`;

export const TimingStartButton = styled.button`
    min-width: 220px;
    min-height: 52px;
    padding: 12px 20px;
    margin: 10px 20px 10px 0;
    border: 0;
    border-radius: 4px;
    background: ${colors.RuenOrange};
    color: white;
    font-family: inherit;
    font-size: 19px;
    font-weight: 600;
    cursor: pointer;

    &:disabled {
        background: rgba(48, 51, 47, 0.18);
        color: rgba(48, 51, 47, 0.68);
        cursor: default;
    }
`;

export const TimingManualStartButton = styled.button`
    min-height: 52px;
    padding: 12px 20px;
    border: 1px solid rgba(48, 51, 47, 0.3);
    border-radius: 4px;
    background: white;
    color: ${colors.OsogovoBlack};
    font-family: inherit;
    font-size: 17px;
    cursor: pointer;

    &:hover:not(:disabled) {
        border-color: ${colors.RuenOrange};
        color: ${colors.RuenOrange};
    }

    &:disabled {
        opacity: 0.5;
        cursor: default;
    }
`;

export const TimingRaceClock = styled.div`
    display: grid;
    justify-items: end;
    line-height: 1.2;

    span,
    small {
        color: rgba(48, 51, 47, 0.68);
    }

    strong {
        font-size: 32px;
        font-variant-numeric: tabular-nums;
    }

    @media (max-width: 830px) {
        justify-items: start;
    }
`;

export const TimingCheckpointMenu = styled.nav`
    display: flex;
    width: 100%;
    gap: 8px;
    overflow-x: auto;
    padding: 4px;
`;

export const TimingCheckpointButton = styled.div`
    flex: none;
    min-height: 44px;
    padding: 8px 12px;
    border: 1px solid rgba(48, 51, 47, 0.24);
    border-radius: 4px;
    background: white;
    color: ${colors.OsogovoBlack};
    font-family: inherit;
    font-size: 15px;
    text-align: left;

    small {
        display: block;
        font-size: 12px;
        font-weight: 300;
    }
`;

export const TimingGroup = styled.section<{ color: 'orange' | 'black' }>`
    border-top: 4px solid ${props => props.color === 'orange' ? colors.RuenOrange : colors.OsogovoBlack};
    padding-top: 12px;
`;

export const TimingGroupTitle = styled.h2`
    margin: 0 0 12px;
    font-size: 24px;
    text-transform: uppercase;
`;

export const TimingCheckpointDetails = styled.p`
    margin: -6px 0 12px;
    color: rgba(48, 51, 47, 0.7);
    font-size: 14px;
`;

export const TimingParticipantButton = styled.button<{ color: 'orange' | 'black' }>`
    box-sizing: border-box;
    width: 100%;
    display: grid;
    grid-template-columns: 48px minmax(0, 1fr) auto auto;
    gap: 4px 12px;
    align-items: center;
    padding: 12px;
    border: 1px solid rgba(48, 51, 47, 0.2);
    border-left: 4px solid ${props => props.color === 'orange' ? colors.RuenOrange : colors.OsogovoBlack};
    border-radius: 4px;
    background: white;
    color: ${colors.OsogovoBlack};
    font-family: inherit;
    text-align: left;

    & + & {
        margin-top: 8px;
    }

    strong {
        grid-row: span 2;
        color: ${props => props.color === 'orange' ? colors.RuenOrange : colors.OsogovoBlack};
        font-size: 20px;
        text-align: center;
    }

    > span {
        overflow: hidden;
        font-size: 17px;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .participant-phone {
        grid-column: 3;
        grid-row: 1 / span 2;
        align-self: center;
        width: auto;
        padding: 10px;
        margin: 0 10px;
        border: 0;
        background: transparent;
        font-size: 15px;
        font-weight: 400;
        text-transform: none;
        text-decoration: none;
        background: ${colors.RuenOrange};
        color: white;
        border-radius: 10px;
        white-space: nowrap;
        transition: none;

        &:hover {
            color: ${colors.OsogovoBlack};
            filter: brightness(1);
        }
    }

    .participant-result {
        grid-column: 4;
        grid-row: 1 / span 2;
        align-self: center;
        color: rgba(48, 51, 47, 0.72);
        font-variant-numeric: tabular-nums;
        white-space: nowrap;
    }
`;

export const TimingParticipantMeta = styled.div`
    grid-column: 2;
    display: flex;
    justify-content: space-between;
    gap: 12px;
    color: rgba(48, 51, 47, 0.72);
    font-size: 14px;

    time {
        flex: none;
    }
`;

export const TimingEntryHeading = styled.header`
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 16px;
    width: 100%;
    border-bottom: 1px solid rgba(48, 51, 47, 0.18);
    padding-bottom: 12px;

    h2 {
        margin: 0;
        font-size: 30px;
        text-transform: uppercase;
    }

    span {
        color: ${colors.RuenOrange};
        font-size: 20px;
    }
`;

export const TimingEntrySection = styled.section`
    min-width: 0;

    > h3 {
        margin: 0 0 16px;
        border-top: 4px solid ${colors.OsogovoBlack};
        padding-top: 10px;
        font-size: 26px;
    }

    &:first-child > h3 {
        border-color: ${colors.RuenOrange};
    }
`;

export const TimingEntryGroup = styled.section`
    margin-bottom: 24px;

    h4 {
        display: flex;
        justify-content: space-between;
        margin: 0 0 10px;
        font-size: 19px;
        text-transform: uppercase;
    }

    h4 span {
        color: ${colors.RuenOrange};
    }

    h5 {
        margin: 14px 0 6px;
        color: rgba(48, 51, 47, 0.68);
        font-size: 14px;
        font-weight: 400;
        text-transform: uppercase;
    }
`;

export const TimingEntryParticipant = styled.button<{ passed: boolean }>`
    display: grid;
    grid-template-columns: 64px minmax(0, 1fr) auto auto;
    align-items: center;
    gap: 12px;
    width: 100%;
    box-sizing: border-box;
    min-height: 54px;
    padding: 8px 12px;
    border: 1px solid rgba(48, 51, 47, 0.16);
    border-left: 4px solid ${props => props.passed ? colors.OsogovoBlack : colors.RuenOrange};
    border-radius: 4px;
    background: ${props => props.passed ? 'rgba(48, 51, 47, 0.05)' : 'white'};
    color: ${colors.OsogovoBlack};
    font-family: inherit;
    text-align: left;
    cursor: ${props => props.passed ? 'default' : 'pointer'};

    & + & {
        margin-top: 6px;
    }

    &:hover:not(:disabled) {
        border-color: ${colors.RuenOrange};
    }

    &:disabled {
        opacity: 0.55;
        cursor: wait;
    }

    strong {
        color: ${colors.RuenOrange};
        font-size: 26px;
        text-align: center;
    }

    span {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    span small {
        display: block;
        overflow: hidden;
        color: rgba(48, 51, 47, 0.62);
        font-size: 12px;
        font-weight: 300;
        text-overflow: ellipsis;
    }

    time {
        color: rgba(48, 51, 47, 0.68);
        font-variant-numeric: tabular-nums;
    }
`;

export const TimingEntryActions = styled.div`
    display: inline-flex;
    gap: 4px;
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
