import React, { useEffect } from "react";
import axios from "axios";
import { useParams, useSearchParams } from "react-router-dom";
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
    checkpointResults: CheckpointResult[];
};

type CheckpointResult = {
    checkpoint_name: string;
    checkpoint_name_bg: string;
    checkpoint_distance: number;
    checkpoint_final?: string | null;
    passed_at: string | null;
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

const formatCheckpointTime = (passedAt: string | null) => (
    passedAt ? new Date(passedAt).toLocaleString() : '-'
);

export const ParticipantProfile: React.FC = () => {
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email') ?? '';
    const [profile, setProfile] = React.useState<ParticipantProfileResponse | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const apiUrl = process.env.REACT_APP_REGISTRATION_API_URL;
    const incomingParticipations = profile?.participations.filter((participation) => participation.status === 'incoming') ?? [];
    const completedParticipations = profile?.participations.filter((participation) => participation.status === 'previous') ?? [];

    useEffect(() => {
        const fetchParticipantProfile = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await axios.get(`${apiUrl}/participant/${id}`, {
                    params: id ? { id } : email ? { email } : undefined,
                });
                setProfile(response.data);
            } catch (err) {
                setError(t('participants:profile.errors.loadFailed'));
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchParticipantProfile();
        }
    }, [apiUrl, email, id, t]);

    const renderParticipationsTable = (participations: Participation[]) => (
        <>
            {participations.map((participation) => {
                const finishTime = getFinishTime(participation);
                const participationKey = `${participation.status}-${participation.year}-${participation.distance}-${participation.bib ?? participation.name}`;

                return (
                    <section key={participationKey}>
                        <h3>{participation.year} / {participation.distance} км</h3>
                        <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed', textAlign: 'left' }}>
                            <colgroup>
                                <col style={{ width: '15%' }} />
                                <col style={{ width: '15%' }} />
                                <col style={{ width: '25%' }} />
                                <col style={{ width: '30%' }} />
                            </colgroup>
                            <thead>
                                <tr>
                                    <th>{t('participants:profile.table.year')}</th>
                                    <th>{t('participants:table.distance')}</th>
                                    <th>{t('participants:table.team')}</th>
                                    <th>{t('participants:table.finish')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <TableRow key={participationKey} highlighted={false}>
                                    <td>{participation.year}</td>
                                    <td>{participation.distance}</td>
                                    <td>{participation.team}</td>
                                    <td>{finishTime ?? '-'}</td>
                                </TableRow>
                            </tbody>
                        </table>
                        {participation.checkpointResults.length > 0 && (
                            <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed', textAlign: 'left' }}>
                                <colgroup>
                                    <col style={{ width: '45%' }} />
                                    <col style={{ width: '20%' }} />
                                    <col style={{ width: '35%' }} />
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th>{t('participants:profile.table.checkpoint')}</th>
                                        <th>{t('participants:profile.table.distance')}</th>
                                        <th>{t('participants:profile.table.result')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {participation.checkpointResults.map((checkpoint) => (
                                        <TableRow key={`${participationKey}-${checkpoint.checkpoint_name}`} highlighted={false}>
                                            <td>{checkpoint.checkpoint_name_bg || checkpoint.checkpoint_name}</td>
                                            <td>{checkpoint.checkpoint_distance} км</td>
                                            <td>{formatCheckpointTime(checkpoint.passed_at)}</td>
                                        </TableRow>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </section>
                );
            })}
        </>
    );

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
                        {incomingParticipations.length > 0 && (
                            <>
                                <h2>{t('participants:profile.sections.incoming')}</h2>
                                {renderParticipationsTable(incomingParticipations)}
                            </>
                        )}
                        {completedParticipations.length > 0 && (
                            <>
                                <h2>{t('participants:profile.sections.completed')}</h2>
                                {renderParticipationsTable(completedParticipations)}
                            </>
                        )}
                        <h2>{t('participants:profile.sections.badges')}</h2>
                        <p>{t('participants:profile.sections.badgesDescription')}</p>
                    </>
                )}
            </ParticipantsWrapper>
        </HomeContainer>
    );
};

export default ParticipantProfile;
