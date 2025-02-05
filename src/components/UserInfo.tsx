import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Card,
  Typography,
  MenuItem,
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const UserInfoForm: React.FC = () => {
  const [prefix, setPrefix] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState<Dayjs | null>(null);
  const [idNumber, setIdNumber] = useState('');
  const [idVisible, setIdVisible] = useState(false);

  const handlePrefixChange = (event: SelectChangeEvent) => {
    setPrefix(event.target.value);
  };

  const handleIdVisibilityToggle = () => {
    setIdVisible(!idVisible);
  };

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
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl variant="outlined" sx={{ minWidth: 120 }}>
            <InputLabel>คำนำหน้า</InputLabel>
            <Select
              value={prefix}
              onChange={handlePrefixChange}
              label="คำนำหน้า"
            >
              <MenuItem value="นาย">นาย</MenuItem>
              <MenuItem value="นางสาว">นางสาว</MenuItem>
              <MenuItem value="นาง">นาง</MenuItem>
            </Select>
          </FormControl>
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
        </Box>
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
          type={idVisible ? 'text' : 'password'}
          value={idNumber}
          onChange={(e) => setIdNumber(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleIdVisibilityToggle}
                  edge="end"
                >
                  {idVisible ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button type="submit" variant="contained" color="primary">
          Edit Info
        </Button>
      </Box>
    </Card>
  );
};

export default UserInfoForm;