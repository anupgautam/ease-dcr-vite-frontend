import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie'
import { alpha } from '@mui/material/styles';
import { Grid, Box, Divider, Typography, MenuItem, Avatar, IconButton, Popover, Button, ListItemIcon, Tooltip } from '@mui/material';
import account from '@/_mock/account';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { Icon } from '@iconify/react';
import { useGetCompanyUserByIdQuery, useGetcompanyUserRolesByIdQuery } from '../../../../api/CompanySlices/companyUserRoleSlice';
import { useDispatch, useSelector } from 'react-redux';
import { clearCookie } from '../../../../reducers/cookieReducer';
import { useGetAllUsersWithoutPaginationByIdQuery, useGetUsersByIdQuery, useGetUserProfileByIdQuery, useUpdateUserProfileByIdMutation } from '../../../../api/MPOSlices/UserSlice';
import { toast } from 'react-toastify';

const MENU_OPTIONS = [
  {
    label: 'Home',
    icon: 'eva:home-fill',
  },
  {
    label: 'Profile',
    icon: 'eva:person-fill',
  },
  {
    label: 'Settings',
    icon: 'eva:settings-2-fill',
  },
];

export default function AccountPopover() {
  const { company_id, user_role, company_user_id, company_user_role_id } = useSelector((state) => state.cookie);
  //! LogOut
  const navigate = useNavigate();

  const userProfile = useGetUserProfileByIdQuery(company_user_role_id, {
    skip: !company_user_role_id
  })

  const [profilePicture] = useUpdateUserProfileByIdMutation()

  const settings = () => {
    navigate('/dashboard/settings/admin/companyareas')
  }
  const reDirectChangePwd = () => {
    navigate('/dashboard/admin/changepassword')
  }
  const reDirectProfile = () => {
    navigate('/dashboard/admin/profile')
  }

  const dispatch = useDispatch();

  const [Message, setMessage] = useState({ show: false, message: '' })
  const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' })
  const [success, setSuccess] = useState(false)

  const refreshToken = Cookies.get('refresh')

  // const {
  //   values,
  //   setValues,
  //   errors,
  //   setErrors,
  //   handleInputChange,
  //   handleImageUpload,
  //   resetForm,
  // } = useForm(initialFValues, true, validate);
  // 
  const logOut = async (e) => {
    try {
      setSuccess(true);
      setSuccessMessage({ show: true, message: 'Successfully Logged Out' });
      dispatch(clearCookie());
      Cookies.remove('access')
      Cookies.remove('refresh')
      Cookies.remove('user_role')
      Cookies.remove('email');
      Cookies.remove('User_id');
      Cookies.remove('company_id');
      Cookies.remove('company_user_id');
      Cookies.remove('company_user_role_id');
      Cookies.remove('company_division_name');
      Cookies.remove('role');
      Cookies.remove('is_highest_priority');
      Cookies.remove('company_area_id');
      navigate("/")

    }
    catch (err) {
      setMessage({ show: true, message: "Logout Failed" });
    }
  }

  const changeProfile = async (e) => {

    const formDataWithFile = new FormData();
    if (file) {
      formDataWithFile.append('profile_pic', file);
    } else if (formData.image) {
      formDataWithFile.append('profile_pic', formData.image);
    } else if (userProfile?.data?.profile_pic) {
      formDataWithFile.append('profile_pic', data.image);
    }
    formDataWithFile.append('id', company_user_role_id)
    try {
      const response = await profilePicture(formDataWithFile).unwrap();
      setOpenProfileDialogue(false)
      toast.success("Profile Picture updated")
    } catch (error) {
      toast.error("Profile Picture failed to upload.")
    }
  }
  const [open, setOpen] = useState(null);

  const [img, setImg] = useState(userProfile?.data?.profile_pic || null);
  const [file, setFile] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  //! Dialogue
  const [openDialogue, setOpenDialogue] = useState(false);
  const [openProfileDialogue, setOpenProfileDialogue] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleClickOpenDialogue = () => {
    setOpenDialogue(true)
  }

  const handleClickProfileDialogue = () => {
    setOpenProfileDialogue(true)
  }
  const handleCloseProfileDialogue = () => {
    setOpenProfileDialogue(false)
  }

  const handleCloseDialogue = () => {
    setOpenDialogue(false)
  }
  const userName = useGetUsersByIdQuery(company_user_id, {
    skip: !company_user_id
  })

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImg(selectedFile); // Store the file to show preview
    }
  };

  return (
    <>
      <Tooltip title="Profile" arrow>
        <IconButton
          onClick={handleOpen}
          sx={{
            p: 0,
            ...(open && {
              '&:before': {
                zIndex: 1,
                content: "''",
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                position: 'absolute',
                bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
              },
            }),
          }}
        >
          <Avatar src={userProfile?.data?.profile_pic} alt="Profile Picture" />
        </IconButton>
      </Tooltip>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1.5,
            ml: 0.75,
            width: 250,
            '& .MuiMenuItem-root': {
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>

          <Typography variant="subtitle2" noWrap>
            {userName?.data?.user_name?.first_name + " " + userName?.data?.user_name?.last_name}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {userName?.data?.user_name?.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />
        <Divider sx={{ borderStyle: 'dashed' }} />

        {/* <MenuItem onClick={reDirectProfile} sx={{ m: 1 }}>
          <ListItemIcon>
            <Icon icon="iconamoon:profile-circle-fill" />
          </ListItemIcon>
          Profile
        </MenuItem> */}

        <MenuItem onClick={(e) => handleClickProfileDialogue(e)} sx={{ m: 1 }}>
          <ListItemIcon>
            <Icon icon="iconamoon:profile-circle-fill" />
          </ListItemIcon>
          Change profile picture
        </MenuItem>
        <MenuItem onClick={reDirectChangePwd} sx={{ m: 1 }}>
          <ListItemIcon>
            <Icon icon="teenyicons:password-solid" />
          </ListItemIcon>
          Change Password
        </MenuItem>
        <MenuItem onClick={(e) => handleClickOpenDialogue(e)} sx={{ m: 1 }}>
          <ListItemIcon>
            <Icon icon="ic:sharp-logout" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Popover>

      <Dialog
        fullScreen={fullScreen}
        open={openDialogue}
        onClose={handleCloseDialogue}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Are you sure you want to Log Out?"}
        </DialogTitle>
        <DialogActions>
          <Button autoFocus onClick={(e) => { logOut(e); handleCloseDialogue() }}>
            Yes
          </Button>
          <Button
            onClick={handleCloseDialogue}
            autoFocus>
            No
          </Button>
        </DialogActions>
      </Dialog>
      {/*//! Profile Picture  */}
      <Dialog
        fullScreen={fullScreen}
        open={openProfileDialogue}
        onClose={handleCloseProfileDialogue}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Click to change profile picture"}
          <>
            {img &&
              <Avatar
                src={file ? URL.createObjectURL(img) : `${userProfile?.data?.profile_pic}`}
                alt={userProfile?.data?.profile_pic || "Profile Picture"}
                width={120}
                height={120}
                objectFit="cover"
              />
            }
            <div className="flex gap-x-2 cursor-pointer">
              <label className="flex items-center gap-2">
                <Icon icon="material-symbols:upload" width="50" height="50" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </>
        </DialogTitle>

        <DialogActions>
          <Button autoFocus onClick={(e) => { changeProfile(e); handleCloseProfileDialogue() }}>
            Yes
          </Button>
          <Button
            onClick={(e) => handleCloseProfileDialogue(e)}
            autoFocus>
            No
          </Button>
        </DialogActions>
      </Dialog>
      {
        Message.show === true ?
          <Grid>
            <Box style={{ position: 'fixed', padding: '.2rem', width: '30%', right: '1rem', top: '2rem', backgroundColor: 'red', borderRadius: '5px', paddingLeft: '1rem', paddingRight: '1rem' }}>
              <h1 style={{ fontSize: '14px', color: 'white' }}>{Message.message}</h1>
            </Box>
          </Grid> : <></>
      }
      {
        SuccessMessage.show === true ?
          <Grid>
            <Box style={{ position: 'fixed', padding: '.2rem', width: '30%', right: '1rem', top: '2rem', backgroundColor: 'green', borderRadius: '5px', paddingLeft: '1rem', paddingRight: '1rem' }}>
              <h1 style={{ fontSize: '14px', color: 'white' }}>{SuccessMessage.message}</h1>
            </Box>
          </Grid> : <></>
      }
    </>
  );
}
