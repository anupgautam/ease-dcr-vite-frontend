import React from "react";
import { Box, Container, Grid, Typography,Card, Table, TableHead, TableRow, TableCell} from "@mui/material";
import { TableBody } from "@material-ui/core";
import { BsDot } from "react-icons/bs";

const BusBaggageInfo = () =>{
    return(
        <Box>
        <Table>
            <TableHead className="fare-tbl-head">
                <TableRow>
                <TableCell className="fares-tb-cell">Cancellation Charge</TableCell>
                <TableCell className="fares-tb-cell">Child Passenger</TableCell>
                <TableCell className="fares-tb-cell">Luggage</TableCell>
                <TableCell className="fares-tb-cell">Pets</TableCell>
                <TableCell className="fares-tb-cell">Liquor</TableCell>
                </TableRow>
            </TableHead>
            <TableBody className="card-tbl-width">
                <TableRow>
                    <TableCell>
                        <Typography className="txt-saver-tbi-body"> More than 168 hrs before travel 10%</Typography>
                        <Typography className="txt-saver-tbi-body"> 72 to 168 hr(s) before travel 20%</Typography>
                        <Typography className="txt-saver-tbi-body">0 to 3 hr(s) before travel 100%</Typography>
                    </TableCell>
                    <TableCell className="txt-saver-tbi-body">Children above the age of 5 will need a ticket.</TableCell>
                    <TableCell >
                        <Typography className="txt-saver-tbi-body">2 pieces of luggage will be accepted free of charge per passenger. 
                        Excess items will be chargable.</Typography>
                        <Typography className="txt-saver-tbi-body">Access baggage over 20kg per pessenger will be chargable.</Typography>
                    </TableCell>
                    <TableCell className="txt-saver-tbi-body">Pets are not allowed.</TableCell>
                    <TableCell>
                        <Typography className="txt-saver-tbi-body">Carrying or consuming liquor inside the bus is prohibited.
                        Bus opertor reser the right to deboard drunk passenger.
                        </Typography>
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
        </Box>
    )
}

export default BusBaggageInfo