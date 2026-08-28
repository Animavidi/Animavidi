export const demoMode = {
  enabled: true,
  user: {
    id: 'animavidi-demo-explorer',
    displayName: 'Animavidi Explorer',
  },
  routes: {
    newExplorer: '/demo/new-explorer',
    returningExplorer: '/demo/returning-explorer',
    unavailable: '/full-version',
  },
} as const

export const demoUserDisplayNameKey = 'animavidi:demo-user-display-name'

export function activateDemoUser() {
  localStorage.setItem('animavidi:onboarding-complete', 'true')
  localStorage.setItem('animavidi:demo-user', demoMode.user.id)
  localStorage.setItem(demoUserDisplayNameKey, demoMode.user.displayName)
}

export function getDemoUserDisplayName() {
  const storedName = localStorage.getItem(demoUserDisplayNameKey)?.trim()
  if (storedName) return storedName

  const storedUserId = localStorage.getItem('animavidi:demo-user')
  return storedUserId === demoMode.user.id ? demoMode.user.displayName : null
}
