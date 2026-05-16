import React, { useState } from 'react';
import { C } from '../../theme.js';
import TorneioLayout from './shared/TorneioLayout.jsx';
import { fmtN } from './shared/RewardRow.jsx';

const ITENS = [
  { key: 'verde',   label: 'Verde',   pts: 20,    color: '#5A8A5C' },
  { key: 'azul',    label: 'Azul',    pts: 30,    color: '#5C7FA3' },
  { key: 'roxo',    label: 'Roxo',    pts: 800,   color: '#8B6BAE' },
  { key: 'laranja', label: 'Laranja', pts: 12000, color: '#C87A2C' },
];

const PontosTalisma = () => {
  const [qtds, setQtds] = useState({ verde: '', azul: '', roxo: '', laranja: '' });
  const [tropaSel, setTropaSel] = useState('');
  const [premios, setPremios] = useState({ princ: {m:10,b:1000}, meta1:{m:2,b:1000}, meta2:{m:5,b:1000}, meta3:{m:10,b:1000} });

  const handlePremioChange = (k, f, v) => setPremios(p => ({ ...p, [k]: { ...p[k], [f]: v } }));

  const totalPontos = ITENS.reduce((acc, it) => acc + (parseInt(qtds[it.key]) || 0) * it.pts, 0);

  const METAS = [
    { key: 'princ', label: 'Prêmio Principal', reqPts: 0 },
    { key: 'meta1', label: '🏅 Meta 100 pts',   reqPts: 100 },
    { key: 'meta2', label: '🥈 Meta 200 pts',   reqPts: 200 },
    { key: 'meta3', label: '🥇 Meta 400 pts',   reqPts: 400 },
  ];

  const inventario = (
    <div className="space-y-2">
      {ITENS.map(it => (
        <div key={it.key} className="flex items-center gap-2 p-2 rounded-lg"
          style={{ background: `${it.color}12`, border: `1px solid ${it.color}44` }}>
          <div className="w-3 h-3 rounded-full shrink-0" style={{ background: it.color }} />
          <span className="font-nunito font-black text-[0.75rem] flex-1" style={{ color: C.TEXT_PRIMARY }}>
            {it.label} <span className="font-semibold text-[0.65rem]" style={{ color: C.TEXT_MUTED }}>({fmtN(it.pts)} pts/un.)</span>
          </span>
          <input className="tw-input text-center" style={{ width: 80, padding: '4px 8px' }}
            placeholder="Qtd." value={qtds[it.key]}
            onChange={e => setQtds(q => ({ ...q, [it.key]: e.target.value.replace(/\D/g,'') }))}
            inputMode="numeric" />
        </div>
      ))}
    </div>
  );

  return (
    <TorneioLayout
      title="Pontos de Talismã" icon="🧿" color={C.POWER}
      inventario={inventario}
      totalPts={totalPontos} ptsSufixo="pontos"
      metas={METAS} premios={premios} onPremioChange={handlePremioChange}
      tropaPremio={tropaSel} onTropaChange={setTropaSel}
    />
  );
};

export default PontosTalisma;
