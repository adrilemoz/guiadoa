import React from 'react';
import { Box, Typography } from '@mui/material';
import { C } from '../../theme.js';

/**
 * Cabeçalho padrão dos módulos — tema pergaminho medieval.
 * Usado em: Torneios, Tropas, Niveis, Ilhas, Sobre, Backup, etc.
 */
const GameHeader = ({ title, fontSize = '1rem', subtitle }) => (
  <Box sx={{
    background: `linear-gradient(180deg, ${C.BG_SECONDARY} 0%, ${C.BG_CARD_TOP} 100%)`,
    border: `1.5px solid ${C.BORDER}`,
    borderRadius: '10px',
    p: '12px 16px',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
    mb: 1.5,
    boxShadow: '0 2px 8px rgba(62,47,28,0.1)',

    // Brilho superior
    '&::before': {
      content: '""', position: 'absolute',
      top: 0, left: '10%', right: '10%', height: '1px',
      background: 'linear-gradient(90deg, transparent, rgba(255,248,230,0.8), transparent)',
    },

    // Sombra inferior interna
    '&::after': {
      content: '""', position: 'absolute',
      bottom: 0, left: 0, right: 0, height: '2px',
      background: `linear-gradient(90deg, transparent 5%, ${C.BORDER_SOFT} 30%, ${C.BORDER} 50%, ${C.BORDER_SOFT} 70%, transparent 95%)`,
    },
  }}>

    {/* Ornamentos de canto */}
    <Box sx={{
      position: 'absolute', top: 5, left: 8,
      color: C.BORDER, fontSize: '0.75rem', opacity: 0.7, lineHeight: 1,
    }}>◆</Box>
    <Box sx={{
      position: 'absolute', top: 5, right: 8,
      color: C.BORDER, fontSize: '0.75rem', opacity: 0.7, lineHeight: 1,
    }}>◆</Box>

    {/* Título */}
    <Typography sx={{
      color: C.TEXT_PRIMARY,
      fontFamily: '"Nunito", sans-serif',
      fontWeight: 700,
      fontSize,
      letterSpacing: '2px',
      textTransform: 'uppercase',
      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
      lineHeight: 1.3,
    }}>
      {title}
    </Typography>

    {/* Subtítulo opcional */}
    {subtitle && (
      <Typography sx={{
        color: C.TEXT_MUTED,
        fontFamily: '"Nunito", sans-serif',
        fontStyle: 'italic',
        fontSize: '0.78rem',
        mt: 0.3,
        lineHeight: 1,
      }}>
        {subtitle}
      </Typography>
    )}
  </Box>
);

export default GameHeader;
