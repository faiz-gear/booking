import useSWRImmutable from 'swr/immutable'
import { SWRConfiguration } from 'swr'
import { fetcher } from './fetcher'

export interface IMeetingRoomStatsParams {
  startTime: string
  endTime: string
}

export interface IMeetingRoomStatsItemVo {
  meetingRoomId: string
  meetingRoomName: string
  usedCount: string
}

export const useMeetingRoomStats = (
  params: IMeetingRoomStatsParams,
  swrConfig?: SWRConfiguration<IMeetingRoomStatsItemVo[]>
) => {
  const { data, error, isLoading, mutate } = useSWRImmutable<IMeetingRoomStatsItemVo[]>(
    [`/stats/meeting-room-stats`, params],
    ([url, params]) => fetcher(url, { params }),
    {
      ...swrConfig,
      errorRetryCount: swrConfig?.errorRetryCount ?? 0
    }
  )

  return {
    meetingRoomStats: data,
    isLoading,
    isError: error,
    mutate
  }
}
