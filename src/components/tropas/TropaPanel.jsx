import React from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { C } from '../../theme.js';
import { getIcone, getTipoAtaque, fmt, fmtFull, ATRIBUTOS } from './tropaUtils.js';

// ─── Barra de stat ────────────────────────────────────────────────────────
const StatBar = ({ icon, label, value, color, max }) => {
  const pct     = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  const isEmpty = value === null || value === undefined || value === 0;
  return (
    <Box sx={{ mb: 1.2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.4 }}>
        <Typography sx={{ color: C.TEXT_SECONDARY, fontSize: '0.5rem', fontFamily: '"Nunito", sans-serif', fontWeight: 700, letterSpacing: '1px' }}>
          {icon} {label}
        </Typography>
        <Typography sx={{ color: isEmpty ? C.BORDER : color, fontSize: '0.80rem', fontWeight: 900, fontFamily: '"Nunito", sans-serif' }}>
          {isEmpty ? '—' : fmtFull(value)}
        </Typography>
      </Box>
      <Box sx={{ height: '4px', bgcolor: 'rgba(255,255,255,0.04)', borderRadius: '2px', overflow: 'hidden', border: `1px solid ${C.BORDER_SOFT}` }}>
        <Box sx={{
          height: '100%', width: `${pct}%`,
          background: isEmpty ? 'transparent' : `linear-gradient(90deg, ${color}55, ${color})`,
          borderRadius: '2px', transition: 'width 0.4s ease',
          boxShadow: isEmpty ? 'none' : `0 0 6px ${color}88`,
        }} />
      </Box>
    </Box>
  );
};

// ─── Estado vazio ─────────────────────────────────────────────────────────
const PanelVazio = () => (
  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1, p: 3, opacity: 0.4 }}>
    <Typography sx={{ fontSize: '2.2rem' }}>🗡️</Typography>
    <Typography sx={{ color: C.TEXT_SECONDARY, fontSize: '0.75rem', fontFamily: '"Nunito", sans-serif', letterSpacing: '1.5px', textAlign: 'center', lineHeight: 1.8 }}>
      SELECIONE UMA{'\n'}UNIDADE
    </Typography>
  </Box>
);

// ─── Painel principal ─────────────────────────────────────────────────────
const TropaPanel = ({ tropa, quantidade, onQuantidadeChange, onFecharTeclado }) => {
  if (!tropa) return <PanelVazio />;

  const tipo = getTipoAtaque(tropa);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

      {/* Cabeçalho */}
      <Box sx={{
        textAlign: 'center', py: 1.5, px: 1,
        borderBottom: `1px solid ${C.BORDER_SOFT}`,
        bgcolor: C.BG_CARD_TOP, flexShrink: 0,
        position: 'relative',
        '&::after': { content: '""', position: 'absolute', bottom: 0, left: '10%', right: '10%', height: '1px', background: `linear-gradient(90deg, transparent, ${C.BORDER_STRONG}, transparent)` },
      }}>
        <Typography sx={{ fontSize: '2rem', lineHeight: 1, mb: 0.5 }}>{getIcone(tropa.nome)}</Typography>
        <Typography sx={{ color: C.TEXT_PRIMARY, fontSize: '0.6rem', fontWeight: 900, fontFamily: '"Nunito", sans-serif', letterSpacing: '1px', textTransform: 'uppercase', lineHeight: 1.3 }}>
          {tropa.nome}
        </Typography>
        {/* Badge tipo */}
        <Box sx={{ display: 'inline-block', mt: 0.6, px: 1.2, py: 0.3, border: `1px solid ${tipo.color}66`, borderRadius: '10px', bgcolor: `${tipo.color}12` }}>
          <Typography sx={{ color: tipo.color, fontSize: '0.75rem', fontFamily: '"Nunito", sans-serif', fontWeight: 700, letterSpacing: '1px' }}>
            {tipo.label}
          </Typography>
        </Box>
      </Box>

      {/* Descrição */}
      {tropa.desc && (
        <Box sx={{ px: 1.2, py: 0.8, borderBottom: `1px solid ${C.BORDER_SOFT}`, flexShrink: 0 }}>
          <Typography sx={{ color: C.TEXT_MUTED, fontSize: '0.5rem', fontFamily: '"Nunito", sans-serif', fontStyle: 'italic', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {tropa.desc}
          </Typography>
        </Box>
      )}

      {/* Barras de atributos — scrollável */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 1.2, pt: 1, pb: 0.5,
        '&::-webkit-scrollbar': { width: '3px' },
        '&::-webkit-scrollbar-thumb': { background: C.BORDER, borderRadius: '2px' },
      }}>
        {ATRIBUTOS.map(attr => (
          <StatBar key={attr.id} icon={attr.icon} label={attr.label} value={tropa[attr.id]} color={attr.color} max={attr.max} />
        ))}
      </Box>

      {/* Seções futuras — placeholders visíveis */}
      <Box sx={{ px: 1.2, py: 0.8, borderTop: `1px solid ${C.BORDER_SOFT}`, bgcolor: C.BG_CARD_TOP, flexShrink: 0 }}>
        <Box sx={{ display: 'flex', gap: 0.6 }}>
          <Box sx={{ flex: 1, py: 0.7, border: `1px dashed ${C.BORDER_SOFT}`, borderRadius: '4px', textAlign: 'center' }}>
            <Typography sx={{ color: C.BORDER_STRONG, fontSize: '0.75rem', fontFamily: '"Nunito", sans-serif', letterSpacing: '1px' }}>📋 REQUISITOS</Typography>
            <Typography sx={{ color: C.BORDER, fontSize: '0.4rem', fontFamily: '"Nunito", sans-serif', mt: 0.2 }}>Em breve</Typography>
          </Box>
          <Box sx={{ flex: 1, py: 0.7, border: `1px dashed ${C.BORDER_SOFT}`, borderRadius: '4px', textAlign: 'center' }}>
            <Typography sx={{ color: C.BORDER_STRONG, fontSize: '0.75rem', fontFamily: '"Nunito", sans-serif', letterSpacing: '1px' }}>🔮 AMULETOS</Typography>
            <Typography sx={{ color: C.BORDER, fontSize: '0.4rem', fontFamily: '"Nunito", sans-serif', mt: 0.2 }}>Em breve</Typography>
          </Box>
        </Box>
      </Box>

      {/* Campo de quantidade */}
      <Box sx={{ px: 1.2, py: 1, borderTop: `1px solid ${C.BORDER_SOFT}`, bgcolor: C.BG_CARD_TOP, flexShrink: 0 }}>
        <Typography sx={{ color: C.TEXT_SECONDARY, fontSize: '0.75rem', fontFamily: '"Nunito", sans-serif', fontWeight: 700, letterSpacing: '1.5px', mb: 0.6 }}>
          EM POSSE
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.8 }}>
          <TextField
            fullWidth size="small" variant="outlined" placeholder="0"
            value={quantidade ? quantidade.toLocaleString('pt-BR') : ''}
            onChange={e => onQuantidadeChange(tropa.nome, e.target.value)}
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            sx={{
              '& .MuiOutlinedInput-root': { fontWeight: 900, color: C.TEXT_PRIMARY, fontFamily: '"Nunito", sans-serif' },
              '& .MuiInputBase-input': { p: '5px 8px', fontSize: '0.82rem', textAlign: 'center' },
            }}
          />
          <Button variant="contained" color="primary" onClick={onFecharTeclado}
            sx={{ minWidth: 'auto', px: 1.2, py: '4px', fontSize: '0.6rem', fontWeight: 900, flexShrink: 0 }}>
            OK
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default TropaPanel;
