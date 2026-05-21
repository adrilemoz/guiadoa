import React from 'react';
import { C } from '../../theme.js';

const DICAS = [
  {
    icon: '☠️',
    title: 'Como Pontuar',
    text: 'Os pontos são gerados ao matar tropas de outros jogadores em batalha. Cada unidade inimiga eliminada conta para o seu placar no torneio.',
  },
  {
    icon: '🤝',
    title: 'Troca de Tropas com a Aliança',
    text: 'Combine com membros da sua aliança para trocar tropas e se atacarem mutuamente. Um aliado envia tropas fracas para o seu castelo e você as elimina em batalha — depois reveze. É a forma mais eficiente de acumular abates rapidamente.',
  },
  {
    icon: '🏰',
    title: 'Ataque a Castelos Desprotegidos',
    text: 'Procure castelos sem escudo e com tropas visíveis para atacar. Priorize alvos com maior quantidade de unidades para maximizar o número de abates por ataque.',
  },
  {
    icon: '⚔️',
    title: 'Tropas de Sacrifício',
    text: 'Durante a troca com aliados, use tropas de nível mais baixo como "tropas de sacrifício" — elas são mais fáceis de treinar em grande quantidade e geram abates suficientes para pontuar bem.',
  },
  {
    icon: '📢',
    title: 'Coordenação é a Chave',
    text: 'Use o chat da aliança para organizar as trocas. Combine horários, defina quem envia e quem ataca primeiro, e garanta que todos os participantes se beneficiem igualmente.',
  },
  {
    icon: '💡',
    title: 'Dica Extra',
    text: 'Evite atacar membros de outras alianças poderosas durante o torneio — o objetivo é acumular abates, não gerar conflitos desnecessários. Mantenha o foco nas trocas internas.',
  },
];

const TorneioMatarTropas = () => (
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
          TORNEIO DE COMBATE
        </p>
        <p
          className="font-nunito font-black leading-tight m-0"
          style={{ fontSize: '1.1rem', color: C.ACCENT }}
        >
          ☠️ Matar Tropas
        </p>
      </div>
      <div className="px-4 py-3" style={{ background: C.BG_CARD }}>
        <p
          className="font-nunito font-semibold text-[0.76rem] leading-relaxed m-0"
          style={{ color: C.TEXT_SECONDARY }}
        >
          O objetivo é <strong>eliminar o maior número possível de tropas inimigas</strong> durante
          o torneio. A estratégia mais eficaz é se organizar com a aliança para realizar
          trocas controladas de tropas — assim todos pontuam sem desperdício.
        </p>
      </div>
    </div>

    {/* ── Como Funciona ──────────────────────────────────────────────────────── */}
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: `1px solid ${C.BORDER_SOFT}`, borderTop: `3px solid ${C.ERROR}` }}
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
          📖 Estratégias e Dicas
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

export default TorneioMatarTropas;
