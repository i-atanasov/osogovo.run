import React, { useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { HomeContainer } from "../Home/styles";
import { HeaderComponent } from "../Header/Header";
import { Paid, ParticipantsWrapper, TableRow } from "./styles";

type Participant = {
    name: string;
    birth: string;
    paid: boolean;
    distance: string;
    gender: string;
    team?: string;
    bib: number;
    updated_at?: string;
    osogovo?: string
    ruen?: string
};

const formatParticipantName = (name: string) => {
    return name
        .trim()
        .toLocaleLowerCase('bg-BG')
        .replace(/(^|[\s-])([^\s-])/gu, (match, separator: string, letter: string) => {
            return `${separator}${letter.toLocaleUpperCase('bg-BG')}`;
        });
};

export const Participants: React.FC = () => {
    const { t } = useTranslation();
    const [participants, setParticipants] = React.useState<Participant[]>([]);
    // const [highlightedParticipant, setHighlightedParticipant] = React.useState<number | null>(null);
    const [loading, setLoading] = React.useState(true);
    const apiUrl = process.env.REACT_APP_REGISTRATION_API_URL;

    useEffect(() => {
        const fetchParticipants = async () => {
            const response = await axios.get(`${apiUrl}/participants`);
            const data = response.data;
            data.sort((a: Participant, b: Participant) => {
                const aTime = a.updated_at ?? '';
                const bTime = b.updated_at ?? '';
                return aTime.localeCompare(bTime);
            });
            setParticipants(data);
            setLoading(false);
        };
        fetchParticipants();
    }, []);

    const getCategory = (participant: Participant) => {
        const birthYear = parseInt(participant.birth, 10);
        const currentYear = new Date().getFullYear();
        const age = currentYear - birthYear;
        let category = "";
        if (age < 21) {
            category = participant.gender === "male" ? "М20" : "Ж20";
        } else if (age > 39) {
            category = participant.gender === "male" ? "М40" : "Ж40";
        } else {
            category = participant.gender === "male" ? "М" : "Ж";
        }
        return category;
    }

    const renderTable = (categoryFilter?: string, distanceFilter?: string, showResult?: string) => {
        let position = 0;
        return (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th>{t('participants:table.name')}</th>
                        <th>{t('participants:table.category')}</th>
                        <th>{t('participants:table.distance')}</th>
                        <th>{t('participants:table.team')}</th>
                        {showResult ? 
                            <th>{t('participants:table.finish')}</th> : 
                            <th>{t('participants:table.status')}</th>}
                    </tr>
                </thead>
                {loading && <p>{t('participants:table.loading')}</p>}
                <tbody>
                    {participants.map((participant) => {
                        const category = getCategory(participant);
                        const final = participant.distance === '14' ? 'osogovo' : 'ruen';
                        position++; // Increment position for each participant
                        return (
                            (categoryFilter && !category.includes(categoryFilter)) ? null : 
                            (distanceFilter && participant.distance !== distanceFilter) ? null :
                            (showResult && participant[final] !== showResult) ? null :
                            <TableRow key={position} highlighted={false} >
                                <td>{position}. { formatParticipantName(participant.name) }</td>
                                <td>{ category }</td>
                                <td>{ participant.distance }</td>
                                <td>{ participant.team }</td>
                                {showResult ? <td>{ participant[final] }</td> : <Paid paid={participant.paid} >{ participant.paid ? t('participants:status.paid') : t('participants:status.pending') }</Paid>}
                            </TableRow>
                        );
                    })}
                </tbody>
            </table>
        )
    }

    return (
        <HomeContainer>
            <HeaderComponent hideDate video='http://www.osogovo.run/media/osogovo-run-21-sec-low.mp4' />
            <ParticipantsWrapper>
                <p>{t('participants:links.results')} <a href="/results?year=2025">{t('participants:links.resultsYear')}</a></p>
                <p><a href="/register/payment">{t('participants:links.payment')}</a></p>
                {/* <a href="/race-day">Виж инструкции за състезателния ден</a> */}
                <h1>{t('participants:title')}</h1>
                {renderTable()}
                {/* {renderTable(undefined, "14")}
                <h1>Списък с участници - обща категория / 26 км</h1>
                {renderTable(undefined, "26")} */}
                {/* <h1>Списък с участници - категория Жени / 14 км</h1>
                {renderTable('Ж', "14")}
                <h1>Списък с участници - категория Жени / 26 км</h1>
                {renderTable('Ж', "26")}
                <h1>Списък с участници - категория Жени 40+ / 14 км</h1>
                {renderTable('Ж40', "14")}
                <h1>Списък с участници - категория Жени 40+ / 26 км</h1>
                {renderTable('Ж40', "26")}
                <h1>Списък с участници - категория Мъже 40+ / 14 км</h1>
                {renderTable('М40', "14")}
                <h1>Списък с участници - категория Мъже 40+ / 26 км</h1>
                {renderTable('М40', "26")}
                <h1>Списък с участници - категория Мъже до 20 / 14 км</h1>
                {renderTable('М20', "14")}
                <h1>Списък с участници - категория Мъже до 20 / 26 км</h1>
                {renderTable('М20', "26")}
                <h1>Списък с участници - категория Жени до 20 / 14 км</h1>
                {renderTable('Ж20', "14")}
                <h1>Списък с участници - категория Жени до 20 / 26 км</h1>
                {renderTable('Ж20', "26")} */}
                <p>{t('participants:counts.distance', {
                    distance: 26,
                    count: participants.filter(p => p.distance === "26").length,
                    label: participants.filter(p => p.distance === "26").length === 1 ? t('participants:counts.participant') : t('participants:counts.participants'),
                })}</p>
                <p>{t('participants:counts.distance', {
                    distance: 14,
                    count: participants.filter(p => p.distance === "14").length,
                    label: participants.filter(p => p.distance === "14").length === 1 ? t('participants:counts.participant') : t('participants:counts.participants'),
                })}</p>
            </ParticipantsWrapper>
        </HomeContainer>
    );
}

export default Participants;