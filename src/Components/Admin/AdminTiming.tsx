import React from "react";
import axios from "axios";
import {
    AdminErrorText,
    AdminStatusText,
    TimingCheckpointButton,
    TimingCheckpointDetails,
    TimingCheckpointMenu,
    TimingGroup,
    TimingGroupTitle,
    TimingParticipantButton,
    TimingParticipantMeta,
    TimingParticipantsGrid,
    AdminLabel,
} from "./styles";

type TimingParticipant = {
    email: string;
    name: string;
    distance: string;
    bib?: number | null;
    last_checkpoint?: string | null;
    last_checkpoint_time?: string | null;
};

type Checkpoint = {
    id: number;
    checkpoint_name: string;
    checkpoint_name_bg: string;
    checkpoint_distance: number;
    checkpoint_elevation: number;
    checkpoint_final: "14" | "26" | null;
    checkpoint_for: string;
    checkpoint_referee: string | null;
};

const apiUrl = process.env.REACT_APP_REGISTRATION_API_URL;

const DISTANCE_GROUPS = [
    { distance: "26", title: "26 км", color: "orange" as const },
    { distance: "14", title: "14 км", color: "black" as const },
];

const AdminTiming: React.FC = () => {
    const [participants, setParticipants] = React.useState<TimingParticipant[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [bibFilter, setBibFilter] = React.useState("");
    const [checkpoints, setCheckpoints] = React.useState<Checkpoint[]>([]);
    const [selectedCheckpointId, setSelectedCheckpointId] = React.useState<number | null>(null);

    React.useEffect(() => {
        const fetchParticipants = async () => {
            if (!apiUrl) {
                setError("Missing API URL configuration");
                setLoading(false);
                return;
            }

            try {
                const [participantsResponse, checkpointsResponse] = await Promise.all([
                    axios.get<TimingParticipant[]>(`${apiUrl}/admin/participants`, { withCredentials: true }),
                    axios.get<Checkpoint[]>(`${apiUrl}/admin/checkpoints`, { withCredentials: true }),
                ]);
                setParticipants(participantsResponse.data);
                setCheckpoints(checkpointsResponse.data);
            } catch {
                setError("Could not load timing data.");
            } finally {
                setLoading(false);
            }
        };

        fetchParticipants();
    }, []);

    if (loading) {
        return <AdminStatusText>Зареждане на времеизмерване...</AdminStatusText>;
    }

    if (error) {
        return <AdminErrorText>{error}</AdminErrorText>;
    }

    const filteredParticipants = participants.filter((participant) => (
        !bibFilter || participant.bib?.toString().includes(bibFilter)
    ));
    const selectedCheckpoint = checkpoints.find((checkpoint) => checkpoint.id === selectedCheckpointId) ?? null;
    const appliesToDistance = (checkpoint: Checkpoint, distance: string) => (
        checkpoint.checkpoint_for.split("|").includes(distance)
    );

    return (
        <>
            {checkpoints.length > 0 && (
                <TimingCheckpointMenu aria-label="Контролни пунктове">
                    {checkpoints.map((checkpoint) => (
                        <TimingCheckpointButton
                            key={checkpoint.id}
                            active={checkpoint.id === selectedCheckpointId}
                            type="button"
                            onClick={() => setSelectedCheckpointId(checkpoint.id)}
                        >
                            {checkpoint.checkpoint_name_bg}
                            <small>
                                {checkpoint.checkpoint_final
                                    ? `Финал ${checkpoint.checkpoint_final} км`
                                    : `${checkpoint.checkpoint_distance} км / ${checkpoint.checkpoint_elevation} м`}
                            </small>
                        </TimingCheckpointButton>
                    ))}
                </TimingCheckpointMenu>
            )}
            <AdminLabel>
                Стартов номер:
                <input
                    inputMode="numeric"
                    onChange={(event) => setBibFilter(event.target.value)}
                    placeholder="Търсене по номер"
                    type="search"
                    value={bibFilter}
                />
            </AdminLabel>
            <TimingParticipantsGrid>
                {DISTANCE_GROUPS.map((group) => {
                    const groupParticipants = filteredParticipants
                    .filter((participant) => participant.distance === group.distance)
                    .sort((first, second) => (first.bib ?? Number.MAX_SAFE_INTEGER) - (second.bib ?? Number.MAX_SAFE_INTEGER));

                    return (
                        <TimingGroup key={group.distance} color={group.color}>
                            <TimingGroupTitle>{group.title}</TimingGroupTitle>
                            {selectedCheckpoint && (
                                <TimingCheckpointDetails>
                                    {appliesToDistance(selectedCheckpoint, group.distance)
                                        ? selectedCheckpoint.checkpoint_final === group.distance
                                            ? `Финал: ${selectedCheckpoint.checkpoint_name_bg}`
                                            : `Контролен пункт: ${selectedCheckpoint.checkpoint_name_bg}`
                                        : "Не е контролен пункт за тази дистанция"}
                                    {appliesToDistance(selectedCheckpoint, group.distance)
                                        && selectedCheckpoint.checkpoint_referee
                                        && ` | Съдия: ${selectedCheckpoint.checkpoint_referee}`}
                                </TimingCheckpointDetails>
                            )}
                            {groupParticipants.map((participant) => (
                                <TimingParticipantButton key={participant.email} color={group.color} type="button">
                                    <strong>{participant.bib ?? "DNS"}</strong>
                                    <span>{participant.name}</span>
                                    <TimingParticipantMeta>
                                        <span>{participant.last_checkpoint ?? "Няма отчетен пункт"}</span>
                                        <time>{participant.last_checkpoint_time ?? "-"}</time>
                                    </TimingParticipantMeta>
                                </TimingParticipantButton>
                            ))}
                        </TimingGroup>
                    );
                })}
            </TimingParticipantsGrid>
        </>
    );
};

export default AdminTiming;
