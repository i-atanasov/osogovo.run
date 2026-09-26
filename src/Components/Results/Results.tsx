import React, { useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { HomeContainer } from "../Home/styles";
import { HeaderComponent } from "../Header/Header";
import { ParticipantsWrapper, TableCellLink, TableRow } from "../Participants/styles";
import { getParticipantPath } from "../Participants/utils";
import { colors } from "../../config/constants";

type CheckpointResult = {
    checkpointId: number;
    checkpointName: string;
    checkpointNameBg: string;
    checkpointDistance: number;
    checkpointFinal: string | null;
    passedAt: string;
};

type Result = {
    id: string;
    name: string;
    birth: string;
    distance: string;
    gender: string;
    bib: number;
    race_start_at: string | null;
    checkpoint_results: CheckpointResult[];
};

export const Results: React.FC = () => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const [results, setResults] = React.useState<Result[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [raceStartAt, setRaceStartAt] = React.useState<string | null>(null);
    const [expandedParticipantIds, setExpandedParticipantIds] = React.useState<Set<string>>(new Set());
    const apiUrl = process.env.REACT_APP_REGISTRATION_API_URL;
    const year = searchParams.get("year") ?? String(new Date().getFullYear());

    useEffect(() => {
        const fetchResults = async (initialLoad = false) => {
            if (initialLoad) {
                setLoading(true);
                setError(null);
            }
            try {
                const response = await axios.get<Result[]>(`${apiUrl}/results`, {
                    params: { year, _ts: Date.now() },
                    headers: { "Cache-Control": "no-cache" },
                });
                setResults(response.data);
                setRaceStartAt(response.data.find((result) => result.race_start_at)?.race_start_at ?? null);
            } catch {
                if (initialLoad) {
                    setError(t("results:errors.loadFailed"));
                }
            } finally {
                if (initialLoad) {
                    setLoading(false);
                }
            }
        };

        fetchResults(true);
        const refreshInterval = window.setInterval(() => fetchResults(), 5000);

        return () => window.clearInterval(refreshInterval);
    }, [apiUrl, t, year]);

    const getLatestCheckpoint = (result: Result) => {
        const checkpoints = result.checkpoint_results ?? [];
        return checkpoints.reduce<CheckpointResult | null>((furthest, checkpoint) => (
            !furthest || checkpoint.checkpointDistance > furthest.checkpointDistance
                ? checkpoint
                : furthest
        ), null);
    };

    const getAge = (result: Result) => Number(year) - Number(result.birth);

    const formatTime = (value: string | null) => {
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

    const renderTablesByCheckpoint = (
        distance: string,
        expansionScope: string,
        predicate: (result: Result) => boolean = () => true,
    ) => {
        const latestResults = results
            .filter((result) => result.distance === distance && predicate(result))
            .map((result) => ({ result, checkpoint: getLatestCheckpoint(result) }))
            .filter((entry): entry is { result: Result; checkpoint: CheckpointResult } => entry.checkpoint !== null);
        const classifiedResults = [...latestResults]
            .sort((first, second) => {
                const checkpointProgress = second.checkpoint.checkpointDistance - first.checkpoint.checkpointDistance;
                if (checkpointProgress !== 0) return checkpointProgress;

                const timeDifference = new Date(first.checkpoint.passedAt).getTime()
                    - new Date(second.checkpoint.passedAt).getTime();
                return timeDifference || first.result.bib - second.result.bib;
            })
            .map((entry, index) => ({ ...entry, position: index + 1 }));
        const checkpointGroups = Array.from(
            new Map(
                classifiedResults.map((entry) => [entry.checkpoint.checkpointId, entry.checkpoint]),
            ).values(),
        ).sort((first, second) => second.checkpointDistance - first.checkpointDistance);

        return (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th>{t("results:table.name")}</th>
                        <th>{t("results:table.bib")}</th>
                        <th>{t("results:table.result")}</th>
                    </tr>
                </thead>
                <tbody>
                    {checkpointGroups.map((checkpoint) => {
                        const checkpointRows = classifiedResults
                            .filter((entry) => entry.checkpoint.checkpointId === checkpoint.checkpointId)
                            .sort((first, second) => {
                                const timeDifference = new Date(first.checkpoint.passedAt).getTime()
                                    - new Date(second.checkpoint.passedAt).getTime();
                                return timeDifference || first.result.bib - second.result.bib;
                            });
                        const isFinish = checkpoint.checkpointFinal !== null
                            && Number(checkpoint.checkpointFinal) === Number(distance);

                        return (
                            <React.Fragment key={checkpoint.checkpointId}>
                                <tr>
                                    <th
                                        colSpan={3}
                                        style={isFinish
                                            ? {
                                                background: colors.OsogovoBlack,
                                                borderTop: "16px solid rgb(240, 240, 240)",
                                                borderBottom: "16px solid rgb(240, 240, 240)",
                                                padding: "8px",
                                                color: "white",
                                            }
                                            : {
                                                background: "#d3d3d3",
                                                borderTop: "16px solid rgb(240, 240, 240)",
                                                borderBottom: "16px solid rgb(240, 240, 240)",
                                                padding: "8px",
                                                color: colors.OsogovoBlack,
                                            }}
                                    >
                                        {checkpoint.checkpointNameBg}{isFinish ? ` ${t("results:table.finish")}` : ""}
                                    </th>
                                </tr>
                                {checkpointRows.map(({ result, checkpoint: passage, position }) => {
                                    const expansionKey = `${expansionScope}-${result.id}`;
                                    const isExpanded = expandedParticipantIds.has(expansionKey);
                                    const previousCheckpoints = [...(result.checkpoint_results ?? [])]
                                        .sort((first, second) => first.checkpointDistance - second.checkpointDistance);

                                    return (
                                        <React.Fragment key={result.id}>
                                            <TableRow
                                                highlighted={false}
                                                onClick={() => setExpandedParticipantIds((expandedIds) => {
                                                    const nextExpandedIds = new Set(expandedIds);
                                                    if (nextExpandedIds.has(expansionKey)) {
                                                        nextExpandedIds.delete(expansionKey);
                                                    } else {
                                                        nextExpandedIds.add(expansionKey);
                                                    }
                                                    return nextExpandedIds;
                                                })}
                                                role="button"
                                                tabIndex={0}
                                            >
                                                <td>{position}. {result.name}</td>
                                                <td>{result.bib}</td>
                                                <td style={isFinish ? { fontWeight: 700 } : undefined}>
                                                    {formatTime(passage.passedAt)}
                                                </td>
                                            </TableRow>
                                            {isExpanded && (
                                                <tr>
                                                    <td colSpan={3} style={{ padding: "8px 12px", background: "#f5f5f5" }}>
                                                        {previousCheckpoints.map((previousCheckpoint) => (
                                                            <div key={previousCheckpoint.checkpointId}>
                                                                {previousCheckpoint.checkpointNameBg}: {formatTime(previousCheckpoint.passedAt)}
                                                            </div>
                                                        ))}
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                            </React.Fragment>
                        );
                    })}
                </tbody>
            </table>
        );
    };

    const renderDistanceSections = (titleKey: string, predicate?: (result: Result) => boolean) => (
        <>
            <h2>{t("results:sections.distanceTitle", { title: t(`results:sections.${titleKey}`), distance: 26 })}</h2>
            {renderTablesByCheckpoint("26", `${titleKey}-26`, predicate)}
            <h2>{t("results:sections.distanceTitle", { title: t(`results:sections.${titleKey}`), distance: 14 })}</h2>
            {renderTablesByCheckpoint("14", `${titleKey}-14`, predicate)}
        </>
    );

    return (
        <HomeContainer>
            <HeaderComponent hideDate video="http://www.osogovo.run/media/osogovo-run-21-sec-low.mp4" />
            <ParticipantsWrapper>
                <a href="/participants">{t("results:links.participants")}</a>
                <h1>{t("results:title", { year })}</h1>
                {loading && <p>{t("results:loading")}</p>}
                {error && <p style={{ color: "red" }}>{error}</p>}
                {!loading && !error && (
                    <>
                        {renderDistanceSections("overallCurrent")}
                        {renderDistanceSections("men", (result) => result.gender === "male")}
                        {renderDistanceSections("womenCurrent", (result) => result.gender === "female")}
                        {renderDistanceSections("menUnder20", (result) => result.gender === "male" && getAge(result) < 20)}
                        {renderDistanceSections("womenUnder20", (result) => result.gender === "female" && getAge(result) < 20)}
                        {renderDistanceSections("menOver40", (result) => result.gender === "male" && getAge(result) > 40)}
                        {renderDistanceSections("womenOver40", (result) => result.gender === "female" && getAge(result) > 40)}
                    </>
                )}
            </ParticipantsWrapper>
        </HomeContainer>
    );
};