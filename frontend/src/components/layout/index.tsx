import {
  CircleUser,
  Menu
  // Search
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
// import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Outlet, To, useLocation, useNavigate } from 'react-router-dom'
import cls from 'classnames'
import { Suspense, useEffect, useState } from 'react'
import UpdatePassword from '@/components/update-password'
import UpdateInfo from '@/components/update-info'
import { useUserStore, useShallow } from '@/store'
import { pick } from 'radash'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Logo from '@/assets/logo.svg?react'
import { clearToken } from '@/utils/clear'

interface ILayoutProps {
  menus: { label: string; href: To }[]
  onSetting?: () => void
  onSupport?: () => void
  onProfile?: () => void
  onLogout?: () => void
  onResettingPassword?: () => void
}

export function Layout(props: ILayoutProps) {
  const { menus } = props
  const location = useLocation()
  const navigate = useNavigate()
  const { userInfo, reset } = useUserStore(
    useShallow((state) => ({
      userInfo: state.userInfo,
      reset: state.reset
    }))
  )

  useEffect(() => {
    if (!userInfo || !userInfo.id) navigate('/login')
  }, [userInfo, navigate])

  const [resetPwdDialogOpen, setResetPwdDialogOpen] = useState(false)
  const [updateInfoDialogOpen, setUpdateInfoDialogOpen] = useState(false)

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <a href="#" className="flex items-center gap-2 text-lg font-semibold md:text-base">
            <Logo className="h-6 w-6" />
            <h1>BOOKING</h1>
          </a>
          {menus.map((menu) => (
            <a
              className={cls([
                'transition-colors whitespace-nowrap cursor-pointer hover:text-foreground',
                location.pathname === menu.href ? 'text-foreground' : 'text-muted-foreground'
              ])}
              key={menu.label}
              onClick={() => navigate(menu.href)}
            >
              {menu.label}
            </a>
          ))}
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              <a href="#" className="flex items-center gap-2 text-lg font-semibold">
                <Logo className="h-6 w-6" />
                <h1>BOOKING</h1>
              </a>
              {menus.map((menu) => (
                <a
                  className={cls([
                    'hover:text-foreground',
                    location.pathname === menu.href ? 'text-foreground' : 'text-muted-foreground'
                  ])}
                  key={menu.label}
                  onClick={() => navigate(menu.href)}
                >
                  {menu.label}
                </a>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <form className="ml-auto flex-1 sm:flex-initial">
            {/* <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
              />
            </div> */}
          </form>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                {userInfo?.headPic ? (
                  <Avatar>
                    <AvatarImage src={userInfo.headPic} alt="avatar" />
                    <AvatarFallback>头像</AvatarFallback>
                  </Avatar>
                ) : (
                  <CircleUser className="h-5 w-5" />
                )}

                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>我的账户</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>设置</DropdownMenuItem>
              <DropdownMenuItem>支持</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setUpdateInfoDialogOpen(true)}>个人信息</DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  clearToken()
                  reset()
                  navigate(userInfo?.isAdmin ? '/admin/login' : '/login')
                }}
              >
                退出登录
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setResetPwdDialogOpen(true)}>修改密码</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-2 md:gap-8 md:p-4">
        <Suspense fallback={'loading...'}>
          <Outlet />
          <UpdatePassword open={resetPwdDialogOpen} onOpenChange={setResetPwdDialogOpen} />
          {userInfo && (
            <UpdateInfo
              defaultValues={pick(userInfo, ['email', 'headPic', 'nickName'])}
              open={updateInfoDialogOpen}
              onOpenChange={setUpdateInfoDialogOpen}
            />
          )}
        </Suspense>
      </main>
    </div>
  )
}
