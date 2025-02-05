'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  Typography,  
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Avatar, 
  CircularProgress,
  Stack,
  Tooltip,
  IconButton,
  Snackbar,
  Alert
} from '@mui/material';
import { useMediaQuery } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import MenuIcon from '@mui/icons-material/Menu';

import TheMainLayout from '@/components/TheMainLayout';
import useGetMe from '@/hooks/user/useGetMe';
import useGetBalance from '@/hooks/user/useGetBalance';

import { fetchTokens } from '@/services/token.services';
import { fetchTransactionData } from '@/services/transaction.services';
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
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [sendCount, setSendCount] = useState<number>(0);
  const [receiveCount, setReceiveCount] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const isMobile = useMediaQuery('(max-width:600px)');

  const fetchTokensCallback = useCallback(async () => {
    if (!user?.walletAddress) return;

    const tokensData = await fetchTokens(user.walletAddress);
    setTokens(tokensData);
    setLoadingTokens(false);
  }, [user?.walletAddress]);

  const fetchTransactionDataCallback = useCallback(async () => {
    if (!user?.walletAddress) return;

    const { sendCount, receiveCount, totalCount } = await fetchTransactionData(user.walletAddress);
    setSendCount(sendCount);
    setReceiveCount(receiveCount);
    setTotalCount(totalCount);
  }, [user?.walletAddress]);

  useEffect(() => {
    fetchTokensCallback();
    fetchTransactionDataCallback();
  }, [fetchTokensCallback, fetchTransactionDataCallback]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <TheMainLayout>
      <Box sx={{ p: 3 }}>
        {isUserLoading || isBalanceLoading ? (
          <CircularProgress />
        ) : (
          <>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} mb={2}>
              <CardInfo title='Balance' amount={`${balance?.displayValue} XL3`} walletAddress={user?.walletAddress} icon='/icon/balance-icon.svg' setSnackbarOpen={setSnackbarOpen} />
              <CardInfo title='Send' amount={`${sendCount} transactions`} icon='/icon/send-icon.svg' setSnackbarOpen={setSnackbarOpen} />
              <CardInfo title='Receive' amount={`${receiveCount} transactions`} icon='/icon/receive-icon.svg' setSnackbarOpen={setSnackbarOpen} />
              <CardInfo title='Total' amount={`${totalCount} transactions`} icon='/icon/transac-icon.svg' setSnackbarOpen={setSnackbarOpen} />
            </Stack>
            
            <Typography variant="h6" gutterBottom>
              Token Balances
            </Typography>

            {loadingTokens ? (
              <CircularProgress />
            ) : (
              <Box sx={{ width: '100%', overflowX: 'auto' }}>
                <TableContainer component={Paper} sx={{ boxShadow: 'none', backgroundColor: 'white', margin: 'auto' }}>
                  <Table sx={{ borderCollapse: 'collapse', minWidth: 650 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ borderBottom: 'none', fontWeight: 'light', fontSize: 'body2.fontSize' }}></TableCell>
                        <TableCell sx={{ borderBottom: 'none', fontWeight: 'light', fontSize: 'body2.fontSize' }}>Name</TableCell>
                        {!isMobile && (
                          <TableCell sx={{ borderBottom: 'none', fontWeight: 'light', fontSize: 'body2.fontSize' }}>Address</TableCell>
                        )}
                        <TableCell sx={{ borderBottom: 'none', fontWeight: 'light', fontSize: 'body2.fontSize' }}>Balance</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tokens.map((token, index) => (
                        <TableRow key={index}>
                          <TableCell sx={{ borderBottom: 'none' }}>
                            {token.logoURI ? <Avatar src={token.logoURI} alt={token.symbol} /> : 'N/A'}
                          </TableCell>
                          <TableCell sx={{ borderBottom: 'none', display: 'flex', alignItems: 'center' }}>
                            {token.symbol}
                            {isMobile && (
                              <Tooltip title={token.address}>
                                <IconButton
                                  size="small"
                                  onClick={() => copyToClipboard(token.address)}
                                >
                                  <MenuIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                          </TableCell>
                          {!isMobile && (
                            <TableCell sx={{ borderBottom: 'none' }}>
                              <Tooltip title="Copy to clipboard">
                                <Box display="flex" alignItems="center">
                                  <Typography variant="body2" sx={{ mr: 1 }}>
                                    {token.address}
                                  </Typography>
                                  <IconButton
                                    size="small"
                                    onClick={() => copyToClipboard(token.address)}
                                  >
                                    <ContentCopyIcon fontSize="small" />
                                  </IconButton>
                                </Box>
                              </Tooltip>
                            </TableCell>
                          )}
                          <TableCell sx={{ borderBottom: 'none', display: 'flex', alignItems: 'center' }}>
                            {token.value}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </>
        )}
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          Address copied to clipboard!
        </Alert>
      </Snackbar>
    </TheMainLayout>
  );
};

export default DashboardPage;