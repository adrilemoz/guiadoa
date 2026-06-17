import express from 'express';
import Traducao from '../models/Traducao.js';
import { autenticar } from '../middleware/auth.js';

const router = express.Router();

// URL da instância LibreTranslate — usa env ou fallback para pública
const LT_URL = process.env.LIBRETRANSLATE_URL || 'https://translate.terraprint.co';
const LT_KEY = process.env.LIBRETRANSLATE_KEY || '';   // vazio = instâncias sem key

// ── Helper: chama LibreTranslate ─────────────────────────────────────────────
async function traduzirTexto(texto, de = 'pt', para = 'en') {
  const body = { q: texto, source: de, target: para, format: 'text' };
  if (LT_KEY) body.api_key = LT_KEY;

  const res = await fetch(`${LT_URL}/translate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(8000),
  });

  if (!res.ok) throw new Error(`LibreTranslate retornou ${res.status}`);
  const data = await res.json();
  return data.translatedText || '';
}

// ── GET /api/traducoes?locale=en-US
// Retorna traduções ativas para o frontend consumir
router.get('/', async (req, res) => {
  try {
    const locale = req.query.locale || 'en-US';
    const docs = await Traducao.find({ locale, status: 'ativo' }).lean();
    // Converte array em objeto { chave: traducao }
    const mapa = {};
    docs.forEach(d => { mapa[d.chave] = d.traducao; });
    res.json(mapa);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// ── GET /api/traducoes/admin?locale=en-US
// Retorna TODAS as traduções (qualquer status) para o painel admin
router.get('/admin', autenticar, async (req, res) => {
  try {
    const locale = req.query.locale || 'en-US';
    const docs = await Traducao.find({ locale }).sort({ chave: 1 }).lean();
    res.json(docs);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// ── GET /api/traducoes/locales
// Lista todos os locales que existem no banco
router.get('/locales', async (req, res) => {
  try {
    const locales = await Traducao.distinct('locale');
    res.json(locales);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// ── POST /api/traducoes/seed
// Insere ou atualiza as chaves PT base no banco (idempotente)
// Chamado pelo admin para sincronizar quando novas chaves forem adicionadas
router.post('/seed', autenticar, async (req, res) => {
  try {
    const { chaves, locale = 'en-US' } = req.body;
    // chaves = [{ chave: 'home.botao.torneios', textoPT: 'Torneios' }, ...]
    if (!Array.isArray(chaves) || !chaves.length) {
      return res.status(400).json({ erro: 'Envie um array "chaves"' });
    }

    let inseridos = 0, existentes = 0;
    for (const { chave, textoPT } of chaves) {
      const existe = await Traducao.findOne({ chave, locale });
      if (!existe) {
        await Traducao.create({ chave, locale, textoPT, status: 'rascunho', fonte: 'manual' });
        inseridos++;
      } else {
        // Atualiza textoPT se o original mudou, mas preserva tradução/status
        if (existe.textoPT !== textoPT) {
          existe.textoPT = textoPT;
          existe.status = 'rascunho'; // regride para revisão quando o original muda
          await existe.save();
        }
        existentes++;
      }
    }
    res.json({ ok: true, inseridos, existentes });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// ── POST /api/traducoes/auto
// Auto-traduz uma chave específica (ou todas com status rascunho sem tradução)
router.post('/auto', autenticar, async (req, res) => {
  try {
    const { chave, locale = 'en-US' } = req.body;

    let docs;
    if (chave) {
      // Traduz só a chave pedida
      docs = await Traducao.find({ chave, locale });
    } else {
      // Traduz todas que ainda não têm tradução
      docs = await Traducao.find({ locale, traducao: '' });
    }

    if (!docs.length) return res.json({ ok: true, traduzidos: 0 });

    let traduzidos = 0, erros = [];
    for (const doc of docs) {
      try {
        const traduzido = await traduzirTexto(doc.textoPT, 'pt', 'en');
        doc.traducao = traduzido;
        doc.status   = 'rascunho';
        doc.fonte    = 'libretranslate';
        await doc.save();
        traduzidos++;
      } catch (e) {
        erros.push({ chave: doc.chave, erro: e.message });
      }
    }

    res.json({ ok: true, traduzidos, erros });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// ── PATCH /api/traducoes/:id
// Admin edita manualmente a tradução de uma chave
router.patch('/:id', autenticar, async (req, res) => {
  try {
    const { traducao, status } = req.body;
    const doc = await Traducao.findById(req.params.id);
    if (!doc) return res.status(404).json({ erro: 'Não encontrada' });

    if (traducao !== undefined) { doc.traducao = traducao; doc.fonte = 'manual'; }
    if (status   !== undefined)   doc.status   = status;

    await doc.save();
    res.json(doc);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// ── POST /api/traducoes/ativar-todos
// Ativa todas as traduções revisadas de um locale
router.post('/ativar-todos', autenticar, async (req, res) => {
  try {
    const { locale = 'en-US' } = req.body;
    const result = await Traducao.updateMany(
      { locale, status: 'revisado' },
      { $set: { status: 'ativo', updatedAt: new Date() } }
    );
    res.json({ ok: true, ativados: result.modifiedCount });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// ── DELETE /api/traducoes/:id  (admin)
router.delete('/:id', autenticar, async (req, res) => {
  try {
    await Traducao.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

export default router;
