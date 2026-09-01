import React, { useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { HomeContainer } from "../Home/styles";
import { HeaderComponent } from "../Header/Header";
import { ParticipantsWrapper, TableRow } from "../Participants/styles";
import { formatParticipantName } from "../Participants/utils";

type Participation = {
    year: number;
    status: 'incoming' | 'previous';
    name: string;
    birth: string;
    paid: boolean;
    distance: string;
    gender: string;
    team?: string;
    bib?: number;
    osogovo?: string | null;
    ruen?: string | null;
    dns?: boolean | null;
};

type ParticipantProfileResponse = {
    name: string;
    participations: Participation[];
};

const getFinishTime = (participation: Participation) => {
    if (participation.dns) {
        return 'DNS';
    }

    return participation.distance === '14' ? participation.osogovo : participation.ruen;
};

export const ParticipantProfile: React.FC = () => {
    const { t } = useTranslation();
    const { name } = useParams<{ name: string }>();
    const [profile, setProfile] = React.useState<ParticipantProfileResponse | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const apiUrl = process.env.REACT_APP_REGISTRATION_API_URL;

    useEffect(() => {
        const fetchParticipantProfile = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await axios.get(`${apiUrl}/participant/${name}`);
                setProfile(response.data);
            } catch (err) {
                setError(t('participants:profile.errors.loadFailed'));
            } finally {
                setLoading(false);
            }
        };

        if (name) {
            fetchParticipantProfile();
        }
    }, [apiUrl, name, t]);

    return (
        <HomeContainer>
            <HeaderComponent hideDate video='http://www.osogovo.run/media/osogovo-run-21-sec-low.mp4' />
            <ParticipantsWrapper>
                <a href="/participants">{t('participants:profile.backToParticipants')}</a>
                {loading && <p>{t('participants:table.loading')}</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {!loading && !error && profile && (
                    <>
                        <h1>{formatParticipantName(profile.name)}</h1>
                        <h2>{t('participants:profile.title')}</h2>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    <th>{t('participants:profile.table.year')}</th>
                                    <th>{t('participants:profile.table.status')}</th>
                                    <th>{t('participants:table.distance')}</th>
                                    <th>{t('participants:table.team')}</th>
                                    <th>{t('participants:table.finish')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {profile.participations.map((participation) => {
                                    const finishTime = getFinishTime(participation);

                                    return (
                                        <TableRow key={`${participation.year}-${participation.distance}-${participation.bib ?? participation.name}`} highlighted={false}>
                                            <td>{participation.year}</td>
                                            <td>{t(`participants:profile.status.${participation.status}`)}</td>
                                            <td>{participation.distance}</td>
                                            <td>{participation.team}</td>
                                            <td>{finishTime ?? '-'}</td>
                                        </TableRow>
                                    );
                                })}
                            </tbody>
                        </table>
                    </>
                )}
            </ParticipantsWrapper>
        </HomeContainer>
    );
};

export default ParticipantProfile;
