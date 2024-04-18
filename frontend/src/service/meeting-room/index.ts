import { del, post, put } from '../request'
import { ICreateMeetingRoom, IUpdateMeetingRoom } from './type'

export const createMeetingRoom = (data: ICreateMeetingRoom) => post('/meeting-room/create', data)

export const updateMeetingRoom = (data: IUpdateMeetingRoom) => put('/meeting-room/update', data)

export const deleteMeetingRoom = (id: number) => del('/meeting-room/' + id)
