import React from 'react';
import { Box, Typography } from '@mui/material';
import { C } from '../../theme.js';
import { fmt } from './tropaUtils.js';

const ExercitoBanner = ({ totTropas, totPoder, totalFiltradas }) => {
  const cols = [
    { label: 'EXÉRCITO', value: fmt(totTropas),  color: C.TEXT_PRIMARY,  icon: '⚔️' },
    { label: 'PODER',    value: fmt(totPoder),    color: C.POWER,         icon: '✦'  },
    { label: 'UNIDADES', value: totalFiltradas,   color: C.ACCENT_DEEP,   icon: '📋' },
  ];

  return (
    <Box sx={{
      display: 'flex',
      border: `1.5px solid ${C.BORDER}`,
      borderRadius: '10px',
      overflow: 'hidden',
      mb: 1.5,
      background: `linear-gradient(180deg, ${C.BG_CARD} 0%, ${C.BG_CARD_TOP} 100%)`,
      boxShadow: '0 2px 8px rgba(62,47,28,0.1)',
      position: 'relative',
    }}>
      {/* Brilho no topo */}
      <Box sx={{
        position: 'absolute', top: 0, left: '10%', right: '10%', height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,248,230,0.6), transparent)',
      }} />

      {cols.map(({ label, value, color, icon }, i) => (
        <Box key={label} sx={{
          flex: 1, textAlign: 'center',
          py: 1.4, px: 0.5,
          borderRight: i < 2 ? `1px solid ${C.BORDER_SOFT}` : 'none',
          position: 'relative',
        }}>
          <Typography sx={{
            color: C.TEXT_MUTED, fontSize: '0.75rem',
            letterSpacing: '1.5px', fontFamily: '"Nunito", sans-serif',
            fontWeight: 700, mb: 0.5,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.4,
          }}>
            {icon} {label}
          </Typography>
          <Typography sx={{
            color, fontSize: '1.05rem', fontWeight: 700,
            fontFamily: '"Nunito", sans-serif',
            lineHeight: 1,
          }}>
            {value}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default ExercitoBanner;
