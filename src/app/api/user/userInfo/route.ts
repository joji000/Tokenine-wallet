import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { updateUserConfigDto } from '@/dtos/UserConfig.dto';
import { withAuth } from '@/server/middlewares/auth.middleware';
import { getUserById, updateUserConfigByUserId } from '@/server/services/user.service';
import { handleError } from '@/server/utils/handle-error.util';

export const GET = withAuth(async (req: NextRequest) => {
  const { user } = req;

  try {
    const userConfig = await getUserById(user!.id);
    return NextResponse.json(userConfig);
  } catch (error) {
    console.error('Failed to get user config:', error);
    return handleError(error);
  }
});

export const PUT = withAuth(async (req: NextRequest) => {
  const { user } = req;
  const data = await req.json();

  try {
    const validatedUserConfig = updateUserConfigDto.parse(data);
    const updatedConfig = await updateUserConfigByUserId(user!.id, validatedUserConfig);
    return NextResponse.json(updatedConfig);
  } catch (error) {
    console.error('Failed to update user config:', error);
    return handleError(error);
  }
});