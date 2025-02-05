'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  Typography, 
  Divider, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Avatar, 
  Card,
  CircularProgress,
  Stack
} from '@mui/material';

import TheMainLayout from '@/components/TheMainLayout';
import useGetMe from '@/hooks/user/useGetMe';
import useGetBalance from '@/hooks/user/useGetBalance';

import { fetchTokens } from '@/services/token.services';
import { Token } from '@/interfaces/token.interface';
import CardInfo from '@/components/CardInfo';

const DashboardPage: React.FC = () => {
  const { data: user, isLoading: isUserLoading } = useGetMe();
  const { data: balance, isLoading: isBalanceLoading } = useGetBalance({
    options: {
      enabled: true,
    },
  });

  const [tokens, setTokens] = useState<Token[]>([]);
  const [loadingTokens, setLoadingTokens] = useState<boolean>(true);

  const fetchTokensCallback = useCallback(async () => {
    if (!user?.walletAddress) return;

    const tokensData = await fetchTokens(user.walletAddress);
    setTokens(tokensData);
    setLoadingTokens(false);
  }, [user?.walletAddress]);

  useEffect(() => {
    fetchTokensCallback();
  }, [fetchTokensCallback]);

  return (
    <TheMainLayout>
      <Box sx={{ p: 3 }}>
        {isUserLoading || isBalanceLoading ? (
          <CircularProgress />
        ) : (
          <>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1}>
              <CardInfo title='Balance' amount={`${balance?.displayValue} XL3`} walletAddress={user?.walletAddress} icon='/icon/balance-icon.svg' />
              <CardInfo title='Send' amount='200' icon='/icon/send-icon.svg' />
              <CardInfo title='Receive' amount='100' icon='/icon/receive-icon.svg' />
              <CardInfo title='Total' amount='300' icon='/icon/transac-icon.svg' />
            </Stack>
            <Card variant="outlined" sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Token Balances
              </Typography>
              <Divider sx={{ my: 1 }} />
              {loadingTokens ? (
                <CircularProgress />
              ) : (
                <TableContainer component={Paper} sx={{ boxShadow: 'none', backgroundColor: 'transparent' }}>
                  <Table sx={{ borderCollapse: 'collapse' }}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ borderBottom: 2 }}></TableCell>
                        <TableCell sx={{ borderBottom: 2 }}><strong>Name</strong></TableCell>
                        <TableCell sx={{ borderBottom: 2 }}><strong>Address</strong></TableCell>
                        <TableCell sx={{ borderBottom: 2 }}><strong>Balance</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tokens.map((token, index) => (
                        <TableRow key={index}>
                          <TableCell sx={{ borderBottom: 'none' }}>
                            {token.logoURI ? <Avatar src={token.logoURI} alt={token.symbol} /> : 'N/A'}
                          </TableCell>
                          <TableCell sx={{ borderBottom: 'none' }}>{token.symbol}</TableCell>
                          <TableCell sx={{ borderBottom: 'none' }}>{token.address}</TableCell>
                          <TableCell sx={{ borderBottom: 'none' }}>{token.value}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Card>
          </>
        )}
      </Box>
    </TheMainLayout>
  );
};

export default DashboardPage;