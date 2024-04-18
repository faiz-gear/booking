import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { Label } from '@/components/ui/label'
import { FC, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { adminLogin, login } from '@/service/login'
import { useToast } from '@/components/ui/use-toast'
import { useNavigate } from 'react-router-dom'
import UpdatePassword from '@/components/update-password'
import Logo from '@/assets/logo.svg?react'
import { useUserInfo } from '@/service/hooks/useUserInfo'
import { useUserStore, useShallow } from '@/store'
import { clearToken } from '@/utils/clear'

const appName: string = import.meta.env.VITE_APP_SYSTEM_NAME

const formSchema = z.object({
  username: z
    .string({
      required_error: '用户名不能为空'
    })
    .min(2, {
      message: '用户名长度必须大于2个字符'
    }),
  password: z
    .string({
      required_error: '密码不能为空'
    })
    .min(6, '密码长度必须大于6个字符')
})

export interface ILoginProps {
  isAdmin?: boolean
}

const Login: FC<ILoginProps> = (props) => {
  const { isAdmin } = props

  const { toast } = useToast()
  const navigate = useNavigate()
  const { mutate } = useUserInfo({
    revalidateOnMount: false
  })
  const setUserInfo = useUserStore(useShallow((state) => state.setUserInfo))

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: ''
    }
  })

  const loginFunc = isAdmin ? adminLogin : login

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)

    const res = await loginFunc(values.username, values.password)

    if (res.code === 200 || res.code === 201) {
      localStorage.setItem('accessToken', res.data.accessToken)
      localStorage.setItem('refreshToken', res.data.refreshToken)

      const userInfo = await mutate()
      if (userInfo) {
        setUserInfo(userInfo)
      }

      if (userInfo) {
        toast({
          title: '登录成功'
        })
        navigate('/')
      }
    } else {
      toast({
        title: '登录失败',
        description: res.data,
        variant: 'destructive'
      })
      clearToken()
    }
  }

  const [updatePwdOpen, setUpdatePwdOpen] = useState(false)

  return (
    <div className="flex items-center h-full">
      <div className="fixed left-8 top-8 flex items-center gap-2 text-sm font-bold">
        <Logo className="w-8 h-8" />
        <h1>Booking</h1>
      </div>
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">{appName + (isAdmin ? '——管理员' : '')}</CardTitle>
          <CardDescription>输入你的账户密码登录</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  {/* <Label htmlFor="username">用户名</Label>
                  <Input id="username" type="username" placeholder="m@example.com" required /> */}
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>用户名</FormLabel>
                        <FormControl>
                          <Input placeholder="m@example.com" {...field} />
                        </FormControl>
                        {/* <FormDescription>This is your public display name.</FormDescription> */}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  {/* <div className="flex items-center">
                    <Label htmlFor="password">密码</Label>
                    <a href="#" className="ml-auto inline-block text-sm underline">
                      忘记密码?
                    </a>
                  </div>
                  <Input id="password" type="password" required /> */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <div className="flex items-center">
                            <span>密码</span>
                            <a
                              href="#"
                              className="ml-auto inline-block text-sm underline"
                              onClick={() => setUpdatePwdOpen(true)}
                            >
                              忘记密码?
                            </a>
                          </div>
                        </FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        {/* <FormDescription>This is your public display name.</FormDescription> */}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" className="w-full">
                  登录
                </Button>
              </div>
            </form>

            {!isAdmin && (
              <div className="mt-4 text-center text-sm">
                没有账号?
                <a href="#" className="underline" onClick={() => navigate('/register')}>
                  注册
                </a>
              </div>
            )}
          </Form>
        </CardContent>
      </Card>
      <UpdatePassword
        modal={false}
        open={updatePwdOpen}
        onOpenChange={setUpdatePwdOpen}
        onSuccess={() => setUpdatePwdOpen(false)}
      />
    </div>
  )
}

export default Login
