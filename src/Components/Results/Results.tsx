import React, { useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { HomeContainer } from "../Home/styles";
import { HeaderComponent } from "../Header/Header";
import { ParticipantsWrapper, TableCellLink, TableRow } from "../Participants/styles";
import { toParticipantSlug } from "../Participants/utils";

type Result = {
    name: string;
    birth: string;
    distance: string;
    gender: string;
    team?: string;
    bib: number;
    osogovo?: string;
    ruen?: string;
    dns?: boolean;
};

export const Results: React.FC = () => {
    const { t } = useTranslation();
    const [results, setResults] = React.useState<Result[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [searchParams] = useSearchParams();
    const apiUrl = process.env.REACT_APP_REGISTRATION_API_URL;

    const year = searchParams.get('year') ?? String(new Date().getFullYear());

    useEffect(() => {
        const fetchResults = async () => {
            if (year === new Date().getFullYear().toString()) {
                setError(t('results:errors.unavailableForYear', { year }));
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(`${apiUrl}/results`, { params: { year } });
                const data: Result[] = response.data;
                data.sort((a, b) => {
                    const timeA = a.distance === '14' ? (a.osogovo ?? '') : (a.ruen ?? '');
                    const timeB = b.distance === '14' ? (b.osogovo ?? '') : (b.ruen ?? '');
                    return timeA.localeCompare(timeB);
                });
                setResults(data);
            } catch (err) {
                setError(t('results:errors.loadFailed'));
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, [apiUrl, year, t]);

    const getCategory = (result: Result, year?: string) => {
        const birthYear = parseInt(result.birth, 10);
        const currentYear = year ? parseInt(year, 10) : new Date().getFullYear();
        const age = currentYear - birthYear;
        if (age < 21) return result.gender === 'male' ? 'М20' : 'Ж20';
        if (age > 39) return result.gender === 'male' ? 'М40' : 'Ж40';
        return result.gender === 'male' ? 'М' : 'Ж';
    };

    const renderTable = (categoryFilter?: string, distanceFilter?: string) => {
        const filtered = results.filter((r) => {
            const category = getCategory(r, year);
            const matchesDistance = !distanceFilter || r.distance === distanceFilter;
            const matchesCategory = !categoryFilter || category.startsWith(categoryFilter);

            return matchesDistance && matchesCategory;
        });
        let position = 1;
        return (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th>{t('results:table.position')}</th>
                        <th>{t('results:table.name')}</th>
                        <th>{t('results:table.category')}</th>
                        <th>{t('results:table.team')}</th>
                        <th>{t('results:table.finish')}</th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.map((result) => {
                        const finishTime = result.distance === '14' ? result.osogovo : result.ruen;
                        const category = getCategory(result, year);
                        const participantPath = `/participant/${toParticipantSlug(result.name)}`;

                        return (
                            <TableRow key={result.bib} highlighted={false}>
                                <td className="small"><TableCellLink to={participantPath}>{position++}</TableCellLink></td>
                                <td><TableCellLink to={participantPath}>{result.name}</TableCellLink></td>
                                <td className="small"><TableCellLink to={participantPath}>{category}</TableCellLink></td>
                                <td><TableCellLink to={participantPath}>{result.team}</TableCellLink></td>
                                <td className="small"><TableCellLink to={participantPath}>{finishTime}</TableCellLink></td>
                            </TableRow>
                        );
                    })}
                </tbody>
            </table>
        );
    };

    return (
        <HomeContainer>
            <HeaderComponent hideDate video='http://www.osogovo.run/media/osogovo-run-21-sec-low.mp4' />
            <ParticipantsWrapper>
                <a href="/participants">{t('results:links.participants')}</a>
                <h1>{t('results:title', { year })}</h1>
                {loading && <p>{t('results:loading')}</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {!loading && !error && (
                    <>
                        <h2>{t('results:sections.overall', { distance: 14 })}</h2>
                        {renderTable(undefined, "14")}
                        <h2>{t('results:sections.overall', { distance: 26 })}</h2>
                        {renderTable(undefined, "26")}
                        <h1>{t('results:sections.women', { distance: 14 })}</h1>
                        {renderTable('Ж', "14")}
                        <h1>{t('results:sections.women', { distance: 26 })}</h1>
                        {renderTable('Ж', "26")}
                        <h1>{t('results:sections.women40', { distance: 14 })}</h1>
                        {renderTable('Ж40', "14")}
                        <h1>{t('results:sections.women40', { distance: 26 })}</h1>
                        {renderTable('Ж40', "26")}
                        <h1>{t('results:sections.men40', { distance: 14 })}</h1>
                        {renderTable('М40', "14")}
                        <h1>{t('results:sections.men40', { distance: 26 })}</h1>
                        {renderTable('М40', "26")}
                        <h1>{t('results:sections.men20', { distance: 14 })}</h1>
                        {renderTable('М20', "14")}
                        <h1>{t('results:sections.men20', { distance: 26 })}</h1>
                        {renderTable('М20', "26")}
                        <h1>{t('results:sections.women20', { distance: 14 })}</h1>
                        {renderTable('Ж20', "14")}
                        <h1>{t('results:sections.women20', { distance: 26 })}</h1>
                        {renderTable('Ж20', "26")}
                    </>
                )}
            </ParticipantsWrapper>
        </HomeContainer>
    );
};

export default Results;
