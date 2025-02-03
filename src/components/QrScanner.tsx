'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Alert,
} from '@mui/material';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import { Scanner } from '@yudiel/react-qr-scanner';
import { IDetectedBarcode } from '@yudiel/react-qr-scanner';


const parseEthereumQR = (qrCode: string) => {
  try {
    const regex =
      /^ethereum:([^@?]+)(?:@(\d+))?(?:\/transfer\?address=([^&]+)&uint256=([\de]+))?(?:\?value=([\de]+))?/;
    const match = qrCode.match(regex);

    if (!match) {
      // Case 4: Raw Ethereum address
      const walletRegex = /^0x[a-fA-F0-9]{40}$/;
      if (walletRegex.test(qrCode)) {
        return { tokenContract: null, address: qrCode, chainId: 'N/A', value: '0' };
      }
      throw new Error('Invalid Ethereum QR format');
    }

    const tokenOrRecipient = match[1] || null;
    const chainId = match[2] || 'N/A';
    const recipientAddress = match[3] || tokenOrRecipient; // If no transfer, use main address
    const value = match[4] || match[5] || '0';

    // Convert scientific notation (e.g., 2e18) to decimal format
    const decimalValue = parseFloat(value).toFixed(18).replace(/\.?0+$/, '');
    const LastValue = parseFloat(decimalValue) * Math.pow(10,-18)
    

    // If it's a transfer case (Case 1), treat ethereum: as token contract
    const isTransfer = !!match[3];

    return {
      tokenContract: isTransfer ? tokenOrRecipient : null,
      address: recipientAddress,
      chainId,
      value: LastValue,
    };
  } catch {
    throw new Error('Failed to parse QR code');
  }
};


const QRScanner: React.FC<{ onScanSuccess: (tokenContract: string | null, address: string, value: string) => void }> = ({ onScanSuccess }) => {
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleScan = (detectedCodes: IDetectedBarcode[]) => {
    if (detectedCodes.length > 0) {
      const data = detectedCodes[0].rawValue;
      if (data) {
        try {
          const parsedData = parseEthereumQR(data);
          onScanSuccess(parsedData.tokenContract, parsedData.address, parsedData.value);
          setErrorMessage(null);
          setOpen(false); // Close scanner on success
        } catch (error: unknown) {
          setErrorMessage((error as Error).message);
        }
      }
    }
  };

  return (
    <Box>
      <Button variant="contained" onClick={() => setOpen(true)}>
        <QrCodeScannerIcon />
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Scan Ethereum QR</DialogTitle>
        <DialogContent>
          <Scanner onScan={handleScan} onError={(error) => setErrorMessage(error.message)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
    </Box>
  );
};

export default QRScanner;

