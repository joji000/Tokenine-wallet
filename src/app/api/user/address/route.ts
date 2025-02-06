import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { updateAddressDto } from '@/dtos/Address.dto';
import { withAuth } from '@/server/middlewares/auth.middleware';
import { getUserAddressByUserId, updateUserAddressByUserId } from '@/server/services/user.service';
import { handleError } from '@/server/utils/handle-error.util';

export const GET = withAuth(async (req: NextRequest) => {
  const { user } = req;

  try {
    const address = await getUserAddressByUserId(user!.id);
    return NextResponse.json(address);
  } catch (error) {
    console.error('Failed to fetch address:', error);
    return handleError(error);
  }
});

export const PUT = withAuth(async (req: NextRequest) => {
  const { user } = req;
  const data = await req.json();

  try {
    const validatedAddress = updateAddressDto.parse(data);
    const updatedAddress = await updateUserAddressByUserId(user!.id, validatedAddress);
    return NextResponse.json(updatedAddress);
  } catch (error) {
    console.error('Failed to update address:', error);
    return handleError(error);
  }
});