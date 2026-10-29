import {InstallPage} from '@/features/accounts/routes/InstallPage'
import {AccountGuard} from '@/features/accounts/components/AccountGuard'
import {AccountAccessPage} from '@/features/accounts/routes/AccountAccessPage'
import type {RouteObject} from 'react-router-dom'
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

const PhotoCreditsPage = lazy(() => import('@/features/media/routes/PhotoCreditsPage').then((module) => ({ default: module.PhotoCreditsPage })))
const SafariRoutesPage = lazy(() => import('@/features/routes/routes/SafariRoutesPage').then((module) => ({ default: module.SafariRoutesPage })))
const BirdsPage = lazy(() => import('@/features/birds/routes/BirdsPage').then((module) => ({ default: module.BirdsPage })))
const ProposeBirdPage = lazy(() => import('@/features/birds/routes/ProposeBirdPage').then((module) => ({ default: module.ProposeBirdPage })))
const AdminBirdProposalsPage = lazy(() => import('@/features/admin/routes/AdminBirdProposalsPage').then((module) => ({ default: module.AdminBirdProposalsPage })))

const ParkMapPage = lazy(() => import('@/features/map/routes/ParkMapPage').then((module) => ({ default: module.ParkMapPage })))
const PassportPage = lazy(() => import('@/features/passport/routes/PassportPage').then((module) => ({ default: module.PassportPage })))
const MyAnimavidiPage = lazy(() => import('@/features/passport/routes/MyAnimavidiPage').then((module) => ({ default: module.MyAnimavidiPage })))
const ParkInformationPage = lazy(() => import('@/features/information/routes/ParkInformationPage').then((module) => ({ default: module.ParkInformationPage })))
const ParkInformationErrorPage = lazy(() => import('@/features/information/routes/ParkInformationPage').then((module) => ({ default: module.ParkInformationErrorPage })))
const AdminRoutesPage = lazy(() => import('@/features/admin/routes/AdminRoutesPage').then((module) => ({ default: module.AdminRoutesPage })))
const AdminRoot = lazy(() => import('@/features/admin/routes/AdminRoot').then((module) => ({ default: module.AdminRoot })))
const AdminProtectedRoute = lazy(() => import('@/features/admin/routes/AdminRoot').then((module) => ({ default: module.AdminProtectedRoute })))
const AdminShell = lazy(() => import('@/features/admin/components/AdminShell').then((module) => ({ default: module.AdminShell })))
const AdminLoginPage = lazy(() => import('@/features/admin/routes/AdminLoginPage').then((module) => ({ default: module.AdminLoginPage })))
const AdminHomePage = lazy(() => import('@/features/admin/routes/AdminHomePage').then((module) => ({ default: module.AdminHomePage })))
const AdminReportsPage = lazy(() => import('@/features/admin/routes/AdminReportsPage').then((module) => ({ default: module.AdminReportsPage })))
const AdminContentPage = lazy(() => import('@/features/admin/routes/AdminContentPage').then((module) => ({ default: module.AdminContentPage })))
const AdminAnimalsPage = lazy(() => import('@/features/admin/routes/AdminAnimalsPage').then((module) => ({ default: module.AdminAnimalsPage })))
const AdminAnimalPage = lazy(() => import('@/features/admin/routes/AdminAnimalPage').then((module) => ({ default: module.AdminAnimalPage })))

const existingRoutes:RouteObject[] = [
  { path: '/my-animavidi',element:<Suspense fallback={<p role="status">Opening your journal settings…</p>}><MyAnimavidiPage /></Suspense> },
  { path: '/my-camps',element:<Navigate replace to="/my-animavidi#my-camps" /> },
  { path: '/parks/kruger/birds/propose', element: <Suspense fallback={<p role="status">Opening bird proposal…</p>}><ProposeBirdPage /></Suspense> },
  { path: '/photo-credits', element: <Suspense fallback={<p role="status">Loading photo credits…</p>}><PhotoCreditsPage /></Suspense> },
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
            { path: 'routes', element: <AdminRoutesPage /> },
            { path: 'reports', element: <AdminReportsPage /> },
            { path: 'bird-proposals', element: <AdminBirdProposalsPage /> },
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
  { path: '/parks/kruger/routes', element: <Suspense fallback={<p role="status">Loading routes…</p>}><SafariRoutesPage /></Suspense> },
  { path: '/parks/kruger/birds', element: <Suspense fallback={<p role="status">Loading birds…</p>}><BirdsPage /></Suspense> },
  { path: '/parks/kruger/birds/:animalId', element: <MammalDetailPage /> },
  { path: '/parks/kruger/birds/:animalId/sightings/new', element: <NewSightingPage /> },
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
]

const publicPaths=new Set(['/','/admin'])
const replacedPaths=new Set(['/login','/account/create'])
export const router=createBrowserRouter([
  {path:'/install',element:<InstallPage />},
  {path:'/login',element:<AccountAccessPage />},
  {path:'/account/create',element:<AccountAccessPage />},
  {path:'/account/forgot',element:<AccountAccessPage />},
  {path:'/account/reset',element:<AccountAccessPage />},
  ...existingRoutes.filter(route=>publicPaths.has(route.path ?? '')),
  {element:<AccountGuard />,children:existingRoutes.filter(route=>!publicPaths.has(route.path ?? '')&&!replacedPaths.has(route.path ?? ''))},
])
