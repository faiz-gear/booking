import { memo, useCallback, useState, ReactNode } from 'react'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Control, FieldValues, FieldPath } from 'react-hook-form'
import { useToast } from '../ui/use-toast'

// eslint-disable-next-line @typescript-eslint/ban-types , @typescript-eslint/no-explicit-any
interface ICaptchaProps<Values extends Record<string, any> = {}> {
  fieldName: FieldPath<Values>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<Values, any>
  beforeSend: () => Promise<string | undefined>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getCaptcha: (email: string | undefined) => Promise<any>
}

// eslint-disable-next-line @typescript-eslint/ban-types
const Captcha: <T extends FieldValues = {}>(props: ICaptchaProps<T>) => ReactNode = memo((props) => {
  const { fieldName, control, beforeSend, getCaptcha } = props
  const { toast } = useToast()
  const [remainingTime, setRemainingTime] = useState(0)
  const sendCaptcha = useCallback(async () => {
    try {
      const email = await beforeSend()
      await getCaptcha(email)
      toast({
        title: '验证码已发送'
      })
      let time = 60
      setRemainingTime(time)
      const timer = setInterval(() => {
        time--
        setRemainingTime(time)
        if (time === 0) {
          clearInterval(timer)
        }
      }, 1000)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.log('🚀 ~ file: index.tsx ~ line 42 ~ sendCaptcha ~ err', err)
      toast({
        title: '发送验证码失败',
        description: err?.message || err?.statusText,
        variant: 'destructive'
      })
    }
  }, [beforeSend, getCaptcha, toast])
  return (
    <FormField
      control={control}
      name={fieldName}
      render={({ field }) => (
        <FormItem>
          <FormLabel>验证码</FormLabel>
          <FormControl>
            <div className="flex gap-4">
              <Input {...field} />
              <Button type="button" variant="outline" disabled={remainingTime !== 0} onClick={sendCaptcha}>
                {remainingTime === 0 ? '发送验证码' : `${remainingTime}秒后重新发送`}
              </Button>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
})

export default Captcha
