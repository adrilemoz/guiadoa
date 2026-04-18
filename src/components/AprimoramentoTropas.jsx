import React, { useState } from 'react';
import {
  Box, Card, Grid, Typography, TextField,
  Accordion, AccordionSummary, AccordionDetails,
  Chip, Divider, Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { C } from '../theme.js';

// ─────────────────────────────────────────────────────────────────────────────
// DADOS DE APRIMORAMENTO — pedras por nível
// Custo por nível (Fósseis/Poções/Relíquias) para cada raridade
// ─────────────────────────────────────────────────────────────────────────────
// Estrutura: cada entrada = { nivel, foss, pocoes, reliq }
// O custo cresce por raridade × nível dentro do bloco de 5
const RARIDADES = ['Incomum', 'Raro', 'Épico', 'Lendário', 'Mitológico'];
const RARITY_COLORS = {
  'Incomum':   '#5A8A5C',
  'Raro':      '#5C7FA3',
  'Épico':     '#8B6BAE',
  'Lendário':  '#C87A2C',
  'Mitológico':'#A83C2C',
};

// Custo base de fósseis por nível dentro do bloco de 5 (index 0..4)
// e multiplicador por raridade
const CUSTO_BASE_FOSSEIS = [5, 8, 12, 18, 30];
const MULT_RARIDADE_FOSS = { 'Incomum': 1, 'Raro': 2, 'Épico': 4, 'Lendário': 8, 'Mitológico': 15 };
const MULT_RARIDADE_POC  = { 'Incomum': 0, 'Raro': 1, 'Épico': 2, 'Lendário': 4, 'Mitológico': 8 };
const MULT_RARIDADE_REL  = { 'Incomum': 0, 'Raro': 0, 'Épico': 1, 'Lendário': 2, 'Mitológico': 4 };

function getCustoNivel(raridade, nivel) {
  const idx = (nivel - 1) % 5;
  const foss  = CUSTO_BASE_FOSSEIS[idx] * MULT_RARIDADE_FOSS[raridade];
  const poc   = CUSTO_BASE_FOSSEIS[idx] * MULT_RARIDADE_POC[raridade];
  const rel   = CUSTO_BASE_FOSSEIS[idx] * MULT_RARIDADE_REL[raridade];
  return { foss, poc, rel };
}

// ─────────────────────────────────────────────────────────────────────────────
// ATRIBUTOS
// ─────────────────────────────────────────────────────────────────────────────
const ATRIBUTOS = [
  {
    nome: 'Vida',
    icon: '❤️',
    cor: '#C85C5C',
    desc: 'Aumenta a vida da tropa. Pode acumular com o aumento da vida através do nível de tropa. Pode ser beneficiado por outros bônus de vida.',
    tipo: 'ofensivo',
  },
  {
    nome: 'Ataque Elemental',
    icon: '⚡',
    cor: '#C87A2C',
    desc: 'Ataques de perto e à distância das suas tropas causam dano elemental extra.',
    tipo: 'ofensivo',
  },
  {
    nome: 'Impulso Elemental',
    icon: '🔥',
    cor: '#D08A3C',
    desc: 'Aumenta o dano elemental extra. Combatido pela Barreira Elemental.',
    tipo: 'ofensivo',
    contra: 'Barreira Elemental',
  },
  {
    nome: 'Barreira Elemental',
    icon: '🛡️',
    cor: '#5C7FA3',
    desc: 'Reduz seu dano elemental recebido. Combatido pelo Impulso Elemental.',
    tipo: 'defensivo',
    contra: 'Impulso Elemental',
  },
  {
    nome: 'Bombardeio Elemental',
    icon: '💥',
    cor: '#8B6BAE',
    desc: 'Permite dano elemental crítico (250% de dano). A chance do crítico depende do Bombardeio Elemental. Combatido pelo Confronto Elemental.',
    tipo: 'ofensivo',
    contra: 'Confronto Elemental',
    critico: '250%',
  },
  {
    nome: 'Confronto Elemental',
    icon: '🔰',
    cor: '#5A8A5C',
    desc: 'Reduz sua chance de receber golpes elementais críticos. Combatido pelo Bombardeio Elemental.',
    tipo: 'defensivo',
    contra: 'Bombardeio Elemental',
  },
  {
    nome: 'Bloqueio Elemental',
    icon: '🪬',
    cor: '#5C7FA3',
    desc: 'Possui uma chance de bloquear 60% do dano elemental recebido. A chance de bloqueio depende do Bloqueio Elemental. Combatido pela Ruptura Elemental.',
    tipo: 'defensivo',
    contra: 'Ruptura Elemental',
    bloqueio: '60%',
  },
  {
    nome: 'Ruptura Elemental',
    icon: '⚔️',
    cor: '#A83C2C',
    desc: 'Reduz a chance de bloqueio do alvo. Combatido pelo Bloqueio Elemental.',
    tipo: 'ofensivo',
    contra: 'Bloqueio Elemental',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORIAS DE TROPAS
// ─────────────────────────────────────────────────────────────────────────────
const CATEGORIAS = [
  { cat: 1, tropas: 'Minotauros, Arqueiros, Dragões de Ataque Rápido' },
  { cat: 2, tropas: 'Dragões de Combate' },
  { cat: 3, tropas: 'Andarilhos da Areia, Hoplitas' },
  { cat: 4, tropas: 'Gigantes, Abissais, Terrores do Pântano' },
  { cat: 5, tropas: 'Espelhos de Fogo, Bigas de Fogo, Serpente Vingativa, Canhão Elétrico, Amarande' },
  { cat: 6, tropas: 'Ogro de Granito, Serpente Arsênica, Dragonete da Tempestade, Magmassauros, Guerreiro do Magma' },
  { cat: 7, tropas: 'Titã Petrificado, Dragão do Veneno, Golem do Trovão, Gigante do Gelo, Leviatã Ártico, Cavaleiro Dragão, Centauros Infernais, Condenadores, Cavaleiros Espectrais' },
  { cat: 8, tropas: 'Perseguidor das Sombras, Escaravelho de Guerra, Arruinador Dimensional, Megalibgwilia, Medusa, Gatuno Alado' },
  { cat: 9, tropas: 'Esmagadores Colossais, Fantasma do Trovão, Lordes da Lava' },
];

// ─────────────────────────────────────────────────────────────────────────────
// HEADER ESTILO PERGAMINHO
// ─────────────────────────────────────────────────────────────────────────────
const ParchmentHeader = ({ title, sub }) => (
  <Box sx={{
    background: `linear-gradient(180deg, ${C.BG_SECONDARY} 0%, ${C.BG_CARD_TOP} 100%)`,
    border: `1.5px solid ${C.BORDER}`,
    borderRadius: '10px',
    p: '12px 16px',
    textAlign: 'center',
    position: 'relative',
    mb: 2,
    boxShadow: '0 2px 8px rgba(62,47,28,0.10)',
  }}>
    <Box component="span" sx={{ position: 'absolute', top: 6, left: 10, color: C.ACCENT, fontSize: 11, opacity: 0.7 }}>◆</Box>
    <Box component="span" sx={{ position: 'absolute', top: 6, right: 10, color: C.ACCENT, fontSize: 11, opacity: 0.7 }}>◆</Box>
    <Typography sx={{ fontFamily: '"Nunito", sans-serif', fontWeight: 700, fontSize: '0.80rem', letterSpacing: '2.5px', textTransform: 'uppercase', color: C.TEXT_PRIMARY }}>
      {title}
    </Typography>
    {sub && (
      <Typography sx={{ fontFamily: '"Nunito", sans-serif', fontSize: '0.75rem', color: C.TEXT_MUTED, mt: 0.3, fontStyle: 'italic' }}>
        {sub}
      </Typography>
    )}
  </Box>
);

const SectionDivider = ({ label }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 1.5 }}>
    <Box sx={{ flex: 1, height: '1px', background: `linear-gradient(90deg, transparent, ${C.BORDER})` }} />
    <Box component="span" sx={{ color: C.ACCENT, fontSize: '0.7rem' }}>◆</Box>
    {label && (
      <>
        <Typography sx={{ fontFamily: '"Nunito", sans-serif', fontWeight: 700, fontSize: '0.68rem', letterSpacing: '2px', color: C.TEXT_MUTED, whiteSpace: 'nowrap' }}>
          {label}
        </Typography>
        <Box component="span" sx={{ color: C.ACCENT, fontSize: '0.7rem' }}>◆</Box>
      </>
    )}
    <Box sx={{ flex: 1, height: '1px', background: `linear-gradient(270deg, transparent, ${C.BORDER})` }} />
  </Box>
);

// ─────────────────────────────────────────────────────────────────────────────
// CALCULADORA DE PEDRAS
// ─────────────────────────────────────────────────────────────────────────────
const Calculadora = () => {
  const [raridade, setRaridade]   = useState('Épico');
  const [nivelDe,  setNivelDe]    = useState('1');
  const [nivelAte, setNivelAte]   = useState('5');
  const [resultado, setResultado] = useState(null);

  const calcular = () => {
    const de   = Math.max(1, parseInt(nivelDe)  || 1);
    const ate  = Math.max(de, parseInt(nivelAte) || de);
    let totalF = 0, totalP = 0, totalR = 0;
    const detalhe = [];
    for (let n = de; n <= ate; n++) {
      const { foss, poc, rel } = getCustoNivel(raridade, n);
      totalF += foss; totalP += poc; totalR += rel;
      detalhe.push({ nivel: n, foss, poc, rel });
    }
    setResultado({ totalF, totalP, totalR, detalhe, de, ate, raridade });
  };

  const cor = RARITY_COLORS[raridade];

  return (
    <Card sx={{ p: 2.5, mb: 3, borderLeft: `5px solid ${cor}` }}>
      <Typography sx={{
        color: C.TEXT_PRIMARY, fontWeight: 900, fontSize: '1rem',
        mb: 1.5, borderBottom: `1.5px solid ${C.BORDER}`, pb: 1,
        display: 'flex', alignItems: 'center', gap: 1,
      }}>
        🧮 Calculadora de Pedras por Nível
      </Typography>

      {/* Seletor de raridade */}
      <Box sx={{ display: 'flex', gap: 0.7, flexWrap: 'wrap', mb: 2 }}>
        {RARIDADES.map(r => (
          <Box
            key={r}
            onClick={() => setRaridade(r)}
            sx={{
              px: 1.4, py: 0.5,
              borderRadius: '20px',
              border: `1.5px solid ${raridade === r ? RARITY_COLORS[r] : C.BORDER_SOFT}`,
              bgcolor: raridade === r ? `${RARITY_COLORS[r]}22` : C.BG_INPUT,
              color: raridade === r ? RARITY_COLORS[r] : C.TEXT_MUTED,
              fontFamily: '"Nunito", sans-serif',
              fontWeight: 700,
              fontSize: '0.75rem',
              cursor: 'pointer',
              transition: 'all 0.15s',
              userSelect: 'none',
            }}
          >
            {r}
          </Box>
        ))}
      </Box>

      {/* Inputs de nível */}
      <Grid container spacing={1.5} sx={{ mb: 2 }}>
        <Grid item xs={6}>
          <TextField
            fullWidth label="Nível atual (De)" variant="outlined" size="small"
            type="number" value={nivelDe}
            onChange={e => setNivelDe(e.target.value)}
            inputProps={{ min: 1, max: 25 }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth label="Nível desejado (Até)" variant="outlined" size="small"
            type="number" value={nivelAte}
            onChange={e => setNivelAte(e.target.value)}
            inputProps={{ min: 1, max: 25 }}
          />
        </Grid>
      </Grid>

      <Button
        variant="contained" fullWidth onClick={calcular}
        sx={{ mb: 2, fontWeight: 900, py: 1, fontSize: '0.9rem' }}
      >
        ⚗️ Calcular Custo Total
      </Button>

      {resultado && (
        <Box sx={{ animation: 'reveal-up 0.3s ease both' }}>
          {/* Totais */}
          <Box sx={{
            display: 'flex', gap: 1.5, mb: 2, flexWrap: 'wrap',
          }}>
            {[
              { label: 'Fósseis',  value: resultado.totalF, cor: C.ATTACK,   icon: '🦴' },
              { label: 'Poções',   value: resultado.totalP, cor: C.DEFENSE,  icon: '🧪' },
              { label: 'Relíquias',value: resultado.totalR, cor: C.POWER,    icon: '💎' },
            ].map(item => (
              <Box key={item.label} sx={{
                flex: '1 1 80px', p: 1.2,
                bgcolor: C.BG_CARD, borderRadius: '8px',
                border: `1.5px solid ${item.cor}55`,
                borderBottom: `3px solid ${item.cor}`,
                textAlign: 'center',
                boxShadow: '0 2px 6px rgba(62,47,28,0.08)',
              }}>
                <Typography sx={{ fontSize: '1.2rem', lineHeight: 1 }}>{item.icon}</Typography>
                <Typography sx={{ color: item.cor, fontWeight: 900, fontSize: '1.3rem', lineHeight: 1.2 }}>
                  {item.value.toLocaleString('pt-BR')}
                </Typography>
                <Typography sx={{ color: C.TEXT_MUTED, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>
                  {item.label}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Resumo */}
          <Box sx={{
            p: 1.2, mb: 1.5, borderRadius: '6px',
            bgcolor: `${cor}15`, border: `1px solid ${cor}44`,
            textAlign: 'center',
          }}>
            <Typography sx={{ color: cor, fontWeight: 900, fontSize: '0.8rem' }}>
              {resultado.raridade} · Nível {resultado.de} → {resultado.ate} ({resultado.ate - resultado.de + 1} níveis)
            </Typography>
          </Box>

          {/* Tabela detalhada */}
          <Accordion sx={{ bgcolor: C.BG_SECONDARY, border: `1px solid ${C.BORDER_SOFT}`, boxShadow: 'none' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: C.TEXT_MUTED, fontSize: '1rem' }} />}>
              <Typography sx={{ color: C.TEXT_MUTED, fontWeight: 700, fontSize: '0.78rem', letterSpacing: '1px' }}>
                VER DETALHES POR NÍVEL
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              <Box sx={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: '"Nunito", sans-serif' }}>
                  <thead>
                    <tr style={{ background: C.BG_SECONDARY }}>
                      {['Nível', '🦴 Fósseis', '🧪 Poções', '💎 Relíquias'].map(h => (
                        <th key={h} style={{ padding: '6px 10px', fontSize: '0.72rem', fontWeight: 800, color: C.TEXT_MUTED, textAlign: 'center', borderBottom: `1px solid ${C.BORDER_SOFT}`, letterSpacing: '0.5px' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {resultado.detalhe.map((row, i) => (
                      <tr key={row.nivel} style={{ background: i % 2 === 0 ? C.BG_CARD : C.BG_SECONDARY }}>
                        <td style={{ padding: '5px 10px', textAlign: 'center', fontWeight: 800, fontSize: '0.82rem', color: cor }}>{row.nivel}</td>
                        <td style={{ padding: '5px 10px', textAlign: 'center', fontWeight: 700, fontSize: '0.82rem', color: C.TEXT_PRIMARY }}>{row.foss.toLocaleString('pt-BR')}</td>
                        <td style={{ padding: '5px 10px', textAlign: 'center', fontWeight: 700, fontSize: '0.82rem', color: C.TEXT_PRIMARY }}>{row.poc.toLocaleString('pt-BR')}</td>
                        <td style={{ padding: '5px 10px', textAlign: 'center', fontWeight: 700, fontSize: '0.82rem', color: C.TEXT_PRIMARY }}>{row.rel.toLocaleString('pt-BR')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
            </AccordionDetails>
          </Accordion>
        </Box>
      )}
    </Card>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// CARD DE ATRIBUTO
// ─────────────────────────────────────────────────────────────────────────────
const AtributoCard = ({ attr }) => (
  <Box sx={{
    p: 1.5,
    border: `1.5px solid ${attr.cor}44`,
    borderLeft: `4px solid ${attr.cor}`,
    borderRadius: '8px',
    bgcolor: C.BG_CARD,
    mb: 1,
    boxShadow: '0 1px 5px rgba(62,47,28,0.07)',
    transition: 'all 0.15s',
    '&:hover': { boxShadow: `0 2px 12px ${attr.cor}22`, borderColor: attr.cor },
  }}>
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
      <Box sx={{
        width: 34, height: 34, flexShrink: 0,
        bgcolor: `${attr.cor}18`, border: `1.5px solid ${attr.cor}44`,
        borderRadius: '8px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.1rem',
      }}>
        {attr.icon}
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 0.3, flexWrap: 'wrap' }}>
          <Typography sx={{ fontWeight: 900, fontSize: '0.88rem', color: attr.cor, lineHeight: 1 }}>
            {attr.nome}
          </Typography>
          <Chip
            label={attr.tipo === 'ofensivo' ? '⚔️ Ofensivo' : '🛡️ Defensivo'}
            size="small"
            sx={{
              height: 18, fontSize: '0.62rem', fontWeight: 800,
              bgcolor: attr.tipo === 'ofensivo' ? '#A83C2C22' : '#5C7FA322',
              color: attr.tipo === 'ofensivo' ? '#A83C2C' : '#5C7FA3',
              border: `1px solid ${attr.tipo === 'ofensivo' ? '#A83C2C44' : '#5C7FA344'}`,
            }}
          />
          {attr.critico && (
            <Chip label={`Crítico: ${attr.critico}`} size="small"
              sx={{ height: 18, fontSize: '0.62rem', fontWeight: 800, bgcolor: '#8B6BAE22', color: '#8B6BAE', border: '1px solid #8B6BAE44' }}
            />
          )}
          {attr.bloqueio && (
            <Chip label={`Bloqueia: ${attr.bloqueio}`} size="small"
              sx={{ height: 18, fontSize: '0.62rem', fontWeight: 800, bgcolor: '#5C7FA322', color: '#5C7FA3', border: '1px solid #5C7FA344' }}
            />
          )}
        </Box>
        <Typography sx={{ color: C.TEXT_SECONDARY, fontSize: '0.80rem', fontWeight: 600, lineHeight: 1.5 }}>
          {attr.desc}
        </Typography>
        {attr.contra && (
          <Box sx={{ mt: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography sx={{ color: C.TEXT_MUTED, fontSize: '0.72rem', fontWeight: 700 }}>Combatido por:</Typography>
            <Typography sx={{ color: C.ACCENT_DEEP, fontSize: '0.72rem', fontWeight: 900 }}>{attr.contra}</Typography>
          </Box>
        )}
      </Box>
    </Box>
  </Box>
);

// ─────────────────────────────────────────────────────────────────────────────
// COMO FUNCIONA — cards
// ─────────────────────────────────────────────────────────────────────────────
const REGRAS = [
  { icon: '⚗️', title: 'Custo de Aperfeiçoamento', text: 'Aperfeiçoe suas tropas para aumentar ou diminuir seus atributos ao custo de Fósseis, Poções e Relíquias.' },
  { icon: '💾', title: 'Salve Sempre', text: 'Atributos aperfeiçoados devem ser salvos para surtir efeito. Nunca feche sem salvar!' },
  { icon: '⬆️', title: 'Subir de Nível', text: 'Assim que o máximo dos atributos do nível atual for alcançado, você poderá subir o nível de suas tropas usando itens específicos.' },
  { icon: '⭐', title: 'Promoção de Raridade', text: 'Você pode promover suas tropas ao próximo nível de raridade após cada 5 níveis.' },
  { icon: '💡', title: 'Poder de Aperfeiçoamento', text: 'Aperfeiçoamentos garantem poder extra (mostrado como Poder de Aperfeiçoamento). Isso não aumenta o poder das tropas diretamente.' },
];

// ─────────────────────────────────────────────────────────────────────────────
// PÁGINA PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────
const AprimoramentoTropas = () => {
  return (
    <Box sx={{ textAlign: 'left', mt: 1, animation: 'reveal-up 0.4s ease both' }}>

      <ParchmentHeader
        title="Aprimoramento de Tropas"
        sub="Fortaleça suas unidades com Fósseis, Poções e Relíquias"
      />

      {/* ── CALCULADORA ─────────────────────────────────────────── */}
      <SectionDivider label="CALCULADORA" />
      <Calculadora />

      {/* ── COMO FUNCIONA ───────────────────────────────────────── */}
      <SectionDivider label="COMO FUNCIONA" />
      <Grid container spacing={1.2} sx={{ mb: 3 }}>
        {REGRAS.map((r, i) => (
          <Grid item xs={12} sm={6} key={i}>
            <Card sx={{
              p: 1.5, height: '100%',
              borderLeft: `4px solid ${C.ACCENT}`,
              bgcolor: C.BG_SECONDARY,
              display: 'flex', gap: 1.2, alignItems: 'flex-start',
            }}>
              <Box sx={{ fontSize: '1.3rem', flexShrink: 0, mt: 0.2 }}>{r.icon}</Box>
              <Box>
                <Typography sx={{ fontWeight: 900, fontSize: '0.85rem', color: C.TEXT_PRIMARY, mb: 0.3 }}>{r.title}</Typography>
                <Typography sx={{ fontSize: '0.80rem', color: C.TEXT_SECONDARY, fontWeight: 600, lineHeight: 1.5 }}>{r.text}</Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ── ATRIBUTOS ───────────────────────────────────────────── */}
      <SectionDivider label="ATRIBUTOS" />
      <Box sx={{ mb: 3 }}>
        {ATRIBUTOS.map(attr => (
          <AtributoCard key={attr.nome} attr={attr} />
        ))}
      </Box>

      {/* ── CATEGORIAS DE TROPAS ────────────────────────────────── */}
      <SectionDivider label="CATEGORIAS DE TROPAS" />
      <Grid container spacing={1.2} sx={{ mb: 3 }}>
        {CATEGORIAS.map(cat => (
          <Grid item xs={12} md={6} key={cat.cat}>
            <Card sx={{
              p: 1.5,
              border: `1px solid ${C.BORDER_SOFT}`,
              bgcolor: C.BG_SECONDARY,
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Box sx={{
                  px: 1, py: 0.3,
                  bgcolor: C.ACCENT, borderRadius: '5px',
                  color: '#FFF8EE', fontWeight: 900, fontSize: '0.75rem',
                  flexShrink: 0,
                }}>
                  CAT {cat.cat}
                </Box>
              </Box>
              <Typography sx={{ color: C.TEXT_SECONDARY, fontSize: '0.80rem', fontWeight: 600, lineHeight: 1.5 }}>
                {cat.tropas}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ── NOTA IMPORTANTE ─────────────────────────────────────── */}
      <Card sx={{
        p: 2, bgcolor: '#FAF3E0',
        border: `1.5px dashed ${C.WARNING}`,
        borderRadius: '8px',
      }}>
        <Box sx={{ display: 'flex', gap: 1.2, alignItems: 'flex-start' }}>
          <Typography sx={{ fontSize: '1.4rem', flexShrink: 0 }}>⚠️</Typography>
          <Box>
            <Typography sx={{ fontWeight: 900, fontSize: '0.88rem', color: C.WARNING, mb: 0.5 }}>
              ATENÇÃO — Salve no Arsenal!
            </Typography>
            <Typography sx={{ fontSize: '0.80rem', color: C.TEXT_SECONDARY, fontWeight: 600, lineHeight: 1.6 }}>
              O poder do aperfeiçoamento aumenta o seu poder total, mas pode causar variações no ranking global.
              Sempre salve suas tropas no Arsenal antes de fechar para garantir que as alterações surtam efeito.
            </Typography>
          </Box>
        </Box>
      </Card>

    </Box>
  );
};

export default AprimoramentoTropas;
