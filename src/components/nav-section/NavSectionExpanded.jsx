import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { NavLink as RouterLink } from 'react-router-dom';
import { Box, List, ListItemText } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { StyledNavItem, StyledNavItemIcon } from './styles';

NavSectionExpanded.propTypes = {
    data: PropTypes.array,
};

export default function NavSectionExpanded({ data = [], ...other }) {
    return (
        <Box {...other}>
            <List disablePadding sx={{ p: 1 }}>
                {data.map((item) => (
                    <NavItem key={item.title} item={item} />
                ))}
            </List>
        </Box>
    );
}

NavItem.propTypes = {
    item: PropTypes.object,
};

function NavItem({ item }) {
    const { title, path, icon, info, children } = item;
    const [isExpanded, setIsExpanded] = useState(false);

    const handleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <>
            <StyledNavItem
                component={children ? 'div' : RouterLink}
                to={children ? '' : path}
                onClick={children ? handleExpand : undefined} // Only handle expand/collapse if there are children
                sx={{
                    '&.active': {
                        color: 'text.primary',
                        fontWeight: 'fontWeightBold',
                    },
                    cursor: children ? 'pointer' : 'default', // Change cursor only if there are children
                }}
            >
                <StyledNavItemIcon>{icon && icon}</StyledNavItemIcon>
                <ListItemText disableTypography primary={title} />
                {info && info}
                {children && (isExpanded ? <ExpandLess /> : <ExpandMore />)}
            </StyledNavItem>
            {isExpanded && children && (
                <List disablePadding sx={{ paddingLeft: '20px' }}>
                    {children.map((child) => (
                        <NavItem key={child.title} item={child} />
                    ))}
                </List>
            )}
        </>
    );
}
