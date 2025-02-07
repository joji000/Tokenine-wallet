'use client'
import React, { useState } from 'react';
import {
  Tabs,
  Tab,
  Box
} from '@mui/material';

import useGetMe from '@/hooks/user/useGetMe';
import SendToken from '@/components/SendToken';
import ReceiveToken from '@/components/ReceiveToken';
import TheMainLayout from '@/components/TheMainLayout';

const TransferPage: React.FC = () => {
  const { data: user } = useGetMe();
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <TheMainLayout>
      <Box maxWidth={425} mx="auto" mt={4} sx={{ p: 1, border: '1px solid #ccc', borderRadius: 2 ,backgroundColor: '#fff'}}>
        <Tabs value={tabIndex} onChange={handleTabChange} centered variant="fullWidth">
          <Tab label="Send" />
          <Tab label="Receive" />
        </Tabs>
        {tabIndex === 0 && <SendToken user={user} />}
        {tabIndex === 1 && <ReceiveToken user={user} />}
      </Box>
    </TheMainLayout>
  );
};

export default TransferPage;