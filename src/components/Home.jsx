import React, { useMemo, useState } from 'react';
import { Alert, Box, Snackbar } from '@mui/material';
import { getProfile, clearProfile, getTermoAceito } from '../utils/storage.js';
import { useTorneioTimer } from '../hooks/useTorneioTimer.js';
import { useToast } from '../hooks/useToast.js';
import TermosDialog from './ProfileLogin/TermosDialog.jsx';
import ProfileForm from './ProfileLogin/ProfileForm.jsx';
import AlertaModal from './shared/AlertaModal.jsx';
import { C } from '../theme.js';

// ─────────────────────────────────────────────────────
// DADOS
// ─────────────────────────────────────────────────────
const FERRAMENTAS = [
  { id: 'torneios',  icon: '🏆', title: 'Torneios'    },
  { id: 'tropas',    icon: '⚔️',  title: 'Tropas'      },
  { id: 'dragoes',   icon: '🐉',  title: 'Dragões'     },
  { id: 'edificios', icon: '🏗️',  title: 'Construções' },
  { id: 'itens',     icon: '🎒',  title: 'Itens'       },
  { id: 'niveis',    icon: '🏰',  title: 'Níveis'      },
  { id: 'ilhas',     icon: '🏝️',  title: 'Cidade'      },
  { id: 'backup',    icon: '📜',  title: 'Nuvem'       },
  { id: 'sobre',     icon: 'ℹ️',  title: 'Info'        },
];

// ─────────────────────────────────────────────────────
// ORNAMENTO — divisor com losangos
// ─────────────────────────────────────────────────────
const ParchmentDivider = ({ label, opacity = 1 }) => (
  <Box sx={{
    display: 'flex', alignItems: 'center', gap: 1.2, opacity,
    my: label ? 0 : 0.5,
  }}>
    <Box sx={{ flex: 1, height: '1px', background: `linear-gradient(90deg, transparent, ${C.BORDER})` }} />
    {label ? (
      <Box sx={{
        display: 'flex', alignItems: 'center', gap: 0.8,
      }}>
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
    ) : (
      <Box component="span" sx={{ color: C.BORDER, fontSize: '0.75rem' }}>◆</Box>
    )}
    <Box sx={{ flex: 1, height: '1px', background: `linear-gradient(270deg, transparent, ${C.BORDER})` }} />
  </Box>
);

// ─────────────────────────────────────────────────────
// HOME
// ─────────────────────────────────────────────────────
const Home = ({ setRoute }) => {
  const [profile,     setProfile]     = useState(() => getProfile());
  const [termoAceito, setTermoAceito] = useState(() => getTermoAceito());
  const [alertaModal, setAlertaModal] = useState({ open: false, msg: '' });
  const { toast, closeToast }         = useToast();

  const offset = useMemo(() => {
    if (!profile?.fuso) return 0;
    const m = profile.fuso.match(/UTC([+-]?\d+)/);
    return m ? parseInt(m[1], 10) : 0;
  }, [profile]);

  const { horaLocal, countdown, isAtivo, isUrgente, faseTexto } = useTorneioTimer(offset);

  const userId = useMemo(() => {
    if (!profile) return '00000';
    let hash = 0;
    for (let i = 0; i < profile.nome.length; i++) {
      hash = profile.nome.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash).toString().substring(0, 5).padEnd(5, '0');
  }, [profile]);

  // ── Onboarding ──
  if (!profile) {
    return (
      <>
        <TermosDialog open={!termoAceito} onAceitar={() => setTermoAceito(true)} />
        {termoAceito && <ProfileForm onSave={(p) => setProfile(p)} />}
      </>
    );
  }

  // ─────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────
  return (
    <Box sx={{
      minHeight: '100vh',
      bgcolor: C.BG_MAIN,
      // Vinheta de pergaminho nas bordas
      backgroundImage: `
        radial-gradient(ellipse 80% 30% at 50% 0%,   rgba(168,132,74,0.12) 0%, transparent 60%),
        radial-gradient(ellipse 40% 40% at 0%   50%,  rgba(168,132,74,0.06) 0%, transparent 60%),
        radial-gradient(ellipse 40% 40% at 100% 50%,  rgba(168,132,74,0.06) 0%, transparent 60%),
        radial-gradient(ellipse 60% 25% at 50% 100%,  rgba(140,104,48,0.10) 0%, transparent 60%)
      `,
      pb: 5,
      position: 'relative',
    }}>

      {/* Textura de papel */}
      <Box sx={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.055'/%3E%3C/svg%3E")`,
        backgroundSize: '256px', opacity: 0.9,
      }} />

      {/* Notificações */}
      <Snackbar
        open={toast.open} autoHideDuration={5000} onClose={closeToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={toast.severity} variant="filled" sx={{ fontWeight: 700, fontFamily: '"Nunito", sans-serif', fontSize: '0.95rem' }}>
          {toast.message}
        </Alert>
      </Snackbar>
      <AlertaModal open={alertaModal.open} message={alertaModal.msg} onClose={() => setAlertaModal({ open: false, msg: '' })} />

      {/* ── CORPO ── */}
      <Box sx={{ maxWidth: 430, mx: 'auto', px: 2, pt: 2.5, position: 'relative', zIndex: 1 }}>

        {/* ══════════════════════════════════════════
            BLOCO 2 — PERFIL DO COMANDANTE
        ══════════════════════════════════════════ */}
        <Box sx={{
          display: 'flex', alignItems: 'center', gap: 1.8,
          px: 2, py: 1.6, mb: 2.5,
          border: `1.5px solid ${C.BORDER}`,
          borderRadius: '10px',
          background: `linear-gradient(135deg, ${C.BG_CARD} 0%, ${C.BG_CARD_TOP} 100%)`,
          boxShadow: '0 2px 12px rgba(62,47,28,0.12)',
          animation: 'reveal-up 0.5s 0.12s ease both',
          position: 'relative',
          overflow: 'hidden',
          // Marca d'água decorativa
          '&::after': {
            content: '""', position: 'absolute',
            right: 12, top: '50%', transform: 'translateY(-50%)',
            width: 60, height: 60,
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='0.9em' font-size='80' opacity='0.04'%3E🎖️%3C/text%3E%3C/svg%3E")`,
            backgroundSize: 'contain', backgroundRepeat: 'no-repeat',
            pointerEvents: 'none',
          },
        }}>

          {/* Avatar */}
          <Box sx={{
            width: 50, height: 50, flexShrink: 0,
            border: `1.5px solid ${C.BORDER}`,
            borderRadius: '8px',
            bgcolor: C.BG_SECONDARY,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.6rem',
            boxShadow: 'inset 0 1px 4px rgba(62,47,28,0.12)',
            position: 'relative',
          }}>
            🎖️
            <Box sx={{
              position: 'absolute', bottom: -3, right: -3,
              width: 9, height: 9, borderRadius: '50%',
              bgcolor: C.ENERGY,
              border: `1.5px solid ${C.BG_MAIN}`,
              animation: 'online-pulse 3s ease-in-out infinite',
            }} />
          </Box>

          {/* Info */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{
              fontFamily: '"Nunito", sans-serif', fontWeight: 700,
              fontSize: '0.75rem', letterSpacing: '1.8px', color: C.TEXT_MUTED, mb: 0.3,
            }}>
              PATENTE DO COMANDANTE
            </Box>
            <Box sx={{
              fontFamily: '"Nunito", sans-serif', fontWeight: 700,
              fontSize: '0.98rem', color: C.TEXT_PRIMARY, letterSpacing: '0.5px',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {profile.nome}
            </Box>
            <Box sx={{ display: 'flex', gap: 0.8, mt: 0.5, flexWrap: 'wrap' }}>
              {[`Reino: ${profile.reino}`, `ID: ${userId}`].map((tag) => (
                <Box key={tag} sx={{
                  fontFamily: '"Nunito", sans-serif',
                  fontWeight: 600, fontSize: '0.80rem',
                  px: 0.9, py: 0.2,
                  border: `1px solid ${C.BORDER_SOFT}`,
                  borderRadius: '4px',
                  color: C.TEXT_SECONDARY,
                  bgcolor: 'rgba(184,150,90,0.08)',
                }}>
                  {tag}
                </Box>
              ))}
            </Box>
          </Box>

          {/* Logout */}
          <Box
            onClick={() => { clearProfile(); setProfile(null); }}
            sx={{
              width: 32, height: 32, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: `1px solid ${C.BORDER_SOFT}`,
              borderRadius: '6px',
              color: C.TEXT_FAINT,
              cursor: 'pointer', fontSize: '0.9rem',
              transition: 'all 0.2s',
              '&:hover': {
                color: C.ERROR, borderColor: 'rgba(168,60,44,0.4)',
                bgcolor: 'rgba(168,60,44,0.08)',
              },
            }}
          >
            ⎋
          </Box>
        </Box>

        {/* ══════════════════════════════════════════
            RELÓGIO COMPACTO — após perfil
        ══════════════════════════════════════════ */}
        <Box sx={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          px: 1.8, py: 1,
          mb: 2,
          border: `1px solid ${C.BORDER_SOFT}`,
          borderRadius: '8px',
          background: `linear-gradient(135deg, ${C.BG_CARD} 0%, ${C.BG_CARD_TOP} 100%)`,
          boxShadow: '0 1px 6px rgba(62,47,28,0.08)',
          animation: 'reveal-up 0.5s 0.18s ease both',
          overflow: 'hidden',
          position: 'relative',
          // Borda superior fina decorativa
          '&::before': {
            content: '""', position: 'absolute',
            top: 0, left: '10%', right: '10%', height: '1px',
            background: `linear-gradient(90deg, transparent, ${C.BORDER_SOFT}, transparent)`,
          },
        }}>
          {/* LADO ESQUERDO — countdown compacto */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
            {/* Dot pulsante */}
            <Box sx={{
              width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
              bgcolor: isUrgente ? C.ERROR : C.ENERGY,
              animation: 'online-pulse 2.5s ease-in-out infinite',
            }} />
            <Box sx={{
              fontFamily: '"Nunito", sans-serif', fontWeight: 900,
              fontSize: 'clamp(1.15rem, 5.5vw, 1.45rem)',
              letterSpacing: '0.06em', lineHeight: 1,
              color: isUrgente ? C.ERROR : C.TEXT_PRIMARY,
              textShadow: isUrgente
                ? '0 1px 6px rgba(168,60,44,0.25)'
                : '0 1px 3px rgba(62,47,28,0.15)',
              animation: isUrgente
                ? 'urgent-pulse 0.9s ease-in-out infinite'
                : 'timer-breathe 6s ease-in-out infinite',
            }}>
              {countdown}
            </Box>
          </Box>

          {/* Separador central */}
          <Box sx={{
            width: '1px', alignSelf: 'stretch',
            background: `linear-gradient(180deg, transparent, ${C.BORDER_SOFT}, transparent)`,
            mx: 1,
          }} />

          {/* LADO DIREITO — encerramento */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.1 }}>
            <Box sx={{
              fontFamily: '"Nunito", sans-serif', fontWeight: 700,
              fontSize: '0.62rem', letterSpacing: '1.2px',
              color: C.TEXT_MUTED, textTransform: 'uppercase',
            }}>
              encerra hoje
            </Box>
            <Box sx={{
              display: 'flex', alignItems: 'center', gap: 0.5,
            }}>
              <Box sx={{
                fontFamily: '"Nunito", sans-serif', fontWeight: 900,
                fontSize: '0.88rem', letterSpacing: '0.5px',
                color: C.ACCENT_DEEP,
              }}>
                21:00
              </Box>
              <Box sx={{
                fontFamily: '"Nunito", sans-serif', fontWeight: 600,
                fontSize: '0.62rem', color: C.TEXT_FAINT,
                bgcolor: 'rgba(184,150,90,0.12)',
                border: `1px solid ${C.BORDER_SOFT}`,
                borderRadius: '3px',
                px: 0.5, py: 0.1,
              }}>
                UTC+0
              </Box>
            </Box>
          </Box>
        </Box>

        {/* ══════════════════════════════════════════
        ══════════════════════════════════════════ */}
        <Box sx={{ animation: 'reveal-up 0.5s 0.22s ease both' }}>

          <ParchmentDivider label="ARSENAL DO QUARTEL" />

          <Box sx={{ mt: 2, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {FERRAMENTAS.map((tool, i) => (
              <Box
                key={tool.id}
                onClick={() => setRoute(tool.id)}
                sx={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  pt: 1.8, pb: 1.4, px: 0.5,
                  border: `1.5px solid ${C.BORDER_SOFT}`,
                  borderBottom: `2px solid ${C.BORDER}`,
                  borderRadius: '10px',
                  background: `linear-gradient(180deg, ${C.BG_CARD} 0%, ${C.BG_CARD_TOP} 100%)`,
                  cursor: 'pointer', position: 'relative', overflow: 'hidden',
                  animation: `tool-in 0.35s ${0.24 + i * 0.045}s ease both`,
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 8px rgba(62,47,28,0.1)',

                  // Linha de brilho no topo
                  '&::before': {
                    content: '""', position: 'absolute',
                    top: 0, left: '15%', right: '15%', height: '1px',
                    background: `linear-gradient(90deg, transparent, rgba(255,248,230,0.7), transparent)`,
                  },

                  '&:hover': {
                    border: `1.5px solid ${C.BORDER}`,
                    borderBottom: `2px solid ${C.ACCENT}`,
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 16px rgba(62,47,28,0.18)',
                    background: `linear-gradient(180deg, #FAF3E0 0%, ${C.BG_CARD} 100%)`,
                  },
                  '&:active': { transform: 'scale(0.97)', transition: 'transform 0.1s' },
                }}
              >
                {/* Ícone */}
                <Box sx={{ fontSize: '1.9rem', lineHeight: 1, mb: 0.7, filter: 'drop-shadow(0 1px 3px rgba(62,47,28,0.2))' }}>
                  {tool.icon}
                </Box>
                {/* Label */}
                <Box sx={{
                  fontFamily: '"Nunito", sans-serif', fontWeight: 700,
                  fontSize: '0.80rem', letterSpacing: '0.2px',
                  color: C.TEXT_SECONDARY, textAlign: 'center', lineHeight: 1.3,
                }}>
                  {tool.title}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

      </Box>
    </Box>
  );
};

export default Home;
