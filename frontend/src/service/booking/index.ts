import { get, post } from '../request'
import { ICreateBooking } from './type'

export const applyBooking = (id: number) => get('/booking/apply/' + id)

export const rejectBooking = (id: number) => get('/booking/reject/' + id)

export const unbindBooking = (id: number) => get('/booking/unbind/' + id)

export const urgeBooking = (id: number) => get('/booking/urge/' + id)

export const createBooking = (data: ICreateBooking) => post('/booking/add', data)
