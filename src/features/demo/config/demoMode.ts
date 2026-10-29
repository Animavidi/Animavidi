import {personalStorage} from '@/features/accounts/data/personalStorage'
export const demoMode = {
  enabled: true,
  user: {
    id: 'animavidi-demo-explorer',
    displayName: 'Animavidi Explorer',
  },
  routes: {
    newExplorer: '/account/create',
    returningExplorer: '/login',
    unavailable: '/full-version',
  },
} as const

export const demoUserDisplayNameKey = 'animavidi:demo-user-display-name'

export function activateDemoUser() {
  personalStorage.setItem('animavidi:onboarding-complete', 'true')
  personalStorage.setItem('animavidi:demo-user', demoMode.user.id)
  personalStorage.setItem(demoUserDisplayNameKey, demoMode.user.displayName)
}

export function getDemoUserDisplayName() {
  const storedName = personalStorage.getItem(demoUserDisplayNameKey)?.trim()
  if (storedName) return storedName

  const storedUserId = personalStorage.getItem('animavidi:demo-user')
  return storedUserId === demoMode.user.id ? demoMode.user.displayName : null
}
