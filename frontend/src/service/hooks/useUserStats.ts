import useSWRImmutable from 'swr/immutable'
import { SWRConfiguration } from 'swr'
import { fetcher } from './fetcher'

export interface IUserStatsParams {
  startTime: string
  endTime: string
}

export interface IUserStatsItemVo {
  userId: string
  username: string
  bookingCount: string
}

export const useUserStats = (params: IUserStatsParams, swrConfig?: SWRConfiguration<IUserStatsItemVo[]>) => {
  const { data, error, isLoading, mutate } = useSWRImmutable<IUserStatsItemVo[]>(
    [`/stats/users-stats`, params],
    ([url, params]) => fetcher(url, { params }),
    {
      ...swrConfig,
      errorRetryCount: swrConfig?.errorRetryCount ?? 0
    }
  )

  return {
    userStats: data,
    isLoading,
    isError: error,
    mutate
  }
}
