import React from 'react';
import { C } from '../../theme.js';

// ── Dados dos torneios de aliança ─────────────────────────────────────────────
const TORNEIOS = [
  {
    id: 'poder',
    icon: '⚡',
    title: 'Torneio de Poder',
    color: C.WARNING,
    desc: 'O objetivo principal é aumentar o seu poder total durante o período do torneio.',
    itens: [
      { icon: '⚔️', text: 'Treine tropas de qualquer tipo — cada unidade recrutada soma poder ao seu castelo.' },
      { icon: '🐉', text: 'Aumente o poder dos seus dragões evoluindo habilidades, alimentando e treinando-os.' },
      { icon: '📚', text: 'Faça pesquisas na Árvore do Conhecimento para ganhar poder acadêmico.' },
      { icon: '🎖️', text: 'Treine e evolua seus generais para acumular mais poder de comando.' },
      { icon: '💡', text: 'Dica: combine todas as fontes de poder ao mesmo tempo para maximizar o ganho durante o torneio.' },
    ],
  },
  {
    id: 'alianca_atual',
    icon: '🤝',
    title: 'Torneio de Aliança (Atual)',
    color: C.SUCCESS,
    desc: 'O foco é no crescimento coletivo — treinar dragões e contribuir com a aliança.',
    itens: [
      { icon: '🍖', text: 'Alimente e treine seus dragões regularmente para acumular pontos de aliança.' },
      { icon: '🏰', text: 'Ajude os membros da sua aliança: acelere construções, pesquisas e treinamentos de aliados.' },
      { icon: '🤜', text: 'Participe de ataques em grupo e defesas conjuntas para contribuir com a aliança.' },
      { icon: '💡', text: 'Dica: coordene com sua aliança para distribuir ajudas e maximizar o total de pontos coletivos.' },
    ],
  },
];

// ── Componente ────────────────────────────────────────────────────────────────
const TorneioAlianca = () => (
  <div className="max-w-md mx-auto pb-4" style={{ animation: 'reveal-up 0.4s ease both' }}>

    {/* ── Cabeçalho informativo ──────────────────────────────────────────────── */}
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
          TORNEIOS DE ALIANÇA
        </p>
        <p
          className="font-nunito font-black leading-tight m-0"
          style={{ fontSize: '1.1rem', color: C.ACCENT }}
        >
          Como Funcionam
        </p>
      </div>
      <div className="px-4 py-3" style={{ background: C.BG_CARD }}>
        <p
          className="font-nunito font-semibold text-[0.76rem] leading-relaxed m-0"
          style={{ color: C.TEXT_SECONDARY }}
        >
          Atualmente existem <strong>dois tipos</strong> de torneios de aliança. Cada um possui objetivos
          distintos — conheça abaixo como cada um funciona e como pontuar.
        </p>
      </div>
    </div>

    {/* ── Cards por torneio ─────────────────────────────────────────────────── */}
    {TORNEIOS.map(t => (
      <div
        key={t.id}
        className="rounded-xl overflow-hidden mb-3"
        style={{ border: `1px solid ${C.BORDER_SOFT}`, borderTop: `3px solid ${t.color}` }}
      >
        {/* Cabeçalho do card */}
        <div
          className="px-4 py-2.5 flex items-center gap-2"
          style={{
            background: `linear-gradient(180deg, ${C.BG_CARD_TOP}, ${C.BG_CARD})`,
            borderBottom: `1.5px solid ${C.BORDER_SOFT}`,
          }}
        >
          <span className="text-lg leading-none">{t.icon}</span>
          <p
            className="font-nunito font-black text-[0.82rem] uppercase tracking-widest m-0"
            style={{ color: t.color }}
          >
            {t.title}
          </p>
        </div>

        {/* Corpo */}
        <div className="px-4 py-3" style={{ background: C.BG_CARD }}>
          {/* Descrição resumida */}
          <p
            className="font-nunito font-semibold text-[0.74rem] leading-relaxed mb-3"
            style={{ color: C.TEXT_SECONDARY }}
          >
            {t.desc}
          </p>

          {/* Lista de dicas */}
          {t.itens.map((item, i) => (
            <div key={i} className="flex gap-2.5 items-start mb-2.5 last:mb-0">
              <span className="text-base leading-none shrink-0 mt-0.5">{item.icon}</span>
              <p
                className="font-nunito font-semibold text-[0.76rem] leading-relaxed m-0"
                style={{ color: C.TEXT_SECONDARY }}
              >
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

export default TorneioAlianca;
