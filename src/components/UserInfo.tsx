import React, { useState, useEffect } from 'react';
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
  SelectChangeEvent,
  Snackbar,
  Alert
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import useGetMe from '@/hooks/user/useGetMe';
import { updateUser } from '@/services/updateUser.services';

const UserInfoForm: React.FC = () => {
  const { data: user, isLoading, refetch } = useGetMe();
  const [prefix, setPrefix] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState<Dayjs | null>(null);
  const [idNumber, setIdNumber] = useState('');
  const [idVisible, setIdVisible] = useState(false);
  const [isValidId, setIsValidId] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  useEffect(() => {
    if (user) {
      setPrefix(user.prefix || '');
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setDob(user.dob ? dayjs(user.dob, 'DD/MM/YYYY') : null);
      setIdNumber(user.idNumber || '');
    }
  }, [user]);

  const handlePrefixChange = (event: SelectChangeEvent) => {
    setPrefix(event.target.value);
  };

  const handleIdVisibilityToggle = () => {
    setIdVisible(!idVisible);
  };

  const handleIdNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setIdNumber(value);
    setIsValidId(/^\d{13}$/.test(value));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) {
      console.error('User data is missing');
      return;
    }

    console.log('User data:', user);

    try {
      const updatedUser = await updateUser({
        prefix: prefix || undefined,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        dob: dob ? dob.format('DD/MM/YYYY') : undefined,
        idNumber: idNumber || undefined,
      });
      
      setPrefix(updatedUser.prefix || '');
      setFirstName(updatedUser.firstName || '');
      setLastName(updatedUser.lastName || '');
      setDob(updatedUser.dob ? dayjs(updatedUser.dob, 'DD/MM/YYYY') : null);
      setIdNumber(updatedUser.idNumber || '');
  
      refetch();
     
      setSnackbarMessage('User updated successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Failed to update user:', error);
     
      setSnackbarMessage('Failed to update user');
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
            format="DD/MM/YYYY"
          />
        </LocalizationProvider>
        <TextField
          label="เลขบัตรประชาชน 13 หลัก"
          variant="outlined"
          fullWidth
          type={idVisible ? 'text' : 'password'}
          value={idNumber}
          onChange={handleIdNumberChange}
          error={!isValidId}
          helperText={!isValidId ? 'กรุณากรอกเลขบัตรประชาชน 13 หลัก' : ''}
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
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default UserInfoForm;