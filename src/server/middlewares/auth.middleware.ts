import type { Role } from '@prisma/client'
import type { NextRequest, NextResponse } from 'next/server'

import { ErrorCode } from '@/enums/error-code.enum'
import { ERROR_MESSAGES } from '@/server/constants/error.constant'
import { getUserByProviderId } from '@/server/services/user.service'
import { createClient } from '@/utils/supabase/server.util'
import { extractBearerToken, getAuthHeader } from '@/utils/token.util'

import {
  ForbiddenException,
  UnauthorizedException,
} from '../errors/http-exceptions.error'
import { handleError } from '../utils/handle-error.util'

type RouteHandler = (req: NextRequest) => Promise<NextResponse>

interface AuthOptions {
  roles?: Role[]
}

export const withAuth =
  (handler: RouteHandler, options: AuthOptions = {}) =>
  async (req: NextRequest) => {
    try {
      const supabase = await createClient()

      // Try to get token from header
      const authHeader = getAuthHeader(req.headers)
      const token = extractBearerToken(authHeader)

      if (!token) {
        throw new UnauthorizedException(ERROR_MESSAGES[ErrorCode.NO_TOKEN])
      }

      // Verify the token and get user
      const {
        data: { user: supabaseUser },
        error,
      } = await supabase.auth.getUser(token)

      if (error || !supabaseUser) {
        throw new UnauthorizedException(ERROR_MESSAGES[ErrorCode.INVALID_TOKEN])
      }

      const user = await getUserByProviderId(supabaseUser.id)

      if (!user) {
        throw new UnauthorizedException(
          ERROR_MESSAGES[ErrorCode.USER_NOT_FOUND]
        )
      }

      // Check role authorization if roles are specified
      if (options.roles && options.roles.length > 0) {
        if (!user.role) {
          throw new ForbiddenException(
            ERROR_MESSAGES[ErrorCode.ROLE_NOT_DEFINED]
          )
        }

        if (!options.roles.includes(user.role)) {
          throw new ForbiddenException(
            ERROR_MESSAGES[ErrorCode.INSUFFICIENT_PERMISSIONS]
          )
        }
      }

      // Add user and token to the request context
      req.user = user
      req.accessToken = token

      // Call the original handler
      return handler(req)
    } catch (error) {
      console.error('Auth Middleware Error:', error)
      return handleError(error)
    }
  }
