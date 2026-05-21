import React, { useState } from 'react';
import { getFusoOffset, getProfile } from '../utils/storage.js';
import { useTorneioTimer } from '../hooks/useTorneioTimer.js';
import { C } from '../theme.js';
import TorneioStatusCard        from './shared/TorneioStatusCard.jsx';
import EvolucaoTropas           from './torneios/EvolucaoTropas.jsx';
import PontosTalisma            from './torneios/PontosTalisma.jsx';
import TorneioPoder             from './torneios/TorneioPoder.jsx';
import TorneioAlianca           from './torneios/TorneioAlianca.jsx';
import TorneioMatarTropas       from './torneios/TorneioMatarTropas.jsx';
import TorneioTreinoTropa       from './torneios/TorneioTreinoTropa.jsx';
import TorneioHabilidadeDragao  from './torneios/TorneioHabilidadeDragao.jsx';
import TorneioGeneral           from './torneios/TorneioGeneral.jsx';
import TorneioAprimoramentoTropa from './torneios/TorneioAprimoramentoTropa.jsx';
import TorneioConhecimento      from './torneios/TorneioConhecimento.jsx';
import TreinamentoDoDragao      from './torneios/TreinamentoDoDragao.jsx';
import TorneioAceleracoes      from './torneios/TorneioAceleracoes.jsx';
import TorneioPocoes           from './torneios/TorneioPocoes.jsx';

const LISTA_TORNEIOS = [
  { id: 'general',             icon: '🎖️', title: 'Aprimoramento de General',      desc: 'Evolução de Comandante',  cat: 'Poder',   cor: '#A83C2C' },
  { id: 'aprimoramento_tropa', icon: '🛡️', title: 'Aprimoramento de Tropa',         desc: 'Upgrade de Unidades',     cat: 'Tropas',  cor: '#5C7FA3' },
  { id: 'evolucao_tropas',     icon: '⭐', title: 'Evolução de Tropas',             desc: 'Raridade e Poder',        cat: 'Tropas',  cor: '#C87A2C' },
  { id: 'habilidade_dragao',   icon: '🐉', title: 'Habilidade dos Grandes Dragões', desc: 'Essência de Fúria',       cat: 'Dragão',  cor: '#8B6BAE' },
  { id: 'matar_tropas',        icon: '☠️', title: 'Matar Tropas',                   desc: 'Combate Direto',          cat: 'Combate', cor: '#A83C2C' },
  { id: 'alianca',             icon: '🤝', title: 'Torneios de Aliança',             desc: 'Como funcionam',          cat: 'Aliança', cor: '#5A8A5C', infoOnly: true },
  { id: 'conhecimento',        icon: '📚', title: 'Pontos de Conhecimento',         desc: 'Pesquisa e Sabedoria',    cat: 'Poder',   cor: '#5C7FA3' },
  { id: 'talisma',             icon: '🧿', title: 'Pontos de Talismã',              desc: 'Magia e Objetos',         cat: 'Magia',   cor: '#8B6BAE' },
  { id: 'poder',               icon: '⚡', title: 'Torneio de Poder',               desc: 'Ranking Geral',           cat: 'Poder',   cor: '#C87A2C' },
  { id: 'treino_tropa',        icon: '⚔️', title: 'Treino de Tropa',                desc: 'Recrutamento',            cat: 'Tropas',  cor: '#A83C2C' },
  { id: 'treinamento_dragao',  icon: '🍖', title: 'Treinamento do Dragão',          desc: 'Alimentação e Poder',     cat: 'Dragão',  cor: '#8B6BAE' },
  { id: 'aceleracoes',          icon: '⚡', title: 'Torneio de Acelerações',          desc: 'Minutos de aceleração',   cat: 'Poder',   cor: '#3B5C8C' },
  { id: 'pocoes_antigas',       icon: '🧪', title: 'Poções Antigas',                 desc: 'Superior, Interm., Primária', cat: 'Poder',   cor: '#8B3A9A' },
].sort((a, b) => a.title.localeCompare(b.title));

const MODULOS = {
  evolucao_tropas:      <EvolucaoTropas />,
  talisma:              <PontosTalisma />,
  poder:                <TorneioPoder />,
  habilidade_dragao:    <TorneioHabilidadeDragao />,
  alianca:              <TorneioAlianca />,
  matar_tropas:         <TorneioMatarTropas />,
  treino_tropa:         <TorneioTreinoTropa />,
  general:              <TorneioGeneral />,
  aprimoramento_tropa:  <TorneioAprimoramentoTropa />,
  conhecimento:         <TorneioConhecimento />,
  treinamento_dragao:   <TreinamentoDoDragao />,
  aceleracoes:          <TorneioAceleracoes />,
  pocoes_antigas:       <TorneioPocoes />,
};

// ── Sub-componentes ─────────────────────────────────────────────────────────
const PHeader = ({ title, sub }) => (
  <div className="tw-card text-center px-4 py-3 mb-3 relative">
    <span className="absolute top-1.5 left-2" style={{ color: C.ACCENT, fontSize: 11, opacity: 0.7 }}>◆</span>
    <span className="absolute top-1.5 right-2" style={{ color: C.ACCENT, fontSize: 11, opacity: 0.7 }}>◆</span>
    <p className="font-nunito font-bold text-xs tracking-widest uppercase m-0" style={{ color: C.TEXT_PRIMARY }}>{title}</p>
    {sub && <p className="font-nunito italic text-[0.7rem] m-0 mt-0.5" style={{ color: C.TEXT_MUTED }}>{sub}</p>}
  </div>
);

const SectionDivider = ({ label }) => (
  <div className="flex items-center gap-2 my-2.5">
    <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, #C8A84A)' }} />
    <span style={{ color: C.ACCENT, fontSize: 9 }}>◆</span>
    {label && <span className="font-nunito font-bold text-[0.62rem] tracking-widest whitespace-nowrap" style={{ color: C.TEXT_MUTED, letterSpacing: '2.5px' }}>{label}</span>}
    {label && <span style={{ color: C.ACCENT, fontSize: 9 }}>◆</span>}
    <div className="flex-1 h-px" style={{ background: 'linear-gradient(270deg, transparent, #C8A84A)' }} />
  </div>
);

// ── Main ─────────────────────────────────────────────────────────────────────
const Torneios = () => {
  const [torneioAtivo, setTorneioAtivo] = useState(null);
  const [highlighted,  setHighlighted]  = useState(null);

  const torneioAtual = LISTA_TORNEIOS.find(t => t.id === torneioAtivo);
  const profile = getProfile() || {};
  const offset  = getFusoOffset();
  const { horaLocal, countdown, isUrgente, faseTexto } = useTorneioTimer(offset);

  const cats = [...new Set(LISTA_TORNEIOS.map(t => t.cat))].sort();

  return (
    <div className="max-w-2xl mx-auto pb-4">
      {!torneioAtivo && (
        <TorneioStatusCard
          horaLocal={horaLocal} countdown={countdown}
          isUrgente={isUrgente} faseTexto={faseTexto}
          fuso={profile.fuso} reino={profile.reino}
        />
      )}

      {torneioAtivo && torneioAtual ? (
        <div>
          {/* Barra do torneio ativo */}
          <div
            className="flex justify-between items-center p-3 mb-4 rounded-lg"
            style={{
              border: `2px solid ${torneioAtual.cor}`,
              borderLeft: `6px solid ${torneioAtual.cor}`,
              background: `linear-gradient(90deg, ${torneioAtual.cor}20 0%, ${C.BG_CARD} 100%)`,
              boxShadow: '0 3px 10px rgba(62,47,28,0.15)',
            }}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="text-2xl leading-none p-1.5 rounded-lg"
                style={{ background: C.BG_CARD, border: `1.5px solid ${C.BORDER}` }}
              >
                {torneioAtual.icon}
              </div>
              <div>
                <p className="font-nunito font-bold text-[0.65rem] uppercase tracking-wide m-0" style={{ color: C.TEXT_MUTED }}>Torneio Ativo</p>
                <p className="font-nunito font-black text-base m-0 leading-tight" style={{ color: C.TEXT_PRIMARY }}>{torneioAtual.title}</p>
              </div>
            </div>
            <button className="btn-danger btn-sm" onClick={() => { setTorneioAtivo(null); setHighlighted(null); }}>
              ← Voltar
            </button>
          </div>

          {MODULOS[torneioAtual.id] ?? null}
        </div>
      ) : (
        <div>
          <PHeader title="Codex de Batalha" sub="Selecione o módulo de cálculo" />

          {cats.map(cat => (
            <div key={cat}>
              <SectionDivider label={cat.toUpperCase()} />
              {LISTA_TORNEIOS.filter(t => t.cat === cat).map(t => {
                const isHigh = highlighted === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => { setHighlighted(t.id); setTimeout(() => setTorneioAtivo(t.id), 120); }}
                    className="w-full flex items-center gap-2.5 rounded-lg mb-1.5 cursor-pointer transition-all text-left border-none"
                    style={{
                      padding: '9px 12px',
                      background: isHigh ? `linear-gradient(90deg, ${t.cor}20 0%, ${C.BG_CARD} 100%)` : C.BG_CARD,
                      border: `1.5px solid ${isHigh ? t.cor : C.BORDER_SOFT}`,
                      borderLeft: `4px solid ${t.cor}`,
                      boxShadow: isHigh ? `0 2px 10px ${t.cor}25` : '0 1px 4px rgba(62,47,28,0.06)',
                    }}
                  >
                    {/* Ícone */}
                    <div
                      className="w-9 h-9 shrink-0 flex items-center justify-center text-lg rounded-lg"
                      style={{ background: `${t.cor}15`, border: `1.5px solid ${t.cor}45` }}
                    >
                      {t.icon}
                    </div>
                    {/* Texto */}
                    <div className="flex-1 min-w-0">
                      <p className="font-nunito font-black text-[0.82rem] m-0 leading-tight" style={{ color: C.TEXT_PRIMARY }}>{t.title}</p>
                      <p className="font-nunito font-semibold text-[0.68rem] m-0 mt-0.5" style={{ color: C.TEXT_MUTED }}>{t.desc}</p>
                    </div>
                    {/* CTA pill */}
                    <div
                      className="font-nunito font-black text-[0.6rem] tracking-widest uppercase shrink-0 px-2.5 py-1 rounded-md"
                      style={{
                        background: isHigh ? t.cor : C.ACCENT,
                        color: '#FFF8EE',
                      }}
                    >
                      {isHigh ? 'ABRINDO…' : t.infoOnly ? 'VER ▸' : 'CALCULAR ▸'}
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Torneios;
