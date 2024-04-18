import { get, post } from '../request'
import { IUpdateInfo, IUpdatePassword } from './type'

/* ------------------------------- 普通 用户接口 ------------------------------- */
export const updatePassword = async (data: IUpdatePassword) => {
  return await post('/user/update-password', data)
}
export const getUpdatePasswordCaptcha = async (email: string) => {
  return await get('/user/update-password-captcha', {
    params: { email }
  })
}
export const updateInfo = async (data: IUpdateInfo) => {
  return await post('/user/update-user', data)
}
export const getUpdateInfoCaptcha = async () => {
  return await get('/user/update-user-captcha')
}
export const uploadAvatar = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  return await post<string>('/user/upload', formData)
}

/* ------------------------------- admin 用户接口 ------------------------------- */
export const freezeUser = async (id: number) => {
  return await get('/user/freeze-user', { params: { id } })
}
export const updateAdminPassword = async (data: IUpdatePassword) => {
  return await post('/user/admin/update-password', data)
}
export const updateAdminInfo = async (data: IUpdateInfo) => {
  return await post('/user/admin/update-user', data)
}
/* ------------------------------- admin 用户接口 ------------------------------- */
