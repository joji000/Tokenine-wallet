import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  InputBase,
  Avatar,
  Typography,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Box
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';
import { createClient } from '@/utils/supabase/client.util';
import useAuth from '@/hooks/auth/useAuth';
import { useRouter } from 'next/navigation';

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
  borderRadius:0,
}));

interface CustomAppBarProps {
  open: boolean;
  handleDrawerOpen: () => void;
}

const CustomAppBar = ({ open, handleDrawerOpen }: CustomAppBarProps) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const supabase = createClient();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

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
          {isLoading ? (
            <Avatar />
          ) : (
            isAuthenticated && user && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button onClick={handleMenu} sx={{ textTransform: 'none' }}>
                  <Avatar sx={{ bgcolor: '#1976d2' }}>{user.email?.charAt(0).toUpperCase()}</Avatar>
                  <Box sx={{ ml: 1 }}>
                    <Typography variant="subtitle1">{user.email}</Typography>
                  </Box>
                </Button>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                  <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
                </Menu>
              </Box>
            )
          )}
        </Box>
      </Toolbar>
    </AppBarStyled>
  );
};

export default CustomAppBar;