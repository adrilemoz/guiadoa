import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// ── Helpers ──────────────────────────────────────────────────────────────────
const getModel = (name, schema, collection) => {
  if (mongoose.models[name]) return mongoose.models[name];
  return mongoose.model(name, schema, collection);
};

const TropaSchema = new mongoose.Schema({
  nome: String, poder: Number, vida: Number, def: Number,
  atqPerto: Number, atqDist: Number, alcance: Number,
  vel: Number, car: Number, desc: String, tipo: String,
}, { collection: 'doa_tropas' });

const ItemSchema = new mongoose.Schema({
  nome: String, descricao: String, categoria: String, ondeConseguir: String,
}, { collection: 'doa_itens' });

const EdificioSchema = new mongoose.Schema({
  nome: String, descricao: String, categoria: String,
}, { collection: 'doa_edificios' });

const DragaoSchema = new mongoose.Schema({
  nome: String, elemento: String, raridade: String, descricao: String,
}, { collection: 'doa_dragoes' });

// ── Monta contexto do jogo dinamicamente a partir do MongoDB ─────────────────
const buildContext = async () => {
  try {
    const Tropa    = getModel('AssT', TropaSchema,    'doa_tropas');
    const Item     = getModel('AssI', ItemSchema,     'doa_itens');
    const Edificio = getModel('AssE', EdificioSchema, 'doa_edificios');
    const Dragao   = getModel('AssD', DragaoSchema,   'doa_dragoes');

    const [tropas, itens, edificios, dragoes] = await Promise.all([
      Tropa.find({}, 'nome poder vida def atqPerto atqDist vel tipo desc').lean(),
      Item.find({}, 'nome descricao categoria ondeConseguir').lean(),
      Edificio.find({}, 'nome descricao categoria').lean(),
      Dragao.find({}, 'nome elemento raridade descricao').lean(),
    ]);

    const fmt = arr => arr.length ? arr : [];

    const tropasTxt = fmt(tropas).map(t =>
      `• ${t.nome} [${t.tipo}] — Poder: ${t.poder}, Vida: ${t.vida}, Def: ${t.def}, ` +
      `Atq Perto: ${t.atqPerto}, Atq Dist: ${t.atqDist}, Vel: ${t.vel}` +
      (t.desc ? `. ${t.desc}` : '')
    ).join('\n');

    const itensTxt = fmt(itens).map(i =>
      `• ${i.nome}${i.categoria ? ` [${i.categoria}]` : ''}` +
      (i.descricao ? `: ${i.descricao}` : '') +
      (i.ondeConseguir ? ` | Onde conseguir: ${i.ondeConseguir}` : '')
    ).join('\n');

    const edificiosTxt = fmt(edificios).map(e =>
      `• ${e.nome}${e.categoria ? ` [${e.categoria}]` : ''}` +
      (e.descricao ? `: ${e.descricao}` : '')
    ).join('\n');

    const dragoesTxt = fmt(dragoes).map(d =>
      `• ${d.nome}${d.elemento ? ` [${d.elemento}]` : ''}${d.raridade ? ` — ${d.raridade}` : ''}` +
      (d.descricao ? `: ${d.descricao}` : '')
    ).join('\n');

    return { tropasTxt, itensTxt, edificiosTxt, dragoesTxt };
  } catch (e) {
    console.error('[assistente] erro ao buscar contexto:', e.message);
    return { tropasTxt: '', itensTxt: '', edificiosTxt: '', dragoesTxt: '' };
  }
};

// ── POST /api/assistente ─────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  const { pergunta, historico = [] } = req.body;

  if (!pergunta || typeof pergunta !== 'string' || pergunta.trim().length < 2) {
    return res.status(400).json({ erro: 'Pergunta inválida.' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return res.status(500).json({ erro: 'Chave da API não configurada.' });

  // Busca dados atuais do banco
  const { tropasTxt, itensTxt, edificiosTxt, dragoesTxt } = await buildContext();

  const systemPrompt = `Você é o Conselheiro Tático do Guia DOA — um assistente especialista no jogo mobile de estratégia Dragon's of Aether (DOA). Responda de forma clara, direta e objetiva, sempre em português brasileiro. Seja útil e amigável, como um jogador experiente ajudando um aliado.

Use APENAS as informações abaixo para responder. Se não souber, diga que não tem essa informação no guia ainda.

═══════════════════════════════
🗡️ TROPAS DISPONÍVEIS NO JOGO:
═══════════════════════════════
${tropasTxt || 'Nenhuma tropa cadastrada ainda.'}

═══════════════════════════════
🎒 ITENS:
═══════════════════════════════
${itensTxt || 'Nenhum item cadastrado ainda.'}

═══════════════════════════════
🏗️ CONSTRUÇÕES:
═══════════════════════════════
${edificiosTxt || 'Nenhuma construção cadastrada ainda.'}

═══════════════════════════════
🐉 DRAGÕES:
═══════════════════════════════
${dragoesTxt || 'Nenhum dragão cadastrado ainda.'}

═══════════════════════════════
📋 TORNEIOS (regras gerais):
═══════════════════════════════
• Torneio de Poder: ganhar poder treinando tropas, dragões, pesquisas e generais.
• Torneio de Aliança: treinar dragões e ajudar membros da aliança.
• Treino de Tropas: treinar tropas — algumas concedem bônus x2 ou x3.
• Matar Tropas: eliminar tropas inimigas; coordenar trocas com aliados é a melhor estratégia.
• Treinamento do Dragão: usar carnes (Carneiro 100pts, Boi 200pts, Frango 500pts, Veado 1000pts, Salmão 2000pts, Lagosta 5000pts).
• Pontos de Talismã: usar Torre de Oração (3 grátis/dia). Talismã Verde=20pts, Azul=30pts, Roxo=800pts, Laranja=12000pts.
• Habilidade de Dragão: usar essências para evoluir habilidades do dragão.
• Torneio de Conhecimento: usar poções antigas (Primária, Intermediária, Superior).
• Torneio de Acelerações: usar acelerações de tempo.
• General: aumentar XP de generais usando cartas no Quartel do General.

Responda de forma concisa. Para listas use marcadores •. Máximo 3 parágrafos.`;

  // Monta histórico de mensagens (máx. 6 turnos anteriores)
  const mensagens = [
    ...historico.slice(-12).map(m => ({ role: m.role, content: m.content })),
    { role: 'user', content: pergunta.trim() },
  ];

  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'system', content: systemPrompt }, ...mensagens],
        max_tokens: 600,
        temperature: 0.5,
      }),
    });

    if (!groqRes.ok) {
      const err = await groqRes.text();
      console.error('[assistente] Groq erro:', err);
      return res.status(502).json({ erro: 'Erro ao consultar o assistente. Tente novamente.' });
    }

    const data = await groqRes.json();
    const resposta = data.choices?.[0]?.message?.content?.trim() || 'Não consegui gerar uma resposta.';

    res.json({ resposta });
  } catch (e) {
    console.error('[assistente] fetch error:', e.message);
    res.status(502).json({ erro: 'Falha na conexão com o assistente.' });
  }
});

export default router;
