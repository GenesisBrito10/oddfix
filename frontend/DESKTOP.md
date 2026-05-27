# OddFix Desktop — build do instalador + auto-update

App Electron que **embute o servidor Nitro do Nuxt** (mantém o proxy de API, backend
escondido, sem CORS) e se **atualiza sozinho** via GitHub Releases (electron-updater).

---

## Como funciona (arquitetura)

```
[ Electron main (main.cjs) ]
   ├─ produção: sobe .output/server/index.mjs numa porta local (ELECTRON_RUN_AS_NODE)
   │            → janela carrega http://127.0.0.1:<porta>
   │            → Nitro faz proxy /auth /surebets ... → backend de produção
   ├─ abre as casas em janelas Chrome lado a lado (CDP) e captura cliques
   └─ auto-update: checa GitHub Releases (latest.yml) → baixa → instala ao fechar
```

- **Dev** (`pnpm electron:dev`): carrega `http://localhost:3000` (precisa do `nuxt dev` rodando). Nada muda.
- **Empacotado**: usa o `.output` embutido. `app.isPackaged` decide.

---

## PRÉ-REQUISITO OBRIGATÓRIO — URL do backend (via env)

A URL do backend **não é hardcoded** no código. Vem da env `ODDFIX_BACKEND_URL` no
momento do build: o script `electron/gen-config.cjs` grava `electron/app-config.json`
(gitignored) que é embutido no app. O `main.cjs` lê isso em runtime.

```powershell
$env:ODDFIX_BACKEND_URL = "https://api.seu-backend.com"   # PowerShell
```
```bash
export ODDFIX_BACKEND_URL="https://api.seu-backend.com"    # bash
```

Sem essa env no build, o app abre mas não busca surebets.

> **Não é segredo.** O `.exe` (Electron) é reversível: `app.asar` não é criptografia
> (`npx asar extract` lê tudo) e o `.output/server` vai como arquivo legível em
> `resources/output`. As rotas também aparecem no tráfego de rede. Esconder a URL é
> impossível num app cliente — a segurança real é **auth/rate-limit/licença por máquina
> no backend** e **nenhum segredo (chaves/DB) no cliente**. Env aqui só tira a URL do
> código-fonte, não do artefato.

---

## 1. Setup local (uma vez)

```bash
cd frontend
pnpm install        # já aplica node-linker=hoisted (.npmrc) — necessário pro electron-builder
```

`electron-updater` (runtime) e `electron-builder` (dev) já estão no `package.json`.
Se faltar: `pnpm add electron-updater && pnpm add -D electron-builder`.

## 2. Gerar o instalador (testar na sua máquina e enviar pra outras pessoas)

```powershell
$env:ODDFIX_BACKEND_URL = "https://api.seu-backend.com"
pnpm electron:build
```

Faz `nuxt build` + empacota. Saída:

```
frontend/dist-electron/OddFix-Setup-0.1.0.exe
```

Esse `.exe` é o instalador. Mande pras pessoas testarem. Instala **por usuário** (sem admin).

> **SmartScreen**: como o app **não é assinado**, o Windows mostra
> *"O Windows protegeu o computador / Editor desconhecido"*. Para instalar:
> **Mais informações → Executar assim mesmo**. (Some quando comprar um certificado de
> assinatura de código e configurar no `electron-builder.yml`.)

## 3. Rodar/depurar

- `pnpm electron:dev` — app real apontando pro dev server (`localhost:3000`).
- `pnpm electron:click-test` — página de teste de captura de clique.

---

## 4. Publicar uma atualização (auto-update)

O cliente checa o GitHub Releases ao abrir, baixa em background e instala ao fechar.
Para lançar uma nova versão:

### Opção A — automático (recomendado, escalável)

1. Suba a versão em `frontend/package.json` (ex.: `0.1.0` → `0.1.1`).
2. Commit + tag + push:
   ```bash
   git commit -am "release v0.1.1"
   git tag v0.1.1
   git push origin main --tags
   ```
3. O workflow **`.github/workflows/release.yml`** roda no `windows-latest`, builda e
   publica o `.exe` + `latest.yml` no **GitHub Release** do repo `GenesisBrito10/oddfix`.
4. Apps abertos pegam o update no próximo restart.

Requisitos no GitHub:
- **Settings → Actions → General → Workflow permissions = Read and write** (pro `GITHUB_TOKEN` criar o Release).
- **Settings → Secrets and variables → Actions → New secret**: `ODDFIX_BACKEND_URL` = URL do backend (o workflow injeta no build).

### Opção B — manual (da sua máquina)

```bash
# token com escopo 'repo' (clássico) ou contents:write (fine-grained)
$env:GH_TOKEN="ghp_xxx"      # PowerShell
pnpm electron:release
```

> **Releases devem ser públicos** (repo público), assim o `electron-updater` baixa sem
> token. Controle de acesso por máquina entra depois numa camada de auth do backend, não
> no download do instalador.

---

## 5. Regras do auto-update (importante)

- A **versão sempre sobe** (`package.json`). O updater compara semver; nunca reusar tag.
- `latest.yml` (gerado pelo builder) precisa estar no mesmo Release que o `.exe`.
- O updater só funciona no app **empacotado** (em dev é ignorado).
- Atualização do Chrome do usuário não afeta nada disso.

---

## 6. Escalabilidade / próximos passos

- **GitHub Releases = CDN do GitHub** → aguenta muitos downloads de graça.
- **Assinatura de código** (remove SmartScreen): comprar cert OV/EV, adicionar no
  `electron-builder.yml` (`win.certificateFile`/`certificatePassword` ou via secrets no CI).
- **Canais** (beta/stable): `electron-builder` suporta `channel` no `publish` + `latest-beta.yml`.
- **Mac/Linux**: adicionar `mac`/`linux` targets no `electron-builder.yml` + runners no CI.
- **Controle de acesso por máquina**: implementar no backend (o app já manda `Authorization`
  via cookie `oddfix_token`); liberar/bloquear por device id na API, não no instalador.

---

## Arquivos relevantes

| Arquivo | Papel |
|---|---|
| `electron/main.cjs` | boot do Nitro embutido + auto-updater + captura de casas |
| `electron-builder.yml` | config do empacotamento (NSIS, extraResources `.output`, publish GitHub) |
| `.npmrc` | `node-linker=hoisted` (pnpm + electron-builder) |
| `package.json` | `main`, `version`, scripts `electron:build`/`electron:release`, split de deps |
| `.github/workflows/release.yml` | CI: tag `v*` → build + publish |
