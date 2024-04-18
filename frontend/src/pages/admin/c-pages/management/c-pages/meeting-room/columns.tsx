import ConfirmAlert from '@/components/confirm-alert'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { IMeetingRoomItemVo, IMeetingRoomListVo } from '@/service/hooks/useMeetingRoomList'
import { deleteMeetingRoom } from '@/service/meeting-room'
import { ColumnDef } from '@tanstack/react-table'
import { KeyedMutator } from 'swr'
import DialogEditing from './dialog-editing'
import { pick } from 'radash'

export const columns: (mutate: KeyedMutator<IMeetingRoomListVo>) => ColumnDef<IMeetingRoomItemVo>[] = (mutate) => [
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
        <DialogEditing
          defaultValues={{
            ...pick(data.row.original, ['id', 'name', 'equipment', 'location', 'description']),
            capacity: data.row.original.capacity + ''
          }}
          onSuccess={() => mutate()}
        />
        <ConfirmAlert
          title={`确认删除会议室"${data.row.original.name}"吗?`}
          onConfirm={async () => {
            await deleteMeetingRoom(data.row.original.id)
            mutate()
          }}
        >
          <Button variant={'link'} size={'sm'} className="text-red-600">
            删除
          </Button>
        </ConfirmAlert>
      </>
    )
  }
]
