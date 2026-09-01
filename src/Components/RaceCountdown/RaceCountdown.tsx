import React from 'react';
import { useTranslation } from 'react-i18next';
import { CountdownGrid, CountdownHeader, CountdownUnit, RaceCountdownWrapper } from './styles';

const RACE_START_AT = new Date('2026-09-27T09:00:00+03:00').getTime();
const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

const getRemainingMilliseconds = () => Math.max(0, RACE_START_AT - Date.now());

const getCountdownParts = (remainingMilliseconds: number) => {
    const days = Math.floor(remainingMilliseconds / DAY);
    const hours = Math.floor((remainingMilliseconds % DAY) / HOUR);
    const minutes = Math.floor((remainingMilliseconds % HOUR) / MINUTE);
    const seconds = Math.floor((remainingMilliseconds % MINUTE) / SECOND);

    return { days, hours, minutes, seconds };
};

const RaceCountdown: React.FC = () => {
    const { t } = useTranslation();
    const [remainingMilliseconds, setRemainingMilliseconds] = React.useState(getRemainingMilliseconds);
    const countdownParts = getCountdownParts(remainingMilliseconds);
    const hasStarted = remainingMilliseconds === 0;

    React.useEffect(() => {
        const intervalId = window.setInterval(() => {
            setRemainingMilliseconds(getRemainingMilliseconds());
        }, SECOND);

        return () => window.clearInterval(intervalId);
    }, []);

    return (
        <RaceCountdownWrapper aria-live="polite">
            <CountdownHeader>{hasStarted ? t('registration:countdown.started') : t('registration:countdown.title')}</CountdownHeader>
            {!hasStarted && (
                <CountdownGrid>
                    {Object.entries(countdownParts).map(([unit, value]) => (
                        <CountdownUnit key={unit}>
                            <strong>{String(value).padStart(2, '0')}</strong>
                            <span>{t(`registration:countdown.${unit}`)}</span>
                        </CountdownUnit>
                    ))}
                </CountdownGrid>
            )}
        </RaceCountdownWrapper>
    );
};

export default RaceCountdown;