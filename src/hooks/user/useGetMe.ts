import type { User } from '@prisma/client'
import type { UseQueryOptions } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'

import { QueryKey } from '@/enums/query-key.enum'
import { getMe } from '@/services/user.service'

interface UseGetMeProps {
  options?: Omit<UseQueryOptions<User>, 'queryKey' | 'queryFn'>
}

const useGetMe = ({ options }: UseGetMeProps = {}) =>
  useQuery({
    queryKey: [QueryKey.GET_ME],
    queryFn: () => getMe(),
    refetchOnMount: 'always',
    ...options,
  })

export default useGetMe
