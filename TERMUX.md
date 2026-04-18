# 📱 Testar no Termux (Android)

Sim, é possível correr o servidor de desenvolvimento diretamente no seu telemóvel Android usando o **Termux**, sem precisar de PC.

---

## 1. Instalar o Termux

Baixe pelo **F-Droid** (recomendado) — a versão da Play Store está desatualizada:
👉 https://f-droid.org/packages/com.termux/

---

## 2. Preparar o ambiente (apenas uma vez)

Abra o Termux e execute:

```bash
# Atualizar repositórios
pkg update && pkg upgrade -y

# Instalar Node.js e git
pkg install nodejs git -y

# Verificar versões instaladas
node -v
npm -v
git --version
```

---

## 3. Clonar e instalar o projeto

```bash
# Clonar o repositório
git clone https://github.com/adrilemoz/guiadoa.git
cd guiadoa

# Instalar dependências (pode demorar alguns minutos)
npm install
```

---

## 4. Rodar o servidor de desenvolvimento

```bash
npm run dev -- --host
```

O `--host` é obrigatório para aceder pelo browser do telemóvel.

O Termux vai mostrar algo como:
```
  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.x.x:5173/
```

Abra o browser do telemóvel e aceda a `http://localhost:5173`.

---

## 5. Gerar o build de produção no Termux

```bash
npm run build
```

A pasta `dist/` gerada pode ser servida localmente:

```bash
# Instalar um servidor estático simples
npm install -g serve

# Servir a pasta dist
serve dist
```

Aceda a `http://localhost:3000` no browser.

---

## ⚠️ Notas importantes

- O Termux pode ser **lento** na primeira instalação do `npm install` porque compila alguns pacotes nativos. Tenha paciência.
- Se aparecer erro de memória durante o `npm install`, execute antes: `export NODE_OPTIONS=--max_old_space_size=512`
- Para gerar o APK precisará de um PC com Android Studio — o Termux não suporta o Gradle do Capacitor.
- Para manter o servidor ativo com o ecrã bloqueado, instale o **Termux:Boot** pelo F-Droid.

---

## Aceder de outro dispositivo na mesma rede Wi-Fi

Com o servidor a correr com `--host`, pode aceder do tablet, PC ou outro telemóvel usando o IP da rede:

```
http://192.168.x.x:5173
```

O IP exato aparece no output do `npm run dev -- --host`.
