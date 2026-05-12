import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { C } from '../../theme.js';
import { getIcone, getTipoAtaque, fmt, fmtFull, ATRIBUTOS, getAtributosResumo } from './tropaUtils.js';

// ─── Barra mini (resumo no header) ───────────────────────────────────────────
const MiniBar = ({ value, max, color }) => {
  const pct   = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  const empty = !value || value === 0;
  return (
    <Box sx={{
      flex: 1, height: '4px',
      bgcolor: 'rgba(62,47,28,0.08)',
      borderRadius: '3px', overflow: 'hidden',
      border: `1px solid rgba(62,47,28,0.06)`,
    }}>
      <Box sx={{
        height: '100%', width: `${pct}%`,
        background: empty ? 'transparent' : `linear-gradient(90deg, ${color}88, ${color})`,
        borderRadius: '3px',
      }} />
    </Box>
  );
};

// ─── Linha de stat no detalhe expandido ──────────────────────────────────────
const StatRow = ({ icon, label, value, color, max }) => {
  const empty = !value || value === 0;
  const pct   = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <Box sx={{ mb: 1.2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.35 }}>
        <Typography sx={{
          color: C.TEXT_MUTED, fontSize: '0.75rem',
          fontFamily: '"Nunito", sans-serif', fontWeight: 700, letterSpacing: '0.5px',
        }}>
          {icon} {label}
        </Typography>
        <Typography sx={{
          color: empty ? C.TEXT_FAINT : color,
          fontSize: '0.80rem', fontWeight: 700,
          fontFamily: '"Nunito", sans-serif',
        }}>
          {empty ? '—' : fmtFull(value)}
        </Typography>
      </Box>
      <Box sx={{
        height: '5px',
        bgcolor: 'rgba(62,47,28,0.07)',
        borderRadius: '3px', overflow: 'hidden',
        border: `1px solid rgba(62,47,28,0.08)`,
      }}>
        <Box sx={{
          height: '100%', width: `${pct}%`,
          background: empty ? 'transparent' : `linear-gradient(90deg, ${color}55, ${color})`,
          borderRadius: '3px', transition: 'width 0.35s ease',
        }} />
      </Box>
    </Box>
  );
};

// ─── Card principal ───────────────────────────────────────────────────────────
const TropaCard = ({ tropa, quantidade, onQuantidadeChange, onFecharTeclado }) => {
  const [aberto, setAberto] = useState(false);
  const tipo   = getTipoAtaque(tropa);
  const resumo = getAtributosResumo(tropa);

  return (
    <Box sx={{
      border: `1.5px solid ${aberto ? C.BORDER : C.BORDER_SOFT}`,
      borderLeft: `3px solid ${aberto ? C.ACCENT : C.BORDER}`,
      borderRadius: '8px',
      background: aberto
        ? `linear-gradient(180deg, #FAF3E0 0%, ${C.BG_CARD} 100%)`
        : `linear-gradient(180deg, ${C.BG_CARD} 0%, ${C.BG_CARD_TOP} 100%)`,
      overflow: 'hidden',
      transition: 'border-color 0.15s, background 0.15s, box-shadow 0.15s',
      boxShadow: aberto
        ? '0 3px 14px rgba(62,47,28,0.14)'
        : '0 1px 5px rgba(62,47,28,0.08)',
      '&:hover': {
        borderLeftColor: C.ACCENT,
        boxShadow: '0 3px 12px rgba(62,47,28,0.12)',
      },
    }}>

      {/* ── Cabeçalho clicável ── */}
      <Box
        onClick={() => setAberto(v => !v)}
        sx={{ display: 'flex', alignItems: 'center', gap: 1.2, px: 1.4, py: 1.1, cursor: 'pointer' }}
      >
        {/* Ícone */}
        <Box sx={{ fontSize: '1.7rem', lineHeight: 1, flexShrink: 0, width: 32, textAlign: 'center',
          filter: 'drop-shadow(0 1px 2px rgba(62,47,28,0.2))' }}>
          {getIcone(tropa.nome)}
        </Box>

        {/* Nome + resumo */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.7, mb: 0.35, flexWrap: 'wrap' }}>
            {/* Nome */}
            <Typography sx={{
              color: aberto ? C.TEXT_PRIMARY : C.TEXT_PRIMARY,
              fontSize: '0.80rem', fontWeight: 700,
              fontFamily: '"Nunito", sans-serif', letterSpacing: '0.2px', lineHeight: 1,
            }}>
              {tropa.nome}
            </Typography>
            {/* Badge de tipo */}
            <Box sx={{
              px: 0.8, py: 0.2,
              border: `1px solid ${tipo.color}55`,
              borderRadius: '10px',
              bgcolor: `${tipo.color}12`,
              flexShrink: 0,
            }}>
              <Typography sx={{
                color: tipo.color, fontSize: '0.75rem',
                fontFamily: '"Nunito", sans-serif', fontWeight: 700, letterSpacing: '0.3px',
              }}>
                {tipo.label}
              </Typography>
            </Box>
          </Box>

          {/* Stats resumidos */}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
            {resumo.map((s, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                <Typography sx={{ fontSize: '0.72rem', lineHeight: 1 }}>{s.icon}</Typography>
                <Typography sx={{
                  fontSize: '0.72rem',
                  fontFamily: '"Nunito", sans-serif',
                  fontWeight: 700,
                  color: C.TEXT_SECONDARY, whiteSpace: 'nowrap',
                }}>
                  {s.val}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Mini barras */}
          <Box sx={{ display: 'flex', gap: 0.4, mt: 0.5, alignItems: 'center' }}>
            <MiniBar value={tropa.vida}  max={32000} color={C.HEALTH}  />
            <MiniBar value={tropa.def}   max={5000}  color={C.DEFENSE} />
            <MiniBar value={Math.max(tropa.atqPerto, tropa.atqDist)} max={6000} color={C.ATTACK} />
            <MiniBar value={tropa.vel}   max={3000}  color={C.ENERGY}  />
          </Box>
        </Box>

        {/* Poder + seta */}
        <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
          <Typography sx={{
            color: C.POWER, fontSize: '0.82rem', fontWeight: 700,
            fontFamily: '"Nunito", sans-serif', lineHeight: 1,
          }}>
            {tropa.poder}
          </Typography>
          <Typography sx={{ color: C.TEXT_FAINT, fontSize: '0.62rem', letterSpacing: '1px', mb: 0.3 }}>
            POD
          </Typography>
          <Typography sx={{
            color: aberto ? C.ACCENT : C.BORDER,
            fontSize: '0.9rem', display: 'block',
            transition: 'transform 0.2s, color 0.15s',
            transform: aberto ? 'rotate(90deg)' : 'none',
          }}>
            ›
          </Typography>
        </Box>
      </Box>

      {/* ── Detalhe expandido ── */}
      {aberto && (
        <Box sx={{ borderTop: `1px solid ${C.BORDER_SOFT}` }}>

          {/* Descrição */}
          {tropa.desc && (
            <Box sx={{
              px: 1.5, pt: 1.2, pb: 0.5,
              borderBottom: `1px solid ${C.BORDER_SOFT}`,
              bgcolor: 'rgba(225,207,163,0.2)',
            }}>
              <Typography sx={{
                color: C.TEXT_SECONDARY, fontSize: '0.78rem',
                fontFamily: '"Nunito", sans-serif', fontStyle: 'italic',
                lineHeight: 1.6,
              }}>
                {tropa.desc}
              </Typography>
            </Box>
          )}

          {/* Atributos */}
          <Box sx={{ px: 1.5, pt: 1.2, pb: 0.5 }}>
            {/* Título da seção */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.2 }}>
              <Box sx={{ flex: 1, height: '1px', background: `linear-gradient(90deg, transparent, ${C.BORDER_SOFT})` }} />
              <Typography sx={{
                color: C.TEXT_MUTED, fontSize: '0.75rem',
                fontFamily: '"Nunito", sans-serif', letterSpacing: '2px', fontWeight: 700,
              }}>
                ATRIBUTOS
              </Typography>
              <Box sx={{ flex: 1, height: '1px', background: `linear-gradient(270deg, transparent, ${C.BORDER_SOFT})` }} />
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 14px' }}>
              {ATRIBUTOS.map(attr => (
                <StatRow
                  key={attr.id}
                  icon={attr.icon}
                  label={attr.label}
                  value={tropa[attr.id]}
                  color={attr.color}
                  max={attr.max}
                />
              ))}
            </Box>
          </Box>

          {/* Seções futuras */}
          <Box sx={{ px: 1.5, pb: 1.2, display: 'flex', gap: 0.8 }}>
            {[
              { icon: '📋', title: 'REQUISITOS' },
              { icon: '🔮', title: 'AMULETOS'   },
            ].map(sec => (
              <Box key={sec.title} sx={{
                flex: 1, py: 0.9, px: 0.5,
                border: `1px dashed ${C.BORDER_SOFT}`,
                borderRadius: '6px', textAlign: 'center',
                bgcolor: 'rgba(184,150,90,0.04)',
              }}>
                <Typography sx={{
                  color: C.TEXT_MUTED, fontSize: '0.75rem',
                  fontFamily: '"Nunito", sans-serif', letterSpacing: '0.8px',
                  fontWeight: 700, display: 'block',
                }}>
                  {sec.icon} {sec.title}
                </Typography>
                <Typography sx={{
                  color: C.TEXT_FAINT, fontSize: '0.75rem',
                  fontFamily: '"Nunito", sans-serif', fontStyle: 'italic', mt: 0.3,
                }}>
                  Em breve
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Campo de quantidade */}
          <Box sx={{
            px: 1.5, pb: 1.2, pt: 1,
            borderTop: `1px solid ${C.BORDER_SOFT}`,
            bgcolor: 'rgba(225,207,163,0.15)',
          }}>
            <Typography sx={{
              color: C.TEXT_MUTED, fontSize: '0.75rem',
              fontFamily: '"Nunito", sans-serif', fontWeight: 700,
              letterSpacing: '1.5px', mb: 0.8,
            }}>
              EM POSSE
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.8 }}>
              <TextField
                fullWidth size="small" variant="outlined"
                placeholder="0"
                value={quantidade ? quantidade.toLocaleString('pt-BR') : ''}
                onChange={e => onQuantidadeChange(tropa.nome, e.target.value)}
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                onClick={e => e.stopPropagation()}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    fontWeight: 700,
                    color: C.TEXT_PRIMARY,
                    fontFamily: '"Nunito", sans-serif',
                    bgcolor: C.BG_INPUT,
                  },
                  '& .MuiInputBase-input': {
                    p: '6px 10px', fontSize: '0.85rem',
                    textAlign: 'center',
                  },
                }}
              />
              <Button
                variant="contained" color="primary"
                onClick={e => { e.stopPropagation(); onFecharTeclado(); }}
                sx={{
                  minWidth: 'auto', px: 1.5,
                  fontFamily: '"Nunito", sans-serif',
                  fontSize: '0.80rem', fontWeight: 700, flexShrink: 0,
                }}
              >
                OK
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default TropaCard;
