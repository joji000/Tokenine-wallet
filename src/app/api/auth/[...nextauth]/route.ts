import NextAuth from 'next-auth';
import LineProvider from 'next-auth/providers/line';
import { SupabaseAdapter } from '@auth/supabase-adapter';
import { Adapter } from 'next-auth/adapters';
import jwt from "jsonwebtoken"

const handler = NextAuth({
    providers: [
        LineProvider({
            clientId: process.env.LINE_CLIENT_ID ?? '',
            clientSecret: process.env.LINE_CLIENT_SECRET ?? '',
            authorization: { params: { scope: "openid profile email" } },
        }),
    ],
    adapter: SupabaseAdapter({
        url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
        secret: process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
    }) as Adapter,
    callbacks: {
        async session({ session, user }) {
          const signingSecret = process.env.SUPABASE_JWT_SECRET ?? ''
          if (signingSecret) {
            const payload = {
              aud: "authenticated",
              exp: Math.floor(new Date(session.expires).getTime() / 1000),
              sub: user.id,
              email: user.email,
              role: "authenticated",
            }
            session.supabaseAccessToken = jwt.sign(payload, signingSecret)
          }
          return session
        },
    }
});

export { handler as GET, handler as POST };
