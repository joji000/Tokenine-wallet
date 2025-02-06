import { isAxiosError } from 'axios';
import axiosClient from '@/libs/axios.lib';

interface UpdateUserParams {
  prefix?: string;
  firstName?: string;
  lastName?: string;
  dob?: string | null;
  idNumber?: string;
}

export const updateUser = async (params: UpdateUserParams) => {
  try {
    const { data } = await axiosClient.put('/user/userInfo', {
      prefix: params.prefix,
      firstName: params.firstName,
      lastName: params.lastName,
      dob: params.dob,
      idNumber: params.idNumber,
    });
    console.log('User updated:', data);
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error('Failed to update user:', error.response?.data || error.message);
      throw error.response?.data || error.message;
    }

    console.error('Failed to update user:', error);
    throw error;
  }
};