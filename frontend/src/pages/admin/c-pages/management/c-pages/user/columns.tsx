import ConfirmAlert from '@/components/confirm-alert'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { IUserItemVo, IUserListVo } from '@/service/hooks/useUserList'
import { freezeUser } from '@/service/user'
import { ColumnDef } from '@tanstack/react-table'
import cls from 'classnames'
import { KeyedMutator } from 'swr'

export const columns: (mutate: KeyedMutator<IUserListVo>) => ColumnDef<IUserItemVo>[] = (mutate) => [
  {
    accessorKey: 'id',
    header: 'ID'
  },
  {
    accessorKey: 'username',
    header: '用户名'
  },
  {
    accessorKey: 'nickName',
    header: '昵称'
  },
  {
    accessorKey: 'headPic',
    header: '头像',
    cell: (data) => (
      <Avatar>
        <AvatarImage src={data.row.original.headPic} />
        <AvatarFallback></AvatarFallback>
      </Avatar>
    )
  },
  {
    accessorKey: 'email',
    header: '邮箱'
  },
  {
    accessorKey: 'createTime',
    header: '注册时间',
    cell: (data) => new Date(data.row.original.createTime).toLocaleString()
  },
  {
    accessorKey: 'isFrozen',
    header: '状态',
    cell: (data) => (
      <Badge
        variant={data.row.original.isFrozen ? 'destructive' : 'default'}
        className={cls([
          data.row.original.isFrozen
            ? 'bg-red-200 text-red-800 hover:bg-red-100 hover:text-red-700'
            : 'bg-green-200 text-green-800 hover:bg-green-100 hover:text-green-700'
        ])}
      >
        {data.row.original.isFrozen ? '已冻结' : '正常'}
      </Badge>
    )
  },
  {
    accessorKey: 'action',
    header: '操作',
    cell: (data) => {
      return (
        <ConfirmAlert
          title={`确认冻结用户"${data.row.original.username}"吗`}
          description="这个操作将会冻结用户，用户将无法登录系统，确定要继续吗？"
          onConfirm={async () => {
            await freezeUser(data.row.original.id)
            mutate()
          }}
        >
          <Button variant="link" size="sm" className="text-red-600" disabled={data.row.original.isFrozen}>
            冻结
          </Button>
        </ConfirmAlert>
      )
    }
  }
]
