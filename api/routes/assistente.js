import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// ── Reutiliza modelos já registrados ─────────────────────────────────────────
const mdl = (name, schema, col) => {
  if (mongoose.models[name]) return mongoose.models[name];
  return mongoose.model(name, schema, col);
};

// ── Schemas ───────────────────────────────────────────────────────────────────
const TropaSchema = new mongoose.Schema({
  nome: String, poder: Number, vida: Number, def: Number,
  atqPerto: Number, atqDist: Number, alcance: Number,
  vel: Number, car: Number, gestao: Number, desc: String,
  tipo: String, combate: String, rapida: Boolean,
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
  nome: String, slug: String, elemento: String, emoji: String,
  emojiDragao: String, raridade: String, cor: String,
  niveis: [{
    nivel: Number, xpNecessaria: Number,
    vida: Number, defesa: Number, ataquePerto: Number, ataqueDistante: Number,
    alcance: Number, velocidade: Number,
    ataqueElemental: Number, impulsoElemental: Number, barreiraElemental: Number,
    bombardeioElemental: Number, confrontoElemental: Number,
    bloqueioElemental: Number, rupturaElemental: Number,
  }],
}, { collection: 'doa_dragoes' });

const PesquisaSchema = new mongoose.Schema({
  nome: String, slug: String, icone: String, descricao: String,
  categoria: String, nivelMax: Number, ordem: Number,
  niveis: [{ nivel: Number, tempo: String }],
}, { collection: 'doa_pesquisas' });

const NivelSchema = new mongoose.Schema({
  nivel: Number, xp: Number,
}, { collection: 'doa_niveis' });

const ReinoSchema = new mongoose.Schema({
  id: Number, slug: String, nome: String,
  fuso: String, regiao: String, idioma: String,
}, { collection: 'doa_reinos' });

// ── Dados estáticos de aprimoramento (não vêm do MongoDB) ─────────────────────
const APRIMORAMENTO = {
  raridades: ['Incomum', 'Raro', 'Épico', 'Lendário', 'Mitológico'],
  custoBase: [5, 8, 12, 18, 30], // fósseis por nível (ciclo de 5)
  multiplicadores: {
    fosseis:   { Incomum: 1, Raro: 2,  Épico: 4, Lendário: 8,  Mitológico: 15 },
    pocoes:    { Incomum: 0, Raro: 1,  Épico: 2, Lendário: 4,  Mitológico: 8  },
    reliquias: { Incomum: 0, Raro: 0,  Épico: 1, Lendário: 2,  Mitológico: 4  },
  },
  atributos: [
    { nome: 'Vida',                 tipo: 'ofensivo',  desc: 'Aumenta a vida da tropa.' },
    { nome: 'Ataque Elemental',     tipo: 'ofensivo',  desc: 'Ataques causam dano elemental extra.' },
    { nome: 'Impulso Elemental',    tipo: 'ofensivo',  contra: 'Barreira Elemental',   desc: 'Aumenta o dano elemental. Combatido pela Barreira Elemental.' },
    { nome: 'Barreira Elemental',   tipo: 'defensivo', contra: 'Impulso Elemental',    desc: 'Reduz dano elemental recebido. Combatido pelo Impulso Elemental.' },
    { nome: 'Bombardeio Elemental', tipo: 'ofensivo',  contra: 'Confronto Elemental',  desc: 'Dano crítico elemental de 250%. Combatido pelo Confronto Elemental.' },
    { nome: 'Confronto Elemental',  tipo: 'defensivo', contra: 'Bombardeio Elemental', desc: 'Reduz chance de críticos elementais recebidos.' },
    { nome: 'Bloqueio Elemental',   tipo: 'defensivo', contra: 'Ruptura Elemental',    desc: 'Chance de bloquear 60% do dano elemental.' },
    { nome: 'Ruptura Elemental',    tipo: 'ofensivo',  contra: 'Bloqueio Elemental',   desc: 'Reduz a chance de bloqueio do alvo.' },
  ],
  categorias: [
    { cat: 1, tropas: 'Minotauros, Arqueiros, Dragões de Ataque Rápido' },
    { cat: 2, tropas: 'Dragões de Combate' },
    { cat: 3, tropas: 'Andarilhos da Areia, Hoplitas' },
    { cat: 4, tropas: 'Gigantes, Abissais, Terrores do Pântano' },
    { cat: 5, tropas: 'Espelhos de Fogo, Bigas de Fogo, Serpente Vingativa, Canhão Elétrico, Amarande' },
    { cat: 6, tropas: 'Ogro de Granito, Serpente Arsênica, Dragonete da Tempestade, Magmassauros, Guerreiro do Magma' },
    { cat: 7, tropas: 'Titã Petrificado, Dragão do Veneno, Golem do Trovão, Gigante do Gelo, Leviatã Ártico, Cavaleiro Dragão, Centauros Infernais, Condenadores, Cavaleiros Espectrais' },
    { cat: 8, tropas: 'Perseguidor das Sombras, Escaravelho de Guerra, Arruinador Dimensional, Megalibgwilia, Medusa, Gatuno Alado' },
    { cat: 9, tropas: 'Esmagadores Colossais, Fantasma do Trovão, Lordes da Lava' },
  ],
};

// Calcula custo de aprimoramento para um intervalo de níveis
const calcCustoApr = (raridade, nivelDe, nivelAte) => {
  const mF = APRIMORAMENTO.multiplicadores.fosseis[raridade]   || 0;
  const mP = APRIMORAMENTO.multiplicadores.pocoes[raridade]    || 0;
  const mR = APRIMORAMENTO.multiplicadores.reliquias[raridade] || 0;
  let f = 0, p = 0, r = 0;
  for (let n = nivelDe; n <= nivelAte; n++) {
    const base = APRIMORAMENTO.custoBase[(n - 1) % 5];
    f += base * mF; p += base * mP; r += base * mR;
  }
  return { fosseis: f, pocoes: p, reliquias: r };
};

// ── Busca todos os dados do MongoDB ──────────────────────────────────────────
const buildContext = async () => {
  try {
    const [tropas, itens, edificios, dragoes, pesquisas, niveis, reinos] = await Promise.all([
      mdl('AssT', TropaSchema,    'doa_tropas').find({}).lean(),
      mdl('AssI', ItemSchema,     'doa_itens').find({}).lean(),
      mdl('AssE', EdificioSchema, 'doa_edificios').find({}).lean(),
      mdl('AssD', DragaoSchema,   'doa_dragoes').find({}).lean(),
      mdl('AssP', PesquisaSchema, 'doa_pesquisas').find({}).sort({ categoria: 1, ordem: 1 }).lean(),
      mdl('AssN', NivelSchema,    'doa_niveis').find({}).sort({ nivel: 1 }).lean(),
      mdl('AssR', ReinoSchema,    'doa_reinos').find({}).sort({ id: 1 }).lean(),
    ]);

    // ── TROPAS ────────────────────────────────────────────────────────────────
    const tropasTxt = tropas.length
      ? [...tropas].sort((a, b) => (b.poder || 0) - (a.poder || 0)).map((t, i) => {
          const combate = t.combate === 'distancia' ? 'Distância' : 'Corpo a Corpo';
          const flags   = [t.rapida && 'Rápida', t.tipo === 'especial' && 'Especial'].filter(Boolean).join(' · ');
          return (
            `${i + 1}. **${t.nome}** [${combate}${flags ? ' · ' + flags : ''}]\n` +
            `   Poder:${t.poder ?? 0} | Vida:${t.vida ?? 0} | Def:${t.def ?? 0} | ` +
            `AtqPerto:${t.atqPerto ?? 0} | AtqDist:${t.atqDist ?? 0}\n` +
            `   Alcance:${t.alcance ?? 0} | Vel:${t.vel ?? 0} | Carga:${t.car ?? 0} | Gestão:${t.gestao ?? 0}` +
            (t.desc ? `\n   Habilidade: ${t.desc}` : '')
          );
        }).join('\n\n')
      : 'Nenhuma tropa cadastrada.';

    // ── ITENS ─────────────────────────────────────────────────────────────────
    const itensTxt = itens.length
      ? itens.map(i =>
          `• **${i.nome}**` +
          (i.descricao ? `: ${i.descricao}` : '') +
          (i.onde      ? ` | Onde obter: ${i.onde}` : '')
        ).join('\n')
      : 'Nenhum item cadastrado.';

    // ── EDIFÍCIOS — tabela completa de níveis ─────────────────────────────────
    const edificiosTxt = edificios.length
      ? edificios.map(e => {
          const niveisArr = Array.isArray(e.niveis) ? e.niveis : [];
          const cols      = e.colunas || [];
          const tabelaNiveis = niveisArr.length && cols.length
            ? '\n  Níveis:\n' + niveisArr.map(n =>
                `    Nv${n.nivel}: ` + cols.map(c => `${c.label}:${n[c.key] ?? '?'}`).join(' | ')
              ).join('\n')
            : '';
          return (
            `• **${e.nome}**${e.tag ? ` [${e.tag}]` : ''}` +
            (e.descricao ? ` — ${e.descricao}` : '') +
            tabelaNiveis
          );
        }).join('\n\n')
      : 'Nenhum edifício cadastrado.';

    // ── DRAGÕES — todos os níveis ─────────────────────────────────────────────
    const dragoesTxt = dragoes.length
      ? dragoes.map(d => {
          const nArr = Array.isArray(d.niveis) ? d.niveis : [];
          const tabelaNiveis = nArr.length
            ? '\n  Níveis:\n' + nArr.map(n =>
                `    Nv${n.nivel}` +
                (n.xpNecessaria ? ` (XP:${n.xpNecessaria.toLocaleString('pt-BR')})` : '') +
                ` | Vida:${n.vida ?? 0} | Def:${n.defesa ?? 0} | AtqPerto:${n.ataquePerto ?? 0}` +
                ` | AtqDist:${n.ataqueDistante ?? 0} | Elemental:${n.ataqueElemental ?? 0}`
              ).join('\n')
            : '';
          return (
            `• **${d.nome}**` +
            (d.elemento ? ` [${d.elemento}]` : '') +
            (d.raridade ? ` — ${d.raridade}` : '') +
            tabelaNiveis
          );
        }).join('\n\n')
      : 'Nenhum dragão cadastrado.';

    // ── PESQUISAS — agrupadas com todos os tempos ─────────────────────────────
    const pesquisasTxt = pesquisas.length
      ? (() => {
          const grupos = {};
          pesquisas.forEach(p => {
            const cat = p.categoria || 'Geral';
            if (!grupos[cat]) grupos[cat] = [];
            const niveisInfo = (p.niveis || []).length
              ? ` | Tempos: ${p.niveis.map(n => `Nv${n.nivel}=${n.tempo || '?'}`).join(', ')}`
              : '';
            grupos[cat].push(`  • **${p.nome}** (máx Nv${p.nivelMax ?? '?'})${niveisInfo}`);
          });
          return Object.entries(grupos)
            .map(([cat, lista]) => `[${cat}]\n${lista.join('\n')}`)
            .join('\n\n');
        })()
      : 'Nenhuma pesquisa cadastrada.';

    // ── NÍVEIS DO CASTELO ─────────────────────────────────────────────────────
    const niveisTxt = niveis.length
      ? niveis.map(n =>
          `  Nv${n.nivel}: ${n.xp != null ? n.xp.toLocaleString('pt-BR') + ' XP' : 'desconhecido'}`
        ).join('\n')
      : 'Tabela de níveis não cadastrada.';

    // ── REINOS ────────────────────────────────────────────────────────────────
    const reinosTxt = reinos.length
      ? reinos.map(r =>
          `  Reino ${r.id} — ${r.nome}` +
          (r.regiao ? ` | ${r.regiao}` : '') +
          (r.fuso   ? ` | ${r.fuso}` : '') +
          (r.idioma ? ` | ${r.idioma}` : '')
        ).join('\n')
      : 'Nenhum reino cadastrado.';

    // ── APRIMORAMENTO ─────────────────────────────────────────────────────────
    const aprTxt =
      `Raridades (em ordem): ${APRIMORAMENTO.raridades.join(' → ')}\n\n` +
      `Custo por nível (ciclo base de 5 atributos): ${APRIMORAMENTO.custoBase.join(', ')} fósseis\n` +
      `Multiplicadores de fósseis por raridade: ` +
        Object.entries(APRIMORAMENTO.multiplicadores.fosseis).map(([r, v]) => `${r}:x${v}`).join(' | ') + '\n' +
      `Multiplicadores de poções: ` +
        Object.entries(APRIMORAMENTO.multiplicadores.pocoes).map(([r, v]) => `${r}:x${v}`).join(' | ') + '\n' +
      `Multiplicadores de relíquias: ` +
        Object.entries(APRIMORAMENTO.multiplicadores.reliquias).map(([r, v]) => `${r}:x${v}`).join(' | ') + '\n\n' +
      `Atributos disponíveis:\n` +
        APRIMORAMENTO.atributos.map(a =>
          `  • ${a.nome} [${a.tipo}]${a.contra ? ` — contra: ${a.contra}` : ''}: ${a.desc}`
        ).join('\n') + '\n\n' +
      `Categorias de tropas para aprimoramento:\n` +
        APRIMORAMENTO.categorias.map(c =>
          `  Categoria ${c.cat}: ${c.tropas}`
        ).join('\n') + '\n\n' +
      `Exemplos de custo total calculado:\n` + [
        ['Épico', 1, 5], ['Épico', 1, 10], ['Lendário', 1, 5], ['Lendário', 1, 10], ['Mitológico', 1, 5],
      ].map(([r, de, ate]) => {
        const c = calcCustoApr(r, de, ate);
        return `  ${r} Nv${de}→${ate}: ${c.fosseis} fósseis | ${c.pocoes} poções | ${c.reliquias} relíquias`;
      }).join('\n');

    return { tropasTxt, itensTxt, edificiosTxt, dragoesTxt, pesquisasTxt, niveisTxt, reinosTxt, aprTxt };
  } catch (e) {
    console.error('[assistente] erro contexto:', e.message);
    return { tropasTxt:'', itensTxt:'', edificiosTxt:'', dragoesTxt:'', pesquisasTxt:'', niveisTxt:'', reinosTxt:'', aprTxt:'' };
  }
};

// ── Detecta intenção da pergunta para personalizar foco do sistema ─────────────
const detectarIntencao = (pergunta) => {
  const p = pergunta.toLowerCase();
  if (/aprimoramento|aperfei|fóssil|fosseil|raridade|incomum|raro|épico|lendário|mitológico|atributo elemental|bloqueio|ruptura|barreira|bombardeio|impulso|confronto/.test(p)) return 'aprimoramento';
  if (/torneio|pontos?|pontua|carneiro|boi|frango|veado|salmão|lagosta|aceleraç|talismã|fóssil|poção|matar trop|abat|general/.test(p)) return 'torneio';
  if (/pesquisa|árvore do conhecimento|tempo de pesquisa|categoria de pesquisa/.test(p)) return 'pesquisa';
  if (/dragão|dragao|dragon|elemento|raridade do dragão/.test(p)) return 'dragao';
  if (/edifício|edificio|fazenda|casa|mina|pedreira|serraria|fortaleza|fonte|sentinela|viveiro|fábrica|pérola/.test(p)) return 'edificio';
  if (/tropa|poder|vida|defesa|velocidade|alcance|carga|combate|corpo a corpo|distância/.test(p)) return 'tropa';
  if (/nível|nivel|xp|poder necessário|castelo/.test(p)) return 'nivel';
  if (/reino|fuso|região|idioma/.test(p)) return 'reino';
  if (/ilha|savana|fazenda de pérola|guarnição|expansão/.test(p)) return 'ilha';
  return 'geral';
};

// ── POST /api/assistente ──────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  const { pergunta, historico = [] } = req.body;

  if (!pergunta || typeof pergunta !== 'string' || pergunta.trim().length < 2)
    return res.status(400).json({ erro: 'Pergunta inválida.' });

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey)
    return res.status(500).json({ erro: 'Chave da API não configurada.' });

  const { tropasTxt, itensTxt, edificiosTxt, dragoesTxt, pesquisasTxt, niveisTxt, reinosTxt, aprTxt } =
    await buildContext();

  const intencao = detectarIntencao(pergunta);

  // ── Blocos de contexto relevantes por intenção ────────────────────────────
  const blocos = {
    tropa:        `━━ ⚔️ TROPAS (por poder):\n${tropasTxt}`,
    dragao:       `━━ 🐉 DRAGÕES (stats por nível):\n${dragoesTxt}`,
    edificio:     `━━ 🏗️ EDIFÍCIOS (tabela de níveis):\n${edificiosTxt}`,
    pesquisa:     `━━ 🔬 PESQUISAS (com tempos):\n${pesquisasTxt}`,
    nivel:        `━━ 🏰 NÍVEIS DO CASTELO:\n${niveisTxt}`,
    reino:        `━━ 🌍 REINOS:\n${reinosTxt}`,
    aprimoramento:`━━ 🔮 APRIMORAMENTO DE TROPAS:\n${aprTxt}`,
    item:         `━━ 🎒 ITENS:\n${itensTxt}`,
    torneio:      '', // incluído sempre abaixo
    ilha:         '', // mecânica estática
    geral:        '',
  };

  // Para perguntas gerais ou de torneio, inclui todos os blocos dinâmicos
  const blocosAtivos = intencao === 'geral'
    ? [blocos.tropa, blocos.dragao, blocos.edificio, blocos.pesquisa, blocos.nivel, blocos.reino, blocos.aprimoramento, blocos.item]
    : intencao === 'torneio'
    ? [blocos.tropa, blocos.item, blocos.aprimoramento]
    : [blocos[intencao], blocos.item].filter(Boolean);

  const systemPrompt = `Você é o CONSELHEIRO TÁTICO do Guia DOA — especialista em Dragon's of Aether (DOA). Você conhece tropas, dragões, edifícios, pesquisas, aprimoramentos, torneios, generais, ilhas e reinos.

━━ REGRAS:
1. Responda SEMPRE em português brasileiro informal e amigável.
2. Use os DADOS DO BANCO abaixo como fonte primária. Se não estiver nos dados, diga claramente.
3. Para CÁLCULOS — calcule diretamente com os números reais (ex: "50 lagostas = 50 × 5.000 = 250.000 pts").
4. Para COMPARAÇÕES — analise números, justifique e dê recomendação clara.
5. Para APRIMORAMENTO — use a tabela de custos e multiplicadores exatos.
6. Para ESTRATÉGIAS — passos concretos, nunca genéricos.
7. Use emojis para organizar (⚔️ 🐉 💡 ⚠️ 📊 🎯 🔬 🏰 🔮).
8. Seja direto. Máximo 6 parágrafos ou 10 itens.
9. NUNCA invente dados. Se não souber, diga explicitamente.

${blocosAtivos.join('\n\n')}

━━ 🏆 TORNEIOS — PONTUAÇÕES EXATAS:
▸ TREINO DE TROPAS: Qtd × Poder da Tropa × Bônus (x1/x2/x3/x4/x5). Sempre use bônus máximo disponível.
▸ TREINAMENTO DO DRAGÃO (carnes): Carneiro=100 | Boi=200 | Frango=500 | Veado=1.000 | Salmão=2.000 | Lagosta=5.000 pts
  Obtidas: Savanas nv1-10 (3 carneiros+2 bois+3 frangos/dia), missões, Loja de Surpresas, rubis.
▸ HABILIDADE DO DRAGÃO: Essência da Fúria = 100 pts/un. Fonte: Antropos nv10, Florestas nv10, Bastião, Expedição.
▸ TALISMÃS: Verde=20 | Azul=30 | Roxo=800 | Laranja=12.000 pts. Torre de Oração: 3/dia (aleatórios).
▸ EVOLUÇÃO DE TROPAS (fósseis): A cada 10 fósseis usados = 1 ponto. Fonte: Antropos nv1-10 → Lembranças Antigas → Loja.
▸ MATAR TROPAS: pontos por abates. Tática: trocar tropas fracas com aliados e se atacar mutuamente.
▸ TORNEIO DE CONHECIMENTO: Poção Primária=10 | Intermediária=30 | Superior=50 pts
▸ ACELERAÇÕES: Qtd × Minutos = pts. (1min=1pt, 1h=60pts, 1dia=1440pts, 2dias=2880pts, 4dias=5760pts)
▸ APRIMORAMENTO DE GENERAL: XP ganho pelos generais. Guarde cartas durante a semana, use em massa.
▸ ALIANÇA — Poder: treinar tropas+pesquisas+evoluir dragões. Atual: alimentar dragões+ajudar aliados.

━━ 🗺️ MECÂNICAS:
• Savanas nv1-10: 3 carneiros+2 bois+3 frangos/dia por savana
• Antropos nv1-10: Lembranças Antigas e Essências da Fúria
• Torre de Oração: 3 talismãs aleatórios/dia
• Loja de Surpresas: troca Lembranças Antigas por fósseis e itens raros
• Quartel do General: treinamento com cartas de XP
• Bastião dos Dragões + Expedição do Dragão: Essências da Fúria
• Ilhas (Principal, Fogo, Água, Bella, Terra): cada uma tem Casas, Fontes, Guarnições, Fazendas, Minas, Pedreiras, Serrarias, Fazendas de Pérolas. Ilhas Fogo/Bella/Terra precisam ser desbloqueadas.
• Rubis: moeda premium para carnes, talismãs, fósseis, acelerações

━━ 🔮 APRIMORAMENTO DE TROPAS (resumo):
${aprTxt}`;

  const mensagens = [
    ...historico.slice(-20).map(m => ({ role: m.role, content: m.content })),
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
        max_tokens: 1400,
        temperature: 0.35,
        top_p: 0.85,
        stream: false,
      }),
    });

    if (!groqRes.ok) {
      const err = await groqRes.text();
      console.error('[assistente] Groq erro:', err);
      return res.status(502).json({ erro: 'Erro ao consultar o assistente. Tente novamente.' });
    }

    const data = await groqRes.json();
    const resposta = data.choices?.[0]?.message?.content?.trim() || 'Não consegui gerar uma resposta.';

    // Devolve também a intenção detectada para debug (opcional)
    res.json({ resposta, intencao });
  } catch (e) {
    console.error('[assistente] fetch error:', e.message);
    res.status(502).json({ erro: 'Falha na conexão com o assistente.' });
  }
});

export default router;
