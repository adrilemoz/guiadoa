import React from 'react';
import { C } from '../../theme.js';

const COR = '#A83C2C'; // vermelho-general

const DICAS = [
  {
    icon: '🎖️',
    title: 'Como Funciona',
    text: 'O torneio consiste em aumentar o XP dos seus generais durante o período. Cada ponto de experiência ganha conta para o seu placar.',
  },
  {
    icon: '🏛️',
    title: 'Quartel do General',
    text: 'Acesse o Quartel do General no seu castelo. Lá você encontrará a opção de Treinamento, onde é possível usar cartas para aumentar o XP do general selecionado.',
  },
  {
    icon: '🃏',
    title: 'Cartas de General',
    text: 'O treinamento é feito utilizando outras cartas de general como material. Cartas duplicadas ou de raridade inferior podem ser sacrificadas para gerar XP.',
  },
  {
    icon: '⭐',
    title: 'Raridade das Cartas',
    text: 'Cartas de maior raridade concedem mais XP ao ser usadas no treinamento. Priorize acumular cartas antes do torneio para maximizar o ganho de XP durante o evento.',
  },
  {
    icon: '💡',
    title: 'Dica Estratégica',
    text: 'Guarde cartas de general ao longo da semana e use-as em massa durante o torneio. Assim você concentra todo o ganho de XP no período de pontuação.',
  },
];

const TorneioGeneral = () => (
  <div className="max-w-md mx-auto pb-4" style={{ animation: 'reveal-up 0.4s ease both' }}>

    {/* ── Cabeçalho ──────────────────────────────────────────────────────────── */}
    <div
      className="rounded-xl overflow-hidden mb-3"
      style={{ border: `1.5px solid ${C.BORDER}`, boxShadow: '0 3px 14px rgba(62,47,28,0.15)' }}
    >
      <div
        className="px-4 py-3"
        style={{ background: `linear-gradient(135deg, #2A0A0A 0%, #5A1A1A 100%)` }}
      >
        <p
          className="font-nunito font-bold text-[0.6rem] tracking-[3px] uppercase m-0 mb-1"
          style={{ color: 'rgba(220,160,140,0.7)' }}
        >
          TORNEIO INDIVIDUAL
        </p>
        <p
          className="font-nunito font-black leading-tight m-0"
          style={{ fontSize: '1.1rem', color: '#F0A090' }}
        >
          🎖️ Aprimoramento de General
        </p>
      </div>
      <div className="px-4 py-3" style={{ background: C.BG_CARD }}>
        <p
          className="font-nunito font-semibold text-[0.76rem] leading-relaxed m-0"
          style={{ color: C.TEXT_SECONDARY }}
        >
          O objetivo é <strong>aumentar o XP dos seus generais</strong> ao máximo durante o
          torneio. Use cartas no Quartel do General para treinar e ganhar experiência —
          quanto mais XP acumulado, melhor a sua posição no ranking.
        </p>
      </div>
    </div>

    {/* ── Como Funciona ──────────────────────────────────────────────────────── */}
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: `1px solid ${C.BORDER_SOFT}`, borderTop: `3px solid ${COR}` }}
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
          📖 Como Funciona
        </p>
      </div>
      <div className="px-4 py-3" style={{ background: C.BG_CARD }}>
        {DICAS.map((item, i) => (
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

export default TorneioGeneral;
