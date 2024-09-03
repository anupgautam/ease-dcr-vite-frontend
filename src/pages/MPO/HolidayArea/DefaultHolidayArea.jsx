import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
    Card,
    Badge,
    Table,
    Button,
    TableRow,
    TableBody,
    TableCell,
    Typography,
    IconButton,
    TableContainer,
} from '@mui/material';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Iconify from '@/components/iconify/Iconify';
import Scrollbar from '@/components/iconify/Iconify';
import { UserListHead } from '../../../sections/@dashboard/user';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import { useLazyFilterGetHolidaysAreaQuery, useGetCompanyHolidaysQuery, useDeleteHolidayAreasByIdMutation } from '@/api/HolidaySlices/holidaySlices';
import { useSelector } from 'react-redux';

import EditHolidayArea from './EditHolidayArea';

const TABLE_HEAD = [
    { id: 'holiday_type', label: 'Holiday Type', alignRight: false },
    { id: 'company_area', label: 'Company Area', alignRight: false },
    { id: '' },
];

const DefaultHolidayArea = () => {
    const { company_id, user_role, company_user_id } = useSelector((state) => state.cookie);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [selectedUpdateId, setSelectedUpdateId] = useState(null);
    const [openDialogue, setOpenDialogue] = useState(false);
    const [page, setPage] = useState(1);
    const [holidayTypes, setHolidayTypes] = useState([]);

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

    const onEdit = useCallback((id) => {
        setSelectedUpdateId(id);
        setIsDrawerOpen(true);
    }, []);

    const onCloseDrawer = useCallback(() => {
        setIsDrawerOpen(false);
    }, []);

    const handleClickOpen = useCallback(() => {
        setOpenDialogue(true);
    }, []);

    const handleClose = useCallback(() => {
        setOpenDialogue(false);
    }, []);

    const handleChangePage = useCallback((e) => {
        const data = e.target.ariaLabel;
        let thisArray = data.split(" ");
        setPage(thisArray[3]);
    }, []);

    //! Company holidays
    const Holidays = useGetCompanyHolidaysQuery(company_id);
    const holidays = useMemo(() => {
        if (Holidays.data) {
            return Holidays.data.map((key) => (key.holiday_name));
        }
        return [];
    }, [Holidays]);

    const holidaysId = useMemo(() => {
        if (Holidays.data) {
            return Holidays.data.map((key) => (key.id));
        }
        return [];
    }, [Holidays]);

    // Use lazy query for on-demand API calls
    const [triggerFilterGetHolidaysAreaQuery] = useLazyFilterGetHolidaysAreaQuery();

    useEffect(() => {
        const fetchHolidayAreas = async () => {
            const results = [];
            for (const holidayName of holidays) {
                try {
                    const response = await triggerFilterGetHolidaysAreaQuery({
                        holidayName, companyId: company_id
                    }).unwrap();
                    if (Array.isArray(response)) {
                        if (response.length > 0) {
                            results.push(...response);
                        } else {
                            console.warn(`No data returned for ${holidayName} (empty array)`);
                        }
                    } else {
                        console.error(`Unexpected data format for ${holidayName}:`, data);
                    }
                } catch (error) {
                    console.error(`API call failed for: ${holidayName}`, error);
                }
            }
            setHolidayTypes(results);
        };

        if (holidays.length > 0) {
            fetchHolidayAreas();
        }
    }, [holidays, triggerFilterGetHolidaysAreaQuery]);

    const [deleteHolidayArea] = useDeleteHolidayAreasByIdMutation();
    const eightArrays = [0, 1, 2, 3, 4, 5, 6, 7];

    const holidayData = holidayTypes.reduce((acc, item) => {
        const holidayName = item.holiday_type.holiday_name;
        const holidayId = item.holiday_type.id;
        const companyAreaId = item.company_area.id;

        if (!acc[holidayId]) {
            acc[holidayId] = {
                holidayName,
                holidayId,
                holidayNameId: [],
                companyAreas: []
            };
        }

        acc[holidayId].companyAreas.push(item.company_area.company_area);
        acc[holidayId].holidayNameId.push(companyAreaId);

        return acc;
    }, {});

    const holidayArray = Object.values(holidayData).map(({ holidayName, holidayId, companyAreas, holidayNameId }) => ({
        holidayName,
        holidayId,
        holidayNameId,
        companyAreas: companyAreas.join(', ')
    }));
    return (
        <>
            <Card>
                <Scrollbar>
                    <TableContainer sx={{ minWidth: 800 }}>
                        <Table>
                            <UserListHead
                                headLabel={TABLE_HEAD}
                            />

                            <TableBody>
                                {holidayArray.length === 0 ? (
                                    <>
                                        {eightArrays.map((key) => (
                                            <TableRow key={key}>
                                                <TableCell><Skeleton /></TableCell>
                                                <TableCell><Skeleton /></TableCell>
                                                <TableCell><Skeleton /></TableCell>
                                            </TableRow>
                                        ))}
                                    </>
                                ) : (
                                    <>
                                        {holidayArray.map((companyroles, index) => (
                                            <TableRow key={companyroles.holidayId} hover tabIndex={-1} role="checkbox">
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell component="th" scope="row" align="left">
                                                    <Typography variant="subtitle2" noWrap>
                                                        {companyroles.holidayName}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="left">{companyroles.companyAreas}</TableCell>
                                                <TableCell align="right">
                                                    {/* <IconButton color={'primary'} onClick={() => onEdit(companyroles.holidayId)}>
                                                        <Badge>
                                                            <Iconify icon="eva:edit-fill" />
                                                        </Badge>
                                                    </IconButton> */}
                                                    <IconButton color={'error'} onClick={() => { setSelectedId(companyroles.holidayId); handleClickOpen(); }}>
                                                        <Badge>
                                                            <Iconify icon="eva:trash-2-outline" />
                                                        </Badge>
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Scrollbar>
            </Card>
            <Dialog
                fullScreen={fullScreen}
                open={openDialogue}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    {"Are you sure want to delete?"}
                </DialogTitle>
                <DialogActions>
                    <Button autoFocus onClick={() => { deleteHolidayArea(selectedId); handleClose(); }}>
                        Yes
                    </Button>
                    <Button onClick={handleClose} autoFocus>
                        No
                    </Button>
                </DialogActions>
            </Dialog>
            {isDrawerOpen && <EditHolidayArea idharu={selectedUpdateId} onClose={onCloseDrawer} />}
        </>
    );
};

export default React.memo(DefaultHolidayArea);
