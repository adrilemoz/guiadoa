import React from 'react';
import { Box, Typography } from '@mui/material';
import { C } from '../../theme.js';
import { getIcone, fmt } from './tropaUtils.js';

/**
 * Linha individual da lista de unidades no painel esquerdo do War Room.
 */
const TropaLinha = ({ tropa, isSelected, onClick }) => (
  <Box
    onClick={onClick}
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      px: 1,
      py: 0.75,
      cursor: 'pointer',
      borderLeft: `3px solid ${isSelected ? C.ACCENT_HOVER : 'transparent'}`,
      borderBottom: `1px solid ${C.BORDER_SOFT}`,
      bgcolor: isSelected ? `rgba(200,148,10,0.07)` : 'transparent',
      transition: 'all 0.15s',
      '&:hover': {
        bgcolor: `rgba(200,148,10,0.05)`,
        borderLeftColor: C.BORDER,
      },
    }}
  >
    {/* Ícone */}
    <Typography sx={{ fontSize: '1.1rem', lineHeight: 1, flexShrink: 0, width: 24, textAlign: 'center' }}>
      {getIcone(tropa.nome)}
    </Typography>

    {/* Nome + tipo */}
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Typography sx={{
        color: isSelected ? C.TEXT_PRIMARY : C.ACCENT,
        fontSize: '0.6rem',
        fontWeight: 900,
        fontFamily: '"Nunito", sans-serif',
        letterSpacing: '0.3px',
        lineHeight: 1.2,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}>
        {tropa.nome}
      </Typography>
      <Typography sx={{
        color: C.TEXT_SECONDARY,
        fontSize: '0.75rem',
        fontFamily: '"Nunito", sans-serif',
        letterSpacing: '0.5px',
        mt: 0.2,
      }}>
        ❤️{fmt(tropa.vida)}  🛡️{fmt(tropa.def)}
      </Typography>
    </Box>

    {/* Poder */}
    <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
      <Typography sx={{
        color: isSelected ? '#9d4edd' : C.TEXT_MUTED,
        fontSize: '0.80rem',
        fontWeight: 900,
        fontFamily: '"Nunito", sans-serif',
      }}>
        {tropa.poder}
      </Typography>
      <Typography sx={{ color: C.TEXT_SECONDARY, fontSize: '0.75rem', letterSpacing: '1px' }}>
        POD
      </Typography>
    </Box>

    {/* Seta indicadora */}
    <Typography sx={{
      color: isSelected ? C.ACCENT_HOVER : C.BORDER,
      fontSize: '0.8rem',
      ml: 0.3,
      transition: 'transform 0.15s',
      transform: isSelected ? 'translateX(2px)' : 'none',
    }}>
      ›
    </Typography>
  </Box>
);

export default TropaLinha;
