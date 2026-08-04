import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { activateDemoUser } from '@/features/demo/config/demoMode'

type DemoEntryPageProps = {
  destination: string
}

export function DemoEntryPage({ destination }: DemoEntryPageProps) {
  const navigate = useNavigate()

  useEffect(() => {
    activateDemoUser()
    void navigate(destination, { replace: true })
  }, [destination, navigate])

  return <main aria-live="polite" className="routeLoading" role="status">Opening the Animavidi demo…</main>
}
