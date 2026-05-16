import React, { useState, useEffect, Component } from 'react';
import { C } from './theme.js';

import Home                    from './components/Home.jsx';
import Torneios                from './components/Torneios.jsx';
import Tropas                  from './components/Tropas.jsx';
import CalculosTropas          from './components/CalculosTropas.jsx';
import Edificios               from './components/Edificios.jsx';
import Itens                   from './components/Itens.jsx';
import Niveis                  from './components/Niveis.jsx';
import Ilhas                   from './components/Ilhas.jsx';
import Sobre                   from './components/Sobre.jsx';
import Backup                  from './components/Backup.jsx';
import AprimoramentoTropas     from './components/AprimoramentoTropas.jsx';
import EvolucaoTropas          from './components/torneios/EvolucaoTropas.jsx';
import PontosTalisma           from './components/torneios/PontosTalisma.jsx';
import TorneioPoder            from './components/torneios/TorneioPoder.jsx';
import TorneioAlianca          from './components/torneios/TorneioAlianca.jsx';
import TorneioMatarTropas      from './components/torneios/TorneioMatarTropas.jsx';
import TorneioTreinoTropa      from './components/torneios/TorneioTreinoTropa.jsx';
import TorneioHabilidadeDragao from './components/torneios/TorneioHabilidadeDragao.jsx';
import TorneioGeneral          from './components/torneios/TorneioGeneral.jsx';
import TorneioAprimoramentoTropa from './components/torneios/TorneioAprimoramentoTropa.jsx';
import TorneioConhecimento     from './components/torneios/TorneioConhecimento.jsx';
import TreinamentoDoDragao     from './components/torneios/TreinamentoDoDragao.jsx';
import Dragoes                 from './components/dragoes/Dragoes.jsx';
import DragaoDetalhe           from './components/dragoes/DragaoDetalhe.jsx';
import DragaoTracker           from './components/dragoes/DragaoTracker.jsx';
import Modal                   from './ui/Modal.jsx';
import { dbDragoes }           from './data/dragoes.js';

// ─────────────────────────────────────────────────────────────────────────────
// ORNAMENT STRIPE
// ─────────────────────────────────────────────────────────────────────────────
export const OrnamentStripe = ({ opacity = 1 }) => (
  <div style={{
    height: 1, width: '100%', opacity,
    background: `linear-gradient(90deg, transparent 0%, ${C.BORDER_SOFT} 5%, ${C.BORDER} 20%, ${C.ACCENT} 40%, ${C.BORDER_STRONG} 50%, ${C.ACCENT} 60%, ${C.BORDER} 80%, ${C.BORDER_SOFT} 95%, transparent 100%)`,
  }} />
);

// ─────────────────────────────────────────────────────────────────────────────
// ERROR BOUNDARY
// ─────────────────────────────────────────────────────────────────────────────
class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error, info) { console.error('Falha no módulo:', error, info); }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center mt-12 px-4 max-w-xs mx-auto">
          <div className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center text-4xl bg-aoe-card border-2 border-aoe-gold2"
            style={{ boxShadow: '0 4px 16px rgba(62,47,28,0.15)' }}>
            ⚠️
          </div>
          <p className="font-cinzel font-bold text-base tracking-wide text-aoe-red mb-1 m-0">
            Módulo Inacessível
          </p>
          <p className="font-nunito text-sm text-aoe-mid leading-relaxed mb-4 m-0">
            Ocorreu uma falha ao carregar esta secção.
          </p>
          <button
            className="btn-navy btn-lg"
            onClick={() => { this.setState({ hasError: false }); this.props.onReset(); }}
          >
            ← Voltar ao Quartel
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ROUTE LABELS
// ─────────────────────────────────────────────────────────────────────────────
const BASE_LABELS = {
  torneios:             { label: 'Torneios',               icon: '🏆' },
  tropas:               { label: 'Tropas',                  icon: '⚔️' },
  calculostropas:       { label: 'Cálculo de Tropas',       icon: '🧮' },
  edificios:            { label: 'Edifícios',               icon: '🏰' },
  itens:                { label: 'Itens',                   icon: '🎒' },
  niveis:               { label: 'Níveis',                  icon: '📈' },
  ilhas:                { label: 'Ilhas',                   icon: '🏝️' },
  sobre:                { label: 'Sobre',                   icon: 'ℹ️' },
  backup:               { label: 'Backup',                  icon: '💾' },
  evolucao_tropas:      { label: 'Evolução de Tropas',      icon: '⬆️' },
  talisma:              { label: 'Pontos Talismã',          icon: '🔮' },
  poder:                { label: 'Torneio de Poder',        icon: '⚡' },
  alianca:              { label: 'Aliança',                 icon: '🤝' },
  matar_tropas:         { label: 'Matar Tropas',            icon: '💀' },
  treino_tropa:         { label: 'Treino de Tropa',         icon: '🎯' },
  habilidade_dragao:    { label: 'Habilidade do Dragão',    icon: '🐉' },
  torneio_general:      { label: 'General',                 icon: '🎖️' },
  aprimoramento_tropa:  { label: 'Aprimoramento de Tropa',  icon: '🔧' },
  aprimoramento_tropas: { label: 'Aprimoramento de Tropas', icon: '⚗️' },
  conhecimento:         { label: 'Conhecimento',            icon: '📚' },
  treinamento_dragao:   { label: 'Treinamento do Dragão',   icon: '🔥' },
  dragoes:              { label: 'Dragões',                  icon: '🐉' },
};

// ─────────────────────────────────────────────────────────────────────────────
// APP
// ─────────────────────────────────────────────────────────────────────────────
const App = () => {
  const [route, setRoute] = useState('home');
  const [exitDialogOpen, setExitDialogOpen] = useState(false);

  useEffect(() => {
    window.__setRoute = setRoute;
    return () => { delete window.__setRoute; };
  }, [setRoute]);

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
      case 'evolucao_tropas':    return <EvolucaoTropas />;
      case 'talisma':            return <PontosTalisma />;
      case 'poder':              return <TorneioPoder />;
      case 'alianca':            return <TorneioAlianca />;
      case 'matar_tropas':       return <TorneioMatarTropas />;
      case 'treino_tropa':       return <TorneioTreinoTropa />;
      case 'habilidade_dragao':  return <TorneioHabilidadeDragao />;
      case 'torneio_general':    return <TorneioGeneral />;
      case 'aprimoramento_tropa': return <TorneioAprimoramentoTropa />;
      case 'aprimoramento_tropas': return <AprimoramentoTropas setRoute={setRoute} />;
      case 'conhecimento':       return <TorneioConhecimento />;
      case 'treinamento_dragao': return <TreinamentoDoDragao />;
      case 'dragoes':            return <Dragoes setRoute={setRoute} />;
      default: {
        if (route.startsWith('dragao_tracker_')) {
          return <DragaoTracker dragaoId={route.replace('dragao_tracker_', '')} />;
        }
        if (route.startsWith('dragao_')) {
          return <DragaoDetalhe dragaoId={route.replace('dragao_', '')} />;
        }
        return <Home setRoute={setRoute} />;
      }
    }
  };

  const handleGoHome = () => {
    if (window.temAlteracoesNaoSalvas) setExitDialogOpen(true);
    else setRoute('home');
  };

  // Build route labels including dynamic dragon routes
  const ROUTE_LABELS = { ...BASE_LABELS };
  if (route.startsWith('dragao_tracker_')) {
    const id = route.replace('dragao_tracker_', '');
    const d = dbDragoes.find(x => x.id === id);
    if (d) ROUTE_LABELS[route] = { label: `${d.nome} — Progresso`, icon: '📊' };
  } else if (route.startsWith('dragao_')) {
    const id = route.replace('dragao_', '');
    const d = dbDragoes.find(x => x.id === id);
    if (d) ROUTE_LABELS[route] = { label: d.nome, icon: d.emojiDragao };
  }

  const currentRoute = ROUTE_LABELS[route];

  return (
    <>
      {/* ── EXIT DIALOG ──────────────────────────────────────────────────── */}
      <Modal open={exitDialogOpen} onClose={() => setExitDialogOpen(false)} maxWidth={320}>
        <div className="p-4 text-center">
          <p className="font-cinzel font-bold text-base tracking-wide text-aoe-dark mb-2 m-0">
            ⚠️ Aviso de Saída
          </p>
          <p className="font-nunito text-sm text-aoe-mid leading-relaxed mb-4 m-0">
            A tabela possui alterações não salvas.<br />
            Deseja sair e perder o progresso?
          </p>
          <div className="flex gap-2 justify-center">
            <button className="btn-ghost" onClick={() => setExitDialogOpen(false)}>Ficar</button>
            <button className="btn-danger" onClick={() => { setExitDialogOpen(false); window.temAlteracoesNaoSalvas = false; setRoute('home'); }}>
              Sair sem Salvar
            </button>
          </div>
        </div>
      </Modal>

      {/* ── APPBAR ───────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40" style={{ backgroundColor: C.BG_HEADER, boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
        <OrnamentStripe />
        <div className="flex items-center justify-between px-3 gap-2" style={{ minHeight: 48 }}>

          {/* LOGO + breadcrumb */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <button
              onClick={handleGoHome}
              className="flex items-center gap-1.5 shrink-0 bg-transparent border-none cursor-pointer p-0"
            >
              <span className="text-xl" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))' }}>🛡️</span>
              <span className="font-cinzel font-bold text-xs tracking-widest" style={{ color: C.ACCENT, letterSpacing: '3px' }}>
                GUIA DOA
              </span>
            </button>

            {currentRoute && (
              <div className="flex items-center gap-1 min-w-0">
                <span className="text-aoe-gold4 text-xs opacity-60">›</span>
                <div
                  className="flex items-center gap-1 rounded-full px-2 py-0.5 min-w-0 overflow-hidden"
                  style={{ background: 'rgba(200,168,74,0.15)', border: '1px solid rgba(200,168,74,0.4)' }}
                >
                  <span className="text-[0.65rem] leading-none shrink-0">{currentRoute.icon}</span>
                  <span
                    className="font-nunito font-bold text-[0.68rem] whitespace-nowrap overflow-hidden text-ellipsis"
                    style={{ color: C.ACCENT }}
                  >
                    {currentRoute.label}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* BACK BUTTON */}
          {currentRoute && (
            <button
              onClick={handleGoHome}
              className="flex items-center gap-1 shrink-0 rounded-md px-2 py-1 transition-all"
              style={{
                border: '1px solid rgba(200,168,74,0.4)',
                background: 'rgba(242,230,201,0.15)',
                color: C.ACCENT,
              }}
            >
              <span className="text-xs">←</span>
              <span className="font-nunito font-bold text-xs" style={{ color: C.TEXT_HEADER }}>Voltar</span>
            </button>
          )}
        </div>
        <OrnamentStripe opacity={0.5} />
      </header>

      {/* ── BODY ─────────────────────────────────────────────────────────── */}
      <main className="max-w-2xl mx-auto px-2 py-3" style={{ minHeight: 'calc(100vh - 96px)' }}>
        <ErrorBoundary onReset={() => setRoute('home')}>
          {renderComponent()}
        </ErrorBoundary>
      </main>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer style={{ backgroundColor: C.BG_HEADER, borderTop: `2px solid ${C.BORDER_STRONG}` }}>
        <OrnamentStripe opacity={0.4} />
        <div className="py-2 text-center flex items-center justify-center gap-2 relative">
          <span style={{ color: C.ACCENT, fontSize: '0.7rem', opacity: 0.6 }}>◆</span>
          <span className="font-nunito text-[0.72rem] tracking-widest font-semibold" style={{ color: '#9A9080', letterSpacing: '2.5px' }}>
            GUIA DOA · BETA 1
          </span>
          <span style={{ color: C.ACCENT, fontSize: '0.7rem', opacity: 0.6 }}>◆</span>

          {/* Engrenagem — link para o Admin */}
          <a
            href={`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/admin`}
            target="_blank"
            rel="noopener noreferrer"
            title="Painel Admin"
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '26px',
              height: '26px',
              borderRadius: '6px',
              background: 'rgba(200,168,74,0.08)',
              border: '1px solid rgba(200,168,74,0.2)',
              fontSize: '0.85rem',
              textDecoration: 'none',
              opacity: 0.5,
              transition: 'opacity 0.2s, border-color 0.2s',
            }}
            onMouseOver={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.borderColor = 'rgba(200,168,74,0.5)'; }}
            onMouseOut={(e)  => { e.currentTarget.style.opacity = '0.5'; e.currentTarget.style.borderColor = 'rgba(200,168,74,0.2)'; }}
          >
            ⚙️
          </a>
        </div>
      </footer>
    </>
  );
};

export default App;
