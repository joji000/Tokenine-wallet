import type { User } from '@prisma/client'

declare module 'next/server' {
  interface NextRequest {
    user?: User
    accessToken?: string
  }
}

import { type DefaultSession } from "next-auth"
 
declare module "next-auth" {
  // Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
  interface Session {
    // A JWT which can be used as Authorization header with supabase-js for RLS.
    supabaseAccessToken?: string
    user: {
      // The user's postal address
      address: string
    } & DefaultSession["user"]
  }
}