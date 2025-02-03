'use client'
import React, { useState } from 'react';
import {
  Tabs,
  Tab,
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
      <Tabs value={tabIndex} onChange={handleTabChange} aria-label="send and receive tabs">
        <Tab label="Send" />
        <Tab label="Receive" />
      </Tabs>
      {tabIndex === 0 && <SendToken user={user} />}
      {tabIndex === 1 && <ReceiveToken user={user} />}
    </TheMainLayout>
  );
};

export default TransferPage;