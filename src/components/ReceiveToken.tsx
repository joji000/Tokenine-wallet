import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Box,
  Typography,
  TextField,
  Card,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Avatar,
  Stack,
  Snackbar,
  Alert,
  InputAdornment,
  IconButton
} from '@mui/material';
import QRCode from 'qrcode';
import Image from 'next/image';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Token } from '@/interfaces/token.interface'; 
import { fetchTokens } from '@/services/token.services';

interface ReceiveTokenProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
  balance: string;
}

const ReceiveToken: React.FC<ReceiveTokenProps> = ({ user, balance }) => {
  const walletCanvasRef = useRef<HTMLCanvasElement>(null);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [amount, setAmount] = useState('');
  const [token, setToken] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [qrCodeGenerated, setQrCodeGenerated] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error' | 'info'>('info');

  const fetchTokensCallback = useCallback(async () => {
    if (!user?.walletAddress) return;

    const tokensData = await fetchTokens(user.walletAddress, balance);
    setTokens(tokensData);
  }, [user?.walletAddress, balance]);

  useEffect(() => {
    fetchTokensCallback();
  }, [fetchTokensCallback]);

  useEffect(() => {
    if (user?.walletAddress && walletCanvasRef.current) {
      QRCode.toCanvas(walletCanvasRef.current, user.walletAddress, { width: 200 }, (error) => {
        if (error) console.error(error);
      });
    }
  }, [user?.walletAddress]);

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setQrCodeGenerated(false);
    setQrCodeUrl(null);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (value >= 0) {
      setAmount(e.target.value);
    } else {
      setAmount('');
    }
  };

  const handleGenerateQrCode = () => {
    if (!token) {
      setAlertType('error');
      setAlertMessage('Please select a token.');
      setSnackbarOpen(true);
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setAlertType('error');
      setAlertMessage('Please input a valid amount.');
      setSnackbarOpen(true);
      return;
    }

    if (user?.walletAddress) {
      let paymentRequest = '';
      if (token === '0x0000000000000000000000000000000000000000') { // Native coin
        const amountInExponential = (parseFloat(amount) * Math.pow(10, 18)).toString();
        paymentRequest = `ethereum:${user.walletAddress}@7117?value=${amountInExponential}`;
      } else {
        const amountInExponential = (parseFloat(amount) * Math.pow(10, 18)).toString();
        paymentRequest = `ethereum:${token}@7117/transfer?address=${user.walletAddress}&uint256=${amountInExponential}`;
      }

      QRCode.toDataURL(paymentRequest, { width: 200 }, (error, url) => {
        if (error) {
          console.error(error);
        } else {
          setQrCodeUrl(url);
          setQrCodeGenerated(true);
        }
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setAlertType('success');
    setAlertMessage('Address copied to clipboard!');
    setSnackbarOpen(true);
  };

  return (
    <Box display="flex" flexDirection="column" gap={2}>
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
        <Typography variant="h6" gutterBottom>
          Receive Token
        </Typography>
        <Box
          component="form"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {/* Wallet Address */}
          <TextField
            label="Your Wallet Address"
            variant="outlined"
            fullWidth
            value={user?.walletAddress || ''}
            InputProps={{
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => copyToClipboard(user?.walletAddress || '')}>
                    <ContentCopyIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {/* Wallet QR Code */}
          {user?.walletAddress && (
            <Box display="flex" justifyContent="center" mt={2}>
              <canvas ref={walletCanvasRef} />
            </Box>
          )}
          {/* Payment Request Button */}
          <Button
            variant="contained"
            color="primary"
            onClick={handleDialogOpen}
          >
            Payment Request
          </Button>
        </Box>
      </Card>

      {/* QR Code Dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="xs" fullWidth sx={{textAlign: "center"}}>
        <DialogTitle >Payment Request</DialogTitle>
        <DialogContent>
          {!qrCodeGenerated ? (
            <Box display="flex" flexDirection="column" gap={2}>
              {/* Amount */}
              <TextField
                label="Amount"
                type="number"
                placeholder="0.0"
                variant="outlined"
                fullWidth
                value={amount}
                onChange={handleAmountChange}
              />
              {/* Token Selector */}
              <TextField
                select
                label="Token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                variant="outlined"
                fullWidth
              >
                {tokens.map((token) => (
                  <MenuItem key={token.address} value={token.address}>
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
              <Stack direction="row" spacing={2} justifyContent={'space-between'} >
                <Button onClick={handleDialogClose} variant="outlined" color="secondary" fullWidth>
                  Cancel
                </Button>
                <Button onClick={handleGenerateQrCode} variant="contained" color="primary" fullWidth>
                  Continue
                </Button>
              </Stack>
            </Box>
          ) : (
            <Box display="flex" justifyContent="center" flexDirection={'column'} gap={2} alignItems={'center'}>
              {qrCodeUrl && <Image src={qrCodeUrl} alt="Payment QR Code" width={200} height={200}/>}
              <Button onClick={handleDialogClose} variant="outlined" color="secondary" fullWidth>
                  Cancel
              </Button>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Snackbar Alert */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={alertType} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ReceiveToken;