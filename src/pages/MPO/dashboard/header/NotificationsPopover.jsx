import React from 'react'
import PropTypes from 'prop-types';
import { noCase } from 'change-case';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  List,
  Button,
  Avatar,
  Tooltip,
  Divider,
  Popover,
  Typography,
  IconButton,
  ListItemText,
  ListItemAvatar,
  ListItemButton,
} from '@mui/material';
import { fToNow } from '@/utils/formatTime';
import Iconify from '@/components/iconify/Iconify';
import Scrollbar from '@/components/scrollbar/Scrollbar'
import { useSelector } from 'react-redux';

//! notification slices
import { useGetNotificationListByIdQuery, usePatchNotificationListByIdMutation } from "../../../../api/MPOSlices/notificationSlices";

export default function NotificationsPopover() {

  const { User_id, company_id, user_role, company_user_id } = useSelector((state) => state.cookie);

  const [notifications, setNotifications] = useState();

  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const navigate = useNavigate();
  const Redirect = () => {
    navigate("admin/notification")
  }

  //! Notification
  const { data, isLoading, isError, error } = useGetNotificationListByIdQuery(User_id);
  const [NotificationData] = usePatchNotificationListByIdMutation();

  const [Show, setShow] = useState(true);

  if (isLoading) {
    return (
      <div style={{ flex: 1 }}>
        <Typography>Loading...</Typography>
      </div>
    );
  }

  if (isError) {
    return (
      <div style={{ flex: 1 }}>
        <Typography>Error: {error.message}</Typography>
      </div>
    );
  }

  const countFalseValues = data?.reduce((count, obj) => count + (obj.is_read === false ? 1 : 0), 0);


  return (
    <>
      {/* {user_role === 'admin' && */}
      <Tooltip title="Chat" arrow>
        <Link to={'/dashboard/admin/chat'}>
          <IconButton color={open ? 'primary' : 'default'} sx={{ width: 40, height: 40 }}>
            <Iconify icon="fluent:chat-12-filled" />
          </IconButton>
        </Link>
      </Tooltip>
      {/* } */}

      <Tooltip title="Notifications" arrow>
        <IconButton color={open ? 'primary' : 'default'} onClick={handleOpen} sx={{ width: 40, height: 40 }}>
          <Iconify icon="eva:bell-fill" />
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
            mt: 1.5,
            ml: 0.75,
            width: 360,
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Notifications</Typography>
          </Box>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Scrollbar sx={{ height: { xs: 340, sm: 'auto' } }}>
          <List disablePadding>
            {data?.slice(0, 2).map((notification) => (
              <NotificationItem
                key={String(notification.id)}
                notification={{ ...notification, id: String(notification.id) }}
              />
            ))}
          </List>
        </Scrollbar>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box sx={{ p: 1 }}>
          <Button fullWidth disableRipple onClick={Redirect}>
            View All
          </Button>
        </Box>
      </Popover>
    </>
  );
}

NotificationItem.propTypes = {
  notification: PropTypes.shape({
    created_date: PropTypes.instanceOf(Date),
    id: PropTypes.string,
    notification_title: PropTypes.string,
    notification_description: PropTypes.string,
    // general_notification_image: PropTypes.any,
  }),
};

function NotificationItem({ notification }) {
  const { avatar, title } = renderContent(notification);

  return (
    <ListItemButton
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        ...(notification.isUnRead && {
          bgcolor: 'action.selected',
        }),
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: 'background.neutral' }}>{avatar}</Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={title}
        secondary={
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              display: 'flex',
              alignItems: 'center',
              color: 'text.disabled',
            }}
          >
            <Iconify icon="eva:clock-outline" sx={{ mr: 0.5, width: 16, height: 16 }} />
            {fToNow(notification.created_at)}
          </Typography>
        }
      />
    </ListItemButton>
  );
}

function renderContent(notification) {
  const title = (
    <Typography variant="subtitle2">
      {notification.notification_title}
      <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
        &nbsp; {noCase(notification.notification_description)}
      </Typography>
    </Typography>
  );

  return {
    avatar: notification.notification_image ? <img alt={notification.notification_title} src={notification.notification_image} /> : null,
    title,
  };
}
