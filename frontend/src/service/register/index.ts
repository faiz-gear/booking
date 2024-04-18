import { get, post } from '../request'
import { TRegisterUser } from './type'

export const register = async (data: TRegisterUser) => {
  return post('/user/register', data)
}

export const getRegisterCaptcha = async (email: string) => {
  return get(`/user/register-captcha?email=${email}`)
}
