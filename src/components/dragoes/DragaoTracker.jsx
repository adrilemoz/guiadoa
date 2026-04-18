import React, { useState, useEffect, useCallback } from 'react';
import { Box, Snackbar, Alert } from '@mui/material';
import { getDragaoById } from '../../data/dragoes.js';
import { C } from '../../theme.js';

// ─────────────────────────────────────────────────────────
// STORAGE HELPERS
// ─────────────────────────────────────────────────────────
const STORAGE_KEY = (id) => `tracker_dragao_${id}`;

const carregarDados = (dragao) => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY(dragao.id));
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }

  // Estado inicial: valores dos nivelAtual do banco
  const habilidades = {};
  dragao.habilidades?.forEach((hab) => {
    if (!hab.nivelAtual) return;
    const xpParts = (hab.nivelAtual.xp || '0/0').split('/');
    habilidades[hab.id] = {
      nivel:    hab.nivelAtual.nivel ?? 1,
      xpAtual:  parseInt(xpParts[0]) || 0,
      xpTotal:  parseInt(xpParts[1]) || 0,
    };
  });

  const xpDragParts = (dragao.nivelDragao?.xpConhecida?.[0]
    ? `0/${dragao.nivelDragao.xpConhecida[0].xpNecessaria}`
    : '0/0').split('/');

  return {
    nivelDragao: dragao.nivelDragao?.nivelVisto ?? 1,
    xpDragaoAtual: 0,
    xpDragaoTotal: parseInt(xpDragParts[1]) || 0,
    habilidades,
  };
};

// ─────────────────────────────────────────────────────────
// XP TOTAL PARA UM NÍVEL (busca na tabela ou retorna null)
// ─────────────────────────────────────────────────────────
const getXpParaNivel = (hab, nivel) => {
  if (!hab.xpConhecida) return null;
  const entrada = hab.xpConhecida.find((e) => e.nivel === nivel);
  return entrada ? entrada.xpNecessaria : null;
};

// ─────────────────────────────────────────────────────────
// BARRA DE PROGRESSO
// ─────────────────────────────────────────────────────────
const XPBar = ({ atual, total, cor }) => {
  const pct = total > 0 ? Math.min(100, Math.round((atual / total) * 100)) : 0;
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.3 }}>
        <Box sx={{ fontFamily: '"Nunito", sans-serif', fontWeight: 700, fontSize: '0.68rem', color: C.TEXT_MUTED }}>
          {atual.toLocaleString('pt-BR')} / {total > 0 ? total.toLocaleString('pt-BR') : '?'} XP
        </Box>
        <Box sx={{ fontFamily: '"Nunito", sans-serif', fontWeight: 900, fontSize: '0.68rem', color: cor }}>
          {total > 0 ? `${pct}%` : '?%'}
        </Box>
      </Box>
      <Box sx={{ height: '6px', borderRadius: '3px', bgcolor: `${cor}20`, overflow: 'hidden', border: `1px solid ${cor}30` }}>
        <Box sx={{
          height: '100%', width: `${pct}%`,
          background: `linear-gradient(90deg, ${cor}99, ${cor})`,
          borderRadius: '3px',
          transition: 'width 0.4s ease',
          boxShadow: `0 0 6px ${cor}66`,
        }} />
      </Box>
    </Box>
  );
};

// ─────────────────────────────────────────────────────────
// CONTROLE DE NÍVEL (+/−)
// ─────────────────────────────────────────────────────────
const NivelControl = ({ value, onChange, cor, min = 1, max = 999 }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
    <Box
      onClick={() => onChange(Math.max(min, value - 1))}
      sx={{
        width: 28, height: 28, borderRadius: '6px',
        border: `1.5px solid ${C.BORDER}`, bgcolor: C.BG_SECONDARY,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', fontWeight: 900, fontSize: '1rem', color: C.TEXT_SECONDARY,
        userSelect: 'none',
        '&:active': { bgcolor: `${cor}22` },
      }}
    >−</Box>
    <Box sx={{
      minWidth: 42, textAlign: 'center',
      fontFamily: '"Nunito", sans-serif', fontWeight: 900,
      fontSize: '1.05rem', color: cor,
      px: 0.5, py: 0.2,
      borderRadius: '6px',
      bgcolor: `${cor}15`, border: `1.5px solid ${cor}44`,
    }}>
      {value}
    </Box>
    <Box
      onClick={() => onChange(Math.min(max, value + 1))}
      sx={{
        width: 28, height: 28, borderRadius: '6px',
        border: `1.5px solid ${C.BORDER}`, bgcolor: C.BG_SECONDARY,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', fontWeight: 900, fontSize: '1rem', color: C.TEXT_SECONDARY,
        userSelect: 'none',
        '&:active': { bgcolor: `${cor}22` },
      }}
    >+</Box>
  </Box>
);

// ─────────────────────────────────────────────────────────
// INPUT NUMÉRICO COMPACTO
// ─────────────────────────────────────────────────────────
const NumInput = ({ value, onChange, placeholder = '0', label }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.2, flex: 1 }}>
    {label && (
      <Box sx={{ fontFamily: '"Nunito", sans-serif', fontWeight: 700, fontSize: '0.62rem', color: C.TEXT_MUTED, letterSpacing: '0.5px' }}>
        {label}
      </Box>
    )}
    <Box
      component="input"
      type="number"
      value={value || ''}
      placeholder={placeholder}
      onChange={(e) => onChange(parseInt(e.target.value) || 0)}
      sx={{
        fontFamily: '"Nunito", sans-serif', fontWeight: 700, fontSize: '0.85rem',
        color: C.TEXT_PRIMARY, bgcolor: C.BG_INPUT,
        border: `1.5px solid ${C.BORDER}`, borderRadius: '6px',
        px: 1, py: 0.5, width: '100%', outline: 'none',
        '&:focus': { borderColor: C.ACCENT },
        '&::-webkit-inner-spin-button': { WebkitAppearance: 'none' },
      }}
    />
  </Box>
);

// ─────────────────────────────────────────────────────────
// CARD DE HABILIDADE NO TRACKER
// ─────────────────────────────────────────────────────────
const HabilidadeTrackerCard = ({ hab, dados, onChange, cor }) => {
  const xpTotal = getXpParaNivel(hab, dados.nivel) ?? dados.xpTotal;
  const isCampo = hab.tipo?.toLowerCase().includes('campo');

  const handleNivel = (novoNivel) => {
    const novaXpTotal = getXpParaNivel(hab, novoNivel) ?? dados.xpTotal;
    onChange({ ...dados, nivel: novoNivel, xpTotal: novaXpTotal, xpAtual: 0 });
  };

  const handleXpAtual = (v) => {
    const capped = xpTotal > 0 ? Math.min(v, xpTotal) : v;
    onChange({ ...dados, xpAtual: capped, xpTotal });
  };

  const handleXpTotal = (v) => {
    onChange({ ...dados, xpTotal: v });
  };

  return (
    <Box sx={{
      borderRadius: '10px', border: `1.5px solid ${C.BORDER_SOFT}`,
      overflow: 'hidden', mb: 1.2,
      animation: 'reveal-up 0.3s ease both',
    }}>
      {/* CABEÇALHO */}
      <Box sx={{
        display: 'flex', alignItems: 'center', gap: 1.2,
        px: 1.4, py: 1,
        background: `linear-gradient(135deg, rgba(62,47,28,0.9) 0%, ${cor}44 100%)`,
      }}>
        <Box sx={{
          width: 36, height: 36, flexShrink: 0, borderRadius: '8px',
          background: `${cor}33`, border: `1.5px solid ${cor}77`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem',
        }}>{hab.emoji}</Box>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ fontFamily: '"Nunito", sans-serif', fontWeight: 900, fontSize: '0.88rem', color: '#FFF8EE', lineHeight: 1.1 }}>
            {hab.nome}
          </Box>
          <Box sx={{ fontFamily: '"Nunito", sans-serif', fontWeight: 600, fontSize: '0.62rem', color: 'rgba(255,248,238,0.5)', mt: 0.2 }}>
            {isCampo ? '🏅 Efeito em Campo' : '⚔️ Efeito de Batalha'}
          </Box>
        </Box>
        {/* Dados disponíveis / pendentes */}
        <Box sx={{
          fontSize: '0.6rem', fontWeight: 700, fontFamily: '"Nunito", sans-serif',
          px: 0.7, py: 0.2, borderRadius: '4px',
          bgcolor: xpTotal > 0 ? 'rgba(46,125,50,0.4)' : 'rgba(120,80,20,0.4)',
          color: xpTotal > 0 ? '#A5D6A7' : '#FFD580',
          letterSpacing: '0.4px',
        }}>
          {xpTotal > 0 ? '✓ XP conhecido' : '? XP pendente'}
        </Box>
      </Box>

      {/* CORPO */}
      <Box sx={{ px: 1.4, py: 1.2, bgcolor: C.BG_CARD }}>
        {/* Linha: nível + XP */}
        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1.5, mb: 1.2 }}>
          <Box>
            <Box sx={{ fontFamily: '"Nunito", sans-serif', fontWeight: 700, fontSize: '0.62rem', color: C.TEXT_MUTED, letterSpacing: '0.5px', mb: 0.3 }}>
              NÍVEL
            </Box>
            <NivelControl value={dados.nivel} onChange={handleNivel} cor={cor} />
          </Box>
          <NumInput value={dados.xpAtual} onChange={handleXpAtual} label="XP ATUAL" placeholder="0" />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.2, flex: 1 }}>
            <Box sx={{ fontFamily: '"Nunito", sans-serif', fontWeight: 700, fontSize: '0.62rem', color: C.TEXT_MUTED, letterSpacing: '0.5px' }}>
              XP TOTAL {xpTotal > 0 ? '' : '(manual)'}
            </Box>
            <Box
              component="input"
              type="number"
              value={xpTotal || ''}
              placeholder="?"
              onChange={(e) => handleXpTotal(parseInt(e.target.value) || 0)}
              disabled={xpTotal > 0 && getXpParaNivel(hab, dados.nivel) != null}
              sx={{
                fontFamily: '"Nunito", sans-serif', fontWeight: 700, fontSize: '0.85rem',
                color: xpTotal > 0 ? C.TEXT_PRIMARY : C.TEXT_FAINT,
                bgcolor: xpTotal > 0 && getXpParaNivel(hab, dados.nivel) != null
                  ? `${C.BG_SECONDARY}` : C.BG_INPUT,
                border: `1.5px solid ${C.BORDER}`, borderRadius: '6px',
                px: 1, py: 0.5, width: '100%', outline: 'none',
                '&:focus': { borderColor: C.ACCENT },
                '&::-webkit-inner-spin-button': { WebkitAppearance: 'none' },
              }}
            />
          </Box>
        </Box>

        {/* Barra XP */}
        <XPBar atual={dados.xpAtual} total={xpTotal} cor={cor} />

        {/* Efeito atual (nível conhecido) vs máx */}
        {hab.nivelAtual && (
          <Box sx={{
            mt: 1.2, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0.8,
          }}>
            <Box sx={{
              p: 1, borderRadius: '6px',
              border: `1px solid ${C.BORDER_SOFT}`, bgcolor: C.BG_SECONDARY,
            }}>
              <Box sx={{ fontFamily: '"Nunito", sans-serif', fontWeight: 900, fontSize: '0.65rem', color: C.TEXT_MUTED, letterSpacing: '1px', mb: 0.4 }}>
                EFEITO ATUAL
              </Box>
              <Box sx={{ fontFamily: '"Nunito", sans-serif', fontWeight: 600, fontSize: '0.70rem', color: C.TEXT_SECONDARY, lineHeight: 1.5, whiteSpace: 'pre-line',
                display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
              }}>
                {hab.nivelAtual.descricao}
              </Box>
            </Box>
            <Box sx={{
              p: 1, borderRadius: '6px',
              border: `1px solid ${cor}33`,
              background: `linear-gradient(135deg, ${cor}08 0%, ${cor}14 100%)`,
            }}>
              <Box sx={{ fontFamily: '"Nunito", sans-serif', fontWeight: 900, fontSize: '0.65rem', color: cor, letterSpacing: '1px', mb: 0.4 }}>
                NÍVEL MÁX.
              </Box>
              <Box sx={{ fontFamily: '"Nunito", sans-serif', fontWeight: 600, fontSize: '0.70rem', color: C.TEXT_SECONDARY, lineHeight: 1.5, whiteSpace: 'pre-line',
                display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
              }}>
                {hab.nivelMax?.descricao ?? '—'}
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

// ─────────────────────────────────────────────────────────
// DIVISOR
// ─────────────────────────────────────────────────────────
const ParchmentDivider = ({ label }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, my: 1.2 }}>
    <Box sx={{ flex: 1, height: '1px', background: `linear-gradient(90deg, transparent, ${C.BORDER})` }} />
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
      <Box component="span" sx={{ color: C.ACCENT, fontSize: '0.72rem' }}>◆</Box>
      <Box sx={{ fontFamily: '"Nunito", sans-serif', fontWeight: 700, fontSize: '0.72rem', letterSpacing: '2px', color: C.TEXT_MUTED, whiteSpace: 'nowrap' }}>
        {label}
      </Box>
      <Box component="span" sx={{ color: C.ACCENT, fontSize: '0.72rem' }}>◆</Box>
    </Box>
    <Box sx={{ flex: 1, height: '1px', background: `linear-gradient(270deg, transparent, ${C.BORDER})` }} />
  </Box>
);

// ─────────────────────────────────────────────────────────
// TELA PRINCIPAL — TRACKER
// ─────────────────────────────────────────────────────────
const DragaoTracker = ({ dragaoId }) => {
  const dragao = getDragaoById(dragaoId);
  const [dados, setDados] = useState(() => dragao ? carregarDados(dragao) : null);
  const [savedAt, setSavedAt] = useState(null);
  const [toast, setToast] = useState(false);

  // Auto-save sempre que dados mudar
  useEffect(() => {
    if (!dragao || !dados) return;
    try {
      localStorage.setItem(STORAGE_KEY(dragao.id), JSON.stringify(dados));
      setSavedAt(new Date());
    } catch { /* ignore */ }
  }, [dados, dragao]);

  const handleHabilidade = useCallback((habId, novoDados) => {
    setDados((prev) => ({
      ...prev,
      habilidades: { ...prev.habilidades, [habId]: novoDados },
    }));
  }, []);

  const handleReset = () => {
    if (!dragao) return;
    const inicial = carregarDados({ ...dragao, _forceDefault: true });
    // força default ignorando localStorage
    const habilidades = {};
    dragao.habilidades?.forEach((hab) => {
      if (!hab.nivelAtual) return;
      const xpParts = (hab.nivelAtual.xp || '0/0').split('/');
      habilidades[hab.id] = {
        nivel:   hab.nivelAtual.nivel ?? 1,
        xpAtual: parseInt(xpParts[0]) || 0,
        xpTotal: parseInt(xpParts[1]) || 0,
      };
    });
    const novosDados = { nivelDragao: dragao.nivelDragao?.nivelVisto ?? 1, xpDragaoAtual: 0, xpDragaoTotal: 0, habilidades };
    setDados(novosDados);
    setToast(true);
  };

  if (!dragao || !dados) return (
    <Box sx={{ textAlign: 'center', mt: 6, color: C.TEXT_SECONDARY }}>
      <Box sx={{ fontSize: '3rem', mb: 1 }}>🐉</Box>
      <Box sx={{ fontFamily: '"Nunito", sans-serif', fontWeight: 700 }}>Dragão não encontrado.</Box>
    </Box>
  );

  const habsComTracker = (dragao.habilidades || []).filter((h) => h.nivelAtual);
  const totalHabs = habsComTracker.length;
  const mediaProgresso = totalHabs > 0
    ? Math.round(habsComTracker.reduce((acc, hab) => {
        const d = dados.habilidades[hab.id];
        if (!d) return acc;
        const total = getXpParaNivel(hab, d.nivel) ?? d.xpTotal;
        return acc + (total > 0 ? Math.min(100, (d.xpAtual / total) * 100) : 0);
      }, 0) / totalHabs)
    : 0;

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', pb: 5, animation: 'fade-in 0.3s ease both' }}>

      {/* Toast reset */}
      <Snackbar open={toast} autoHideDuration={2500} onClose={() => setToast(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="info" variant="filled" sx={{ fontWeight: 700, fontFamily: '"Nunito", sans-serif' }}>
          Progresso resetado para os valores iniciais.
        </Alert>
      </Snackbar>

      {/* ── HEADER ── */}
      <Box sx={{
        borderRadius: '14px',
        background: `linear-gradient(140deg, rgba(62,47,28,0.97) 0%, ${dragao.corSecundaria}CC 50%, ${dragao.cor}99 100%)`,
        border: `2px solid ${dragao.cor}88`,
        boxShadow: `0 8px 32px ${dragao.cor}33`,
        p: 2, mb: 2, position: 'relative', overflow: 'hidden',
        '&::after': {
          content: '"📊"', position: 'absolute',
          fontSize: '6rem', opacity: 0.07, right: '-0.5rem', bottom: '-1.5rem',
          lineHeight: 1, pointerEvents: 'none',
        },
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, position: 'relative', zIndex: 1 }}>
          <Box sx={{
            width: 52, height: 52, flexShrink: 0, borderRadius: '12px',
            background: `${dragao.cor}44`, border: `2px solid ${dragao.cor}88`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem',
          }}>{dragao.emojiDragao}</Box>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ fontFamily: '"Nunito", sans-serif', fontWeight: 700, fontSize: '0.68rem', color: 'rgba(255,248,238,0.55)', letterSpacing: '1.5px', mb: 0.2 }}>
              MEU PROGRESSO
            </Box>
            <Box sx={{ fontFamily: '"Nunito", sans-serif', fontWeight: 900, fontSize: '1.2rem', color: '#FFF8EE', lineHeight: 1.1 }}>
              {dragao.nome}
            </Box>
            {savedAt && (
              <Box sx={{ fontFamily: '"Nunito", sans-serif', fontWeight: 600, fontSize: '0.60rem', color: 'rgba(255,248,238,0.4)', mt: 0.3 }}>
                💾 Salvo às {savedAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </Box>
            )}
          </Box>
          {/* Progresso geral */}
          <Box sx={{ textAlign: 'center', flexShrink: 0 }}>
            <Box sx={{ fontFamily: '"Nunito", sans-serif', fontWeight: 900, fontSize: '1.5rem', color: dragao.cor, lineHeight: 1 }}>
              {mediaProgresso}%
            </Box>
            <Box sx={{ fontFamily: '"Nunito", sans-serif', fontWeight: 700, fontSize: '0.6rem', color: 'rgba(255,248,238,0.45)', letterSpacing: '0.5px' }}>
              média hab.
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ── NÍVEL DO DRAGÃO ── */}
      <ParchmentDivider label="NÍVEL DO DRAGÃO" />
      <Box sx={{
        p: 1.5, mb: 2, borderRadius: '10px',
        border: `1.5px solid ${C.BORDER_SOFT}`,
        bgcolor: C.BG_CARD, boxShadow: '0 2px 8px rgba(62,47,28,0.1)',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1.5, mb: 1.2 }}>
          <Box>
            <Box sx={{ fontFamily: '"Nunito", sans-serif', fontWeight: 700, fontSize: '0.62rem', color: C.TEXT_MUTED, letterSpacing: '0.5px', mb: 0.3 }}>
              NÍVEL
            </Box>
            <NivelControl
              value={dados.nivelDragao}
              onChange={(v) => setDados((p) => ({ ...p, nivelDragao: v }))}
              cor={dragao.cor}
            />
          </Box>
          <NumInput
            value={dados.xpDragaoAtual}
            onChange={(v) => setDados((p) => ({ ...p, xpDragaoAtual: v }))}
            label="XP ATUAL"
          />
          <Box sx={{ flex: 1 }}>
            <Box sx={{ fontFamily: '"Nunito", sans-serif', fontWeight: 700, fontSize: '0.62rem', color: C.TEXT_MUTED, letterSpacing: '0.5px', mb: 0.3 }}>
              XP TOTAL
            </Box>
            <Box
              component="input"
              type="number"
              value={dados.xpDragaoTotal || ''}
              placeholder="?"
              onChange={(e) => setDados((p) => ({ ...p, xpDragaoTotal: parseInt(e.target.value) || 0 }))}
              sx={{
                fontFamily: '"Nunito", sans-serif', fontWeight: 700, fontSize: '0.85rem',
                color: C.TEXT_PRIMARY, bgcolor: C.BG_INPUT,
                border: `1.5px solid ${C.BORDER}`, borderRadius: '6px',
                px: 1, py: 0.5, width: '100%', outline: 'none',
                '&:focus': { borderColor: C.ACCENT },
                '&::-webkit-inner-spin-button': { WebkitAppearance: 'none' },
              }}
            />
          </Box>
        </Box>
        <XPBar atual={dados.xpDragaoAtual} total={dados.xpDragaoTotal} cor={dragao.cor} />
      </Box>

      {/* ── HABILIDADES ── */}
      <ParchmentDivider label="HABILIDADES" />
      {habsComTracker.map((hab) => (
        <HabilidadeTrackerCard
          key={hab.id}
          hab={hab}
          dados={dados.habilidades[hab.id] || { nivel: 1, xpAtual: 0, xpTotal: 0 }}
          onChange={(novo) => handleHabilidade(hab.id, novo)}
          cor={dragao.cor}
        />
      ))}

      {/* ── AVISO XP MANUAL ── */}
      <Box sx={{
        mt: 1, mb: 2, p: 1.4, borderRadius: '8px',
        border: `1px dashed ${C.BORDER_SOFT}`,
        bgcolor: 'rgba(184,150,90,0.06)',
      }}>
        <Box sx={{ fontFamily: '"Nunito", sans-serif', fontWeight: 700, fontSize: '0.72rem', color: C.TEXT_MUTED, lineHeight: 1.6 }}>
          💡 <strong>XP Total Manual:</strong> Para níveis sem dados confirmados, insira o valor manualmente. Quando um print for adicionado ao banco, o campo será preenchido automaticamente.
        </Box>
      </Box>

      {/* ── RODAPÉ ── */}
      <Box sx={{ display: 'flex', gap: 1.2, alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{
          display: 'flex', alignItems: 'center', gap: 0.6,
          px: 1.2, py: 0.6, borderRadius: '6px',
          bgcolor: 'rgba(90,140,92,0.15)', border: `1px solid rgba(90,140,92,0.3)`,
        }}>
          <Box sx={{ fontSize: '0.7rem' }}>💾</Box>
          <Box sx={{ fontFamily: '"Nunito", sans-serif', fontWeight: 700, fontSize: '0.72rem', color: C.ENERGY }}>
            Salvo automaticamente
          </Box>
        </Box>

        <Box
          onClick={handleReset}
          sx={{
            display: 'flex', alignItems: 'center', gap: 0.6,
            px: 1.4, py: 0.7, borderRadius: '6px', cursor: 'pointer',
            border: `1.5px solid ${C.BORDER}`, bgcolor: C.BG_SECONDARY,
            transition: 'all 0.2s',
            '&:hover': { borderColor: C.ERROR, color: C.ERROR },
            '&:active': { transform: 'scale(0.97)' },
          }}
        >
          <Box sx={{ fontSize: '0.75rem' }}>🔄</Box>
          <Box sx={{ fontFamily: '"Nunito", sans-serif', fontWeight: 700, fontSize: '0.75rem', color: C.TEXT_SECONDARY }}>
            Resetar
          </Box>
        </Box>
      </Box>

    </Box>
  );
};

export default DragaoTracker;
