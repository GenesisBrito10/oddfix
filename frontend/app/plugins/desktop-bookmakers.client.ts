export default defineNuxtPlugin(() => {
  const { startBookmakerClickListener } = useDesktopBookmakers()
  startBookmakerClickListener()
})
