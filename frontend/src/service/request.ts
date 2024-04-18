/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from '@/components/ui/use-toast'
import axios, { AxiosRequestConfig } from 'axios'
import { IResponse } from './type'
import { useUserStore } from '@/store'

const request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  timeout: 6000
})

interface PendingTask {
  config: AxiosRequestConfig
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resolve: (value: any) => void
}
let refreshing = false
const queue: PendingTask[] = []

const isRefreshTokenUrl = (url: string) =>
  url.includes('/user/refresh-token') || url.includes('/user/admin/refresh-token')

request.interceptors.request.use((config) => {
  if (localStorage.getItem('accessToken')) {
    config.headers['Authorization'] = 'Bearer ' + localStorage.getItem('accessToken')
  }
  return config
})

request.interceptors.response.use(
  async (response) => {
    if (response.data.code === 200 || response.data.code === 201) {
      return response.data
    } else {
      const { data, config } = response

      try {
        if (data.code === 401 && !isRefreshTokenUrl(config.url || '')) {
          // 除了刷新token的请求, 其他接口返回401时, 刷新token
          if (refreshing) {
            // 正在刷新token, 将请求放入队列
            return new Promise((resolve) => {
              queue.push({
                config,
                resolve
              })
            })
          }

          refreshing = true
          const res = await refreshToken()
          refreshing = false

          // 刷新token成功, 重新发起之前的请求
          if (res.code === 200) {
            queue.forEach(({ config, resolve }) => {
              resolve(request(config))
            })
            return request(config)
          }
        }
      } catch (error: any) {
        toast({
          title: '请求发生错误',
          description: error.data || error.message,
          variant: 'destructive'
        })
        return Promise.reject(error)
      }
      toast({
        title: '请求发生错误',
        description: response.data.data,
        variant: 'destructive'
      })
      // 如果刷新token失败, 则跳转到登录页
      if (isRefreshTokenUrl(config.url || '')) {
        setTimeout(() => {
          const isAdmin = useUserStore.getState().userInfo?.isAdmin
          window.location.href = isAdmin ? '/admin/login' : '/login'
        }, 1500)
      }

      throw new Error(response.data.data)
    }
  },
  async (error) => {
    toast({
      title: '请求发生错误',
      description: error.data || error.message,
      variant: 'destructive'
    })
    return Promise.reject(error)
  }
)

const get = <T = any>(url: string, config?: AxiosRequestConfig) => request.get<any, IResponse<T>>(url, config)
const post = <T = any>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
  request.post<any, IResponse<T>>(url, data, config)
const del = <T = any>(url: string, config?: AxiosRequestConfig) => request.delete<any, IResponse<T>>(url, config)
const put = <T = any>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
  request.put<any, IResponse<T>>(url, data, config)

export async function refreshToken() {
  const isAdmin = useUserStore.getState().userInfo?.isAdmin
  const res: IResponse<{
    accessToken: string
    refreshToken: string
  }> = await request.get(isAdmin ? '/user/admin/refresh-token' : '/user/refresh-token', {
    params: {
      refreshToken: localStorage.getItem('refreshToken')
    }
  })
  localStorage.setItem('accessToken', res.data.accessToken || '')
  localStorage.setItem('refreshToken', res.data.refreshToken || '')
  return res
}

export { get, post, del, put }
