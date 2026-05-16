import React, { useState } from 'react';
import { dbTropas } from '../../data/tropas.js';
import TorneioLayout from './shared/TorneioLayout.jsx';
import { fmtN } from './shared/RewardRow.jsx';
import { C } from '../../theme.js';

const sortedTropas = [...dbTropas].sort((a,b) => a.nome.localeCompare(b.nome));
const MULTIS = [1,2,3,4,5,6,7,8,9,10];

const TorneioTreinoTropa = () => {
  const [treinos,   setTreinos]   = useState([{id:1,tropa:'',multi:1,qtd:''}]);
  const [invent,    setInvent]    = useState([{id:1,tropa:'',multi:1,pacotes:'1',qtdPP:''}]);
  const [tropaSel,  setTropaSel]  = useState('');
  const [premios,   setPremios]   = useState({ princ:{m:10,b:1000}, meta1:{m:2,b:1000}, meta2:{m:5,b:1000}, meta3:{m:10,b:1000} });

  const hpc = (k,f,v) => setPremios(p=>({ ...p,[k]:{ ...p[k],[f]:v } }));

  // Quartel
  const hTT = (id,v) => setTreinos(t=>t.map(x=>x.id===id?{...x,tropa:v}:x));
  const hTM = (id,v) => setTreinos(t=>t.map(x=>x.id===id?{...x,multi:parseInt(v)}:x));
  const hTQ = (id,v) => { const n=v.replace(/\D/g,''); setTreinos(t=>t.map(x=>x.id===id?{...x,qtd:n?parseInt(n).toLocaleString('pt-BR'):''}:x)); };

  // Inventário
  const hIT = (id,v) => setInvent(t=>t.map(x=>x.id===id?{...x,tropa:v}:x));
  const hIM = (id,v) => setInvent(t=>t.map(x=>x.id===id?{...x,multi:parseInt(v)}:x));
  const hIP = (id,v) => { const n=v.replace(/\D/g,''); setInvent(t=>t.map(x=>x.id===id?{...x,qtdPP:n?parseInt(n).toLocaleString('pt-BR'):''}:x)); };
  const hIPac = (id,delta) => setInvent(t=>t.map(x=>x.id===id?{...x,pacotes:String(Math.max(1,(parseInt(x.pacotes)||0)+delta))}:x));

  let ptsQ=0, ptsI=0;
  treinos.forEach(t=>{ const o=dbTropas.find(x=>x.nome===t.tropa); const p=o?.poder||1; const q=parseInt((t.qtd||'').replace(/\./g,''))||0; ptsQ+=q*p*(t.multi||1); });
  invent.forEach(t=>{ const o=dbTropas.find(x=>x.nome===t.tropa); const p=o?.poder||1; const pac=parseInt(t.pacotes)||0; const qpp=parseInt((t.qtdPP||'').replace(/\./g,''))||0; ptsI+=pac*qpp*p*(t.multi||1); });
  const totalPts = ptsQ + ptsI;

  const inventario = (
    <div>
      {/* Quartel */}
      <p className="font-nunito font-black text-[0.72rem] tracking-wide uppercase mb-2 m-0" style={{ color: C.TEXT_PRIMARY }}>⚔️ Quartel</p>
      <div className="space-y-2 mb-3">
        {treinos.map(l => {
          const o=dbTropas.find(x=>x.nome===l.tropa); const pu=o?.poder||1; const q=parseInt((l.qtd||'').replace(/\./g,''))||0;
          return (
            <div key={l.id} className="flex items-center gap-1 p-2 rounded-lg" style={{ background:C.BG_SECONDARY, border:`1px solid ${C.BORDER_SOFT}` }}>
              <select className="tw-select" style={{flex:'1.2',minWidth:0,fontSize:'0.75rem',padding:'5px 4px'}} value={l.tropa} onChange={e=>hTT(l.id,e.target.value)}>
                <option value="">— Tropa —</option>
                {sortedTropas.map(t=><option key={t.nome} value={t.nome}>{t.nome}</option>)}
              </select>
              <select className="tw-select-sm" value={l.multi} onChange={e=>hTM(l.id,e.target.value)}>
                {MULTIS.map(v=><option key={v} value={v}>x{v}</option>)}
              </select>
              <input className="tw-input text-center" style={{width:68,padding:'4px 4px',fontSize:'0.75rem'}} placeholder="Qtd." value={l.qtd} onChange={e=>hTQ(l.id,e.target.value)} inputMode="numeric" />
              <span className="font-nunito font-bold text-[0.6rem] whitespace-nowrap shrink-0" style={{ color:C.POWER, minWidth:46 }}>⭐{fmtN(q*pu*(l.multi||1))}</span>
              <button className="w-6 h-6 flex items-center justify-center rounded border-none cursor-pointer text-xs" style={{ color:C.ERROR, background:'transparent' }} onClick={()=>{if(treinos.length>1)setTreinos(t=>t.filter(x=>x.id!==l.id))}}>✕</button>
            </div>
          );
        })}
        <button className="btn-ghost btn-sm w-full" onClick={()=>setTreinos(t=>[...t,{id:Date.now(),tropa:'',multi:1,qtd:''}])}>＋</button>
      </div>
      {/* Inventário */}
      <p className="font-nunito font-black text-[0.72rem] tracking-wide uppercase mb-2 m-0" style={{ color: C.TEXT_PRIMARY }}>🎒 Mochila</p>
      <div className="space-y-2">
        {invent.map(l => {
          const o=dbTropas.find(x=>x.nome===l.tropa); const pu=o?.poder||1; const pac=parseInt(l.pacotes)||0; const qpp=parseInt((l.qtdPP||'').replace(/\./g,''))||0;
          return (
            <div key={l.id} className="flex items-center gap-1 p-2 rounded-lg" style={{ background:C.BG_SECONDARY, border:`1px solid ${C.BORDER_SOFT}` }}>
              <select className="tw-select" style={{flex:'1',minWidth:0,fontSize:'0.75rem',padding:'5px 4px'}} value={l.tropa} onChange={e=>hIT(l.id,e.target.value)}>
                <option value="">— Tropa —</option>
                {sortedTropas.map(t=><option key={t.nome} value={t.nome}>{t.nome}</option>)}
              </select>
              <select className="tw-select-sm" value={l.multi} onChange={e=>hIM(l.id,e.target.value)}>
                {MULTIS.map(v=><option key={v} value={v}>x{v}</option>)}
              </select>
              <div className="flex items-center gap-0.5 shrink-0">
                <button className="w-5 h-5 rounded border-none cursor-pointer font-bold text-xs flex items-center justify-center" style={{ background:C.BG_CARD, border:`1px solid ${C.BORDER_SOFT}`, color:C.TEXT_PRIMARY }} onClick={()=>hIPac(l.id,-1)}>−</button>
                <span className="font-mono font-black text-sm text-center" style={{ color:C.TEXT_PRIMARY, minWidth:20 }}>{l.pacotes}</span>
                <button className="w-5 h-5 rounded border-none cursor-pointer font-bold text-xs flex items-center justify-center" style={{ background:C.BG_CARD, border:`1px solid ${C.BORDER_SOFT}`, color:C.TEXT_PRIMARY }} onClick={()=>hIPac(l.id,1)}>+</button>
              </div>
              <input className="tw-input text-center" style={{width:64,padding:'4px 3px',fontSize:'0.72rem'}} placeholder="/pacote" value={l.qtdPP} onChange={e=>hIP(l.id,e.target.value)} inputMode="numeric" />
              <button className="w-6 h-6 flex items-center justify-center rounded border-none cursor-pointer text-xs" style={{ color:C.ERROR, background:'transparent' }} onClick={()=>{if(invent.length>1)setInvent(t=>t.filter(x=>x.id!==l.id))}}>✕</button>
            </div>
          );
        })}
        <button className="btn-ghost btn-sm w-full" onClick={()=>setInvent(t=>[...t,{id:Date.now(),tropa:'',multi:1,pacotes:'1',qtdPP:''}])}>＋</button>
      </div>
    </div>
  );

  return (
    <TorneioLayout
      title="Treino de Tropa" icon="🎯" color={C.ERROR}
      inventario={inventario}
      totalPts={totalPts} ptsSufixo="pontos"
      metas={[{key:'princ',label:'Prêmio Principal',reqPts:0},{key:'meta1',label:'🏅 Meta 1',reqPts:500000},{key:'meta2',label:'🥈 Meta 2',reqPts:2000000},{key:'meta3',label:'🥇 Meta 3',reqPts:8000000}]}
      premios={premios} onPremioChange={hpc}
      tropaPremio={tropaSel} onTropaChange={setTropaSel}
    />
  );
};

export default TorneioTreinoTropa;
