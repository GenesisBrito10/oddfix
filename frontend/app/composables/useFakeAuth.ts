// Backwards-compatible alias: the app historically imported `useFakeAuth`.
// It now points at the real backend auth composable. Prefer `useAuth` in new code.
export { useAuth as useFakeAuth } from './useAuth'
