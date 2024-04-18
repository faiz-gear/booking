export interface IUpdatePassword {
  username: string
  password: string
  email: string
  captcha: string
}

export interface IUpdateInfo {
  headPic?: string
  nickName?: string
  email: string
  captcha: string
}
