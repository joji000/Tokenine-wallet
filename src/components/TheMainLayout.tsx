import React, { useState } from 'react';
import {
  Box,
  CssBaseline,
  Drawer,
  Divider,
  List,
  ListItemIcon,
  ListItemText,
  IconButton,
  ListItemButton,
  useMediaQuery,
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import Image from 'next/image';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import CustomAppBar from './CustomAppBar';
import UserMenu from './UserMenu';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'space-between',
}));

interface TheMainLayoutProps {
  children: React.ReactNode;
}

const TheMainLayout = ({ children }: TheMainLayoutProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const pathname = usePathname();
  const [open, setOpen] = useState(!isMobile);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const drawer = (
    <div>
      <DrawerHeader>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Image src="/icon/tokenine-logo-h.svg" alt="TokenNine Logo" width={180} height={50} />
        </Box>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        {[
          { text: 'Dashboard', icon: <DashboardIcon />, link: '/dashboard' },
          { text: 'Account', icon: <AccountCircleIcon />, link: '/account' },
          { text: 'Send & Receive', icon: <SwapHorizIcon />, link: '/transfer' },
        ].map((item, index) => (
          <ListItemButton
            key={index}
            component={NextLink}
            href={item.link}
            selected={pathname === item.link}
            sx={{
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
                '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                  background: 'linear-gradient(45deg, #B01477, #721F90, #2C366C)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                },
                '& .MuiSvgIcon-root': {
                  fill: 'url(#gradient1)',
                },
              },
              '&.Mui-selected': {
                backgroundColor: theme.palette.action.selected,
                '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                  background: 'linear-gradient(45deg, #B01477, #721F90, #2C366C)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                },
                '& .MuiSvgIcon-root': {
                  fill: 'url(#gradient1)',
                },
                '&:hover': {
                  backgroundColor: theme.palette.action.selected,
                },
              },
            }}
          >
            <ListItemIcon>
              <svg width="0" height="0">
                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#B01477', stopOpacity: 1 }} />
                  <stop offset="50%" style={{ stopColor: '#721F90', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#2C366C', stopOpacity: 1 }} />
                </linearGradient>
              </svg>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <CustomAppBar open={open} handleDrawerOpen={handleDrawerOpen} />
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRadius: 0,
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        {drawer}
        {isMobile && (
            <UserMenu />
        )}
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        {children}
      </Main>
    </Box>
  );
};

export default TheMainLayout;