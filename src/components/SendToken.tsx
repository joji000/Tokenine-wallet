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
  InputAdornment
} from '@mui/material';
import QRScanner from '@/components/QrScanner'; // Adjust the import path as necessary
import { fetchTokens } from '@/services/token.services';
import { transferTokens } from '@/services/transfer.services';
import { Token } from '@/interfaces/token.interface';

interface SendTokenProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
}

const SendToken: React.FC<SendTokenProps> = ({ user }) => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [fromAccount, setFromAccount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [token, setToken] = useState('');
  const [tokenBalance, setTokenBalance] = useState('0');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error' | null>(null);

  const handleQrScanSuccess = (scannedTokenContract: string | null, scannedAddress: string, scannedValue: string) => {
    setToAccount(scannedAddress);
    setAmount(scannedValue);
    // If QR contains a token contract, match it to the correct token
    if (scannedTokenContract) {
      const matchedToken = tokens.find((t) => t.address.toLowerCase() === scannedTokenContract.toLowerCase());
      if (matchedToken) {
        setToken(matchedToken.symbol);
        setTokenBalance(matchedToken.value);
      }
    }
  };

  const fetchTokensCallback = useCallback(async () => {
    if (!user?.walletAddress) return;

    const tokensData = await fetchTokens(user.walletAddress);
    setTokens(tokensData);
    setFromAccount(user.walletAddress);
  }, [user?.walletAddress]);

  useEffect(() => {
    fetchTokensCallback();
  }, [fetchTokensCallback]);

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
      return;
    }

    // Validate address
    const walletRegex = /^0x[a-fA-F0-9]{40}$/;
    if (!walletRegex.test(toAccount)) {
      setAlertType('error');
      setAlertMessage('Invalid recipient address.');
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
      return;
    }

    try {
      
      await transferTokens(fromAccount, toAccount, selectedToken.address, amount);

      setAlertType('success');
      setAlertMessage(`Transaction sent: ${amount} ${token} from ${fromAccount} to ${toAccount}.`);
    } catch (error: unknown) {
      console.error('Transaction failed:', (error as Error).message || error);
      setAlertType('error');
      setAlertMessage((error as Error).message || 'Transaction failed. Please try again.');
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleAlertClose = () => {
    setAlertMessage('');
    setAlertType(null);
  };

  return (
    <>
      <Box display="flex" flexDirection="column" gap={2}>
        <Card
          variant="primaryGradient"
          sx={{
            p: 3,
            borderRadius: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Send Token
          </Typography>
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
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
            />

            {/* To Account */}
            <Box display="flex" alignItems="center" gap={2}>
              <TextField
                label="Recipient Address"
                placeholder="Recipient address"
                variant="outlined"
                fullWidth
                value={toAccount}
                onChange={(e) => setToAccount(e.target.value)}
              />
              <QRScanner onScanSuccess={handleQrScanSuccess}/>
            </Box>

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
                    {token.logoURI && (
                      <Avatar src={token.logoURI || undefined} alt={token.symbol} sx={{ width: 24, height: 24 }} />
                    )}
                    {token.symbol}
                  </Box>
                </MenuItem>
              ))}
            </TextField>

            {/* Token Balance */}
            <Typography variant="body2">
              Balance: {tokenBalance} {token}
            </Typography>

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
                slotProps={{
                  input: {
                    endAdornment: <InputAdornment position="end">{token}</InputAdornment>,
                  },
                }}
              />
              <Button variant="outlined" onClick={handleSetMaxAmount}>
                Max
              </Button>
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
      </Box>

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
      {alertMessage && (
        <Alert
          severity={alertType || 'info'}
          sx={{
            position: 'fixed',
            zIndex: 3,
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
          }}
          onClose={handleAlertClose}
        >
          {alertMessage}
        </Alert>
      )}
    </>
  );
};

export default SendToken;