<template>
  <div class="auth-page">
    <div class="ambient" />
    <div class="auth-layout">
      <AuthBrandPanel class="desktop-brand" />

      <section class="auth-panel register-panel">
        <div class="auth-card">
          <div class="auth-title">
            <p>Crie sua conta</p>
            <h2>Comece a lucrar hoje.</h2>
            <span>Crie sua conta gratuitamente.</span>
          </div>

          <div class="oauth-grid">
            <button aria-label="Google"><Chrome :size="22" /></button>
            <button aria-label="Apple"><Apple :size="22" /></button>
            <button aria-label="E-mail"><Mail :size="22" /></button>
          </div>

          <div class="divider"><span>Ou continue com</span></div>

          <form class="auth-form" @submit.prevent="handleRegister">
            <label>Nome completo<div class="field-with-icon"><User :size="15" /><input v-model="name" placeholder="João Silva"></div></label>
            <label>E-mail<div class="field-with-icon"><Mail :size="15" /><input v-model="email" type="email" placeholder="nome@email.com"></div></label>
            <label>Senha<div class="field-with-icon"><Lock :size="15" /><input v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="Mínimo 8 caracteres"><button type="button" @click="showPassword = !showPassword"><component :is="showPassword ? EyeOff : Eye" :size="15" /></button></div></label>
            <label>Confirmar senha<div class="field-with-icon"><Lock :size="15" /><input v-model="confirmPassword" :type="showConfirm ? 'text' : 'password'" placeholder="Repita a senha"><button type="button" @click="showConfirm = !showConfirm"><component :is="showConfirm ? EyeOff : Eye" :size="15" /></button></div></label>
            <label>Código de indicação <small>(opcional)</small><div class="field-with-icon"><Link2 :size="15" /><input v-model="referral" placeholder="Código de afiliado"></div></label>

            <label class="terms">
              <input v-model="accepted" type="checkbox">
              <span>Li e aceito os <a href="#">Termos de uso</a> e <a href="#">Política de privacidade</a></span>
            </label>

            <p v-if="errorMessage" class="auth-error" style="margin: 0; color: #ff6b6b; font-size: 13px;">{{ errorMessage }}</p>
            <button class="btn btn-primary submit-btn" type="submit" :disabled="loading">{{ loading ? 'Criando...' : 'Criar conta' }}</button>
          </form>

          <p class="switch-link">Já tem uma conta? <NuxtLink to="/login">Entrar</NuxtLink></p>
        </div>

        <footer><span class="pulse-dot" />274 oportunidades de arbitragem ao vivo agora</footer>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Apple, Chrome, Eye, EyeOff, Link2, Lock, Mail, User } from 'lucide-vue-next'

definePageMeta({ layout: false })

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const referral = ref('')
const accepted = ref(false)
const showPassword = ref(false)
const showConfirm = ref(false)
const loading = ref(false)
const errorMessage = ref('')
const { register } = useAuth()

const handleRegister = async () => {
  errorMessage.value = ''
  if (password.value.length < 8) {
    errorMessage.value = 'A senha deve ter no mínimo 8 caracteres'
    return
  }
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'As senhas não coincidem'
    return
  }
  loading.value = true
  try {
    await register({
      name: name.value,
      email: email.value,
      password: password.value,
      referralCode: referral.value || undefined,
    })
    await navigateTo('/dashboard')
  } catch (error) {
    const status = (error as { statusCode?: number }).statusCode
    errorMessage.value =
      status === 409
        ? 'Este email já está em uso'
        : status === 400
          ? 'Verifique os dados informados'
          : 'Não foi possível criar a conta agora'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@import '~/assets/css/auth.css';

.terms {
  display: flex !important;
  flex-direction: row !important;
  gap: 12px;
  color: var(--muted);
  font-size: 13px !important;
  line-height: 1.5;
  text-transform: none !important;
  letter-spacing: 0 !important;
}

.terms input {
  width: 18px;
  height: 18px;
  margin-top: 1px;
  accent-color: var(--accent);
}

.terms a {
  color: var(--accent);
  text-decoration: none;
}
</style>
