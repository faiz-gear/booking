import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { memo, useCallback, useRef } from 'react'
import type { PropsWithChildren, FC } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/components/ui/use-toast'
import { createBooking } from '@/service/booking'
import { DateTimePicker } from '@/components/date-time-picker'
import { getLocalTimeZone, parseAbsoluteToLocal } from '@internationalized/date'
import dayjs from 'dayjs'

interface IDialogBookingProps {
  meetingRoomId: number
  meetingRoomName: string
  onSuccess?: () => void
}

const formSchema = z.object({
  startTime: z.string({
    required_error: '开始时间不能为空'
  }),
  endTime: z.string({
    required_error: '结束时间不能为空'
  }),
  note: z.optional(z.string())
})

const DialogBooking: FC<PropsWithChildren<IDialogBookingProps>> = (props) => {
  const { meetingRoomId, meetingRoomName, onSuccess } = props
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  })

  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      console.log('🚀 ~ file: dialog-adding.tsx ~ line 36 ~ onSubmit ~ values', values)
      await createBooking({
        meetingRoomId,
        ...values
      })
      toast({
        title: '添加预订成功'
      })
      onSuccess?.()
      closeButtonRef.current?.click()
    },
    [meetingRoomId, onSuccess]
  )

  return (
    <Dialog>
      <DialogTrigger className="ml-auto">
        <Button variant={'link'} size={'sm'}>
          预订
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md w-fit">
        <DialogHeader>
          <DialogTitle>预订会议室-{meetingRoomName}</DialogTitle>
        </DialogHeader>
        <div className="flex items-center h-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-4 w-72">
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="pr-2 whitespace-nowrap">开始时间</FormLabel>
                      <FormControl>
                        <DateTimePicker
                          label="startTime"
                          granularity="second"
                          value={field.value ? parseAbsoluteToLocal(dayjs(field.value).format()) : null}
                          onChange={(dateValue) => {
                            field.onChange({
                              target: {
                                value: dateValue && new Date(dateValue.toDate(getLocalTimeZone())).toISOString()
                              }
                            })
                          }}
                          hideTimeZone
                        />
                      </FormControl>
                      <FormMessage />
                      {/* <FormDescription>This is your public display name.</FormDescription> */}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="pr-2 whitespace-nowrap">结束时间</FormLabel>
                      <FormControl>
                        <DateTimePicker
                          label="endTime"
                          granularity="second"
                          value={field.value ? parseAbsoluteToLocal(dayjs(field.value).format()) : null}
                          onChange={(dateValue) => {
                            field.onChange({
                              target: {
                                value: dateValue && new Date(dateValue.toDate(getLocalTimeZone())).toISOString()
                              }
                            })
                          }}
                          hideTimeZone
                        />
                      </FormControl>
                      <FormMessage />
                      {/* <FormDescription>This is your public display name.</FormDescription> */}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>备注</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter className="sm:justify-end">
                  <DialogClose asChild>
                    <Button ref={closeButtonRef} type="button" variant="secondary" className="hidden">
                      关闭
                    </Button>
                  </DialogClose>
                  <Button type="submit" className="w-full">
                    提交
                  </Button>
                </DialogFooter>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default memo(DialogBooking)
