

const ExpensesRolePage = () => {
    return (
        <>
            <Scrollbar>
                <TableContainer sx={{ minWidth: 900 }}>
                    <Table>
                        <UserListHead headLabel={TABLE_HEAD} />
                        <TableBody>
                            {
                                SearchDataCondition === true ?
                                    <>
                                        {
                                            SearchData.length === 0 ?
                                                <TableRow>
                                                    <TableCell align="center" colSpan={12} sx={{ py: 3 }}>
                                                        <Paper
                                                            sx={{
                                                                textAlign: 'center',
                                                            }}
                                                        >
                                                            <Typography variant="h6" paragraph>
                                                                Not found
                                                            </Typography>
                                                            <Typography variant="body2">
                                                                <strong>Requested Data Not found</strong>.
                                                                <br /> Try checking for typos or using complete words.
                                                            </Typography>
                                                        </Paper>
                                                    </TableCell>
                                                </TableRow> :
                                                <>
                                                    {
                                                        SearchData?.map((doctorsearch, index) => (
                                                            <TableRow hover tabIndex={-1} key={doctorsearch?.id}>
                                                                <TableCell>{index + 1}</TableCell>
                                                                <TableCell component="th" scope="row" align="left">
                                                                    <Typography variant="subtitle2" noWrap>
                                                                        {doctorsearch?.doctor_name.doctor_name}
                                                                    </Typography>
                                                                </TableCell>
                                                                <TableCell align="left">{doctorsearch?.doctor_name?.doctor_territory.area_name}</TableCell>
                                                                <TableCell align="left">{doctorsearch?.doctor_name?.doctor_phone_number}</TableCell>
                                                                <TableCell align="left">{doctorsearch?.doctor_name?.doctor_qualification}</TableCell>
                                                                <TableCell align="left">{doctorsearch?.doctor_name?.doctor_specialization?.category_name}</TableCell>
                                                                <TableCell align="left">{doctorsearch?.doctor_name?.doctor_category}</TableCell>
                                                                <TableCell align="left">
                                                                    <IconButton color={'primary'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={(e) => onEdit(doctorsearch.id, doctorsearch.doctor_name.id)} >
                                                                        <Badge>
                                                                            <Iconify icon="eva:edit-fill" />
                                                                        </Badge>
                                                                    </IconButton>
                                                                    <IconButton color={'error'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={() => { setSelectedId(doctorsearch?.id); handleClickOpen() }}>
                                                                        <Badge>
                                                                            <Iconify icon="eva:trash-2-outline" />
                                                                        </Badge>
                                                                    </IconButton>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))
                                                    }
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
                                                            <Button autoFocus onClick={() => { deleteDoctor(selectedId); handleClose() }}>
                                                                Yes
                                                            </Button>
                                                            <Button
                                                                onClick={handleClose}
                                                                autoFocus>
                                                                No
                                                            </Button>
                                                        </DialogActions>
                                                    </Dialog>
                                                </>
                                        }
                                    </> :
                                    <>
                                        {mpoName === "" || !mpoName ?
                                            <Test /> :
                                            <>
                                                {
                                                    DoctorData !== undefined ?
                                                        <>
                                                            {
                                                                DoctorData?.count === 0 ?
                                                                    <TableRow>
                                                                        <TableCell align="center" colSpan={12} sx={{ py: 3 }}>
                                                                            <Paper
                                                                                sx={{
                                                                                    textAlign: 'center',
                                                                                }}
                                                                            >
                                                                                <Typography variant="h6" paragraph>
                                                                                    Not found
                                                                                </Typography>
                                                                                <Typography variant="body2">
                                                                                    <strong>Requested Data Not found</strong>.
                                                                                    <br /> Try checking for typos or using complete words.
                                                                                </Typography>
                                                                            </Paper>
                                                                        </TableCell>
                                                                    </TableRow> : <>
                                                                        {
                                                                            DoctorData?.results.map((doctorsearch, index) => (
                                                                                <TableRow hover tabIndex={-1} key={doctorsearch?.id}>
                                                                                    <TableCell>{index + 1}</TableCell>
                                                                                    <TableCell component="th" scope="row" align="left">
                                                                                        <Typography variant="subtitle2" noWrap>
                                                                                            {doctorsearch?.doctor_name?.doctor_name}
                                                                                        </Typography>
                                                                                    </TableCell>
                                                                                    <TableCell align="left">{doctorsearch?.doctor_name?.doctor_phone_number}</TableCell>
                                                                                    <TableCell align="left">{doctorsearch?.doctor_name?.doctor_address}</TableCell>
                                                                                    <TableCell align="left">{doctorsearch?.doctor_name?.doctor_qualification}</TableCell>
                                                                                    <TableCell align="left">{doctorsearch?.doctor_name?.doctor_specialization?.category_name}</TableCell>
                                                                                    <TableCell align="left">{doctorsearch?.doctor_name?.doctor_category}</TableCell>
                                                                                    <TableCell align="left">
                                                                                        <IconButton color={'error'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={() => { setSelectedId(doctorsearch?.id); handleClickOpen() }}>
                                                                                            <Badge>
                                                                                                <Iconify icon="eva:trash-2-outline" />
                                                                                            </Badge>
                                                                                        </IconButton>
                                                                                    </TableCell>

                                                                                </TableRow>
                                                                            ))
                                                                        }
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
                                                                                <Button autoFocus onClick={() => { deleteDoctor(selectedId); handleClose() }}>
                                                                                    Yes
                                                                                </Button>
                                                                                <Button
                                                                                    onClick={handleClose}
                                                                                    autoFocus>
                                                                                    No
                                                                                </Button>
                                                                            </DialogActions>
                                                                        </Dialog>
                                                                        {/* //! Pagination */}
                                                                        <TableRow>
                                                                            <TableCell colSpan={6}>
                                                                                <Box justifyContent="center" alignItems="center" display="flex" margin="8px 0px">
                                                                                    {DoctorData ? (
                                                                                        <Pagination count={parseInt(DoctorData.count / 200) + 1} onChange={handleChangePage} />
                                                                                    ) : (
                                                                                        <Typography variant="body1">In Search</Typography>
                                                                                    )}
                                                                                </Box>
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    </>
                                                            }
                                                        </> : null
                                                }
                                            </>
                                        }
                                    </>
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
                {/* {isDrawerOpen && <EditDoctor
                    id={selectedUpdateId} onClose={onCloseDrawer} divisionId={selectedDivisionId}
                />
                } */}
            </Scrollbar>

        </>
    )
}
export default ExpensesRolePage