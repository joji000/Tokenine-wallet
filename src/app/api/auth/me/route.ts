import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { withAuth } from '@/server/middlewares/auth.middleware'
import { handleError } from '@/server/utils/handle-error.util'

export const GET = withAuth(async (req: NextRequest) => {
  try {
    const { user } = req

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching user:', error)
    return handleError(error)
  }
})
