import { isAxiosError } from 'axios';
import axiosClient from '@/libs/axios.lib';

interface UpdateAddressParams {
  userId: number;
  addressLine1?: string;
  addressLine2?: string;
  district?: string;
  province?: string;
  postalCode?: string;
}

export const updateAddress = async (params: UpdateAddressParams) => {
  try {
    const { data } = await axiosClient.put('/user/address', {
      userId: params.userId,
      addressLine1: params.addressLine1,
      addressLine2: params.addressLine2,
      district: params.district,
      province: params.province,
      postalCode: params.postalCode,
    });
    console.log('Address updated:', data);
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error('Failed to update address:', error.response?.data || error.message);
      throw error.response?.data || error.message;
    }

    console.error('Failed to update address:', error);
    throw error;
  }
};