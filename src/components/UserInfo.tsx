import React, { useState } from 'react';
import { Box, TextField, Button, Card, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';

const UserInfoForm: React.FC = () => {
  const [prefix, setPrefix] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState<Dayjs | null>(null);
  const [idNumber, setIdNumber] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle form submission logic here
    console.log({ prefix, firstName, lastName, dob, idNumber });
  };

  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Edit User Information
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="คำนำหน้า"
          variant="outlined"
          fullWidth
          value={prefix}
          onChange={(e) => setPrefix(e.target.value)}
        />
        <TextField
          label="ชื่อจริง"
          variant="outlined"
          fullWidth
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <TextField
          label="นามสกุล"
          variant="outlined"
          fullWidth
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="วัน/เดือน/ปี เกิด"
            value={dob}
            onChange={(newValue) => setDob(newValue)}
          />
        </LocalizationProvider>
        <TextField
          label="เลขบัตรประชาชน 13 หลัก"
          variant="outlined"
          fullWidth
          value={idNumber}
          onChange={(e) => setIdNumber(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary">
          Edit Info
        </Button>
      </Box>
    </Card>
  );
};

export default UserInfoForm;