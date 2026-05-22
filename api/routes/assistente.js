import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// ── Schemas leves para leitura ────────────────────────────────────────────────
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

// ── Busca e formata contexto do banco ────────────────────────────────────────
const buildContext = async () => {
  try {
    const Tropa    = getModel('AssT', TropaSchema,    'doa_tropas');
    const Item     = getModel('AssI', ItemSchema,     'doa_itens');
    const Edificio = getModel('AssE', EdificioSchema, 'doa_edificios');
    const Dragao   = getModel('AssD', DragaoSchema,   'doa_dragoes');

    const [tropas, itens, edificios, dragoes] = await Promise.all([
      Tropa.find({}).lean(),
      Item.find({}).lean(),
      Edificio.find({}).lean(),
      Dragao.find({}).lean(),
    ]);

    // Ordena tropas por poder desc para facilitar comparações pelo modelo
    const tropasOrdenadas = [...tropas].sort((a, b) => (b.poder || 0) - (a.poder || 0));

    const tropasTxt = tropasOrdenadas.length
      ? tropasOrdenadas.map((t, i) =>
          `${i + 1}. ${t.nome} [${t.tipo || '?'}]\n` +
          `   Poder: ${t.poder ?? '?'} | Vida: ${t.vida ?? '?'} | Def: ${t.def ?? '?'}\n` +
          `   Atq Corpo: ${t.atqPerto ?? '?'} | Atq Dist: ${t.atqDist ?? '?'} | Vel: ${t.vel ?? '?'}\n` +
          (t.desc ? `   Detalhe: ${t.desc}` : '')
        ).join('\n\n')
      : 'Nenhuma tropa cadastrada ainda.';

    const itensTxt = itens.length
      ? itens.map(i =>
          `• ${i.nome}` +
          (i.categoria    ? ` [${i.categoria}]` : '') +
          (i.descricao    ? `\n  Descrição: ${i.descricao}` : '') +
          (i.ondeConseguir ? `\n  Como obter: ${i.ondeConseguir}` : '')
        ).join('\n\n')
      : 'Nenhum item cadastrado ainda.';

    const edificiosTxt = edificios.length
      ? edificios.map(e =>
          `• ${e.nome}` +
          (e.categoria ? ` [${e.categoria}]` : '') +
          (e.descricao  ? `: ${e.descricao}` : '')
        ).join('\n')
      : 'Nenhuma construção cadastrada ainda.';

    const dragoesTxt = dragoes.length
      ? dragoes.map(d =>
          `• ${d.nome}` +
          (d.elemento  ? ` [Elemento: ${d.elemento}]` : '') +
          (d.raridade  ? ` [${d.raridade}]` : '') +
          (d.descricao ? `\n  ${d.descricao}` : '')
        ).join('\n\n')
      : 'Nenhum dragão cadastrado ainda.';

    return { tropasTxt, itensTxt, edificiosTxt, dragoesTxt };
  } catch (e) {
    console.error('[assistente] erro contexto:', e.message);
    return { tropasTxt: '', itensTxt: '', edificiosTxt: '', dragoesTxt: '' };
  }
};

// ── POST /api/assistente ──────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  const { pergunta, historico = [] } = req.body;

  if (!pergunta || typeof pergunta !== 'string' || pergunta.trim().length < 2)
    return res.status(400).json({ erro: 'Pergunta inválida.' });

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey)
    return res.status(500).json({ erro: 'Chave da API não configurada.' });

  const { tropasTxt, itensTxt, edificiosTxt, dragoesTxt } = await buildContext();

  const systemPrompt = `Você é o CONSELHEIRO TÁTICO do Guia DOA — o especialista máximo em Dragon's of Aether (DOA), um jogo mobile de estratégia medieval com tropas, dragões, torneios e alianças. Você conhece CADA detalhe do jogo e dá conselhos práticos, diretos e valiosos como um veterano de anos de jogo.

━━━━━━━━━━━━━━━━━━━━━━━━
REGRAS DE COMPORTAMENTO
━━━━━━━━━━━━━━━━━━━━━━━━
1. Responda SEMPRE em português brasileiro informal e amigável — como um aliado experiente no chat da aliança.
2. Use os DADOS DO BANCO abaixo como fonte primária. Se a informação não estiver nos dados, diga claramente.
3. Para COMPARAÇÕES (ex: "qual é melhor?") — analise os números, justifique e dê uma recomendação clara.
4. Para ESTRATÉGIAS — dê passos concretos, não respostas genéricas.
5. Para TORNEIOS — informe os pontos exatos, como obter e dica de maximização.
6. Use emojis com moderação para organizar (⚔️ 🐉 💡 ⚠️ 📊 🎯) — o app é mobile, precisa ser legível.
7. Estruture com seções quando a resposta for longa. Exemplo:
   **Como obter:** ...
   **Dica tática:** ...
8. Máximo 5 parágrafos ou 8 itens de lista. Seja denso em valor, não em volume.
9. Se o jogador fizer uma pergunta vaga, INTERPRETE o contexto mais útil e responda, depois ofereça expandir.
10. NUNCA invente dados que não estão nos contextos abaixo.

━━━━━━━━━━━━━━━━━━━━━━━━
⚔️ TROPAS (ordenadas por poder, maior primeiro):
━━━━━━━━━━━━━━━━━━━━━━━━
${tropasTxt}

━━━━━━━━━━━━━━━━━━━━━━━━
🎒 ITENS:
━━━━━━━━━━━━━━━━━━━━━━━━
${itensTxt}

━━━━━━━━━━━━━━━━━━━━━━━━
🏗️ CONSTRUÇÕES:
━━━━━━━━━━━━━━━━━━━━━━━━
${edificiosTxt}

━━━━━━━━━━━━━━━━━━━━━━━━
🐉 DRAGÕES:
━━━━━━━━━━━━━━━━━━━━━━━━
${dragoesTxt}

━━━━━━━━━━━━━━━━━━━━━━━━
🏆 TORNEIOS — REGRAS COMPLETAS:
━━━━━━━━━━━━━━━━━━━━━━━━
TORNEIO DE PODER
• Objetivo: acumular o máximo de poder possível
• Fontes: treinar tropas, evoluir dragões, fazer pesquisas, treinar generais
• Dica: combine todas as fontes simultaneamente durante o evento

TREINO DE TROPAS
• Objetivo: treinar o máximo de tropas possível
• Bônus disponíveis: x1 (normal), x2 (duplo), x3 (triplo), x4, x5
• Dica: priorize tropas com bônus ativo — multiplicam os pontos

MATAR TROPAS
• Objetivo: eliminar tropas inimigas em batalha
• Melhor estratégia: combinar com aliados para trocas controladas de tropas
• Como funciona a troca: aliado envia tropas fracas → você ataca e elimina → reveze

TREINAMENTO DO DRAGÃO (Pontos de Carnes)
• Carneiro: 100 pts | Boi: 200 pts | Frango: 500 pts
• Veado: 1.000 pts | Salmão: 2.000 pts | Lagosta: 5.000 pts
• Como obter: savanas nível 1-10 (3 carneiros, 2 bois, 3 frangos/dia), missões diárias, eventos, Loja de Surpresas, rubis

HABILIDADE DE DRAGÃO
• Item: Essência da Fúria — vale 100 pontos cada
• Como obter: Antropos nível 10, Florestas nível 10, eventos, Bastião dos Dragões, Expedição do Dragão, Loja

PONTOS DE TALISMÃ
• Torre de Oração: 3 talismãs gratuitos por dia (aleatórios)
• Verde: 20 pts | Azul: 30 pts | Roxo: 800 pts | Laranja: 12.000 pts
• Também em: eventos, torneios, Loja de Surpresas, compra com rubis
• Dica: o Laranja vale 600× mais que o Verde — guarde para o torneio

EVOLUÇÃO DE TROPAS (Fósseis)
• Fóssil Crepúsculo 1: 10 pts | Fóssil Crepúsculo 2: 10 pts
• Fóssil Ancião 1: 10 pts | Fóssil Ancião 2: 10 pts
• Como obter: atacar Antropos nível 1-10 → coletar Lembranças Antigas → trocar na Loja de Surpresas; também em eventos e rubis

TORNEIO DE CONHECIMENTO (Poções Antigas)
• Poções antigas de diferentes níveis concedem pontos ao serem usadas
• Tipos: Primária, Intermediária, Superior

TORNEIO DE ACELERAÇÕES
• Objetivo: usar acelerações de tempo (minutos)
• Fontes: construção, pesquisa, treinamento de tropas

GENERAL (Aprimoramento)
• Objetivo: aumentar XP dos generais
• Como: acessar Quartel do General → Treinamento → usar cartas de general
• Dica: guarde cartas ao longo da semana e use em massa no torneio

TORNEIOS DE ALIANÇA
• Tipo 1 — Torneio de Poder: individual, ganhar poder de todas as fontes
• Tipo 2 — Torneio de Aliança (Atual): treinar dragões e ajudar membros

━━━━━━━━━━━━━━━━━━━━━━━━
🗺️ MECÂNICAS GERAIS DO JOGO:
━━━━━━━━━━━━━━━━━━━━━━━━
• Savanas (nível 1-10): fonte diária de recursos e lembranças antigas
• Antropos (nível 1-10): fonte de lembranças antigas e essências
• Florestas (nível 10): fonte de essências da fúria
• Torre de Oração: 3 talismãs grátis/dia
• Loja de Surpresas: troca de recursos especiais
• Quartel do General: treinamento e evolução de generais
• Bastião dos Dragões: missões e recursos de dragão
• Expedição do Dragão: recompensas periódicas de essências
• Rubis: moeda premium, permite comprar recursos raros`;

  const mensagens = [
    ...historico.slice(-14).map(m => ({ role: m.role, content: m.content })),
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
        max_tokens: 900,
        temperature: 0.45,
        top_p: 0.9,
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
