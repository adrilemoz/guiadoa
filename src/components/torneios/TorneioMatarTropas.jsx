import React, { useState } from 'react';
import { dbTropas } from '../../data/tropas.js';
import TorneioLayout from './shared/TorneioLayout.jsx';
import { fmtN } from './shared/RewardRow.jsx';
import { C } from '../../theme.js';

const sortedTropas = [...dbTropas].sort((a,b) => a.nome.localeCompare(b.nome));

const TorneioMatarTropas = () => {
  const [abates, setAbates] = useState([{id:1,tropa:'',qtd:''}]);
  const [tropaSel, setTropaSel] = useState('');
  const [premios, setPremios] = useState({ princ:{m:10,b:1000}, meta1:{m:2,b:1000}, meta2:{m:5,b:1000}, meta3:{m:10,b:1000} });
  const hpc = (k,f,v) => setPremios(p=>({ ...p,[k]:{ ...p[k],[f]:v } }));

  const hTropa = (id,v) => setAbates(a=>a.map(x=>x.id===id?{...x,tropa:v}:x));
  const hQtd   = (id,v) => { const n=v.replace(/\D/g,''); setAbates(a=>a.map(x=>x.id===id?{...x,qtd:n?parseInt(n).toLocaleString('pt-BR'):''}:x)); };

  let totalPts = 0;
  abates.forEach(t=>{ const o=dbTropas.find(x=>x.nome===t.tropa); const q=parseInt((t.qtd||'').replace(/\./g,''))||0; totalPts+=q*(o?.poder||1); });

  const inventario = (
    <div className="space-y-2">
      {abates.map(linha=>{
        const o=dbTropas.find(x=>x.nome===linha.tropa); const p=o?.poder||1; const q=parseInt((linha.qtd||'').replace(/\./g,''))||0;
        return (
          <div key={linha.id} className="flex items-center gap-1.5 p-2 rounded-lg" style={{ background:C.BG_SECONDARY, border:`1px solid ${C.BORDER_SOFT}` }}>
            <select className="tw-select flex-1 min-w-0" value={linha.tropa} onChange={e=>hTropa(linha.id,e.target.value)}>
              <option value="">— Inimigo —</option>
              {sortedTropas.map(t=><option key={t.nome} value={t.nome}>{t.nome}</option>)}
            </select>
            <input className="tw-input text-center" style={{width:72,padding:'4px 6px'}} placeholder="Mortos" value={linha.qtd} onChange={e=>hQtd(linha.id,e.target.value)} inputMode="numeric" />
            <span className="font-nunito font-bold text-[0.62rem] whitespace-nowrap shrink-0" style={{ color:C.ERROR, minWidth:46 }}>☠ {fmtN(q*p)}</span>
            <button className="w-6 h-6 flex items-center justify-center rounded border-none cursor-pointer text-xs font-bold" style={{ color:C.ERROR, background:'transparent', border:`1px solid ${C.ERROR}33` }} onClick={()=>{if(abates.length>1)setAbates(a=>a.filter(x=>x.id!==linha.id))}}>✕</button>
          </div>
        );
      })}
      <button className="btn-ghost btn-sm w-full" onClick={()=>setAbates(a=>[...a,{id:Date.now(),tropa:'',qtd:''}])}>＋ Adicionar Inimigo</button>
    </div>
  );

  return (
    <TorneioLayout
      title="Matar Tropas" icon="☠️" color={C.ERROR}
      inventario={inventario}
      totalPts={totalPts} ptsSufixo="pontos"
      metas={[{key:'princ',label:'Prêmio Principal',reqPts:0},{key:'meta1',label:'🏅 Meta 10K',reqPts:10000},{key:'meta2',label:'🥈 Meta 50K',reqPts:50000},{key:'meta3',label:'🥇 Meta 200K',reqPts:200000}]}
      premios={premios} onPremioChange={hpc}
      tropaPremio={tropaSel} onTropaChange={setTropaSel}
    />
  );
};

export default TorneioMatarTropas;
