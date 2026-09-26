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
import { readCachedCheckpoints, readCachedParticipants, readCachedRaceStart } from "./participantCache";

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
    did_not_finish: boolean;
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
const PARTICIPANT_CACHE_PREFIX = "osogovo-admin-checkpoint-participants:";

const byPassageTime = (first: CheckpointParticipant, second: CheckpointParticipant) => (
    new Date(first.passed_at ?? first.previous_checkpoint_time ?? 0).getTime()
    - new Date(second.passed_at ?? second.previous_checkpoint_time ?? 0).getTime()
);

const uniqueParticipantsByEmail = (participants: CheckpointParticipant[]) => {
    const participantsByEmail = new Map<string, CheckpointParticipant>();
    participants.forEach((participant) => {
        const existing = participantsByEmail.get(participant.email);
        if (!existing || (!existing.passed_at && participant.passed_at)) {
            participantsByEmail.set(participant.email, participant);
        }
    });
    return Array.from(participantsByEmail.values());
};

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
type SyncedResult = { id: string; bib: number };

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

const readCachedTiming = (checkpointName: string): CheckpointTimingResponse | null => {
    try {
        const raw = window.localStorage.getItem(`${PARTICIPANT_CACHE_PREFIX}${checkpointName}`);
        return raw ? JSON.parse(raw) as CheckpointTimingResponse : null;
    } catch {
        return null;
    }
};

const writeCachedTiming = (checkpointName: string, data: CheckpointTimingResponse) => {
    try {
        window.localStorage.setItem(`${PARTICIPANT_CACHE_PREFIX}${checkpointName}`, JSON.stringify(data));
    } catch {
        // Storage may be unavailable; live network loading still works.
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
    const [entryError, setEntryError] = React.useState<string | null>(null);
    const [errorCloseCountdown, setErrorCloseCountdown] = React.useState<number | null>(null);
    const [bibFilter, setBibFilter] = React.useState("");
    const [confirmingParticipant, setConfirmingParticipant] = React.useState<CheckpointParticipant | null>(null);
    const [editingParticipant, setEditingParticipant] = React.useState<CheckpointParticipant | null>(null);
    const [manualPassedDate, setManualPassedDate] = React.useState("");
    const [manualPassedTime, setManualPassedTime] = React.useState("");
    const [pendingCount, setPendingCount] = React.useState(() => readPendingQueue().length);
    const [flushingQueue, setFlushingQueue] = React.useState(false);
    const [syncedResults, setSyncedResults] = React.useState<SyncedResult[]>([]);
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
                const [timingResponse, raceStartResponse] = await Promise.allSettled([
                    axios.get<CheckpointTimingResponse>(
                        `${apiUrl}/admin/timing/${encodeURIComponent(checkpointName)}`,
                        { withCredentials: true },
                    ),
                    axios.get<{ raceStart: RaceStart | null }>(
                        `${apiUrl}/admin/race-start`,
                        { withCredentials: true },
                    ),
                ]);
                const cachedTiming = readCachedTiming(checkpointName);
                const cachedParticipants = readCachedParticipants();
                const cachedCheckpoint = readCachedCheckpoints<Checkpoint>()
                    .find((checkpoint) => checkpoint.checkpoint_name === checkpointName);
                const cachedRaceStart = readCachedRaceStart<RaceStart>();

                if (timingResponse.status === "fulfilled") {
                    const liveTiming = timingResponse.value.data;
                    const cachedParticipants = readCachedParticipants();
                    const timingParticipants = cachedParticipants.length > 0
                        ? cachedParticipants
                            .filter((participant) => participant.bib !== null && participant.bib !== undefined)
                            .map((participant) => {
                                const timingParticipant = liveTiming.participants.find((item) => item.email === participant.email);
                                return timingParticipant ?? {
                                    email: participant.email,
                                    name: participant.name,
                                    distance: participant.distance,
                                    bib: participant.bib as number,
                                    did_not_finish: false,
                                    passed_at: null,
                                    recorded_by_name: null,
                                    previous_checkpoint_name: null,
                                    previous_checkpoint_distance: null,
                                    previous_checkpoint_time: null,
                                };
                            })
                        : liveTiming.participants;
                    const mergedTiming = { ...liveTiming, participants: uniqueParticipantsByEmail(timingParticipants) };
                    setData(mergedTiming);
                    writeCachedTiming(checkpointName, mergedTiming);
                } else if (cachedTiming) {
                    setData(cachedParticipants.length > 0
                        ? {
                            ...cachedTiming,
                            participants: uniqueParticipantsByEmail(cachedParticipants
                                .filter((participant) => participant.bib !== null && participant.bib !== undefined)
                                .map((participant) => {
                                    const cachedParticipant = cachedTiming.participants.find((item) => item.email === participant.email);
                                    return cachedParticipant
                                        ? { ...cachedParticipant, did_not_finish: cachedParticipant.did_not_finish ?? false }
                                        : {
                                            email: participant.email,
                                            name: participant.name,
                                            distance: participant.distance,
                                            bib: participant.bib as number,
                                            did_not_finish: false,
                                            passed_at: null,
                                            recorded_by_name: null,
                                            previous_checkpoint_name: null,
                                            previous_checkpoint_distance: null,
                                            previous_checkpoint_time: null,
                                        };
                                })),
                        }
                        : {
                            ...cachedTiming,
                            participants: uniqueParticipantsByEmail(cachedTiming.participants.map((participant) => ({
                                ...participant,
                                did_not_finish: participant.did_not_finish ?? false,
                            }))),
                        });
                } else if (cachedCheckpoint && cachedParticipants.length > 0) {
                    const checkpointParticipants: CheckpointParticipant[] = uniqueParticipantsByEmail(cachedParticipants
                        .filter((participant) => participant.bib !== null && participant.bib !== undefined)
                        .map((participant) => ({
                            email: participant.email,
                            name: participant.name,
                            distance: participant.distance,
                            bib: participant.bib as number,
                            did_not_finish: false,
                            passed_at: null,
                            recorded_by_name: null,
                            previous_checkpoint_name: null,
                            previous_checkpoint_distance: null,
                            previous_checkpoint_time: null,
                        })));
                    setData({ checkpoint: cachedCheckpoint, participants: checkpointParticipants });
                } else {
                    throw timingResponse.reason;
                }

                if (raceStartResponse.status === "fulfilled") {
                    setRaceStartAt(raceStartResponse.value.data.raceStart?.started_at ?? null);
                } else if (cachedRaceStart) {
                    setRaceStartAt(cachedRaceStart.started_at);
                }
                await flushPendingQueue();
            } catch {
                setError("Данните за контролния пункт не можаха да бъдат заредени.");
            } finally {
                setLoading(false);
            }
        };

        loadTiming();
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

    React.useEffect(() => {
        if (!entryError) {
            setErrorCloseCountdown(null);
            return;
        }

        let remainingSeconds = 5;
        setErrorCloseCountdown(remainingSeconds);
        const interval = window.setInterval(() => {
            remainingSeconds -= 1;
            setErrorCloseCountdown(remainingSeconds);

            if (remainingSeconds <= 0) {
                window.clearInterval(interval);
                setEntryError(null);
                setConfirmingParticipant(null);
                setEditingParticipant(null);
            }
        }, 1000);

        return () => window.clearInterval(interval);
    }, [entryError]);

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
                setSyncedResults((current) => (
                    current.some((syncedResult) => syncedResult.id === entry.id)
                        ? current
                        : [...current, { id: entry.id, bib: entry.bib }]
                ));
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

        setEntryError(null);
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
                setEntryError(`Няма връзка. Резултатът за номер ${participant.bib} е запазен и ще бъде изпратен автоматично.`);
                return false;
            }

            if ("rejectedStatus" in outcome) {
                setEntryError(outcome.rejectedStatus === 409
                    ? "Състезанието не е активно. Въвеждането на времена е изключено."
                    : `Резултатът за номер ${participant.bib} не можа да бъде записан.`);
                return false;
            }

            return true;
        } finally {
            setSavingBib(null);
        }
    };

    const setParticipantDidNotFinish = async (participant: CheckpointParticipant, didNotFinish: boolean) => {
        if (!apiUrl || savingBib !== null) return;

        try {
            setSavingBib(participant.bib);
            setEntryError(null);
            await axios.patch(
                `${apiUrl}/admin/participants/${encodeURIComponent(participant.email)}/did-not-finish`,
                { didNotFinish },
                { withCredentials: true },
            );
            setData((current) => {
                if (!current) return current;
                const updated = {
                    ...current,
                    participants: current.participants.map((item) => item.email === participant.email
                        ? { ...item, did_not_finish: didNotFinish }
                        : item),
                };
                if (checkpointName) writeCachedTiming(checkpointName, updated);
                return updated;
            });
            closeEntryDialog();
        } catch {
            setEntryError(`DNF статусът за номер ${participant.bib} не можа да бъде променен.`);
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

    const closeEntryDialog = () => {
        setEntryError(null);
        setErrorCloseCountdown(null);
        setConfirmingParticipant(null);
        setEditingParticipant(null);
    };

    if (loading) {
        return <AdminStatusText>Зареждане на контролния пункт...</AdminStatusText>;
    }

    if (!data) {
        return <AdminErrorText>{error ?? "Контролният пункт не е намерен."}</AdminErrorText>;
    }

    const syncedParticipantNames = Array.from(new Set(
        syncedResults
            .map(({ bib }) => data.participants.find((participant) => participant.bib === bib)?.name)
            .filter((name): name is string => Boolean(name)),
    ));
    console.log('syncedParticipantNames', syncedParticipantNames);
    console.log('syncedResults', syncedResults);
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
                    Изчакват изпращане: {pendingCount} {pendingCount === 1 ? "резултат" : `резултата`}. Ще бъдат изпратени отново автоматично. &nbsp;
                    <AdminBibButton
                        disabled={flushingQueue}
                        type="button"
                        onClick={async () => {
                            setFlushingQueue(true);
                            try {
                                await flushPendingQueue();
                            } finally {
                                setFlushingQueue(false);
                            }
                        }}
                    >
                        {flushingQueue ? "Опит..." : "Опитай отново"}
                    </AdminBibButton>
                </AdminStatusText>
            )}
            {syncedResults.length > 0 && (
                <AdminStatusText style={{ color: "#8a5a00" }} role="status">
                    Синхронизирани резултати: {syncedResults.length}.
                    {syncedParticipantNames.length > 0 && ` Участници: ${syncedParticipantNames.join(", ")}.`}
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
            {bibFilter && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", width: "100%" }}>
                    {data.participants
                        .filter((participant) => participant.bib.toString().includes(bibFilter))
                        .map((participant) => {
                            const passed = Boolean(participant.passed_at);
                            return (
                                <TimingEntryParticipant
                                    as={passed ? "div" : "button"}
                                    disabled={passed ? undefined : savingBib !== null || (!raceIsLive && !raceFinished)}
                                    key={`bib-match-${participant.email}`}
                                    passed={passed}
                                    type={passed ? undefined : "button"}
                                    style={{ width: "auto", minWidth: "220px" }}
                                    onClick={() => passed ? openManualEdit(participant) : recordPassage(participant)}
                                >
                                    <strong>{participant.bib}</strong>
                                    <span>{participant.name}</span>
                                </TimingEntryParticipant>
                            );
                        })}
                </div>
            )}
            {error && <AdminErrorText>{error}</AdminErrorText>}
            <TimingParticipantsGrid>
                {DISTANCES.map((distance) => {
                    const appliesToDistance = data.checkpoint.checkpoint_for.split("|").includes(distance);
                    const participants = data.participants.filter((participant) => participant.distance === distance);
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
                                                <time>
                                                    {participant.did_not_finish
                                                        ? "DNF"
                                                        : formatElapsedTime(participant.passed_at, raceStartAt)}
                                                </time>
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
                                                            {participant.did_not_finish
                                                                ? "DNF"
                                                                : formatElapsedTime(participant.previous_checkpoint_time, raceStartAt)}
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
                <AdminDialogBackdrop onMouseDown={() => savingBib === null && closeEntryDialog()}>
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
                        {entryError && <AdminErrorText>{entryError}</AdminErrorText>}
                        <AdminDialogActions>
                            <AdminBibButton
                                disabled={savingBib !== null}
                                type="button"
                                onClick={closeEntryDialog}
                            >
                                {entryError ? `Затвори (${errorCloseCountdown ?? 0})` : "Отказ"}
                            </AdminBibButton>
                            {!entryError && (
                                <>
                                    <AdminBibButton
                                        disabled={savingBib !== null}
                                        type="button"
                                        onClick={() => setParticipantDidNotFinish(confirmingParticipant, !confirmingParticipant.did_not_finish)}
                                    >
                                        {confirmingParticipant.did_not_finish ? "Отмени DNF" : "DNF"}
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
                                </>
                            )}
                        </AdminDialogActions>
                    </AdminDialog>
                </AdminDialogBackdrop>,
                document.body,
            )}
            {editingParticipant && createPortal(
                <AdminDialogBackdrop onMouseDown={() => savingBib === null && closeEntryDialog()}>
                    <AdminDialog onSubmit={submitManualEdit} onMouseDown={(event) => event.stopPropagation()}>
                        <h2>Ръчно време</h2>
                        <p>
                            Въведете точната дата и час за номер {editingParticipant.bib}, {editingParticipant.name}.
                        </p>
                        {entryError && <AdminErrorText>{entryError}</AdminErrorText>}
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
                                onClick={closeEntryDialog}
                            >
                                {entryError ? `Затвори (${errorCloseCountdown ?? 0})` : "Отказ"}
                            </AdminBibButton>
                            {!entryError && (
                                <>
                                    <AdminBibButton
                                        disabled={savingBib !== null}
                                        type="button"
                                        onClick={() => setParticipantDidNotFinish(editingParticipant, !editingParticipant.did_not_finish)}
                                    >
                                        {editingParticipant.did_not_finish ? "Отмени DNF" : "DNF"}
                                    </AdminBibButton>
                                    <SignOutButton
                                        disabled={savingBib !== null || !manualPassedDate || !manualPassedTime}
                                        type="submit"
                                    >
                                        {savingBib !== null ? "Записване..." : "Запиши време"}
                                    </SignOutButton>
                                </>
                            )}
                        </AdminDialogActions>
                    </AdminDialog>
                </AdminDialogBackdrop>,
                document.body,
            )}
        </>
    );
};

export default AdminCheckpointTiming;