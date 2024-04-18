import { Button } from '@/components/ui/button'

import { memo } from 'react'
import type { PropsWithChildren, FC } from 'react'
import { Outlet, To, useLocation, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import cls from 'classnames'

interface IManagementProps {
  menus: { label: string; href: To }[]
}

const Management: FC<PropsWithChildren<IManagementProps>> = (props) => {
  const { menus } = props
  const navigate = useNavigate()
  const location = useLocation()
  const currentLabel = menus.find((menu) => menu.href === location.pathname)?.label
  return (
    <div className="flex-1 grid w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full flex-col gap-2">
          <div className="flex-1 pt-2">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {menus.map((menu) => (
                <a
                  className={cls([
                    'flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground cursor-pointer',
                    currentLabel === menu.label ? '!text-foreground' : ''
                  ])}
                  key={menu.label}
                  onClick={() => navigate(menu.href)}
                >
                  {menu.label}
                </a>
              ))}
            </nav>
          </div>
          <div className="mt-auto p-4">
            <Card>
              <CardHeader className="p-2 pt-0 md:p-4">
                <CardTitle>Upgrade to Pro</CardTitle>
                <CardDescription>Unlock all features and get unlimited access to our support team.</CardDescription>
              </CardHeader>
              <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                <Button size="sm" className="w-full">
                  Upgrade
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 md:hidden">
          <nav className="flex gap-4 font-medium">
            {menus.map((menu) => (
              <a
                className={cls([
                  'text-muted-foreground hover:text-foreground cursor-pointer',
                  location.pathname === menu.href ? '!text-foreground' : 'text-muted-foreground'
                ])}
                key={menu.label}
                onClick={() => navigate(menu.href)}
              >
                {menu.label}
              </a>
            ))}
          </nav>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <div className="flex items-center">
            <h1 className="text-lg font-semibold md:text-2xl">{currentLabel || ''}</h1>
          </div>
          <div className="rounded-lg border border-dashed shadow-sm">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

Management.displayName = 'Management'

export default memo(Management)
