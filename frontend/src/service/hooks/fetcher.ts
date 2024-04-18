import { AxiosRequestConfig } from 'axios'
import { get } from '../request'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetcher = (...args: any[]) =>
  get(...(args as [url: string, config: AxiosRequestConfig])).then((res) => res.data)
