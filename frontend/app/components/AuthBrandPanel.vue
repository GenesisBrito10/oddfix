<template>
  <section class="brand-panel">
    <OddFixLogo size="lg" />
    <div class="brand-copy">
      <h1>
        <span>Lucre em qualquer resultado.</span>
        <strong>Não importa quem ganhar.</strong>
      </h1>
      <p>A Oddfix identifica oportunidades de arbitragem esportiva em tempo real, em 134 casas de apostas. Seu lucro é matemático, não sorte.</p>
    </div>
    <div class="bookmaker-tiles">
      <div v-for="bookmaker in bookmakers.slice(0, 9)" :key="bookmaker.id" class="bookmaker-tile">
        <img :src="bookmaker.img" :alt="bookmaker.name">
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { bookmakers } from '~/data/bookmakers'
</script>

<style scoped>
.brand-panel {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 55%;
  min-height: 100vh;
  padding: 40px;
  background: #0d0d0d;
}

.brand-copy {
  margin-top: 80px;
}

.brand-copy h1 {
  margin: 0;
  font-size: 43px;
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.1;
}

.brand-copy h1 span,
.brand-copy h1 strong {
  display: block;
}

.brand-copy h1 strong {
  color: var(--accent);
}

.brand-copy p {
  max-width: 560px;
  margin: 16px 0 0;
  color: var(--muted);
  font-size: 18px;
  line-height: 1.6;
}

.bookmaker-tiles {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 8px;
  max-width: 620px;
  margin-top: 28px;
}

.bookmaker-tile {
  display: grid;
  place-items: center;
  height: 52px;
  padding: 8px;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 4px;
  background: #0e0e0e;
}

.bookmaker-tile img {
  max-width: 100%;
  height: 32px;
  object-fit: contain;
}

@media (max-width: 1024px) {
  .brand-panel {
    width: 100%;
    min-height: auto;
    padding: 32px;
  }

  .brand-copy {
    margin-top: 48px;
  }

  .brand-copy h1 {
    font-size: 34px;
  }

  .bookmaker-tiles {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
