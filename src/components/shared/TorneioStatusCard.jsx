import React from 'react';
import { Box, Card } from '@mui/material';
import GameHeader from './GameHeader.jsx';
import { C } from '../../theme.js';

const CARD_STYLES = `
  @keyframes gold-flicker-card {
    0%,90%,100% { opacity: 1; }
    93%,97%     { opacity: 0.82; }
  }
  @keyframes urgent-pulse-card {
    0%,100% { color: ${C.ERROR}; text-shadow: 0 0 20px rgba(220,60,30,0.7); }
    50%     { color: #ff7050;     text-shadow: 0 0 40px rgba(255,80,40,0.9); }
  }
`;

const GoldStripe = ({ opacity = 1 }) => (
  <Box sx={{
    height: '1px', width: '100%',
    background: `linear-gradient(90deg, transparent 0%, ${C.BORDER_SOFT} 8%, ${C.BORDER} 30%, ${C.ACCENT} 50%, ${C.BORDER} 70%, ${C.BORDER_SOFT} 92%, transparent 100%)`,
    opacity,
  }} />
);

/**
 * Card de status do torneio com cronômetro — estilo hero da Home.
 */
const TorneioStatusCard = ({ horaLocal, countdown, isUrgente, faseTexto, fuso, reino, compact = false }) => (
  <Card sx={{ mb: 3, p: 0, borderRadius: '8px', overflow: 'hidden', border: `1px solid ${C.BORDER}` }}>
    <style>{CARD_STYLES}</style>
    <GameHeader title="Status do Torneio" />

    {/* Corpo */}
    <Box sx={{
      bgcolor: C.BG_CARD,
      px: 2.5, pt: compact ? 1.5 : 2.5, pb: compact ? 1.5 : 2,
      textAlign: 'center',
      position: 'relative',
      '&::before': {
        content: '""', position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 70% 60% at 50% 50%, transparent 40%, rgba(62,47,28,0.08) 100%)',
        pointerEvents: 'none',
      },
    }}>
      {/* Countdown grande */}
      <Box sx={{
        fontFamily: '"Nunito", sans-serif', fontWeight: 900,
        fontSize: compact ? 'clamp(2rem, 12vw, 3rem)' : 'clamp(2.8rem, 15vw, 4.2rem)',
        letterSpacing: '0.05em', lineHeight: 1,
        color: isUrgente ? C.ERROR : C.TEXT_PRIMARY,
        textShadow: isUrgente
          ? '0 0 24px rgba(168,60,44,0.5), 0 2px 4px rgba(62,47,28,0.3)'
          : '0 0 24px rgba(184,150,90,0.4), 0 2px 4px rgba(62,47,28,0.2)',
        animation: isUrgente
          ? 'urgent-pulse-card 0.9s ease-in-out infinite'
          : 'gold-flicker-card 8s ease-in-out infinite',
        mb: 0.5,
      }}>
        {countdown}
      </Box>

      {/* Sublinha */}
      <Box sx={{ px: 4, mb: 1.2 }}>
        <GoldStripe opacity={0.45} />
      </Box>

      {/* Fase + fuso + hora — linha única */}
      <Box sx={{
        display: 'inline-flex', alignItems: 'center', gap: 0.6,
        px: 1.5, py: 0.5,
        border: `1px solid ${C.BORDER_SOFT}`,
        borderRadius: '3px',
        bgcolor: 'rgba(200,169,107,0.15)',
        maxWidth: '100%', overflow: 'hidden',
      }}>
        <Box component="span" sx={{
          fontFamily: '"Nunito", sans-serif', fontStyle: 'normal',
          fontWeight: 600,
          fontSize: '0.78rem', color: isUrgente ? C.ERROR : C.TEXT_MUTED,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {faseTexto.split('—')[1]?.trim() ?? faseTexto}
        </Box>
        <Box component="span" sx={{ color: C.BORDER_STRONG, fontSize: '0.80rem', flexShrink: 0 }}>·</Box>
        <Box component="span" sx={{
          fontFamily: '"Nunito", sans-serif', flexShrink: 0, fontWeight: 700,
          fontSize: '0.7rem', letterSpacing: '1px', color: C.TEXT_SECONDARY,
          whiteSpace: 'nowrap',
        }}>
          {fuso || reino || 'UTC'}
        </Box>
        <Box component="span" sx={{ color: C.BORDER_STRONG, fontSize: '0.80rem', flexShrink: 0 }}>·</Box>
        <Box component="span" sx={{
          fontFamily: '"Nunito", sans-serif', fontWeight: 500,
          fontSize: '0.75rem', color: C.TEXT_MUTED, letterSpacing: '1.5px',
          whiteSpace: 'nowrap', flexShrink: 0,
        }}>
          {horaLocal?.split(' às ')[1] ?? horaLocal}
        </Box>
      </Box>
    </Box>

    <GoldStripe opacity={0.25} />
  </Card>
);

export default TorneioStatusCard;
