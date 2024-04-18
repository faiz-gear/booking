import { Switch } from '@/components/ui/switch'
import { IMeetingRoomItemVo, IMeetingRoomListVo } from '@/service/hooks/useMeetingRoomList'
import { ColumnDef } from '@tanstack/react-table'
import { KeyedMutator } from 'swr'
import DialogBooking from './dialog-booking'

export const columns: (mutate: KeyedMutator<IMeetingRoomListVo>) => ColumnDef<IMeetingRoomItemVo>[] = () => [
  {
    accessorKey: 'id',
    header: 'ID'
  },
  {
    accessorKey: 'name',
    header: '会议室名称'
  },
  {
    accessorKey: 'capacity',
    header: '容量'
  },
  {
    accessorKey: 'equipment',
    header: '设备'
  },
  {
    accessorKey: 'location',
    header: '位置'
  },
  {
    accessorKey: 'isBooked',
    header: '是否预订',
    cell: (data) => <Switch checked={data.row.original.isBooked} disabled />
  },
  {
    accessorKey: 'description',
    header: '描述'
  },
  {
    accessorKey: 'createTime',
    header: '创建时间',
    cell: (data) => new Date(data.row.original.createTime).toLocaleString()
  },

  {
    accessorKey: 'action',
    header: '操作',
    cell: (data) => (
      <>
        <DialogBooking meetingRoomId={data.row.original.id} meetingRoomName={data.row.original.name} />
      </>
    )
  }
]
