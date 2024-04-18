import { RouteObject } from 'react-router-dom'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type TUserState = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  userInfo: Nullable<Record<string, any>>
  routes: RouteObject[]
}

type TUserActions = {
  setUserInfo: (userInfo: TUserState['userInfo']) => void
  setRoutes: (routes: TUserState['routes']) => void
  reset: () => void
}

const initialState: TUserState = {
  userInfo: null,
  routes: []
}

export const useUserStore = create(
  persist<TUserState & TUserActions>(
    (set) => ({
      ...initialState,
      setUserInfo: (userInfo) => set({ userInfo: userInfo }),
      setRoutes: (routes) => set({ routes: routes }),
      reset: () => set(initialState)
    }), {
      name: 'user',
    }
  )
)

