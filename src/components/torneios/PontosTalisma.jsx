import React, { useState, useMemo } from 'react';
import { C } from '../../theme.js';
import Toast from '../../ui/Toast.jsx';

const STORAGE_KEY = 'doa_pontos_talisma';
const COR         = '#5A8AAE'; // azul-talismã

const TALISMAS = [
  { key: 'verde',   label: 'Verde',   emoji: '🟢', pts: 20,    cor: '#5A8A5C' },
  { key: 'azul',    label: 'Azul',    emoji: '🔵', pts: 30,    cor: '#5C7FA3' },
  { key: 'roxo',    label: 'Roxo',    emoji: '🟣', pts: 800,   cor: '#8B6BAE' },
  { key: 'laranja', label: 'Laranja', emoji: '🟠', pts: 12000, cor: '#C87A2C' },
];

const fmtN = n => Number(n || 0).toLocaleString('pt-BR');

const PontosTalisma = () => {
  const [qtds, setQtds] = useState(() => {
    try { const s = localStorage.getItem(STORAGE_KEY); return s ? JSON.parse(s).qtds || {} : {}; }
    catch { return {}; }
  });
  const [ptsPossuidos, setPtsPossuidos] = useState(() => {
    try { const s = localStorage.getItem(STORAGE_KEY); return s ? JSON.parse(s).ptsPossuidos || '' : ''; }
    catch { return ''; }
  });
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const handleQtd = (key, value) =>
    setQtds(q => ({ ...q, [key]: value.replace(/\D/g, '') }));

  const ptsDosItens = useMemo(
    () => TALISMAS.reduce((acc, t) => acc + (parseInt(qtds[t.key]) || 0) * t.pts, 0),
    [qtds]
  );
  const ptsPos     = parseInt(ptsPossuidos.replace(/\D/g, '')) || 0;
  const totalFinal = ptsDosItens + ptsPos;

  const handleSalvar = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ qtds, ptsPossuidos }));
      setToast({ open: true, message: 'Dados salvos com sucesso!', severity: 'success' });
    } catch {
      setToast({ open: true, message: 'Erro ao salvar os dados.', severity: 'error' });
    }
  };

  return (
    <div className="max-w-md mx-auto pb-4" style={{ animation: 'reveal-up 0.4s ease both' }}>
      <Toast {...toast} onClose={() => setToast(t => ({ ...t, open: false }))} />

      {/* ── TOTAL ────────────────────────────────────────────────────────────── */}
      <div className="rounded-xl overflow-hidden mb-3"
        style={{ border: `1.5px solid ${C.BORDER}`, boxShadow: '0 3px 14px rgba(62,47,28,0.15)' }}>

        {/* Contador + botão salvar */}
        <div className="px-4 py-3 flex items-center gap-3"
          style={{ background: 'linear-gradient(135deg, #0A2030 0%, #1A3A5A 100%)' }}>

          <div className="flex-1 min-w-0">
            <p className="font-nunito font-bold text-[0.6rem] tracking-[3px] uppercase m-0 mb-1"
              style={{ color: 'rgba(140,190,220,0.7)' }}>
              TOTAL DE PONTOS
            </p>
            <p className="font-nunito font-black leading-none m-0"
              style={{
                fontSize: 'clamp(1.9rem,9vw,2.7rem)',
                letterSpacing: '0.05em',
                color: '#90C8E8',
                textShadow: '0 2px 18px rgba(80,160,220,0.55)',
              }}>
              {fmtN(totalFinal)}
            </p>
            {ptsPos > 0 && (
              <p className="font-nunito font-semibold text-[0.6rem] m-0 mt-1"
                style={{ color: 'rgba(140,190,220,0.55)' }}>
                {fmtN(ptsDosItens)} (talismãs) + {fmtN(ptsPos)} (possuídos)
              </p>
            )}
          </div>

          <button
            className="shrink-0"
            onClick={handleSalvar}
            style={{
              padding: '8px 14px', fontSize: '0.75rem', whiteSpace: 'nowrap',
              background: 'linear-gradient(180deg,#3A7AAA,#1A4A7A)',
              color: '#EEF6FF',
              border: '1px solid #0A2A5A',
              borderRadius: 8, cursor: 'pointer', fontWeight: 800,
              fontFamily: '"Nunito",sans-serif',
            }}>
            💾 Salvar
          </button>
        </div>

        {/* Campo pontos possuídos */}
        <div className="px-4 py-3"
          style={{ background: C.BG_CARD, borderTop: `1px solid rgba(90,138,174,0.25)` }}>
          <label className="font-nunito font-bold text-[0.65rem] tracking-widest uppercase block mb-1.5"
            style={{ color: C.TEXT_MUTED }}>
            Pontos já possuídos
          </label>
          <input
            className="tw-input text-center font-mono font-black"
            style={{ fontSize: '1rem' }}
            placeholder="0"
            value={ptsPossuidos}
            onChange={e => setPtsPossuidos(e.target.value.replace(/\D/g, ''))}
            inputMode="numeric"
          />
        </div>
      </div>

      {/* ── TALISMÃS — grid 2 colunas ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        {TALISMAS.map(t => {
          const qtd  = parseInt(qtds[t.key]) || 0;
          const soma = qtd * t.pts;
          const ativo = soma > 0;
          return (
            <div key={t.key}
              className="rounded-xl overflow-hidden"
              style={{
                border:    `1px solid ${ativo ? t.cor : C.BORDER_SOFT}`,
                borderTop: `3px solid ${ativo ? t.cor : C.BORDER_SOFT}`,
                background: ativo
                  ? `linear-gradient(180deg, ${C.BG_CARD} 0%, ${t.cor}08 100%)`
                  : C.BG_CARD,
                boxShadow: ativo ? `0 2px 8px ${t.cor}25` : 'none',
                transition: 'all 0.18s',
              }}>

              {/* Topo: emoji + nome + pts/un */}
              <div className="px-3 pt-2.5 pb-2"
                style={{ borderBottom: `1px solid rgba(200,168,74,0.15)` }}>
                <p className="text-center text-2xl leading-tight m-0">{t.emoji}</p>
                <p className="font-nunito font-black text-[0.82rem] m-0 mt-1 leading-tight text-center"
                  style={{ color: C.TEXT_PRIMARY }}>
                  Talismã {t.label}
                </p>
                <p className="font-nunito font-semibold text-[0.6rem] m-0 mt-0.5 text-center"
                  style={{ color: t.cor, fontWeight: 800 }}>
                  {fmtN(t.pts)} pts/unidade
                </p>
              </div>

              {/* Input com "= pts" */}
              <div className="px-3 py-2"
                style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span className="font-nunito font-bold text-[0.55rem] leading-none"
                  style={{ color: C.TEXT_FAINT, flexShrink: 0, whiteSpace: 'nowrap' }}>
                  = pts
                </span>
                <input
                  className="tw-input text-center font-mono font-black"
                  style={{ padding: '5px 4px', fontSize: '0.85rem', minWidth: 0, flex: 1 }}
                  placeholder="0"
                  value={qtds[t.key] || ''}
                  onChange={e => handleQtd(t.key, e.target.value)}
                  inputMode="numeric"
                />
              </div>

              {/* Subtotal */}
              <div className="px-3 pb-2.5 text-center">
                <p className="font-nunito font-black text-[0.95rem] leading-tight m-0"
                  style={{ color: ativo ? t.cor : C.TEXT_FAINT }}>
                  {fmtN(soma)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── COMO FUNCIONA ─────────────────────────────────────────────────────── */}
      <div className="rounded-xl overflow-hidden"
        style={{ border: `1px solid ${C.BORDER_SOFT}` }}>
        <div className="px-4 py-2.5"
          style={{
            background: `linear-gradient(180deg, ${C.BG_CARD_TOP}, ${C.BG_CARD})`,
            borderBottom: `1.5px solid ${C.BORDER_SOFT}`,
          }}>
          <p className="font-nunito font-black text-[0.72rem] uppercase tracking-widest m-0"
            style={{ color: C.TEXT_MUTED }}>
            📖 Como Funciona
          </p>
        </div>
        <div className="px-4 py-3" style={{ background: C.BG_CARD }}>
          {[
            { icon: '🧿', text: 'O torneio consiste em acumular talismãs usando a Torre para rezar. Quanto mais talismãs obtidos, maior a pontuação.' },
            { icon: '🗼', text: 'É possível conseguir 3 talismãs por dia gratuitamente através da Torre de Oração.' },
            { icon: '🎲', text: 'Os talismãs são aleatórios — pode sair Verde (20 pts), Azul (30 pts), Roxo (800 pts) ou o raro Laranja (12.000 pts).' },
            { icon: '🎁', text: 'Também é possível obter talismãs extras em eventos especiais e em outros torneios.' },
            { icon: '💎', text: 'Outra forma de conseguir é comprando diretamente com rubis na loja do jogo.' },
          ].map((item, i) => (
            <div key={i} className="flex gap-2.5 items-start mb-2.5 last:mb-0">
              <span className="text-base leading-none shrink-0 mt-0.5">{item.icon}</span>
              <p className="font-nunito font-semibold text-[0.76rem] leading-relaxed m-0"
                style={{ color: C.TEXT_SECONDARY }}>
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PontosTalisma;
