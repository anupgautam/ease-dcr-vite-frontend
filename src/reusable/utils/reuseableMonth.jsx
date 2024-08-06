export const NepaliMonths = [
    'Baisakh', 'Jesth', 'Asadh', 'Shrawan', 'Bhadra', 'Ashwin',
    'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra'
];

export const nepaliYears = ['2080', '2081', '2082', '2083', '2084', '2085', '2086', '2087', '2089', '2090'];

export const getNepaliMonthName = (monthNumber) => {
    return NepaliMonths[monthNumber - 1];
};