import React, { useState } from 'react';
import { C } from '../../theme.js';
import TorneioLayout from './shared/TorneioLayout.jsx';
import { fmtN } from './shared/RewardRow.jsx';

const ITENS_GENERAL = [
  { key: 'medFonte',  label: 'Medalha da Fonte',   pts: 1,   color: '#5C7FA3' },
  { key: 'medOuro',   label: 'Medalha de Ouro',    pts: 5,   color: '#C8A84A' },
  { key: 'medHonra',  label: 'Medalha de Honra',   pts: 20,  color: '#C87A2C' },
  { key: 'medGloria', label: 'Medalha de Glória',  pts: 100, color: '#8B6BAE' },
  { key: 'medLenda',  label: 'Medalha Lendária',   pts: 500, color: '#A83C2C' },
];

const TorneioGeneral = () => {
  const [qtds,     setQtds]     = useState({ medFonte:'', medOuro:'', medHonra:'', medGloria:'', medLenda:'' });
  const [tropaSel, setTropaSel] = useState('');
  const [premios,  setPremios]  = useState({ princ:{m:10,b:1000}, meta1:{m:2,b:1000}, meta2:{m:5,b:1000}, meta3:{m:10,b:1000} });
  const hpc = (k,f,v) => setPremios(p=>({ ...p,[k]:{ ...p[k],[f]:v } }));

  const totalPts = ITENS_GENERAL.reduce((acc,it) => acc + (parseInt(qtds[it.key])||0)*it.pts, 0);

  const inventario = (
    <div className="space-y-2">
      {ITENS_GENERAL.map(it => (
        <div key={it.key} className="flex items-center gap-2 p-2.5 rounded-lg"
          style={{ background:`${it.color}12`, border:`1px solid ${it.color}44` }}>
          <div className="w-3 h-3 rounded-full shrink-0" style={{ background: it.color }} />
          <span className="font-nunito font-black text-[0.75rem] flex-1" style={{ color: C.TEXT_PRIMARY }}>
            {it.label}
            <span className="font-semibold text-[0.62rem] ml-1.5" style={{ color: C.TEXT_MUTED }}>({it.pts} pts)</span>
          </span>
          <input
            className="tw-input text-center"
            style={{ width:80, padding:'4px 8px' }}
            placeholder="Qtd."
            value={qtds[it.key]}
            onChange={e => setQtds(q=>({ ...q, [it.key]: e.target.value.replace(/\D/g,'') }))}
            inputMode="numeric"
          />
          <span className="font-nunito font-bold text-[0.62rem] whitespace-nowrap shrink-0" style={{ color:it.color, minWidth:44 }}>
            = {fmtN((parseInt(qtds[it.key])||0)*it.pts)}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <TorneioLayout
      title="Aprimoramento de General" icon="🎖️" color={C.ERROR}
      inventario={inventario}
      totalPts={totalPts} ptsSufixo="pontos"
      metas={[{key:'princ',label:'Prêmio Principal',reqPts:0},{key:'meta1',label:'🏅 Meta 50',reqPts:50},{key:'meta2',label:'🥈 Meta 200',reqPts:200},{key:'meta3',label:'🥇 Meta 1.000',reqPts:1000}]}
      premios={premios} onPremioChange={hpc}
      tropaPremio={tropaSel} onTropaChange={setTropaSel}
    />
  );
};

export default TorneioGeneral;
