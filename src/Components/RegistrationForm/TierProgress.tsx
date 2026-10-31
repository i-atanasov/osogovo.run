import React from 'react';
import { useTranslation } from 'react-i18next';
import { TierBar, TierBreakpoint, TierCurrentMarker, TierFill, TierLegend, TierLegendItem, TierProgressWrapper, TierSegment } from './styles';

export interface ParticipationTier {
    upTo: number;
    label: string;
    labelBulgarian: string;
    fees: Record<14 | 26, number>;
    tshirt: number;
}

interface TierProgressProps {
    tiers: ParticipationTier[];
    currentCount: number;
    distance: 14 | 26;
}

const TierProgress: React.FC<TierProgressProps> = ({ tiers, currentCount, distance }) => {
    const { t, i18n } = useTranslation();
    const isBulgarian = (i18n.resolvedLanguage || i18n.language || '').startsWith('bg');
    const getLabel = (tier: ParticipationTier) => (isBulgarian ? tier.labelBulgarian : tier.label);
    const max = tiers[tiers.length - 1]?.upTo ?? 0;
    if (max <= 0) {
        return null;
    }

    const toPercent = (value: number) => `${(Math.min(value, max) / max) * 100}%`;
    const activeIndex = tiers.findIndex((tier) => currentCount + 1 <= tier.upTo);

    return (
        <TierProgressWrapper>
            <h4>{t('registration:tiers.title')}</h4>
            <TierBar>
                {tiers.map((tier, index) => {
                    const from = index === 0 ? 0 : tiers[index - 1].upTo;
                    return (
                        <TierSegment
                            key={tier.upTo}
                            $active={index === activeIndex}
                            style={{ left: toPercent(from), width: toPercent(tier.upTo - from) }}
                        >
                            <span>{getLabel(tier)}</span>
                        </TierSegment>
                    );
                })}
                <TierFill style={{ width: toPercent(currentCount) }} />
                {tiers.slice(0, -1).map((tier) => (
                    <TierBreakpoint key={tier.upTo} style={{ left: toPercent(tier.upTo) }}>
                        <span>{tier.upTo}</span>
                    </TierBreakpoint>
                ))}
                <TierCurrentMarker style={{ left: toPercent(currentCount) }}>
                    <span>{t('registration:tiers.current', { count: currentCount })}</span>
                </TierCurrentMarker>
            </TierBar>
            <TierLegend>
                {tiers.map((tier, index) => {
                    const from = index === 0 ? 0 : tiers[index - 1].upTo;
                    return (
                        <TierLegendItem key={tier.upTo} $active={index === activeIndex}>
                            <strong>{getLabel(tier)}</strong>
                            <span>{t('registration:tiers.range', { from: from + 1, to: tier.upTo })}</span>
                            <span>{t('registration:tiers.fee', { distance, amount: tier.fees[distance] })}</span>
                        </TierLegendItem>
                    );
                })}
            </TierLegend>
        </TierProgressWrapper>
    );
};

export default TierProgress;
