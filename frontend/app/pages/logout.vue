<script setup lang="ts">
const { logout } = useAuth()

logout()
await navigateTo('/login', { replace: true })
</script>
