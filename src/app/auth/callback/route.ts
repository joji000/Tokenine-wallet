import { NextResponse } from "next/server";
import { createUserIfNotExists } from "@/server/services/user.service";
import { createClient } from "@/utils/supabase/server.util";
import jwt from "jsonwebtoken";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  const origin = process.env.NEXT_PUBLIC_BASE_URL || requestUrl.origin;
  const redirectTo = requestUrl.searchParams.get("redirect_to")?.toString();

  const supabaseAccessToken = requestUrl.searchParams.get("supabaseAccessToken");

  if(!code && supabaseAccessToken) {
    const decoded = jwt.decode(supabaseAccessToken);
    if (decoded && typeof decoded !== 'string') {
      const { email, sub } = decoded;
      await createUserIfNotExists({
        providerId: sub as string,
        email: email,
      });
    }
  }

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await createUserIfNotExists({
        providerId: user.id,
        email: user.email,
      });
    }
  }

  // Redirect user to the correct location
  return NextResponse.redirect(
    redirectTo ? `${origin}${redirectTo}` : `${origin}/dashboard`
  );
}