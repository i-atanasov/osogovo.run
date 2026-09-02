import React from "react";
import axios from "axios";
import { AdminErrorText, AdminFilters, AdminStatusText, AdminTable, AdminTableRow, AdminTableWrapper } from "./styles";

type AdminParticipant = {
    email: string;
    name: string;
    distance: string;
    gender: string;
    birth: number;
    team?: string | null;
    phone_number?: string | null;
    with_t_shirt: boolean;
    t_shirt_size?: string | null;
    paid: boolean;
    payment_status: string;
    bib?: number | null;
    amount?: number | null;
    currency?: string | null;
    discount_code_used?: string | null;
    created_at: string;
    updated_at: string;
};

const apiUrl = process.env.REACT_APP_REGISTRATION_API_URL;

const AdminParticipants: React.FC = () => {
    const [participants, setParticipants] = React.useState<AdminParticipant[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [selectedEmail, setSelectedEmail] = React.useState<string | null>(null);
    const [genderFilter, setGenderFilter] = React.useState('');
    const [distanceFilter, setDistanceFilter] = React.useState('');

    React.useEffect(() => {
        const fetchParticipants = async () => {
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
                setError('Could not load participant data.');
            } finally {
                setLoading(false);
            }
        };

        fetchParticipants();
    }, []);

    if (loading) {
        return <AdminStatusText>Loading participants...</AdminStatusText>;
    }

    if (error) {
        return <AdminErrorText>{error}</AdminErrorText>;
    }

    const filteredParticipants = participants.filter((participant) => (
        (!genderFilter || participant.gender === genderFilter)
        && (!distanceFilter || participant.distance === distanceFilter)
    ));

    return (
        <AdminTableWrapper>
            <AdminFilters>
                <label>
                    Пол
                    <select value={genderFilter} onChange={(event) => setGenderFilter(event.target.value)}>
                        <option value="">Всички</option>
                        <option value="female">Жени</option>
                        <option value="male">Мъже</option>
                    </select>
                </label>
                <label>
                    Дистанция
                    <select value={distanceFilter} onChange={(event) => setDistanceFilter(event.target.value)}>
                        <option value="">Всички</option>
                        <option value="14">14 км</option>
                        <option value="26">26 км</option>
                    </select>
                </label>
            </AdminFilters>
            <AdminStatusText>{filteredParticipants.length} участници. Общо платени: {filteredParticipants.filter((participant) => participant.payment_status === 'paid').length}</AdminStatusText>
            <AdminTable>
                <thead>
                    <tr>
                        <th>Име</th>
                        <th>Имейл</th>
                        <th>Телефон</th>
                        <th>Дистанция</th>
                        <th>Пол</th>
                        <th>Година на раждане</th>
                        <th>Отбор</th>
                        <th>Тениска</th>
                        <th>Плащане</th>
                        <th>Стартов номер</th>
                        <th>Платено</th>
                        <th>Код за отстъпка</th>
                        <th>Регистриран на</th>
                        <th>Последна промяна на</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredParticipants.map((participant) => (
                        <AdminTableRow
                            key={participant.email}
                            selected={selectedEmail === participant.email}
                            tabIndex={0}
                            onClick={() => setSelectedEmail(participant.email)}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter' || event.key === ' ') {
                                    event.preventDefault();
                                    setSelectedEmail(participant.email);
                                }
                            }}
                        >
                            <td>{participant.name}</td>
                            <td>{participant.email}</td>
                            <td>{participant.phone_number ?? '-'}</td>
                            <td>{participant.distance} km</td>
                            <td>{participant.gender}</td>
                            <td>{participant.birth}</td>
                            <td>{participant.team ?? '-'}</td>
                            <td>{participant.with_t_shirt ? participant.t_shirt_size ?? 'Yes' : 'No'}</td>
                            <td>{participant.payment_status}</td>
                            <td>{participant.bib ?? '-'}</td>
                            <td>{participant.amount !== null && participant.amount !== undefined ? `${participant.amount/100} ${participant.currency ?? ''}`.trim() : '-'}</td>
                            <td>{participant.discount_code_used ?? '-'}</td>
                            <td>{new Date(participant.created_at).toLocaleString()}</td>
                            <td>{new Date(participant.updated_at).toLocaleString()}</td>
                        </AdminTableRow>
                    ))}
                </tbody>
            </AdminTable>
        </AdminTableWrapper>
    );
};

export default AdminParticipants;
