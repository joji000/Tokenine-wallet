import { isAxiosError } from 'axios';
import axiosClient from '@/libs/axios.lib';

export const transferTokens = async (
  fromAddress: string,
  toAddress: string,
  tokenAddress: string,
  amount: string
) => {
  try {
    const { data } = await axiosClient.post('/transfer', {
      fromAddress,
      toAddress,
      tokenAddress,
      amount,
    });

    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }

    throw error;
  }
};
