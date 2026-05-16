import React from 'react';
import { C } from '../theme.js';
import GameHeader from './shared/GameHeader.jsx';

const Itens = () => (
  <div className="max-w-2xl mx-auto pb-4">
    <GameHeader title="Armazém de Itens" />
    <div
      className="flex flex-col items-center text-center p-8 rounded-xl mt-3"
      style={{ border: `2px dashed ${C.BORDER}`, background: C.BG_CARD }}
    >
      <p className="text-6xl mb-3 m-0" style={{ filter: 'drop-shadow(1px 2px 2px rgba(62,47,28,0.2))' }}>🎒</p>
      <p className="font-cinzel font-bold text-base uppercase tracking-wider m-0 mb-2" style={{ color: C.TEXT_PRIMARY }}>
        Armazém em Construção
      </p>
      <p className="font-nunito font-semibold text-sm leading-relaxed m-0" style={{ color: C.TEXT_SECONDARY }}>
        Comandante, envie o relatório de inteligência com o banco de dados dos Itens para que as prateleiras possam ser carregadas!
      </p>
    </div>
  </div>
);

export default Itens;
