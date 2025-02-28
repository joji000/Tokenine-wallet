import type { User } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { getSession } from 'next-auth/react'
import jwt from 'jsonwebtoken'
import { createClient } from '@/utils/supabase/client.util'

const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser()

      if (error || !data.user) {
        // If Supabase authentication fails, try NextAuth
        const session = await getSession()
        if (session && session.supabaseAccessToken) {
          const decoded = jwt.decode(session.supabaseAccessToken)
          // Use the user from the NextAuth session
          setUser(decoded as User)
        }
      } else {
        setUser(data.user)
      }

      setIsLoading(false)
    }

    getUser()
  }, [supabase])

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  }
}

export default useAuth