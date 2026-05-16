import React, { useState } from 'react';
import { dbTropas } from '../../db.js';
import { C } from '../../theme.js';
import Toast from '../../ui/Toast.jsx';
import TorneioLayout from './shared/TorneioLayout.jsx';
import { fmtN } from './shared/RewardRow.jsx';

const CATEGORIAS = [
  { cat: 1, itens: 'Fóssil do Ancião 1 & Relíquia Diabólica 1', tropas: 'Minotauros, Arqueiros e Dragões de Ataque Rápido.' },
  { cat: 2, itens: 'Fóssil do Ancião 1 & Relíquia Diabólica 1', tropas: 'Dragões de Combate.' },
  { cat: 3, itens: 'Fóssil do Ancião 1 & Relíquia Diabólica 1', tropas: 'Andarilhos da Areia e Hoplitas.' },
  { cat: 4, itens: 'Fóssil do Ancião 1 & Relíquia Diabólica 1', tropas: 'Gigantes, Abissais, Terrores do Pântano.' },
  { cat: 5, itens: 'Fóssil do Ancião 1 & Relíquia Diabólica 1', tropas: 'Espelhos de Fogo, Bigas de Fogo, Serpente Vingativa, Canhão Elétrico, Amarande.' },
  { cat: 6, itens: 'Fóssil do Ancião 2 & Relíquia Diabólica 2', tropas: 'Ogro de Granito, Serpente Arsênica, Dragonete da Tempestade, Magmassauros, Guerreiro do Magma.' },
  { cat: 7, itens: 'Fóssil do Ancião 2 & Relíquia Diabólica 2', tropas: 'Titã Petrificado, Dragão do Veneno, Golem do Trovão, Gigante do Gelo, Leviatã Ártico, Cavaleiro Dragão, Centauros Infernais, Condenadores, Cavaleiros Espectrais.' },
  { cat: 8, itens: 'Fóssil do Ancião 2 & Relíquia Diabólica 2', tropas: 'Perseguidor das Sombras, Escaravelho de Guerra, Arruinador Dimensional, Megalibgwilia, Medusa, Gatuno Alado.' },
  { cat: 9, itens: 'Fóssil do Ancião 2 & Relíquia Diabólica 2', tropas: 'Esmagadores Colossais, Fantasma do Trovão, Lordes da Lava.' },
];

const EvolucaoTropas = () => {
  const [qtdA1, setQtdA1] = useState(localStorage.getItem('doa_fossil_a1') || '');
  const [qtdC1, setQtdC1] = useState(localStorage.getItem('doa_fossil_c1') || '');
  const [qtdA2, setQtdA2] = useState(localStorage.getItem('doa_fossil_a2') || '');
  const [qtdC2, setQtdC2] = useState(localStorage.getItem('doa_fossil_c2') || '');
  const [tropaSel, setTropaSel] = useState(localStorage.getItem('doa_evo_tropa') || '');
  const [premios, setPremios] = useState({ princ: { m:10, b:1000 }, b5: { m:2, b:1000 }, b10: { m:5, b:1000 }, b20: { m:10, b:1000 } });
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [showCat, setShowCat] = useState(false);

  const handlePremioChange = (key, field, val) => setPremios(p => ({ ...p, [key]: { ...p[key], [field]: val } }));

  const handleSave = () => {
    localStorage.setItem('doa_fossil_a1', qtdA1);
    localStorage.setItem('doa_fossil_c1', qtdC1);
    localStorage.setItem('doa_fossil_a2', qtdA2);
    localStorage.setItem('doa_fossil_c2', qtdC2);
    localStorage.setItem('doa_evo_tropa', tropaSel);
    setToast({ open: true, message: 'Inventário guardado com sucesso!', severity: 'success' });
  };

  const qA1 = parseInt(qtdA1) || 0;
  const qC1 = parseInt(qtdC1) || 0;
  const qA2 = parseInt(qtdA2) || 0;
  const qC2 = parseInt(qtdC2) || 0;
  const totalItens = qA1 + qC1 + qA2 + qC2;
  const pontos = Math.floor(totalItens / 10);

  const METAS = [
    { key: 'princ', label: 'Prêmio Principal', reqPts: 0 },
    { key: 'b5',    label: '🏅 Bônus 5 pts',   reqPts: 5 },
    { key: 'b10',   label: '🥈 Bônus 10 pts',  reqPts: 10 },
    { key: 'b20',   label: '🥇 Bônus 20 pts',  reqPts: 20 },
  ];

  const inventario = (
    <div className="space-y-2">
      {/* Linha 1: Ancião */}
      <div className="flex items-center gap-1.5 p-2.5 rounded-lg" style={{ background: 'rgba(90,138,92,0.08)', border: `1px solid rgba(90,138,92,0.3)` }}>
        <span className="text-lg shrink-0">🦴</span>
        <div className="flex-1 min-w-0">
          <p className="font-nunito font-black text-[0.7rem] m-0 mb-1" style={{ color: C.TEXT_PRIMARY }}>Fóssil Ancião 1</p>
          <input className="tw-input text-center" placeholder="Qtd." value={qtdA1} onChange={e => setQtdA1(e.target.value.replace(/\D/g,''))} inputMode="numeric" />
        </div>
        <div className="text-aoe-gold opacity-40 text-lg self-center">|</div>
        <div className="flex-1 min-w-0">
          <p className="font-nunito font-black text-[0.7rem] m-0 mb-1" style={{ color: C.TEXT_PRIMARY }}>Relíquia Diab. 1</p>
          <input className="tw-input text-center" placeholder="Qtd." value={qtdC1} onChange={e => setQtdC1(e.target.value.replace(/\D/g,''))} inputMode="numeric" />
        </div>
      </div>
      {/* Linha 2: Ancião 2 */}
      <div className="flex items-center gap-1.5 p-2.5 rounded-lg" style={{ background: 'rgba(139,107,174,0.08)', border: `1px solid rgba(139,107,174,0.3)` }}>
        <span className="text-lg shrink-0">💎</span>
        <div className="flex-1 min-w-0">
          <p className="font-nunito font-black text-[0.7rem] m-0 mb-1" style={{ color: C.TEXT_PRIMARY }}>Fóssil Ancião 2</p>
          <input className="tw-input text-center" placeholder="Qtd." value={qtdA2} onChange={e => setQtdA2(e.target.value.replace(/\D/g,''))} inputMode="numeric" />
        </div>
        <div className="text-aoe-gold opacity-40 text-lg self-center">|</div>
        <div className="flex-1 min-w-0">
          <p className="font-nunito font-black text-[0.7rem] m-0 mb-1" style={{ color: C.TEXT_PRIMARY }}>Relíquia Diab. 2</p>
          <input className="tw-input text-center" placeholder="Qtd." value={qtdC2} onChange={e => setQtdC2(e.target.value.replace(/\D/g,''))} inputMode="numeric" />
        </div>
      </div>
      {/* Resumo */}
      <div className="flex gap-2 text-center">
        <div className="flex-1 py-1.5 rounded-lg" style={{ background: C.BG_SECONDARY, border: `1px solid ${C.BORDER_SOFT}` }}>
          <p className="font-nunito font-bold text-[0.6rem] uppercase tracking-wider m-0" style={{ color: C.TEXT_MUTED }}>Total Itens</p>
          <p className="font-nunito font-black text-sm m-0" style={{ color: C.TEXT_PRIMARY }}>{fmtN(totalItens)}</p>
        </div>
        <div className="flex-1 py-1.5 rounded-lg" style={{ background: C.BG_SECONDARY, border: `1px solid ${C.BORDER_SOFT}` }}>
          <p className="font-nunito font-bold text-[0.6rem] uppercase tracking-wider m-0" style={{ color: C.TEXT_MUTED }}>Pontos</p>
          <p className="font-nunito font-black text-sm m-0" style={{ color: C.ACCENT_DEEP }}>{pontos}</p>
        </div>
        <div className="flex-1 py-1.5 rounded-lg" style={{ background: C.BG_SECONDARY, border: `1px solid ${C.BORDER_SOFT}` }}>
          <p className="font-nunito font-bold text-[0.6rem] uppercase tracking-wider m-0" style={{ color: C.TEXT_MUTED }}>Sobram</p>
          <p className="font-nunito font-black text-sm m-0" style={{ color: C.TEXT_SECONDARY }}>{totalItens % 10}</p>
        </div>
      </div>
      <button className="btn-success btn-sm w-full" onClick={handleSave}>💾 Guardar Inventário</button>
    </div>
  );

  const extraInfo = (
    <div>
      <button className="w-full font-nunito font-bold text-[0.72rem] tracking-wider py-2 rounded-lg mb-2 border-none cursor-pointer"
        style={{ background: C.BG_SECONDARY, border: `1px solid ${C.BORDER_SOFT}`, color: C.TEXT_MUTED }}
        onClick={() => setShowCat(v => !v)}>
        {showCat ? '▾' : '▸'} CATEGORIAS DE TROPAS
      </button>
      {showCat && (
        <div className="tw-card p-3 space-y-1.5">
          {CATEGORIAS.map(cat => (
            <div key={cat.cat} className="p-2 rounded-md" style={{ background: C.BG_SECONDARY, border: `1px solid ${C.BORDER_SOFT}` }}>
              <div className="flex items-start gap-1.5">
                <span className="font-nunito font-black text-[0.65rem] px-1.5 py-0.5 rounded shrink-0" style={{ background: C.ACCENT, color: '#FFF8EE' }}>CAT {cat.cat}</span>
                <div>
                  <p className="font-nunito font-bold text-[0.65rem] m-0" style={{ color: C.TEXT_MUTED }}>{cat.itens}</p>
                  <p className="font-nunito font-semibold text-[0.7rem] m-0 mt-0.5" style={{ color: C.TEXT_SECONDARY }}>{cat.tropas}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <>
      <Toast {...toast} onClose={() => setToast(t => ({ ...t, open: false }))} />
      <TorneioLayout
        title="Evolução de Tropas" icon="⭐" color={C.WARNING}
        inventario={inventario}
        totalPts={pontos} ptsSufixo="pontos"
        metas={METAS} premios={premios} onPremioChange={handlePremioChange}
        tropaPremio={tropaSel} onTropaChange={setTropaSel}
        extraInfo={extraInfo}
      />
    </>
  );
};

export default EvolucaoTropas;
