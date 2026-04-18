import React from 'react';
import { Box, Chip } from '@mui/material';
import { dbDragoes } from '../../data/dragoes.js';
import { C } from '../../theme.js';

// ─────────────────────────────────────────────────────────
// DIVISOR ORNAMENTADO
// ─────────────────────────────────────────────────────────
const ParchmentDivider = ({ label }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, my: 0.5 }}>
    <Box sx={{ flex: 1, height: '1px', background: `linear-gradient(90deg, transparent, ${C.BORDER})` }} />
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
      <Box component="span" sx={{ color: C.ACCENT, fontSize: '0.75rem' }}>◆</Box>
      <Box sx={{
        fontFamily: '"Nunito", sans-serif', fontWeight: 700,
        fontSize: '0.80rem', letterSpacing: '2.5px', color: C.TEXT_MUTED,
        whiteSpace: 'nowrap',
      }}>
        {label}
      </Box>
      <Box component="span" sx={{ color: C.ACCENT, fontSize: '0.75rem' }}>◆</Box>
    </Box>
    <Box sx={{ flex: 1, height: '1px', background: `linear-gradient(270deg, transparent, ${C.BORDER})` }} />
  </Box>
);

// ─────────────────────────────────────────────────────────
// CARD DE DRAGÃO
// ─────────────────────────────────────────────────────────
const DragaoCard = ({ dragao, onClick }) => (
  <Box
    onClick={() => onClick(dragao.id)}
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 1.5,
      px: 1.8,
      py: 1.6,
      mb: 1.2,
      border: `1.5px solid ${C.BORDER_SOFT}`,
      borderLeft: `4px solid ${dragao.cor}`,
      borderRadius: '10px',
      background: `linear-gradient(135deg, ${C.BG_CARD} 0%, ${dragao.corFundo} 100%)`,
      boxShadow: '0 2px 8px rgba(62,47,28,0.1)',
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.22s ease',
      animation: 'reveal-up 0.4s ease both',

      // Linha de brilho no topo
      '&::before': {
        content: '""', position: 'absolute',
        top: 0, left: '10%', right: '10%', height: '1px',
        background: `linear-gradient(90deg, transparent, rgba(255,248,230,0.7), transparent)`,
      },

      '&:hover': {
        borderLeft: `4px solid ${dragao.cor}`,
        border: `1.5px solid ${dragao.cor}`,
        borderLeftWidth: '4px',
        transform: 'translateY(-2px)',
        boxShadow: `0 6px 20px rgba(62,47,28,0.18), 0 0 0 1px ${dragao.cor}22`,
      },
      '&:active': { transform: 'scale(0.98)' },
    }}
  >
    {/* Ícone Elemento */}
    <Box sx={{
      width: 52, height: 52, flexShrink: 0,
      borderRadius: '10px',
      background: `linear-gradient(135deg, ${dragao.cor}22 0%, ${dragao.cor}44 100%)`,
      border: `2px solid ${dragao.cor}66`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '1.8rem',
      boxShadow: `0 2px 8px ${dragao.cor}33`,
    }}>
      {dragao.emojiDragao}
    </Box>

    {/* Info */}
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 0.4, flexWrap: 'wrap' }}>
        <Box sx={{
          fontFamily: '"Nunito", sans-serif', fontWeight: 900,
          fontSize: '1.0rem', color: C.TEXT_PRIMARY,
          letterSpacing: '0.3px',
        }}>
          {dragao.nome}
        </Box>
        <Box sx={{
          fontSize: '0.62rem', fontWeight: 700, fontFamily: '"Nunito", sans-serif',
          px: 0.7, py: 0.2,
          borderRadius: '4px',
          bgcolor: `${dragao.cor}22`,
          border: `1px solid ${dragao.cor}55`,
          color: dragao.cor,
          letterSpacing: '0.5px',
        }}>
          {dragao.elemento}
        </Box>
        <Box sx={{
          fontSize: '0.62rem', fontWeight: 700, fontFamily: '"Nunito", sans-serif',
          px: 0.7, py: 0.2,
          borderRadius: '4px',
          bgcolor: `${dragao.corRaridade}22`,
          border: `1px solid ${dragao.corRaridade}55`,
          color: dragao.corRaridade,
          letterSpacing: '0.5px',
        }}>
          {dragao.raridade}
        </Box>
      </Box>

      {/* Bônus resumido */}
      <Box sx={{
        fontFamily: '"Nunito", sans-serif', fontWeight: 600,
        fontSize: '0.78rem', color: C.TEXT_SECONDARY,
        lineHeight: 1.4,
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
      }}>
        {dragao.bonusMarcha}
      </Box>
    </Box>

    {/* Seta */}
    <Box sx={{
      fontSize: '1.1rem', color: C.BORDER_STRONG,
      flexShrink: 0, opacity: 0.6,
      transition: 'opacity 0.2s, transform 0.2s',
      '.MuiBox-root:hover &': { opacity: 1, transform: 'translateX(3px)' },
    }}>
      ›
    </Box>
  </Box>
);

// ─────────────────────────────────────────────────────────
// TELA PRINCIPAL — LISTA DE DRAGÕES
// ─────────────────────────────────────────────────────────
const Dragoes = ({ setRoute }) => {
  const handleDragaoClick = (id) => {
    setRoute(`dragao_${id}`);
  };

  return (
    <Box sx={{
      maxWidth: 500,
      mx: 'auto',
      pb: 4,
      animation: 'fade-in 0.35s ease both',
    }}>

      {/* ── BANNER HERO ── */}
      <Box sx={{
        borderRadius: '12px',
        background: `linear-gradient(135deg,
          rgba(62,47,28,0.95) 0%,
          rgba(90,60,20,0.9) 40%,
          rgba(138,72,32,0.85) 100%)`,
        border: `2px solid ${C.BORDER_STRONG}`,
        boxShadow: '0 6px 24px rgba(62,47,28,0.35)',
        p: 2.5,
        mb: 2.5,
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center',

        // Ornamento de fundo
        '&::before': {
          content: '"🐉"',
          position: 'absolute',
          fontSize: '8rem',
          opacity: 0.06,
          right: '-1rem',
          bottom: '-1.5rem',
          lineHeight: 1,
          pointerEvents: 'none',
        },
      }}>
        <Box sx={{
          fontSize: '2.5rem',
          lineHeight: 1,
          mb: 0.8,
          filter: 'drop-shadow(0 2px 8px rgba(200,150,50,0.5))',
        }}>
          🐉
        </Box>
        <Box sx={{
          fontFamily: '"Nunito", sans-serif',
          fontWeight: 900,
          fontSize: '1.35rem',
          letterSpacing: '3px',
          color: '#FFF8EE',
          textTransform: 'uppercase',
          textShadow: '0 2px 8px rgba(62,47,28,0.6)',
          mb: 0.5,
        }}>
          Dragões
        </Box>
        <Box sx={{
          fontFamily: '"Nunito", sans-serif',
          fontWeight: 600,
          fontSize: '0.80rem',
          letterSpacing: '1px',
          color: 'rgba(255,248,238,0.65)',
        }}>
          Selecione um Dragão para ver detalhes e bônus de marcha
        </Box>
      </Box>

      {/* ── DIVISOR ── */}
      <ParchmentDivider label="BESTIÁRIO DRACÔNICO" />

      {/* ── LISTA DE DRAGÕES ── */}
      <Box sx={{ mt: 1.5 }}>
        {dbDragoes.map((dragao, i) => (
          <Box
            key={dragao.id}
            sx={{ animationDelay: `${0.08 + i * 0.07}s` }}
          >
            <DragaoCard dragao={dragao} onClick={handleDragaoClick} />
          </Box>
        ))}
      </Box>

      {/* ── RODAPÉ INFO ── */}
      <Box sx={{
        mt: 2,
        p: 1.5,
        borderRadius: '8px',
        bgcolor: 'rgba(184,150,90,0.08)',
        border: `1px dashed ${C.BORDER_SOFT}`,
        textAlign: 'center',
      }}>
        <Box sx={{
          fontFamily: '"Nunito", sans-serif',
          fontWeight: 600,
          fontSize: '0.75rem',
          color: C.TEXT_MUTED,
          letterSpacing: '0.5px',
        }}>
          ◆ Novos Dragões serão adicionados em futuras atualizações ◆
        </Box>
      </Box>

    </Box>
  );
};

export default Dragoes;
