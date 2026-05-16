import React, { useState } from 'react';
import { getDragaoById } from '../../data/dragoes.js';
import { C } from '../../theme.js';

const SectionDivider = ({ label }) => (
  <div className="flex items-center gap-2 my-2.5">
    <div className="flex-1 h-px" style={{ background:`linear-gradient(90deg,transparent,${C.BORDER})` }} />
    <span style={{ color:C.ACCENT, fontSize:'0.65rem' }}>◆</span>
    <span className="font-nunito font-bold text-[0.65rem] tracking-widest whitespace-nowrap uppercase" style={{ color:C.TEXT_MUTED }}>{label}</span>
    <span style={{ color:C.ACCENT, fontSize:'0.65rem' }}>◆</span>
    <div className="flex-1 h-px" style={{ background:`linear-gradient(270deg,transparent,${C.BORDER})` }} />
  </div>
);

const TipoBadge = ({ campo }) => (
  <span
    className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[0.58rem] font-nunito font-black tracking-wide leading-tight"
    style={{
      background: campo ? '#7B1C1C' : '#1B5E20',
      border: `1px solid ${campo ? '#A52020' : '#2E7D32'}`,
      color: campo ? '#FFCDD2' : '#C8E6C9',
    }}
  >
    {campo ? '🏅' : '⚔️'} {campo ? 'Efeito em Campo' : 'Efeito de Batalha'}
  </span>
);

const HabilidadeCard = ({ hab, cor, index }) => {
  const [expandido, setExpandido] = useState(false);
  const isCampo = hab.tipo?.toLowerCase().includes('campo');
  const xpPercent = (() => {
    if (!hab.nivelAtual?.xp) return 0;
    const parts = hab.nivelAtual.xp.split('/');
    if (parts.length !== 2) return 0;
    return Math.min(100, (parseFloat(parts[0]) / parseFloat(parts[1])) * 100);
  })();

  return (
    <div
      onClick={() => setExpandido(v=>!v)}
      className="rounded-xl overflow-hidden mb-3 cursor-pointer transition-all"
      style={{ border:`1.5px solid ${C.BORDER_SOFT}`, animation:`reveal-up 0.35s ${0.08+index*0.07}s ease both` }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-3.5 py-2.5"
        style={{ background:`linear-gradient(135deg,rgba(62,47,28,0.92) 0%,${cor}55 100%)`, borderBottom:`1px solid ${cor}44` }}>
        <div className="w-11 h-11 shrink-0 flex items-center justify-center text-2xl rounded-xl"
          style={{ background:`linear-gradient(135deg,${cor}33,${cor}66)`, border:`1.5px solid ${cor}88`, boxShadow:`0 2px 8px ${cor}44` }}>
          {hab.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-nunito font-black text-[0.9rem] m-0 leading-tight" style={{ color:'#FFF8EE' }}>
            {hab.nome}
            {hab.nivelAtual?.nivel != null && (
              <span className="text-[0.65rem] font-bold ml-1.5" style={{ color:'rgba(255,248,238,0.5)' }}>Nv.{hab.nivelAtual.nivel}</span>
            )}
          </p>
          {hab.nivelAtual?.xp && (
            <div className="mt-1">
              <div className="flex justify-between mb-0.5">
                <span className="font-nunito text-[0.58rem]" style={{ color:'rgba(255,248,238,0.45)' }}>{hab.nivelAtual.xp}</span>
              </div>
              <div className="h-1 rounded-full overflow-hidden" style={{ background:'rgba(255,255,255,0.15)' }}>
                <div style={{ height:'100%', width:`${xpPercent}%`, background:`linear-gradient(90deg,${cor},#FFD700)` }} />
              </div>
            </div>
          )}
          {hab.nivelAtual?.duracao && (
            <p className="font-nunito font-semibold text-[0.62rem] mt-0.5 m-0" style={{ color:'rgba(255,248,238,0.6)' }}>
              ⏱ {hab.nivelAtual.duracao}
            </p>
          )}
        </div>
        <span className="text-xl leading-none transition-transform" style={{ color:'rgba(255,248,238,0.45)', transform:expandido?'rotate(90deg)':'rotate(0deg)' }}>›</span>
      </div>

      {/* Painéis lado a lado */}
      <div className="grid grid-cols-2">
        {/* Nível atual */}
        <div className="p-3" style={{ background:C.BG_CARD, borderRight:`1px solid ${C.BORDER_SOFT}` }}>
          <p className="font-nunito font-black text-[0.68rem] m-0 mb-1.5" style={{ color:C.TEXT_PRIMARY }}>Nível atual</p>
          {hab.nivelAtual?.defesa && <p className="font-nunito font-bold text-[0.65rem] m-0 mb-1.5" style={{ color:C.DEFENSE }}>🛡 {hab.nivelAtual.defesa}</p>}
          <TipoBadge campo={isCampo} />
          <p className="font-nunito font-semibold text-[0.73rem] leading-relaxed mt-1.5 m-0" style={{
            color:C.TEXT_SECONDARY, display:expandido?'block':'-webkit-box',
            WebkitLineClamp:expandido?'unset':4, WebkitBoxOrient:'vertical', overflow:expandido?'visible':'hidden',
          }}>
            {hab.nivelAtual?.descricao}
          </p>
        </div>
        {/* Nível máx */}
        <div className="p-3 relative" style={{ background:`linear-gradient(180deg,${C.BG_CARD_TOP} 0%,${C.BG_CARD} 100%)` }}>
          <span className="absolute left-[-8px] top-1/2 -translate-y-1/2 text-base" style={{ color:cor, opacity:0.5 }}>›</span>
          <p className="font-nunito font-black text-[0.68rem] m-0 mb-1.5" style={{ color:'#A05820' }}>Nível máx.</p>
          {hab.nivelMax?.defesa && <p className="font-nunito font-bold text-[0.65rem] m-0 mb-1.5" style={{ color:C.ENERGY }}>🛡 {hab.nivelMax.defesa}</p>}
          <TipoBadge campo={isCampo} />
          <p className="font-nunito font-semibold text-[0.73rem] leading-relaxed mt-1.5 m-0" style={{
            color:C.TEXT_SECONDARY, display:expandido?'block':'-webkit-box',
            WebkitLineClamp:expandido?'unset':4, WebkitBoxOrient:'vertical', overflow:expandido?'visible':'hidden',
          }}>
            {hab.nivelMax?.descricao}
          </p>
        </div>
      </div>

      {/* Ver mais */}
      {!expandido && (
        <div className="text-center py-1.5" style={{ background:'rgba(184,150,90,0.06)', borderTop:`1px solid ${C.BORDER_SOFT}` }}>
          <span className="font-nunito font-bold text-[0.62rem] tracking-widest" style={{ color:C.TEXT_FAINT }}>VER COMPLETO ▸</span>
        </div>
      )}
    </div>
  );
};

const DragaoDetalhe = ({ dragaoId, setRoute }) => {
  const dragao = getDragaoById(dragaoId);

  if (!dragao) {
    return (
      <div className="text-center py-12 px-4">
        <p className="text-5xl mb-3 m-0">🐉</p>
        <p className="font-nunito font-black text-base m-0 mb-2" style={{ color:C.ERROR }}>Dragão não encontrado</p>
        <button className="btn-ghost" onClick={() => setRoute?.('dragoes')}>← Voltar</button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto pb-4" style={{ animation:'reveal-up 0.4s ease both' }}>
      {/* Hero card */}
      <div className="rounded-2xl overflow-hidden mb-3" style={{ border:`2px solid ${dragao.cor}`, boxShadow:`0 4px 20px ${dragao.cor}30` }}>
        {/* Banner colorido */}
        <div className="flex items-center gap-4 px-4 py-4 relative"
          style={{ background:`linear-gradient(135deg, rgba(28,58,94,0.95) 0%, ${dragao.cor}55 100%)` }}>
          {/* Ícone central */}
          <div className="w-20 h-20 shrink-0 flex items-center justify-center text-5xl rounded-2xl"
            style={{ background:`linear-gradient(135deg,${dragao.cor}33,${dragao.cor}66)`, border:`2.5px solid ${dragao.cor}88`, boxShadow:`0 4px 16px ${dragao.cor}55` }}>
            {dragao.emojiDragao}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <p className="font-cinzel font-bold text-xl m-0 leading-tight" style={{ color:'#FFF8EE', textShadow:`0 2px 8px ${dragao.cor}88` }}>{dragao.nome}</p>
              <span className="font-nunito font-black text-[0.62rem] px-2 py-0.5 rounded-full"
                style={{ background:`${dragao.cor}44`, border:`1px solid ${dragao.cor}88`, color:'#FFF8EE' }}>
                {dragao.elemento}
              </span>
            </div>
            <p className="font-nunito font-semibold text-[0.75rem] leading-snug m-0" style={{ color:'rgba(255,248,238,0.7)' }}>
              {dragao.descricao}
            </p>
            {/* Btn tracker */}
            <button
              className="mt-2 font-nunito font-black text-[0.65rem] px-3 py-1 rounded-md tracking-widest uppercase border-none cursor-pointer"
              style={{ background:`${dragao.cor}44`, border:`1.5px solid ${dragao.cor}88`, color:'#FFF8EE' }}
              onClick={() => setRoute?.(`dragao_tracker_${dragao.id}`)}
            >
              📊 Tracker de Progresso
            </button>
          </div>
        </div>
      </div>

      {/* Habilidades */}
      <SectionDivider label={`HABILIDADES — ${dragao.nome.toUpperCase()}`} />
      {dragao.habilidades?.length > 0 ? (
        dragao.habilidades.map((hab, i) => (
          <HabilidadeCard key={hab.id || i} hab={hab} cor={dragao.cor} index={i} />
        ))
      ) : (
        <div className="py-8 text-center rounded-xl" style={{ border:`1px dashed ${C.BORDER}`, background:C.BG_CARD }}>
          <p className="font-nunito italic text-sm m-0" style={{ color:C.TEXT_MUTED }}>Habilidades ainda não registadas para este dragão.</p>
        </div>
      )}
    </div>
  );
};

export default DragaoDetalhe;
