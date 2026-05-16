import React, { useState } from 'react';
import { dbDragoes } from '../../data/dragoes.js';
import { C } from '../../theme.js';

const SectionDivider = ({ label }) => (
  <div className="flex items-center gap-2 my-3">
    <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, transparent, ${C.BORDER})` }} />
    <span style={{ color: C.ACCENT, fontSize: '0.7rem' }}>◆</span>
    <span className="font-nunito font-bold text-[0.65rem] tracking-widest whitespace-nowrap uppercase" style={{ color: C.TEXT_MUTED }}>{label}</span>
    <span style={{ color: C.ACCENT, fontSize: '0.7rem' }}>◆</span>
    <div className="flex-1 h-px" style={{ background: `linear-gradient(270deg, transparent, ${C.BORDER})` }} />
  </div>
);

const DragaoCard = ({ dragao, onClick }) => (
  <div
    onClick={() => onClick(dragao.id)}
    className="flex items-center gap-3 rounded-xl mb-2.5 cursor-pointer transition-all relative overflow-hidden"
    style={{
      padding: '12px 14px',
      border: `1.5px solid ${C.BORDER_SOFT}`,
      borderLeft: `4px solid ${dragao.cor}`,
      background: `linear-gradient(135deg, ${C.BG_CARD} 0%, ${dragao.corFundo || C.BG_CARD_TOP} 100%)`,
      boxShadow: '0 2px 8px rgba(62,47,28,0.10)',
    }}
  >
    {/* Brilho topo */}
    <div className="absolute top-0 left-[10%] right-[10%] h-px pointer-events-none"
      style={{ background: 'linear-gradient(90deg, transparent, rgba(255,248,230,0.7), transparent)' }} />

    {/* Ícone */}
    <div className="w-13 h-13 shrink-0 flex items-center justify-center text-3xl rounded-xl"
      style={{ width:52, height:52, background:`linear-gradient(135deg,${dragao.cor}22,${dragao.cor}44)`, border:`2px solid ${dragao.cor}66`, boxShadow:`0 2px 8px ${dragao.cor}33` }}>
      {dragao.emojiDragao}
    </div>

    {/* Info */}
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-1.5 mb-1 flex-wrap">
        <span className="font-nunito font-black text-[0.95rem]" style={{ color: C.TEXT_PRIMARY }}>{dragao.nome}</span>
        <span className="font-nunito font-bold text-[0.6rem] px-1.5 py-0.5 rounded"
          style={{ background:`${dragao.cor}22`, border:`1px solid ${dragao.cor}55`, color: dragao.cor }}>
          {dragao.elemento}
        </span>
      </div>
      <p className="font-nunito text-[0.72rem] font-semibold leading-snug m-0 overflow-hidden text-ellipsis"
        style={{ color: C.TEXT_MUTED, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
        {dragao.descricao}
      </p>
    </div>

    {/* Seta */}
    <span className="text-xl leading-none shrink-0" style={{ color: dragao.cor, opacity: 0.6 }}>›</span>
  </div>
);

const Dragoes = ({ setRoute }) => {
  const [busca, setBusca] = useState('');

  const dragoesFiltrados = dbDragoes.filter(d =>
    d.nome.toLowerCase().includes(busca.toLowerCase()) ||
    d.elemento.toLowerCase().includes(busca.toLowerCase())
  );

  const elementos = [...new Set(dbDragoes.map(d => d.elemento))].sort();

  return (
    <div className="max-w-lg mx-auto pb-4" style={{ animation: 'reveal-up 0.4s ease both' }}>

      {/* Header */}
      <div
        className="text-center px-4 py-3 rounded-xl mb-3 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1C3A5E 0%, #3B5C8C 60%, #1C3A5E 100%)' }}
      >
        <p className="font-cinzel font-bold text-base tracking-widest uppercase text-aoe-cream m-0">🐉 Grimório dos Dragões</p>
        <p className="font-nunito text-[0.65rem] tracking-widest text-aoe-cream/50 m-0 mt-0.5">Enciclopédia Dracônica</p>
      </div>

      {/* Busca */}
      <input
        className="tw-input mb-3"
        placeholder="🔍  Buscar dragão ou elemento..."
        value={busca}
        onChange={e => setBusca(e.target.value)}
      />

      {/* Lista por elemento */}
      {elementos.map(elem => {
        const lista = dragoesFiltrados.filter(d => d.elemento === elem);
        if (lista.length === 0) return null;
        return (
          <div key={elem}>
            <SectionDivider label={elem.toUpperCase()} />
            {lista.map(d => (
              <DragaoCard key={d.id} dragao={d} onClick={id => setRoute(`dragao_${id}`)} />
            ))}
          </div>
        );
      })}

      {dragoesFiltrados.length === 0 && (
        <div className="py-10 text-center rounded-xl" style={{ border:`1px dashed ${C.BORDER}`, background: C.BG_CARD }}>
          <p className="text-4xl mb-2 m-0">🐉</p>
          <p className="font-nunito italic text-xs m-0" style={{ color: C.TEXT_MUTED }}>Nenhum dragão encontrado</p>
        </div>
      )}
    </div>
  );
};

export default Dragoes;
