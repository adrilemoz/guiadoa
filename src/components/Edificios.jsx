import React, { useState } from 'react';
import { dbEdificios } from '../db.js';
import { C } from '../theme.js';

// ── Metadados visuais por chave do dbEdificios ──────────────────────────────
const BUILDINGS_META = {
  Casa:           { icon: '🏠', label: 'Casa',           tag: 'Pop.',    desc: 'Aumenta a população máxima da cidade, essencial para recrutar e sustentar tropas.' },
  Fazenda:        { icon: '🌾', label: 'Fazenda',         tag: 'Alim.',   desc: 'Produz alimento continuamente para sustentar tropas e o crescimento da cidade.' },
  FazendaPerolas: { icon: '🔮', label: 'F. de Pérolas',  tag: 'Pérolas', desc: 'Produz pérolas valiosas usadas em pesquisas e negociações avançadas.' },
  FonteDaCura:    { icon: '💧', label: 'Fonte da Cura',  tag: 'Cura',    desc: 'Aumenta o limite de tropas que podem se curar simultaneamente no hospital.' },
  PontoDeReuniao: { icon: '⚔️', label: 'Pto. Reunião',   tag: 'Marcha',  desc: 'Aumenta o limite de marchas e a quantidade de tropas enviadas por vez.' },
  Sentinela:      { icon: '👁️', label: 'Sentinela',      tag: 'Def.',    desc: 'Revela informações progressivas sobre ataques inimigos conforme sobe de nível.' },
  Fortaleza:      { icon: '🏰', label: 'Fortaleza',      tag: 'Fort.',   desc: 'Expande territórios, pontos de reforço e áreas disponíveis da cidade.' },
  Mina:           { icon: '⛏️', label: 'Mina',           tag: 'Ouro',    desc: 'Extrai ouro continuamente para financiar pesquisas e construções avançadas.' },
  Pedra:          { icon: '🪨', label: 'Pedreira',        tag: 'Pedra',   desc: 'Extrai pedra continuamente, recurso essencial para obras e aprimoramentos.' },
  Serraria:       { icon: '🌲', label: 'Serraria',        tag: 'Madeira', desc: 'Produz madeira continuamente, necessária para diversas construções da cidade.' },
  Fabrica:        { icon: '🏭', label: 'Fábrica',         tag: 'Prod.',   desc: 'Permite treinar unidades de guerra avançadas à medida que sobe de nível.' },
  Viveiro:        { icon: '🥚', label: 'Viveiro',         tag: 'Dragão',  desc: 'Acelera o treinamento de dragões e desbloqueia novas espécies raras.' },
};

const formatarColuna = (str) => {
  const mapa = {
    desc: 'Descrição / Efeito', pop: 'Pop.', prodHora: 'Prod./h', cap: 'Cap. Máx.',
    maxTropas: 'Máx. Tropas', popAumento: 'Aumento Pop.', territorios: 'Territórios',
    reforcos: 'Reforços', areas: 'Áreas', marchas: 'Marchas', tropasPorMarcha: 'Tropas/Marcha',
  };
  return mapa[str] || str.toUpperCase();
};

const fmt = v =>
  v === null || v === undefined ? '—' : typeof v === 'number' ? v.toLocaleString('pt-BR') : v;

const Edificios = ({ setRoute }) => {
  const buildingKeys = Object.keys(dbEdificios);

  const [sel,   setSel]   = useState(buildingKeys[0]);
  const [aba,   setAba]   = useState('tabela');
  const [nivel, setNivel] = useState('1');
  const [qtd,   setQtd]   = useState('1');

  const meta    = BUILDINGS_META[sel] || { icon: '🏗️', label: sel, tag: '—', desc: '' };
  const dados   = dbEdificios[sel] || [];
  const colunas = dados.length > 0 ? Object.keys(dados[0]).filter(k => k !== 'nivel') : [];
  const isDescOnly = colunas.length === 1 && colunas[0] === 'desc';
  const dadosDoNivel = dados.find(r => String(r.nivel) === String(nivel));

  const handleSelect = (key) => {
    setSel(key);
    setAba('tabela');
    setNivel('1');
    setQtd('1');
  };

  return (
    <div style={{ fontFamily: '"Nunito", sans-serif', color: C.TEXT_PRIMARY, fontSize: 13 }}>

      {/* Botão Voltar */}
      <div style={{ marginBottom: 10 }}>
        <button
          onClick={() => setRoute('home')}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            background: C.BG_CARD, border: `1.5px solid ${C.BORDER}`,
            borderRadius: 8, padding: '6px 14px', cursor: 'pointer',
            fontFamily: '"Nunito", sans-serif', fontWeight: 700,
            fontSize: 12, color: C.TEXT_PRIMARY,
          }}
        >
          ← Voltar à Base
        </button>
      </div>

      {/* Banner título */}
      <div style={{
        background: 'linear-gradient(135deg, #5a3a0a 0%, #8C6830 50%, #5a3a0a 100%)',
        borderRadius: '10px 10px 0 0', padding: '10px 14px',
        textAlign: 'center', position: 'relative',
      }}>
        <div style={{ color: '#FFF8EE', fontWeight: 800, fontSize: 14, letterSpacing: '3px', textTransform: 'uppercase' }}>
          🏗️ CONSTRUÇÕES
        </div>
        <div style={{ color: 'rgba(255,248,230,0.6)', fontSize: 10, letterSpacing: '2px', marginTop: 2 }}>
          ENGENHARIA DA CIDADE
        </div>
        <div style={{
          position: 'absolute', bottom: 0, left: '15%', right: '15%', height: 1,
          background: 'linear-gradient(90deg,transparent,rgba(255,248,230,0.4),transparent)',
        }} />
      </div>

      {/* Seleção por ícones — scroll horizontal */}
      <div style={{
        background: C.BG_HEADER, border: `1.5px solid ${C.BORDER}`, borderTop: 'none',
        padding: '10px 8px', display: 'flex', gap: 6, overflowX: 'auto',
        scrollbarWidth: 'none', msOverflowStyle: 'none',
      }}>
        {buildingKeys.map(key => {
          const m = BUILDINGS_META[key] || { icon: '🏗️', label: key, tag: '—' };
          const active = sel === key;
          return (
            <button key={key} onClick={() => handleSelect(key)} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
              background: active ? `linear-gradient(135deg,${C.ACCENT},${C.ACCENT_HOVER})` : C.BG_CARD,
              border: `2px solid ${active ? C.ACCENT_DEEP : C.BORDER_SOFT}`,
              borderRadius: 10, padding: '8px 10px', cursor: 'pointer',
              minWidth: 60, flexShrink: 0,
              boxShadow: active ? `0 2px 8px rgba(168,132,74,0.4)` : 'none',
              transform: active ? 'translateY(-1px)' : 'none',
              transition: 'all .15s',
            }}>
              <span style={{ fontSize: 20 }}>{m.icon}</span>
              <span style={{
                fontSize: 9, fontWeight: 700, textAlign: 'center', lineHeight: 1.2, whiteSpace: 'nowrap',
                color: active ? '#FFF8EE' : C.TEXT_MUTED,
              }}>
                {m.label}
              </span>
              <span style={{
                fontSize: 8, fontWeight: 700, borderRadius: 3, padding: '1px 4px',
                background: active ? 'rgba(255,255,255,0.2)' : C.BG_SECONDARY,
                color: active ? '#FFF8EE' : C.TEXT_MUTED,
              }}>
                {m.tag}
              </span>
            </button>
          );
        })}
      </div>

      {/* Faixa de descrição */}
      <div style={{
        background: C.BG_SECONDARY, border: `1.5px solid ${C.BORDER}`, borderTop: 'none',
        padding: '7px 12px', display: 'flex', gap: 8, alignItems: 'center',
      }}>
        <span style={{ fontSize: 22, flexShrink: 0 }}>{meta.icon}</span>
        <div>
          <div style={{ fontWeight: 800, fontSize: 13, color: C.TEXT_PRIMARY }}>{meta.label}</div>
          <div style={{ fontSize: 11, color: C.TEXT_SECONDARY, fontStyle: 'italic' }}>{meta.desc}</div>
        </div>
      </div>

      {/* Abas */}
      <div style={{ display: 'flex', borderBottom: `2px solid ${C.BORDER}`, background: C.BG_CARD }}>
        {[
          ['tabela', '📊 Tabela'],
          ...(!isDescOnly ? [['calc', '🧮 Calculadora']] : []),
        ].map(([id, lbl]) => (
          <button key={id} onClick={() => setAba(id)} style={{
            flex: 1, background: 'none', border: 'none', padding: '9px 0',
            cursor: 'pointer', fontFamily: '"Nunito", sans-serif',
            fontWeight: 700, fontSize: 12, letterSpacing: '0.5px',
            color: aba === id ? C.ACCENT_DEEP : C.TEXT_MUTED,
            borderBottom: aba === id ? `3px solid ${C.ACCENT_DEEP}` : '3px solid transparent',
            marginBottom: -2, transition: 'color .15s',
          }}>
            {lbl}
          </button>
        ))}
      </div>

      {/* Conteúdo da aba */}
      <div style={{
        background: C.BG_CARD, border: `1.5px solid ${C.BORDER}`,
        borderTop: 'none', borderRadius: '0 0 10px 10px',
      }}>

        {/* ABA: Tabela */}
        {aba === 'tabela' && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr>
                  <th style={{
                    background: `linear-gradient(135deg,${C.ACCENT},${C.ACCENT_HOVER})`,
                    color: '#FFF8EE', padding: '8px 6px', fontWeight: 800,
                    textAlign: 'center', letterSpacing: '0.5px',
                  }}>Nív.</th>
                  {colunas.map(h => (
                    <th key={h} style={{
                      background: `linear-gradient(135deg,${C.ACCENT},${C.ACCENT_HOVER})`,
                      color: '#FFF8EE', padding: '8px 6px', fontWeight: 800,
                      textAlign: h === 'desc' ? 'left' : 'center',
                    }}>
                      {formatarColuna(h)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dados.map((r, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.03)' }}>
                    <td style={{
                      textAlign: 'center', fontWeight: 900, color: C.ERROR,
                      padding: '7px 4px', borderRight: `1px solid ${C.BORDER_SOFT}`,
                    }}>
                      {r.nivel}
                    </td>
                    {colunas.map(col => (
                      <td key={col} style={{
                        textAlign: col === 'desc' ? 'left' : 'center',
                        fontWeight: 600, color: C.TEXT_PRIMARY,
                        borderRight: `1px solid ${C.BORDER_SOFT}`,
                        padding: '7px 8px',
                        lineHeight: col === 'desc' ? 1.4 : undefined,
                      }}>
                        {fmt(r[col])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ABA: Calculadora */}
        {aba === 'calc' && (
          <div style={{ padding: '12px' }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              {[['Nível', nivel, setNivel], ['Quantidade', qtd, setQtd]].map(([lbl, val, fn]) => (
                <div key={lbl} style={{ flex: 1 }}>
                  <div style={{
                    fontSize: 10, fontWeight: 700, color: C.TEXT_MUTED,
                    letterSpacing: '1px', marginBottom: 4, textTransform: 'uppercase',
                  }}>
                    {lbl}
                  </div>
                  <input
                    type="number" value={val} min="1"
                    onChange={e => fn(e.target.value)}
                    style={{
                      width: '100%', background: C.BG_INPUT,
                      border: `2px solid ${C.BORDER}`, borderRadius: 8,
                      padding: '8px', fontFamily: '"Nunito", sans-serif',
                      fontSize: 18, fontWeight: 800, color: C.ACCENT_DEEP,
                      textAlign: 'center', boxSizing: 'border-box',
                    }}
                  />
                </div>
              ))}
            </div>

            {dadosDoNivel ? (
              <div style={{
                background: 'linear-gradient(135deg, rgba(184,150,90,0.15), rgba(168,132,74,0.08))',
                border: `2px solid ${C.BORDER}`, borderRadius: 10, padding: '10px 12px',
              }}>
                <div style={{ fontWeight: 800, fontSize: 12, color: C.TEXT_SECONDARY, marginBottom: 6 }}>
                  {qtd}× {meta.icon} {meta.label} — Nível {nivel}
                </div>
                {colunas.filter(c => c !== 'desc').map(col => {
                  const total = (dadosDoNivel[col] || 0) * Number(qtd);
                  return (
                    <div key={col} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '5px 0', borderBottom: `1px solid ${C.BORDER_SOFT}`,
                    }}>
                      <span style={{ color: C.TEXT_SECONDARY, fontSize: 12 }}>{formatarColuna(col)}</span>
                      <span style={{ color: C.ACCENT_DEEP, fontWeight: 900, fontSize: 14 }}>
                        {total.toLocaleString('pt-BR')}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{
                padding: '12px', textAlign: 'center',
                color: C.ERROR, fontWeight: 700, fontSize: 12,
                border: `1px dashed ${C.ERROR}`, borderRadius: 8,
              }}>
                Nível {nivel} não encontrado para {meta.label}.
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default Edificios;
