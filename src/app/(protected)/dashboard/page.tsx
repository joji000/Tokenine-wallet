'use client';
import React from 'react';
import { Box, Typography, Paper, Grid, CircularProgress } from '@mui/material';
import TheMainLayout from '@/components/TheMainLayout';
import useAuth from '@/hooks/auth/useAuth';
import useGetBalance from '@/hooks/user/useGetBalance';

const DashboardPage = () => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { data: balanceData, isLoading: isBalanceLoading } = useGetBalance({
    options: { enabled: isAuthenticated },
  });

  return (
    <TheMainLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Welcome to TokenNine Dashboard
        </Typography>

        {isLoading ? (
          <CircularProgress />
        ) : (
          <Typography variant="h6">
            {isAuthenticated
              ? `Hello, ${user?.email}!`
              : 'You are not signed in.'}
          </Typography>
        )}

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">Account Balance</Typography>
              {isBalanceLoading ? (
                <CircularProgress />
              ) : (
                <Typography variant="h4" color="primary">
                  {balanceData?.displayValue || '0'} XL3
                </Typography>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">Recent Activity</Typography>
              <Typography>No recent activity found.</Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">Quick Links</Typography>
              <Typography>Transfer | Account Settings</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </TheMainLayout>
  );
};

export default DashboardPage;
