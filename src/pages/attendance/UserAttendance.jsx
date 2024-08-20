import React from 'react';
import { Calendar, momentLocalizer, DateLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/ne'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import NepaliDate from 'nepali-date';


const nepaliDays = ['आइतवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'बिहिवार', 'शुक्रवार', 'शनिवार'];
const nepaliMonths = [
    'बैशाख', 'जेठ', 'असार', 'श्रावण', 'भदौ', 'असोज', 'कार्तिक',
    'मंसिर', 'पुष', 'माघ', 'फागुन', 'चैत'
];

moment.updateLocale('ne', {
    weekdays: nepaliDays,
    months: nepaliMonths,
});

const localizer = momentLocalizer(moment);

const convertToNepaliDate = (gregorianDate) => {
    const nepaliDate = new NepaliDate(gregorianDate);
    return nepaliDate;
};

// const convertToGregorianDate = (nepaliDate) => {
//     return nepaliDate.toJsDate();
// };

const nepaliMonthLengths = {
    1: 30, // Baishakh
    2: 32, // Jestha
    3: 31, // Ashadh
    4: 32, // Shrawan
    5: 31, // Bhadra
    6: 30, // Ashwin
    7: 30, // Kartik
    8: 29, // Mangsir
    9: 30, // Poush
    10: 29, // Magh
    11: 30, // Falgun
    12: 30, // Chaitra
};

// Override weekday and month names
const messages = {
    allDay: 'संपूर्ण दिन',
    previous: 'पछिल्लो',
    next: 'अर्को',
    today: 'आज',
    month: 'महिना',
    week: 'हप्ता',
    day: 'दिन',
    agenda: 'एजेन्डा',
    date: 'मिति',
    time: 'समय',
    event: 'घटना',
    noEventsInRange: 'यो दायरामा कुनै घटना छैन।',
    showMore: (total) => `अझै ${total} घटनाहरू`,
};

// const events = [
//     {
//         title: 'Event 1',
//         start: convertToGregorianDate(new NepaliDate(2080, 5, 15)), // Nepali date
//         end: convertToGregorianDate(new NepaliDate(2080, 5, 17)),
//     },
// ];

const eventStyleGetter = (event, start, end, isSelected) => {
    const style = {
        backgroundColor: " #ab0403",
        borderRadius: "5px",
        opacity: 0.8,
        color: "white",
        border: "1px solid  #ab0403",
        display: "block",
    };
    return { style };
};

// const nepaliDate = new NepaliDate(date);
// const month = nepaliDate.getMonth() + 1; 
// const daysInMonth = nepaliMonthLengths[month] || 30;

// Logic to render days
// const daysArray = Array.from({ length: daysInMonth }, (_, i) => {
//     const dayDate = new NepaliDate(nepaliDate.getYear(), month - 1, i + 1);
//     return (
//         <div key={i}>
//             {dayDate.getDate()} {dayDate.format('dddd')}
//         </div>
//     );
// });

const AttendanceEvents = {}
const UserAttendance = ({ events }) => {
    return (
        <>
            {/* <div style={{ height: "640px" }}>
                <Calendar
                    localizer={new DateLocalizer({ formats: {}, firstOfWeek: () => 0 })}
                    // events={AttendanceEvents}
                    // events={events}
                    startAccessor="start"
                    endAccessor="end"
                    messages={messages}
                    eventPropGetter={eventStyleGetter}
                    views={{ month: CustomMonthView }}
                />
            </div> */}
            <h2>Attendance</h2>
        </>
    )
}
export default UserAttendance