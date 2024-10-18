import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { styled, alpha } from '@mui/material/styles';
import { Box, Drawer, Typography } from '@mui/material';
import useResponsive from '@/hooks/useResponsive';
import Scrollbar from '@/components/scrollbar';
import NavSection from '@/components/nav-section';
import navConfig from './config';
import MpoNavConfig from './mpoConfig';
import OtherRoleConfig from './otherRoleConfig';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { setCookie } from '../../../../reducers/cookieReducer';
import SuperAdminConfig from './SuperAdminConfig';


const NAV_WIDTH = 270;

const StyledAccount = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[500], 0.12),
}));

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

export default function Nav({ openNav, onCloseNav }) {
  const { company_id, user_role, company_user_id } = useSelector((state) => state.cookie);
  const [cookieData, setCookieData] = useState({
    User_id: sessionStorage.getItem('User_id') ? sessionStorage.getItem('User_id') : Cookies.get('User_id'),
    access: sessionStorage.getItem('access') ? sessionStorage.getItem('access') : Cookies.get('access'),
    refresh: sessionStorage.getItem('refresh') ? sessionStorage.getItem('refresh') : Cookies.get('refresh'),
    company_division_name: sessionStorage.getItem('company_division_name') ? sessionStorage.getItem('company_division_name') : Cookies.get('company_division_name'),
    company_id: sessionStorage.getItem('company_id') ? sessionStorage.getItem('company_id') : Cookies.get('company_id'),
    company_user_id: sessionStorage.getItem('company_user_id') ? sessionStorage.getItem('company_user_id') : Cookies.get('company_user_id'),
    company_user_role_id: sessionStorage.getItem('company_user_role_id') ? sessionStorage.getItem('company_user_role_id') : Cookies.get('company_user_role_id'),
    email: sessionStorage.getItem('email') ? sessionStorage.getItem('email') : Cookies.get('email'),
    is_highest_priority: sessionStorage.getItem('is_highest_priority') ? sessionStorage.getItem('is_highest_priority') : Cookies.get('is_highest_priority'),
    user_role: sessionStorage.getItem('user_role') ? sessionStorage.getItem('user_role') : Cookies.get('user_role'),
    role: sessionStorage.getItem('role') ? sessionStorage.getItem('role') : Cookies.get('role'),
    other: sessionStorage.getItem('other') ? sessionStorage.getItem('other') : Cookies.get('other'),
    otherRoles: sessionStorage.getItem('other-roles') ? sessionStorage.getItem('other-roles') : Cookies.get('other-roles'),
    OTPgmail: sessionStorage.getItem('OTPgmail') ? sessionStorage.getItem('OTPgmail') : Cookies.get('OTPgmail'),
    otp: sessionStorage.getItem('otp') ? sessionStorage.getItem('otp') : Cookies.get('otp'),
  });
  const roles = useSelector(state => state.cookie?.roles);

  useEffect(() => {
    const data = {
      User_id: sessionStorage.getItem('User_id') ? sessionStorage.getItem('User_id') : Cookies.get('User_id'),
      access: sessionStorage.getItem('access') ? sessionStorage.getItem('access') : Cookies.get('access'),
      refresh: sessionStorage.getItem('refresh') ? sessionStorage.getItem('refresh') : Cookies.get('refresh'),
      company_division_name: sessionStorage.getItem('company_division_name') ? sessionStorage.getItem('company_division_name') : Cookies.get('company_division_name'),
      company_id: sessionStorage.getItem('company_id') ? sessionStorage.getItem('company_id') : Cookies.get('company_id'),
      company_user_id: sessionStorage.getItem('company_user_id') ? sessionStorage.getItem('company_user_id') : Cookies.get('company_user_id'),
      company_user_role_id: sessionStorage.getItem('company_user_role_id') ? sessionStorage.getItem('company_user_role_id') : Cookies.get('company_user_role_id'),
      email: sessionStorage.getItem('email') ? sessionStorage.getItem('email') : Cookies.get('email'),
      is_highest_priority: sessionStorage.getItem('is_highest_priority') ? sessionStorage.getItem('is_highest_priority') : Cookies.get('is_highest_priority'),
      user_role: sessionStorage.getItem('user_role') ? sessionStorage.getItem('user_role') : Cookies.get('user_role'),
      role: sessionStorage.getItem('role') ? sessionStorage.getItem('role') : Cookies.get('role'),
      other: sessionStorage.getItem('other') ? sessionStorage.getItem('other') : Cookies.get('other'),
      otherRoles: sessionStorage.getItem('other-roles') ? sessionStorage.getItem('other-roles') : Cookies.get('other-roles'),
      OTPgmail: sessionStorage.getItem('OTPgmail') ? sessionStorage.getItem('OTPgmail') : Cookies.get('OTPgmail'),
      otp: sessionStorage.getItem('otp') ? sessionStorage.getItem('otp') : Cookies.get('otp'),
      company_area_id: sessionStorage.getItem('company_area_id') ? sessionStorage.getItem('company_area_id') : Cookies.get('company_area_id')
    }
    setCookieData(data);
  }, [roles]);

  const dispatch = useDispatch();
  useEffect(() => {
    if (cookieData) {
      dispatch(setCookie(cookieData));
    }
  }, [cookieData, dispatch, roles]);
  const { pathname } = useLocation();

  const isDesktop = useResponsive('up', 'lg');


  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
      }}
    >
      <Box sx={{ px: 1.5, py: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img src="/assets/ease.png" height='180px' width='180px' alt="Ease SFA Logo" />
        {/* <Typography style={{ fontSize: "20px", color: "black", fontWeight: '700', letterSpacing: '.7px', marginTop: '7px' }}>Ease SFA</Typography> */}
      </Box>
      {
        user_role === "admin" &&
        <NavSection data={SuperAdminConfig} />
      }
      {
        user_role === "admin" &&
        <NavSection data={navConfig} />
      }
      {
        user_role === "MPO" &&
        <NavSection data={MpoNavConfig} />
      }
      {
        user_role === "other-roles" &&
        <NavSection data={OtherRoleConfig} />
      }

      <Box sx={{ flexGrow: 1 }} />

    </Scrollbar>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV_WIDTH },
      }}
    >
      {isDesktop ? (
        <Drawer
          open
          variant="permanent"
          PaperProps={{
            sx: {
              width: NAV_WIDTH,
              flexShrink: 0,
              bgcolor: 'background.default',
              borderRightStyle: 'dashed',
            },
          }}
        >
          {renderContent}
        </Drawer>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: { width: NAV_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}
