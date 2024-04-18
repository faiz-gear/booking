import { memo, useRef } from 'react'
import type { PropsWithChildren, FC, ElementRef } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'

interface IConfirmAlertProps {
  title: string
  description?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onConfirm?: () => Promise<any>
}

const ConfirmAlert: FC<PropsWithChildren<IConfirmAlertProps>> = (props) => {
  const { title, description, onConfirm, children } = props
  const cancelRef = useRef<ElementRef<typeof AlertDialogCancel>>(null)

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel ref={cancelRef}>取消</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              await onConfirm?.()
              cancelRef.current?.click()
            }}
          >
            确认
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default memo(ConfirmAlert)
