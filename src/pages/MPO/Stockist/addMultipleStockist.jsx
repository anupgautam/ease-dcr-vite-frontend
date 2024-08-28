import { Box, Card, Grid, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import React, { useEffect, useState, useMemo, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePostAllMPONamesNoPageMutation } from "@/api/MPOSlices/DoctorSlice";
import Scrollbar from "@/components/scrollbar/Scrollbar";
import { UserListHead } from "@/sections/@dashboard/user";
import Controls from "@/reusable/forms/controls/Controls";
import { useGetMpoAreaQuery } from "@/api/MPOSlices/TourPlanSlice";
import { Circles } from 'react-loader-spinner';
import { useCreateStockistsMutation } from "@/api/MPOSlices/stockistApiSlice";
import { useGetAllCompanyAreasQuery } from "@/api/CompanySlices/companyAreaSlice";
import { CookieContext } from '@/App'

const TABLE_HEAD = [
    { id: 'stockist_name', label: 'Stockist Name', alignRight: false },
    { id: 'stockist_phone_number', label: 'Stockist Phone Number', alignRight: false },
    { id: 'stockist_address', label: 'Stockist Address', alignRight: false },
    { id: 'stockist_pan_vat_number', label: 'Stockist VAT or PAN Number', alignRight: false },
    { id: 'stockist_category', label: 'Stockist Category', alignRight: false },
    { id: 'stockist_territory', label: 'Stockist Territory', alignRight: false },
];

const AddMultipleStockist = () => {

    const location = useLocation();
    const id = new URLSearchParams(location.search).get('number');
    var array = Array.from({ length: id }, (_, index) => index + 1);
    const [AllMutipleData, setAllMutipleData] = useState([]);
    const navigate = useNavigate();

    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    const [createStockist] = useCreateStockistsMutation()

    const [isLoading, setIsLoading] = useState(false);

    const onAddDoctors = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Set loading state to true

        for (const addData of AllMutipleData) {
            try {
                const response = await createStockist(addData)
                if (response.data) {
                    setSuccessMessage({ show: true, message: 'Successfully Added Stockist.' });
                    setTimeout(() => {
                        setSuccessMessage({ show: false, message: '' });
                        navigate('/dashboard/admin/listofstockist')
                    }, 3000);
                } else {
                    setErrorMessage({ show: true, message: response.error.data[0] });
                    setTimeout(() => {
                        setErrorMessage({ show: false, message: '' });
                    }, 3000);
                }
            } catch (error) {
                setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later.' });
                setTimeout(() => {
                    setErrorMessage({ show: false, message: '' });
                }, 3000);
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
                                <TableContainer sx={{ minWidth: 1600 }}>
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
                                Add Multiple Stockist{" "}
                            </Button> */}
                            <Controls.SubmitButton
                                variant="contained"
                                className="submit-button"
                                onClick={(e) => onAddDoctors(e)}
                                text="Add Multiple Stockists"
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
    const { company_id, user_role, company_user_id } = useContext(CookieContext)

    const doctorcategories = [
        { id: "A", title: "A" },
        { id: "B", title: "B" },
        { id: "C", title: "C" },
    ]

    const [MpoData] = usePostAllMPONamesNoPageMutation()

    const [MpoList, setMpoList] = useState([]);

    const mpoNames = useMemo(() => {
        if (MpoList) {
            return MpoList.map(key => ({ id: key.id, title: key.user_name.first_name + ' ' + key.user_name.last_name }))
        }
        return [];
    }, [MpoList])

    const { data: CompanyArea } = useGetAllCompanyAreasQuery(company_id);

    const companyAreaData = useMemo(() => {
        if (CompanyArea) {
            return CompanyArea.map(key => ({ id: key.id, title: key.company_area }))
        }
        return [];
    }, [CompanyArea])

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
        stockist_name: "",
        stockist_contact_number: "",
        stockist_address: "",
        stockist_category: "",
        pan_vat_number: "",
        mpo_name: user_role === 'admin' ? "" : company_user_role,
        stockist_territory: "",
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


    const MpoArea = useGetMpoAreaQuery({ company_name: company_id, mpo_name: user_role === 'admin' ? Formdata.mpo_name : company_user_id });


    // const mpoAreaData = useMemo(() => {
    //     if (MpoArea) {
    //         return MpoArea.data.map(key => ({ id: key.id, title: key.area_name }))
    //     }
    //     return [];
    // }, [MpoArea])

    return (
        <>
            <TableCell>{sn + 1}</TableCell>
            <TableCell align="left">
                <Controls.Input
                    id="autoFocus"
                    name="stockist_name"
                    label="Stockist Name*"
                    value={Formdata.stockist_name}
                    onChange={handleInputChange}
                    autoFocus
                // error={errors.doctor_name}
                // className={"drawer-first-name-input"}
                />
            </TableCell>
            <TableCell align="left">
                <Controls.Input
                    name="stockist_contact_number"
                    label="Stockist Phone Number"
                    value={Formdata.stockist_contact_number}
                    onChange={handleInputChange}
                // error={errors.doctor_phone_number}
                // className={"drawer-first-name-input"}
                />
            </TableCell>
            <TableCell align="left">
                <Controls.Input
                    name="stockist_address"
                    label="Stockist Address"
                    value={Formdata.stockist_address}
                    onChange={handleInputChange}
                // error={errors.doctor_address}
                // className={"drawer-first-name-input"}
                />
            </TableCell>
            <TableCell align="left">
                <Controls.Input
                    name="pan_vat_number"
                    label="Stockist PAN or VAT Number"
                    value={Formdata.pan_vat_number}
                    onChange={handleInputChange}
                // error={errors.doctor_name}
                // className={"drawer-first-name-input"}
                />
            </TableCell>
            <TableCell align="left" style={{ width: "200px" }}>
                <Controls.Select
                    name="stockist_category"
                    label="Stockist Category*"
                    // className={"drawer-first-name-input"}
                    value={Formdata.stockist_category}
                    options={doctorcategories}
                    onChange={handleInputChange}
                // error={errors.doctorDCRId}
                />
            </TableCell>
            <TableCell align="left" style={{ width: "200px" }}>
                <Controls.Select
                    name="stockist_territory"
                    label="Stockist Territory*"
                    value={Formdata.stockist_territory}
                    onChange={handleInputChange}
                    // error={errors.doctor_territory}
                    options={companyAreaData}
                />
            </TableCell>
        </>
    )
}

export default React.memo(AddMultipleStockist);