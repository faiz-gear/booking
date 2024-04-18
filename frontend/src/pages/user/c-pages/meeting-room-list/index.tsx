import { memo, useState } from 'react'
import { columns } from './columns'
import { DataTable } from '@/components/data-table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { IPaginationParams } from '@/service/type'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { PaginationState } from '@tanstack/react-table'
import { IMeetingRoomPaginationParams, useMeetingRoomList } from '@/service/hooks/useMeetingRoomList'

type SearchParams = Omit<IMeetingRoomPaginationParams, keyof IPaginationParams>

function MeetingRoomList() {
  const [params, setParams] = useState<SearchParams>({
    name: '',
    capacity: '',
    equipment: ''
  })
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0, //initial page index
    pageSize: 5 //default page size
  })
  const { meetingRoomList, mutate } = useMeetingRoomList({
    pageNo: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    ...params
  })

  const form = useForm<SearchParams>({
    defaultValues: params
  })

  const submit = () => {
    const values = form.getValues()
    setParams(values)
  }

  return (
    <div className="container mx-auto py-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submit)}>
          <div className="flex gap-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="text" placeholder="请输入会议室名" className="w-auto" {...field} />
                  </FormControl>
                  {/* <FormDescription>This is your public display name.</FormDescription> */}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="text" placeholder="请输入容量" className="w-auto" {...field} />
                  </FormControl>
                  {/* <FormDescription>This is your public display name.</FormDescription> */}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="equipment"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="email" placeholder="请输入设备" className="w-auto" {...field} />
                  </FormControl>
                  {/* <FormDescription>This is your public display name.</FormDescription> */}
                </FormItem>
              )}
            />

            <Button type="submit" variant="outline">
              搜索
            </Button>
          </div>
        </form>
      </Form>
      <DataTable
        columns={columns(mutate)}
        data={meetingRoomList?.meetingRooms || []}
        rowCount={meetingRoomList?.totalCount || 0}
        onPaginationChange={setPagination}
      />
    </div>
  )
}

export default memo(MeetingRoomList)
