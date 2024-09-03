import { Box, Card, Grid, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePostAllMPONamesNoPageMutation } from "@/api/MPOSlices/DoctorSlice";
import Scrollbar from "@/components/scrollbar/Scrollbar";
import { UserListHead } from "@/sections/@dashboard/user";
import Controls from "@/reusable/forms/controls/Controls";
import { useGetMpoAreaQuery, usePostAreaofMPOMutation } from "@/api/MPOSlices/TourPlanSlice";
import { Circles } from 'react-loader-spinner';
import { useGetAllCompanyAreasQuery } from "@/api/CompanySlices/companyAreaSlice";
import { useSelector } from 'react-redux';

const TABLE_HEAD = [
    { id: 'area_name', label: 'Area Name', alignRight: false },
    { id: 'mpo_name', label: 'MPO Name', alignRight: false },
    { id: 'station_type', label: 'Station Type', alignRight: false },
    { id: 'company_area', label: 'Head Quarter', alignRight: false },
];

const AddMultipleMpoArea = () => {

    const location = useLocation();
    const id = new URLSearchParams(location.search).get('number');
    var array = Array.from({ length: id }, (_, index) => index + 1);
    const [AllMutipleData, setAllMutipleData] = useState([]);
    const navigate = useNavigate();

    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    const [createMpoArea] = usePostAreaofMPOMutation()

    const [isLoading, setIsLoading] = useState(false);

    const onAddDoctors = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Set loading state to true
        for (const addData of AllMutipleData) {
            try {
                const response = await createMpoArea(addData)
                if (response.data) {
                    setSuccessMessage({ show: true, message: 'Successfully Added Mpo Area.' });
                    setTimeout(() => {
                        setSuccessMessage({ show: false, message: '' });
                        navigate('/dashboard/admin/mpoareas')
                    }, 1000);
                } else {
                    setErrorMessage({ show: true, message: response.error.data[0] });
                    setTimeout(() => {
                        setErrorMessage({ show: false, message: '' });
                    }, 1000);
                }
            } catch (error) {
                setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later.' });
                setTimeout(() => {
                    setErrorMessage({ show: false, message: '' });
                }, 1000);
            }
        }

        setIsLoading(false);
    }

    return (
        <Box>
            {
                isLoading === true ?
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        minHeight="65vh"
                    >
                        <Circles
                            height="200"
                            width="200"
                            color="#2e8960"
                            ariaLabel="circles-loading"
                            wrapperStyle={{}}
                            wrapperClass=""
                            visible={true}
                        />
                    </Box> :
                    <>
                        <Card style={{ paddingTop: "15px", paddingBottom: "15px" }}>
                            <Scrollbar>
                                <TableContainer>
                                    <Table>
                                        <UserListHead
                                            headLabel={TABLE_HEAD}
                                        />
                                        <TableBody>
                                            {
                                                array.map((key, index) => (
                                                    <TableRow key={key}>
                                                        <MultipleDoctor sn={index} setAllMutipleData={setAllMutipleData} AllMutipleData={AllMutipleData} />
                                                    </TableRow>
                                                ))
                                            }
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Scrollbar>
                        </Card>
                        <Box marginTop={2}>
                            {/* <Button
                                variant="contained"
                                className="summit-button"
                                onClick={(e) => onAddDoctors(e)}
                            >
                                Add Multiple MPO Area{" "}
                            </Button> */}
                            <Controls.SubmitButton
                                variant="contained"
                                className="submit-button"
                                onClick={(e) => onAddDoctors(e)}
                                text="Add Multiple MPO Area"
                            />
                        </Box>
                    </>
            }
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
        </Box>
    )
}

const MultipleDoctor = ({ sn, setAllMutipleData, AllMutipleData }) => {
    const { company_id, user_role, company_user_role_id, email } = useSelector((state) => state.cookie);

    const doctorcategories = [
        { id: "A", title: "A" },
        { id: "B", title: "B" },
        { id: "C", title: "C" },
    ]

    const [MpoData] = usePostAllMPONamesNoPageMutation()

    const mpoStation = [
        { id: "HOME STATION", title: "HOME STATION" },
        { id: "EX STATION", title: "EX STATION" },
        { id: "OUT STATION", title: "OUT STATION" },
        { id: "NONE WORKING", title: "NONE WORKING" },
    ]

    const { data: CompanyArea } = useGetAllCompanyAreasQuery(company_id, {
        skip: !company_id
    });
    const companyAreaData = useMemo(() => {
        if (CompanyArea) {
            return CompanyArea?.map(key => ({ id: key.id, title: key.company_area }))
        }
        return [];
    }, [CompanyArea])

    const [MpoList, setMpoList] = useState([]);

    const mpoNames = useMemo(() => {
        if (MpoList) {
            return MpoList.map(key => ({ id: key.id, title: key.user_name.first_name + ' ' + key.user_name.middle_name + ' ' + key.user_name.last_name }))
        }
        return [];
    }, [MpoList])

    useEffect(() => {
        if (company_id) {
            MpoData({ company_name: company_id }, {
                skip: !company_id
            })
                .then((res) => {
                    setMpoList(res.data);
                })
                .catch((err) => {
                })
        }
    }, [company_id])

    const [Formdata, setFormData] = useState({
        area_name: "",
        mpo_name: user_role === "admin" ? "" : company_user_role_id,
        station_type: "",
        company_area: "",
        company_name: company_id
    })


    const handleInputChange = (event) => {
        const { name, value } = event.target;
        const newData = { ...Formdata, [name]: value };

        // Update the Formdata state
        setFormData(newData);

        // Update the corresponding entry in the AllMutipleData state
        setAllMutipleData(prevData => {
            const updatedData = [...prevData];
            updatedData[sn] = newData;
            return updatedData;
        });
    };

    const MpoArea = useGetMpoAreaQuery({ company_name: company_id, mpo_name: user_role === 'admin' ? Formdata.mpo_name : company_user_role_id }, {
        skip: !company_id || !user_role || !company_user_role_id || !Formdata.mpo_name
    });

    const mpoAreaData = useMemo(() => {
        if (MpoArea?.data) {
            return MpoArea?.data.map(key => ({ id: key.id, title: key.area_name }))
        }
        return [];
    }, [MpoArea])

    return (
        <>
            <TableCell>{sn + 1}</TableCell>
            <TableCell align="left">
                <Controls.Input
                    id="autoFocus"
                    autoFocus
                    name="area_name"
                    label="Area Name*"
                    value={Formdata.area_name}
                    onChange={handleInputChange}
                // error={errors.doctor_name}
                />
            </TableCell>
            <TableCell align="left" style={{ width: "220px" }}>
                {
                    user_role === 'admin' ?
                        <Controls.Select
                            name="mpo_name"
                            label="MPO*"
                            value={Formdata.mpo_name}
                            onChange={handleInputChange}
                            // error={errors.mpo_name}
                            options={mpoNames}
                        /> : <>{email}</>
                }
            </TableCell>
            <TableCell align="left" style={{ width: "220px" }}>
                <Controls.Select
                    name="station_type"
                    label="Station Type*"
                    value={Formdata.station_type}
                    onChange={handleInputChange}
                    // error={errors.mpo_name}
                    options={mpoStation}
                />
            </TableCell>
            <TableCell align="left" style={{ width: "220px" }}>
                <Controls.Select
                    name="company_area"
                    label="Head Quarter*"
                    value={Formdata.company_area}
                    onChange={handleInputChange}
                    // error={errors.mpo_name}
                    options={companyAreaData}
                />
            </TableCell>
        </>
    )
}

export default React.memo(AddMultipleMpoArea);