import React from 'react'
import Scrollbar from '../../../components/scrollbar/Scrollbar';
import Iconify from '../../../components/iconify/Iconify';
import PropTypes from 'prop-types';
import { set, sub } from 'date-fns';
import { noCase } from 'change-case';
import { faker } from '@faker-js/faker';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'
// @mui
import {
    Card,
    Box,
    List,
    Badge,
    Button,
    Avatar,
    Tooltip,
    Divider,
    Popover,
    Typography,
    IconButton,
    ListItemText,
    ListSubheader,
    ListItemAvatar,
    ListItemButton,
} from '@mui/material';
// utils
import { fToNow } from '@/utils/formatTime';
// components

//! notification slices
import { useGetNotificationListByIdQuery, usePatchNotificationListByIdMutation } from "../../../api/MPOSlices/notificationSlices";

const NOTIFICATIONS = [
    {
        id: faker.datatype.uuid(),
        title: 'Your order is placed',
        description: 'waiting for shipping',
        avatar: null,
        type: 'order_placed',
        createdAt: set(new Date(), { hours: 10, minutes: 30 }),
        isUnRead: true,
    },
    {
        id: faker.datatype.uuid(),
        title: faker.name.fullName(),
        description: 'answered to your comment on the Minimal',
        avatar: '/assets/images/avatars/avatar_2.jpg',
        type: 'friend_interactive',
        createdAt: sub(new Date(), { hours: 3, minutes: 30 }),
        isUnRead: true,
    },
    {
        id: faker.datatype.uuid(),
        title: 'You have new message',
        description: '5 unread messages',
        avatar: null,
        type: 'chat_message',
        createdAt: sub(new Date(), { days: 1, hours: 3, minutes: 30 }),
        isUnRead: false,
    },
    {
        id: faker.datatype.uuid(),
        title: 'You have new mail',
        description: 'sent from Guido Padberg',
        avatar: null,
        type: 'mail',
        createdAt: sub(new Date(), { days: 2, hours: 3, minutes: 30 }),
        isUnRead: false,
    },
    {
        id: faker.datatype.uuid(),
        title: 'Delivery processing',
        description: 'Your order is being shipped',
        avatar: null,
        type: 'order_shipped',
        createdAt: sub(new Date(), { days: 3, hours: 3, minutes: 30 }),
        isUnRead: false,
    },
];

export default function NotificationsPopover() {
    const [notifications, setNotifications] = useState(NOTIFICATIONS);

    // const totalUnRead = notifications.filter((item) => item.isUnRead === true).length;

    const [open, setOpen] = useState(null);

    const handleOpen = (event) => {
        setOpen(event.currentTarget);
    };

    const handleClose = () => {
        setOpen(null);
    };

    const handleMarkAllAsRead = () => {
        setNotifications(
            notifications.map((notification) => ({
                ...notification,
                isUnRead: false,
            }))
        );
    };

    const navigate = useNavigate();
    const Redirect = () => {
        navigate("/dashboard/admin/notification")
    }

    //! Notification
    const { data, isLoading, isError, error } = useGetNotificationListByIdQuery(Cookies.get('User_id'));
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

    const countFalseValues = data.reduce((count, obj) => count + (obj.is_read === false ? 1 : 0), 0);

    // Output the result
    



    return (
        <>
            <Card>
                <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1"><h2>Notifications</h2></Typography>
                        {/* <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            You have {countFalseValues} unread messages
                        </Typography> */}
                    </Box>

                    {/* {countFalseValues > 0 && (
                        <Tooltip title=" Mark all as read">
                            <IconButton color="primary" onClick={handleMarkAllAsRead}>
                                <Iconify icon="eva:done-all-fill" />
                            </IconButton>
                        </Tooltip>
                    )} */}
                </Box>

                <Divider sx={{ borderStyle: 'dashed' }} />

                <Scrollbar sx={{ height: { xs: 340, sm: 'auto' } }}>
                    <List
                        disablePadding
                    // subheader={
                    //     <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                    //         New
                    //     </ListSubheader>
                    // }
                    >
                        {data && data?.map((notification) => (
                            <NotificationItem key={notification.id} notification={notification} />
                        ))}
                    </List>

                    {/* <List
                        disablePadding
                        subheader={
                            <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                                Before that
                            </ListSubheader>
                        }
                    >
                        {notifications.slice(2, 5).map((notification) => (
                            <NotificationItem key={notification.id} notification={notification} />
                        ))}
                    </List> */}
                </Scrollbar>

                {/* <Divider sx={{ borderStyle: 'dashed' }} /> */}

                {/* <Box sx={{ p: 1 }}>
                    <Button fullWidth disableRipple onClick={Redirect}>
                        View All
                    </Button>
                </Box> */}
            </Card>
        </>
    );
}

// ----------------------------------------------------------------------

NotificationItem.propTypes = {
    notification: PropTypes.shape({
        created_date: PropTypes.instanceOf(Date),
        id: PropTypes.string,
        // isUnRead: PropTypes.bool,
        general_notification_title: PropTypes.string,
        general_notification_description: PropTypes.string,
        // type: PropTypes.string,
        general_notification_image: PropTypes.any,
    }),
};

function NotificationItem({ notification }) {
    const { avatar, title } = renderContent(notification);

    return (
        <ListItemButton
            sx={{
                py: 1.5,
                px: 2.5,
                mt: '5px',
                // ...(notification.isUnRead && {
                //     bgcolor: 'action.selected',
                // }),
            }}
        >
            <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'background.neutral' }}>{avatar}</Avatar>
            </ListItemAvatar>
            <ListItemText
                primary={
                    <Typography
                        variant="h1"
                        component="h2"
                        sx={{
                            fontSize: 100
                        }}
                    >
                        {title}
                    </Typography>
                }
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
                        {fToNow(notification.created_date)}
                    </Typography>
                }
            />
        </ListItemButton>
    );
}

// ----------------------------------------------------------------------

function renderContent(notification) {
    const title = (
        <Typography variant="subtitle2">
            {notification.general_notification_title}
            <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
                &nbsp; {noCase(notification.general_notification_description)}
            </Typography>
        </Typography>
    );

    // if (notification.type === 'order_placed') {
    //     return {
    //         avatar: <img alt={notification.title} @="/assets/icons/ic_notification_package.svg" />,
    //         title,
    //     };
    // }
    // if (notification.type === 'order_shipped') {
    //     return {
    //         avatar: <img alt={notification.title} @="/assets/icons/ic_notification_shipping.svg" />,
    //         title,
    //     };
    // }
    // if (notification.type === 'mail') {
    //     return {
    //         avatar: <img alt={notification.title} @="/assets/icons/ic_notification_mail.svg" />,
    //         title,
    //     };
    // }
    // if (notification.type === 'chat_message') {
    //     return {
    //         avatar: <img alt={notification.title} @="/assets/icons/ic_notification_chat.svg" />,
    //         title,
    //     };
    // }
    return {
        avatar: notification.general_notification_image ? <img alt={notification.general_notification_title} src={notification.general_notification_image} /> : null,
        title,
    };
}
