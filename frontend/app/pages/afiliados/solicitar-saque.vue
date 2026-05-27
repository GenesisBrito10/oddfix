<template>
  <div v-if="submitted" class="page-wide success-page">
    <div class="success-card">
      <div class="success-icon"><CheckCircle2 :size="32" /></div>
      <h1>Saque solicitado!</h1>
      <strong>R$ {{ formatBRL(valorNum) }}</strong>
      <p>Seu saque foi enviado para análise e será processado em até 2 dias úteis.</p>
      <button class="btn btn-muted" @click="submitted = false">Fazer outro saque</button>
    </div>
  </div>

  <div v-else class="page-wide">
    <div class="page-header">
      <div>
        <h1 class="page-title">Solicitar Saque</h1>
        <p class="page-subtitle">Transferência para sua conta bancária</p>
      </div>
    </div>

    <div class="withdraw-form">
      <section class="panel saldo-card">
        <span class="section-label"><Wallet :size="14" />Saldo disponível</span>
        <strong>R$ {{ formatBRL(saldo) }}</strong>
        <p>Saldo liberado para saque</p>
      </section>

      <section class="panel form-card">
        <label class="field-block">
          <span class="section-label">Valor a sacar</span>
          <div class="money-input" :class="{ error: errors.valor }"><span>R$</span><input v-model="valor" inputmode="decimal" placeholder="0,00" @blur="touched.valor = true"></div>
          <small v-if="errors.valor" class="error-msg">{{ errors.valor }}</small>
        </label>

        <div class="quick-values">
          <button v-for="value in [50, 200, 500, 1000]" :key="value" @click="valor = formatBRL(value); touched.valor = true">R$ {{ value.toLocaleString('pt-BR') }}</button>
          <button class="max" @click="valor = formatBRL(saldo); touched.valor = true">Máximo</button>
        </div>

        <label class="field-block">
          <span class="section-label">Método de recebimento</span>
          <div class="segmented method-tabs">
            <button v-for="item in metodos" :key="item.id" class="segment" :class="{ active: metodo === item.id }" @click="metodo = item.id">{{ item.label }}</button>
          </div>
        </label>

        <div v-if="metodo === 'pix'" class="conditional-fields">
          <label class="field-block">
            <span class="section-label">Tipo de chave PIX</span>
            <select v-model="tipoPix" class="select">
              <option v-for="tipo in tiposPix" :key="tipo.id" :value="tipo.id">{{ tipo.label }}</option>
            </select>
          </label>
          <label class="field-block">
            <span class="section-label">Chave PIX</span>
            <input v-model="chavePix" class="input" :placeholder="tiposPix.find((tipo) => tipo.id === tipoPix)?.placeholder" @blur="touched.chave = true">
            <small v-if="errors.chave" class="error-msg">{{ errors.chave }}</small>
          </label>
        </div>

        <div v-else class="conditional-fields">
          <label class="field-block"><span class="section-label">Banco</span><input v-model="banco" class="input" placeholder="Ex: Banco do Brasil"></label>
          <div class="two-grid compact">
            <label class="field-block"><span class="section-label">Agência</span><input v-model="agencia" class="input" placeholder="0000"></label>
            <label class="field-block"><span class="section-label">Conta</span><input v-model="conta" class="input" placeholder="00000-0"></label>
          </div>
          <div class="segmented">
            <button class="segment" :class="{ active: tipoConta === 'corrente' }" @click="tipoConta = 'corrente'">Conta corrente</button>
            <button class="segment" :class="{ active: tipoConta === 'poupanca' }" @click="tipoConta = 'poupanca'">Conta poupança</button>
          </div>
        </div>

        <label class="field-block">
          <span class="section-label">Confirmar valor</span>
          <div class="money-input" :class="{ error: errors.confirmar }"><span>R$</span><input v-model="confirmar" inputmode="decimal" placeholder="0,00" @blur="touched.confirmar = true"></div>
          <small v-if="errors.confirmar" class="error-msg">{{ errors.confirmar }}</small>
        </label>
      </section>

      <section v-if="valorNum >= minimo && valorNum <= saldo" class="panel summary">
        <span class="section-label">Resumo do saque</span>
        <div><span>Valor solicitado</span><strong>R$ {{ formatBRL(valorNum) }}</strong></div>
        <div><span>Taxa</span><strong class="accent">Sem taxa</strong></div>
        <div><span>Prazo estimado</span><strong>1-2 dias úteis</strong></div>
        <div class="total"><span>Valor a receber</span><strong>R$ {{ formatBRL(valorNum) }}</strong></div>
      </section>

      <button class="btn btn-primary confirm-btn" :disabled="!isFormValid" @click="submit">Confirmar Saque</button>
      <p class="note"><AlertCircle :size="13" />Saques processados em dias úteis até as 18h</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AlertCircle, CheckCircle2, Wallet } from 'lucide-vue-next'

type Metodo = 'pix' | 'ted' | 'conta'
type TipoConta = 'corrente' | 'poupanca'
type TipoPix = 'cpf' | 'cnpj' | 'email' | 'telefone' | 'aleatoria'

const saldo = 9029
const minimo = 50
const metodos: { id: Metodo; label: string }[] = [{ id: 'pix', label: 'PIX' }, { id: 'ted', label: 'TED' }, { id: 'conta', label: 'Conta bancária' }]
const tiposPix: { id: TipoPix; label: string; placeholder: string }[] = [
  { id: 'cpf', label: 'CPF', placeholder: '000.000.000-00' },
  { id: 'cnpj', label: 'CNPJ', placeholder: '00.000.000/0000-00' },
  { id: 'email', label: 'E-mail', placeholder: 'seu@email.com' },
  { id: 'telefone', label: 'Telefone', placeholder: '+55 11 99999-0000' },
  { id: 'aleatoria', label: 'Chave aleatória', placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' },
]

const valor = ref('')
const confirmar = ref('')
const metodo = ref<Metodo>('pix')
const tipoPix = ref<TipoPix>('cpf')
const chavePix = ref('')
const banco = ref('')
const agencia = ref('')
const conta = ref('')
const tipoConta = ref<TipoConta>('corrente')
const submitted = ref(false)
const touched = reactive({ valor: false, confirmar: false, chave: false })

const parseBRL = (value: string) => Number.parseFloat(value.replace(/\./g, '').replace(',', '.')) || 0
const formatBRL = (value: number) => value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const valorNum = computed(() => parseBRL(valor.value))
const errors = computed(() => {
  const data: Record<string, string> = {}
  if (touched.valor) {
    if (!valor.value) data.valor = 'Informe o valor a sacar'
    else if (valorNum.value < minimo) data.valor = `Valor mínimo: R$ ${formatBRL(minimo)}`
    else if (valorNum.value > saldo) data.valor = `Valor máximo: R$ ${formatBRL(saldo)}`
  }
  if (touched.confirmar) {
    if (!confirmar.value) data.confirmar = 'Confirme o valor'
    else if (confirmar.value !== valor.value) data.confirmar = 'Os valores não coincidem'
  }
  if (touched.chave && metodo.value === 'pix' && !chavePix.value) data.chave = 'Informe a chave PIX'
  return data
})
const isFormValid = computed(() => valorNum.value >= minimo && valorNum.value <= saldo && confirmar.value === valor.value && (metodo.value !== 'pix' || chavePix.value.length > 0) && (metodo.value === 'pix' || (banco.value && agencia.value && conta.value)))
const submit = () => {
  if (!isFormValid.value) {
    touched.valor = true
    touched.confirmar = true
    touched.chave = true
    return
  }
  submitted.value = true
}
</script>

<style scoped>
.withdraw-form {
  max-width: 560px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.saldo-card .section-label {
  display: flex;
  align-items: center;
  gap: 8px;
}
.saldo-card strong {
  display: block;
  margin-top: 14px;
  color: var(--accent);
  font-family: Manrope, Inter, sans-serif;
  font-size: 40px;
}
.saldo-card p,
.note {
  margin: 8px 0 0;
  color: var(--muted);
}
.form-card,
.conditional-fields,
.field-block,
.summary {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.money-input {
  display: flex;
  align-items: center;
  height: 48px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 8px;
  background: rgba(8, 11, 15, 0.55);
}
.money-input.error {
  border-color: rgba(255, 100, 100, 0.5);
}
.money-input span {
  padding: 0 12px;
  color: var(--muted);
  font-weight: 800;
}
.money-input input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: #fff;
  font-family: Manrope, Inter, sans-serif;
  font-size: 20px;
  font-weight: 800;
}
.error-msg {
  color: var(--danger);
  font-size: 12px;
}
.quick-values {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.quick-values button {
  height: 24px;
  padding: 0 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 999px;
  background: var(--surface-2);
  color: var(--muted-2);
  font-size: 11px;
  font-weight: 800;
}
.quick-values .max {
  border-color: rgba(139, 242, 193, 0.25);
  background: rgba(139, 242, 193, 0.08);
  color: var(--accent);
}
.method-tabs {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}
.compact {
  gap: 12px;
}
.summary div {
  display: flex;
  justify-content: space-between;
  color: var(--muted);
}
.summary strong {
  color: #fff;
}
.summary strong.accent,
.summary .total strong {
  color: var(--accent);
}
.summary .total {
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding-top: 12px;
}
.confirm-btn {
  height: 52px;
}
.confirm-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
.note {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 12px;
}
.success-page {
  min-height: 60vh;
  display: grid;
  place-items: center;
}
.success-card {
  max-width: 420px;
  text-align: center;
}
.success-icon {
  display: grid;
  place-items: center;
  width: 72px;
  height: 72px;
  margin: 0 auto 20px;
  border: 2px solid rgba(139, 242, 193, 0.3);
  border-radius: 999px;
  background: rgba(139, 242, 193, 0.12);
  color: var(--accent);
}
.success-card h1 {
  margin: 0 0 8px;
}
.success-card strong {
  display: block;
  color: var(--accent);
  font-family: Manrope, Inter, sans-serif;
  font-size: 32px;
}
.success-card p {
  color: var(--muted);
}
</style>
