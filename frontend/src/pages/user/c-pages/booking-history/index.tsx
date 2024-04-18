import { memo, useState } from 'react'
import { columns } from './columns'
import { DataTable } from '@/components/data-table'
import { BookingStatus, IBookingPaginationParams, useBookingList } from '@/service/hooks/useBookingList'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { IPaginationParams } from '@/service/type'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { PaginationState } from '@tanstack/react-table'
import { DateTimePicker } from '@/components/date-time-picker'
import { getLocalTimeZone, parseAbsoluteToLocal } from '@internationalized/date'
import dayjs from 'dayjs'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useShallow, useUserStore } from '@/store'

type SearchParams = Omit<IBookingPaginationParams, keyof IPaginationParams>

function BookingHistory() {
  const userInfo = useUserStore(useShallow((state) => state.userInfo))
  const [params, setParams] = useState<SearchParams>({
    username: userInfo?.username,
    meetingRoomName: '',
    bookingTimeStart: dayjs().subtract(30, 'day').toISOString(),
    bookingTimeEnd: dayjs().toISOString(),
    bookingPosition: '',
    status: undefined
  })
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0, //initial page index
    pageSize: 10 //default page size
  })
  const { bookingList, mutate } = useBookingList({
    pageNo: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    ...params
  })

  const form = useForm<SearchParams>({
    defaultValues: params
  })

  const submit = () => {
    const values = form.getValues()
    console.log('🚀 ~ file: index.tsx ~ line 38 ~ submit ~ values', values)
    setParams(values)
    mutate()
  }

  return (
    <div className="container mx-auto py-10 min-w-0">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submit)}>
          <div className="flex gap-4 py-4 flex-wrap">
            <FormField
              control={form.control}
              name="meetingRoomName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="text" placeholder="请输入会议室名称" className="w-auto" {...field} />
                  </FormControl>
                  {/* <FormDescription>This is your public display name.</FormDescription> */}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bookingPosition"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="请输入预订位置" className="w-auto" {...field} />
                  </FormControl>
                  {/* <FormDescription>This is your public display name.</FormDescription> */}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        field.onChange({ target: { value } })
                      }}
                      value={field.value}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="请选择状态" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>状态</SelectLabel>
                          {Object.values(BookingStatus).map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  {/* <FormDescription>This is your public display name.</FormDescription> */}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bookingTimeStart"
              render={({ field }) => (
                <FormItem className="flex items-center space-y-0">
                  <FormLabel className="pr-2 whitespace-nowrap">预订开始时间</FormLabel>
                  <FormControl>
                    <DateTimePicker
                      label="bookingTimeStart"
                      granularity="second"
                      value={field.value ? parseAbsoluteToLocal(dayjs(field.value).format()) : null}
                      onChange={(dateValue) => {
                        field.onChange({
                          target: { value: dateValue && new Date(dateValue.toDate(getLocalTimeZone())).toISOString() }
                        })
                      }}
                      hideTimeZone
                    />
                  </FormControl>
                  {/* <FormDescription>This is your public display name.</FormDescription> */}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bookingTimeEnd"
              render={({ field }) => (
                <FormItem className="flex items-center space-y-0">
                  <FormLabel className="pr-2 whitespace-nowrap">预订结束时间</FormLabel>
                  <FormControl>
                    <DateTimePicker
                      label="bookingTimeEnd"
                      granularity="second"
                      value={field.value ? parseAbsoluteToLocal(dayjs(field.value).format()) : null}
                      onChange={(dateValue) => {
                        field.onChange({
                          target: { value: dateValue && new Date(dateValue.toDate(getLocalTimeZone())).toISOString() }
                        })
                      }}
                      hideTimeZone
                    />
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
        data={bookingList?.bookings || []}
        rowCount={bookingList?.totalCount || 0}
        defaultPagination={pagination}
        onPaginationChange={setPagination}
      />
    </div>
  )
}

export default memo(BookingHistory)
