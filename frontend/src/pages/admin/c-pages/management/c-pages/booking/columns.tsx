import ConfirmAlert from '@/components/confirm-alert'
import { Button } from '@/components/ui/button'
import { applyBooking, rejectBooking, unbindBooking } from '@/service/booking'
import { IBookingItemVo, IBookingListVo } from '@/service/hooks/useBookingList'
import { ColumnDef } from '@tanstack/react-table'
import { KeyedMutator } from 'swr'

export const columns: (mutate: KeyedMutator<IBookingListVo>) => ColumnDef<IBookingItemVo>[] = (mutate) => [
  {
    accessorKey: 'id',
    header: 'ID'
  },
  {
    accessorKey: 'user.username',
    header: '预订人'
  },
  {
    accessorKey: 'room.name',
    header: '会议室名称'
  },
  {
    accessorKey: 'room.location',
    header: '会议室位置'
  },
  {
    accessorKey: 'bookingTime',
    header: '预订时间',
    cell: (data) => {
      const { startTime, endTime } = data.row.original

      return `${new Date(startTime).toLocaleString()} ~ ${new Date(endTime).toLocaleString()}`
    }
  },
  {
    accessorKey: 'status',
    header: '状态'
  },

  {
    accessorKey: 'note',
    header: '备注'
  },
  {
    accessorKey: 'createTime',
    header: '创建时间',
    cell: (data) => new Date(data.row.original.createTime).toLocaleString()
  },
  {
    accessorKey: 'action',
    header: '操作',
    cell: (data) => {
      return (
        <>
          <ConfirmAlert
            title={`确认通过吗`}
            onConfirm={async () => {
              await applyBooking(data.row.original.id)
              mutate()
            }}
          >
            <Button variant="link" size="sm" disabled={data.row.original.status !== '申请中'}>
              通过
            </Button>
          </ConfirmAlert>
          <ConfirmAlert
            title={`确认驳回吗`}
            onConfirm={async () => {
              await rejectBooking(data.row.original.id)
              mutate()
            }}
          >
            <Button variant="link" size="sm" disabled={data.row.original.status !== '申请中'}>
              驳回
            </Button>
          </ConfirmAlert>
          <ConfirmAlert
            title={`确认解除吗`}
            onConfirm={async () => {
              await unbindBooking(data.row.original.id)
              mutate()
            }}
          >
            <Button variant="link" size="sm" disabled={data.row.original.status !== '申请中'}>
              解除
            </Button>
          </ConfirmAlert>
        </>
      )
    }
  }
]
