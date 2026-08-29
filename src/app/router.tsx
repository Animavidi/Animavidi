import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'

import { DemoEntryPage } from '@/features/demo/routes/DemoEntryPage'
import { DemoUnavailablePage } from '@/features/demo/routes/DemoUnavailablePage'
import { MammalDetailPage } from '@/features/mammals/routes/MammalDetailPage'
import { MammalsPage } from '@/features/mammals/routes/MammalsPage'
import { NewSightingPage } from '@/features/mammals/routes/NewSightingPage'
import { KrugerHomePage } from '@/features/parks/routes/KrugerHomePage'
import { EditSightingPage } from '@/features/sightings/routes/EditSightingPage'
import { MySightingsPage } from '@/features/sightings/routes/MySightingsPage'
import { SightingDetailPage } from '@/features/sightings/routes/SightingDetailPage'
import { LocationPage } from '@/features/onboarding/routes/LocationPage'
import { WelcomePage } from '@/features/welcome/routes/WelcomePage'

const ParkMapPage = lazy(() => import('@/features/map/routes/ParkMapPage').then((module) => ({ default: module.ParkMapPage })))
const PassportPage = lazy(() => import('@/features/passport/routes/PassportPage').then((module) => ({ default: module.PassportPage })))
const ParkInformationPage = lazy(() => import('@/features/information/routes/ParkInformationPage').then((module) => ({ default: module.ParkInformationPage })))
const ParkInformationErrorPage = lazy(() => import('@/features/information/routes/ParkInformationPage').then((module) => ({ default: module.ParkInformationErrorPage })))
const AdminRoot = lazy(() => import('@/features/admin/routes/AdminRoot').then((module) => ({ default: module.AdminRoot })))
const AdminProtectedRoute = lazy(() => import('@/features/admin/routes/AdminRoot').then((module) => ({ default: module.AdminProtectedRoute })))
const AdminShell = lazy(() => import('@/features/admin/components/AdminShell').then((module) => ({ default: module.AdminShell })))
const AdminLoginPage = lazy(() => import('@/features/admin/routes/AdminLoginPage').then((module) => ({ default: module.AdminLoginPage })))
const AdminHomePage = lazy(() => import('@/features/admin/routes/AdminHomePage').then((module) => ({ default: module.AdminHomePage })))
const AdminContentPage = lazy(() => import('@/features/admin/routes/AdminContentPage').then((module) => ({ default: module.AdminContentPage })))
const AdminAnimalsPage = lazy(() => import('@/features/admin/routes/AdminAnimalsPage').then((module) => ({ default: module.AdminAnimalsPage })))
const AdminAnimalPage = lazy(() => import('@/features/admin/routes/AdminAnimalPage').then((module) => ({ default: module.AdminAnimalPage })))

export const router = createBrowserRouter([
  {
    path: '/admin',
    element: <Suspense fallback={<p role="status">Opening Content Admin…</p>}><AdminRoot /></Suspense>,
    children: [
      { path: 'login', element: <AdminLoginPage /> },
      {
        element: <AdminProtectedRoute />,
        children: [{
          element: <AdminShell />,
          children: [
            { index: true, element: <AdminHomePage /> },
            { path: 'content', element: <AdminContentPage /> },
            { path: 'content/animals', element: <AdminAnimalsPage /> },
            { path: 'content/animals/:mammalId', element: <AdminAnimalPage /> },
          ],
        }],
      },
    ],
  },
  {
    path: '/',
    element: <WelcomePage />,
  },
  {
    path: '/onboarding/start',
    element: <DemoEntryPage destination="/onboarding/location" />,
  },
  {
    path: '/onboarding/location',
    element: <LocationPage />,
  },
  {
    path: '/account/create',
    element: <DemoEntryPage destination="/passport?flow=demo" />,
  },
  {
    path: '/login',
    element: <DemoEntryPage destination="/passport?flow=demo" />,
  },
  {
    path: '/onboarding/passport',
    element: <DemoEntryPage destination="/passport?flow=demo" />,
  },
  {
    path: '/onboarding/complete',
    element: <Navigate replace to="/parks/kruger" />,
  },
  {
    path: '/safari/continue',
    element: <DemoEntryPage destination="/passport?flow=demo" />,
  },
  {
    path: '/demo',
    element: <Navigate replace to="/parks/kruger" />,
  },
  {
    path: '/demo/new-explorer',
    element: <DemoEntryPage destination="/onboarding/location" />,
  },
  {
    path: '/demo/returning-explorer',
    element: <DemoEntryPage destination="/passport?flow=demo" />,
  },
  {
    path: '/full-version',
    element: <DemoUnavailablePage />,
  },
  {
    path: '/parks/kruger',
    element: <KrugerHomePage />,
  },
  {
    path: '/parks/kruger/mammals',
    element: <MammalsPage />,
  },
  {
    path: '/parks/kruger/mammals/:animalId',
    element: <MammalDetailPage />,
  },
  {
    path: '/parks/kruger/mammals/:animalId/sightings/new',
    element: <NewSightingPage />,
  },
  {
    path: '/parks/kruger/sightings',
    element: <MySightingsPage />,
  },
  {
    path: '/parks/kruger/sightings/:sightingId',
    element: <SightingDetailPage />,
  },
  {
    path: '/parks/kruger/sightings/:sightingId/edit',
    element: <EditSightingPage />,
  },
  {
    path: '/parks/kruger/map',
    element: <Suspense fallback={<p role="status">Loading Park Map…</p>}><ParkMapPage /></Suspense>,
  },
  {
    path: '/parks/kruger/information',
    element: <Suspense fallback={<p role="status">Opening Park Information…</p>}><ParkInformationPage /></Suspense>,
    errorElement: <Suspense fallback={<p role="status">Opening fallback…</p>}><ParkInformationErrorPage /></Suspense>,
  },
  {
    path: '/passport',
    element: <Suspense fallback={<p role="status">Opening Safari Passport…</p>}><PassportPage /></Suspense>,
  },
  {
    path: '*',
    element: <DemoUnavailablePage />,
  },
])
