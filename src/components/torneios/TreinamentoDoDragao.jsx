import React, { useState } from 'react';
import { C } from '../../theme.js';
import TorneioLayout from './shared/TorneioLayout.jsx';
import { fmtN } from './shared/RewardRow.jsx';

const ALIMENTOS = [
  { key: 'carne',    label: 'Carne Comum',     pts: 1,   color: '#9A7D56' },
  { key: 'peixe',    label: 'Peixe Dourado',   pts: 5,   color: '#C8A84A' },
  { key: 'frango',   label: 'Frango Real',      pts: 20,  color: '#C87A2C' },
  { key: 'boi',      label: 'Boi Mágico',      pts: 100, color: '#8B6BAE' },
  { key: 'fenix',    label: 'Asa de Fênix',    pts: 500, color: '#A83C2C' },
];

const TreinamentoDoDragao = () => {
  const [qtds,     setQtds]    = useState({ carne:'', peixe:'', frango:'', boi:'', fenix:'' });
  const [tropaSel, setTropaSel] = useState('');
  const [premios,  setPremios]  = useState({ princ:{m:10,b:1000}, meta1:{m:2,b:1000}, meta2:{m:5,b:1000}, meta3:{m:10,b:1000} });
  const hpc = (k,f,v) => setPremios(p=>({ ...p,[k]:{ ...p[k],[f]:v } }));

  const totalPts = ALIMENTOS.reduce((acc,a) => acc + (parseInt(qtds[a.key])||0)*a.pts, 0);

  const inventario = (
    <div>
      <p className="font-nunito font-semibold text-[0.72rem] leading-snug text-justify mb-3 m-0" style={{ color: C.TEXT_SECONDARY }}>
        Insira a quantidade de alimentos utilizados para treinar o seu Dragão.
        Cada tipo de alimento concede pontos diferentes no torneio.
      </p>
      <div className="space-y-2">
        {ALIMENTOS.map(a => (
          <div key={a.key} className="flex items-center gap-2 p-2.5 rounded-lg"
            style={{ background:`${a.color}12`, border:`1px solid ${a.color}44` }}>
            <div className="w-3 h-3 rounded-full shrink-0" style={{ background: a.color }} />
            <span className="font-nunito font-black text-[0.78rem] flex-1" style={{ color: C.TEXT_PRIMARY }}>
              {a.label}
              <span className="font-semibold text-[0.62rem] ml-1.5" style={{ color: C.TEXT_MUTED }}>({a.pts} pts)</span>
            </span>
            <input
              className="tw-input text-center"
              style={{ width:80, padding:'4px 8px' }}
              placeholder="Qtd."
              value={qtds[a.key]}
              onChange={e => setQtds(q=>({ ...q, [a.key]: e.target.value.replace(/\D/g,'') }))}
              inputMode="numeric"
            />
            <span className="font-nunito font-bold text-[0.62rem] whitespace-nowrap shrink-0" style={{ color:a.color, minWidth:46 }}>
              = {fmtN((parseInt(qtds[a.key])||0)*a.pts)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <TorneioLayout
      title="Treinamento do Dragão" icon="🍖" color={C.POWER}
      inventario={inventario}
      totalPts={totalPts} ptsSufixo="pontos"
      metas={[{key:'princ',label:'Prêmio Principal',reqPts:0},{key:'meta1',label:'🏅 Meta 200',reqPts:200},{key:'meta2',label:'🥈 Meta 1.000',reqPts:1000},{key:'meta3',label:'🥇 Meta 5.000',reqPts:5000}]}
      premios={premios} onPremioChange={hpc}
      tropaPremio={tropaSel} onTropaChange={setTropaSel}
    />
  );
};

export default TreinamentoDoDragao;
