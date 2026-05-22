import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// ── Reutiliza modelos já registrados ou cria ──────────────────────────────────
const mdl = (name, schema, col) => {
  if (mongoose.models[name]) return mongoose.models[name];
  return mongoose.model(name, schema, col);
};

// ── Schemas completos (espelham os models reais) ──────────────────────────────
const TropaSchema = new mongoose.Schema({
  nome: String, poder: Number, vida: Number, def: Number,
  atqPerto: Number, atqDist: Number, alcance: Number,
  vel: Number, car: Number, gestao: Number, desc: String, tipo: String,
}, { collection: 'doa_tropas' });

const ItemSchema = new mongoose.Schema({
  nome: String, icone: String, descricao: String, onde: String,
}, { collection: 'doa_itens' });

const EdificioSchema = new mongoose.Schema({
  nome: String, icone: String, tag: String, descricao: String,
  colunas: [{ key: String, label: String, tipo: String }],
  niveis: mongoose.Schema.Types.Mixed,
}, { collection: 'doa_edificios' });

const DragaoSchema = new mongoose.Schema({
  nome: String, elemento: String, emoji: String, raridade: String,
  niveis: [{
    nivel: Number, xpNecessaria: Number,
    vida: Number, defesa: Number, ataquePerto: Number, ataqueDistante: Number,
    alcance: Number, velocidade: Number, ataqueElemental: Number,
  }],
}, { collection: 'doa_dragoes' });

const PesquisaSchema = new mongoose.Schema({
  nome: String, icone: String, descricao: String, categoria: String,
  nivelMax: Number, ordem: Number,
  niveis: [{ nivel: Number, tempo: String }],
}, { collection: 'doa_pesquisas' });

const NivelSchema = new mongoose.Schema({
  nivel: Number, xp: Number,
}, { collection: 'doa_niveis' });

// ── Formata tempo de pesquisa para leitura ────────────────────────────────────
const fmtTempo = t => t || '?';

// ── Monta contexto completo do banco ─────────────────────────────────────────
const buildContext = async () => {
  try {
    const [tropas, itens, edificios, dragoes, pesquisas, niveis] = await Promise.all([
      mdl('AssT', TropaSchema,    'doa_tropas').find({}).lean(),
      mdl('AssI', ItemSchema,     'doa_itens').find({}).lean(),
      mdl('AssE', EdificioSchema, 'doa_edificios').find({}).lean(),
      mdl('AssD', DragaoSchema,   'doa_dragoes').find({}).lean(),
      mdl('AssP', PesquisaSchema, 'doa_pesquisas').find({}).sort({ categoria: 1, ordem: 1 }).lean(),
      mdl('AssN', NivelSchema,    'doa_niveis').find({}).sort({ nivel: 1 }).lean(),
    ]);

    // ── Tropas (ordenadas por poder desc) ────────────────────────────────────
    const tropasTxt = tropas.length
      ? [...tropas].sort((a, b) => (b.poder || 0) - (a.poder || 0)).map((t, i) =>
          `${i + 1}. ${t.nome} [${t.tipo || '?'}]\n` +
          `   Poder:${t.poder ?? 0} | Vida:${t.vida ?? 0} | Def:${t.def ?? 0} | ` +
          `AtqPerto:${t.atqPerto ?? 0} | AtqDist:${t.atqDist ?? 0} | Vel:${t.vel ?? 0}` +
          (t.desc ? `\n   Info: ${t.desc}` : '')
        ).join('\n\n')
      : 'Nenhuma tropa cadastrada.';

    // ── Itens ─────────────────────────────────────────────────────────────────
    const itensTxt = itens.length
      ? itens.map(i =>
          `• ${i.nome}` +
          (i.descricao ? `\n  Descrição: ${i.descricao}` : '') +
          (i.onde      ? `\n  Como obter: ${i.onde}` : '')
        ).join('\n\n')
      : 'Nenhum item cadastrado.';

    // ── Edifícios (com resumo de níveis) ─────────────────────────────────────
    const edificiosTxt = edificios.length
      ? edificios.map(e => {
          const niveisArr = Array.isArray(e.niveis) ? e.niveis : [];
          const primeiro  = niveisArr[0];
          const ultimo    = niveisArr[niveisArr.length - 1];
          const cols      = (e.colunas || []).map(c => c.label).join(', ');
          let resumo = '';
          if (primeiro && ultimo && e.colunas?.length) {
            const fmt = (n) => e.colunas.map(c => `${c.label}:${n[c.key] ?? '?'}`).join(', ');
            resumo = `\n  Nível 1: ${fmt(primeiro)} | Nível ${niveisArr.length}: ${fmt(ultimo)}`;
          }
          return `• ${e.nome}${e.tag ? ` [${e.tag}]` : ''}` +
            (e.descricao ? `\n  ${e.descricao}` : '') +
            (cols ? `\n  Atributos: ${cols}` : '') +
            resumo;
        }).join('\n\n')
      : 'Nenhum edifício cadastrado.';

    // ── Dragões (com stats do nível máximo cadastrado) ────────────────────────
    const dragoesTxt = dragoes.length
      ? dragoes.map(d => {
          const niveisArr = Array.isArray(d.niveis) ? d.niveis : [];
          const maxN = niveisArr[niveisArr.length - 1];
          let statsMax = '';
          if (maxN) {
            statsMax = `\n  Stats (nível ${maxN.nivel}): Vida:${maxN.vida ?? 0} | ` +
              `Def:${maxN.defesa ?? 0} | AtqPerto:${maxN.ataquePerto ?? 0} | ` +
              `AtqDist:${maxN.ataqueDistante ?? 0} | Elemental:${maxN.ataqueElemental ?? 0}`;
          }
          return `• ${d.nome}${d.elemento ? ` [${d.elemento}]` : ''}${d.raridade ? ` — ${d.raridade}` : ''}` +
            statsMax;
        }).join('\n\n')
      : 'Nenhum dragão cadastrado.';

    // ── Pesquisas (agrupadas por categoria) ───────────────────────────────────
    const pesquisasTxt = pesquisas.length
      ? (() => {
          const grupos = {};
          pesquisas.forEach(p => {
            const cat = p.categoria || 'Geral';
            if (!grupos[cat]) grupos[cat] = [];
            const niveisInfo = (p.niveis || []).length
              ? `\n  Níveis: ${(p.niveis || []).map(n => `Nv${n.nivel}=${fmtTempo(n.tempo)}`).join(' | ')}`
              : '';
            grupos[cat].push(
              `  • ${p.nome} (máx nível ${p.nivelMax ?? '?'})` +
              (p.descricao ? `\n    ${p.descricao}` : '') +
              niveisInfo
            );
          });
          return Object.entries(grupos)
            .map(([cat, itens]) => `[${cat}]\n${itens.join('\n\n')}`)
            .join('\n\n');
        })()
      : 'Nenhuma pesquisa cadastrada.';

    // ── Níveis do castelo ─────────────────────────────────────────────────────
    const niveisTxt = niveis.length
      ? niveis.map(n =>
          `  Nível ${n.nivel}: ${n.xp != null ? `${n.xp.toLocaleString('pt-BR')} XP` : 'XP desconhecido'}`
        ).join('\n')
      : 'Tabela de níveis não cadastrada.';

    return { tropasTxt, itensTxt, edificiosTxt, dragoesTxt, pesquisasTxt, niveisTxt };
  } catch (e) {
    console.error('[assistente] erro contexto:', e.message);
    return { tropasTxt:'', itensTxt:'', edificiosTxt:'', dragoesTxt:'', pesquisasTxt:'', niveisTxt:'' };
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

  const { tropasTxt, itensTxt, edificiosTxt, dragoesTxt, pesquisasTxt, niveisTxt } =
    await buildContext();

  const systemPrompt = `Você é o CONSELHEIRO TÁTICO do Guia DOA — especialista máximo em Dragon's of Aether (DOA), jogo mobile de estratégia com tropas, dragões, torneios, pesquisas e alianças. Dê conselhos práticos como um veterano.

━━━━━━━━━━━━━━━━━━━━━━━━
REGRAS DE COMPORTAMENTO
━━━━━━━━━━━━━━━━━━━━━━━━
1. Responda SEMPRE em português brasileiro informal e amigável.
2. Use os DADOS DO BANCO abaixo como fonte primária. Se não estiver nos dados, diga claramente.
3. Para COMPARAÇÕES — analise os números, justifique e dê uma recomendação clara.
4. Para ESTRATÉGIAS — dê passos concretos, não respostas genéricas.
5. Para TORNEIOS — informe os pontos exatos, como obter e dica de maximização.
6. Para PESQUISAS — informe o nome, categoria, nível máximo e tempos por nível quando perguntado.
7. Para NÍVEIS — informe o XP necessário da tabela abaixo.
8. Use emojis com moderação para organizar (⚔️ 🐉 💡 ⚠️ 📊 🎯 🔬 🏰).
9. Máximo 5 parágrafos ou 8 itens de lista. Seja direto e valioso.
10. NUNCA invente dados fora dos contextos abaixo.

━━━━━━━━━━━━━━━━━━━━━━━━
⚔️ TROPAS (por poder, maior primeiro):
━━━━━━━━━━━━━━━━━━━━━━━━
${tropasTxt}

━━━━━━━━━━━━━━━━━━━━━━━━
🎒 ITENS:
━━━━━━━━━━━━━━━━━━━━━━━━
${itensTxt}

━━━━━━━━━━━━━━━━━━━━━━━━
🏗️ EDIFÍCIOS (com atributos por nível):
━━━━━━━━━━━━━━━━━━━━━━━━
${edificiosTxt}

━━━━━━━━━━━━━━━━━━━━━━━━
🐉 DRAGÕES (stats do nível máximo):
━━━━━━━━━━━━━━━━━━━━━━━━
${dragoesTxt}

━━━━━━━━━━━━━━━━━━━━━━━━
🔬 PESQUISAS (por categoria e tempos):
━━━━━━━━━━━━━━━━━━━━━━━━
${pesquisasTxt}

━━━━━━━━━━━━━━━━━━━━━━━━
🏰 TABELA DE NÍVEIS DO CASTELO (XP necessário):
━━━━━━━━━━━━━━━━━━━━━━━━
${niveisTxt}

━━━━━━━━━━━━━━━━━━━━━━━━
🏆 TORNEIOS — REGRAS COMPLETAS:
━━━━━━━━━━━━━━━━━━━━━━━━
TORNEIO DE PODER: acumular poder treinando tropas, evoluindo dragões, fazendo pesquisas e treinando generais.

TREINO DE TROPAS: treinar tropas com bônus x1/x2/x3/x4/x5 multiplicando os pontos. Priorize tropas com bônus ativo.

MATAR TROPAS: eliminar tropas inimigas. Estratégia: trocas com aliados (aliado manda tropas fracas → você ataca → reveze).

TREINAMENTO DO DRAGÃO (carnes): Carneiro=100pts | Boi=200pts | Frango=500pts | Veado=1.000pts | Salmão=2.000pts | Lagosta=5.000pts. Obtidas nas savanas nível 1-10 (3 carneiros, 2 bois, 3 frangos/dia), missões, Loja de Surpresas ou rubis.

HABILIDADE DE DRAGÃO: Essência da Fúria = 100pts cada. Obter em Antropos nv10, Florestas nv10, Bastião dos Dragões, Expedição, eventos.

TALISMÃS: Torre de Oração = 3 grátis/dia. Verde=20pts | Azul=30pts | Roxo=800pts | Laranja=12.000pts. Também em eventos e rubis.

EVOLUÇÃO DE TROPAS (fósseis): Fóssil Crepúsculo 1=10pts | Fóssil Crepúsculo 2=10pts | Fóssil Ancião 1=10pts | Fóssil Ancião 2=10pts. Obtidos atacando Antropos nv1-10 → Lembranças Antigas → Loja de Surpresas.

TORNEIO DE CONHECIMENTO: usar Poções Antigas (Primária, Intermediária, Superior).

TORNEIO DE ACELERAÇÕES: usar acelerações de tempo (construção, pesquisa, treinamento).

APRIMORAMENTO DE GENERAL: aumentar XP dos generais usando cartas no Quartel do General. Guarde cartas ao longo da semana e use em massa no torneio.

TORNEIOS DE ALIANÇA — Tipo 1 (Poder): ganhar poder individual. Tipo 2 (Atual): treinar dragões e ajudar aliados.

━━━━━━━━━━━━━━━━━━━━━━━━
🗺️ MECÂNICAS DO JOGO:
━━━━━━━━━━━━━━━━━━━━━━━━
• Savanas nv1-10: recursos diários (carneiros, bois, frangos)
• Antropos nv1-10: Lembranças Antigas e Essências da Fúria
• Florestas nv10: Essências da Fúria
• Torre de Oração: 3 talismãs/dia (aleatórios)
• Loja de Surpresas: troca de recursos especiais por itens raros
• Quartel do General: treinamento e evolução de generais com cartas
• Bastião dos Dragões: missões com recompensas de dragão
• Expedição do Dragão: recompensas periódicas de essências
• Rubis: moeda premium para comprar recursos raros`;

  const mensagens = [
    ...historico.slice(-14).map(m => ({ role: m.role, content: m.content })),
    { role: 'user', content: pergunta.trim() },
  ];

  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
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
