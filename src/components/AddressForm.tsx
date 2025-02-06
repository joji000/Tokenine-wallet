/* eslint-disable @next/next/no-before-interactive-script-outside-document */
import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Card, Typography, Snackbar, Alert } from '@mui/material';
import Script from 'next/script';
import { updateAddress } from '@/services/updateAddress.services';
import useGetMe from '@/hooks/user/useGetMe';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jQuery: any;
  }
}

const AddressForm: React.FC = () => {
  const { data: user, isLoading } = useGetMe();
  const userId = user?.id;

  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [district, setDistrict] = useState('');
  const [province, setProvince] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  useEffect(() => {
    const initializeThailand = () => {
      if (typeof window !== 'undefined' && window.jQuery) {
        window.jQuery.Thailand({
          database: '/jquery.Thailand.js/database/db.json',
          $district: $('[name="district"]'),
          $amphoe: $('[name="province"]'),
          $province: $('[name="province"]'),
          $zipcode: $('[name="postalCode"]'),
        });

        $('[name="district"]').on('change', function() {
          setDistrict($(this).val() as string);
        });

        $('[name="province"]').on('change', function() {
          setProvince($(this).val() as string);
        });

        $('[name="postalCode"]').on('change', function() {
          setPostalCode($(this).val() as string);
        });
      }
    };

    initializeThailand();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!userId) {
      console.error('User ID is not available');
      return;
    }
    const formData = { userId, addressLine1, addressLine2, district, province, postalCode };
    try {
      const response = await updateAddress(formData);
      console.log('Data saved:', response);
      setSnackbarMessage('Address updated successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error saving data:', error);
      setSnackbarMessage('Failed to update address');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  function initializeThailand(): void {
    throw new Error('Function not implemented.');
  }

  return (
    <>
      <Script src="https://code.jquery.com/jquery-3.2.1.min.js" strategy="beforeInteractive" />
      <Script src="/jquery.Thailand.js/dependencies/JQL.min.js" strategy="beforeInteractive" />
      <Script src="/jquery.Thailand.js/dependencies/typeahead.bundle.js" strategy="beforeInteractive" />
      <Script src="/jquery.Thailand.js/dist/jquery.Thailand.min.js" strategy="beforeInteractive" onLoad={() => initializeThailand()} />

      <Card sx={{ p: 3, overflow: 'visible' }}>
        <Typography variant="h6" gutterBottom>
          Edit Address Information
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="ที่อยู่ บรรทัดที่1"
            variant="outlined"
            fullWidth
            value={addressLine1}
            onChange={(e) => setAddressLine1(e.target.value)}
          />
          <TextField
            label="ที่อยู่ บรรทัดที่2"
            variant="outlined"
            fullWidth
            value={addressLine2}
            onChange={(e) => setAddressLine2(e.target.value)}
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="อำเภอ/เขต"
              variant="outlined"
              fullWidth
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              name="district"
            />
            <TextField
              label="จังหวัด"
              variant="outlined"
              fullWidth
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              name="province"
            />
            <TextField
              label="รหัสไปรษณีย์"
              variant="outlined"
              fullWidth
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              name="postalCode"
            />
          </Box>
          <Button type="submit" variant="contained" color="primary">
            Edit Address
          </Button>
        </Box>
      </Card>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddressForm;