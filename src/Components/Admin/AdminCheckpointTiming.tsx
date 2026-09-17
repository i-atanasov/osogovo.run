import React from "react";
import axios from "axios";
import { ArrowLeft, Eraser, Pencil } from "lucide-react";
import { createPortal } from "react-dom";
import { useNavigate, useParams } from "react-router-dom";
import {
    AdminBibButton,
    AdminDialog,
    AdminDialogActions,
    AdminDialogBackdrop,
    AdminErrorText,
    AdminIconButton,
    AdminLabel,
    AdminStatusText,
    SignOutButton,
    TimingEntryActions,
    TimingEntryGroup,
    TimingEntryHeading,
    TimingEntryParticipant,
    TimingEntrySection,
    TimingParticipantsGrid,
} from "./styles";

type Checkpoint = {
    checkpoint_name: string;
    checkpoint_name_bg: string;
    checkpoint_distance: number;
    checkpoint_for: string;
};

type CheckpointParticipant = {
    email: string;
    name: string;
    distance: string;
    bib: number;
    passed_at: string | null;
    recorded_by_name: string | null;
    previous_checkpoint_name: string | null;
    previous_checkpoint_distance: number | null;
    previous_checkpoint_time: string | null;
};

type CheckpointTimingResponse = {
    checkpoint: Checkpoint;
    participants: CheckpointParticipant[];
};

type RaceStart = {
    started_at: string;
};

const apiUrl = process.env.REACT_APP_REGISTRATION_API_URL;
const DISTANCES = ["26", "14"];
const RACE_DURATION_MILLISECONDS = 7 * 60 * 60 * 1000;

const byPassageTime = (first: CheckpointParticipant, second: CheckpointParticipant) => (
    new Date(first.passed_at ?? first.previous_checkpoint_time ?? 0).getTime()
    - new Date(second.passed_at ?? second.previous_checkpoint_time ?? 0).getTime()
);

const formatElapsedTime = (value: string | null, raceStartAt: string | null) => {
    if (!value || !raceStartAt) {
        return "-";
    }

    const elapsedSeconds = Math.floor((new Date(value).getTime() - new Date(raceStartAt).getTime()) / 1000);
    if (elapsedSeconds < 0) {
        return "-";
    }

    const hours = Math.floor(elapsedSeconds / 3600);
    const minutes = Math.floor((elapsedSeconds % 3600) / 60);
    const seconds = elapsedSeconds % 60;
    return [hours, minutes, seconds].map((part) => part.toString().padStart(2, "0")).join(":");
};

const formatDateTimeLocal = (value: string) => {
    const date = new Date(value);
    const timezoneOffset = date.getTimezoneOffset() * 60_000;
    return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 19);
};

type QueuedResult = {
    id: string;
    checkpointName: string;
    bib: number;
    passedAt?: string | null;
};

type QueuedResultResponse = { passedAt: string | null; recordedByName: string };

const PENDING_RESULTS_STORAGE_KEY = "osogovo-admin-timing-pending-results";

const readPendingQueue = (): QueuedResult[] => {
    try {
        const raw = window.localStorage.getItem(PENDING_RESULTS_STORAGE_KEY);
        return raw ? JSON.parse(raw) as QueuedResult[] : [];
    } catch {
        return [];
    }
};

const writePendingQueue = (queue: QueuedResult[]) => {
    try {
        window.localStorage.setItem(PENDING_RESULTS_STORAGE_KEY, JSON.stringify(queue));
    } catch {
        // Storage may be unavailable (e.g. private browsing); the request still gets sent, just without retry safety.
    }
};

const generateRequestId = () => (
    window.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`
);

const AdminCheckpointTiming: React.FC = () => {
    const { checkpointName } = useParams();
    const navigate = useNavigate();
    const [data, setData] = React.useState<CheckpointTimingResponse | null>(null);
    const [raceStartAt, setRaceStartAt] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [savingBib, setSavingBib] = React.useState<number | null>(null);
    const [error, setError] = React.useState<string | null>(null);
    const [bibFilter, setBibFilter] = React.useState("");
    const [confirmingParticipant, setConfirmingParticipant] = React.useState<CheckpointParticipant | null>(null);
    const [editingParticipant, setEditingParticipant] = React.useState<CheckpointParticipant | null>(null);
    const [manualPassedDate, setManualPassedDate] = React.useState("");
    const [manualPassedTime, setManualPassedTime] = React.useState("");
    const [pendingCount, setPendingCount] = React.useState(() => readPendingQueue().length);
    const [now, setNow] = React.useState(Date.now());
    const raceStartTime = raceStartAt ? new Date(raceStartAt).getTime() : null;
    const raceFinished = raceStartTime !== null && now >= raceStartTime + RACE_DURATION_MILLISECONDS;
    const raceIsLive = raceStartTime !== null && now >= raceStartTime && !raceFinished;

    React.useEffect(() => {
        const loadTiming = async () => {
            if (!apiUrl || !checkpointName) {
                setError("Липсва конфигурация за контролния пункт.");
                setLoading(false);
                return;
            }

            try {
                const [timingResponse, raceStartResponse] = await Promise.all([
                    axios.get<CheckpointTimingResponse>(
                        `${apiUrl}/admin/timing/${encodeURIComponent(checkpointName)}`,
                        { withCredentials: true },
                    ),
                    axios.get<{ raceStart: RaceStart | null }>(
                        `${apiUrl}/admin/race-start`,
                        { withCredentials: true },
                    ),
                ]);
                setData(timingResponse.data);
                setRaceStartAt(raceStartResponse.data.raceStart?.started_at ?? null);
            } catch {
                setError("Данните за контролния пункт не можаха да бъдат заредени.");
            } finally {
                setLoading(false);
            }
        };

        loadTiming();
    }, [checkpointName]);

    // Retry anything left over from a previous session (e.g. the tab was closed while offline).
    React.useEffect(() => {
        flushPendingQueue();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [checkpointName]);

    React.useEffect(() => {
        if (!raceStartAt) {
            return;
        }

        const updateNow = () => setNow(Date.now());
        updateNow();
        const interval = window.setInterval(updateNow, 1000);
        return () => window.clearInterval(interval);
    }, [raceStartAt]);

    const applyResultToParticipant = (checkpointOfResult: string, bib: number, response: QueuedResultResponse) => {
        if (checkpointOfResult !== checkpointName) {
            return;
        }

        setData((current) => current ? {
            ...current,
            participants: current.participants.map((item) => item.bib === bib
                ? { ...item, passed_at: response.passedAt, recorded_by_name: response.recordedByName }
                : item),
        } : current);
    };

    // Sends every queued entry in order, keeping network/server failures queued for the next attempt
    // and dropping only requests the server permanently rejected (e.g. validation errors).
    const flushPendingQueue = async (): Promise<Record<string, QueuedResultResponse | { rejectedStatus: number }>> => {
        if (!apiUrl) {
            return {};
        }

        const queue = readPendingQueue();
        const remaining: QueuedResult[] = [];
        const outcomes: Record<string, QueuedResultResponse | { rejectedStatus: number }> = {};

        for (const entry of queue) {
            try {
                const response = await axios.post<QueuedResultResponse>(
                    `${apiUrl}/admin/timing/${encodeURIComponent(entry.checkpointName)}`,
                    { bib: entry.bib, requestId: entry.id, ...(entry.passedAt !== undefined && { passedAt: entry.passedAt }) },
                    { withCredentials: true },
                );
                outcomes[entry.id] = response.data;
                applyResultToParticipant(entry.checkpointName, entry.bib, response.data);
            } catch (requestError) {
                const responseStatus = axios.isAxiosError(requestError) ? requestError.response?.status : undefined;
                const isRejectedByServer = responseStatus !== undefined && responseStatus >= 400 && responseStatus < 500;
                if (isRejectedByServer) {
                    outcomes[entry.id] = { rejectedStatus: responseStatus };
                } else {
                    // Network failure or server outage: keep the entry so it retries on the next flush.
                    remaining.push(entry);
                }
            }
        }

        writePendingQueue(remaining);
        setPendingCount(remaining.length);
        return outcomes;
    };

    const savePassage = async (
        participant: CheckpointParticipant,
        passedAt?: string | null,
        allowOutsideLiveRace = false,
    ) => {
        if (!apiUrl || !checkpointName || savingBib !== null || (!raceIsLive && !allowOutsideLiveRace)) {
            return false;
        }

        setError(null);
        setSavingBib(participant.bib);

        const requestId = generateRequestId();
        const queue = readPendingQueue();
        queue.push({ id: requestId, checkpointName, bib: participant.bib, passedAt });
        writePendingQueue(queue);
        setPendingCount(queue.length);

        try {
            const outcomes = await flushPendingQueue();
            const outcome = outcomes[requestId];

            if (outcome === undefined) {
                // Still queued (network failure); the entry is safely persisted and will retry on the next save or reload.
                setError(`Няма връзка. Резултатът за номер ${participant.bib} е запазен и ще бъде изпратен автоматично.`);
                return false;
            }

            if ("rejectedStatus" in outcome) {
                setError(outcome.rejectedStatus === 409
                    ? "Състезанието не е активно. Въвеждането на времена е изключено."
                    : `Резултатът за номер ${participant.bib} не можа да бъде записан.`);
                return false;
            }

            return true;
        } finally {
            setSavingBib(null);
        }
    };

    const recordPassage = (participant: CheckpointParticipant) => {
        if (raceIsLive) {
            setConfirmingParticipant(participant);
        } else if (raceFinished) {
            openManualEdit(participant);
        }
    };

    const openManualEdit = (participant: CheckpointParticipant) => {
        const localDateTime = formatDateTimeLocal(participant.passed_at ?? new Date().toISOString());
        const [date, time] = localDateTime.split("T");
        setEditingParticipant(participant);
        setManualPassedDate(date);
        setManualPassedTime(participant.passed_at ? time : "");
    };

    const submitManualEdit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!editingParticipant || !manualPassedDate || !manualPassedTime) {
            return;
        }

        const participant = editingParticipant;
        const saved = await savePassage(
            participant,
            new Date(`${manualPassedDate}T${manualPassedTime}`).toISOString(),
            true,
        );
        if (saved) {
            setEditingParticipant(null);
            setManualPassedDate("");
            setManualPassedTime("");
        }
    };

    if (loading) {
        return <AdminStatusText>Зареждане на контролния пункт...</AdminStatusText>;
    }

    if (!data) {
        return <AdminErrorText>{error ?? "Контролният пункт не е намерен."}</AdminErrorText>;
    }

    return (
        <>
            <AdminBibButton type="button" onClick={() => navigate("/admin/timing")}>
                <ArrowLeft aria-hidden size={16} /> Назад към пунктовете
            </AdminBibButton>
            <TimingEntryHeading>
                <h2>{data.checkpoint.checkpoint_name_bg}</h2>
                <span>{data.checkpoint.checkpoint_distance} км</span>
            </TimingEntryHeading>
            <AdminStatusText>
                {raceIsLive
                    ? "Състезанието е активно"
                    : raceFinished
                        ? "Състезанието приключи. Позволено е ръчно въвеждане и корекция на времена."
                        : "Състезанието още не е стартирало. Позволена е само корекция на въведено време."}
            </AdminStatusText>
            {pendingCount > 0 && (
                <AdminStatusText>
                    Изчакват изпращане: {pendingCount}. Ще бъдат опитани отново автоматично.
                </AdminStatusText>
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
            {error && <AdminErrorText>{error}</AdminErrorText>}
            <TimingParticipantsGrid>
                {DISTANCES.map((distance) => {
                    const appliesToDistance = data.checkpoint.checkpoint_for.split("|").includes(distance);
                    const participants = data.participants.filter((participant) => (
                        participant.distance === distance && participant.bib.toString().includes(bibFilter)
                    ));
                    const passed = participants.filter((participant) => participant.passed_at).sort(byPassageTime);
                    const incoming = participants.filter((participant) => !participant.passed_at);
                    const incomingGroups = Array.from(new Map(incoming.map((participant) => [
                        participant.previous_checkpoint_name ?? "Без предишен пункт",
                        incoming.filter((candidate) => (
                            candidate.previous_checkpoint_name === participant.previous_checkpoint_name
                        )).sort(byPassageTime),
                    ])).entries()).sort((first, second) => (
                        (second[1][0]?.previous_checkpoint_distance ?? -1)
                        - (first[1][0]?.previous_checkpoint_distance ?? -1)
                    ));

                    return (
                        <TimingEntrySection key={distance}>
                            <h3>{distance} км</h3>
                            {!appliesToDistance ? (
                                <AdminStatusText>Пунктът не е част от тази дистанция.</AdminStatusText>
                            ) : (
                                <>
                                    <TimingEntryGroup>
                                        <h4>Преминали <span>{passed.length}</span></h4>
                                        {passed.length === 0 && <AdminStatusText>Все още няма преминали.</AdminStatusText>}
                                        {passed.map((participant) => (
                                            <TimingEntryParticipant as="div" key={participant.email} passed>
                                                <strong>{participant.bib}</strong>
                                                <span>
                                                    {participant.name}
                                                    {participant.recorded_by_name && (
                                                        <small>Отчетен от {participant.recorded_by_name}</small>
                                                    )}
                                                </span>
                                                <time>{formatElapsedTime(participant.passed_at, raceStartAt)}</time>
                                                <TimingEntryActions>
                                                    <AdminIconButton
                                                        aria-label={`Редактирай резултата на номер ${participant.bib}`}
                                                        disabled={savingBib !== null}
                                                        title="Редактирай време"
                                                        type="button"
                                                        onClick={() => openManualEdit(participant)}
                                                    >
                                                        <Pencil aria-hidden size={17} />
                                                    </AdminIconButton>
                                                    <AdminIconButton
                                                        aria-label={`Изчисти резултата на номер ${participant.bib}`}
                                                        disabled={savingBib !== null || !raceIsLive}
                                                        title="Изчисти резултат"
                                                        type="button"
                                                        onClick={() => savePassage(participant, null)}
                                                    >
                                                        <Eraser aria-hidden size={17} />
                                                    </AdminIconButton>
                                                </TimingEntryActions>
                                            </TimingEntryParticipant>
                                        ))}
                                    </TimingEntryGroup>
                                    <TimingEntryGroup>
                                        <h4>Очаквани <span>{incoming.length}</span></h4>
                                        {incoming.length === 0 && <AdminStatusText>Няма повече очаквани участници.</AdminStatusText>}
                                        {incomingGroups.map(([groupName, groupParticipants]) => (
                                            <div key={groupName}>
                                                <h5>{groupName}</h5>
                                                {groupParticipants.map((participant) => (
                                                    <TimingEntryParticipant
                                                        key={participant.email}
                                                        disabled={savingBib !== null || (!raceIsLive && !raceFinished)}
                                                        passed={false}
                                                        type="button"
                                                        onClick={() => recordPassage(participant)}
                                                    >
                                                        <strong>{participant.bib}</strong>
                                                        <span>{participant.name}</span>
                                                        <time>
                                                            {formatElapsedTime(participant.previous_checkpoint_time, raceStartAt)}
                                                        </time>
                                                    </TimingEntryParticipant>
                                                ))}
                                            </div>
                                        ))}
                                    </TimingEntryGroup>
                                </>
                            )}
                        </TimingEntrySection>
                    );
                })}
            </TimingParticipantsGrid>
            {confirmingParticipant && createPortal(
                <AdminDialogBackdrop onMouseDown={() => savingBib === null && setConfirmingParticipant(null)}>
                    <AdminDialog
                        onSubmit={async (event) => {
                            event.preventDefault();
                            const saved = await savePassage(confirmingParticipant);
                            if (saved) {
                                setConfirmingParticipant(null);
                            }
                        }}
                        onMouseDown={(event) => event.stopPropagation()}
                    >
                        <h2>Потвърждение на резултат</h2>
                        <p>
                            Потвърдете преминаването на номер {confirmingParticipant.bib}, {confirmingParticipant.name}.
                        </p>
                        <AdminDialogActions>
                            <AdminBibButton
                                disabled={savingBib !== null}
                                type="button"
                                onClick={() => setConfirmingParticipant(null)}
                            >
                                Отказ
                            </AdminBibButton>
                            <AdminBibButton
                                disabled={savingBib !== null || !raceIsLive}
                                type="button"
                                onClick={() => {
                                    const participant = confirmingParticipant;
                                    setConfirmingParticipant(null);
                                    openManualEdit(participant);
                                }}
                            >
                                Ръчно време
                            </AdminBibButton>
                            <SignOutButton autoFocus disabled={savingBib !== null || !raceIsLive} type="submit">
                                {savingBib !== null ? "Записване..." : "Потвърди сега"}
                            </SignOutButton>
                        </AdminDialogActions>
                    </AdminDialog>
                </AdminDialogBackdrop>,
                document.body,
            )}
            {editingParticipant && createPortal(
                <AdminDialogBackdrop onMouseDown={() => savingBib === null && setEditingParticipant(null)}>
                    <AdminDialog onSubmit={submitManualEdit} onMouseDown={(event) => event.stopPropagation()}>
                        <h2>Ръчно време</h2>
                        <p>
                            Въведете точната дата и час за номер {editingParticipant.bib}, {editingParticipant.name}.
                        </p>
                        <label htmlFor="manual-checkpoint-date">
                            Дата
                            <input
                                autoFocus
                                id="manual-checkpoint-date"
                                onChange={(event) => setManualPassedDate(event.target.value)}
                                required
                                type="date"
                                value={manualPassedDate}
                            />
                        </label>
                        <label htmlFor="manual-checkpoint-time">
                            Час
                            <input
                                id="manual-checkpoint-time"
                                onChange={(event) => setManualPassedTime(event.target.value)}
                                required
                                step="1"
                                type="time"
                                value={manualPassedTime}
                            />
                        </label>
                        <AdminDialogActions>
                            <AdminBibButton
                                disabled={savingBib !== null}
                                type="button"
                                onClick={() => setEditingParticipant(null)}
                            >
                                Отказ
                            </AdminBibButton>
                            <SignOutButton
                                disabled={savingBib !== null || !manualPassedDate || !manualPassedTime}
                                type="submit"
                            >
                                {savingBib !== null ? "Записване..." : "Запиши време"}
                            </SignOutButton>
                        </AdminDialogActions>
                    </AdminDialog>
                </AdminDialogBackdrop>,
                document.body,
            )}
        </>
    );
};

export default AdminCheckpointTiming;