import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  Badge,
  Table,
  Paper,
  Button,
  TableRow,
  TextField,
  TableBody,
  InputAdornment,
  TableCell,
  Typography,
  IconButton,
  TableContainer,
  Pagination,
  Box,
  Grid,
  FormControl,
  Autocomplete,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Iconify from "@/components/iconify/Iconify";
import { UserListHead } from "../../../sections/@dashboard/user";
import Controls from "../../../reusable/components/forms/controls/Controls";
import { useForm1 } from "../../../reusable/components/forms/useForm";
import {
  useDeletecompanyUserRolesByIdMutation,
  useSearchCompanyUserRolesMutation,
} from "@/api/CompanySlices/companyUserRoleSlice";
import EditUser from "./EditUser";
import SearchIcon from "@mui/icons-material/Search";
import Test from "./DefaultList";
import { useGetCompanyRolesByCompanyQuery } from "@/api/CompanySlices/companyRolesSlice";
import { useGetUsersByCompanyRoleIdQuery } from "@/api/MPOSlices/UserSlice";
import Scrollbar from "@/components/scrollbar/Scrollbar";
import { useUpdateUsersMutation } from '@/api/MPOSlices/UserSlice'
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { useLoginUserByAdminMutation } from "../../../api/MPOSlices/UserSlice";
import { useDispatch } from "react-redux";
import { encryptData } from "./excryption";
import DefaultUser from "./DefaultUser";

const TABLE_HEAD = [
  { id: "user_name", label: "User Name", alignRight: false },
  { id: "email", label: "Email", alignRight: false },
  { id: "phone_number", label: "Phone Number", alignRight: false },
  { id: "role_name", label: "Role Name", alignRight: false },
  { id: "head_quarter", label: "Head Quarter", alignRight: false },
  { id: "executive", label: "Executive", alignRight: false },
  { id: "division", label: "Division", alignRight: false },
  { id: "status", label: "Status", alignRight: false },
  { id: "locked_user", label: "Locked User", alignRight: false },
  { id: "" },
];

const UserSearch = () => {
  const { company_id, access, refresh } = useSelector((state) => state.cookie);

  const companykoID = company_id
  //! For drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [selectedId, setSelectedId] = useState(null);
  const [selectedUpdateId, setSelectedUpdateId] = useState(null);

  const onEdit = useCallback((id) => {
    setSelectedUpdateId(id);
    setIsDrawerOpen(true);
  }, []);

  const onCloseDrawer = useCallback(() => {
    setIsDrawerOpen(false);
  }, []);

  //!Pagination logic
  const [page, setPage] = useState(1);

  const handleChangePage = useCallback((e) => {
    const data = e.target.ariaLabel;
    let thisArray = data.split(" ");
    setPage(thisArray[3]);
  }, []);

  // ! Get all users wala
  const roleList = useGetCompanyRolesByCompanyQuery(company_id, {
    skip: !company_id
  });

  const [roleSelect, setRoleSelect] = useState("");
  const [companyRoleList, setCompanyRoleList] = useState([]);

  const userList = useGetUsersByCompanyRoleIdQuery({
    id: company_id,
    page: roleSelect === null ? "" : roleSelect,
  }, {
    skip: !company_id
  });

  useEffect(() => {
    let dataList = [{ id: "", title: "None" }];
    if (roleList?.data) {
      roleList.data.map((key) => {
        dataList.push({ id: key.id, title: key.role_name_value });
      });
    }
    setCompanyRoleList(dataList);
  }, [roleList]);

  const [searchResults, setSearchResults] = useState({ search: "" });
  const [searchUser, results] = useSearchCompanyUserRolesMutation();


  // !on search
  const onSearch = (e) => {
    const searchQuery = e.target.value;
    const company_id = companykoID;
    // const companyId = company_id
    setSearchResults({ search: searchQuery, company_id });
    searchUser(searchResults, {
      skip: !company_id
    });
    //
  };

  const [filterValue, setFilterValue] = useState(true);

  const onFilterChange = useCallback((e) => {
    setFilterValue(e.target.value);
  }, []);

  const initialFValues = {
    search: " ",
  };

  const handleRoleSelect = useCallback((e, value) => {
    // setRoleSelect(value.id === null ? "" : value.id);
    setRoleSelect(value?.id || "");
  }, []);
  const handleClear = useCallback(() => {
    setRoleSelect("");
  }, []);

  const { values, handleSearchClick } = useForm1(initialFValues, true);

  useEffect(() => {
    if (values.search.trim()) {
      searchUser(values);
    }
  }, [values, searchUser]);

  // !Delete users
  const [deleteUser] = useDeletecompanyUserRolesByIdMutation();
  const [UserStatus] = useUpdateUsersMutation();


  const handleChangeStatus = (e, user) => {
    const data = {
      first_name: user.user_name.first_name,
      middle_name: user.user_name.middle_name,
      last_name: user.user_name.last_name,
      phone_number: user.user_name.phone_number,
      email: user.user_name.email,
      role_name: user.role_name.id,
      division_name: user.division_name.id,
      company_name: company_id,
      station_type: user.station_type,
      date_of_joining: user.user_name.date_of_joining,
      executive_level: user.executive_level.id,
      is_active: JSON.parse(e.target.value),
      company_id: company_id,
    }
    console.log('data', data);
    UserStatus({ id: user.id, data: data }).then((res) => {
      if (res.data) {
      }
    });
  };

  //! Dialogue
  const [openDialogue, setOpenDialogue] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleClickOpen = useCallback((userId) => {
    setOpenDialogue((prev) => ({ ...prev, [userId]: true }));
  }, []);

  const handleClose = useCallback((userId) => {
    setOpenDialogue((prev) => ({ ...prev, [userId]: false }));
  }, []);

  const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' })
  const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' })
  const dispatch = useDispatch();

  const [AdminUserLogin] = useLoginUserByAdminMutation();
  const navigate = useNavigate();


  const UserLogin = (id) => {
    AdminUserLogin({ user_id: id.user_name.id })
      .then((res) => {
        if (res.data) {
          localStorage.setItem('user_login', JSON.stringify(res.data));
          localStorage.setItem('email', id.user_name.email)
          if (res.data.role === 'admin' || res.data.role === 'ADMIN') {
            setErrorMessage({ show: true, message: 'Admin Cannot be logged in.' });
          } else if (res.data.role === 'MPO' || res.data.role === 'mpo') {
            window.open('/dashboard/admin/listofdoctor', '_blank')
          } else if (res.data.role === "ASM") {
            window.open(`/dashboard/admin/tourplan`, '_blank');
          } else if (res.data.role === "RSM" || res.data.role === "SM" || res.data.role === "MM" || res.data.role === "CH") {
            window.open(`/dashboard/admin/tourplan`, '_blank');
          }
          else {
            setErrorMessage({ show: true, message: "User Does not exist." });
            setTimeout(() => {
              setErrorMessage({ show: false, message: "" });
            }, [2000])
          }
        } if (res.error) {
          if (res.error?.originalStatus === 500) {
            setErrorMessage({ show: true, message: 'Backend Error' });
          } else {
            setErrorMessage({ show: true, message: res.error.data });
          }
          setTimeout(() => setErrorMessage({ show: false, message: "" }), 2000);
        } else {
          setErrorMessage({ show: true, message: 'Login Failed' });
          setTimeout(() => {
            setErrorMessage({ show: false, message: "" });
          }, [2000])
        }
      })
      .catch((err) => {
        setErrorMessage({ show: true, message: 'Login Failed' });

        setTimeout(() => {
          setErrorMessage({ show: false, message: "" });
        }, [2000])
      })
  }


  return (
    <>
      <Card>
        <Box style={{ padding: "20px" }}>
          <Grid container spacing={1.5}>
            <Grid item xs={4.5} sm={2.5}>
              <TextField
                label="Search Users"
                variant="outlined"
                onChange={(e) => onSearch(e)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ m: 2 }}
              />
            </Grid>
            <Grid item xs={4} sm={2.5}>
              <Autocomplete
                options={companyRoleList}
                getOptionLabel={(option) => option.title}
                onChange={handleRoleSelect}
                renderInput={(params) => (
                  <TextField {...params} label="Company Roles" />
                )}
                renderOption={(props, option) => (
                  <li {...props} key={option.id}>
                    {option.title}
                  </li>
                )}
              />
            </Grid>
            <Grid item xs={3.5} sm={2.5}>
              <Box>
                <Controls.Select
                  value={filterValue}
                  name={"Status"}
                  onChange={(e) => onFilterChange(e)}
                  options={[
                    { id: true, title: "Active" },
                    { id: false, title: "Inactive" },
                  ]}
                />
              </Box>
            </Grid>
            <Grid item xs={5}></Grid>
          </Grid>
        </Box>

        <Scrollbar>
          <TableContainer sx={{ minWidth: 1500 }}>
            <Table>
              <UserListHead headLabel={TABLE_HEAD} />
              <TableBody>
                {searchResults.search.length <= 3 ? (
                  <>
                    {roleSelect ? (
                      <>
                        {userList !== undefined ? (
                          <>
                            {userList?.data?.map((usersearch, index) => (
                              <TableRow hover tabIndex={-1} key={index}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell
                                  component="th"
                                  scope="row"
                                  align="left"
                                >
                                  <Typography variant="subtitle2" noWrap>
                                    {usersearch?.user_name?.first_name +
                                      " " +
                                      usersearch?.user_name?.middle_name +
                                      " " +
                                      usersearch?.user_name?.last_name}
                                  </Typography>
                                </TableCell>
                                <TableCell align="left">
                                  {usersearch?.user_name?.phone_number}
                                </TableCell>
                                <TableCell align="left">
                                  {usersearch?.user_name?.email}
                                </TableCell>
                                <TableCell align="left">
                                  {usersearch?.role_name?.role_name_value}
                                </TableCell>
                                {/* <TableCell align="left">
                                  {usersearch?.company_area?.company_area}
                                </TableCell> */}
                                <TableCell align="left">
                                  {usersearch?.company_area?.map((area, index) => (
                                    <div key={index}>
                                      {area.company_area}
                                    </div>
                                  ))}
                                </TableCell>
                                <TableCell align="left">
                                  {usersearch.executive_level?.user_name === null
                                    ? ""
                                    : usersearch?.executive_level?.user_name
                                      ?.first_name +
                                    " " +
                                    usersearch?.executive_level?.user_name
                                      ?.middle_name +
                                    " " +
                                    usersearch?.executive_level?.user_name
                                      ?.last_name}
                                </TableCell>
                                {/* <TableCell align="left">
                                  {usersearch?.division_name?.division_name ===
                                    null
                                    ? ""
                                    : usersearch?.division_name?.division_name}
                                </TableCell> */}
                                <TableCell align="left">
                                  {usersearch?.division_name?.map((division, index) => (
                                    <div key={index}>
                                      {division.division_name}
                                    </div>
                                  ))}
                                </TableCell>
                                <TableCell align="left">
                                  {usersearch?.role_name?.role_name?.role_name ===
                                    "admin" ? (
                                    "Active"
                                  ) : (
                                    <select
                                      onChange={(e) =>
                                        handleChangeStatus(e, usersearch)
                                      }
                                      defaultValue={
                                        usersearch?.user_name?.is_active
                                      }
                                      className="select-styles"
                                    >
                                      <option value={true}>Active</option>
                                      <option value={false}>Inactive</option>
                                    </select>
                                  )}
                                </TableCell>
                                <TableCell align="left">
                                  {usersearch.is_tp_locked === false ? (
                                    <>
                                      <IconButton
                                        color={'primary'}
                                        sx={{ width: 40, height: 40, mt: 0.75 }}
                                        onClick={() => { setSelectedId(usersearch.id); handleClickOpen(usersearch.id); }}
                                      >
                                        <Badge>
                                          <Iconify icon="dashicons:unlock" />
                                        </Badge>
                                      </IconButton>
                                    </>
                                  ) : (
                                    <>
                                      <IconButton
                                        color={'error'}
                                        sx={{ width: 40, height: 40, mt: 0.75 }}
                                        onClick={() => { setSelectedId(usersearch.id); handleClickOpen(usersearch.id); }}
                                      >
                                        <Badge>
                                          <Iconify icon="material-symbols:lock" />
                                        </Badge>
                                      </IconButton>
                                      <Dialog
                                        fullScreen={fullScreen}
                                        open={openDialogues[usersearch.id] || false}
                                        onClose={() => handleClose(usersearch.id)}
                                        aria-labelledby="responsive-dialog-title"
                                      >
                                        <DialogTitle id="responsive-dialog-title">
                                          {"Do you want to unlock this usersearch?"}
                                        </DialogTitle>
                                        <DialogActions>
                                          <Button
                                            autoFocus
                                            onClick={() => usersearchLocks({ usersearchId: usersearch.id, isTpLocked: usersearch.is_tp_locked })}
                                          >
                                            Yes
                                          </Button>
                                          <Button
                                            onClick={() => handleClose(usersearch.id)}
                                            autoFocus
                                          >
                                            No
                                          </Button>
                                        </DialogActions>
                                      </Dialog>
                                    </>
                                  )}
                                </TableCell>
                                <TableCell align="left">
                                  {usersearch?.role_name.role_name === "admin" ? <>
                                    <IconButton color={'primary'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={() => UserLogin(usersearch)}>
                                      <Badge>
                                        <Iconify icon="ic:sharp-login" />
                                      </Badge>
                                    </IconButton>
                                  </> : <></>}
                                  <IconButton
                                    color={"primary"}
                                    sx={{ width: 40, height: 40, mt: 0.75 }}
                                    onClick={(e) => onEdit(usersearch.id)}
                                  >
                                    <Badge>
                                      <Iconify icon="eva:edit-fill" />
                                    </Badge>
                                  </IconButton>
                                  {/* <IconButton
                                    color={"error"}
                                    sx={{ width: 40, height: 40, mt: 0.75 }}
                                    onClick={() => {
                                      setSelectedId(usersearch.id);
                                      handleClickOpen();
                                    }}
                                  >
                                    <Badge>
                                      <Iconify icon="eva:trash-2-outline" />
                                    </Badge>
                                  </IconButton> */}
                                </TableCell>
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
                                    <Button
                                      autoFocus
                                      onClick={() => {
                                        deleteUser(selectedId);
                                        handleClose();
                                      }}
                                    >
                                      Yes
                                    </Button>
                                    <Button onClick={handleClose} autoFocus>
                                      No
                                    </Button>
                                  </DialogActions>
                                </Dialog>
                              </TableRow>
                            ))}
                          </>
                        ) : null}
                      </>
                    ) : (
                      <DefaultUser
                        filterValue={filterValue}
                        handleChangeStatus={handleChangeStatus}
                        UserLogin={UserLogin}
                      />
                    )}
                  </>
                ) : (
                  <>
                    {results && results?.data?.length == 0 ? (
                      <>
                        <TableRow>
                          <TableCell align="center" colSpan={12} sx={{ py: 3 }}>
                            <Paper
                              sx={{
                                textAlign: "center",
                              }}
                            >
                              <Typography variant="h6" paragraph>
                                Not found
                              </Typography>
                              <Typography variant="body2">
                                <strong>Requested Data Not found</strong>.
                                <br /> Try checking for typos or using complete
                                words.
                              </Typography>
                            </Paper>
                          </TableCell>
                        </TableRow>
                      </>
                    ) : (
                      <>
                        {results &&
                          results?.data?.map((usersearch, index) => (
                            <TableRow hover tabIndex={-1} key={usersearch.id}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell
                                component="th"
                                scope="row"
                                align="left"
                              >
                                {/* <Stack direction="row" alignItems="center" spacing={2}> */}
                                <Typography variant="subtitle2" noWrap>
                                  {usersearch?.user_name?.first_name +
                                    " " +
                                    usersearch?.user_name?.middle_name +
                                    " " +
                                    usersearch?.user_name?.last_name}
                                </Typography>
                                {/* </Stack> */}
                              </TableCell>
                              <TableCell align="left">
                                {usersearch?.user_name?.phone_number}
                              </TableCell>
                              <TableCell align="left">
                                {usersearch?.user_name?.email}
                              </TableCell>
                              <TableCell align="left">
                                {usersearch?.role_name?.role_name_value}
                              </TableCell>
                              <TableCell align="left">
                                {usersearch?.company_area?.company_area}
                              </TableCell>
                              <TableCell align="left">
                                {usersearch.executive_level.user_name === null
                                  ? ""
                                  : usersearch?.executive_level?.user_name
                                    ?.first_name +
                                  " " +
                                  usersearch?.executive_level?.user_name
                                    ?.middle_name +
                                  " " +
                                  usersearch?.executive_level?.user_name
                                    ?.last_name}
                              </TableCell>
                              <TableCell align="left">
                                {usersearch?.division_name?.division_name === null
                                  ? ""
                                  : usersearch?.division_name?.division_name}
                              </TableCell>
                              <TableCell align="left">
                                {usersearch?.role_name?.role_name?.role_name ===
                                  "admin" ? (
                                  "Active"
                                ) : (
                                  <select
                                    onChange={(e) =>
                                      handleChangeStatus(e, usersearch)
                                    }
                                    defaultValue={
                                      usersearch?.user_name?.is_active
                                    }
                                    className="select-styles"
                                  >
                                    <option value={true}>Active</option>
                                    <option value={false}>Inactive</option>
                                  </select>
                                )}
                              </TableCell>
                              <TableCell align="left">
                                {usersearch.is_tp_locked === false ? (
                                  <>
                                    <IconButton
                                      color={'primary'}
                                      sx={{ width: 40, height: 40, mt: 0.75 }}
                                      onClick={() => { setSelectedId(usersearch.id); handleClickOpen(usersearch.id); }}
                                    >
                                      <Badge>
                                        <Iconify icon="dashicons:unlock" />
                                      </Badge>
                                    </IconButton>
                                  </>
                                ) : (
                                  <>
                                    <IconButton
                                      color={'error'}
                                      sx={{ width: 40, height: 40, mt: 0.75 }}
                                      onClick={() => { setSelectedId(usersearch.id); handleClickOpen(usersearch.id); }}
                                    >
                                      <Badge>
                                        <Iconify icon="material-symbols:lock" />
                                      </Badge>
                                    </IconButton>
                                    <Dialog
                                      fullScreen={fullScreen}
                                      open={openDialogues[usersearch.id] || false}
                                      onClose={() => handleClose(usersearch.id)}
                                      aria-labelledby="responsive-dialog-title"
                                    >
                                      <DialogTitle id="responsive-dialog-title">
                                        {"Do you want to unlock this usersearch?"}
                                      </DialogTitle>
                                      <DialogActions>
                                        <Button
                                          autoFocus
                                          onClick={() => usersearchLocks({ usersearchId: usersearch.id, isTpLocked: usersearch.is_tp_locked })}
                                        >
                                          Yes
                                        </Button>
                                        <Button
                                          onClick={() => handleClose(usersearch.id)}
                                          autoFocus
                                        >
                                          No
                                        </Button>
                                      </DialogActions>
                                    </Dialog>
                                  </>
                                )}
                              </TableCell>
                              <TableCell align="left">
                                {/* //!User Login */}
                                {usersearch?.user_name?.is_admin === false ? <>
                                  <IconButton color={'primary'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={() => UserLogin(usersearch)}>
                                    <Badge>
                                      <Iconify icon="ic:sharp-login" />
                                    </Badge>
                                  </IconButton>
                                </> : <></>}
                                <IconButton
                                  color={"primary"}
                                  sx={{ width: 40, height: 40, mt: 0.75 }}
                                  onClick={(e) => onEdit(usersearch.id)}
                                >
                                  <Badge>
                                    <Iconify icon="eva:edit-fill" />
                                  </Badge>
                                </IconButton>
                                {/* <IconButton
                                    color={"error"}
                                    sx={{ width: 40, height: 40, mt: 0.75 }}
                                    onClick={() => {
                                      setSelectedId(usersearch.id);
                                      handleClickOpen();
                                    }}
                                  >
                                    <Badge>
                                      <Iconify icon="eva:trash-2-outline" />
                                    </Badge>
                                  </IconButton> */}
                              </TableCell>
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
                                  <Button
                                    autoFocus
                                    onClick={() => {
                                      deleteUser(selectedId);
                                      handleClose();
                                    }}
                                  >
                                    Yes
                                  </Button>
                                  <Button onClick={handleClose} autoFocus>
                                    No
                                  </Button>
                                </DialogActions>
                              </Dialog>
                            </TableRow>
                          ))}
                        {/* //!pagination */}
                        <TableRow>
                          <TableCell colSpan={6}>
                            <Box
                              justifyContent="center"
                              alignItems="center"
                              display="flex"
                              margin="8px 0px"
                            >
                              {results && typeof results.count === 'number' ? (
                                <Pagination
                                  count={Math.max(1, Math.ceil(results.count / 200))}
                                  onChange={handleChangePage}
                                />
                              ) : (
                                <></>
                              )}
                            </Box>
                          </TableCell>
                        </TableRow>
                      </>
                    )}
                  </>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          {isDrawerOpen && (
            <EditUser idharu={selectedUpdateId} onClose={onCloseDrawer} />
          )}
        </Scrollbar>
        {
          ErrorMessage.show === true ? (
            <>
              <Grid>
                <Box className="messageContainer errorMessage">
                  <h1 style={{ fontSize: '14px', color: 'white' }}>{ErrorMessage.message}</h1>
                </Box>
              </Grid>
            </>
          ) : null
        }
        {
          SuccessMessage.show === true ? (
            <>
              <Grid>
                <Box className="messageContainer successMessage">
                  <h1 style={{ fontSize: '14px', color: 'white' }}>{SuccessMessage.message}</h1>
                </Box>
              </Grid>
            </>
          )
            : null
        }
      </Card>
    </>
  );
};
export default React.memo(UserSearch);
