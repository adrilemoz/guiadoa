import { createTheme } from '@mui/material';

// ─────────────────────────────────────────────────────────────────────────────
// PALETA PERGAMINHO — Guia DOA · Tema Fantasia Medieval
// ─────────────────────────────────────────────────────────────────────────────
export const C = {
  // ── Fundos (do mais claro ao mais escuro) ────────────────────────────────
  BG_MAIN:        '#E8D8B5',   // pergaminho base (fundo da página)
  BG_SECONDARY:   '#E1CFA3',   // fundo alternativo ligeiramente mais escuro
  BG_CARD:        '#F2E6C9',   // superfície dos cards / painéis
  BG_CARD_TOP:    '#EDD9B0',   // gradiente superior dos cards
  BG_INPUT:       '#FAF3E0',   // campos de entrada (mais claros)
  BG_HEADER:      '#D6C28E',   // header e rodapé

  // ── Bordas ────────────────────────────────────────────────────────────────
  BORDER:         '#C8A96B',   // borda padrão
  BORDER_STRONG:  '#A8844A',   // borda de destaque / acento
  BORDER_SOFT:    '#DDD0A8',   // separadores sutis
  BORDER_ACTIVE:  '#8C6830',   // borda de item activo/focado

  // ── Texto ─────────────────────────────────────────────────────────────────
  TEXT_PRIMARY:   '#3E2F1C',   // texto principal (castanho escuro)
  TEXT_SECONDARY: '#6E5A3C',   // texto secundário
  TEXT_MUTED:     '#9A7D56',   // labels e micro-texto
  TEXT_FAINT:     '#B8A07A',   // placeholders, dicas

  // ── Acento dourado / castanho ─────────────────────────────────────────────
  ACCENT:         '#B8965A',   // dourado-castanho primário
  ACCENT_HOVER:   '#A8844A',   // hover
  ACCENT_DEEP:    '#8C6830',   // estados activos, bordas de foco

  // ── Status (suaves, não neon) ─────────────────────────────────────────────
  HEALTH:         '#C85C5C',   // vida / HP
  DEFENSE:        '#5C7FA3',   // defesa
  ATTACK:         '#D08A3C',   // ataque
  ENERGY:         '#6FA36B',   // energia / velocidade

  // ── Poder (roxo queimado) ─────────────────────────────────────────────────
  POWER:          '#8B6BAE',

  // ── Feedback ─────────────────────────────────────────────────────────────
  SUCCESS:        '#5A8A5C',
  ERROR:          '#A83C2C',
  WARNING:        '#C87A2C',

  // ── Aliases legado GOLD_ (compatibilidade com componentes antigos) ────────
  GOLD_MAIN:      '#B8965A',   // = ACCENT
  GOLD_ACCENT:    '#A8844A',   // = ACCENT_HOVER
  GOLD_BORDER:    '#C8A96B',   // = BORDER
  GOLD_BORDER_HI: '#A8844A',   // = BORDER_STRONG
  GOLD_BORDER_LO: '#DDD0A8',   // = BORDER_SOFT
  GOLD_BRIGHT:    '#3E2F1C',   // = TEXT_PRIMARY
  GOLD_DIM:       '#9A7D56',   // = TEXT_MUTED
  GOLD_SUBTITLE:  '#6E5A3C',   // = TEXT_SECONDARY
};

// ─────────────────────────────────────────────────────────────────────────────
// TEMA MUI — Pergaminho
// ─────────────────────────────────────────────────────────────────────────────
export const gameTheme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: C.BG_MAIN,
      paper:   C.BG_CARD,
    },
    primary: {
      main:         C.ACCENT,
      contrastText: '#FFF8EE',
    },
    secondary: {
      main:         C.BORDER_STRONG,
      contrastText: C.TEXT_PRIMARY,
    },
    success: { main: C.SUCCESS,  contrastText: '#fff' },
    info:    { main: C.DEFENSE,  contrastText: '#fff' },
    error:   { main: C.ERROR,    contrastText: '#fff' },
    warning: { main: C.WARNING,  contrastText: '#fff' },
    text: {
      primary:   C.TEXT_PRIMARY,
      secondary: C.TEXT_SECONDARY,
      disabled:  C.TEXT_FAINT,
    },
    divider: C.BORDER_SOFT,
  },

  typography: {
    fontFamily: '"Nunito", "Segoe UI", sans-serif',
  },

  shape: {
    borderRadius: 8,
  },

  components: {
    // ── CssBaseline ───────────────────────────────────────────────────────
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: C.BG_MAIN,
          backgroundImage: `
            url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.06'/%3E%3C/svg%3E")
          `,
          backgroundSize: '256px',
        },
      },
    },

    // ── Button ────────────────────────────────────────────────────────────
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: '"Nunito", sans-serif',
          fontWeight: 700,
          textTransform: 'none',
          letterSpacing: '0.5px',
          borderRadius: '6px',
          boxShadow: '0 2px 6px rgba(62,47,28,0.18), inset 0 1px 0 rgba(255,248,238,0.4)',
          transition: 'all 0.2s ease',
        },
        containedPrimary: {
          background: `linear-gradient(180deg, ${C.ACCENT} 0%, ${C.ACCENT_HOVER} 100%)`,
          color: '#FFF8EE',
          border: `1px solid ${C.BORDER_STRONG}`,
          '&:hover': {
            background: `linear-gradient(180deg, ${C.ACCENT_HOVER} 0%, ${C.ACCENT_DEEP} 100%)`,
            boxShadow: '0 3px 10px rgba(62,47,28,0.28)',
          },
          '&:active': { transform: 'translateY(1px)', boxShadow: '0 1px 3px rgba(62,47,28,0.2)' },
        },
        containedError: {
          background: `linear-gradient(180deg, #C85050 0%, ${C.ERROR} 100%)`,
          color: '#FFF8EE',
          border: `1px solid #8A2C1C`,
          '&:hover': { background: `linear-gradient(180deg, ${C.ERROR} 0%, #8A2C1C 100%)` },
        },
        containedInfo: {
          background: `linear-gradient(180deg, #7A9FBE 0%, ${C.DEFENSE} 100%)`,
          color: '#FFF8EE',
          border: `1px solid #3E6080`,
          '&:hover': { background: `linear-gradient(180deg, ${C.DEFENSE} 0%, #3E6080 100%)` },
        },
        containedSuccess: {
          background: `linear-gradient(180deg, #78AA7A 0%, ${C.SUCCESS} 100%)`,
          color: '#FFF8EE',
          border: `1px solid #3A6A3C`,
          '&:hover': { background: `linear-gradient(180deg, ${C.SUCCESS} 0%, #3A6A3C 100%)` },
        },
        outlined: {
          border: `1.5px solid ${C.BORDER}`,
          color: C.TEXT_PRIMARY,
          backgroundColor: 'rgba(242,230,201,0.6)',
          '&:hover': {
            border: `1.5px solid ${C.ACCENT}`,
            backgroundColor: 'rgba(184,150,90,0.12)',
          },
        },
        text: {
          color: C.TEXT_SECONDARY,
          '&:hover': { backgroundColor: 'rgba(184,150,90,0.1)' },
        },
      },
    },

    // ── Card ──────────────────────────────────────────────────────────────
    MuiCard: {
      styleOverrides: {
        root: {
          border: `1px solid ${C.BORDER}`,
          borderRadius: '10px',
          background: `linear-gradient(180deg, ${C.BG_CARD_TOP} 0%, ${C.BG_CARD} 100%)`,
          boxShadow: '0 2px 12px rgba(62,47,28,0.15), inset 0 1px 0 rgba(255,248,238,0.5)',
          backgroundImage: 'none',
        },
      },
    },

    // ── Paper ─────────────────────────────────────────────────────────────
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: C.BG_CARD,
          border: `1px solid ${C.BORDER_SOFT}`,
        },
      },
    },

    // ── AppBar ────────────────────────────────────────────────────────────
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: C.BG_HEADER,
          backgroundImage: 'none',
          color: C.TEXT_PRIMARY,
          boxShadow: '0 2px 8px rgba(62,47,28,0.2)',
          borderBottom: `2px solid ${C.BORDER_STRONG}`,
        },
      },
    },

    // ── TextField ─────────────────────────────────────────────────────────
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-input': {
            color: C.TEXT_PRIMARY,
            fontFamily: '"Nunito", sans-serif',
          },
          '& .MuiInputBase-input::placeholder': {
            color: C.TEXT_FAINT,
          },
        },
      },
    },

    // ── OutlinedInput ─────────────────────────────────────────────────────
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: C.BG_INPUT,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: C.BORDER,
            borderWidth: '1.5px',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: C.ACCENT,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: C.ACCENT_DEEP,
            borderWidth: '2px',
          },
          borderRadius: '8px',
          boxShadow: 'inset 0 1px 4px rgba(62,47,28,0.08)',
        },
      },
    },

    // ── InputLabel ────────────────────────────────────────────────────────
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: C.TEXT_MUTED,
          fontFamily: '"Nunito", sans-serif',
          fontSize: '0.86rem',
          '&.Mui-focused': { color: C.ACCENT_DEEP },
        },
      },
    },

    // ── TableCell ─────────────────────────────────────────────────────────
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: C.BORDER_SOFT,
          color: C.TEXT_PRIMARY,
          fontFamily: '"Nunito", sans-serif',
          fontSize: '0.95rem',
        },
        head: {
          backgroundColor: C.BG_SECONDARY,
          color: C.TEXT_PRIMARY,
          fontFamily: '"Nunito", sans-serif',
          fontWeight: 700,
          fontSize: '0.80rem',
          letterSpacing: '0.5px',
        },
      },
    },

    // ── TableContainer ────────────────────────────────────────────────────
    MuiTableContainer: {
      styleOverrides: {
        root: {
          backgroundColor: C.BG_CARD,
          border: `1px solid ${C.BORDER_SOFT}`,
          borderRadius: '8px',
        },
      },
    },

    // ── Chip ──────────────────────────────────────────────────────────────
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: C.BG_SECONDARY,
          color: C.TEXT_SECONDARY,
          border: `1px solid ${C.BORDER}`,
          fontFamily: '"Nunito", sans-serif',
          fontSize: '0.78rem',
          fontWeight: 700,
        },
        filled: {
          backgroundColor: C.BG_SECONDARY,
        },
      },
    },

    // ── MenuItem ──────────────────────────────────────────────────────────
    MuiMenuItem: {
      styleOverrides: {
        root: {
          backgroundColor: C.BG_CARD,
          color: C.TEXT_PRIMARY,
          fontFamily: '"Nunito", sans-serif',
          '&:hover': { backgroundColor: C.BG_SECONDARY },
          '&.Mui-selected': {
            backgroundColor: `rgba(184,150,90,0.2)`,
            color: C.TEXT_PRIMARY,
            '&:hover': { backgroundColor: `rgba(184,150,90,0.3)` },
          },
        },
      },
    },

    // ── Dialog ────────────────────────────────────────────────────────────
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: C.BG_CARD,
          border: `2px solid ${C.BORDER}`,
          backgroundImage: 'none',
          boxShadow: '0 8px 32px rgba(62,47,28,0.3)',
        },
      },
    },

    // ── DialogTitle ───────────────────────────────────────────────────────
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          color: C.TEXT_PRIMARY,
          fontFamily: '"Nunito", sans-serif',
          fontWeight: 700,
          borderBottom: `1px solid ${C.BORDER}`,
          backgroundColor: C.BG_SECONDARY,
        },
      },
    },

    // ── Divider ───────────────────────────────────────────────────────────
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: C.BORDER_SOFT },
      },
    },

    // ── Select ────────────────────────────────────────────────────────────
    MuiSelect: {
      styleOverrides: {
        icon: { color: C.TEXT_MUTED },
      },
    },

    // ── Snackbar / Alert ──────────────────────────────────────────────────
    MuiAlert: {
      styleOverrides: {
        root: {
          fontFamily: '"Nunito", sans-serif',
          fontSize: '0.95rem',
          border: `1px solid`,
        },
        filledSuccess: {
          backgroundColor: C.SUCCESS,
          borderColor: '#3A6A3C',
        },
        filledError: {
          backgroundColor: C.ERROR,
          borderColor: '#6A1C0C',
        },
        filledWarning: {
          backgroundColor: C.WARNING,
          borderColor: '#8A5010',
        },
      },
    },

    // ── Container ─────────────────────────────────────────────────────────
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: '12px',
          paddingRight: '12px',
        },
      },
    },
  },
});
