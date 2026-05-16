import React, { useState } from 'react';
import { C } from '../../theme.js';
import { dbTropas } from '../../data/tropas.js';
import TorneioLayout from './shared/TorneioLayout.jsx';
import { fmtN } from './shared/RewardRow.jsx';

const sortedTropas = [...dbTropas].sort((a,b) => a.nome.localeCompare(b.nome));

// ── helper: multi-linha treino (reutilizado) ─────────────────────────────────
const MultiTreinoList = ({ treinos, onTropa, onQtd, onAdd, onRm, showSubtotal }) => (
  <div className="space-y-2">
    {treinos.map(linha => {
      const obj = dbTropas.find(x => x.nome===linha.tropa);
      const pUnit = obj?.poder || 0;
      const q = parseInt((linha.qtd||'').replace(/\./g,'')) || 0;
      return (
        <div key={linha.id} className="flex items-center gap-1.5 p-2 rounded-lg" style={{ background: C.BG_SECONDARY, border:`1px solid ${C.BORDER_SOFT}` }}>
          <select className="tw-select flex-1 min-w-0" value={linha.tropa} onChange={e => onTropa(linha.id, e.target.value)}>
            <option value="">— Tropa —</option>
            {sortedTropas.map(t => <option key={t.nome} value={t.nome}>{t.nome}</option>)}
          </select>
          <input className="tw-input text-center" style={{width:76,padding:'4px 6px'}} placeholder="Qtd." value={linha.qtd}
            onChange={e => onQtd(linha.id, e.target.value)} inputMode="numeric" />
          {showSubtotal && (
            <span className="font-nunito font-bold text-[0.62rem] whitespace-nowrap shrink-0" style={{ color: C.POWER, minWidth: 50 }}>
              ⭐ {fmtN(q*pUnit)}
            </span>
          )}
          <button className="w-6 h-6 flex items-center justify-center rounded border-none cursor-pointer text-xs font-bold"
            style={{ color: C.ERROR, background: 'transparent', border:`1px solid ${C.ERROR}33` }}
            onClick={() => onRm(linha.id)}>✕</button>
        </div>
      );
    })}
    <button className="btn-ghost btn-sm w-full" onClick={onAdd}>＋ Adicionar Tropa</button>
  </div>
);

// ── helper: input poder simples ──────────────────────────────────────────────
const PoderInput = ({ label, value, onChange }) => {
  const handleChange = e => {
    const n = e.target.value.replace(/\D/g,'');
    onChange(n ? parseInt(n).toLocaleString('pt-BR') : '');
  };
  return (
    <div>
      <label className="font-nunito font-bold text-[0.65rem] tracking-wider uppercase block mb-1.5" style={{ color: C.TEXT_MUTED }}>{label}</label>
      <input className="tw-input text-center font-mono text-base font-black" value={value} onChange={handleChange} inputMode="numeric" placeholder="0" />
    </div>
  );
};

// ────────────────────────────────────────────────────────────────────────────
// TorneioAlianca
// ────────────────────────────────────────────────────────────────────────────
const TorneioAlianca = () => {
  const [treinos, setTreinos] = useState([{id:1,tropa:'',qtd:''},{id:2,tropa:'',qtd:''}]);
  const [tropaSel, setTropaSel] = useState('');
  const [premios, setPremios] = useState({ princ:{m:10,b:1000}, meta1:{m:2,b:1000}, meta2:{m:5,b:1000}, meta3:{m:10,b:1000} });
  const handlePremioChange = (k,f,v) => setPremios(p => ({ ...p, [k]: { ...p[k], [f]:v } }));

  const handleTropa = (id,v) => setTreinos(t => t.map(x => x.id===id ? {...x,tropa:v} : x));
  const handleQtd   = (id,v) => { const n=v.replace(/\D/g,''); setTreinos(t => t.map(x => x.id===id ? {...x,qtd: n ? parseInt(n).toLocaleString('pt-BR') : ''} : x)); };

  let totalPts = 0;
  treinos.forEach(t => {
    const o=dbTropas.find(x=>x.nome===t.tropa); const q=parseInt((t.qtd||'').replace(/\./g,''))||0;
    totalPts += q*(o?.poder||0);
  });

  return (
    <TorneioLayout
      title="Poder de Aliança" icon="🤝" color={C.SUCCESS}
      inventario={<MultiTreinoList treinos={treinos} onTropa={handleTropa} onQtd={handleQtd} onAdd={() => setTreinos(t=>[...t,{id:Date.now(),tropa:'',qtd:''}])} onRm={id=>{if(treinos.length>1)setTreinos(t=>t.filter(x=>x.id!==id))}} showSubtotal />}
      totalPts={totalPts} ptsSufixo="poder"
      metas={[{key:'princ',label:'Prêmio Principal',reqPts:0},{key:'meta1',label:'🏅 Meta 1M',reqPts:1000000},{key:'meta2',label:'🥈 Meta 5M',reqPts:5000000},{key:'meta3',label:'🥇 Meta 20M',reqPts:20000000}]}
      premios={premios} onPremioChange={handlePremioChange}
      tropaPremio={tropaSel} onTropaChange={setTropaSel}
    />
  );
};
export default TorneioAlianca;
