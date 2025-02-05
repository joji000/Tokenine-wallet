import React from 'react';
import {
  AppBar,
  Toolbar,
  InputBase,
  IconButton,
  Box,
  useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';
import UserMenu from './UserMenu';

const drawerWidth = 240;

const AppBarStyled = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<{
  open?: boolean;
}>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
  backgroundColor: 'white',
  borderRadius: 0, 
}));

interface CustomAppBarProps {
  open: boolean;
  handleDrawerOpen: () => void;
}

const CustomAppBar = ({ open, handleDrawerOpen }: CustomAppBarProps) => {
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <AppBarStyled position="fixed" open={open}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          sx={{ mr: 2, ...(open && { display: 'none' }) }}
        >
          <MenuIcon />
        </IconButton>
        <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#f1f1f1', borderRadius: 1, px: 2 }}>
          <SearchIcon sx={{ color: 'gray' }} />
          <InputBase placeholder="Search" sx={{ ml: 1 }} />
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {!isMobile && <UserMenu />}
        </Box>
      </Toolbar>
    </AppBarStyled>
  );
};

export default CustomAppBar;