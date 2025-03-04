import { isAxiosError } from 'axios';
import axiosClient from '@/libs/axios.lib';

export const fetchAddress = async (userId: number) => {
  try {
    const response = await axiosClient.get(`/user/address`);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response?.status === 404) {
        console.warn('Address not found for user:', userId);
        return {
          addressLine1: null,
          addressLine2: null,
          district: null,
          province: null,
          postalCode: null,
        };
      }
      console.error('Failed to fetch address:', error.response?.data || error.message);
    } else {
      console.error('Failed to fetch address:', error);
    }
    throw error;
  }
};