import { NextResponse } from "next/server";
import { createUserIfNotExists } from "@/server/services/user.service";
import { createClient } from "@/utils/supabase/server.util";
import jwt, { JwtPayload } from "jsonwebtoken";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";


export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = process.env.NEXT_PUBLIC_BASE_URL || requestUrl.origin;
  const redirectTo = requestUrl.searchParams.get("redirect_to")?.toString();

  if (session?.supabaseAccessToken) {
    const signingSecret = process.env.SUPABASE_JWT_SECRET || "";
    const decodedToken = jwt.verify(
      session.supabaseAccessToken as string,
      signingSecret
    ) as JwtPayload;
    try {
      await createUserIfNotExists({
        providerId: decodedToken.sub as string,
        email: session.user.email as string,
      });
    } catch (error) {
      console.error('Error creating', error);
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
