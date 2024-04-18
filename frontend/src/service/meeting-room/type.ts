export interface ICreateMeetingRoom {
  name: string
  capacity: number
  location: string
  equipment?: string
  description?: string
}

export interface IUpdateMeetingRoom extends ICreateMeetingRoom {
  id: number
}
