import React, { useEffect, useState, useRef } from 'react'
import Controls from '@/reusable/components/forms/controls/Controls';
import { Button, Grid, Typography } from '@mui/material';
import moment from 'moment';
import { Box } from '@mui/system';
import { useBulkHolidayAddMutation, useFilterGetHolidaysQuery, useGetHolidayByMonthAndYearMutation, useUpdateHolidaysMutation } from '@/api/HolidaySlices/holidaySlices';
import Cookies from 'js-cookie';
import { RangeCalendar } from '@raralabs/react-patro';
import "react-patro/src/styles.css";
import { BSDate } from "nepali-datepicker-react";
import { getNepaliMonthName } from '@/reusable/utils/reuseableMonth';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const eventStyleGetter = (event, start, end, isSelected) => {
    const style = {
        backgroundColor: " #ab0403", // Set the background color to red
        borderRadius: "5px",
        opacity: 0.8,
        color: "white",
        border: "1px solid  #ab0403",
        display: "block",
    };
    return { style };
};

const Holiday = () => {

    const [SelectedDate, setSelectedDates] = useState([]);
    const now = new BSDate().now();

    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });




    //! React Nepali Calendar 
    // const [chosenDate, setChosenDate] = useState(null);

    // const getChosenBsDate = () => {
    //     if (!chosenDate) return "";
    //     const bsDate = calFns.convertADtoBS(
    //         chosenDate.getFullYear(),
    //         chosenDate.getMonth() + 1,
    //         chosenDate.getDate()
    //     );
    //     return `${calFns.toDevanagariDigits(
    //         bsDate.bsYear
    //     )}/${calFns.toDevanagariDigits(bsDate.bsDate)}/${calFns.toDevanagariDigits(
    //         bsDate.bsMonth
    //     )}`;
    // };
    //! Hamro patro try

    // const iframeRef = useRef(null);

    // const sendMessageToIframe = () => {
    //     const message = 'Hello from the main document!';
    //     iframeRef.current.contentWindow.postMessage(message, '*');
    // };

    // const handleIframeMessage = (event) => {
    //     
    // };


    // const [calendarData, setCalendarData] = useState(null);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await fetch('https://www.hamropatro.com/api/calendar-data');
    //             const data = await response.json();
    //             setCalendarData(data);
    //         } catch (error) {
    //             console.error('Error fetching calendar data:', error);
    //         }
    //     };

    //     fetchData();
    // }, []);

    // 


    const [bulkHoliday] = useBulkHolidayAddMutation();

    const [GetHoliday] = useGetHolidayByMonthAndYearMutation()

    const [AllHolidays, setAllHolidays] = useState([]);

    useEffect(() => {
        const data = { company_name: Cookies.get('company_id'), month: getNepaliMonthName(now._date.month), year: now._date.year }
        GetHoliday(data)
            .then((res) => {
                setAllHolidays(res.data)
            })
    }, [])

    function formatDate(dateString) {
        const dateObject = new Date(dateString);
        const year = dateObject.getFullYear();
        const month = String(dateObject.getMonth() + 1).padStart(2, '0'); // Add 1 to month since it's zero-indexed
        const day = String(dateObject.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    const handleInputChange = (e) => {
        setSelectedDates(e.target.value);
        if (SelectedDate.length !== 0) {
            const data = SelectedDate.map((key) => (
                {
                    date: formatDate(key),
                    company: Cookies.get('company_id'),
                    is_holiday: true,
                }
            ))
            bulkHoliday({ date: data })
                .then((res) => {
                    if (res.data) {
                        setSuccessMessage({ show: true, message: 'Successfully Added User' });
                        setTimeout(() => {
                            window.location.reload();
                            setSuccessMessage({ show: false, message: '' });
                        }, 3000);
                    } else {
                        setErrorMessage({ show: true, message: response.error.data[0] });
                        setTimeout(() => {
                            setErrorMessage({ show: false, message: '' });
                        }, 3000);
                    }
                })
                .catch((err) => {
                    
                    setErrorMessage({ show: true, message: 'Invalid holiday.' });
                    setTimeout(() => {
                        setErrorMessage({ show: false, message: '' });
                    }, 3000);
                })
        } else {
            setErrorMessage({ show: true, message: 'Please select the date.' });
            setTimeout(() => {
                setErrorMessage({ show: false, message: '' });
            }, 3000);
        }
    }
    const { data, error, isLoading } = useFilterGetHolidaysQuery(Cookies.get('company_id'));
    const [holidayDates, setHolidayDates] = useState([]);

    useEffect(() => {
        if (data) {
            // Check if the query status is 'fulfilled'
            if (!isLoading && !error) {
                // Extract holiday dates from the data
                const holidays = data.map((item) => new Date(item.date));
                setHolidayDates(holidays);
            }
        }
    }, [data, isLoading, error]);

    // Handle loading and error states
    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    const getHolidayEvents = () => {
        return holidayDates.map((date) => ({
            title: "Holiday",
            start: date,
            end: date,
        }));
    };

    const holidayEvents = getHolidayEvents();

    const handleChange = (date) => {
        
    }


    return (
        <>
            <Box style={{ marginBottom: "20px" }}>
                <Grid container spacing={2}>
                    <Grid item xs={10}>
                        <Typography style={{ fontSize: '18px', fontWeight: '600' }}>
                            Holidays
                        </Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Box style={{ textAlign: "right" }}>
                            <Controls.MultipleDatePicker
                                buttonText="Select Holidays"
                                name="date"
                                SelectedDate={SelectedDate}
                                onChange={(e) => handleInputChange(e)}
                                className="select-holidays"
                            />
                        </Box>
                    </Grid>
                </Grid>
            </Box>
            <div style={{ height: "640px" }}>
                {/* <Box style={{ marginBottom: "20px" }}>
                    <Box marginBottom={2} marginLeft={2} marginTop={1}>
                        <Grid container spacing={1}>
                            {
                                AllHolidays.map((key, index) => (
                                    <Grid item key={index}>
                                        <Box className="date-background">
                                            <Typography style={{ color: "white" }}>{key.date}</Typography>
                                        </Box>
                                    </Grid>
                                ))
                            }
                        </Grid>
                    </Box>
                    <Box marginBottom={2}>
                        <Grid container spacing={2}>
                            {
                                SelectedDate.map((key, index) => (
                                    <Grid item key={index}>
                                        <Box className="date-background">
                                            <Typography style={{ color: "white" }}>{key}</Typography>
                                        </Box>
                                    </Grid>
                                ))
                            }
                        </Grid>
                    </Box>
                    {
                        SelectedDate.length !== 0 ?
                            <Box style={{ marginTop: "15px" }}>
                                <Button variant="contained" onClick={handleInputChange} >
                                    Add Holiday
                                </Button>
                            </Box>
                            : null
                    }
                </Box> */}
                {/* <RangeCalendar
                    from={definedRangeSelector}
                    disablePast
                    dateFormat="yyyy-mm-dd"
                    calendarType="BS"
                    onChange={(dateFrom) => {
                        setDefinedRangeSelector(dateFrom);
                    }}
                /> */}
                <Calendar
                    localizer={localizer}
                    events={holidayEvents}
                    views={['month']}
                    startAccessor="start"
                    endAccessor="end"
                    selectable={null}
                    onSelectSlot={null}
                    eventPropGetter={eventStyleGetter}
                />
                {/* <NepaliDatePicker
                    open={true}
                    ref={datepickerRef}
                    style={{ input: { display: 'none' }, buttons: { display: 'none' } }} 
                /> */}
                {/* {chosenDate && (
                    <h3>तपाइले मिति {getChosenBsDate()} रोज्नु भयो।</h3>
                )}
                <Calendar onChange={(date) => setChosenDate(date)} />
                <br /> */}

            </div>
            {
                ErrorMessage.show === true ? (
                    <Grid>
                        <Box className="messageContainer errorMessage">
                            <h1 style={{ fontSize: '14px', color: 'white' }}>{ErrorMessage.message}</h1>
                        </Box>
                    </Grid>
                ) : null
            }
            {
                SuccessMessage.show === true ? (
                    <Grid>
                        <Box className="messageContainer successMessage">
                            <h1 style={{ fontSize: '14px', color: 'white' }}>{SuccessMessage.message}</h1>
                        </Box>
                    </Grid>
                ) : null
            }
        </>
    )
}

export default Holiday;