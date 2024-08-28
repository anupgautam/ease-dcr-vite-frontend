import { Box, Card, Grid, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import React, { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCreateDoctorsMutation, useGetDoctorsSpecializationQuery, usePostAllMPONamesNoPageMutation } from "@/api/MPOSlices/DoctorSlice";
import Scrollbar from "@/components/scrollbar/Scrollbar";
import { UserListHead } from "@/sections/@dashboard/user";
import Controls from "@/reusable/forms/controls/Controls";
import { useGetMpoAreaQuery } from "@/api/MPOSlices/TourPlanSlice";
import { Circles } from 'react-loader-spinner';
import { CookieContext } from '@/App'


const TABLE_HEAD = [
    { id: 'doctor_name', label: 'Doctor Name', alignRight: false },
    { id: 'doctor_phone_number', label: 'Doctor Phone Number', alignRight: false },
    { id: 'doctor_address', label: 'Doctor Address', alignRight: false },
    { id: 'doctor_gender', label: 'Doctor Gender', alignRight: false },
    { id: 'doctor_category', label: 'Doctor Category', alignRight: false },
    { id: 'doctor_nmc_number', label: 'Doctor NMC Number', alignRight: false },
    { id: 'doctor_qualification', label: 'Doctor Qualification', alignRight: false },
    { id: 'doctor_specialization', label: 'Doctor Specialization', alignRight: false },
    { id: 'mpo_name', label: 'MPO Name', alignRight: false },
    { id: 'doctor_territory', label: 'Doctor Territory', alignRight: false },
];


const AddMutipleDoctor = () => {

    const location = useLocation();
    const id = new URLSearchParams(location.search).get('number');
    var array = Array.from({ length: id }, (_, index) => index + 1);
    const [AllMutipleData, setAllMutipleData] = useState([]);
    const navigate = useNavigate();

    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    const [createDoctors] = useCreateDoctorsMutation()

    const [isLoading, setIsLoading] = useState(false);


    const onAddDoctors = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Set loading state to true

        for (const addData of AllMutipleData) {
            try {
                const response = await createDoctors(addData)
                if (response.data) {
                    setSuccessMessage({ show: true, message: 'Successfully Added Doctors.' });
                    setTimeout(() => {
                        setSuccessMessage({ show: false, message: '' });
                        navigate('/dashboard/admin/listofdoctor')
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

        setIsLoading(false); // Set loading state to false once done
    };

    return (
        <Box>
            {
                isLoading === true ?
                    <Box
                        display="flex"
                        justifyContent="center" // Center horizontally
                        alignItems="center" // Center vertically
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
                                <TableContainer sx={{ minWidth: 2400 }}>
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
                                Add Multiple Doctor{" "}
                            </Button> */}
                            <Controls.SubmitButton
                                variant="contained"
                                className="submit-button"
                                onClick={(e) => onAddDoctors(e)}
                                text="Add Multiple Doctor"
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
    const { company_id, email, company_user_id, user_role, } = useContext(CookieContext)

    const doctorcategories = [
        { id: "A", title: "A" },
        { id: "B", title: "B" },
        { id: "C", title: "C" },
    ]
    const doctorGender = [
        { id: "Male", title: "Male" },
        { id: "Female", title: "Female" },
    ]

    const DoctorSpecialization = useGetDoctorsSpecializationQuery(company_id)

    const doctorspecializations = useMemo(() => {
        if (DoctorSpecialization?.data) {
            return DoctorSpecialization?.data.map(key => ({ id: key.id, title: key.category_name }))
        }
        return [];
    }, [DoctorSpecialization])

    const [MpoData] = usePostAllMPONamesNoPageMutation()

    const [MpoList, setMpoList] = useState([]);

    const mpoNames = useMemo(() => {
        if (MpoList) {
            return MpoList.map(key => ({ id: key.id, title: key.user_name.first_name + ' ' + key.user_name.last_name }))
        }
        return [];
    }, [MpoList])

    useEffect(() => {
        if (company_id) {
            MpoData({ company_name: company_id })
                .then((res) => {
                    setMpoList(res.data);
                })
                .catch((err) => {
                })
        }
    }, [company_id])

    const [Formdata, setFormData] = useState({
        doctor_name: "",
        doctor_phone_number: "",
        doctor_address: "",
        doctor_gender: "",
        doctor_category: "",
        doctor_nmc_number: "",
        doctor_qualification: "",
        doctor_specialization: "",
        is_investment: false,
        mpo_name: user_role === 'MPO' ? company_user_id : "",
        doctor_territory: "",
        company_id: company_id
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


    const MpoArea = useGetMpoAreaQuery({ company_name: company_id, mpo_name: user_role === 'admin' ? Formdata.mpo_name : company_user_id });

    const mpoAreaData = useMemo(() => {
        if (MpoArea) {
            return MpoArea?.data?.map(key => ({ id: key.id, title: key.area_name }))
        }
        return [];
    }, [MpoArea])


    return (
        <>
            <TableCell>{sn + 1}</TableCell>
            <TableCell align="left">
                <Controls.Input
                    name="doctor_name"
                    label="Doctor Name*"
                    value={Formdata.doctor_name}
                    onChange={handleInputChange}
                // error={errors.doctor_name}
                // className={"drawer-first-name-input"}
                />
            </TableCell>
            <TableCell align="left">
                <Controls.Input
                    name="doctor_phone_number"
                    label="Doctor Phone Number"
                    value={Formdata.doctor_phone_number}
                    onChange={handleInputChange}
                // error={errors.doctor_phone_number}
                // className={"drawer-first-name-input"}
                />
            </TableCell>
            <TableCell align="left">
                <Controls.Input
                    name="doctor_address"
                    label="Doctor Address"
                    value={Formdata.doctor_address}
                    onChange={handleInputChange}
                // error={errors.doctor_address}
                // className={"drawer-first-name-input"}
                />
            </TableCell>
            <TableCell align="left" style={{ width: "200px" }}>
                <Controls.Select
                    name="doctor_gender"
                    label="Doctor Gender"
                    // className={"drawer-first-name-input"}
                    value={Formdata.doctor_gender}
                    options={doctorGender}
                    onChange={handleInputChange}
                // error={errors.doctor_gender}
                />
            </TableCell>
            <TableCell align="left" style={{ width: "200px" }}>
                <Controls.Select
                    name="doctor_category"
                    label="Doctor Category*"
                    // className={"drawer-first-name-input"}
                    value={Formdata.doctor_category}
                    options={doctorcategories}
                    onChange={handleInputChange}
                // error={errors.doctorDCRId}
                />
            </TableCell>
            <TableCell align="left">
                <Controls.Input
                    name="doctor_nmc_number"
                    label="Doctor NMC Number"
                    value={Formdata.doctor_nmc_number}
                    onChange={handleInputChange}
                // error={errors.doctor_name}
                // className={"drawer-first-name-input"}
                />
            </TableCell>
            <TableCell align="left">
                <Controls.Input
                    name="doctor_qualification"
                    label="Doctor Qualification"
                    value={Formdata.doctor_qualification}
                    onChange={handleInputChange}
                // error={errors.doctor_name}
                // className={"drawer-first-name-input"}
                />
            </TableCell>
            <TableCell align="left" style={{ width: "200px" }}>
                <Controls.Select
                    name="doctor_specialization"
                    label="Doctor Specialization*"
                    value={Formdata.doctor_specialization}
                    onChange={handleInputChange}
                    // error={errors.doctor_specialization}
                    options={doctorspecializations}
                />
            </TableCell>
            {/* <TableCell align="left" style={{ width: "170px" }}>
                <Controls.Checkbox
                    name="is_investment"
                    value={Formdata.is_investment}
                    onChange={handleInputChange}
                    label="Is Invested"
                />
            </TableCell> */}
            <TableCell align="left" style={{ width: "200px" }}>
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
            <TableCell align="left" style={{ width: "200px" }}>
                <Controls.Select
                    name="doctor_territory"
                    label="Doctor Territory*"
                    value={Formdata.doctor_territory}
                    onChange={handleInputChange}
                    // error={errors.doctor_territory}
                    options={mpoAreaData}
                />
            </TableCell>
        </>
    )
}

export default React.memo(AddMutipleDoctor);