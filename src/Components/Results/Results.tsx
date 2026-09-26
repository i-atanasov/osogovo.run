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
    team?: string | null;
    bib: number | null;
    paid: boolean;
    did_not_start: boolean;
    did_not_finish: boolean;
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
    const isDns = (result: Result) => result.did_not_start || (result.paid && result.bib === null);
    const participantsWithoutResults = results
        .filter((result) => (result.checkpoint_results?.length ?? 0) === 0 && (isDns(result) || result.bib !== null))
        .sort((first, second) => (first.bib ?? Number.MAX_SAFE_INTEGER) - (second.bib ?? Number.MAX_SAFE_INTEGER));

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
            .filter((result) => !isDns(result) && result.bib !== null)
            .map((result) => ({ result, checkpoint: getLatestCheckpoint(result) }))
            .filter((entry): entry is { result: Result; checkpoint: CheckpointResult } => entry.checkpoint !== null);
        const classifiedResults = [...latestResults]
            .sort((first, second) => {
                const checkpointProgress = second.checkpoint.checkpointDistance - first.checkpoint.checkpointDistance;
                if (checkpointProgress !== 0) return checkpointProgress;
                if (first.result.did_not_finish !== second.result.did_not_finish) {
                    return first.result.did_not_finish ? 1 : -1;
                }

                const timeDifference = new Date(first.checkpoint.passedAt).getTime()
                    - new Date(second.checkpoint.passedAt).getTime();
                return timeDifference || (first.result.bib ?? 0) - (second.result.bib ?? 0);
            })
            .map((entry, index) => ({ ...entry, position: index + 1 }));
        const checkpointGroups = Array.from(
            new Map(
                classifiedResults.map((entry) => [entry.checkpoint.checkpointId, entry.checkpoint]),
            ).values(),
        ).sort((first, second) => second.checkpointDistance - first.checkpointDistance);

        if (checkpointGroups.length === 0) {
            return null;
        }

        return (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th>{t("results:table.name")}</th>
                        <th>{t("results:table.bib")}</th>
                        <th>{t("results:table.team")}</th>
                        <th>{t("results:table.result")}</th>
                    </tr>
                </thead>
                <tbody>
                    {checkpointGroups.map((checkpoint) => {
                        const checkpointRows = classifiedResults
                            .filter((entry) => entry.checkpoint.checkpointId === checkpoint.checkpointId)
                            .sort((first, second) => {
                                if (first.result.did_not_finish !== second.result.did_not_finish) {
                                    return first.result.did_not_finish ? 1 : -1;
                                }
                                const timeDifference = new Date(first.checkpoint.passedAt).getTime()
                                    - new Date(second.checkpoint.passedAt).getTime();
                                return timeDifference || (first.result.bib ?? 0) - (second.result.bib ?? 0);
                            });
                        const isFinish = checkpoint.checkpointFinal !== null
                            && Number(checkpoint.checkpointFinal) === Number(distance);

                        return (
                            <React.Fragment key={checkpoint.checkpointId}>
                                <tr>
                                    <th
                                        colSpan={4}
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
                                                <td>{result.team || "-"}</td>
                                                <td style={isFinish ? { fontWeight: 700 } : undefined}>
                                                    {result.did_not_finish ? t("results:table.dnf") : formatTime(passage.passedAt)}
                                                </td>
                                            </TableRow>
                                            {isExpanded && (
                                                <tr>
                                                    <td colSpan={4} style={{ padding: "8px 12px", background: "#f5f5f5" }}>
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

    const renderDistanceSections = (titleKey: string, predicate: (result: Result) => boolean = () => true) => (
        <>
            {(["26", "14"] as const).map((distance) => {
                const hasResults = results.some((result) => (
                    result.distance === distance
                    && predicate(result)
                    && !isDns(result)
                    && result.bib !== null
                    && getLatestCheckpoint(result) !== null
                ));

                if (!hasResults) {
                    return null;
                }

                return (
                    <React.Fragment key={`${titleKey}-${distance}`}>
                        <h2>{t("results:sections.distanceTitle", { title: t(`results:sections.${titleKey}`), distance })}</h2>
                        {renderTablesByCheckpoint(distance, `${titleKey}-${distance}`, predicate)}
                    </React.Fragment>
                );
            })}
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
                        {participantsWithoutResults.length > 0 && (
                            <section>
                                <h2>{t("results:sections.noRecordedResults")}</h2>
                                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                    <thead>
                                        <tr>
                                            <th>{t("results:table.name")}</th>
                                            <th>{t("results:table.bib")}</th>
                                            <th>{t("results:table.team")}</th>
                                            <th>{t("results:table.distance")}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {participantsWithoutResults.map((result) => (
                                            <TableRow key={result.id} highlighted={false}>
                                                <td>{result.name}</td>
                                                <td>{result.did_not_finish ? t("results:table.dnf") : isDns(result) ? "DNS" : result.bib ?? "-"}</td>
                                                <td>{result.team || "-"}</td>
                                                <td>{result.distance} км</td>
                                            </TableRow>
                                        ))}
                                    </tbody>
                                </table>
                            </section>
                        )}
                    </>
                )}
            </ParticipantsWrapper>
        </HomeContainer>
    );
};