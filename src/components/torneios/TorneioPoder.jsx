import React from 'react';
import { C } from '../../theme.js';

const FONTES = [
  {
    icon: '⚔️',
    title: 'Treinar Tropas',
    text: 'Recrute unidades de qualquer tipo — cada tropa treinada soma diretamente ao seu poder total. Priorize tropas de nível mais alto, pois elas possuem maior valor de poder por unidade.',
  },
  {
    icon: '🐉',
    title: 'Poder dos Dragões',
    text: 'Aumente o poder dos seus dragões evoluindo habilidades, alimentando e realizando sessões de treinamento. Cada ponto de poder ganho pelo dragão conta para o torneio.',
  },
  {
    icon: '📚',
    title: 'Pesquisas',
    text: 'Conclua pesquisas na Árvore do Conhecimento durante o período do torneio. Pesquisas militares e econômicas geram poder ao serem finalizadas.',
  },
  {
    icon: '🎖️',
    title: 'Treinar Generais',
    text: 'Evolua e treine seus generais para acumular poder de comando. Quanto maior o nível e as habilidades do general, maior o poder gerado.',
  },
  {
    icon: '💡',
    title: 'Dica de Estratégia',
    text: 'Combine todas as fontes ao mesmo tempo: enquanto treina tropas, deixe pesquisas rodando e alimentações de dragão programadas. Maximize cada minuto do torneio.',
  },
];

const TorneioPoder = () => (
  <div className="max-w-md mx-auto pb-4" style={{ animation: 'reveal-up 0.4s ease both' }}>

    {/* ── Cabeçalho ──────────────────────────────────────────────────────────── */}
    <div
      className="rounded-xl overflow-hidden mb-3"
      style={{ border: `1.5px solid ${C.BORDER}`, boxShadow: '0 3px 14px rgba(62,47,28,0.15)' }}
    >
      <div
        className="px-4 py-3"
        style={{ background: `linear-gradient(135deg, ${C.NAVY ?? '#1C3A5E'} 0%, #2A4C72 100%)` }}
      >
        <p
          className="font-nunito font-bold text-[0.6rem] tracking-[3px] uppercase m-0 mb-1"
          style={{ color: 'rgba(200,168,74,0.7)' }}
        >
          TORNEIO INDIVIDUAL
        </p>
        <p
          className="font-nunito font-black leading-tight m-0"
          style={{ fontSize: '1.1rem', color: C.ACCENT }}
        >
          ⚡ Torneio de Poder
        </p>
      </div>
      <div className="px-4 py-3" style={{ background: C.BG_CARD }}>
        <p
          className="font-nunito font-semibold text-[0.76rem] leading-relaxed m-0"
          style={{ color: C.TEXT_SECONDARY }}
        >
          O objetivo é simples: <strong>ganhe o máximo de poder possível</strong> durante o período
          do torneio. Toda fonte de poder conta — tropas, dragões, pesquisas e generais.
          Quanto mais você crescer, mais pontos acumula no ranking.
        </p>
      </div>
    </div>

    {/* ── Como Funciona ──────────────────────────────────────────────────────── */}
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: `1px solid ${C.BORDER_SOFT}`, borderTop: `3px solid ${C.WARNING}` }}
    >
      <div
        className="px-4 py-2.5"
        style={{
          background: `linear-gradient(180deg, ${C.BG_CARD_TOP}, ${C.BG_CARD})`,
          borderBottom: `1.5px solid ${C.BORDER_SOFT}`,
        }}
      >
        <p
          className="font-nunito font-black text-[0.72rem] uppercase tracking-widest m-0"
          style={{ color: C.TEXT_MUTED }}
        >
          📖 Como Pontuar
        </p>
      </div>
      <div className="px-4 py-3" style={{ background: C.BG_CARD }}>
        {FONTES.map((item, i) => (
          <div key={i} className="flex gap-2.5 items-start mb-3 last:mb-0">
            <span className="text-base leading-none shrink-0 mt-0.5">{item.icon}</span>
            <div>
              <p
                className="font-nunito font-black text-[0.74rem] m-0 mb-0.5"
                style={{ color: C.TEXT_PRIMARY }}
              >
                {item.title}
              </p>
              <p
                className="font-nunito font-semibold text-[0.73rem] leading-relaxed m-0"
                style={{ color: C.TEXT_SECONDARY }}
              >
                {item.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default TorneioPoder;
