import type { UseQueryOptions } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'

import { QueryKey } from '@/enums/query-key.enum'
import type { Balance } from '@/interfaces/user.interface'
import { getBalance } from '@/services/user.service'

interface UseGetBalanceProps {
  options?: Omit<UseQueryOptions<Balance>, 'queryKey' | 'queryFn'>
}

const useGetBalance = ({ options }: UseGetBalanceProps = {}) =>
  useQuery({
    queryKey: [QueryKey.GET_BALANCE],
    queryFn: () => getBalance(),
    refetchOnMount: 'always',
    ...options,
  })

export default useGetBalance


