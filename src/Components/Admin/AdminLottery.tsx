import React from "react";
import axios from "axios";
import {
    AdminDialog,
    AdminDialogActions,
    AdminDialogBackdrop,
    AdminErrorText,
    AdminFilters,
    AdminStatusText,
    TimingStartButton,
} from "./styles";

type LotteryParticipant = {
    email: string;
    name: string;
    distance: string;
    bib?: number | null;
};

type LotteryDistance = "all" | "14" | "26";

const apiUrl = process.env.REACT_APP_REGISTRATION_API_URL;

const AdminLottery: React.FC = () => {
    const [participants, setParticipants] = React.useState<LotteryParticipant[]>([]);
    const [distance, setDistance] = React.useState<LotteryDistance>("all");
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [isDrawing, setIsDrawing] = React.useState(false);
    const [displayedBib, setDisplayedBib] = React.useState<number | null>(null);
    const [winner, setWinner] = React.useState<LotteryParticipant | null>(null);
    const intervalRef = React.useRef<number | null>(null);
    const timeoutRef = React.useRef<number | null>(null);

    React.useEffect(() => {
        const fetchParticipants = async () => {
            if (!apiUrl) {
                setError("Missing API URL configuration");
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get<LotteryParticipant[]>(`${apiUrl}/admin/participants`, {
                    withCredentials: true,
                });
                setParticipants(response.data);
            } catch {
                setError("Could not load participant data.");
            } finally {
                setLoading(false);
            }
        };

        fetchParticipants();
    }, []);

    React.useEffect(() => () => {
        if (intervalRef.current) {
            window.clearInterval(intervalRef.current);
        }
        if (timeoutRef.current) {
            window.clearTimeout(timeoutRef.current);
        }
    }, []);

    const eligibleParticipants = participants.filter((participant) => (
        Number.isInteger(participant.bib)
        && (distance === "all" || participant.distance === distance)
    ));

    const drawWinner = () => {
        if (isDrawing || eligibleParticipants.length === 0) {
            return;
        }

        setWinner(null);
        setError(null);
        setIsDrawing(true);

        const showRandomBib = () => {
            const randomParticipant = eligibleParticipants[Math.floor(Math.random() * eligibleParticipants.length)];
            setDisplayedBib(randomParticipant.bib ?? null);
        };

        showRandomBib();
        intervalRef.current = window.setInterval(showRandomBib, 100);
        timeoutRef.current = window.setTimeout(() => {
            if (intervalRef.current) {
                window.clearInterval(intervalRef.current);
                intervalRef.current = null;
            }

            const selectedParticipant = eligibleParticipants[Math.floor(Math.random() * eligibleParticipants.length)];
            setDisplayedBib(selectedParticipant.bib ?? null);
            setWinner(selectedParticipant);
            setIsDrawing(false);
        }, 5000);
    };

    const closeResult = () => {
        setWinner(null);
        setDisplayedBib(null);
    };

    if (loading) {
        return <AdminStatusText>Loading participants...</AdminStatusText>;
    }

    if (error && participants.length === 0) {
        return <AdminErrorText>{error}</AdminErrorText>;
    }

    return (
        <section>
            <AdminFilters>
                <label>
                    Дистанция
                    <select
                        value={distance}
                        onChange={(event) => {
                            setDistance(event.target.value as LotteryDistance);
                            setWinner(null);
                            setDisplayedBib(null);
                        }}
                        disabled={isDrawing}
                    >
                        <option value="all">Всички</option>
                        <option value="14">14 км</option>
                        <option value="26">26 км</option>
                    </select>
                </label>
            </AdminFilters>
            <AdminStatusText>
                Участници със стартов номер: {eligibleParticipants.length}
            </AdminStatusText>
            {error && <AdminErrorText>{error}</AdminErrorText>}
            <TimingStartButton
                type="button"
                onClick={drawWinner}
                disabled={isDrawing || eligibleParticipants.length === 0}
            >
                {isDrawing ? "Избиране..." : "Select random number"}
            </TimingStartButton>
            {eligibleParticipants.length === 0 && (
                <AdminStatusText>Няма участници със стартов номер за избраната дистанция.</AdminStatusText>
            )}
            {winner && (
                <AdminStatusText>
                    Избран номер: <strong>{winner.bib}</strong> - {winner.name}
                </AdminStatusText>
            )}
            {(isDrawing || winner) && (
                <AdminDialogBackdrop role="dialog" aria-modal="true" aria-label="Lottery result">
                    <AdminDialog as="div">
                        <h2>{winner ? "Избран участник" : "Избиране на стартов номер"}</h2>
                        <p className="lottery-number">{displayedBib}</p>
                        {winner && <p>{winner.name}</p>}
                        {winner && (
                            <AdminDialogActions>
                                <TimingStartButton type="button" onClick={closeResult}>
                                    Затвори
                                </TimingStartButton>
                            </AdminDialogActions>
                        )}
                    </AdminDialog>
                </AdminDialogBackdrop>
            )}
        </section>
    );
};

export default AdminLottery;
