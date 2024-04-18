import useSWRImmutable from 'swr/immutable'
import { SWRConfiguration } from 'swr'
import { fetcher } from './fetcher'
import { IPaginationParams } from '../type'

export interface IMeetingRoomPaginationParams extends IPaginationParams {
  name?: string
  capacity?: string
  equipment?: string
}

export interface IMeetingRoomItemVo {
  id: number
  name: string
  capacity: number
  location: string
  equipment: string
  description: string
  isBooked: boolean
  createTime: string
  updateTime: string
}

export interface IMeetingRoomListVo {
  totalCount: number
  meetingRooms: IMeetingRoomItemVo[]
}

export const useMeetingRoomList = (
  params: IMeetingRoomPaginationParams,
  swrConfig?: SWRConfiguration<IMeetingRoomListVo>
) => {
  const { data, error, isLoading, mutate } = useSWRImmutable<IMeetingRoomListVo>(
    [`/meeting-room/list`, params],
    ([url, params]) => fetcher(url, { params }),
    {
      ...swrConfig,
      errorRetryCount: swrConfig?.errorRetryCount ?? 0
    }
  )

  return {
    meetingRoomList: data,
    isLoading,
    isError: error,
    mutate
  }
}
