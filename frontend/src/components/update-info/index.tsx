import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input, InputProps } from '@/components/ui/input'
import { FC, memo, useCallback, useRef, useState } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Separator } from '../ui/separator'
import { z } from 'zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { getUpdateInfoCaptcha, updateInfo, uploadAvatar, updateAdminInfo } from '@/service/user'
import Captcha from '../captcha'
import { useToast } from '../ui/use-toast'
import { omit } from 'radash'
import { useShallow, useUserStore } from '@/store'
import { useUserInfo } from '@/service/hooks/useUserInfo'
import { refreshToken } from '@/service/request'

export interface IUpdatePasswordProps extends DialogPrimitive.DialogProps {
  defaultValues?: {
    headPic: string
    nickName: string
    email: string
  }
  onSuccess?: () => void
}

const formSchema = z.object({
  headPic: z.optional(z.string()).readonly(),
  nickName: z.optional(z.string()),
  email: z
    .string({
      required_error: '邮箱不能为空'
    })
    .email({
      message: '邮箱格式不正确'
    }),
  captcha: z.string({
    required_error: '验证码不能为空'
  })
})

const UpdateInfo: FC<IUpdatePasswordProps> = (props) => {
  const { defaultValues } = props
  const { toast } = useToast()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      headPic: defaultValues?.headPic ?? '',
      nickName: defaultValues?.nickName ?? '',
      email: defaultValues?.email ?? ''
    }
  })
  const { isAdmin, setUserInfo } = useUserStore(
    useShallow((state) => ({
      isAdmin: state.userInfo?.isAdmin,
      setUserInfo: state.setUserInfo
    }))
  )
  const { mutate } = useUserInfo({
    revalidateOnMount: false
  })

  const uploadAvatarRef = useRef<HTMLInputElement>(null)
  const [currentSelectedFile, setCurrentSelectedFile] = useState<File | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const selectFile = useCallback(() => {
    uploadAvatarRef.current?.click()
  }, [])
  const handleFileInputChange = useCallback<NonNullable<InputProps['onChange']>>((e) => {
    const file = e.target.files?.[0]
    if (file) {
      setCurrentSelectedFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setAvatarUrl(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const beforeSend = useCallback(async () => {
    const isValid = await form.trigger('email')
    if (!isValid) return Promise.reject()
    return undefined
  }, [form])
  const getCaptcha = useCallback(async () => await getUpdateInfoCaptcha(), [])

  const updateUserInfoFunc = isAdmin ? updateAdminInfo : updateInfo
  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      let headPic: string | undefined
      if (currentSelectedFile) {
        const { data: newHeadPic } = await uploadAvatar(currentSelectedFile)
        headPic = newHeadPic
      } else {
        headPic = values.headPic
      }
      const res = await updateUserInfoFunc({ ...values, headPic })

      if (res.code === 200 || res.code === 201) {
        toast({
          title: '更新个人信息成功'
        })
        // 需要重新刷新token,更新token里面的用户信息
        await refreshToken()
        const userInfo = await mutate()
        userInfo && setUserInfo(userInfo)
      } else {
        toast({
          title: '更新个人信息失败',
          description: res.data,
          variant: 'destructive'
        })
      }
    },
    [toast, currentSelectedFile, updateUserInfoFunc, mutate, setUserInfo]
  )

  return (
    <Dialog {...props}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>个人信息</DialogTitle>
          <DialogDescription>这里是有关于你个人的账户信息</DialogDescription>
        </DialogHeader>
        <Separator className="my-2" />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="grid items-center gap-2">
                <FormField
                  control={form.control}
                  name="headPic"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex flex-col items-center gap-2">
                        <Avatar className="w-20 h-20">
                          <AvatarImage
                            src={avatarUrl || field.value || 'https://avatars.githubusercontent.com/u/70053309?v=4'}
                            alt="@faiz-gear"
                          />
                          <AvatarFallback>头像</AvatarFallback>
                        </Avatar>
                        <FormControl>
                          <Input
                            {...omit(field, ['value'])}
                            ref={uploadAvatarRef}
                            placeholder="头像"
                            type="file"
                            className="hidden"
                            onClick={(e) => {
                              console.log('click')
                              e.stopPropagation()
                            }}
                            onChange={(e) => {
                              handleFileInputChange(e)
                            }}
                          />
                        </FormControl>
                        <div className="flex justify-center">
                          <Button type="button" variant="link" className="outline-none" onClick={selectFile}>
                            上传头像
                          </Button>
                          <Button
                            type="button"
                            variant="link"
                            className="outline-none text-destructive"
                            onClick={selectFile}
                          >
                            删除头像
                          </Button>
                        </div>
                      </div>
                      <FormDescription className="text-center">上传一张清晰的jpg或png作为头像吧~</FormDescription>
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid  items-center gap-4">
                <FormField
                  control={form.control}
                  name="nickName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>昵称</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="昵称" />
                      </FormControl>
                      <FormDescription>设置一个独一无二的昵称~</FormDescription>
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid  items-center gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>邮箱</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="邮箱" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid  items-center gap-4">
                <Captcha control={form.control} fieldName="captcha" beforeSend={beforeSend} getCaptcha={getCaptcha} />
              </div>
            </div>
            <Button type="submit" className="w-full">
              保存修改
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

UpdateInfo.displayName = 'UpdateInfo'

export default memo(UpdateInfo)
