'use client';
import React from 'react';
import { Typography, Box, Stack } from '@mui/material';
import CustomLoginButton from '@/components/CustomLoginButton';
import { createClient } from '@/utils/supabase/client.util';

const Home = () => {
  const supabase = createClient();

  const handleSignIn = async (provider) => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
      },
    });
  };

  return (
    <Box sx={{ height: '100vh', width: '100vw', display: 'flex' }}>
      <Stack direction={{ xs: 'column', md: 'row' }} sx={{ flex: 1 }}>
        {/* Left Section */}
        <Box
          sx={{
            flex: 1,
            backgroundImage: 'url(/BG-main.svg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 4,
            position: 'relative',
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }} mt="5rem">
            <Typography variant="h3" gutterBottom sx={{ fontSize: { xs: '2rem', md: '3rem' } }}>
              HELLO
            </Typography>
            <Typography
              variant="h4"
              fontWeight="bold"
              gutterBottom
              sx={{ fontSize: { xs: '1.5rem', md: '2.5rem' } }}
            >
              WELCOME BACK
            </Typography>
          </Box>
        </Box>

        {/* Right Section */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            bgcolor: 'white',
            padding: 4,
            gap: 2,
          }}
        >
          <Box
            component="img"
            src="/icon/tokenine-logo.svg"
            alt="TokenNine Logo"
            sx={{ width: { xs: '40vw', md: '20vw' }, mb: 2 }}
          />
          <Typography variant="h5" gutterBottom color="black">
            Sign in to your Account
          </Typography>
          <CustomLoginButton
            logo="/icon/google-logo.svg"
            text="Continue with Google"
            onClick={() => handleSignIn('google')}
          />
          <CustomLoginButton
            logo="/icon/apple-logo.svg"
            text="Continue with Apple"
            onClick={() => handleSignIn('apple')}
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default Home;
