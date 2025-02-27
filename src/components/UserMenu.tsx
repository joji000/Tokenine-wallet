import React, { useEffect, useState } from 'react';
import { Box, Button, Avatar, Typography, Menu, MenuItem } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { createClient } from '@/utils/supabase/client.util';
import useAuth from '@/hooks/auth/useAuth';
import { useRouter } from 'next/navigation';
import useGetMe from '@/hooks/user/useGetMe';
import { signOut } from 'next-auth/react';

const UserMenu = () => {
  const { isAuthenticated } = useAuth();
  const supabase = createClient();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const { data: user, isLoading } = useGetMe();
  const [displayName, setDisplayName] = useState('User');

  useEffect(() => {
    if (user) {
      const { firstName, lastName, email } = user;
      if (firstName && lastName) {
        setDisplayName(`${firstName} ${lastName}`);
      } else if (email) {
        setDisplayName(email.split('@')[0]);
      }
    }
  }, [user]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    await signOut();
    router.push('/');
  };

  if (isLoading || !isAuthenticated || !user) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Button onClick={handleMenu} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Avatar sx={{ bgcolor: '#1976d2', width: 48, height: 48, borderRadius: 1 }} variant="square">
          {user.email?.charAt(0).toUpperCase()}
        </Avatar>
        <Box sx={{ ml: 1, textAlign: 'left' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
            {displayName}
          </Typography>
          <Typography variant="caption" sx={{ color: 'gray' }}>{user.email}</Typography>
        </Box>
        <KeyboardArrowDownIcon />
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
      </Menu>
    </Box>
  );
};

export default UserMenu;