import React from "react";
import axios from "axios";
import { products } from "../../config/constants";
import { AdminErrorText, AdminMetricsGrid, AdminMetric, AdminStatusText } from "./styles";

type AdminParticipant = {
    amount?: number | null;
    payment_status: string;
    with_t_shirt: boolean;
};

const apiUrl = process.env.REACT_APP_REGISTRATION_API_URL;
const T_SHIRT_PRICE_CENTS = (products[0]?.tShirtPrice ?? 0) * 100;

const formatEuro = (amountInCents: number) => `${(amountInCents / 100).toFixed(2)} EUR`;

const AdminPayments: React.FC = () => {
    const [participants, setParticipants] = React.useState<AdminParticipant[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        const fetchPayments = async () => {
            if (!apiUrl) {
                setError('Missing API URL configuration');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get<AdminParticipant[]>(`${apiUrl}/admin/participants`, {
                    withCredentials: true,
                });
                setParticipants(response.data);
            } catch {
                setError('Could not load payment data.');
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, []);

    if (loading) {
        return <AdminStatusText>Зареждане на плащания...</AdminStatusText>;
    }

    if (error) {
        return <AdminErrorText>{error}</AdminErrorText>;
    }

    const paidParticipants = participants.filter((participant) => participant.payment_status === 'paid');
    const totalIncome = paidParticipants.reduce((total, participant) => total + (participant.amount ?? 0), 0);
    const tShirtCount = paidParticipants.filter((participant) => participant.with_t_shirt).length;
    const tShirtIncome = tShirtCount * T_SHIRT_PRICE_CENTS;
    const incomePerParticipant = paidParticipants.length > 0 ? totalIncome / paidParticipants.length : 0;
    const averageFeeWithoutTShirts = paidParticipants.length > 0
        ? (totalIncome - tShirtIncome) / paidParticipants.length
        : 0;

    return (
        <AdminMetricsGrid>
            <AdminMetric>
                <span>Общ приход</span>
                <strong>{formatEuro(totalIncome)}</strong>
            </AdminMetric>
            <AdminMetric>
                <span>Приход от тениски</span>
                <strong>{formatEuro(tShirtIncome)}</strong>
                <small>{tShirtCount} x {formatEuro(T_SHIRT_PRICE_CENTS)}</small>
            </AdminMetric>
            <AdminMetric>
                <span>Приход на участник</span>
                <strong>{formatEuro(incomePerParticipant)}</strong>
                <small>{paidParticipants.length} платени участници</small>
            </AdminMetric>
            <AdminMetric>
                <span>Средна такса без тениски</span>
                <strong>{formatEuro(averageFeeWithoutTShirts)}</strong>
            </AdminMetric>
        </AdminMetricsGrid>
    );
};

export default AdminPayments;
