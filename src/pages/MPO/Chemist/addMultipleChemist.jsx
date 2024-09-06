import { Box, Card, Grid, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePostAllMPONamesNoPageMutation } from "@/api/MPOSlices/DoctorSlice";
import Scrollbar from "@/components/scrollbar/Scrollbar";
import { UserListHead } from "@/sections/@dashboard/user";
import Controls from "@/reusable/forms/controls/Controls";
import { useGetMpoAreaQuery } from "@/api/MPOSlices/TourPlanSlice";
import { Circles } from 'react-loader-spinner';
import { useCreateChemistsMutation } from "@/api/MPOSlices/ChemistSlice";
import { useSelector } from 'react-redux';

const TABLE_HEAD = [
    { id: 'chemist_name', label: 'Chemist Name', alignRight: false },
    { id: 'chemist_phone_number', label: 'Chemist Phone Number', alignRight: false },
    { id: 'mpo_name', label: 'MPO Name', alignRight: false },
    { id: 'chemist_territory', label: 'Chemist Territory', alignRight: false },
    { id: 'chemist_category', label: 'Chemist Category', alignRight: false },
    { id: 'chemist_pan_number', label: 'Chemist PAN Number', alignRight: false },
    { id: 'chemist_contact_person', label: 'Chemist Contact Person', alignRight: false },
    { id: 'chemist_address', label: 'Chemist Address', alignRight: false },
];

const AddMultipleChemist = () => {

    const location = useLocation();
    const id = new URLSearchParams(location.search).get('number');
    var array = Array.from({ length: id }, (_, index) => index + 1);
    const [AllMutipleData, setAllMutipleData] = useState([]);
    const navigate = useNavigate();

    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    const [createChemist] = useCreateChemistsMutation()

    const [isLoading, setIsLoading] = useState(false);



    const onAddChemists = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        for (const addData of AllMutipleData) {
            try {
                const response = await createChemist(addData)
                if (response.data) {
                    setSuccessMessage({ show: true, message: 'Successfully Added Chemist.' });

                    setTimeout(() => {
                        setSuccessMessage({ show: false, message: '' });
                        navigate('/dashboard/admin/listofchemist')
                    }, 1000);
                } else if (response.error) {
                    setErrorMessage({ show: true, message: response?.error?.data[0] });
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
                                <TableContainer sx={{ minWidth: 2000 }}>
                                    <Table>
                                        <UserListHead
                                            headLabel={TABLE_HEAD}
                                        />
                                        <TableBody>
                                            {
                                                array.map((key, index) => (
                                                    <TableRow key={key}>
                                                        <MultipleChemist sn={index} setAllMutipleData={setAllMutipleData} AllMutipleData={AllMutipleData} />
                                                    </TableRow>
                                                ))
                                            }
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Scrollbar>
                        </Card>
                        <Box marginTop={2}>
                            <Controls.SubmitButton
                                variant="contained"
                                className="submit-button"
                                onClick={(e) => onAddChemists(e)}
                                text="Add Multiple Chemist"
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

const MultipleChemist = ({ sn, setAllMutipleData, AllMutipleData }) => {
    const { company_id, user_role, company_user_id, company_user_role_id, email } = useSelector((state) => state.cookie);

    const doctorcategories = [
        { id: "A", title: "A" },
        { id: "B", title: "B" },
        { id: "C", title: "C" },
    ]

    const [MpoData] = usePostAllMPONamesNoPageMutation()

    const [MpoList, setMpoList] = useState([]);
    const mpoNames = [];

    if (MpoList) {
        MpoList.map((key) => {
            mpoNames.push({
                id: key.id,
                title: key.user_name.first_name + ' ' + key.user_name.middle_name + ' ' + key.user_name.last_name
            })
        })
    }

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
        chemist_name: "",
        chemist_phone_number: "",
        chemist_address: "",
        chemist_category: "",
        chemist_pan_number: "",
        chemist_contact_person: "",
        mpo_name: user_role === 'MPO' ? company_user_role_id : "",
        chemist_territory: "",
        company_id: company_id,
        is_investment: false,
    })


    const handleInputChange = (event) => {
        const { name, value } = event.target;
        const newData = { ...Formdata, [name]: value };

        setFormData(newData);

        setAllMutipleData(prevData => {
            const updatedData = [...prevData];
            updatedData[sn] = newData;
            return updatedData;
        });
    };

    const mpoAreaData = [];

    const MpoArea = useGetMpoAreaQuery({ company_name: company_id, mpo_name: user_role === 'admin' ? Formdata.mpo_name : company_user_role_id }, {
        skip: !company_id || !user_role || !company_user_role_id || !Formdata.mpo_name
    });

    if (MpoArea?.data) {
        MpoArea?.data.forEach((key) => {
            mpoAreaData.push({ id: key.id, title: key.area_name })
        })
    }

    return (
        <>
            <TableCell>{sn + 1}</TableCell>
            <TableCell align="left">
                <Controls.Input
                    id="autoFocus"
                    autoFocus
                    name="chemist_name"
                    label="Chemist Name*"
                    value={Formdata.chemist_name}
                    onChange={handleInputChange}
                // error={errors.doctor_name}
                />
            </TableCell>
            <TableCell align="left">
                <Controls.Input
                    name="chemist_phone_number"
                    label="Chemist Phone Number"
                    value={Formdata.chemist_phone_number}
                    onChange={handleInputChange}
                // error={errors.doctor_phone_number}
                />
            </TableCell>
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
                    name="chemist_territory"
                    label="Chemist Territory*"
                    value={Formdata.chemist_territory}
                    onChange={handleInputChange}
                    // error={errors.doctor_territory}
                    options={mpoAreaData}
                />
            </TableCell>

            <TableCell align="left" style={{ width: "200px" }}>
                <Controls.Select
                    name="chemist_category"
                    label="Chemist Category*"
                    value={Formdata.chemist_category}
                    options={doctorcategories}
                    onChange={handleInputChange}
                // error={errors.doctorDCRId}
                />
            </TableCell>
            <TableCell align="left">
                <Controls.Input
                    name="chemist_pan_number"
                    label="Chemist PAN Number"
                    value={Formdata.chemist_pan_number}
                    onChange={handleInputChange}
                // error={errors.doctor_name}
                />
            </TableCell>
            <TableCell align="left">
                <Controls.Input
                    name="chemist_contact_person"
                    label="Chemist Contact Person"
                    value={Formdata.chemist_contact_person}
                    onChange={handleInputChange}
                // error={errors.doctor_name}
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

            <TableCell align="left">
                <Controls.Input
                    name="chemist_address"
                    label="Chemist Address"
                    value={Formdata.chemist_address}
                    onChange={handleInputChange}
                // error={errors.doctor_address}
                />
            </TableCell>
        </>
    )
}

export default AddMultipleChemist;