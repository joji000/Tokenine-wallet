import axios from 'axios'

import { createClient } from '@/utils/supabase/client.util'

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_ENDPOINT,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add other configurations like interceptors if needed
})

axiosClient.interceptors.request.use(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async (config: any) => {
    if (typeof window === 'undefined') {
      return config
    }

    const supabase = createClient()

    const token = (await supabase.auth.getSession()).data.session?.access_token
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

axiosClient.interceptors.response.use(
  (response) =>
    // Handle responses or errors globally
    response,
  (error) => Promise.reject(error)
)

export default axiosClient
