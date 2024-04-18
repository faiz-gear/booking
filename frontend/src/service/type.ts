/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IResponse<T = any> {
  code: number
  message: string
  data: T
}

export interface IPaginationParams {
  pageNo: number
  pageSize: number
}
