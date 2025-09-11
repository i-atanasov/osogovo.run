import React, { useEffect } from "react";
import axios from "axios";
import { HomeContainer } from "../Home/styles";
import { HeaderComponent } from "../Header/Header";
import { Paid, ParticipantsWrapper } from "./styles";

type Participant = {
    name: string;
    birth: string;
    paid: boolean;
    distance: string;
    gender: string;
    team?: string;
};

export const Participants: React.FC = () => {
    const [participants, setParticipants] = React.useState<Participant[]>([]);
    const apiUrl = process.env.REACT_APP_REGISTRATION_API_URL;

    useEffect(() => {
        const fetchParticipants = async () => {
            const response = await axios.get(`${apiUrl}/participants`);
            const data = response.data;
            data.sort((a: Participant, b: Participant) => a.distance.localeCompare(b.distance) || a.name.localeCompare(b.name));
            setParticipants(data);
        };
        fetchParticipants();
    }, []);

    return (
        <HomeContainer>
            <HeaderComponent video='http://www.osogovo.run/media/osogovo-run-21-sec-low.mp4' />
            <ParticipantsWrapper>
                <h1>Списък с участници</h1>
                <p>Моля, позволете малко време за отчитане на банковите преводи.</p>
                <table>
                    <thead>
                        <tr>
                            <th>Име</th>
                            <th>Категория</th>
                            <th>Дистанция</th>
                            <th>Отбор</th>
                            <th>Статус</th>
                        </tr>
                    </thead>
                    <tbody>
                        {participants.map(participant => {
                        const birthYear = parseInt(participant.birth, 10);
                        const currentYear = new Date().getFullYear();
                        const age = currentYear - birthYear;
                        let category = "";
                        if (age < 21) {
                            category = participant.gender === "male" ? "М20" : "Ж20";
                        } else if (age > 39) {
                            category = participant.gender === "male" ? "М40" : "Ж40";
                        } else if (age > 59) {
                            category = participant.gender === "male" ? "М60" : "Ж60";
                        } else {
                            category = participant.gender === "male" ? "М" : "Ж";
                        }
                        return (
                            <tr key={participant.name}>
                                <td>{ participant.name }</td>
                                <td>{ category }</td>
                                <td>{ participant.distance }</td>
                                <td>{ participant.team }</td>
                                <Paid paid={participant.paid}>{ participant.paid ? "Регистриран" : "Очаква плащане" }</Paid>
                            </tr>
                        );
                        })}
                    </tbody>
                </table>
                <p>Дистанция 26 км: {participants.filter(p => p.distance === "26").length} души</p>
                <p>Дистанция 14 км: {participants.filter(p => p.distance === "14").length} души</p>
            </ParticipantsWrapper>
        </HomeContainer>
    );
}

export default Participants;