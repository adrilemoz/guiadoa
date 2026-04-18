import React from 'react';
import { Box, Button, Dialog, Typography } from '@mui/material';
import { C } from '../../theme.js';

/**
 * Modal de alerta urgente — estilo pergaminho medieval.
 */
const AlertaModal = ({ open, message, onClose }) => (
  <Dialog
    open={open}
    onClose={onClose}
    PaperProps={{
      sx: {
        bgcolor: '#FFF3D6',
        border: `2px solid ${C.BORDER_STRONG}`,
        borderTop: `4px solid ${C.WARNING}`,
        borderRadius: '10px',
        boxShadow: '0 12px 40px rgba(62,47,28,0.35)',
        overflow: 'hidden',
        maxWidth: 340,
      }
    }}
  >
    {/* Faixa ornamental */}
    <Box sx={{
      height: '2px',
      background: `linear-gradient(90deg, transparent, ${C.WARNING}, transparent)`,
    }} />

    <Box sx={{ p: 3, textAlign: 'center' }}>
      {/* Ícone */}
      <Box sx={{
        width: 64, height: 64, mx: 'auto', mb: 1.5,
        border: `2px solid ${C.WARNING}`,
        borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '2rem',
        bgcolor: 'rgba(200,122,44,0.1)',
        boxShadow: '0 2px 8px rgba(200,122,44,0.2)',
      }}>
        ⚠️
      </Box>

      <Typography sx={{
        color: C.TEXT_PRIMARY, fontFamily: '"Nunito", sans-serif',
        fontWeight: 700, fontSize: '1.1rem', mb: 1.5,
        letterSpacing: '0.5px',
      }}>
        Atenção, Comandante!
      </Typography>

      <Typography sx={{
        color: C.TEXT_SECONDARY, fontFamily: '"Nunito", sans-serif',
        fontWeight: 600, fontSize: '1rem', mb: 2.5, lineHeight: 1.6,
      }}>
        {message}
      </Typography>

      {/* Divisor */}
      <Box sx={{
        height: '1px', mb: 2,
        background: `linear-gradient(90deg, transparent, ${C.BORDER}, transparent)`,
      }} />

      <Button
        variant="contained"
        color="warning"
        size="large"
        onClick={onClose}
        sx={{
          fontFamily: '"Nunito", sans-serif',
          fontWeight: 700, fontSize: '0.85rem',
          letterSpacing: '1px', px: 4,
          background: `linear-gradient(180deg, ${C.WARNING} 0%, #A86020 100%)`,
          color: '#FFF8EE',
          border: `1px solid #8A4A10`,
        }}
      >
        ENTENDIDO
      </Button>
    </Box>
  </Dialog>
);

export default AlertaModal;
