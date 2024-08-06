import NepaliDate from 'nepali-date-converter';

const NepaliDateCalendar = () => {
    let a = new NepaliDate(new Date());
    const npYear = a.format('YYYY');
    const npMonth = a.format('MM');
    const npDate = a.format('DD');
    const formattedDate = `${npYear}-${npMonth}-${npDate}`;
    return formattedDate;
    // 
};

export default NepaliDateCalendar;
