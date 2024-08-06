import React from "react";
import { Link } from "react-router-dom";
import RoundButton from "../../components/button/roundbutton";
import { TableBody } from "@material-ui/core";
import { Box, Container, Grid, Typography,Card, Table, TableHead, TableRow, TableCell} from "@mui/material";

const FlightBaggageInfo = () =>{
    return(
        <Box>
            <Table>
                <TableHead className="fare-tbl-head">
                    <TableRow>
                    <TableCell className="fares-tb-cell">Fares</TableCell>
                    <TableCell className="fares-tb-cell">Handcarry</TableCell>
                    <TableCell className="fares-tb-cell">Check_In</TableCell>
                    <TableCell className="fares-tb-cell">Cancellation Fee</TableCell>
                    <TableCell className="fares-tb-cell">Date Change Fee</TableCell>
                    <TableCell className="fares-tb-cell">Seat</TableCell>
                    <TableCell className="fares-tb-cell">Meal</TableCell>
                    <TableCell className="fares-tb-cell">Price and Booking</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody className="card-tbl-width">
                    <TableRow>
                        <TableCell>
                            <Typography className="saver">Saver</Typography>
                            <Typography className="txt-saver-tbi-body">Priority check-in & boarding, Free XL seats</Typography>
                        </TableCell>
                        <TableCell className="txt-saver-tbi-body">7 kg</TableCell>
                        <TableCell className="txt-saver-tbi-body">30 Kg</TableCell>
                        <TableCell className="txt-saver-tbi-body"> Cancellation fee starting Rs. 7000</TableCell>
                        <TableCell className="txt-saver-tbi-body">Date Change fee starting Rs. 3,250</TableCell>
                        <TableCell className="txt-saver-tbi-body">Middle seat free, window /Aisel chargeable</TableCell>
                        <TableCell className="txt-saver-tbi-body">No meal</TableCell>
                        <TableCell>
                            <Typography className="rs-price-flight">Rs.5000</Typography>
                            <RoundButton 
                                backgroundColor='#55AAFF'
                                color='white'
                                buttonText='Book'
                                fontFamily='Sans Serif'
                                fontSize='10px'
                            />
                        </TableCell>
                    </TableRow>
                    <TableRow >
                        <TableCell>
                            <Typography className="saver">Saver</Typography>
                            <Typography className="txt-saver-tbi-body">Priority check-in & boarding, Free XL seats</Typography>
                        </TableCell>
                        <TableCell className="txt-saver-tbi-body">7 kg</TableCell>
                        <TableCell className="txt-saver-tbi-body">30 Kg</TableCell>
                        <TableCell className="txt-saver-tbi-body"> Cancellation fee starting Rs. 7000</TableCell>
                        <TableCell className="txt-saver-tbi-body">Date Change fee starting Rs. 3,250</TableCell>
                        <TableCell className="txt-saver-tbi-body">Middle seat free, window /Aisel chargeable</TableCell>
                        <TableCell className="txt-saver-tbi-body">No meal</TableCell>
                        <TableCell>
                            <Typography className="rs-price-flight">Rs.5000</Typography>
                            <RoundButton 
                                backgroundColor='#55AAFF'
                                color='white'
                                buttonText='Book'
                                fontFamily='Sans Serif'
                                fontSize='10px'
                            />
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell className="txt-saver-tbi-body"><Link>View Details</Link></TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </Box>
    )
}

export default FlightBaggageInfo;