import { ContentProvider } from '@/features/content/components/ContentProvider'
import { RouterProvider } from 'react-router-dom'

import { MammalPhotoProvider } from '@/features/mammals/components/MammalPhotoProvider/MammalPhotoProvider'

import { router } from './router'

export function App() {
  return <ContentProvider><MammalPhotoProvider><RouterProvider router={router} /></MammalPhotoProvider></ContentProvider>
}
