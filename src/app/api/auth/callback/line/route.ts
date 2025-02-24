import { NextResponse } from "next/server";
import { createUserIfNotExists } from "@/server/services/user.service";
import { createClient } from "@/utils/supabase/server.util";
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  const { idToken } = await request.json();
  console.log("Received ID Token:", idToken);

  if (!idToken) {
    console.error("ID token is missing");
    return NextResponse.error();
  }

  try {
    const decodedIdToken = jwt.decode(idToken, { complete: true });
    if (!decodedIdToken || typeof decodedIdToken === 'string') {
      console.error("Failed to decode ID token:", idToken);
      return NextResponse.error();
    }

    const payload = decodedIdToken.payload;
    if (!payload) {
      console.error("Decoded ID token payload is null:", decodedIdToken);
      return NextResponse.error();
    }

    const email = (payload as jwt.JwtPayload).email;
    const userId = payload.sub;
    console.log("Decoded ID Token Payload:", payload);

    const supabase = await createClient();
    await createUserIfNotExists({
      providerId: typeof userId === 'string' ? userId : '',
      email: email,
    });

    // Create a session with Supabase
    await supabase.auth.setSession({
      access_token: idToken,
      refresh_token: '', // LIFF does not provide a refresh token
    });

    // Redirect user to the correct location
    const origin = process.env.NEXT_PUBLIC_BASE_URL || request.headers.get('origin');
    const redirectTo = new URL(request.url).searchParams.get("redirect_to")?.toString();
    return NextResponse.json({ redirectTo: redirectTo ? `${origin}${redirectTo}` : `${origin}/dashboard` });
  } catch (error) {
    console.error("Error during LINE login callback:", error);
    return NextResponse.error();
  }
}
