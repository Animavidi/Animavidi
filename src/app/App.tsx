import { RouterProvider } from 'react-router-dom'

import { MammalPhotoProvider } from '@/features/mammals/components/MammalPhotoProvider/MammalPhotoProvider'

import { router } from './router'

export function App() {
  return <MammalPhotoProvider><RouterProvider router={router} /></MammalPhotoProvider>
}
