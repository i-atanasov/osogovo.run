export const formatParticipantName = (name: string) => {
    return name
        .trim()
        .toLocaleLowerCase('bg-BG')
        .replace(/(^|[\s-])([^\s-])/gu, (match, separator: string, letter: string) => {
            return `${separator}${letter.toLocaleUpperCase('bg-BG')}`;
        });
};

export const toParticipantSlug = (name: string) => {
    return name
        .trim()
        .toLocaleLowerCase('bg-BG')
        .normalize('NFKD')
        .replace(/[^\p{L}\p{N}]+/gu, '-')
        .replace(/^-+|-+$/g, '');
};
