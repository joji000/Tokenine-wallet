import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Card, Typography, Snackbar, Alert } from "@mui/material";
import Script from "next/script";
import { updateAddress } from '@/services/updateAddress.services';
import { fetchAddress } from '@/services/getAddress.services';
import useGetMe from '@/hooks/user/useGetMe';

const AddressForm: React.FC = () => {
  const { data: user, isLoading, refetch } = useGetMe();
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [district, setDistrict] = useState("");
  const [province, setProvince] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  useEffect(() => {
    const initializeThailand = () => {
      if (typeof window !== "undefined" && window.jQuery) {
        const $ = window.jQuery;

        $.Thailand({
          database: "/jquery.Thailand.js/database/db.json",
          $amphoe: $('[name="district"]'),
          $province: $('[name="province"]'),
          $zipcode: $('[name="postalCode"]'),
        });

        $('[name="district"]').on("change", function (this: HTMLElement) {
          setDistrict($(this).val() as string);
        });

        $('[name="province"]').on("change", function (this: HTMLElement) {
          setProvince($(this).val() as string);
        });

        $('[name="postalCode"]').on("change", function (this: HTMLElement) {
          setPostalCode($(this).val() as string);
        });
      }
    };

    const checkAndInitialize = () => {
      if (window.jQuery && window.jQuery.Thailand) {
        initializeThailand();
      } else {
        setTimeout(checkAndInitialize, 500);
      }
    };

    checkAndInitialize();
  }, []);

  useEffect(() => {
    const loadAddress = async () => {
      if (user) {
        try {
          const address = await fetchAddress(user.id);
          setAddressLine1(address.addressLine1 || '');
          setAddressLine2(address.addressLine2 || '');
          setDistrict(address.district || '');
          setProvince(address.province || '');
          setPostalCode(address.postalCode || '');
        } catch (error) {
          console.error('Failed to load address:', error);
        }
      }
    };

    loadAddress();
  }, [user]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) {
      console.error('User data is missing');
      return;
    }

    try {
      const updatedAddress = await updateAddress({
        userId: user.id,
        addressLine1,
        addressLine2,
        district,
        province,
        postalCode,
      });

      setAddressLine1(updatedAddress.addressLine1 || '');
      setAddressLine2(updatedAddress.addressLine2 || '');
      setDistrict(updatedAddress.district || '');
      setProvince(updatedAddress.province || '');
      setPostalCode(updatedAddress.postalCode || '');

      refetch();

      setSnackbarMessage('Address updated successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Failed to update address:', error);

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

  return (
    <>
      {/* Load scripts lazily to avoid blocking */}
      <Script src="https://code.jquery.com/jquery-3.2.1.min.js" strategy="lazyOnload" />
      <Script src="/jquery.Thailand.js/dependencies/JQL.min.js" strategy="lazyOnload" />
      <Script src="/jquery.Thailand.js/dependencies/typeahead.bundle.js" strategy="lazyOnload" />
      <Script src="/jquery.Thailand.js/dist/jquery.Thailand.min.js" strategy="lazyOnload" />

      <Card sx={{ p: 3, overflow: "visible" }}>
        <Typography variant="h6" gutterBottom>
          Edit Address Information
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
          <Box sx={{ display: "flex", gap: 2 }}>
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