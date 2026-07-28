import React, { useEffect } from "react";
import axios from "axios";
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
    osogovo?: string
    ruen?: string
};

export const Participants: React.FC = () => {
    const [participants, setParticipants] = React.useState<Participant[]>([]);
    // const [highlightedParticipant, setHighlightedParticipant] = React.useState<number | null>(null);
    const [loading, setLoading] = React.useState(true);
    const apiUrl = process.env.REACT_APP_REGISTRATION_API_URL;

    useEffect(() => {
        const fetchParticipants = async () => {
            const response = await axios.get(`${apiUrl}/participants`);
            const data = response.data;
            data.sort((a: Participant, b: Participant) => a.bib - b.bib);
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
                        <th>Име</th>
                        <th>Категория</th>
                        <th>Дистанция</th>
                        <th>Отбор</th>
                        {showResult ? 
                            <th>Финал</th> : 
                            <th>Статус</th>}
                    </tr>
                </thead>
                {loading && <p>Зареждане...</p>}
                <tbody>
                    {participants.sort((a, b) => {
                        const osogovoA = a.osogovo ?? "";
                        const osogovoB = b.osogovo ?? "";
                        const osogovoCompare = osogovoA.localeCompare(osogovoB);
                        if (osogovoCompare !== 0) return osogovoCompare;
                        const ruenA = a.ruen ?? "";
                        const ruenB = b.ruen ?? "";
                        return ruenA.localeCompare(ruenB);
                    }).map((participant) => {
                        const category = getCategory(participant);
                        const final = participant.distance === '14' ? 'osogovo' : 'ruen';
                        position++; // Increment position for each participant
                        return (
                            (categoryFilter && !category.includes(categoryFilter)) ? null : 
                            (distanceFilter && participant.distance !== distanceFilter) ? null :
                            (showResult && participant[final] !== showResult) ? null :
                            <TableRow key={position} highlighted={false} >
                                <td>{position}. { participant.name }</td>
                                <td>{ category }</td>
                                <td>{ participant.distance }</td>
                                <td>{ participant.team }</td>
                                {showResult ? <td>{ participant[final] }</td> : <Paid paid={participant.paid} >{ participant.paid ? 'Платено' : 'Очаква плащане' }</Paid>}
                            </TableRow>
                        );
                    })}
                </tbody>
            </table>
        )
    }

    return (
        <HomeContainer>
            <HeaderComponent video='http://www.osogovo.run/media/osogovo-run-21-sec-low.mp4' />
            <ParticipantsWrapper>
                <p>Виж резултатите: <a href="/results?year=2025">2025 г.</a></p>
                <p><a href="/register/payment">Към плащане</a></p>
                {/* <a href="/race-day">Виж инструкции за състезателния ден</a> */}
                <h1>Списък с участници - обща категория / 14 км</h1>
                {renderTable(undefined, "14")}
                <h1>Списък с участници - обща категория / 26 км</h1>
                {renderTable(undefined, "26")}
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
                <p>Дистанция 26 км: {participants.filter(p => p.distance === "26").length} души</p>
                <p>Дистанция 14 км: {participants.filter(p => p.distance === "14").length} души</p>
            </ParticipantsWrapper>
        </HomeContainer>
    );
}

export default Participants;