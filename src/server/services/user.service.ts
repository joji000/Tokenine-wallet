import { Role } from '@prisma/client'

import { ErrorCode } from '@/enums/error-code.enum'
import prisma from '../../../prisma/db'


import { ERROR_MESSAGES } from '../constants/error.constant'
import { NotFoundException } from '../errors/http-exceptions.error'
import engine from '../libs/engine.lib'

export const createUserIfNotExists = async ({
  providerId,
  email,
}: {
  providerId: string
  email?: string
}) => {
  const user = await prisma.user.findFirst({
    where: {
      providerId,
    },
  })

  if (!user) {
    const newUser = await prisma.user.create({
      data: {
        providerId,
        email,
        role: Role.USER,
        createdAt: new Date(),
      },
    })
    const walletAddress = (await engine.backendWallet.create({ type: 'local' }))
      .result.walletAddress
    await prisma.user.update({
      where: {
        id: newUser.id,
      },
      data: {
        walletAddress,
      },
    })
  } else if (!user.walletAddress) {
    try {
      const walletAddress = (
        await engine.backendWallet.create({ type: 'local' })
      ).result.walletAddress
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          walletAddress,
        },
      })
    } catch (error) {
      console.error(error)
    }
  }
}

export const getUserByProviderId = async (providerId: string) => {
  const user = await prisma.user.findFirst({
    where: {
      providerId,
    },
  })

  if (!user) {
    throw new NotFoundException(ERROR_MESSAGES[ErrorCode.USER_NOT_FOUND])
  }

  return user
}


export const getUserById = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  })

  if (!user) {
    throw new NotFoundException(ERROR_MESSAGES[ErrorCode.USER_NOT_FOUND])
  }

  return user
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateUserConfigByUserId = async (userId: number, config: any) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        prefix: config.prefix || user.prefix,
        firstName: config.firstName || user.firstName,
        lastName: config.lastName || user.lastName,
        dob: config.dob || user.dob,
        idNumber: config.idNumber || user.idNumber,
        updatedAt: new Date(),
      },
    });

    return updatedUser;
  } catch (error) {
    console.error('Failed to update user:', error);
    throw new Error('Failed to update user');
  }
};