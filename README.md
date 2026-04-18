# 🛡️ Guia Tático DOA

![Versão](https://img.shields.io/badge/versão-1.7.0-blue?style=flat-square)
![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646cff?style=flat-square&logo=vite)
![MUI](https://img.shields.io/badge/MUI-v5-007fff?style=flat-square&logo=mui)
![Capacitor](https://img.shields.io/badge/Capacitor-Android-119eda?style=flat-square&logo=capacitor)
![PWA](https://img.shields.io/badge/PWA-Offline-green?style=flat-square)
![Build APK](https://img.shields.io/github/actions/workflow/status/adrilemoz/guiadoa/build-apk.yml?label=APK%20Build&style=flat-square)
![Licença](https://img.shields.io/github/license/adrilemoz/guiadoa?style=flat-square)
![Termux](https://img.shields.io/badge/Termux-compatível-black?style=flat-square)

> Ferramenta **não oficial** criada pela comunidade para auxiliar comandantes a otimizarem recursos, calcularem torneios e dominarem o jogo **Dawn of Atlantis (DOA)** com precisão matemática.

---

## ✨ Funcionalidades

- 🏆 **Calculadoras de Torneios** — Poder, Treino de Tropas, Evolução, Aliança, Dragão e mais 7 módulos
- ⚔️ **Guia de Tropas** — Catálogo completo com 53 unidades, filtros e dossiê individual
- 🧮 **Simulador de Marcha e Duelo 1v1** — Monte exércitos e compare tropas visualmente
- 🏗️ **Construções** — Tabelas de evolução e calculadora de efeitos por nível
- 🏝️ **Planta da Cidade** — Gestão de ilhas, recursos, territórios e produção por hora
- 🏰 **Cálculo de Níveis** — Acompanhe o seu poder e metas de evolução
- 💾 **Backup e Restauração** — Exporta e importa todo o progresso via código criptografado
- ⏱️ **Cronómetro de Torneios** — Sincronizado com o fuso horário do seu reino
- 📴 **100% Offline** — Funciona sem internet após o primeiro carregamento (PWA + APK)

---

## 📱 Testar no Termux (Android)

Sim, é possível correr o servidor diretamente no telemóvel sem PC. Consulte o guia completo em **[TERMUX.md](./TERMUX.md)**.

Em resumo:
```bash
pkg install nodejs git -y
git clone https://github.com/adrilemoz/guiadoa.git && cd guiadoa
npm install
npm run dev -- --host
```

---

## 🚀 Como executar localmente

### Pré-requisitos

- [Node.js](https://nodejs.org/) 18 ou superior
- npm 9 ou superior

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/adrilemoz/guiadoa.git
cd guiadoa

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev
```

Aceda a `http://localhost:5173` no browser.

### Build de produção

```bash
npm run build
# Os ficheiros finais ficam na pasta dist/
```

---

## 📱 Gerar APK Android

### Método 1 — GitHub Actions (automático)

A cada push na branch `main`, o workflow `.github/workflows/build-apk.yml` gera automaticamente o APK debug. Para o descarregar:

1. Vá ao separador **Actions** no seu repositório
2. Clique no último workflow concluído
3. Em **Artifacts**, descarregue `guia-doa-debug-apk` (APK de debug)

### Método 2 — Local com Android Studio

```bash
# 1. Gere o build do Vite
npm run build

# 2. Instale o Capacitor (apenas na primeira vez)
npm install @capacitor/core @capacitor/cli @capacitor/android

# 3. Adicione a plataforma Android (apenas na primeira vez)
npx cap add android

# 4. Sincronize o build com o Capacitor
npx cap sync

# 5. Abra no Android Studio
npx cap open android
```

No Android Studio: **Build → Build Bundle(s) / APK(s) → Build APK(s)**

---

## 🗂️ Estrutura do projeto

```
guiadoa/
├── .github/
│   └── workflows/
│       └── build-apk.yml        # CI/CD para gerar APK automaticamente
├── public/
│   └── img/
│       └── favicon.png          # Ícone local (offline)
├── src/
│   ├── main.jsx                 # Entrada — fontes e Service Worker
│   ├── App.jsx                  # Tema MUI, ErrorBoundary e roteador
│   ├── db.js                    # Base de dados estática do jogo
│   └── components/
│       ├── Home.jsx             # Painel principal e perfil
│       ├── Tropas.jsx           # Catálogo de tropas
│       ├── CalculosTropas.jsx   # Simulador de Marcha e Duelo
│       ├── Edificios.jsx        # Construções e upgrades
│       ├── Ilhas.jsx            # Gestão de ilhas e recursos
│       ├── Niveis.jsx           # Cálculo de poder e níveis
│       ├── Torneios.jsx         # Hub dos torneios
│       ├── Sobre.jsx            # Informações e changelog
│       ├── Backup.jsx           # Backup e restauração
│       ├── Itens.jsx            # (Em desenvolvimento)
│       └── torneios/
│           ├── TorneioPoder.jsx
│           ├── TorneioTreinoTropa.jsx
│           ├── TorneioMatarTropas.jsx
│           ├── TorneioAlianca.jsx
│           ├── TorneioGeneral.jsx
│           ├── TorneioAprimoramentoTropa.jsx
│           ├── TorneioConhecimento.jsx
│           ├── TorneioHabilidadeDragao.jsx
│           ├── EvolucaoTropas.jsx
│           ├── PontosTalisma.jsx
│           └── TreinamentoDoDragao.jsx
├── capacitor.config.ts          # Configuração do Capacitor
├── vite.config.js               # Build e plugin PWA
├── index.html                   # Entrada HTML
└── package.json
```

---

## 🛠️ Tecnologias

| Tecnologia | Função |
|---|---|
| [React 18](https://react.dev/) | Interface de utilizador |
| [Vite 5](https://vitejs.dev/) | Bundler e dev server |
| [MUI v5](https://mui.com/) | Componentes visuais |
| [Capacitor](https://capacitorjs.com/) | Empacotamento Android |
| [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) | Service Worker offline |
| [@fontsource/nunito](https://fontsource.org/fonts/nunito) | Fonte Nunito local (offline) |
| [@mui/icons-material](https://mui.com/material-ui/material-icons/) | Ícones MUI (tree-shakeable) |

---

## ⚠️ Aviso Legal

Este aplicativo é uma ferramenta **não oficial** desenvolvida por e para a comunidade de jogadores. Não tem qualquer afiliação, patrocínio ou aprovação da **Deca Games**. Todas as lógicas matemáticas são interpretações da comunidade destinadas apenas a auxílio estratégico.

---

## 💎 Apoiar o Projeto

Se este guia ajudou nas suas batalhas, considere apoiar o desenvolvimento:

**PIX:** `37991260524`

---

## 📬 Contacto

Encontrou um erro nos cálculos ou tem uma sugestão? Abra uma [Issue](https://github.com/adrilemoz/guiadoa/issues) ou envie um e-mail para `adrilemoz@gmail.com`.

---

<p align="center">
  Feito com ⚔️ pela comunidade DOA &nbsp;·&nbsp; <b>Guia DOA v1.7.0 — "Supremacia Tática"</b>
</p>
