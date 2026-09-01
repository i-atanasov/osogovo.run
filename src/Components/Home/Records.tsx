import React from "react";
import { useTranslation } from "react-i18next";
import { DesktopRecordBonus, MobileRecordBonus, RecordCard, RecordDetail, RecordsGrid, RecordsWrapper } from "./styles";

const records = [
    {
        key: 'female',
        holder: 'Десислава Санданска',
        time: '03:12:11',
        bonus: '100 eur',
    },
    {
        key: 'male',
        holder: 'Никола Кондарев',
        time: '02:21:00',
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
                        <MobileRecordBonus>
                            <h4>{t('home:records.bonus')}</h4>
                            <strong>{record.bonus}</strong>
                        </MobileRecordBonus>
                    </RecordCard>
                ))} 
            </RecordsGrid>
            <DesktopRecordBonus>
                <h4>{t('home:records.bonus')}</h4>
                <RecordsGrid>
                    {records.map((record) => (
                        <RecordCard key={record.key}>
                            <RecordDetail key={record.key}>
                                <strong>{record.bonus}</strong>
                            </RecordDetail>
                        </RecordCard>
                    ))}
                </RecordsGrid>
            </DesktopRecordBonus>
            <p>{t('home:records.note')}</p>
        </RecordsWrapper>
    );
};

export default Records;
