import { redirect } from 'next/navigation'
import type { PropsWithChildren } from 'react'

import { Route } from '@/enums/route.enum'
import { createClient } from '@/utils/supabase/server.util'

const ProtectedLayout = async ({ children }: PropsWithChildren) => {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (!user || !!error) {
    return redirect(Route.SIGN_IN)
  }

  return children
}

export default ProtectedLayout