import React, { forwardRef, useMemo, useState } from 'react';
import {
  Box, Button, Card, Dialog, DialogActions, DialogContent,
  DialogTitle, IconButton, LinearProgress, Slide, TextField, Typography,
} from '@mui/material';
import DeleteIcon  from '@mui/icons-material/Delete';
import CloseIcon   from '@mui/icons-material/Close';
import AddIcon     from '@mui/icons-material/Add';

import { C } from '../theme.js';
import { dbTropas } from '../db.js';
import { getIcone, getTipoAtaque, fmt, fmtFull, getAtributosResumo } from './tropas/tropaUtils.js';
import GameHeader from './shared/GameHeader.jsx';

const TransitionUp   = forwardRef((props, ref) => <Slide direction="up"   ref={ref} {...props} />);
const TransitionDown = forwardRef((props, ref) => <Slide direction="down" ref={ref} {...props} />);

// ─── Mini barra de stat (reutilizada da lista de seleção) ─────────────────
const MiniBar = ({ value, max, color }) => {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <Box sx={{ flex: 1, height: '3px', bgcolor: 'rgba(255,255,255,0.04)', borderRadius: '2px', overflow: 'hidden' }}>
      <Box sx={{
        height: '100%', width: `${pct}%`,
        background: value ? `linear-gradient(90deg, ${color}55, ${color})` : 'transparent',
        borderRadius: '2px',
      }} />
    </Box>
  );
};

// ─── Linha de seleção de tropa (mesmo visual do TropaCard, sem expandir) ─
const SelectRow = ({ tropa, onClick }) => {
  const tipo   = getTipoAtaque(tropa);
  const resumo = getAtributosResumo(tropa);

  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex', alignItems: 'center', gap: 1.2,
        px: 1.5, py: 1.1, cursor: 'pointer',
        border: `1px solid ${C.BORDER_SOFT}`,
        borderLeft: `3px solid ${C.BORDER}`,
        borderRadius: '6px',
        bgcolor: C.BG_CARD,
        transition: 'all 0.15s',
        '&:hover': {
          borderLeftColor: C.ACCENT_HOVER,
          bgcolor: C.BG_CARD_TOP,
        },
        '&:active': { opacity: 0.8 },
      }}
    >
      {/* Ícone */}
      <Typography sx={{ fontSize: '1.6rem', lineHeight: 1, flexShrink: 0, width: 30, textAlign: 'center' }}>
        {getIcone(tropa.nome)}
      </Typography>

      {/* Nome + resumo */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.7, mb: 0.3, flexWrap: 'wrap' }}>
          <Typography sx={{ color: C.ACCENT, fontSize: '0.80rem', fontWeight: 900, fontFamily: '"Nunito", sans-serif', lineHeight: 1 }}>
            {tropa.nome}
          </Typography>
          <Box sx={{ px: 0.7, py: 0.15, border: `1px solid ${tipo.color}55`, borderRadius: '8px', bgcolor: `${tipo.color}10`, flexShrink: 0 }}>
            <Typography sx={{ color: tipo.color, fontSize: '0.75rem', fontFamily: '"Nunito", sans-serif', fontWeight: 700 }}>
              {tipo.label}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 0.4 }}>
          {resumo.map((s, i) => (
            <Typography key={i} sx={{ fontSize: '0.75rem', fontFamily: '"Nunito", sans-serif', color: C.TEXT_SECONDARY, whiteSpace: 'nowrap' }}>
              {s.icon} {s.val}
            </Typography>
          ))}
        </Box>

        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
          <MiniBar value={tropa.vida}  max={32000} color="#e05030" />
          <MiniBar value={tropa.def}   max={5000}  color="#1e6b8a" />
          <MiniBar value={Math.max(tropa.atqPerto, tropa.atqDist)} max={6000} color={tropa.atqDist > tropa.atqPerto ? '#B8965A' : '#b91c1c'} />
          <MiniBar value={tropa.vel}   max={3000}  color="#0369a1" />
        </Box>
      </Box>

      {/* Poder */}
      <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
        <Typography sx={{ color: '#9d4edd', fontSize: '0.75rem', fontWeight: 900, fontFamily: '"Nunito", sans-serif', lineHeight: 1 }}>
          {tropa.poder}
        </Typography>
        <Typography sx={{ color: C.TEXT_SECONDARY, fontSize: '0.75rem', letterSpacing: '1px' }}>POD</Typography>
      </Box>
    </Box>
  );
};

// ─── Slot de seleção (comparar) ───────────────────────────────────────────
const SlotComparar = ({ tropa, label, side, onSelect }) => (
  <Box
    onClick={() => onSelect(side)}
    sx={{
      flex: 1, p: 1.5, textAlign: 'center', cursor: 'pointer', borderRadius: '6px',
      border: tropa ? `2px solid ${C.ACCENT_HOVER}` : `2px dashed ${C.BORDER}`,
      bgcolor: tropa ? `rgba(200,148,10,0.06)` : 'transparent',
      transition: 'all 0.2s',
      '&:active': { transform: 'scale(0.97)' },
    }}
  >
    <Typography sx={{ fontSize: '0.75rem', fontWeight: 900, color: C.TEXT_SECONDARY, mb: 0.8, fontFamily: '"Nunito", sans-serif', letterSpacing: '1px' }}>
      {label}
    </Typography>
    <Box sx={{ fontSize: '2rem', mb: 0.6 }}>{tropa ? getIcone(tropa.nome) : '＋'}</Box>
    <Typography sx={{ fontSize: '0.6rem', fontWeight: 900, color: tropa ? C.ACCENT : C.BORDER, fontFamily: '"Nunito", sans-serif', lineHeight: 1.2 }}>
      {tropa ? tropa.nome : 'Escolher'}
    </Typography>
    {tropa && (
      <Typography sx={{ fontSize: '0.75rem', color: '#9d4edd', mt: 0.4, fontFamily: '"Nunito", sans-serif' }}>
        ⭐ {tropa.poder}
      </Typography>
    )}
  </Box>
);

// ─── Atributos do comparador ──────────────────────────────────────────────
const ATTRS_COMPARAR = [
  { id: 'vida',     label: 'Vida',       icon: '❤️', color: '#e05030', max: 32000 },
  { id: 'def',      label: 'Defesa',     icon: '🛡️', color: '#1e6b8a', max: 5000  },
  { id: 'atqPerto', label: 'Atq. Perto', icon: '⚔️', color: '#b91c1c', max: 6000  },
  { id: 'atqDist',  label: 'Atq. Dist.', icon: '🏹', color: '#B8965A', max: 6000  },
  { id: 'vel',      label: 'Vel.',       icon: '⚡', color: '#0369a1', max: 3000  },
  { id: 'alcance',  label: 'Alcance',    icon: '🎯', color: '#0f766e', max: 3500  },
  { id: 'poder',    label: 'Poder',      icon: '⭐', color: '#7c3aed', max: 50    },
];

// ─────────────────────────────────────────────────────────────────────────
const CalculosTropas = ({ setRoute }) => {
  const [aba,              setAba]              = useState('marcha');
  const [tropaA,           setTropaA]           = useState(null);
  const [tropaB,           setTropaB]           = useState(null);
  const [esquadroes,       setEsquadroes]       = useState([]);
  const [selecionandoPara, setSelecionandoPara] = useState(null);
  const [busca,            setBusca]            = useState('');
  const [confirmDialog,    setConfirmDialog]    = useState({ open: false, title: '', text: '', acao: null });

  const tropasFiltradas = useMemo(() =>
    [...dbTropas]
      .filter(t => t.nome.toLowerCase().includes(busca.toLowerCase()))
      .sort((a, b) => a.nome.localeCompare(b.nome)),
    [busca]
  );

  const handleSelect = (tropa) => {
    if      (selecionandoPara === 'A')      setTropaA(tropa);
    else if (selecionandoPara === 'B')      setTropaB(tropa);
    else if (selecionandoPara === 'MARCHA') setEsquadroes(prev => [...prev, { tropa, qtd: '' }]);
    setSelecionandoPara(null);
    setBusca('');
  };

  const updateQtd = (index, value) => {
    const num = Number(value.replace(/\D/g, ''));
    setEsquadroes(prev => {
      const next = [...prev];
      next[index] = { ...next[index], qtd: num === 0 ? '' : num };
      return next;
    });
  };

  const fecharConfirmacao  = () => setConfirmDialog(d => ({ ...d, open: false }));
  const executarConfirmacao = () => { confirmDialog.acao?.(); fecharConfirmacao(); };

  const confirmarRemocao = (index, nome) =>
    setConfirmDialog({
      open: true,
      title: 'Remover unidade',
      text: `Retirar ${nome} da formação?`,
      acao: () => setEsquadroes(prev => prev.filter((_, i) => i !== index)),
    });

  const solicitarSaida = () => {
    const temDados = esquadroes.length > 0 || tropaA || tropaB;
    if (temDados) {
      setConfirmDialog({
        open: true,
        title: 'Sair do simulador',
        text: 'Os dados da simulação serão perdidos. Confirma a saída?',
        acao: () => setRoute('tropas'),
      });
    } else {
      setRoute('tropas');
    }
  };

  const calcMarcha = useMemo(() => {
    let totTropas = 0, totPoder = 0, totCarga = 0, minVel = Infinity;
    esquadroes.forEach(({ tropa, qtd }) => {
      const q = qtd || 0;
      if (q > 0) {
        totTropas += q;
        totPoder  += (tropa.poder || 0) * q;
        totCarga  += (tropa.car   || 0) * q;
        if (tropa.vel < minVel) minVel = tropa.vel;
      }
    });
    return { tropas: totTropas, poder: totPoder, carga: totCarga, velocidade: minVel === Infinity ? 0 : minVel };
  }, [esquadroes]);

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', pb: 6 }}>

      {/* ── Dialog de confirmação ── */}
      <Dialog
        open={confirmDialog.open} TransitionComponent={TransitionDown}
        onClose={fecharConfirmacao}
        PaperProps={{ sx: { bgcolor: C.BG_CARD, border: `2px solid ${C.ERROR}33`, borderRadius: '8px' } }}
      >
        <DialogTitle sx={{ color: C.ERROR, fontWeight: 900, textAlign: 'center', borderBottom: `1px solid ${C.BORDER_SOFT}`, fontFamily: '"Nunito", sans-serif', fontSize: '0.9rem' }}>
          {confirmDialog.title}
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', pt: 2, pb: 1 }}>
          <Typography sx={{ color: C.ACCENT, fontSize: '0.85rem' }}>
            {confirmDialog.text}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: 'center', gap: 1.5, bgcolor: C.BG_CARD_TOP }}>
          <Button onClick={fecharConfirmacao} variant="contained" color="info" sx={{ fontWeight: 900 }}>Cancelar</Button>
          <Button onClick={executarConfirmacao} variant="contained" color="error" sx={{ fontWeight: 900 }}>Confirmar</Button>
        </DialogActions>
      </Dialog>

      {/* ── Cabeçalho + voltar ── */}
      <Box sx={{ mb: 1.5 }}>
        <GameHeader title="Simulador" />
      </Box>

      <Button
        variant="outlined" color="primary" size="small" onClick={solicitarSaida}
        sx={{ mb: 2, fontWeight: 900, fontSize: '0.7rem' }}
      >
        ← Voltar ao Catálogo
      </Button>

      {/* ── Abas ── */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2.5 }}>
        {[
          { id: 'marcha',   label: '🛡️ Marcha'   },
          { id: 'comparar', label: '⚔️ Comparar' },
        ].map(({ id, label }) => {
          const ativo = aba === id;
          return (
            <Button
              key={id} onClick={() => setAba(id)}
              variant={ativo ? 'contained' : 'outlined'}
              sx={{
                flex: 1, fontWeight: 900, fontSize: '0.80rem',
                borderColor: C.ACCENT_HOVER,
                bgcolor: ativo ? C.ACCENT_HOVER : 'transparent',
                color: ativo ? '#0e0a03' : C.ACCENT_HOVER,
                '&:hover': { borderColor: C.ACCENT },
              }}
            >
              {label}
            </Button>
          );
        })}
      </Box>

      {/* ══════════════════════ ABA MARCHA ══════════════════════════════ */}
      {aba === 'marcha' && (
        <Box>
          {/* Formação */}
          <Card sx={{ mb: 2, overflow: 'hidden' }}>
            <GameHeader title="Formação de Marcha" fontSize="0.85rem" />
            <Box sx={{ p: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>

              {esquadroes.length === 0 && (
                <Box sx={{ py: 3, textAlign: 'center', opacity: 0.45 }}>
                  <Typography sx={{ color: C.TEXT_SECONDARY, fontSize: '0.6rem', fontFamily: '"Nunito", sans-serif', letterSpacing: '1px' }}>
                    Nenhuma unidade adicionada
                  </Typography>
                </Box>
              )}

              {esquadroes.map((esq, idx) => (
                <Box key={idx} sx={{
                  display: 'flex', alignItems: 'center', gap: 1,
                  px: 1.2, py: 0.9,
                  border: `1px solid ${C.BORDER_SOFT}`,
                  borderLeft: `3px solid ${C.BORDER}`,
                  borderRadius: '6px',
                  bgcolor: C.BG_CARD,
                }}>
                  {/* Ícone */}
                  <Typography sx={{ fontSize: '1.5rem', lineHeight: 1, flexShrink: 0, width: 28, textAlign: 'center' }}>
                    {getIcone(esq.tropa.nome)}
                  </Typography>

                  {/* Nome */}
                  <Typography sx={{ flex: 1, color: C.ACCENT, fontSize: '0.80rem', fontWeight: 900, fontFamily: '"Nunito", sans-serif', lineHeight: 1.3, minWidth: 0 }}>
                    {esq.tropa.nome}
                  </Typography>

                  {/* Qtd */}
                  <TextField
                    placeholder="Qtd." variant="outlined" size="small"
                    value={esq.qtd ? esq.qtd.toLocaleString('pt-BR') : ''}
                    onChange={e => updateQtd(idx, e.target.value)}
                    inputProps={{ inputMode: 'numeric' }}
                    sx={{
                      width: 80, flexShrink: 0,
                      '& .MuiInputBase-input': {
                        py: '5px', px: '8px',
                        fontSize: '0.75rem', fontWeight: 900,
                        textAlign: 'center',
                        fontFamily: '"Nunito", sans-serif',
                        color: C.TEXT_PRIMARY,
                      },
                    }}
                  />

                  {/* Delete */}
                  <IconButton
                    size="small"
                    onClick={() => confirmarRemocao(idx, esq.tropa.nome)}
                    sx={{
                      flexShrink: 0,
                      color: C.ERROR,
                      border: `1px solid ${C.ERROR}33`,
                      borderRadius: '4px',
                      p: 0.5,
                      '&:hover': { bgcolor: `${C.ERROR}15` },
                    }}
                  >
                    <DeleteIcon sx={{ fontSize: '1rem' }} />
                  </IconButton>
                </Box>
              ))}

              <Button
                variant="outlined" fullWidth
                onClick={() => setSelecionandoPara('MARCHA')}
                startIcon={<AddIcon />}
                sx={{
                  mt: 0.5, fontWeight: 900, fontSize: '0.7rem',
                  borderStyle: 'dashed', borderColor: C.BORDER,
                  color: C.TEXT_MUTED,
                  '&:hover': { borderColor: C.ACCENT_HOVER, color: C.ACCENT_HOVER, borderStyle: 'dashed' },
                }}
              >
                Adicionar Unidade
              </Button>
            </Box>
          </Card>

          {/* Relatório */}
          <Card sx={{ overflow: 'hidden' }}>
            <GameHeader title="Relatório" fontSize="0.85rem" />
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
              {[
                { label: 'Tropas',    value: fmt(calcMarcha.tropas),      color: C.ACCENT,    border: C.ACCENT_HOVER },
                { label: 'Poder',     value: fmt(calcMarcha.poder),       color: '#9d4edd',       border: '#9d4edd'     },
                { label: 'Saque',     value: fmt(calcMarcha.carga),       color: C.ACCENT_HOVER,   border: C.ACCENT_HOVER },
                { label: 'Vel. base', value: fmtFull(calcMarcha.velocidade), color: '#0369a1',    border: '#0369a1'     },
              ].map(({ label, value, color, border }, i) => (
                <Box key={label} sx={{
                  py: 1.5, px: 1, textAlign: 'center',
                  borderBottom: `3px solid ${border}`,
                  borderRight: i % 2 === 0 ? `1px solid ${C.BORDER_SOFT}` : 'none',
                  borderTop: i >= 2 ? `1px solid ${C.BORDER_SOFT}` : 'none',
                }}>
                  <Typography sx={{ color: C.TEXT_SECONDARY, fontSize: '0.75rem', letterSpacing: '1.5px', fontFamily: '"Nunito", sans-serif', fontWeight: 700, mb: 0.4 }}>
                    {label.toUpperCase()}
                  </Typography>
                  <Typography sx={{ color, fontSize: '1.1rem', fontWeight: 900, fontFamily: '"Nunito", sans-serif', lineHeight: 1, textShadow: `0 0 10px ${color}55` }}>
                    {value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Card>
        </Box>
      )}

      {/* ══════════════════════ ABA COMPARAR ════════════════════════════ */}
      {aba === 'comparar' && (
        <Box>
          {/* Slots */}
          <Box sx={{ display: 'flex', gap: 1.5, mb: 2, alignItems: 'stretch' }}>
            <SlotComparar tropa={tropaA} label="UNIDADE A" side="A" onSelect={setSelecionandoPara} />
            <Box sx={{ display: 'flex', alignItems: 'center', px: 0.5 }}>
              <Typography sx={{ fontWeight: 900, color: C.ERROR, fontSize: '1rem', fontFamily: '"Nunito", sans-serif' }}>VS</Typography>
            </Box>
            <SlotComparar tropa={tropaB} label="UNIDADE B" side="B" onSelect={setSelecionandoPara} />
          </Box>

          {(tropaA || tropaB) ? (
            <Card sx={{ overflow: 'hidden' }}>
              <GameHeader title="Comparação de Atributos" fontSize="0.85rem" />
              <Box sx={{ p: 1.5 }}>

                {/* Cabeçalho com nomes */}
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 56px 1fr', gap: 0.5, mb: 1.5, alignItems: 'center' }}>
                  <Typography sx={{ color: C.ACCENT, fontSize: '0.78rem', fontWeight: 900, fontFamily: '"Nunito", sans-serif', textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {getIcone(tropaA?.nome || '')} {tropaA?.nome || '—'}
                  </Typography>
                  <Box />
                  <Typography sx={{ color: C.ACCENT, fontSize: '0.78rem', fontWeight: 900, fontFamily: '"Nunito", sans-serif', textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {tropaB?.nome || '—'} {getIcone(tropaB?.nome || '')}
                  </Typography>
                </Box>

                {ATTRS_COMPARAR.map((attr) => {
                  const valA = tropaA ? (tropaA[attr.id] || 0) : 0;
                  const valB = tropaB ? (tropaB[attr.id] || 0) : 0;
                  const winA = valA > valB;
                  const winB = valB > valA;

                  return (
                    <Box key={attr.id} sx={{ mb: 1.8 }}>
                      {/* Label central */}
                      <Typography sx={{ textAlign: 'center', fontSize: '0.5rem', fontWeight: 900, color: C.TEXT_SECONDARY, mb: 0.5, fontFamily: '"Nunito", sans-serif', letterSpacing: '1px' }}>
                        {attr.icon} {attr.label}
                      </Typography>

                      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 56px 1fr', gap: 0.5, alignItems: 'center' }}>
                        {/* Lado A */}
                        <Box>
                          <Typography sx={{ fontWeight: 900, color: winA ? C.SUCCESS : C.ACCENT, fontSize: '0.82rem', textAlign: 'right', fontFamily: '"Nunito", sans-serif', mb: 0.3 }}>
                            {fmtFull(valA)}
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={(valA / attr.max) * 100}
                            sx={{
                              height: 5, borderRadius: 0, bgcolor: 'rgba(255,255,255,0.04)',
                              transform: 'scaleX(-1)',
                              '& .MuiLinearProgress-bar': { bgcolor: winA ? C.SUCCESS : attr.color, borderRadius: 0 },
                            }}
                          />
                        </Box>

                        {/* Ícone central */}
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography sx={{ fontSize: '0.75rem' }}>{attr.icon}</Typography>
                        </Box>

                        {/* Lado B */}
                        <Box>
                          <Typography sx={{ fontWeight: 900, color: winB ? C.SUCCESS : C.ACCENT, fontSize: '0.82rem', textAlign: 'left', fontFamily: '"Nunito", sans-serif', mb: 0.3 }}>
                            {fmtFull(valB)}
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={(valB / attr.max) * 100}
                            sx={{
                              height: 5, borderRadius: 0, bgcolor: 'rgba(255,255,255,0.04)',
                              '& .MuiLinearProgress-bar': { bgcolor: winB ? C.SUCCESS : attr.color, borderRadius: 0 },
                            }}
                          />
                        </Box>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Card>
          ) : (
            <Box sx={{ py: 6, textAlign: 'center', border: `1px dashed ${C.BORDER}`, borderRadius: '8px', opacity: 0.5 }}>
              <Typography sx={{ color: C.TEXT_SECONDARY, fontSize: '0.80rem', fontFamily: '"Nunito", sans-serif', letterSpacing: '1px' }}>
                Selecione duas unidades para comparar
              </Typography>
            </Box>
          )}
        </Box>
      )}

      {/* ══════════════════════ GAVETA DE SELEÇÃO ═══════════════════════ */}
      <Dialog
        fullScreen
        open={selecionandoPara !== null}
        onClose={() => setSelecionandoPara(null)}
        TransitionComponent={TransitionUp}
        PaperProps={{ sx: { bgcolor: C.BG_MAIN } }}
      >
        {/* Header da gaveta */}
        <Box sx={{
          px: 2, py: 1.2,
          bgcolor: C.BG_CARD_TOP,
          borderBottom: `2px solid ${C.BORDER}`,
          display: 'flex', alignItems: 'center', gap: 1.5,
          position: 'sticky', top: 0, zIndex: 10,
        }}>
          <IconButton
            onClick={() => { setSelecionandoPara(null); setBusca(''); }}
            sx={{ color: C.ACCENT, p: 0.5 }}
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ color: C.ACCENT, fontWeight: 900, fontFamily: '"Nunito", sans-serif', fontSize: '0.85rem', letterSpacing: '1px', flex: 1 }}>
            Selecionar Unidade
          </Typography>
          <Typography sx={{ color: C.TEXT_SECONDARY, fontSize: '0.75rem' }}>
            {tropasFiltradas.length} un.
          </Typography>
        </Box>

        {/* Busca */}
        <Box sx={{ px: 1.5, pt: 1.2, pb: 0.8, bgcolor: C.BG_CARD, borderBottom: `1px solid ${C.BORDER_SOFT}` }}>
          <TextField
            fullWidth placeholder="Buscar unidade..."
            variant="outlined" size="small"
            value={busca} onChange={e => setBusca(e.target.value)}
            autoFocus
            sx={{ '& .MuiInputBase-input': { fontSize: '0.82rem', py: '7px' } }}
          />
        </Box>

        {/* Lista */}
        <Box sx={{ p: 1.5, display: 'flex', flexDirection: 'column', gap: 0.8, overflowY: 'auto' }}>
          {tropasFiltradas.map(t => (
            <SelectRow key={t.nome} tropa={t} onClick={() => handleSelect(t)} />
          ))}
        </Box>
      </Dialog>

    </Box>
  );
};

export default CalculosTropas;
