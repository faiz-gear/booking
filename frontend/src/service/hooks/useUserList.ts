import useSWRImmutable from 'swr/immutable'
import { SWRConfiguration } from 'swr'
import { fetcher } from './fetcher'
import { IPaginationParams } from '../type'

export interface IUserPaginationParams extends IPaginationParams {
  username?: string
  nickName?: string
  email?: string
}

export interface IUserItemVo {
  createTime: Date
  email: string
  headPic: string
  id: number
  isFrozen: boolean
  nickName: string
  phoneNumber: string
  username: string
  isAdmin: boolean
}

export interface IUserListVo {
  totalCount: number
  users: IUserItemVo[]
}

export const useUserList = (params: IUserPaginationParams, swrConfig?: SWRConfiguration<IUserListVo>) => {
  const { data, error, isLoading, mutate } = useSWRImmutable<IUserListVo>(
    [`/user/list`, params],
    ([url, params]) => fetcher(url, { params }),
    {
      ...swrConfig,
      errorRetryCount: swrConfig?.errorRetryCount ?? 0
    }
  )

  return {
    userList: data,
    isLoading,
    isError: error,
    mutate
  }
}
