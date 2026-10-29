import { ContentProvider } from '@/features/content/components/ContentProvider'
import { BirdCatalogueProvider } from '@/features/birds/components/BirdCatalogueProvider'
import { RouterProvider } from 'react-router-dom'

import { MammalPhotoProvider } from '@/features/mammals/components/MammalPhotoProvider/MammalPhotoProvider'

import { router } from './router'

export function App() {
  return <BirdCatalogueProvider><ContentProvider><MammalPhotoProvider><RouterProvider router={router} /></MammalPhotoProvider></ContentProvider></BirdCatalogueProvider>
}
