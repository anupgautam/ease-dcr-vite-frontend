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
import { useGetUsersByIdQuery } from '../../../../api/MPOSlices/UserSlice'

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
  //! LogOut
  const navigate = useNavigate();

  const settings = () => {
    navigate('/dashboard/settings/admin/companyareas')
  }
  const reDirectChangePwd = () => {
    navigate('/dashboard/admin/changepassword')
  }
  const reDirectProfile = () => {
    navigate('/dashboard/admin/profile')
  }


  const [Message, setMessage] = useState({ show: false, message: '' })
  const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' })
  const [success, setSuccess] = useState(false)

  const refreshToken = Cookies.get('refresh')
  // 
  const logOut = async (e) => {
    try {
      setSuccess(true);
      setSuccessMessage({ show: true, message: 'Successfully Logged Out' });
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
      navigate("/")

    }
    catch (err) {
      setMessage({ show: true, message: "Logout Failed" });
    }
  }
  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  //! Dialogue
  const [openDialogue, setOpenDialogue] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleClickOpenDialogue = () => {
    setOpenDialogue(true)
  }

  const handleCloseDialogue = () => {
    setOpenDialogue(false)
  }
  const userName = useGetUsersByIdQuery(Cookies.get('company_user_role_id'))

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
          <Avatar src={account.photoURL} alt="photoURL" />
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
            width: 200,
            '& .MuiMenuItem-root': {
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>

          <Typography variant="subtitle2" noWrap>
            {userName?.data?.user_name?.first_name + " " +userName?.data?.user_name?.last_name }
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {userName?.data?.user_name?.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />
        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={reDirectProfile} sx={{ m: 1 }}>
          <ListItemIcon>
            <Icon icon="iconamoon:profile-circle-fill" />
          </ListItemIcon>
          Profile
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
