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

export function activateDemoUser() {
  localStorage.setItem('animavidi:onboarding-complete', 'true')
  localStorage.setItem('animavidi:demo-user', demoMode.user.id)
}
