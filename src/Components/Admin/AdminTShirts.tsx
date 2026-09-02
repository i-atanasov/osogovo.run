import React from "react";
import axios from "axios";
import { AdminErrorText, AdminStatusText, AdminTable, AdminTableWrapper } from "./styles";

type AdminParticipant = {
    email: string;
    gender: string;
    with_t_shirt: boolean;
    t_shirt_size?: string | null;
    payment_status: string;
};

type TShirtSummary = Record<string, Record<string, number>>;

const apiUrl = process.env.REACT_APP_REGISTRATION_API_URL;
const T_SHIRT_SIZES = ['XS', 'S', 'M', 'L', 'XL'];
const GENDERS = [
    { key: 'female', label: 'Жени' },
    { key: 'male', label: 'Мъже' },
];

const AdminTShirts: React.FC = () => {
    const [summary, setSummary] = React.useState<TShirtSummary>({});
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        const fetchTShirtSummary = async () => {
            if (!apiUrl) {
                setError('Missing API URL configuration');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get<AdminParticipant[]>(`${apiUrl}/admin/participants`, {
                    withCredentials: true,
                });
                const nextSummary = response.data.reduce<TShirtSummary>((totals, participant) => {
                    const size = participant.t_shirt_size?.trim().toUpperCase();

                    if (participant.payment_status !== 'paid' || !participant.with_t_shirt || !size) {
                        return totals;
                    }

                    totals[participant.gender] = totals[participant.gender] ?? {};
                    totals[participant.gender][size] = (totals[participant.gender][size] ?? 0) + 1;
                    return totals;
                }, {});

                setSummary(nextSummary);
            } catch {
                setError('Could not load T-shirt data.');
            } finally {
                setLoading(false);
            }
        };

        fetchTShirtSummary();
    }, []);

    if (loading) {
        return <AdminStatusText>Зареждане на тениски...</AdminStatusText>;
    }

    if (error) {
        return <AdminErrorText>{error}</AdminErrorText>;
    }

    const getCount = (gender: string, size: string) => summary[gender]?.[size] ?? 0;
    const totalTShirts = T_SHIRT_SIZES.reduce(
        (total, size) => total + GENDERS.reduce((genderTotal, gender) => genderTotal + getCount(gender.key, size), 0),
        0,
    );

    return (
        <AdminTableWrapper>
            <AdminStatusText>Общо тениски: {totalTShirts}</AdminStatusText>
            <AdminTable>
                <thead>
                    <tr>
                        <th>Размер</th>
                        {GENDERS.map((gender) => <th key={gender.key}>{gender.label}</th>)}
                        <th>Общо</th>
                    </tr>
                </thead>
                <tbody>
                    {T_SHIRT_SIZES.map((size) => {
                        const total = GENDERS.reduce((sum, gender) => sum + getCount(gender.key, size), 0);

                        return (
                            <tr key={size}>
                                <td>{size}</td>
                                {GENDERS.map((gender) => <td key={gender.key}>{getCount(gender.key, size)}</td>)}
                                <td>{total}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </AdminTable>
        </AdminTableWrapper>
    );
};

export default AdminTShirts;
