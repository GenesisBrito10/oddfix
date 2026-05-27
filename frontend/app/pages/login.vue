<template>
  <div class="auth-page">
    <div class="ambient" />
    <div class="auth-layout">
      <AuthBrandPanel />

      <section class="auth-panel">
        <div class="auth-card">
          <div class="auth-title">
            <p>Acesse sua conta</p>
            <h2>Bem-vindo de volta.</h2>
            <span>Entre para ver as oportunidades ao vivo.</span>
          </div>

          <div class="oauth-grid">
            <button aria-label="Google"><Chrome :size="22" /></button>
            <button aria-label="Apple"><Apple :size="22" /></button>
            <button aria-label="E-mail"><Mail :size="22" /></button>
          </div>

          <div class="divider"><span>Ou continue com</span></div>

          <form class="auth-form" @submit.prevent="handleLogin">
            <label>
              E-mail de acesso
              <div class="field-with-icon">
                <Mail :size="15" />
                <input v-model="email" type="email" placeholder="nome@email.com">
              </div>
            </label>

            <label>
              <span class="label-row">Senha <NuxtLink to="/esqueci-senha">Esqueceu sua senha?</NuxtLink></span>
              <div class="field-with-icon">
                <Lock :size="15" />
                <input v-model="password" type="password" placeholder="••••••••">
              </div>
            </label>

            <p v-if="errorMessage" class="auth-error" style="margin: 0; color: #ff6b6b; font-size: 13px;">{{ errorMessage }}</p>
            <button class="btn btn-primary submit-btn" type="submit" :disabled="loading">{{ loading ? 'Entrando...' : 'Entrar na plataforma' }}</button>
          </form>

          <p class="switch-link">Não tem uma conta? <NuxtLink to="/register">Cadastre-se</NuxtLink></p>
        </div>

        <footer><span class="pulse-dot" />274 oportunidades de arbitragem ao vivo agora</footer>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Apple, Chrome, Lock, Mail } from 'lucide-vue-next'

definePageMeta({ layout: false })

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')
const { login } = useAuth()

const handleLogin = async () => {
  errorMessage.value = ''
  loading.value = true
  try {
    await login({ email: email.value, password: password.value })
    await navigateTo('/dashboard')
  } catch (error) {
    const status = (error as { statusCode?: number }).statusCode
    errorMessage.value =
      status === 401
        ? 'Email ou senha inválidos'
        : status === 400
          ? 'Verifique os dados informados'
          : 'Não foi possível entrar agora'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@import '~/assets/css/auth.css';
</style>
