import NextAuth from 'next-auth';
import LineProvider from 'next-auth/providers/line';
import { SupabaseAdapter } from '@auth/supabase-adapter';
import { Adapter } from 'next-auth/adapters';

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
    }) as Adapter
});

export { handler as GET, handler as POST };
