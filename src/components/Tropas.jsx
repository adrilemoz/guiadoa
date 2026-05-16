import React, { useEffect, useMemo, useState } from 'react';
import { C } from '../theme.js';
import { useTropas } from '../hooks/useTropas.js';
import { STORAGE_KEYS } from '../utils/storage.js';
import GameHeader     from './shared/GameHeader.jsx';
import ExercitoBanner from './tropas/ExercitoBanner.jsx';
import TropaCard      from './tropas/TropaCard.jsx';
import { FILTROS }    from './tropas/tropaUtils.js';

const Tropas = ({ setRoute }) => {
  const { tropas, carregando, origem } = useTropas();

  const [busca,       setBusca]       = useState('');
  const [filtroAtivo, setFiltroAtivo] = useState('Todas');
  const [quantidades, setQuantidades] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TROPAS_QTD);
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TROPAS_QTD, JSON.stringify(quantidades));
  }, [quantidades]);

  const tropasFiltradas = useMemo(() => {
    let base = [...tropas];
    if (filtroAtivo === 'Corpo a Corpo') base = base.filter(t => t.atqPerto >= t.atqDist && t.atqPerto > 0);
    if (filtroAtivo === 'Longo Alcance') base = base.filter(t => t.atqDist > t.atqPerto);
    if (filtroAtivo === 'Maior Vida')    base = base.filter(t => t.vida   >= 10_000);
    if (filtroAtivo === 'Maior Defesa')  base = base.filter(t => t.def    >= 800);
    if (filtroAtivo === 'Alta Carga')    base = base.filter(t => t.car    >= 500);
    if (filtroAtivo === 'Mais Rápidas')  base = base.filter(t => t.vel    >= 1_000);
    return base
      .filter(t => t.nome.toLowerCase().includes(busca.toLowerCase()))
      .sort((a, b) => a.nome.localeCompare(b.nome));
  }, [busca, filtroAtivo, tropas]);

  const { totTropas, totPoder } = useMemo(() => {
    let totTropas = 0, totPoder = 0;
    tropas.forEach(t => {
      const qtd = quantidades[t.nome] || 0;
      if (qtd > 0) { totTropas += qtd; totPoder += qtd * (t.poder || 0); }
    });
    return { totTropas, totPoder };
  }, [quantidades, tropas]);

  const handleQuantidadeChange = (nomeTropa, value) => {
    const num = value.replace(/\D/g, '');
    setQuantidades(prev => ({ ...prev, [nomeTropa]: num ? parseInt(num, 10) : 0 }));
  };

  return (
    <div className="max-w-2xl mx-auto pb-4">
      <button className="btn-navy btn-sm w-full mb-2" onClick={() => setRoute('calculostropas')}>
        🧮 Simulador de Batalha
      </button>
      <div className="flex gap-2 mb-2.5">
        <button className="btn-ghost flex-1" onClick={() => setRoute('evolucao_tropas')}>⭐ Evolução</button>
        <button className="btn-ghost flex-1" onClick={() => setRoute('aprimoramento_tropas')}>⚗️ Aprimoramento</button>
      </div>

      <GameHeader title="Central de Unidades" subtitle={
        origem === 'api'
          ? '✦ Dados em tempo real da API'
          : origem === 'cache'
          ? '◆ Dados em cache'
          : '◇ Dados locais (API offline)'
      } />

      {carregando && (
        <div className="text-center py-3 text-sm font-nunito" style={{ color: C.TEXT_MUTED }}>
          <span style={{ animation: 'online-pulse 1s infinite' }}>⟳</span> Sincronizando com a API...
        </div>
      )}

      <ExercitoBanner totTropas={totTropas} totPoder={totPoder} totalFiltradas={tropasFiltradas.length} />

      <input
        className="tw-input mb-2.5"
        placeholder="🔍  Buscar unidade..."
        value={busca}
        onChange={e => setBusca(e.target.value)}
      />

      <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {FILTROS.map(({ id, label }) => {
          const ativo = filtroAtivo === id;
          return (
            <button
              key={id}
              onClick={() => setFiltroAtivo(id)}
              className="shrink-0 font-nunito font-bold text-[0.73rem] rounded px-2.5 py-1 transition-all border-none cursor-pointer whitespace-nowrap"
              style={{
                border: `1.5px solid ${ativo ? C.ACCENT : C.BORDER_SOFT}`,
                background: ativo ? 'rgba(184,150,90,0.18)' : C.BG_CARD,
                color: ativo ? C.ACCENT_DEEP : C.TEXT_MUTED,
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-2">
        {tropasFiltradas.length === 0 ? (
          <div className="py-10 text-center rounded-xl" style={{ border: `1px dashed ${C.BORDER_SOFT}`, background: C.BG_CARD }}>
            <p className="text-3xl mb-2 m-0">⚔️</p>
            <p className="font-nunito italic text-xs tracking-wider m-0" style={{ color: C.TEXT_MUTED }}>
              Nenhuma unidade encontrada
            </p>
          </div>
        ) : (
          tropasFiltradas.map(t => (
            <TropaCard
              key={t.nome}
              tropa={t}
              quantidade={quantidades[t.nome] || 0}
              onQuantidadeChange={handleQuantidadeChange}
              onFecharTeclado={() => document.activeElement?.blur()}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Tropas;
