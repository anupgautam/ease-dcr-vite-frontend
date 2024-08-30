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
import { useSelector } from 'react-redux';


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
  const roles = useSelector((state) => state.cookie?.roles);
// console.log(user_role,"user_roleuser_roleuser_roleuser_role");
// console.log(roles,"rolesrolesrolesrolesrolesrolesrolesrolesrolesrolesroles")
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
