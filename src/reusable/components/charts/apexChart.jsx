import React, {useState, useEffect} from 'react';
import Chart from 'react-apexcharts';
import {
    Card,
    Box,
    CardHeader
  } from '@mui/material';



const ApexChart = ({data=null}) => {

    
    const [chartData, setChartData] = useState({
        options: {
            chart: {
                id: 'basic-bar'
            },
            xaxis: {
                categories: ['2023', '2024']
            }
        },
        series: [
            {
                name: 'Target Amount',
                data: []
            },
            {
                name: 'Target Sales',
                data: []
            }
        ],
        type: "bar",
        width: "700"
    });

    useEffect(()=>{
        if(data !== null)
            setChartData(data);
    },[data])

    

    return (
        <>
            <Card>
                <CardHeader title={chartData.header}/>

                <Box sx={{ p: 3, pb: 1 }} dir="ltr">
                    <Chart
                        options={chartData.options}
                        series={chartData.series}
                        type={chartData.type}
                        width={chartData.width}
                    />
                </Box>
            </Card>
        </>
    )
}

export default ApexChart;