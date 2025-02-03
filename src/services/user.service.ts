import type { User } from '@prisma/client'
import { isAxiosError } from 'axios'

import type { Balance } from '@/interfaces/user.interface'
import axiosClient from '@/libs/axios.lib'

export const getMe = async () => {
  try {
    const { data } = await axiosClient.get<User>('/auth/me')

    return data
  } catch (error) {
    if (isAxiosError(error)) {
      throw error.response?.data
    }

    throw error
  }
}

export const getBalance = async () => {
  try {
    const { data } = await axiosClient.get<Balance>('/auth/me/balance')

    return data
  } catch (error) {
    if (isAxiosError(error)) {
      throw error.response?.data
    }
    throw error
  }
}

