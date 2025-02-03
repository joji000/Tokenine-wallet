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
  DialogActions,
  Avatar
} from '@mui/material';
import QRCode from 'qrcode';
import Image from 'next/image';
import { Token } from '@/interfaces/token.interface'; // Adjust the import path as necessary
import { fetchTokens } from '@/services/token.services'; // Adjust the import path as necessary

interface ReceiveTokenProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
}

const ReceiveToken: React.FC<ReceiveTokenProps> = ({ user }) => {
  const walletCanvasRef = useRef<HTMLCanvasElement>(null);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [amount, setAmount] = useState('');
  const [token, setToken] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [qrCodeGenerated, setQrCodeGenerated] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  const fetchTokensCallback = useCallback(async () => {
    if (!user?.walletAddress) return;

    const tokensData = await fetchTokens(user.walletAddress);
    setTokens(tokensData);
  }, [user?.walletAddress]);

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

  const handleGenerateQrCode = () => {
    console.log('handleGenerateQrCode called'); // Debugging line
    console.log('user.walletAddress:', user?.walletAddress); // Debugging line
    if (user?.walletAddress) {
      const amountInExponential = (parseFloat(amount) * Math.pow(10, 18));
      const paymentRequest = `ethereum:${user.walletAddress}?value=${amountInExponential}&token=${token}`;
      console.log('Generating QR code for:', paymentRequest); // Debugging line
      QRCode.toDataURL(paymentRequest, { width: 200 }, (error, url) => {
        if (error) {
          console.error(error);
        } else {
          console.log('QR code generated successfully'); // Debugging line
          setQrCodeUrl(url);
          setQrCodeGenerated(true);
        }
      });
    }
  };

  return (
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
            slotProps={{
              input: {
                readOnly: true,
              },
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
      <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Payment Request</DialogTitle>
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
                onChange={(e) => setAmount(e.target.value)}
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
                      {token.logoURI && (
                        <Avatar src={token.logoURI || undefined} alt={token.symbol} sx={{ width: 24, height: 24 }} />
                      )}
                      {token.symbol}
                    </Box>
                  </MenuItem>
                ))}
              </TextField>
              <Button onClick={handleGenerateQrCode} color="primary">
                Continue
              </Button>
            </Box>
          ) : (
            <Box display="flex" justifyContent="center" mt={2}>
              {qrCodeUrl && <Image src={qrCodeUrl} alt="Payment QR Code" width={200} height={200}/>}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReceiveToken;