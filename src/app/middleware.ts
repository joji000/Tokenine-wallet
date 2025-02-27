import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Route } from '@/enums/route.enum';
import jwt from 'jsonwebtoken';
import { getUserByProviderId } from '@/server/services/user.service';

const protectedRoutes = ['/protected']; // Add more protected routes here if needed
const authRoutes = ['/auth/callback']; // Add all auth route here.

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const supabaseAccessToken = request.cookies.get('supabaseAccessToken')?.value;

  // 1. Check auth routes, do nothing
  if (authRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // 2. If protected route and no token. Redirect to home
  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !supabaseAccessToken) {
    return NextResponse.redirect(new URL(Route.HOME, request.url));
  }

  // 3. If token exist, verify token.
  if (supabaseAccessToken) {
    const signingSecret = process.env.SUPABASE_JWT_SECRET ?? '';
    try {
      const verifiedToken = jwt.verify(supabaseAccessToken, signingSecret);
      if (!verifiedToken.sub) {
        throw new Error('Token invalid');
      }

      // Get user data from database and set to response header
      const user = await getUserByProviderId(verifiedToken.sub.toString());
      const response = NextResponse.next();
      response.headers.set('x-user', JSON.stringify(user));
      response.headers.set('x-access-token', supabaseAccessToken);

      return response;
    } catch (jwtError) {
      console.error('Error verifying supabaseAccessToken in middleware:', jwtError);
      // if token invalid, delete the token and redirect to home page
      const response = NextResponse.redirect(new URL(Route.HOME, request.url));
      response.cookies.delete('supabaseAccessToken');
      return response;
    }
  }

  // 4. Public route and no token, do nothing
  return NextResponse.next();
}

// match all the routes
export const config = {
  matcher: ['/protected/:path*', '/auth/callback/:path*'],
};

