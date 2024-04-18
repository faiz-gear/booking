import useSWRImmutable from 'swr/immutable'
import { SWRConfiguration } from 'swr'
import { fetcher } from './fetcher'

interface IUserInfoVo {
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

export const useUserInfo = (swrConfig?: SWRConfiguration<IUserInfoVo>) => {
  const { data, error, isLoading, mutate } = useSWRImmutable<IUserInfoVo>(`/user/info`, fetcher, {
    ...swrConfig,
    errorRetryCount: swrConfig?.errorRetryCount ?? 0
  })

  return {
    userInfo: data,
    isLoading,
    isError: error,
    mutate
  }
}
