import { memo, useCallback } from 'react'
import type { PropsWithChildren, FC } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useToast } from '@/components/ui/use-toast'
import { useNavigate } from 'react-router-dom'
import { getUpdatePasswordCaptcha, updatePassword, updateAdminPassword } from '@/service/user'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import Captcha from '../captcha'
import { useShallow, useUserStore } from '@/store'

interface IUpdatePasswordProps extends DialogPrimitive.DialogProps {
  onSuccess?: () => void
}

const formSchema = z
  .object({
    username: z
      .string({
        required_error: '用户名不能为空'
      })
      .min(2, {
        message: '用户名长度必须大于2个字符'
      }),
    password: z
      .string({
        required_error: '新密码不能为空'
      })
      .min(6, '密码长度必须大于6个字符'),
    confirmPassword: z
      .string({
        required_error: '确认密码不能为空'
      })
      .min(6, '确认密码长度必须大于6个字符'),
    email: z
      .string({
        required_error: '邮箱不能为空'
      })
      .email('邮箱格式不正确'),
    captcha: z.string({
      required_error: '验证码不能为空'
    })
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '两次密码输入不一致',
    path: ['confirmPassword'] // 显示错误信息的字段
  })

const UpdatePassword: FC<PropsWithChildren<IUpdatePasswordProps>> = (props) => {
  const { onSuccess } = props
  const { toast } = useToast()
  const navigate = useNavigate()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
      email: '',
      captcha: ''
    }
  })
  const isAdmin = useUserStore(useShallow((state) => state.userInfo?.isAdmin))

  const beforeSend = useCallback(async () => {
    const isValid = await form.trigger()
    if (!isValid) return Promise.reject()
    return form.getValues('email')
  }, [form])
  const getCaptcha = useCallback(async (email: string | undefined) => await getUpdatePasswordCaptcha(email!), [])

  const updatePasswordFunc = isAdmin ? updateAdminPassword : updatePassword
  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      console.log(values)
      const res = await updatePasswordFunc({
        username: values.username,
        password: values.password,
        email: values.email,
        captcha: values.captcha
      })
      if (res.code === 200 || res.code === 201) {
        toast({
          title: '修改密码成功'
        })
        setTimeout(() => {
          onSuccess?.() || navigate(isAdmin ? '/admin/login' : '/login')
        }, 2000)
      } else {
        toast({
          title: '修改密码失败',
          description: res.data,
          variant: 'destructive'
        })
      }
    },
    [toast, navigate, onSuccess, updatePasswordFunc, isAdmin]
  )

  return (
    <Dialog {...props}>
      <DialogContent className="sm:max-w-md w-fit">
        <DialogHeader>
          <DialogTitle>会议室预订系统-修改密码</DialogTitle>
        </DialogHeader>
        <div className="flex items-center h-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>用户名</FormLabel>
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
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>新密码</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>确认密码</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>邮箱</FormLabel>
                        <FormControl>
                          <Input placeholder="m@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid  items-center gap-4">
                  <Captcha control={form.control} fieldName="captcha" beforeSend={beforeSend} getCaptcha={getCaptcha} />
                </div>
                <Button type="submit" className="w-full">
                  修改
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default memo(UpdatePassword)
