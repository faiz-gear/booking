import { memo } from 'react'
import type { PropsWithChildren, FC } from 'react'

interface IDashboardProps {}

const Dashboard: FC<PropsWithChildren<IDashboardProps>> = () => {
  return <div>Dashboard</div>
}

export default memo(Dashboard)
