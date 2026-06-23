import React, { useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { HomeContainer } from "../Home/styles";
import { HeaderComponent } from "../Header/Header";
import { ParticipantsWrapper, TableRow } from "../Participants/styles";

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
    const [results, setResults] = React.useState<Result[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [searchParams] = useSearchParams();
    const apiUrl = process.env.REACT_APP_REGISTRATION_API_URL;

    const year = searchParams.get('year') ?? String(new Date().getFullYear());

    useEffect(() => {
        const fetchResults = async () => {
            if (year === new Date().getFullYear().toString()) {
                setError(`Няма налични резултати за ${year} година.`);
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
                setError('Грешка при зареждане на резултатите. Моля, опитайте отново.');
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, [apiUrl, year]);

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
                        <th>Позиция</th>
                        <th>Име</th>
                        <th>Категория</th>
                        <th>Отбор</th>
                        <th>Финал</th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.map((result) => {
                        const finishTime = result.distance === '14' ? result.osogovo : result.ruen;
                        const category = getCategory(result, year);
                        return (
                            <TableRow key={result.bib} highlighted={false}>
                                <td className="small">{position++}</td>
                                <td>{result.name}</td>
                                <td className="small">{category}</td>
                                <td>{result.team}</td>
                                <td className="small">{finishTime}</td>
                            </TableRow>
                        );
                    })}
                </tbody>
            </table>
        );
    };

    return (
        <HomeContainer>
            <HeaderComponent video='http://www.osogovo.run/media/osogovo-run-21-sec-low.mp4' />
            <ParticipantsWrapper>
                <a href="/participants">Виж участниците</a>
                <h1>Резултати {year}</h1>
                {loading && <p>Зареждане...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {!loading && !error && (
                    <>
                        <h2>Общо класиране 14 км</h2>
                        {renderTable(undefined, "14")}
                        <h2>Общо класиране 26 км</h2>
                        {renderTable(undefined, "26")}
                        <h1>Класиране - категория Жени / 14 км</h1>
                        {renderTable('Ж', "14")}
                        <h1>Класиране - категория Жени / 26 км</h1>
                        {renderTable('Ж', "26")}
                        <h1>Класиране - категория Жени 40+ / 14 км</h1>
                        {renderTable('Ж40', "14")}
                        <h1>Класиране - категория Жени 40+ / 26 км</h1>
                        {renderTable('Ж40', "26")}
                        <h1>Класиране - категория Мъже 40+ / 14 км</h1>
                        {renderTable('М40', "14")}
                        <h1>Класиране - категория Мъже 40+ / 26 км</h1>
                        {renderTable('М40', "26")}
                        <h1>Класиране - категория Мъже до 20 / 14 км</h1>
                        {renderTable('М20', "14")}
                        <h1>Класиране - категория Мъже до 20 / 26 км</h1>
                        {renderTable('М20', "26")}
                        <h1>Класиране - категория Жени до 20 / 14 км</h1>
                        {renderTable('Ж20', "14")}
                        <h1>Класиране - категория Жени до 20 / 26 км</h1>
                        {renderTable('Ж20', "26")}
                    </>
                )}
            </ParticipantsWrapper>
        </HomeContainer>
    );
};

export default Results;
