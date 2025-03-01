import { redirect } from "next/navigation";
import type { PropsWithChildren } from "react";

import { Route } from "@/enums/route.enum";
import { createClient } from "@/utils/supabase/server.util";
import { getServerSession } from "next-auth/next";
import jwt from "jsonwebtoken";
import { authOptions } from "@/app/api/auth/authOptions";
import { User } from "@supabase/supabase-js";

const ProtectedLayout = async ({ children }: PropsWithChildren) => {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  let authenticatedUser: User | null = user;

  // If Supabase authentication fails, try NextAuth
  if (!user || !!error) {
    const session = await getServerSession(authOptions);
    const secret = process.env.SUPABASE_JWT_SECRET ?? "";
    if (session && session.supabaseAccessToken) {
      const decoded = jwt.verify(session.supabaseAccessToken, secret);
      authenticatedUser = decoded as User;
    }
  }

  if (!authenticatedUser) {
    return redirect(Route.HOME);
  }

  return children;
};

export default ProtectedLayout;
