import React from 'react';
import { C } from '../../../theme.js';
import { fmtN } from './RewardRow.jsx';
import { dbTropas } from '../../../db.js';

/**
 * TorneioLayout — wrapper com cabeçalho, inventário, premiação e resultados.
 *
 * Props:
 *   title, icon, color
 *   inventario: JSX do bloco de inputs de inventário
 *   totalPts: number — total de pontos calculados
 *   ptsSufixo: string — ex. 'pts', 'poder'
 *   metas: [{ key, label, reqPts }]
 *   premios: object
 *   onPremioChange: fn
 *   tropaPremio: string
 *   onTropaChange: fn
 *   extraInfo: JSX opcional
 */
const TorneioLayout = ({
  title, icon, color = C.ACCENT,
  inventario, totalPts = 0, ptsSufixo = 'pontos',
  metas = [], premios = {}, onPremioChange,
  tropaPremio = '', onTropaChange,
  extraInfo,
}) => {
  const tropaObj = dbTropas.find(t => t.nome === tropaPremio);
  const poderUnit = tropaObj?.poder || 0;

  const totalTropas = metas.reduce((acc, m) => {
    const p = premios[m.key] || { m: 10, b: 1000 };
    const ganhou = totalPts >= m.reqPts;
    return acc + (ganhou ? p.m * p.b : 0);
  }, 0) + ((premios.princ?.m || 10) * (premios.princ?.b || 1000));

  const totalPoder = totalTropas * poderUnit;

  // Section title util
  const SecTitle = ({ label }) => (
    <div className="flex items-center gap-2 my-2.5">
      <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, transparent, ${C.BORDER})` }} />
      <span style={{ color: C.ACCENT, fontSize: '0.65rem' }}>◆</span>
      <span className="font-nunito font-bold text-[0.65rem] tracking-widest uppercase" style={{ color: C.TEXT_MUTED }}>{label}</span>
      <span style={{ color: C.ACCENT, fontSize: '0.65rem' }}>◆</span>
      <div className="flex-1 h-px" style={{ background: `linear-gradient(270deg, transparent, ${C.BORDER})` }} />
    </div>
  );

  return (
    <div className="max-w-md mx-auto pb-4" style={{ animation: 'reveal-up 0.4s ease both' }}>
      {/* Header ornamental */}
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-xl mb-3 relative overflow-hidden"
        style={{ border: `2px solid ${color}`, background: `${color}12` }}
      >
        <span className="text-3xl leading-none shrink-0">{icon}</span>
        <div>
          <p className="font-cinzel font-bold text-sm uppercase tracking-wide m-0 leading-tight" style={{ color: C.TEXT_PRIMARY }}>{title}</p>
          <p className="font-nunito text-[0.68rem] italic m-0" style={{ color: C.TEXT_MUTED }}>Calculadora de Torneio</p>
        </div>
        {/* Barra de cor lateral */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl" style={{ background: color }} />
      </div>

      {/* Inventário */}
      <SecTitle label="INVENTÁRIO" />
      <div className="tw-card mb-2 p-3">{inventario}</div>

      {/* Score */}
      <div className="tw-card mb-2 p-3 text-center">
        <p className="font-nunito font-bold text-[0.62rem] tracking-widest uppercase m-0 mb-1" style={{ color: C.TEXT_MUTED }}>TOTAL DE {ptsSufixo.toUpperCase()}</p>
        <p className="font-nunito font-black leading-none m-0" style={{ fontSize: 'clamp(1.8rem, 8vw, 2.6rem)', color, letterSpacing: '0.04em' }}>
          {fmtN(totalPts)}
        </p>
      </div>

      {extraInfo && <div className="mb-2">{extraInfo}</div>}

      {/* Premiação */}
      <SecTitle label="PREMIAÇÃO" />
      <div className="tw-card mb-2 p-3">
        {/* Tropa prêmio */}
        <p className="font-nunito font-bold text-[0.65rem] tracking-wider uppercase mb-1 m-0" style={{ color: C.TEXT_MUTED }}>Tropa como Prêmio</p>
        <select
          className="tw-select mb-3"
          value={tropaPremio}
          onChange={e => onTropaChange(e.target.value)}
        >
          <option value="">— Selecionar Tropa —</option>
          {dbTropas.map(t => <option key={t.nome} value={t.nome}>{t.nome} (⭐ {t.poder})</option>)}
        </select>

        {/* Prêmio principal (sempre visível) */}
        <p className="font-nunito font-bold text-[0.65rem] tracking-wider uppercase mb-1.5 m-0" style={{ color: C.TEXT_MUTED }}>Distribuição de Recompensas</p>

        {/* Todos os rows */}
        {metas.map(m => (
          <div key={m.key} className="flex items-center justify-between p-2 rounded-lg mb-1.5 transition-all"
            style={{
              background: totalPts < m.reqPts ? 'transparent' : C.BG_CARD,
              border: `1px solid ${totalPts < m.reqPts ? 'rgba(166,131,77,0.25)' : C.BORDER}`,
              opacity: totalPts < m.reqPts ? 0.55 : 1,
            }}>
            <span className="font-nunito font-black text-[0.72rem]" style={{ color: totalPts < m.reqPts ? C.TEXT_MUTED : C.TEXT_PRIMARY }}>
              {m.label}
            </span>
            <div className="flex items-center gap-1.5">
              <button className="w-7 h-7 rounded flex items-center justify-center font-black text-base border-none cursor-pointer"
                style={{ background: C.BG_SECONDARY, border: `1px solid ${C.BORDER}`, color: C.TEXT_PRIMARY }}
                disabled={totalPts < m.reqPts}
                onClick={() => onPremioChange(m.key, 'm', Math.max(0, (premios[m.key]?.m || 0) - 1))}>
                −
              </button>
              <span className="font-nunito font-black text-[0.9rem]" style={{ color: C.ACCENT_DEEP, minWidth: 24, textAlign: 'center' }}>
                {premios[m.key]?.m ?? 10}
              </span>
              <button className="w-7 h-7 rounded flex items-center justify-center font-black text-base border-none cursor-pointer"
                style={{ background: C.BG_SECONDARY, border: `1px solid ${C.BORDER}`, color: C.TEXT_PRIMARY }}
                disabled={totalPts < m.reqPts}
                onClick={() => onPremioChange(m.key, 'm', (premios[m.key]?.m || 0) + 1)}>
                +
              </button>
              <span className="font-nunito font-bold text-sm" style={{ color: C.TEXT_SECONDARY }}>×</span>
              <select className="tw-select-sm" value={premios[m.key]?.b ?? 1000}
                disabled={totalPts < m.reqPts}
                onChange={e => onPremioChange(m.key, 'b', parseInt(e.target.value))}>
                {[10,50,100,200,300,500,1000,2000,5000,10000].map(v => (
                  <option key={v} value={v}>{fmtN(v)}</option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>

      {/* Resultados */}
      <SecTitle label="RESULTADOS" />
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: 'Total de Tropas', value: fmtN(totalTropas), color: C.ACCENT_DEEP, icon: '⚔️' },
          { label: 'Poder Total',     value: fmtN(totalPoder),  color: C.POWER,       icon: '✦' },
        ].map(s => (
          <div key={s.label} className="tw-card p-3 text-center" style={{ borderBottom: `3px solid ${s.color}` }}>
            <p className="font-nunito text-lg leading-none mb-1 m-0">{s.icon}</p>
            <p className="font-nunito font-black text-base leading-none m-0" style={{ color: s.color }}>{s.value}</p>
            <p className="font-nunito font-bold text-[0.62rem] uppercase tracking-wider m-0 mt-0.5" style={{ color: C.TEXT_MUTED }}>{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TorneioLayout;
