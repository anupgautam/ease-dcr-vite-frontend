import React, { useEffect, useState, useMemo, useCallback, useContext } from 'react'
import Controls from '@/reusable/components/forms/controls/Controls';
import { Grid, Typography, FormControl, Autocomplete, TextField, Box, Stack } from '@mui/material';
import moment from 'moment';
import { useBulkHolidayAddMutation, useGetHolidayByMonthAndYearMutation, useGetHolidayNamesQuery, useFilterHolidayBigCalendarMutation } from '@/api/HolidaySlices/holidaySlices';
import "react-patro/src/styles.css";
import { BSDate } from "nepali-datepicker-react";
import { getNepaliMonthName } from '@/reusable/utils/reuseableMonth';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useNavigate } from 'react-router-dom';
import { CookieContext } from '@/App'

const localizer = momentLocalizer(moment);

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

const Holiday = () => {
    const { company_id, user_role, company_user_id } = useContext(CookieContext)

    const [DefaultData, setDetaultData] = useState();

    //! Company holidays
    const Holiday = useGetHolidayNamesQuery(company_id);

    const holidays = useMemo(() => {
        if (Holiday?.isSuccess) {
            return Holiday?.data.map(key => ({ id: key.id, title: key.holiday_name }));
        }
        return [];
    }, [Holiday]);

    const [holidaySelect, setHolidaySelect] = useState(DefaultData);

    const handleHolidaySelect = (e, value) => {
        setHolidaySelect(value?.id || '');
    }

    useEffect(() => {
        if (holidays) {
            setHolidaySelect(holidays[0]?.id)
        }
    }, [holidays])

    const [SelectedDate, setSelectedDates] = useState([]);
    const now = new BSDate().now();

    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    const [bulkHoliday] = useBulkHolidayAddMutation();

    const [GetHoliday] = useGetHolidayByMonthAndYearMutation()

    const [AllHolidays, setAllHolidays] = useState([]);

    useEffect(() => {
        const data = { company_name: company_id, month: getNepaliMonthName(now._date.month), year: now._date.year }
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
    const handleDateChange = useCallback(({ target: { value } }) => {
        const formattedDate = value.map(date => formatDate(date));
        setSelectedDates(formattedDate);
    }, []);

    const navigate = useNavigate();

    useEffect(() => {
        if (SelectedDate.length > 0) {
            bulkHoliday({
                holiday_date: SelectedDate,
                company_holiday_type: holidaySelect,
                company_name: parseInt(company_id),
            })
                .then((res) => {
                    if (res.data) {
                        setSuccessMessage({ show: true, message: 'Successfully Added Holiday' });
                        navigate('/dashboard/settings/admin/holiday')
                        setTimeout(() => {
                            setSuccessMessage({ show: false, message: '' });
                        }, 3000);

                    } else {
                        setErrorMessage({ show: true, message: res.error.data[0] });
                        setTimeout(() => {
                            setErrorMessage({ show: false, message: '' });
                        }, 3000);
                    }
                })
                .catch(() => {
                    setErrorMessage({ show: true, message: 'Invalid holiday.' });
                    setTimeout(() => {
                        setErrorMessage({ show: false, message: '' });
                    }, 3000);
                });
        }
    }, [SelectedDate, bulkHoliday, holidaySelect]);

    // const { data, error, isLoading } = useFilterGetHolidaysQuery(company_id);

    const [filterHolidayBigCalendar, { data, error, isLoading }] = useFilterHolidayBigCalendarMutation();
    useEffect(() => {
        if (holidaySelect) {
            filterHolidayBigCalendar({ company_name: parseInt(company_id), holidaySelect });
        }
    }, [holidaySelect, filterHolidayBigCalendar]);

    const [holidayDates, setHolidayDates] = useState([]);

    useEffect(() => {
        if (data) {
            if (!isLoading && !error) {
                const holidays = data?.map((item) => new Date(item.holiday_date));
                setHolidayDates(holidays);
            }
        }
    }, [data, isLoading, error]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }
    console.log(holidayDates)

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

    console.log(holidayEvents)

    return (
        <>
            <Box style={{ marginBottom: "20px" }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={10}>
                        <Typography style={{ fontSize: '18px', fontWeight: '600' }}>
                            Holidays
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <Stack direction="row" justifyContent="flex-end" spacing={2}>
                            <Box sx={{ minWidth: 170 }}>
                                <FormControl>
                                    <Autocomplete
                                        options={holidays}
                                        getOptionLabel={(option) => option.title}
                                        onChange={handleHolidaySelect}
                                        renderInput={(params) => (
                                            <TextField {...params} label={'Holiday Type'} />
                                        )}
                                        defaultValue={holidays[0]}
                                        renderOption={(props, option) => (
                                            <li {...props} key={option.id}>
                                                {option.title}
                                            </li>
                                        )}
                                    />
                                </FormControl>
                            </Box>
                            <Box sx={{ minWidth: 150 }}>
                                <Controls.MultipleDatePicker
                                    buttonText="Select Holidays"
                                    name="date"
                                    SelectedDate={SelectedDate}
                                    onChange={(e) => handleDateChange(e)}
                                    className="select-holidays"
                                />
                            </Box>
                        </Stack>
                    </Grid>
                </Grid>
            </Box>
            <div style={{ height: "640px" }}>
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