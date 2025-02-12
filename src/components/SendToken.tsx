import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
  Avatar,
  InputAdornment,
  Stack,
  IconButton,
  Snackbar
} from '@mui/material';
import QRScanner from '@/components/QrScanner';
import { fetchTokens } from '@/services/token.services';
import { transferTokens } from '@/services/transfer.services';
import { Token } from '@/interfaces/token.interface';
import { useSearchParams } from 'next/navigation';

interface SendTokenProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
  balance: string;
}

const SendToken: React.FC<SendTokenProps> = ({ user, balance }) => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [fromAccount, setFromAccount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [token, setToken] = useState('');
  const [tokenBalance, setTokenBalance] = useState('0');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error' | 'info'>('info');
  const [showScanner, setShowScanner] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const searchParams = useSearchParams();
  const tokenContract = searchParams?.get('tokenContract') || '';
  const address = searchParams?.get('address') || '';
  const value = searchParams?.get('value') || '';

  const fetchTokensCallback = useCallback(async () => {
    if (!user?.walletAddress) return;

    const tokensData = await fetchTokens(user.walletAddress, balance);
    setTokens(tokensData);
    setFromAccount(user.walletAddress);
  }, [user?.walletAddress,balance]);

  useEffect(() => {
    fetchTokensCallback();
  }, [fetchTokensCallback]);

  useEffect(() => {
    if (tokenContract && address && value && tokens.length > 0) {
      const getToken = tokens.find((t) => t.address.toLowerCase() === tokenContract.toLowerCase());
      setToken(getToken?.symbol || '');
      setTokenBalance(getToken?.value || '0');
      setToAccount(address);
      setAmount(value);

      const url = new URL(window.location.href);
      url.searchParams.delete('tokenContract');
      url.searchParams.delete('address');
      url.searchParams.delete('value');
      window.history.replaceState({}, '', url.toString());
    }
  }, [tokenContract, address, value, tokens]);



  const handleQrScanSuccess = (scannedTokenContract: string | null, scannedAddress: string, scannedValue: string) => {
    setToAccount(scannedAddress);
    setAmount(scannedValue);
    
    if (scannedTokenContract) {
      const matchedToken = tokens.find((t) => t.address.toLowerCase() === scannedTokenContract.toLowerCase());
      if (matchedToken) {
        setToken(matchedToken.symbol);
        setTokenBalance(matchedToken.value);
      }
    }
    setShowScanner(false);
  };

  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedToken = e.target.value;
    setToken(selectedToken);
    const selectedTokenData = tokens.find((t) => t.symbol === selectedToken);
    setTokenBalance(selectedTokenData ? selectedTokenData.value : '0');
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (value >= 0) {
      setAmount(e.target.value);
    } else {
      setAmount('');
    }
  };

  const handleSetMaxAmount = () => {
    setAmount(tokenBalance);
  };

  const handleContinue = () => {
    if (parseFloat(amount) <= 0 || parseFloat(amount) > parseFloat(tokenBalance)) {
      setAlertType('error');
      setAlertMessage('Invalid amount. Check your balance and try again.');
      setSnackbarOpen(true);
      return;
    }

    // Validate address
    const walletRegex = /^0x[a-fA-F0-9]{40}$/;
    if (!walletRegex.test(toAccount)) {
      setAlertType('error');
      setAlertMessage('Invalid recipient address.');
      setSnackbarOpen(true);
      return;
    }

    setDialogOpen(true); 
  };

  const handleConfirmTransaction = async () => {
    setDialogOpen(false); 

    const selectedToken = tokens.find((t) => t.symbol === token);

    if (!selectedToken) {
      setAlertType('error');
      setAlertMessage('Token not found.');
      setSnackbarOpen(true);
      return;
    }

    try {
      await transferTokens(fromAccount, toAccount, selectedToken.address, amount);

      setAlertType('success');
      setAlertMessage(`Transaction sent: ${amount} ${token} from ${fromAccount} to ${toAccount}.`);
      setFromAccount(user?.walletAddress || '');
      setToAccount('');
      setAmount('');
      setToken('');
      setTokenBalance('');
      setSnackbarOpen(true);
    } catch (error: unknown) {
      console.error('Transaction failed:', (error as Error).message || error);
      setAlertType('error');
      setAlertMessage((error as Error).message || 'Transaction failed. Please try again.');
      setSnackbarOpen(true);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleAlertClose = () => {
    setSnackbarOpen(false);
    setAlertMessage('');
    setAlertType('info');
  };

  return (
    <>
      <Card
        variant='outlined'
        sx={{
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          border: 'none'
        }}
      >
        <Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
          <Typography variant="h6" gutterBottom>
            Send Token
          </Typography>

          {/* Token Balance */}
          <Typography variant="body2">
            Balance: {tokenBalance} {token}
          </Typography>
        </Stack>
        <Box
          component="form"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {/* From Account */}
          <TextField
            label="From"
            variant="outlined"
            fullWidth
            value={fromAccount}
            InputProps={{
              readOnly: true,
            }}
          />

          {/* To Account */}
          <TextField
            label="Recipient Address"
            placeholder="Recipient address"
            variant="outlined"
            fullWidth
            value={toAccount}
            onChange={(e) => setToAccount(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowScanner(!showScanner)} size='medium'>
                    <Avatar 
                      src='/icon/scanqricon.svg' 
                      variant="square"
                      sx={{ width:'2.3rem', height:'2.3rem' }}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <QRScanner open={showScanner} setOpen={setShowScanner} onScanSuccess={handleQrScanSuccess} />
          
          {/* Token Selector */}
          <TextField
            select
            label="Token"
            value={token}
            onChange={handleTokenChange}
            variant="outlined"
            fullWidth
          >
            {tokens.map((token) => (
              <MenuItem key={token.address} value={token.symbol}>
                <Box display="flex" alignItems="center" gap={1}>
                  {token.logoURI ? (
                    <Avatar src={token.logoURI} alt={token.symbol} />
                    ) : (
                    <Avatar sx={{ bgcolor: 'black', fontSize: '0.75rem' }}>
                      {token.symbol}
                    </Avatar>
                  )}
                  {token.symbol}
                </Box>
              </MenuItem>
            ))}
          </TextField>

          {/* Amount */}
          <Box display="flex" alignItems="center" gap={2}>
            <TextField
              label="Amount"
              type="number"
              placeholder="0.0"
              variant="outlined"
              fullWidth
              value={amount}
              onChange={handleAmountChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {token}
                    <Button variant="outlined" color="secondary" onClick={handleSetMaxAmount} sx={{ ml: 1 }}>
                      Max
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Buttons */}
          <Box display="flex" justifyContent="space-between" gap={2}>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={() => {
                setFromAccount(user?.walletAddress || '');
                setToAccount('');
                setAmount('');
                setToken('');
                setTokenBalance('');
              }}
            >
              Clear
            </Button>
            <Button variant="contained" color="primary" fullWidth onClick={handleContinue}>
              Continue
            </Button>
          </Box>
        </Box>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Confirm Transaction</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <strong>Amount:</strong> {amount} {token} <br />
            <strong>To:</strong> {toAccount} <br />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleConfirmTransaction} variant="contained" color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alert */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleAlertClose}
      >
        <Alert onClose={handleAlertClose} severity={alertType} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default SendToken;