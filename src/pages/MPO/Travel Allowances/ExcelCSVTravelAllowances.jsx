import React from 'react'
import ExportToExcel from '@/reusable/utils/exportSheet';

const ExcelCSVTravelAllowances = ({ data, userName }) => {

    //! CSV Data 
    const headers = [
        { label: 'Date', key: 'date' },
        { label: 'Month', key: 'month' },
        { label: 'From', key: 'area_from' },
        { label: 'To', key: 'area_to' },
        { label: 'Daily Allowance', key: 'daily_allowance' },
        { label: 'Travel Allowance', key: 'travel_allowance' },
        { label: 'User', key: 'user' },
    ];


    const templateData = data && data?.data?.results?.map(values => ({
        date: values?.date,
        month: values?.month,
        area_from: values?.area_from,
        area_to: values?.area_to,
        daily_allowance: `Rs. ${values?.daily_allowance}`,
        travel_allowance: `Rs. ${values.travel_allowance}`,
        user: userName
    }))

    return (
        <>
            {
                data ?
                    <ExportToExcel headers={headers} fileName={`Allowances`} data={templateData} /> : null
            }
        </>
    )
}
export default React.memo(ExcelCSVTravelAllowances)