import type { Role } from "@prisma/client";
import type { NextRequest, NextResponse } from "next/server";

import { ErrorCode } from "@/enums/error-code.enum";
import { ERROR_MESSAGES } from "@/server/constants/error.constant";
import { getUserByProviderId } from "@/server/services/user.service";
import { createClient } from "@/utils/supabase/server.util";
import { extractBearerToken, getAuthHeader } from "@/utils/token.util";

import {
  ForbiddenException,
  UnauthorizedException,
} from "../errors/http-exceptions.error";
import { handleError } from "../utils/handle-error.util";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import jwt from "jsonwebtoken";

type RouteHandler = (req: NextRequest) => Promise<NextResponse>;

interface AuthOptions {
  roles?: Role[];
}

export const withAuth =
  (handler: RouteHandler, options: AuthOptions = {}) =>
  async (req: NextRequest) => {
    try {
      const supabase = await createClient();

      // Try to get token from header
      const authHeader = getAuthHeader(req.headers);
      const token = extractBearerToken(authHeader);

      let user = null;
      let accessToken = token;

      if (token) {
        // Verify the token and get user from Supabase
        const {
          data: { user: supabaseUser },
          error: supabaseError,
        } = await supabase.auth.getUser(token);

        if (!supabaseError && supabaseUser) {
          user = await getUserByProviderId(supabaseUser.id);
        }
      }

      // If Supabase authentication fails, try NextAuth
      if (!user) {
        console.log("Supabase authentication failed, trying NextAuth");
        const session = await getServerSession(authOptions);
        console.log("Session:", session);
        if (session && session.supabaseAccessToken) {
          const decoded = jwt.decode(session.supabaseAccessToken) as {
            sub: string;
          };
          user = await getUserByProviderId(decoded.sub);

          // Use the supabaseAccessToken from the session if available 
          accessToken = session.supabaseAccessToken;
        }
      }

      if (!user) {
        throw new UnauthorizedException(
          ERROR_MESSAGES[ErrorCode.USER_NOT_FOUND]
        );
      }

      // Check role authorization if roles are specified
      if (options.roles && options.roles.length > 0) {
        if (!user.role) {
          throw new ForbiddenException(
            ERROR_MESSAGES[ErrorCode.ROLE_NOT_DEFINED]
          );
        }

        if (!options.roles.includes(user.role)) {
          throw new ForbiddenException(
            ERROR_MESSAGES[ErrorCode.INSUFFICIENT_PERMISSIONS]
          );
        }
      }

      // Add user and token to the request context
      req.user = user;
      req.accessToken = accessToken ?? undefined;
      console.log("User:", req.user);
      console.log("Token:", req.accessToken);


      // Call the original handler
      return handler(req);
    } catch (error: unknown) {
      console.error("Auth Middleware Error:", {
        error: error instanceof Error ? error : new Error(String(error)),
      });
      return handleError(error);
    }
  };