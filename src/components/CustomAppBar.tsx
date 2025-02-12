import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  InputBase,
  IconButton,
  Box,
  useMediaQuery,
  Avatar
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';
import UserMenu from './UserMenu';
import QRScanner from './QrScanner';
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
  borderRadius: 0, 
}));

interface CustomAppBarProps {
  open: boolean;
  handleDrawerOpen: () => void;
}

const CustomAppBar = ({ open, handleDrawerOpen }: CustomAppBarProps) => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const [showScanner, setShowScanner] = useState(false);
  const router = useRouter();

  const handleQrScanSuccess = (scannedTokenContract: string | null, scannedAddress: string, scannedValue: string) => {
    if (scannedTokenContract) {
      console.log(`Scanned Token Contract: ${scannedTokenContract}`);
    }
    console.log(`Scanned Address: ${scannedAddress}`);
    console.log(`Scanned Value: ${scannedValue}`);
    
    // Navigate to /transfer with the scanned data
    router.push(`/transfer?tokenContract=${scannedTokenContract}&address=${scannedAddress}&value=${scannedValue}`);
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
        <IconButton sx ={{ ml: 1}}
        onClick={() => setShowScanner(!showScanner)} size='medium'>
          <Avatar 
            src='/icon/scanqricon.svg' 
            variant="square"
            sx={{ width:'2.3rem', height:'2.3rem' }}
          />
        </IconButton>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {!isMobile && <UserMenu />}
        </Box>
      </Toolbar>
      <QRScanner open={showScanner} setOpen={setShowScanner} onScanSuccess={handleQrScanSuccess} />
    </AppBarStyled>
  );
};

export default CustomAppBar;