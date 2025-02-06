import { isAxiosError } from 'axios';
import axiosClient from '@/libs/axios.lib';

export const fetchAddress = async (userId: number) => {
  try {
    const response = await axiosClient.get(`/user/address/${userId}`);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error('Failed to fetch address:', error.response?.data || error.message);
    } else {
      console.error('Failed to fetch address:', error);
    }
    throw error;
  }
};