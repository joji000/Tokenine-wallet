import React from 'react';
import { Card, CardContent, Typography, IconButton, Tooltip, Box, Avatar } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

interface BalanceCardProps {
  title: string;
  amount: string;
  walletAddress?: string | null;
  icon: string;
  setSnackbarOpen: (open: boolean) => void;
}

const CardInfo: React.FC<BalanceCardProps> = ({ title, amount, walletAddress, icon, setSnackbarOpen }) => {
  const formatBalance = (balance: string) => {
    const parsedBalance = parseFloat(balance);
    return parsedBalance % 1 === 0 ? parsedBalance.toString() : parsedBalance.toFixed(3);
  };

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSnackbarOpen(true);
  };

  return (
    <Card
      sx={{
        position: 'relative',
        padding: 2,
        borderRadius: 4,
        background: 'linear-gradient(135deg, #B01477 0%, #721F90 50%, #2C366C 100%)',
        color: 'white',
        width: '100%',
      }}
    >
      <Box sx={{ 
        position: 'absolute', 
        top: 8, 
        right: 8, 
        bgcolor: 'white', 
        p: 0.5, 
        borderRadius: 1,
      }}>
        <Avatar src={icon} variant='square' sx={{ width: 24, height: 24 }} />
      </Box>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography variant="body2" sx={{ fontWeight: 'light' }}>
          {title}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          {formatBalance(amount)} {title === 'Balance' && (
            <Typography variant="body1" component="span" sx={{ ml: 0.5 }}>
              XL3
            </Typography>
          )}
        </Typography>
        {walletAddress && (
          <Box display="flex" alignItems="center">
            <Typography variant="body2" sx={{ fontWeight: 'light', mr: 1 }}>
              {shortenAddress(walletAddress)}
            </Typography>
            <Tooltip title="Copy to clipboard">
              <IconButton
                size="small"
                sx={{ color: 'white' }}
                onClick={() => copyToClipboard(walletAddress)}
              >
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default CardInfo;