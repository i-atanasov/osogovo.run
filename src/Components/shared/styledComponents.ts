import styled from 'styled-components';
import { colors } from '../../config/constants';

export const ServerError = styled.div`
    margin: 15px 0;
    padding: 12px;
    background-color: #ffe6e6;
    color: ${colors.OsogovoBlack || '#333'};
    border-radius: 4px;
    border-left: 4px solid ${colors.RuenOrange || '#e74c3c'};
`;

export const ServerSuccess = styled.div`
    margin: 15px 0;
    padding: 12px;
    background-color: #d4edda;
    color: #155724;
    border-radius: 4px;
    border-left: 4px solid #28a745;
`;
