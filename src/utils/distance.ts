export const getDistanceLabel = (distance: string | number): string => (
    String(distance) === '26' ? '27' : String(distance)
);