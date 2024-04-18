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
import { createMeetingRoom } from '@/service/meeting-room'
import { omit } from 'radash'
import { toast } from '@/components/ui/use-toast'

interface IDialogAddingProps {
  onSuccess?: () => void
}

const formSchema = z.object({
  name: z
    .string({
      required_error: '会议室名称不能为空'
    })
    .min(2, {
      message: '会议室名称长度必须大于2个字符'
    }),
  capacity: z
    .string({
      required_error: '容量不能为空'
    })
    .min(1),
  location: z.string({
    required_error: '位置不能为空'
  }),
  equipment: z.optional(z.string()),
  description: z.optional(z.string())
})

const DialogAdding: FC<PropsWithChildren<IDialogAddingProps>> = (props) => {
  const { onSuccess } = props
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  })

  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      console.log('🚀 ~ file: dialog-adding.tsx ~ line 36 ~ onSubmit ~ values', values)
      await createMeetingRoom({
        ...omit(values, ['capacity']),
        capacity: Number(values.capacity)
      })
      toast({
        title: '添加成功'
      })
      onSuccess?.()
      closeButtonRef.current?.click()
    },
    [onSuccess]
  )

  return (
    <Dialog>
      <DialogTrigger className="ml-auto">
        <Button>添加</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md w-fit">
        <DialogHeader>
          <DialogTitle>添加会议室</DialogTitle>
        </DialogHeader>
        <div className="flex items-center h-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-4 w-72">
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>会议室名称</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        {/* <FormDescription>This is your public display name.</FormDescription> */}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="capacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>容量</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>位置</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="equipment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>设备</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid  items-center gap-4">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>描述</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
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

export default memo(DialogAdding)
