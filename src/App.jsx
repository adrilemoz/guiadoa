import React, { useState, Component, forwardRef } from 'react';
import {
  ThemeProvider, CssBaseline, AppBar, Toolbar, Typography,
  Button, Container, Box,
  Dialog, DialogTitle, DialogContent,
  DialogContentText, DialogActions, Slide
} from '@mui/material';
import ShieldIcon from '@mui/icons-material/Shield';
import { gameTheme, C } from './theme.js';

import Home from './components/Home.jsx';
import Torneios from './components/Torneios.jsx';
import Tropas from './components/Tropas.jsx';
import CalculosTropas from './components/CalculosTropas.jsx';
import Edificios from './components/Edificios.jsx';
import Itens from './components/Itens.jsx';
import Niveis from './components/Niveis.jsx';
import Ilhas from './components/Ilhas.jsx';
import Sobre from './components/Sobre.jsx';
import Backup from './components/Backup.jsx';
import AprimoramentoTropas from './components/AprimoramentoTropas.jsx';
import EvolucaoTropas from './components/torneios/EvolucaoTropas.jsx';
import PontosTalisma from './components/torneios/PontosTalisma.jsx';
import TorneioPoder from './components/torneios/TorneioPoder.jsx';
import TorneioAlianca from './components/torneios/TorneioAlianca.jsx';
import TorneioMatarTropas from './components/torneios/TorneioMatarTropas.jsx';
import TorneioTreinoTropa from './components/torneios/TorneioTreinoTropa.jsx';
import TorneioHabilidadeDragao from './components/torneios/TorneioHabilidadeDragao.jsx';
import TorneioGeneral from './components/torneios/TorneioGeneral.jsx';
import TorneioAprimoramentoTropa from './components/torneios/TorneioAprimoramentoTropa.jsx';
import TorneioConhecimento from './components/torneios/TorneioConhecimento.jsx';
import TreinamentoDoDragao from './components/torneios/TreinamentoDoDragao.jsx';
import Dragoes from './components/dragoes/Dragoes.jsx';
import DragaoDetalhe from './components/dragoes/DragaoDetalhe.jsx';
import { dbDragoes } from './data/dragoes.js';

// ─────────────────────────────────────────────────────────────────────────────
// GLOBAL STYLES — fontes, animações e textura
// ─────────────────────────────────────────────────────────────────────────────
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,400;0,600;0,700;0,900;1,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  body {
    background-color: ${C.BG_MAIN};
    color: ${C.TEXT_PRIMARY};
    font-family: "Nunito", "Segoe UI", sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  /* Scrollbar suave */
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: ${C.BG_SECONDARY}; }
  ::-webkit-scrollbar-thumb { background: ${C.BORDER}; border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: ${C.ACCENT}; }

  @keyframes reveal-up {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fade-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes parchment-shimmer {
    0%, 100% { opacity: 0.7; }
    50%       { opacity: 1;   }
  }
  @keyframes urgent-pulse {
    0%, 100% { color: ${C.ERROR}; }
    50%      { color: #E06060; }
  }
  @keyframes timer-breathe {
    0%, 100% { opacity: 1;   transform: scale(1);    }
    50%      { opacity: 0.9; transform: scale(0.995); }
  }
  @keyframes tool-in {
    from { opacity: 0; transform: translateY(8px) scale(0.96); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes online-pulse {
    0%, 100% { opacity: 1; }
    50%      { opacity: 0.4; }
  }
`;

const SlideTransition = forwardRef(function SlideTransition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

// ─────────────────────────────────────────────────────────────────────────────
// ORNAMENTO — faixa decorativa de borda
// ─────────────────────────────────────────────────────────────────────────────
export const OrnamentStripe = ({ opacity = 1, thickness = '1px' }) => (
  <Box sx={{
    height: thickness, width: '100%',
    background: `linear-gradient(90deg,
      transparent 0%,
      ${C.BORDER_SOFT} 5%,
      ${C.BORDER} 20%,
      ${C.ACCENT} 40%,
      ${C.BORDER_STRONG} 50%,
      ${C.ACCENT} 60%,
      ${C.BORDER} 80%,
      ${C.BORDER_SOFT} 95%,
      transparent 100%)`,
    opacity,
  }} />
);

// ─────────────────────────────────────────────────────────────────────────────
// ERROR BOUNDARY
// ─────────────────────────────────────────────────────────────────────────────
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error, info) { console.error('Falha no módulo:', error, info); }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{
          textAlign: 'center', mt: 6, px: 3,
          maxWidth: 400, mx: 'auto',
        }}>
          <Box sx={{
            width: 80, height: 80, mx: 'auto', mb: 2,
            border: `2px solid ${C.BORDER_STRONG}`,
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2.5rem',
            bgcolor: C.BG_CARD,
            boxShadow: '0 4px 16px rgba(62,47,28,0.15)',
          }}>
            ⚠️
          </Box>
          <Typography sx={{
            color: C.ERROR, fontFamily: '"Nunito", sans-serif',
            fontWeight: 700, fontSize: '1.2rem', mb: 1,
            letterSpacing: '1px',
          }}>
            Módulo Inacessível
          </Typography>
          <Typography sx={{
            color: C.TEXT_SECONDARY, fontFamily: '"Nunito", sans-serif',
            fontSize: '1rem', mb: 3, lineHeight: 1.6,
          }}>
            Ocorreu uma falha ao carregar esta secção. O ficheiro pode estar em desenvolvimento.
          </Typography>
          <Button
            variant="contained" color="primary" size="large"
            onClick={() => { this.setState({ hasError: false }); this.props.onReset(); }}
            sx={{ fontWeight: 700, px: 4, py: 1.2, fontFamily: '"Nunito", sans-serif' }}
          >
            ← Voltar ao Quartel
          </Button>
        </Box>
      );
    }
    return this.props.children;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// APP ROOT
// ─────────────────────────────────────────────────────────────────────────────
const App = () => {
  const [route, setRoute] = useState('home');
  const [exitDialogOpen, setExitDialogOpen] = useState(false);

  const renderComponent = () => {
    switch (route) {
      case 'home':               return <Home setRoute={setRoute} />;
      case 'torneios':           return <Torneios setRoute={setRoute} />;
      case 'tropas':             return <Tropas setRoute={setRoute} />;
      case 'calculostropas':     return <CalculosTropas setRoute={setRoute} />;
      case 'edificios':          return <Edificios setRoute={setRoute} />;
      case 'itens':              return <Itens setRoute={setRoute} />;
      case 'niveis':             return <Niveis />;
      case 'ilhas':              return <Ilhas />;
      case 'sobre':              return <Sobre />;
      case 'backup':             return <Backup />;
      case 'evolucao_tropas':    return <EvolucaoTropas setRoute={setRoute} />;
      case 'talisma':            return <PontosTalisma setRoute={setRoute} />;
      case 'poder':              return <TorneioPoder setRoute={setRoute} />;
      case 'alianca':            return <TorneioAlianca setRoute={setRoute} />;
      case 'matar_tropas':       return <TorneioMatarTropas setRoute={setRoute} />;
      case 'treino_tropa':       return <TorneioTreinoTropa setRoute={setRoute} />;
      case 'habilidade_dragao':  return <TorneioHabilidadeDragao setRoute={setRoute} />;
      case 'torneio_general':    return <TorneioGeneral setRoute={setRoute} />;
      case 'aprimoramento_tropa':return <TorneioAprimoramentoTropa setRoute={setRoute} />;
      case 'aprimoramento_tropas':return <AprimoramentoTropas setRoute={setRoute} />;
      case 'conhecimento':       return <TorneioConhecimento setRoute={setRoute} />;
      case 'treinamento_dragao': return <TreinamentoDoDragao setRoute={setRoute} />;
      case 'dragoes':            return <Dragoes setRoute={setRoute} />;
      // Rotas dinâmicas de detalhe de dragão
      default: {
        if (route.startsWith('dragao_')) {
          const id = route.replace('dragao_', '');
          return <DragaoDetalhe dragaoId={id} />;
        }
        return <Home setRoute={setRoute} />;
      }
    }
  };

  const handleGoHome = () => {
    if (window.temAlteracoesNaoSalvas) setExitDialogOpen(true);
    else setRoute('home');
  };

  const confirmExit = () => {
    setExitDialogOpen(false);
    window.temAlteracoesNaoSalvas = false;
    setRoute('home');
  };

  // Mapa de rótulos humanizados por rota
  const ROUTE_LABELS = {
    torneios:            { label: 'Torneios',               icon: '🏆' },
    tropas:              { label: 'Tropas',                  icon: '⚔️' },
    calculostropas:      { label: 'Cálculo de Tropas',       icon: '🧮' },
    edificios:           { label: 'Edifícios',               icon: '🏰' },
    itens:               { label: 'Itens',                   icon: '🎒' },
    niveis:              { label: 'Níveis',                  icon: '📈' },
    ilhas:               { label: 'Ilhas',                   icon: '🏝️' },
    sobre:               { label: 'Sobre',                   icon: 'ℹ️' },
    backup:              { label: 'Backup',                  icon: '💾' },
    evolucao_tropas:     { label: 'Evolução de Tropas',      icon: '⬆️' },
    talisma:             { label: 'Pontos Talismã',          icon: '🔮' },
    poder:               { label: 'Torneio de Poder',        icon: '⚡' },
    alianca:             { label: 'Aliança',                 icon: '🤝' },
    matar_tropas:        { label: 'Matar Tropas',            icon: '💀' },
    treino_tropa:        { label: 'Treino de Tropa',         icon: '🎯' },
    habilidade_dragao:   { label: 'Habilidade do Dragão',    icon: '🐉' },
    torneio_general:     { label: 'General',                 icon: '🎖️' },
    aprimoramento_tropa: { label: 'Aprimoramento de Tropa',  icon: '🔧' },
    aprimoramento_tropas:{ label: 'Aprimoramento de Tropas', icon: '⚗️' },
    conhecimento:        { label: 'Conhecimento',            icon: '📚' },
    treinamento_dragao:  { label: 'Treinamento do Dragão',   icon: '🔥' },
    dragoes:             { label: 'Dragões',                  icon: '🐉' },
  };

  // Labels dinâmicos para detalhes de dragão
  if (route.startsWith('dragao_')) {
    const id = route.replace('dragao_', '');
    const dragao = dbDragoes.find(d => d.id === id);
    if (dragao) {
      ROUTE_LABELS[route] = { label: dragao.nome, icon: dragao.emojiDragao };
    }
  }

  const currentRoute = ROUTE_LABELS[route];

  return (
    <ThemeProvider theme={gameTheme}>
      <CssBaseline />
      <style>{GLOBAL_STYLES}</style>

      {/* ── POP-UP SAÍDA SEGURA ────────────────────────────────────────── */}
      <Dialog
        open={exitDialogOpen}
        onClose={() => setExitDialogOpen(false)}
        TransitionComponent={SlideTransition}
      >
        <DialogTitle sx={{ textAlign: 'center' }}>
          ⚠️ Aviso de Saída
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', pt: 2 }}>
          <DialogContentText sx={{
            color: C.TEXT_PRIMARY, fontFamily: '"Nunito", sans-serif',
            fontSize: '1.05rem', lineHeight: 1.7,
          }}>
            A tabela possui alterações não salvas.<br />
            Deseja sair e perder o progresso?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: 'center', gap: 2 }}>
          <Button onClick={() => setExitDialogOpen(false)} variant="outlined" size="medium">
            Ficar
          </Button>
          <Button onClick={confirmExit} variant="contained" color="error" size="medium">
            Sair sem Salvar
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── CABEÇALHO GLOBAL ─────────────────────────────────────────────── */}
      <AppBar position="sticky" elevation={0}>
        <OrnamentStripe />

        <Toolbar sx={{
          minHeight: '50px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          px: { xs: 1.5, sm: 2 },
          bgcolor: C.BG_HEADER,
          gap: 1,
        }}>

          {/* ── LADO ESQUERDO: logo + breadcrumb ─── */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, minWidth: 0, flex: 1 }}>

            {/* Logo clicável */}
            <Box
              onClick={handleGoHome}
              sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', flexShrink: 0 }}
            >
              <ShieldIcon sx={{
                fontSize: 26,
                color: C.ACCENT,
                filter: 'drop-shadow(0 1px 2px rgba(62,47,28,0.35))',
              }} />
              <Box sx={{
                fontFamily: '"Nunito", sans-serif',
                fontWeight: 900,
                fontSize: '0.88rem',
                letterSpacing: '3px',
                color: C.TEXT_PRIMARY,
                lineHeight: 1,
              }}>
                GUIA DOA
              </Box>
            </Box>

            {/* Breadcrumb — só aparece fora da home */}
            {currentRoute && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, minWidth: 0 }}>
                {/* Separador */}
                <Box sx={{
                  color: C.BORDER_STRONG, fontSize: '0.75rem', opacity: 0.5,
                  flexShrink: 0, lineHeight: 1,
                }}>›</Box>

                {/* Pill de seção atual */}
                <Box sx={{
                  display: 'flex', alignItems: 'center', gap: 0.5,
                  bgcolor: `rgba(184,150,90,0.15)`,
                  border: `1px solid ${C.BORDER}`,
                  borderRadius: '20px',
                  px: 1, py: '3px',
                  minWidth: 0, overflow: 'hidden',
                }}>
                  <Box sx={{ fontSize: '0.72rem', lineHeight: 1, flexShrink: 0 }}>
                    {currentRoute.icon}
                  </Box>
                  <Box sx={{
                    fontFamily: '"Nunito", sans-serif',
                    fontWeight: 700,
                    fontSize: '0.72rem',
                    color: C.ACCENT_DEEP,
                    letterSpacing: '0.3px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    lineHeight: 1,
                  }}>
                    {currentRoute.label}
                  </Box>
                </Box>
              </Box>
            )}
          </Box>

          {/* ── LADO DIREITO: botão voltar ─── */}
          {currentRoute && (
            <Box
              onClick={handleGoHome}
              sx={{
                display: 'flex', alignItems: 'center', gap: 0.4,
                cursor: 'pointer', flexShrink: 0,
                px: 1, py: '4px',
                borderRadius: '6px',
                border: `1px solid ${C.BORDER}`,
                bgcolor: 'rgba(242,230,201,0.6)',
                transition: 'all 0.15s',
                '&:hover': {
                  bgcolor: `rgba(184,150,90,0.18)`,
                  borderColor: C.ACCENT,
                },
                '&:active': { opacity: 0.75 },
              }}
            >
              <Box sx={{ fontSize: '0.78rem', lineHeight: 1, color: C.TEXT_SECONDARY }}>←</Box>
              <Box sx={{
                fontFamily: '"Nunito", sans-serif',
                fontWeight: 700,
                fontSize: '0.75rem',
                color: C.TEXT_SECONDARY,
                letterSpacing: '0.2px',
                lineHeight: 1,
              }}>
                Voltar
              </Box>
            </Box>
          )}
        </Toolbar>

        <OrnamentStripe opacity={0.6} />
      </AppBar>

      {/* ── CORPO ─────────────────────────────────────────────────────────── */}
      <Container sx={{ py: 2, px: { xs: 1, sm: 2 }, minHeight: 'calc(100vh - 110px)' }}>
        <ErrorBoundary onReset={() => setRoute('home')}>
          {renderComponent()}
        </ErrorBoundary>
      </Container>

      {/* ── RODAPÉ ────────────────────────────────────────────────────────── */}
      <Box sx={{
        bgcolor: C.BG_HEADER,
        borderTop: `2px solid ${C.BORDER_STRONG}`,
        position: 'relative',
      }}>
        <OrnamentStripe opacity={0.4} />
        <Box sx={{ p: 1.5, textAlign: 'center' }}>
          {/* Ornamento de canto (losangos decorativos) */}
          <Box sx={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5,
          }}>
            <Box component="span" sx={{ color: C.ACCENT, fontSize: '0.75rem', opacity: 0.6 }}>◆</Box>
            <Typography sx={{
              fontFamily: '"Nunito", sans-serif',
              fontSize: '0.80rem',
              letterSpacing: '2.5px',
              color: C.TEXT_MUTED,
              fontWeight: 600,
            }}>
              GUIA DOA · COMANDO TÁTICO
            </Typography>
            <Box component="span" sx={{ color: C.ACCENT, fontSize: '0.75rem', opacity: 0.6 }}>◆</Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;
