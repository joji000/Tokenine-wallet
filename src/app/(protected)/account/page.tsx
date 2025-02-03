'use client';
import React from 'react';
import { Stack } from '@mui/material';
import TheMainLayout from '@/components/TheMainLayout';
import UserInfoForm from '@/components/UserInfo';
import AddressForm from '@/components/AddressForm';

const AccountPage = () => {

  return (
    <TheMainLayout>
      <Stack sx={{ p: 3 }} flexDirection={{ xs: 'column', md: 'row' }} gap={3}>      
          <UserInfoForm />
          <AddressForm />
      </Stack>
    </TheMainLayout>
  );
};

export default AccountPage;