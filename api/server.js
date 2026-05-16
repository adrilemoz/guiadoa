import 'dotenv/config';
import express from 'express';
import cors    from 'cors';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname, join }  from 'path';
import authRoutes  from './routes/auth.js';
import tropaRoutes from './routes/tropas.js';
import nivelRoutes from './routes/niveis.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

// ── Middlewares ──────────────────────────────────────────────────────────────
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3001', 'http://127.0.0.1:5173'] }));
app.use(express.json());

// ── Rotas de API ─────────────────────────────────────────────────────────────
app.use('/api/auth',   authRoutes);
app.use('/api/tropas', tropaRoutes);
app.use('/api/niveis', nivelRoutes);

// ── Painel Admin (HTML estático) ─────────────────────────────────────────────
app.use('/admin', express.static(join(__dirname, 'admin')));
app.get('/admin', (_, res) => res.sendFile(join(__dirname, 'admin', 'index.html')));

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/', (_, res) => res.json({ status: 'ok', app: 'Guia DOA API', version: '1.0.0' }));

// ── MongoDB ──────────────────────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('\n✅  MongoDB conectado — iguanews (prefixo doa_)');
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`🛡️  API rodando em http://localhost:${PORT}`);
      console.log(`🎮  Painel Admin:  http://localhost:${PORT}/admin\n`);
    });
  })
  .catch(err => {
    console.error('❌  Falha ao conectar MongoDB:', err.message);
    process.exit(1);
  });
