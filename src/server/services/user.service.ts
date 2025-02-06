import { Role } from '@prisma/client';
import prisma from '../../../prisma/db';
import { ErrorCode } from '@/enums/error-code.enum';
import { ERROR_MESSAGES } from '../constants/error.constant';
import { NotFoundException } from '../errors/http-exceptions.error';
import engine from '../libs/engine.lib';

export const createUserIfNotExists = async ({
  providerId,
  email,
}: {
  providerId: string;
  email?: string;
}) => {
  const user = await prisma.user.findFirst({
    where: {
      providerId,
    },
  });

  if (!user) {
    const newUser = await prisma.user.create({
      data: {
        providerId,
        email,
        role: Role.USER,
        createdAt: new Date(),
      },
    });
    const walletAddress = (await engine.backendWallet.create({ type: 'local' }))
      .result.walletAddress;
    await prisma.user.update({
      where: {
        id: newUser.id,
      },
      data: {
        walletAddress,
      },
    });
  } else if (!user.walletAddress) {
    try {
      const walletAddress = (
        await engine.backendWallet.create({ type: 'local' })
      ).result.walletAddress;
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          walletAddress,
        },
      });
    } catch (error) {
      console.error(error);
    }
  }
};

export const getUserByProviderId = async (providerId: string) => {
  const user = await prisma.user.findFirst({
    where: {
      providerId,
    },
  });

  if (!user) {
    throw new NotFoundException(ERROR_MESSAGES[ErrorCode.USER_NOT_FOUND]);
  }

  return user;
};

export const getUserById = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new NotFoundException(ERROR_MESSAGES[ErrorCode.USER_NOT_FOUND]);
  }

  return user;
};

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateUserAddressByUserId = async (userId: number, addressData: any) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const updatedAddress = await prisma.address.upsert({
      where: { userId },
      update: {
        addressLine1: addressData.addressLine1 || undefined,
        addressLine2: addressData.addressLine2 || undefined,
        district: addressData.district || undefined,
        province: addressData.province || undefined,
        postalCode: addressData.postalCode || undefined,
        updatedAt: new Date(),
      },
      create: {
        addressLine1: addressData.addressLine1,
        addressLine2: addressData.addressLine2,
        district: addressData.district,
        province: addressData.province,
        postalCode: addressData.postalCode,
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return updatedAddress;
  } catch (error) {
    console.error('Failed to update address:', error);
    throw new Error('Failed to update address');
  }
};

export const getUserAddressByUserId = async (userId: number) => {
  try {
    const address = await prisma.address.findUnique({
      where: { userId },
    });

    if (!address) {
      throw new Error('Address not found');
    }

    return address;
  } catch (error) {
    console.error('Failed to fetch address:', error);
    throw new Error('Failed to fetch address');
  }
};