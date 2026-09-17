import React from "react";
import axios from "axios";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import {
    AdminBibButton,
    AdminDialog,
    AdminDialogActions,
    AdminDialogBackdrop,
    AdminErrorText,
    AdminStatusText,
    TimingCheckpointButton,
    TimingCheckpointDetails,
    TimingCheckpointMenu,
    TimingDistanceColumn,
    TimingGroup,
    TimingGroupTitle,
    TimingParticipantButton,
    TimingParticipantMeta,
    TimingParticipantsGrid,
    TimingManualStartButton,
    TimingRaceClock,
    TimingRaceControls,
    TimingStartButton,
    AdminLabel,
    SignOutButton,
} from "./styles";

type TimingParticipant = {
    email: string;
    name: string;
    distance: string;
    bib: number;
    checkpoint_id: number;
    checkpoint_name_bg: string;
    checkpoint_distance: number;
    passed_at: string;
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

type RaceStart = {
    started_at: string;
    started_by: string;
};

const apiUrl = process.env.REACT_APP_REGISTRATION_API_URL;

const RACE_DURATION_MILLISECONDS = 7 * 60 * 60 * 1000;

const formatDuration = (durationMilliseconds: number) => {
    const elapsedSeconds = Math.floor(Math.abs(durationMilliseconds) / 1000);
    const hours = Math.floor(elapsedSeconds / 3600);
    const minutes = Math.floor((elapsedSeconds % 3600) / 60);
    const seconds = elapsedSeconds % 60;

    return [hours, minutes, seconds].map((value) => value.toString().padStart(2, "0")).join(":");
};

const AdminTiming: React.FC = () => {
    const navigate = useNavigate();
    const [participants, setParticipants] = React.useState<TimingParticipant[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [bibFilter, setBibFilter] = React.useState("");
    const [checkpoints, setCheckpoints] = React.useState<Checkpoint[]>([]);
    const [selectedCheckpointId, setSelectedCheckpointId] = React.useState<number | null>(null);
    const [raceStart, setRaceStart] = React.useState<RaceStart | null>(null);
    const [countdown, setCountdown] = React.useState<number | null>(null);
    const [startingRace, setStartingRace] = React.useState(false);
    const [startConfirmationOpen, setStartConfirmationOpen] = React.useState(false);
    const [manualStartOpen, setManualStartOpen] = React.useState(false);
    const [manualStartAt, setManualStartAt] = React.useState("");
    const [savingManualStart, setSavingManualStart] = React.useState(false);
    const [manualStartError, setManualStartError] = React.useState<string | null>(null);
    const [raceStartError, setRaceStartError] = React.useState<string | null>(null);
    const [checkpointConfirmationOpen, setCheckpointConfirmationOpen] = React.useState(false);
    const [now, setNow] = React.useState(Date.now());

    React.useEffect(() => {
        const fetchParticipants = async () => {
            if (!apiUrl) {
                setError("Missing API URL configuration");
                setLoading(false);
                return;
            }

            try {
                const [participantsResponse, checkpointsResponse, raceStartResponse] = await Promise.all([
                    axios.get<TimingParticipant[]>(`${apiUrl}/admin/timing-results`, { withCredentials: true }),
                    axios.get<Checkpoint[]>(`${apiUrl}/admin/checkpoints`, { withCredentials: true }),
                    axios.get<{ raceStart: RaceStart | null }>(`${apiUrl}/admin/race-start`, { withCredentials: true }),
                ]);
                setParticipants(participantsResponse.data);
                setCheckpoints(checkpointsResponse.data);
                setRaceStart(raceStartResponse.data.raceStart);
            } catch {
                setError("Could not load timing data.");
            } finally {
                setLoading(false);
            }
        };

        fetchParticipants();
    }, []);

    React.useEffect(() => {
        if (countdown === null) {
            return;
        }

        const timeout = window.setTimeout(async () => {
            if (countdown > 1) {
                setCountdown(countdown - 1);
                return;
            }

            setCountdown(0);
            setStartingRace(true);

            try {
                const response = await axios.post<{ raceStart: RaceStart }>(
                    `${apiUrl}/admin/race-start`,
                    undefined,
                    { withCredentials: true },
                );
                setRaceStart(response.data.raceStart);
                setNow(Date.now());
            } catch {
                setRaceStartError("Състезанието не можа да бъде стартирано.");
            } finally {
                setStartingRace(false);
                setCountdown(null);
            }
        }, 1000);

        return () => window.clearTimeout(timeout);
    }, [countdown]);

    React.useEffect(() => {
        if (!raceStart) {
            return;
        }

        const raceEndTime = new Date(raceStart.started_at).getTime() + RACE_DURATION_MILLISECONDS;
        const updateNow = () => {
            const currentTime = Date.now();
            setNow(Math.min(currentTime, raceEndTime));

            return currentTime >= raceEndTime;
        };

        if (updateNow()) {
            return;
        }

        const interval = window.setInterval(() => {
            if (updateNow()) {
                window.clearInterval(interval);
            }
        }, 1000);
        return () => window.clearInterval(interval);
    }, [raceStart]);

    const handleManualStart = async (event: React.FormEvent) => {
        event.preventDefault();
        const parsedStart = new Date(manualStartAt);

        if (!manualStartAt || Number.isNaN(parsedStart.getTime())) {
            setManualStartError("Изберете валидни дата и час.");
            return;
        }

        setManualStartError(null);
        setSavingManualStart(true);

        try {
            const response = await axios.post<{ raceStart: RaceStart }>(
                `${apiUrl}/admin/race-start`,
                { startedAt: parsedStart.toISOString() },
                { withCredentials: true },
            );
            setRaceStart(response.data.raceStart);
            setNow(Date.now());
            setManualStartAt("");
            setManualStartOpen(false);
        } catch {
            setManualStartError("Ръчният старт не можа да бъде записан.");
        } finally {
            setSavingManualStart(false);
        }
    };

    if (loading) {
        return <AdminStatusText>Зареждане на времеизмерване...</AdminStatusText>;
    }

    if (error) {
        return <AdminErrorText>{error}</AdminErrorText>;
    }

    const filteredParticipants = participants.filter((participant) => (
        !bibFilter || participant.bib.toString().includes(bibFilter)
    ));
    const selectedCheckpoint = checkpoints.find((checkpoint) => checkpoint.id === selectedCheckpointId) ?? null;
    const raceStartTime = raceStart ? new Date(raceStart.started_at).getTime() : null;
    const raceStartsInFuture = raceStartTime !== null && raceStartTime > now;
    const raceFinished = raceStartTime !== null && now >= raceStartTime + RACE_DURATION_MILLISECONDS;
    const raceElapsedTime = raceStartTime === null
        ? 0
        : Math.min(Math.max(now - raceStartTime, 0), RACE_DURATION_MILLISECONDS);
    const formatResultTime = (passedAt: string) => {
        if (raceStartTime === null) {
            return "-";
        }

        const elapsedTime = new Date(passedAt).getTime() - raceStartTime;
        return elapsedTime >= 0 ? formatDuration(elapsedTime) : "-";
    };

    return (
        <>
            <TimingRaceControls>
                <div>
                    <TimingStartButton
                        disabled={countdown !== null || savingManualStart}
                        type="button"
                        onClick={() => {
                            setRaceStartError(null);
                            setStartConfirmationOpen(true);
                        }}
                    >
                        {raceStart
                            ? countdown !== null
                                ? startingRace || countdown === 0
                                    ? "Рестартиране..."
                                    : `Рестарт след ${countdown}`
                                : "Рестарт на състезанието"
                            : countdown !== null
                                ? startingRace || countdown === 0
                                    ? "Стартиране..."
                                    : `Старт след ${countdown}`
                                : "Старт на състезанието"}
                    </TimingStartButton>
                    <TimingManualStartButton
                        disabled={countdown !== null || savingManualStart}
                        type="button"
                        onClick={() => {
                            setManualStartError(null);
                            setManualStartOpen(true);
                        }}
                    >
                        Ръчен старт
                    </TimingManualStartButton>
                </div>
                {raceStart && (
                    <TimingRaceClock>
                        <span>
                            {raceStartsInFuture
                                ? "Предстоящ старт"
                                : raceFinished
                                    ? "Състезанието приключи"
                                    : "Състезанието е активно"}
                        </span>
                        <strong>
                            {formatDuration(raceStartsInFuture && raceStartTime !== null ? raceStartTime - now : raceElapsedTime)}
                        </strong>
                        <small>
                            Зададено от {raceStart.started_by} за {new Date(raceStart.started_at).toLocaleString("bg-BG")}
                        </small>
                    </TimingRaceClock>
                )}
                {raceStartError && <AdminErrorText>{raceStartError}</AdminErrorText>}
            </TimingRaceControls>
            {startConfirmationOpen && createPortal(
                <AdminDialogBackdrop onMouseDown={() => setStartConfirmationOpen(false)}>
                    <AdminDialog
                        onSubmit={(event) => {
                            event.preventDefault();
                            setStartConfirmationOpen(false);
                            setCountdown(10);
                        }}
                        onMouseDown={(event) => event.stopPropagation()}
                    >
                        <h2>{raceStart ? "Рестарт на състезанието" : "Старт на състезанието"}</h2>
                        <p>
                            {raceStart
                                ? "Сигурни ли сте, че искате да рестартирате състезанието? След потвърждение започва 10-секундно отброяване."
                                : "Сигурни ли сте, че искате да стартирате състезанието? След потвърждение започва 10-секундно отброяване."}
                        </p>
                        <AdminDialogActions>
                            <AdminBibButton type="button" onClick={() => setStartConfirmationOpen(false)}>
                                Отказ
                            </AdminBibButton>
                            <SignOutButton autoFocus type="submit">
                                {raceStart ? "Потвърди рестарт" : "Потвърди старт"}
                            </SignOutButton>
                        </AdminDialogActions>
                    </AdminDialog>
                </AdminDialogBackdrop>,
                document.body,
            )}
            {manualStartOpen && createPortal(
                <AdminDialogBackdrop onMouseDown={() => !savingManualStart && setManualStartOpen(false)}>
                    <AdminDialog onSubmit={handleManualStart} onMouseDown={(event) => event.stopPropagation()}>
                        <h2>Ръчен старт</h2>
                        <p>Изберете точната дата и час на старта.</p>
                        <label htmlFor="manual-race-start">
                            Дата и час
                            <input
                                autoFocus
                                id="manual-race-start"
                                onChange={(event) => setManualStartAt(event.target.value)}
                                required
                                step="1"
                                type="datetime-local"
                                value={manualStartAt}
                            />
                        </label>
                        {manualStartError && <AdminErrorText>{manualStartError}</AdminErrorText>}
                        <AdminDialogActions>
                            <AdminBibButton
                                disabled={savingManualStart}
                                type="button"
                                onClick={() => setManualStartOpen(false)}
                            >
                                Отказ
                            </AdminBibButton>
                            <SignOutButton disabled={savingManualStart || !manualStartAt} type="submit">
                                {savingManualStart ? "Записване..." : "Задай старт"}
                            </SignOutButton>
                        </AdminDialogActions>
                    </AdminDialog>
                </AdminDialogBackdrop>,
                document.body,
            )}
            {checkpoints.length > 0 && (
                <>
                    <TimingCheckpointMenu aria-label="Контролни пунктове">
                        {[...checkpoints]
                            .sort((first, second) => (
                                first.checkpoint_distance - second.checkpoint_distance || first.id - second.id
                            ))
                            .map((checkpoint) => (
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
                    {selectedCheckpoint && (
                        <TimingStartButton
                            type="button"
                            onClick={() => setCheckpointConfirmationOpen(true)}
                        >
                            Въведи резултат за {selectedCheckpoint.checkpoint_name_bg}
                        </TimingStartButton>
                    )}
                </>
            )}
            {checkpointConfirmationOpen && selectedCheckpoint && createPortal(
                <AdminDialogBackdrop onMouseDown={() => setCheckpointConfirmationOpen(false)}>
                    <AdminDialog
                        onSubmit={(event) => {
                            event.preventDefault();
                            navigate(`/admin/timing/${encodeURIComponent(selectedCheckpoint.checkpoint_name)}`);
                        }}
                        onMouseDown={(event) => event.stopPropagation()}
                    >
                        <h2>Въвеждане на резултати</h2>
                        <p>Ще въвеждате резултати за {selectedCheckpoint.checkpoint_name_bg}. Продължавате ли?</p>
                        <AdminDialogActions>
                            <AdminBibButton type="button" onClick={() => setCheckpointConfirmationOpen(false)}>
                                Отказ
                            </AdminBibButton>
                            <SignOutButton autoFocus type="submit">Продължи</SignOutButton>
                        </AdminDialogActions>
                    </AdminDialog>
                </AdminDialogBackdrop>,
                document.body,
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
                {["26", "14"].map((distance) => {
                    const distanceParticipants = filteredParticipants.filter((participant) => participant.distance === distance);

                    return (
                    <TimingDistanceColumn key={distance}>
                        {[...checkpoints]
                            .filter((checkpoint) => checkpoint.checkpoint_for.split("|").includes(distance))
                            .sort((first, second) => (
                                first.checkpoint_distance - second.checkpoint_distance || first.id - second.id
                            ))
                            .map((checkpoint, checkpointIndex) => {
                            const checkpointParticipants = distanceParticipants
                                .filter((participant) => participant.checkpoint_id === checkpoint.id)
                                .sort((first, second) => (
                                    new Date(first.passed_at).getTime() - new Date(second.passed_at).getTime()
                                ));

                            return (
                                <TimingGroup
                                    key={checkpoint.id}
                                    color={checkpointIndex % 2 === 0 ? "orange" : "black"}
                                >
                                    <TimingGroupTitle>{checkpoint.checkpoint_name_bg}</TimingGroupTitle>
                                    <TimingCheckpointDetails>
                                        {checkpoint.checkpoint_final
                                            ? `Финал ${checkpoint.checkpoint_final} км`
                                            : `${checkpoint.checkpoint_distance} км / ${checkpoint.checkpoint_elevation} м`}
                                    </TimingCheckpointDetails>
                                    {checkpointParticipants.length === 0 && (
                                        <AdminStatusText>Все още няма отчетени участници.</AdminStatusText>
                                    )}
                                    {checkpointParticipants.map((participant) => (
                                        <TimingParticipantButton
                                            as="div"
                                            key={`${checkpoint.id}-${participant.email}`}
                                            color={checkpointIndex % 2 === 0 ? "orange" : "black"}
                                        >
                                            <strong>{participant.bib}</strong>
                                            <span>{participant.name}</span>
                                            <TimingParticipantMeta>
                                                <span>{participant.distance} км</span>
                                                <time>{formatResultTime(participant.passed_at)}</time>
                                            </TimingParticipantMeta>
                                        </TimingParticipantButton>
                                    ))}
                                </TimingGroup>
                            );
                        })}
                    </TimingDistanceColumn>
                    );
                })}
            </TimingParticipantsGrid>
        </>
    );
};

export default AdminTiming;
