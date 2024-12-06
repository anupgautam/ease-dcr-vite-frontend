import { Box, Card, Grid, Table, TableBody, TableCell, TableContainer, TableRow, Autocomplete, TextField, InputLabel } from "@mui/material";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { usePostAllMPONamesNoPageMutation } from "@/api/MPOSlices/DoctorSlice";
import Scrollbar from "@/components/scrollbar/Scrollbar";
import { UserListHead } from "@/sections/@dashboard/user";
import Controls from "@/reusable/forms/controls/Controls";
import { useGetMpoAreaQuery } from "@/api/MPOSlices/TourPlanSlice";
import { useGetAllExecutiveLevelsMutation } from '@/api/CompanySlices/companyUserSlice';
import { useGetFilteredDivisionsQuery } from "../../../api/DivisionSilces/companyDivisionSlice";
import { Circles } from 'react-loader-spinner';
import {
    useGetUsersRoleQuery,
    useCreateUsersMutation
} from '@/api/MPOSlices/UserSlice';
import {
    useGetAllCompanyAreasQuery
} from '@/api/CompanySlices/companyAreaSlice'
import { useSelector } from 'react-redux';
import { NepaliDatePicker, BSDate } from "nepali-datepicker-react";
import { useForm } from "../../../reusable/forms/useForm";
import { returnValidation } from "../../../validation";

const TABLE_HEAD = [
    { id: 'first_name', label: 'First Name', alignRight: false },
    { id: 'middle_name', label: 'Middle Name', alignRight: false },
    { id: 'last_name', label: 'Last Name', alignRight: false },
    { id: 'email', label: 'Email', alignRight: false },
    { id: 'date_of_joining', label: 'Date Of Joining', alignRight: false },
    { id: 'address', label: 'Address', alignRight: false },
    { id: 'phone_number', label: 'Phone Number', alignRight: false },
    { id: 'role_name', label: 'Role Name', alignRight: false },
    { id: 'executive_level', label: 'Executive Level', alignRight: false },
    { id: 'division_name', label: 'Division Name', alignRight: false },
    { id: 'company_area', label: 'Company Area', alignRight: false },
    { id: 'station_type', label: 'Station Type', alignRight: false },
];

const AddMultipleUser = () => {

    const location = useLocation();
    const id = new URLSearchParams(location.search).get('number');
    var array = Array.from({ length: id }, (_, index) => index + 1);
    const [AllMutipleData, setAllMutipleData] = useState([]);
    const navigate = useNavigate();

    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    const [createUsers] = useCreateUsersMutation();
    console.log('AllMutipleData', AllMutipleData);

    const [isLoading, setIsLoading] = useState(false);
    const onAddUsers = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        for (const addData of AllMutipleData) {
            try {
                const response = await createUsers(addData)
                if (response.data) {
                    setSuccessMessage({ show: true, message: 'Successfully Added Users.' });

                    setTimeout(() => {
                        setSuccessMessage({ show: false, message: '' });
                        navigate('/dashboard/admin/listofuser')
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
                                <TableContainer sx={{ minWidth: 5000 }}>
                                    <Table>
                                        <UserListHead
                                            headLabel={TABLE_HEAD}
                                        />
                                        <TableBody>
                                            {
                                                array.map((key, index) => (
                                                    <TableRow key={key}>
                                                        <MultipleUsers sn={index} setAllMutipleData={setAllMutipleData} AllMutipleData={AllMutipleData} />
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
                                onClick={(e) => onAddUsers(e)}
                                text="Add Multiple Users"
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

const MultipleUsers = ({ sn, setAllMutipleData, AllMutipleData }) => {
    const { company_id, user_role, company_user_id, company_user_role_id, email } = useSelector((state) => state.cookie);

    //! Get user roles
    const { data, isSuccess, } = useGetUsersRoleQuery(company_id, {
        skip: !company_id
    });

    const rolesharu = useMemo(() => {
        if (isSuccess) {
            return data?.map(key => ({ id: key.id, title: key.role_name_value }));
        }
        return [];
    }, [isSuccess, data]);

    //! Get company wise area
    const CompanyAreas = useGetAllCompanyAreasQuery(company_id, {
        skip: !company_id
    })

    const companyAreas = useMemo(() => {
        if (CompanyAreas?.data) {
            return CompanyAreas?.data?.map(key => ({ id: key?.id, title: key?.company_area }));
        }
        return [];
    }, [CompanyAreas]);

    //! Multiple Company wise Area
    const [areaOptions, setAreaOptions] = useState([])

    const handleMultipleCompanyAreas = (event, value) => {
        const selectedIds = value.map(option => option.id);
        setAreaOptions(selectedIds);
    };

    //! Get division
    const Divisions = useGetFilteredDivisionsQuery(company_id, {
        skip: !company_id
    });

    const divisionList = useMemo(() => {
        if (Divisions?.data) {
            return Divisions.data.map(key => ({ id: key?.id, title: key?.division_name }));
        }
        return [];
    }, [Divisions]);

    //! Multiple Company Divsion
    const [divisionOptions, setDivisionOptions] = useState([])
    console.log('divisionOptions', divisionOptions);

    const handleMultipleDivision = (event, value) => {
        const selectedIds = value.map(option => option.id);
        setDivisionOptions(selectedIds);
    };

    //! Executive level
    const [executiveLevels, setExecutiveLevels] = useState([]);
    const [getExecLevel] = useGetAllExecutiveLevelsMutation();
    // const companyId = company_id;

    useEffect(() => {
        const exce = [];
        getExecLevel(company_id, {
            skip: !company_id
        }).then((res) => {
            // 
            res?.data?.map((key) => {
                exce.push({ id: key?.id, title: key?.user_name?.first_name + " " + key?.user_name?.middle_name + " " + key?.user_name?.last_name })
            })
        })
        setExecutiveLevels(exce);
    }, [company_id])

    // useEffect(() => {
    //     const fetchExecutiveLevels = async () => {
    //         try {
    //             const response = await getExecLevel(company_id).unwrap();
    //             const fetchedLevels = response?.map((key) => ({
    //                 id: key?.id,
    //                 title: `${key?.user_name?.first_name || ''} ${key?.user_name?.middle_name || ''} ${key?.user_name?.last_name || ''}`,
    //             }));
    //             setExecutiveLevels(fetchedLevels || []);
    //         } catch (error) {
    //         }
    //     };

    //     if (company_id) {
    //         fetchExecutiveLevels();
    //     }
    // }, []);


    //! Format Date
    const now = new BSDate().now();
    const [dateData, setDateData] = useState(now);
    const [dateFormat, setDateFormat] = useState(dateData?._date)
    const [nepaliDate, setNepaliDate] = useState(dateFormat)


    const formatDate = (date) => {
        const year = date.year;
        const month = String(date.month).padStart(2, '0');
        const day = String(date.day).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const formattedDate = formatDate(nepaliDate);

    useEffect(() => {
        const formatDate = (date) => {
            const year = date.year;
            const month = String(date.month).padStart(2, '0');
            const day = String(date.day).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        const formattedDate = formatDate(nepaliDate);
    }, [dateData])


    const stations = [
        { id: 1, title: "Home Station" },
        { id: 2, title: "Ex Station" },
        { id: 3, title: "Out Station" },
        { id: 4, title: "Non Working" },
    ]


    //! Create User
    const [createUsers] = useCreateUsersMutation()

    const initialFValues = {
        middle_name: "",
    };

    //! Validation wala  
    const validate = (fieldValues = values) => {
        // 
        let temp = { ...errors }
        if ('first_name' in fieldValues)
            temp.first_name = returnValidation(['null', 'number', 'lessThan50', 'specialcharacter'], values.first_name);
        temp.middle_name = returnValidation(['number', 'lessThan50', 'specialcharacter'], values.middle_name);
        if ('last_name' in fieldValues)
            temp.last_name = returnValidation(['null', 'number', 'lessThan50', 'specialcharacter'], values.last_name);
        if ('address' in fieldValues)
            temp.address = returnValidation(['null'], values.address);
        if ('role_name' in fieldValues)
            temp.role_name = returnValidation(['null'], values.role_name);
        if ('division_name' in fieldValues)
            temp.division_name = returnValidation(['null'], values.division_name);
        if ('executive_level' in fieldValues)
            temp.executive_level = returnValidation(['null'], values.executive_level);
        if ('phone_number' in fieldValues)
            temp.phone_number = returnValidation(['null', 'phonenumber', 'specialchracter'], values.phone_number);
        if ('email' in fieldValues)
            temp.email = returnValidation(['null', 'email'], values.email);
        if ('company_area' in fieldValues)
            temp.company_area = returnValidation(['null'], values.company_area);
        if ('station_type' in fieldValues)
            temp.station_type = returnValidation(['null'], values.station_type);


        setErrors({
            ...temp
        })
        // 

        if (fieldValues === values)
            return Object.values(temp).every(x => x == "")
    }

    const {
        values,
        setValues,
        errors,
        setErrors,
        resetForm,
    } = useForm(initialFValues, true)


    useEffect(() => {
        validate();

    }, [values])

    const [Formdata, setFormData] = useState({
        first_name: "",
        middle_name: "",
        last_name: "",
        address: "",
        phone_number: "",
        email: "",
        role_name: "",
        executive_level: "",
        company_name: company_id,
        company_area: areaOptions,
        division_name: divisionOptions,
        station_type: "",
        is_active: "true",
        date_of_joining: formattedDate,
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

    // const mpoAreaData = [];

    // const MpoArea = useGetMpoAreaQuery({ company_name: company_id, mpo_name: user_role === 'admin' ? Formdata.mpo_name : company_user_role_id }, {
    //     skip: !company_id || !user_role || !company_user_role_id || !Formdata.mpo_name
    // });

    // if (MpoArea?.data) {
    //     MpoArea?.data.forEach((key) => {
    //         mpoAreaData.push({ id: key.id, title: key.area_name })
    //     })
    // }

    return (
        <>
            <TableCell>{sn + 1}</TableCell>
            <TableCell align="left">
                <Controls.Input
                    id="autoFocus"
                    autoFocus
                    name="first_name"
                    label="First Name*"
                    value={Formdata.first_name}
                    onChange={handleInputChange}
                    sx={{ width: '250px' }}
                // error={errors.doctor_name}
                />
            </TableCell>
            <TableCell align="left">
                <Controls.Input
                    name="middle_name"
                    label="Middle Name"
                    value={Formdata.middle_name}
                    onChange={handleInputChange}
                // error={errors.doctor_name}
                />
            </TableCell>
            <TableCell align="left">
                <Controls.Input
                    name="last_name"
                    label="Last Name*"
                    value={Formdata.last_name}
                    onChange={handleInputChange}
                // error={errors.doctor_name}
                />
            </TableCell>
            <TableCell align="left">
                <Controls.Input
                    name="email"
                    label="Email"
                    value={Formdata.email}
                    onChange={handleInputChange}
                // error={errors.doctor_address}
                />
            </TableCell>
            <TableCell align="left">
                <Box marginBottom={2}>
                    <NepaliDatePicker
                        value={dateData}
                        format="YYYY-MM-DD"
                        onChange={(value) => setDateData(value)} />
                </Box>
            </TableCell>

            <TableCell align="left">
                <Controls.Input
                    name="address"
                    label="Address"
                    value={Formdata.address}
                    onChange={handleInputChange}
                // error={errors.doctor_address}
                />
            </TableCell>
            <TableCell align="left">
                <Controls.Input
                    name="phone_number"
                    label="Phone Number"
                    value={Formdata.phone_number}
                    onChange={handleInputChange}
                // error={errors.doctor_phone_number}
                />
            </TableCell>

            <TableCell align="left" style={{ width: "400px" }}>
                <Controls.Select
                    name="role_name"
                    label="Role Name*"
                    value={Formdata.role_name}
                    options={rolesharu}
                    onChange={handleInputChange}
                // error={errors.doctorDCRId}
                />
            </TableCell>
            <TableCell align="left" style={{ width: "400px" }}>
                <Controls.Select
                    name="executive_level"
                    label="Executive Level*"
                    value={values.name}
                    onChange={handleInputChange}
                    options={executiveLevels}
                    error={errors.executive_level}
                />
            </TableCell>
            <TableCell align="left" style={{ width: "500px" }}>
                {/* <Controls.Select
                    name="division_name"
                    label="Division*"
                    value={values.name}
                    onChange={handleInputChange}
                    error={errors.division_name}
                    options={divisionList}
                /> */}
                <Autocomplete
                    multiple
                    options={divisionList}
                    getOptionLabel={(option) => option.title}
                    onChange={handleMultipleDivision}
                    renderInput={(params) => (
                        <TextField {...params} label="Division*" />
                    )}
                    renderOption={(props, option) => (
                        <li {...props} key={option.id}>
                            {option.title}
                        </li>
                    )}
                />
            </TableCell>
            <TableCell align="left" style={{ width: "500px" }}>
                {/* <Controls.Select
                    name="company_area"
                    label="Company Wise Area*"
                    value={values.name}
                    onChange={handleInputChange}
                    error={errors.company_area}
                    options={companyAreas}
                /> */}
                <Autocomplete
                    multiple
                    options={companyAreas}
                    getOptionLabel={(option) => option.title}
                    onChange={handleMultipleCompanyAreas}
                    renderInput={(params) => (
                        <TextField {...params} label="Company Areas" />
                    )}
                    renderOption={(props, option) => (
                        <li {...props} key={option.id}>
                            {option.title}
                        </li>
                    )}
                />
            </TableCell>

            <TableCell align="left" style={{ width: "300px" }}>
                <Controls.Input
                    name="station_type"
                    label="Station Type*"
                    className={"drawer-role-name-select"}
                    value={values.name}
                    onChange={handleInputChange}
                    error={errors.station_type}
                />
            </TableCell>
        </>
    )
}

export default AddMultipleUser;