import React, { useState } from 'react';
import { C } from '../../theme.js';
import TorneioLayout from './shared/TorneioLayout.jsx';
import { fmtN } from './shared/RewardRow.jsx';

const ESSENCIAS = [
  { key: 'e1', label: 'Essência Comum',    pts: 1,    color: '#9A7D56' },
  { key: 'e2', label: 'Essência Rara',     pts: 10,   color: '#5C7FA3' },
  { key: 'e3', label: 'Essência Épica',    pts: 100,  color: '#8B6BAE' },
  { key: 'e4', label: 'Essência Lendária', pts: 1000, color: '#C87A2C' },
];

const TorneioHabilidadeDragao = () => {
  const [qtds,     setQtds]    = useState({ e1:'', e2:'', e3:'', e4:'' });
  const [tropaSel, setTropaSel] = useState('');
  const [premios,  setPremios]  = useState({ princ:{m:10,b:1000}, meta1:{m:2,b:1000}, meta2:{m:5,b:1000}, meta3:{m:10,b:1000} });
  const hpc = (k,f,v) => setPremios(p=>({ ...p,[k]:{ ...p[k],[f]:v } }));

  const totalPts = ESSENCIAS.reduce((acc,e) => acc + (parseInt(qtds[e.key])||0)*e.pts, 0);

  const inventario = (
    <div className="space-y-2">
      {ESSENCIAS.map(e => (
        <div key={e.key} className="flex items-center gap-2 p-2.5 rounded-lg"
          style={{ background:`${e.color}12`, border:`1px solid ${e.color}44` }}>
          <div className="w-3 h-3 rounded-full shrink-0" style={{ background: e.color }} />
          <span className="font-nunito font-black text-[0.75rem] flex-1" style={{ color: C.TEXT_PRIMARY }}>
            {e.label}
            <span className="font-semibold text-[0.62rem] ml-1.5" style={{ color: C.TEXT_MUTED }}>({fmtN(e.pts)} pts/un.)</span>
          </span>
          <input
            className="tw-input text-center"
            style={{ width:80, padding:'4px 8px' }}
            placeholder="Qtd."
            value={qtds[e.key]}
            onChange={ev => setQtds(q => ({ ...q, [e.key]: ev.target.value.replace(/\D/g,'') }))}
            inputMode="numeric"
          />
          <span className="font-nunito font-bold text-[0.62rem] whitespace-nowrap shrink-0" style={{ color:e.color, minWidth:48 }}>
            = {fmtN((parseInt(qtds[e.key])||0)*e.pts)}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <TorneioLayout
      title="Habilidade dos Dragões" icon="🐉" color={C.POWER}
      inventario={inventario}
      totalPts={totalPts} ptsSufixo="pontos"
      metas={[{key:'princ',label:'Prêmio Principal',reqPts:0},{key:'meta1',label:'🏅 Meta 500',reqPts:500},{key:'meta2',label:'🥈 Meta 2K',reqPts:2000},{key:'meta3',label:'🥇 Meta 10K',reqPts:10000}]}
      premios={premios} onPremioChange={hpc}
      tropaPremio={tropaSel} onTropaChange={setTropaSel}
    />
  );
};

export default TorneioHabilidadeDragao;
