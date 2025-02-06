/* eslint-disable @next/next/no-before-interactive-script-outside-document */
import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Card, Typography } from '@mui/material';
import Script from 'next/script';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jQuery: any;
  }
}

const AddressForm: React.FC = () => {
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [district, setDistrict] = useState('');
  const [province, setProvince] = useState('');
  const [postalCode, setPostalCode] = useState('');

  useEffect(() => {
    const initializeThailand = () => {
      if (typeof window !== 'undefined' && window.jQuery) {
        window.jQuery.Thailand({
          $amphoe: $('[name="district"'),
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

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle form submission logic here
    console.log({ addressLine1, addressLine2, district, province, postalCode });
  };

  return (
    <>
      <Script src="https://code.jquery.com/jquery-3.2.1.min.js" strategy="beforeInteractive" />
      <Script src="https://earthchie.github.io/jquery.Thailand.js/jquery.Thailand.js/dependencies/JQL.min.js" strategy="beforeInteractive" />
      <Script src="https://earthchie.github.io/jquery.Thailand.js/jquery.Thailand.js/dependencies/typeahead.bundle.js" strategy="beforeInteractive" />
      <Script src="https://earthchie.github.io/jquery.Thailand.js/jquery.Thailand.js/dist/jquery.Thailand.min.js" strategy="beforeInteractive" />

      <Card sx={{ p: 3 }}>
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
    </>
  );
};

export default AddressForm;