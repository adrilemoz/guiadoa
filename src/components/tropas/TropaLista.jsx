import React, { useMemo, useState } from 'react';
import { C } from '../../theme.js';
import { useTropas } from '../../hooks/useTropas.js';
import { getIcone, getTipoAtaque, fmt, FILTROS } from './tropaUtils.js';
import TropaModal from './TropaModal.jsx';

/* ── Linha de tropa (sem campos de quantidade, sem expandir) ─────────────── */
const TropaRow = ({ tropa, onClick }) => {
  const tipo = getTipoAtaque(tropa);

  return (
    <button
      onClick={onClick}
      style={{
        width: '100%', textAlign: 'left', cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 12px',
        background: C.BG_CARD,
        border: `1.5px solid rgba(200,168,74,0.18)`,
        borderLeft: `3px solid ${tipo.color}`,
        borderRadius: 10,
        transition: 'transform 0.1s, box-shadow 0.1s',
        boxShadow: '0 1px 4px rgba(62,47,28,0.07)',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(2px)'; e.currentTarget.style.boxShadow = `0 3px 12px ${tipo.color}20`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 1px 4px rgba(62,47,28,0.07)'; }}
      onTouchStart={e => { e.currentTarget.style.transform = 'scale(0.98)'; }}
      onTouchEnd={e   => { e.currentTarget.style.transform = 'none'; }}
    >
      {/* Ícone */}
      <div style={{
        width: 38, height: 38, borderRadius: 9, flexShrink: 0,
        background: `${tipo.color}12`,
        border: `1.5px solid ${tipo.color}28`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.35rem',
      }}>
        {getIcone(tropa.nome)}
      </div>

      {/* Nome + tipo + stats resumo */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
          <span className="font-nunito font-bold"
            style={{
              fontSize: '0.82rem', color: C.TEXT_PRIMARY,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
            {tropa.nome}
          </span>
          <span className="font-nunito font-bold shrink-0"
            style={{
              fontSize: '0.58rem', padding: '1px 6px', borderRadius: 8,
              background: `${tipo.color}12`,
              border: `1px solid ${tipo.color}35`,
              color: tipo.color,
            }}>
            {tipo.label}
          </span>
        </div>

        {/* Stats compactos */}
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { icon: '❤️', val: fmt(tropa.vida) },
            { icon: '🛡️', val: fmt(tropa.def)  },
            { icon: tropa.atqDist > tropa.atqPerto ? '🏹' : '⚔️', val: fmt(Math.max(tropa.atqPerto, tropa.atqDist)) },
            { icon: '⚡', val: fmt(tropa.vel)  },
          ].map((s, i) => (
            <span key={i} className="font-nunito font-semibold"
              style={{ fontSize: '0.6rem', color: C.TEXT_MUTED, whiteSpace: 'nowrap' }}>
              {s.icon} {s.val}
            </span>
          ))}
        </div>
      </div>

      {/* Poder — destaque */}
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <p className="font-nunito font-black m-0 leading-none"
          style={{ fontSize: '1.15rem', color: '#7c3aed' }}>
          {tropa.poder}
        </p>
        <p className="font-nunito font-bold m-0"
          style={{ fontSize: '0.5rem', color: C.TEXT_FAINT, letterSpacing: '1.5px', marginTop: 2 }}>
          PODER
        </p>
      </div>

      {/* Seta */}
      <span style={{ color: C.TEXT_FAINT, fontSize: '0.9rem', flexShrink: 0 }}>›</span>
    </button>
  );
};

/* ── Tela de listagem ────────────────────────────────────────────────────── */
const TropaLista = () => {
  const { tropas, carregando } = useTropas();

  const [busca,       setBusca]       = useState('');
  const [filtroAtivo, setFiltroAtivo] = useState('Todas');
  const [tropaModal,  setTropaModal]  = useState(null);

  const tropasFiltradas = useMemo(() => {
    let base = [...tropas];
    if (filtroAtivo === 'Corpo a Corpo') base = base.filter(t => t.atqPerto >= t.atqDist && t.atqPerto > 0);
    if (filtroAtivo === 'Longo Alcance') base = base.filter(t => t.atqDist > t.atqPerto);
    if (filtroAtivo === 'Maior Vida')    base = base.filter(t => t.vida   >= 10_000);
    if (filtroAtivo === 'Maior Defesa')  base = base.filter(t => t.def    >= 800);
    if (filtroAtivo === 'Alta Carga')    base = base.filter(t => t.car    >= 500);
    if (filtroAtivo === 'Mais Rápidas')  base = base.filter(t => t.vel    >= 1_000);
    return base
      .filter(t => t.nome.toLowerCase().includes(busca.toLowerCase()))
      .sort((a, b) => a.nome.localeCompare(b.nome));
  }, [busca, filtroAtivo, tropas]);

  return (
    <>
      {/* Modal de detalhe */}
      {tropaModal && (
        <TropaModal tropa={tropaModal} onFechar={() => setTropaModal(null)} />
      )}

      <div style={{ maxWidth: 480, margin: '0 auto', paddingBottom: 16 }}>

        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg,#1C3A5E,#2A4C72)',
          borderRadius: '12px 12px 0 0',
          padding: '10px 14px 10px',
          marginBottom: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <p className="font-cinzel font-bold m-0"
              style={{ fontSize: '0.75rem', letterSpacing: '2.5px', color: '#F8F2E0' }}>
              📖 ENCICLOPÉDIA
            </p>
            <p className="font-nunito font-semibold m-0"
              style={{ fontSize: '0.6rem', color: 'rgba(200,168,74,0.65)', marginTop: 2 }}>
              {carregando ? '⟳ Sincronizando…' : `${tropasFiltradas.length} de ${tropas.length} unidades`}
            </p>
          </div>
        </div>

        <div style={{
          background: C.BG_SECONDARY,
          border: `1.5px solid ${C.BORDER}`, borderTop: 'none',
          borderRadius: '0 0 12px 12px',
          padding: '10px 10px 12px',
          marginBottom: 12,
        }}>
          {/* Busca */}
          <input
            className="tw-input"
            placeholder="🔍  Buscar unidade..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            style={{ marginBottom: 8 }}
          />

          {/* Filtros */}
          <div style={{
            display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2,
            scrollbarWidth: 'none',
          }}>
            {FILTROS.map(({ id, label }) => {
              const ativo = filtroAtivo === id;
              return (
                <button
                  key={id}
                  onClick={() => setFiltroAtivo(id)}
                  className="shrink-0 font-nunito font-bold"
                  style={{
                    fontSize: '0.7rem', borderRadius: 6,
                    padding: '4px 10px', whiteSpace: 'nowrap',
                    border: `1.5px solid ${ativo ? C.ACCENT : C.BORDER_SOFT}`,
                    background: ativo ? 'rgba(184,150,90,0.18)' : C.BG_CARD,
                    color: ativo ? C.ACCENT_DEEP : C.TEXT_MUTED,
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Lista */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {tropasFiltradas.length === 0 ? (
            <div style={{
              padding: '32px 16px', textAlign: 'center', borderRadius: 12,
              border: `1px dashed ${C.BORDER_SOFT}`, background: C.BG_CARD,
            }}>
              <p style={{ fontSize: '2rem', marginBottom: 8 }}>⚔️</p>
              <p className="font-nunito italic"
                style={{ fontSize: '0.8rem', color: C.TEXT_MUTED, margin: 0 }}>
                Nenhuma unidade encontrada
              </p>
            </div>
          ) : (
            tropasFiltradas.map(t => (
              <TropaRow
                key={t.nome}
                tropa={t}
                onClick={() => setTropaModal(t)}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default TropaLista;
