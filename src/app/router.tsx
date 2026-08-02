import { createBrowserRouter } from 'react-router-dom'

import { PlaceholderPage } from '@/components/PlaceholderPage/PlaceholderPage'
import { WelcomePage } from '@/features/welcome/routes/WelcomePage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <WelcomePage />,
  },
  {
    path: '/safari/new',
    element: <PlaceholderPage />,
  },
  {
    path: '/safari/continue',
    element: <PlaceholderPage />,
  },
  {
    path: '/demo',
    element: <PlaceholderPage />,
  },
])
