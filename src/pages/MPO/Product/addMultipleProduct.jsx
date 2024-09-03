import { Box, Button, Card, Grid, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePostAllMPONamesNoPageMutation } from "@/api/MPOSlices/DoctorSlice";
import Scrollbar from "@/components/scrollbar/Scrollbar";
import { UserListHead } from "@/sections/@dashboard/user";
import Controls from "@/reusable/forms/controls/Controls";
import { useGetMpoAreaQuery } from "@/api/MPOSlices/TourPlanSlice";
import { Circles } from 'react-loader-spinner';
import { useCreateStockistsMutation } from "@/api/MPOSlices/stockistApiSlice";
import { useGetAllCompanyAreasQuery } from "@/api/CompanySlices/companyAreaSlice";
import { useCreateProductsMutation, useGetCompDivisionQuery } from "@/api/MPOSlices/productApiSlice";
import { useForm } from "@/reusable/forms/useForm";
import { useSelector } from 'react-redux';

const TABLE_HEAD = [
    { id: 'product_name', label: 'Product Name', alignRight: false },
    { id: 'product_type', label: 'Product Type', alignRight: false },
    { id: 'product_molecular_name', label: 'Product Molecular Name', alignRight: false },
    { id: 'product_price_per_strip_in_mrp', label: 'Product in MRP', alignRight: false },
    { id: 'product_price_for_stockist', label: 'Price for Stockist', alignRight: false },
    { id: 'product_description', label: 'Product Description', alignRight: false },
    { id: 'bonus', label: 'Bonus', alignRight: false },
    { id: 'division_name', label: 'Division Name', alignRight: false },
];

const AddMultipleProduct = () => {

    const location = useLocation();
    const id = new URLSearchParams(location.search).get('number');
    var array = Array.from({ length: id }, (_, index) => index + 1);
    const [AllMutipleData, setAllMutipleData] = useState([]);
    const navigate = useNavigate();

    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    const [createProduct] = useCreateProductsMutation()

    const [isLoading, setIsLoading] = useState(false);

    const onAddDoctors = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Set loading state to true
        for (const addData of AllMutipleData) {
            try {
                const response = await createProduct(addData)
                if (response.data) {
                    setSuccessMessage({ show: true, message: 'Successfully Added Product.' });
                    setTimeout(() => {
                        setSuccessMessage({ show: false, message: '' });
                        navigate('/dashboard/admin/listofproduct')
                    }, 3000);
                } else {
                    setErrorMessage({ show: true, message: response?.error?.data?.error });
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
                                <TableContainer sx={{ minWidth: 2000 }}>
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
                            <Button
                                variant="contained"
                                className="summit-button"
                                onClick={(e) => onAddDoctors(e)}
                            >
                                Add Multiple Product{" "}
                            </Button>
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
    const { company_id, user_role, company_user_id } = useSelector((state) => state.cookie);

    const prod_category = [
        { id: "tab", title: "Tablet" },
        { id: "liquid", title: "Liquid" },
        { id: "cap", title: "Capsules" },
        { id: "tm", title: "Topical Medicines" },
        { id: "sup", title: "Suppositories" },
        { id: "drop", title: "Drops" },
        { id: "inhaler", title: "Inhalers" },
        { id: "implant", title: "Implants" },
        { id: "buccal", title: "Buccal" },
        { id: "ointment", title: "Ointment" },
        { id: "powder", title: "Powder" },
        { id: "syrup", title: "Syrup" },
        { id: "cream", title: "Cream" },
        { id: "gel", title: "Gel" },
        { id: "patch", title: "Transdermal Patch" },
        { id: "granules", title: "Granules" },
        { id: "lozenge", title: "Lozenge" },
        { id: "spray", title: "Spray" },
        { id: "injectable", title: "Injectable" },
        { id: "foam", title: "Foam" },
        { id: "tube", title: "Tube" },
        { id: "strip", title: "Strip" },
        { id: "sachet", title: "Sachet" },
        { id: "1X6", title: "1X6" },
    ];

    const [File, setFile] = useState([]);

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

    const companyAreaData = [];
    const { data: CompanyArea } = useGetAllCompanyAreasQuery(company_id, {
        skip: !company_id
    });

    if (CompanyArea !== undefined) {
        CompanyArea?.forEach((key) => {
            companyAreaData.push({ id: key.id, title: key.company_area })
        })
    }

    const Division = useGetCompDivisionQuery(company_id, {
        skip: !company_id
    });


    const divisions = [];
    if (Division.data) {
        Division.data.forEach((key) => {
            divisions.push({ id: key.id, title: key.division_name });
        });
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
        product_name: "",
        product_molecular_name: "",
        product_price_per_strip_in_mrp: "",
        product_price_for_stockist: "",
        product_description: "",
        division_name: "",
        bonus: "",
        product_type: "",
        image: [],
        company_id: company_id,
    })

    const {
        values,
        setValues,
        errors,
        setErrors,
        handleImageUpload,
        resetForm,
    } = useForm(Formdata, true)

    useEffect(() => {
        handleImageUpload("image", File);
    }, [File]);

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

    const MpoArea = useGetMpoAreaQuery({ company_name: company_id, mpo_name: user_role === 'admin' ? Formdata.mpo_name : company_user_id }, {
        skip: !company_id || !user_role || !company_user_id || !Formdata.mpo_name
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
                    name="product_name"
                    label="Product name*"
                    value={Formdata.product_name}
                    onChange={handleInputChange}
                // error={errors.product_name}
                />
            </TableCell>
            <TableCell align="left" style={{ width: "220px" }}>
                <Controls.Select
                    name="product_type"
                    label="Product Type*"
                    value={Formdata.product_type}
                    options={prod_category}
                    onChange={handleInputChange}
                // error={errors.product_type}

                />
            </TableCell>
            <TableCell align="left" >
                <Controls.Input
                    name="product_molecular_name"
                    label="Product Molecular Name*"
                    value={Formdata.product_molecular_name}
                    onChange={handleInputChange}
                // error={errors.product_molecular_name}

                />
            </TableCell>
            <TableCell align="left">
                <Controls.Input
                    name="product_price_per_strip_in_mrp"
                    label="Product Price in MRP*"
                    // type="number"
                    value={Formdata.product_price_per_strip_in_mrp}
                    onChange={handleInputChange}
                // error={errors.product_price_per_strip_in_mrp}

                />
            </TableCell>
            <TableCell align="left" style={{ width: "200px" }}>
                <Controls.Input
                    name="product_price_for_stockist"
                    label="Product price for Stockist*"
                    // type="number"
                    value={Formdata.product_price_for_stockist}
                    onChange={handleInputChange}
                // error={errors.product_price_for_stockist}

                />
            </TableCell>
            <TableCell align="left" >
                <Controls.Input
                    name="product_description"
                    label="Product Description*"
                    value={Formdata.product_description}
                    onChange={handleInputChange}
                    // error={errors.product_description}
                    className={"drawer-first-name-input"}
                />
            </TableCell>
            <TableCell align="left">
                <Controls.Input
                    name="bonus"
                    label="bonus*"
                    // type="number"
                    value={Formdata.bonus}
                    onChange={handleInputChange}
                // error={errors.product_price_for_stockist}

                />
            </TableCell>
            <TableCell align="left" style={{ width: "200px" }}>
                <Controls.Select
                    name="division_name"
                    label="Division Name*"
                    value={Formdata.division_name}
                    options={divisions}
                    onChange={handleInputChange}
                // error={errors.division_name}
                />
            </TableCell>
            {/* <TableCell align="left" style={{ width: "400px" }}>
                <Controls.Image
                    setFile={setFile}
                    aspectRatio={373 / 280}
                />
            </TableCell> */}
        </>
    )
}

export default AddMultipleProduct;