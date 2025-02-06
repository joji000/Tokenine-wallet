import React, { useState } from 'react';
import { Box, TextField, Button, Card, Typography } from '@mui/material';


const AddressForm: React.FC = () => {
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [district, setDistrict] = useState('');
  const [province, setProvince] = useState('');
  const [postalCode, setPostalCode] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle form submission logic here
    console.log({ addressLine1, addressLine2, district, province, postalCode });
  };

  return (
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
          />
          <TextField
            label="จังหวัด"
            variant="outlined"
            fullWidth
            value={province}
            onChange={(e) => setProvince(e.target.value)}
          />
          <TextField
            label="รหัสไปรษณีย์"
            variant="outlined"
            fullWidth
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
          />
        </Box>
        <Button type="submit" variant="contained" color="primary">
          Edit Address
        </Button>
      </Box>
    </Card>
  );
};

export default AddressForm;