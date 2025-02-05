import React from 'react';
import { Card, CardContent, Typography, Box, Avatar } from '@mui/material';

interface BalanceCardProps {
  title: string;
  amount: string;
  walletAddress?: string | null;
  icon: string;
}

const CardInfo: React.FC<BalanceCardProps> = ({ title, amount, walletAddress, icon }) => {
  return (
    <Card
      sx={{
        position: 'relative',
        padding: 2,
        borderRadius: 2,
        background: 'linear-gradient(135deg, #B01477 0%, #721F90 50%, #2C366C 100%)',
        color: 'white',
        minWidth: 260,
      }}
    >
      <Box sx={{ 
        position: 'absolute', 
        top: 8, 
        right: 8, 
        bgcolor: 'white', 
        p: 0.5 , 
        borderRadius: 1 ,}}>
        <Avatar src={icon} variant='square' sx={{ width: 24, height: 24}}/>
      </Box>
      <CardContent sx={{ display:'flex' ,flexDirection:'column' ,gap: 1  }}>
        <Typography variant="body2" sx={{ fontWeight: 'light' }}>
          {title}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          {amount}
        </Typography>
        {walletAddress && (
          <Typography variant="body2" sx={{ fontWeight: 'light' }}>
            {walletAddress}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default CardInfo;