import React from "react";
import { useTranslation } from "react-i18next";
import { RecordCard, RecordDetail, RecordsGrid, RecordsWrapper } from "./styles";

const records = [
    {
        key: 'male',
        holder: 'Никола Кондарев',
        time: '02:21:00',
        bonus: '100 eur',
    },
    {
        key: 'female',
        holder: 'Десислава Санданска',
        time: '03:12:11',
        bonus: '100 eur',
    },
];

const Records: React.FC = () => {
    const { t } = useTranslation();

    return (
        <RecordsWrapper id="records">
            <h2>{t('home:records.title')}</h2>
            <RecordsGrid>
                {records.map((record) => (
                    <RecordCard key={record.key}>
                        <h3>{t(`home:records.${record.key}.title`)}</h3>
                        <RecordDetail>
                            <strong>{record.holder}</strong>
                        </RecordDetail>
                        <RecordDetail>
                            <strong>{record.time}</strong>
                        </RecordDetail>
                    </RecordCard>
                ))} 
            </RecordsGrid>
            <div>{t('home:records.bonus')}</div>
            <RecordsGrid>
                {records.map((record) => (
                    <RecordCard key={record.key}>
                        <RecordDetail key={record.key}>
                            <strong>{record.bonus}</strong>
                        </RecordDetail>
                    </RecordCard>
                ))}
            </RecordsGrid>
            <p>{t('home:records.note')}</p>
        </RecordsWrapper>
    );
};

export default Records;
