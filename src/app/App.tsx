import {useEffect} from 'react'
import {AppUpdates} from '@/features/accounts/components/AppUpdates'
import {AccountProvider} from '@/features/accounts/components/AccountProvider'
import { ContentProvider } from '@/features/content/components/ContentProvider'
import { BirdCatalogueProvider } from '@/features/birds/components/BirdCatalogueProvider'
import { RouterProvider } from 'react-router-dom'

import { MammalPhotoProvider } from '@/features/mammals/components/MammalPhotoProvider/MammalPhotoProvider'

import { router } from './router'

export function App() {
  useEffect(()=>{document.getElementById("app-launch")?.remove()},[])
  return <AccountProvider><AppUpdates /><BirdCatalogueProvider><ContentProvider><MammalPhotoProvider><RouterProvider router={router} /></MammalPhotoProvider></ContentProvider></BirdCatalogueProvider></AccountProvider>
}
