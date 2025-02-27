import { NextResponse } from "next/server";
import { createUserIfNotExists } from "@/server/services/user.service";
import { createClient } from "@/utils/supabase/server.util";
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = process.env.NEXT_PUBLIC_BASE_URL || requestUrl.origin;
  const redirectTo = requestUrl.searchParams.get("redirect_to")?.toString();
  const cookieStore = await cookies();

  // Check for supabaseAccessToken
  const supabaseAccessToken = cookieStore.get("supabaseAccessToken")?.value;

  // If there's a supabaseAccessToken, verify it and create the user if necessary
  if (supabaseAccessToken) {
    const signingSecret = process.env.SUPABASE_JWT_SECRET ?? "";
    try {
      const verifiedToken = jwt.verify(
        supabaseAccessToken,
        signingSecret
      ) as JwtPayload;
      if (!verifiedToken.sub) {
          throw new Error('Token invalid')
      }
      // If token is verified, create or get the user in public.users
      await createUserIfNotExists({
        providerId: verifiedToken.sub,
        email: verifiedToken.email as string,
      });
      return NextResponse.redirect(
        redirectTo ? `${origin}${redirectTo}` : `${origin}/dashboard`
      );
    } catch (jwtError) {
      console.error("Error verifying supabaseAccessToken:", jwtError);
    }
  }
 // If there is no supabaseAccessToken but there is a code
  if (code) {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.exchangeCodeForSession(code);

    if (error || !user) {
      console.error("Error exchange code for session:", error);
      return NextResponse.redirect(
        redirectTo ? `${origin}${redirectTo}` : `${origin}`
      );
    }

    await createUserIfNotExists({
      providerId: user.id,
      email: user.email,
    });
  }

  // Redirect user to the correct location
  return NextResponse.redirect(
    redirectTo ? `${origin}${redirectTo}` : `${origin}/dashboard`
  );
}
