import React, { useState } from 'react';
import { C } from '../../theme.js';
import { dbTropas } from '../../data/tropas.js';
import TorneioLayout from './shared/TorneioLayout.jsx';
import { fmtN } from './shared/RewardRow.jsx';

const METAS_PODER = [
  { key: 'princ', label: 'Prêmio Principal',     reqPts: 0 },
  { key: 'meta1', label: '🏅 Meta 1.000.000',    reqPts: 1_000_000 },
  { key: 'meta2', label: '🥈 Meta 5.000.000',    reqPts: 5_000_000 },
  { key: 'meta3', label: '🥇 Meta 15.000.000',   reqPts: 15_000_000 },
];

const TorneioPoder = () => {
  const [treinos, setTreinos] = useState([{ id:1,tropa:'',qtd:'' }, { id:2,tropa:'',qtd:'' }]);
  const [tropaPremio, setTropaPremio] = useState('');
  const [premios, setPremios] = useState({ princ:{m:10,b:1000}, meta1:{m:2,b:1000}, meta2:{m:5,b:1000}, meta3:{m:10,b:1000} });
  const handlePremioChange = (k,f,v) => setPremios(p => ({ ...p, [k]: { ...p[k], [f]:v } }));

  const handleTropa = (id,v) => setTreinos(t => t.map(x => x.id===id ? {...x,tropa:v} : x));
  const handleQtd   = (id,v) => { const n=v.replace(/\D/g,''); setTreinos(t => t.map(x => x.id===id ? {...x,qtd: n ? parseInt(n).toLocaleString('pt-BR') : ''} : x)); };
  const add = () => setTreinos(t => [...t, {id:Date.now(),tropa:'',qtd:''}]);
  const rm  = (id) => { if (treinos.length > 1) setTreinos(t => t.filter(x => x.id!==id)); };

  let totalPts = 0;
  treinos.forEach(t => {
    const obj = dbTropas.find(x => x.nome===t.tropa);
    const p = obj?.poder || 0;
    const q = parseInt(t.qtd.replace(/\./g,'')) || 0;
    totalPts += q * p;
  });

  const sortedTropas = [...dbTropas].sort((a,b) => a.nome.localeCompare(b.nome));

  const inventario = (
    <div className="space-y-2">
      {treinos.map(linha => {
        const obj = dbTropas.find(x => x.nome===linha.tropa);
        const pUnit = obj?.poder || 0;
        const q = parseInt(linha.qtd.replace(/\./g,'')) || 0;
        return (
          <div key={linha.id} className="flex items-center gap-1.5 p-2 rounded-lg" style={{ background: C.BG_SECONDARY, border:`1px solid ${C.BORDER_SOFT}` }}>
            <select className="tw-select flex-1 min-w-0" value={linha.tropa} onChange={e => handleTropa(linha.id, e.target.value)}>
              <option value="">— Tropa —</option>
              {sortedTropas.map(t => <option key={t.nome} value={t.nome}>{t.nome}</option>)}
            </select>
            <input className="tw-input text-center" style={{width:80,padding:'4px 6px'}} placeholder="Qtd." value={linha.qtd} onChange={e => handleQtd(linha.id, e.target.value)} inputMode="numeric" />
            <span className="font-nunito font-bold text-[0.65rem] whitespace-nowrap shrink-0" style={{ color: C.POWER, minWidth:52 }}>
              ⭐ {fmtN(q*pUnit)}
            </span>
            <button className="w-6 h-6 flex items-center justify-center rounded shrink-0 border-none cursor-pointer text-xs font-bold"
              style={{ color: C.ERROR, background: 'transparent', border: `1px solid ${C.ERROR}33` }}
              onClick={() => rm(linha.id)}>✕</button>
          </div>
        );
      })}
      <button className="btn-ghost btn-sm w-full" onClick={add}>＋ Adicionar Tropa</button>
    </div>
  );

  return (
    <TorneioLayout
      title="Torneio de Poder" icon="⚡" color={C.WARNING}
      inventario={inventario}
      totalPts={totalPts} ptsSufixo="poder"
      metas={METAS_PODER} premios={premios} onPremioChange={handlePremioChange}
      tropaPremio={tropaPremio} onTropaChange={setTropaPremio}
    />
  );
};

export default TorneioPoder;
