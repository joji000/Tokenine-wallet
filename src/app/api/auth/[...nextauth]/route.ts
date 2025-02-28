import NextAuth from "next-auth";
import LineProvider from 'next-auth/providers/line';
import { SupabaseAdapter } from '@auth/supabase-adapter';
import { Adapter } from 'next-auth/adapters';
import jwt from "jsonwebtoken";
import { Account, Profile, Session, User } from "next-auth";
import { createUserIfNotExists } from "@/server/services/user.service";

export const authOptions = {
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
        async signIn({ account, profile }: { account: Account | null, profile?: Profile }) {
            if (account?.provider === "line") {
              return !!profile?.email;
            }
            return true;
          },
        async session({ session, user }: { session: Session, user: User }) {
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

          try{
            await createUserIfNotExists({
              providerId: user.id,
              email: user.email as string,
            });
          } catch (error) {
            console.error('Error creating', error);
          }
          return session
        },
        async redirect({ baseUrl }: { url: string, baseUrl: string }) {
          return baseUrl
        },
    }
};

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
