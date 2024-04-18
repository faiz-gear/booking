import { memo } from 'react'
import type { PropsWithChildren, FC } from 'react'

interface IErrorPageProps {}

const ErrorPage: FC<PropsWithChildren<IErrorPageProps>> = () => {
  return <div>ErrorPage</div>
}

export default memo(ErrorPage)
