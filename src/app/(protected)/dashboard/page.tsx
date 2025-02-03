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
  Link,
  CircularProgress
} from '@mui/material';

import TheMainLayout from '@/components/TheMainLayout';
import useGetMe from '@/hooks/user/useGetMe';
import useGetBalance from '@/hooks/user/useGetBalance';

import { fetchTokens } from '@/services/token.services';
import { Token } from '@/interfaces/token.interface';

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
            <Card variant="outlined" sx={{ mb: 3, p: 2 }}>
              <Typography variant="h6">
                Wallet Information
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography>
                <strong>Wallet Address: </strong>
                <Link
                  href={`${process.env.NEXT_PUBLIC_EXP_BLOCKSCOUNT_URL}/address/${user?.walletAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {user?.walletAddress}
                </Link>
              </Typography>
              <Typography>
                <strong>Balance: </strong> {balance?.displayValue} XL3
              </Typography>
            </Card>

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
                        <TableCell sx={{ borderBottom: 2 }}><strong>Logo</strong></TableCell>
                        <TableCell sx={{ borderBottom: 2 }}><strong>Symbol</strong></TableCell>
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