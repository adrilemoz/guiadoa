import React, { useState } from 'react';
import { dbEdificios } from '../db.js';
import { C } from '../theme.js';
import GameHeader from './shared/GameHeader.jsx';

const BUILDINGS_META = {
  Casa:           { icon: '🏠', label: 'Casa',          tag: 'Pop.',    desc: 'Aumenta a população máxima da cidade, essencial para recrutar e sustentar tropas.' },
  Fazenda:        { icon: '🌾', label: 'Fazenda',        tag: 'Alim.',   desc: 'Produz alimento continuamente para sustentar tropas e o crescimento da cidade.' },
  FazendaPerolas: { icon: '🔮', label: 'F. Pérolas',    tag: 'Pérolas', desc: 'Produz pérolas valiosas usadas em pesquisas e negociações avançadas.' },
  FonteDaCura:    { icon: '💧', label: 'Fonte Cura',    tag: 'Cura',    desc: 'Aumenta o limite de tropas que podem se curar simultaneamente no hospital.' },
  PontoDeReuniao: { icon: '⚔️', label: 'Reunião',       tag: 'Marcha',  desc: 'Aumenta o limite de marchas e a quantidade de tropas enviadas por vez.' },
  Sentinela:      { icon: '👁️', label: 'Sentinela',     tag: 'Def.',    desc: 'Revela informações progressivas sobre ataques inimigos conforme sobe de nível.' },
  Fortaleza:      { icon: '🏰', label: 'Fortaleza',     tag: 'Fort.',   desc: 'Expande territórios, pontos de reforço e áreas disponíveis da cidade.' },
  Mina:           { icon: '⛏️', label: 'Mina',          tag: 'Ouro',    desc: 'Extrai ouro continuamente para financiar pesquisas e construções avançadas.' },
  Pedra:          { icon: '🪨', label: 'Pedreira',      tag: 'Pedra',   desc: 'Extrai pedra continuamente, recurso essencial para obras e aprimoramentos.' },
  Serraria:       { icon: '🌲', label: 'Serraria',      tag: 'Madeira', desc: 'Produz madeira continuamente, necessária para diversas construções da cidade.' },
  Fabrica:        { icon: '🏭', label: 'Fábrica',       tag: 'Prod.',   desc: 'Permite treinar unidades de guerra avançadas à medida que sobe de nível.' },
  Viveiro:        { icon: '🥚', label: 'Viveiro',       tag: 'Dragão',  desc: 'Acelera o treinamento de dragões e desbloqueia novas espécies raras.' },
};

const COLUMN_LABELS = {
  desc: 'Efeito', pop: 'Pop.', prodHora: 'Prod./h', cap: 'Cap. Máx.',
  maxTropas: 'Máx. Tropas', popAumento: 'Aumento Pop.', territorios: 'Territórios',
  reforcos: 'Reforços', areas: 'Áreas', marchas: 'Marchas', tropasPorMarcha: 'Tropas/Marcha',
};

const fmt = v =>
  v === null || v === undefined ? '—' : typeof v === 'number' ? v.toLocaleString('pt-BR') : v;

const Edificios = () => {
  const buildingKeys = Object.keys(dbEdificios);
  const [sel,   setSel]   = useState(buildingKeys[0]);
  const [aba,   setAba]   = useState('tabela');
  const [nivel, setNivel] = useState('1');
  const [qtd,   setQtd]   = useState('1');

  const meta   = BUILDINGS_META[sel] || { icon: '🏗️', label: sel, tag: '—', desc: '' };
  const dados  = dbEdificios[sel] || [];
  const colunas = dados.length > 0 ? Object.keys(dados[0]).filter(k => k !== 'nivel') : [];
  const isDescOnly = colunas.length === 1 && colunas[0] === 'desc';
  const dadosDoNivel = dados.find(r => String(r.nivel) === String(nivel));

  // Calculadora de ganho
  const nivelNum = parseInt(nivel, 10) || 1;
  const nivelFim = Math.min(nivelNum + (parseInt(qtd, 10) || 1) - 1, dados.length);
  const nAtual   = dados.find(r => r.nivel === nivelNum);
  const nFim     = dados.find(r => r.nivel === nivelFim);

  return (
    <div className="max-w-2xl mx-auto pb-4">

      {/* Banner topo */}
      <div
        className="rounded-t-xl px-4 py-2.5 text-center relative overflow-hidden mb-0"
        style={{ background: 'linear-gradient(135deg, #1C3A5E 0%, #3B5C8C 50%, #1C3A5E 100%)' }}
      >
        <p className="font-cinzel font-bold text-sm tracking-widest uppercase text-aoe-cream m-0">🏗️ Construções</p>
        <p className="font-nunito text-[0.65rem] tracking-widest text-aoe-cream/50 m-0 mt-0.5">Engenharia da Cidade</p>
      </div>

      {/* Selector de edifícios */}
      <div
        className="flex gap-1.5 overflow-x-auto py-2.5 px-2 mb-3"
        style={{
          background: C.BG_SECONDARY,
          border: `1.5px solid ${C.BORDER}`,
          borderTop: 'none',
          borderRadius: '0 0 10px 10px',
          scrollbarWidth: 'none',
        }}
      >
        {buildingKeys.map(key => {
          const m = BUILDINGS_META[key] || { icon: '🏗️', label: key, tag: '—' };
          const active = sel === key;
          return (
            <button
              key={key}
              onClick={() => { setSel(key); setAba('tabela'); setNivel('1'); setQtd('1'); }}
              className="flex flex-col items-center gap-0.5 rounded-xl shrink-0 transition-all border-none cursor-pointer"
              style={{
                padding: '7px 10px',
                minWidth: 58,
                background: active ? `linear-gradient(135deg, ${C.ACCENT}, ${C.ACCENT_HOVER})` : C.BG_CARD,
                border: `2px solid ${active ? C.ACCENT_DEEP : C.BORDER_SOFT}`,
                boxShadow: active ? '0 2px 8px rgba(168,132,74,0.4)' : 'none',
                transform: active ? 'translateY(-1px)' : 'none',
              }}
            >
              <span className="text-xl leading-none">{m.icon}</span>
              <span className="font-nunito font-bold text-center leading-tight" style={{ fontSize: 9, color: active ? '#FFF8EE' : C.TEXT_MUTED }}>
                {m.label}
              </span>
              <span
                className="font-nunito font-bold rounded text-center"
                style={{
                  fontSize: 8, padding: '1px 4px',
                  background: active ? 'rgba(255,255,255,0.2)' : C.BG_SECONDARY,
                  color: active ? 'rgba(255,248,238,0.8)' : C.TEXT_FAINT,
                }}
              >
                {m.tag}
              </span>
            </button>
          );
        })}
      </div>

      {/* Card info do edifício */}
      <div className="tw-card mb-3">
        <div className="flex items-center gap-3 p-3" style={{ borderBottom: `1px solid ${C.BORDER_SOFT}` }}>
          <div
            className="w-14 h-14 shrink-0 flex items-center justify-center text-4xl rounded-xl"
            style={{ background: C.BG_SECONDARY, border: `2px solid ${C.BORDER}`, boxShadow: 'inset 0 1px 4px rgba(62,47,28,0.1)' }}
          >
            {meta.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-cinzel font-bold text-sm m-0" style={{ color: C.TEXT_PRIMARY }}>{meta.label}</p>
            <span
              className="font-nunito font-bold text-[0.65rem] px-1.5 py-0.5 rounded"
              style={{ background: `${C.ACCENT}20`, border: `1px solid ${C.BORDER_SOFT}`, color: C.ACCENT_DEEP }}
            >
              {meta.tag}
            </span>
            <p className="font-nunito text-[0.72rem] leading-snug mt-1 m-0" style={{ color: C.TEXT_SECONDARY }}>{meta.desc}</p>
          </div>
        </div>

        {/* Abas */}
        <div className="flex" style={{ borderBottom: `1.5px solid ${C.BORDER_SOFT}` }}>
          {['tabela', 'ganhos'].map(a => (
            <button
              key={a}
              onClick={() => setAba(a)}
              className="flex-1 font-nunito font-bold text-xs py-2 tracking-wide capitalize transition-all border-none cursor-pointer"
              style={{
                background: aba === a ? C.BG_CARD : C.BG_SECONDARY,
                color: aba === a ? C.ACCENT_DEEP : C.TEXT_MUTED,
                borderBottom: aba === a ? `2px solid ${C.ACCENT}` : '2px solid transparent',
              }}
            >
              {a === 'tabela' ? '📋 Tabela' : '📊 Ganhos'}
            </button>
          ))}
        </div>

        {/* ABA TABELA */}
        {aba === 'tabela' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="tw-th" style={{ minWidth: 40 }}>Nível</th>
                  {colunas.map(c => (
                    <th key={c} className="tw-th" style={{ minWidth: isDescOnly ? 180 : 80 }}>
                      {COLUMN_LABELS[c] || c.toUpperCase()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dados.map(row => (
                  <tr
                    key={row.nivel}
                    className="transition-colors"
                    style={{ background: String(row.nivel) === String(nivel) ? `${C.ACCENT}12` : 'transparent' }}
                  >
                    <td className="tw-td font-bold text-center" style={{ color: C.ACCENT_DEEP }}>{row.nivel}</td>
                    {colunas.map(c => (
                      <td key={c} className="tw-td" style={{ color: C.TEXT_SECONDARY }}>{fmt(row[c])}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ABA GANHOS */}
        {aba === 'ganhos' && (
          <div className="p-3">
            <div className="flex gap-2 mb-3">
              <div className="flex-1">
                <label className="font-nunito font-bold text-[0.68rem] tracking-wider block mb-1" style={{ color: C.TEXT_MUTED }}>
                  NÍVEL INICIAL
                </label>
                <input
                  type="number" min={1} max={dados.length}
                  className="tw-input text-center"
                  value={nivel}
                  onChange={e => setNivel(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label className="font-nunito font-bold text-[0.68rem] tracking-wider block mb-1" style={{ color: C.TEXT_MUTED }}>
                  QTD. NÍVEIS
                </label>
                <input
                  type="number" min={1}
                  className="tw-input text-center"
                  value={qtd}
                  onChange={e => setQtd(e.target.value)}
                />
              </div>
            </div>

            {nAtual && nFim ? (
              <div className="space-y-1.5">
                {colunas.filter(c => c !== 'desc').map(c => {
                  const de = nAtual[c];
                  const para = nFim[c];
                  const diff = typeof de === 'number' && typeof para === 'number' ? para - de : null;
                  return (
                    <div key={c}
                      className="flex items-center justify-between px-3 py-2 rounded-lg"
                      style={{ background: C.BG_SECONDARY, border: `1px solid ${C.BORDER_SOFT}` }}
                    >
                      <span className="font-nunito font-bold text-xs" style={{ color: C.TEXT_MUTED }}>
                        {COLUMN_LABELS[c] || c}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs font-nunito font-bold">
                        <span style={{ color: C.TEXT_SECONDARY }}>{fmt(de)}</span>
                        <span style={{ color: C.TEXT_FAINT }}>→</span>
                        <span style={{ color: C.ACCENT_DEEP }}>{fmt(para)}</span>
                        {diff !== null && diff > 0 && (
                          <span className="px-1.5 py-0.5 rounded text-[0.65rem]"
                            style={{ background: `${C.SUCCESS}20`, color: C.SUCCESS, border: `1px solid ${C.SUCCESS}40` }}>
                            +{fmt(diff)}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-center font-nunito text-xs italic py-4 m-0" style={{ color: C.TEXT_FAINT }}>
                Nível fora do intervalo disponível
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Edificios;
