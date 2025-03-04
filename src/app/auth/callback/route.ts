import { NextResponse } from "next/server";
import { createUserIfNotExists } from "@/server/services/user.service";
import { createClient } from "@/utils/supabase/server.util";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  // Ensure origin is set correctly
  const origin = process.env.NEXT_PUBLIC_BASE_URL || requestUrl.origin;
  console.log("origin", origin);
  const redirectTo = requestUrl.searchParams.get("redirect_to")?.toString();

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      createUserIfNotExists({
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