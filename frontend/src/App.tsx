import { Toaster } from './components/ui/toaster'
import { Suspense } from 'react'
import AppRouter from './router'

function App() {
  return (
    <>
      <Suspense fallback={'loading...'}>
        <AppRouter />
      </Suspense>
      <Toaster />
    </>
  )
}

export default App
