import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { getFusoOffset, getProfile } from '../utils/storage.js';
import { useTorneioTimer } from '../hooks/useTorneioTimer.js';
import { C } from '../theme.js';
import TorneioStatusCard from './shared/TorneioStatusCard.jsx';
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

// ── Lista de torneios com categoria e cor de acento ──────────────────────────
const LISTA_TORNEIOS = [
  { id: 'general',             icon: '🎖️', title: 'Aprimoramento de General',       desc: 'Evolução de Comandante',  cat: 'Poder',   cor: '#A83C2C' },
  { id: 'aprimoramento_tropa', icon: '🛡️', title: 'Aprimoramento de Tropa',          desc: 'Upgrade de Unidades',     cat: 'Tropas',  cor: '#5C7FA3' },
  { id: 'evolucao_tropas',     icon: '⭐', title: 'Evolução de Tropas',              desc: 'Raridade e Poder',        cat: 'Tropas',  cor: '#C87A2C' },
  { id: 'habilidade_dragao',   icon: '🐉', title: 'Habilidade dos Grandes Dragões',  desc: 'Essência de Fúria',       cat: 'Dragão',  cor: '#8B6BAE' },
  { id: 'matar_tropas',        icon: '☠️', title: 'Matar Tropas',                    desc: 'Combate Direto',          cat: 'Combate', cor: '#A83C2C' },
  { id: 'alianca',             icon: '🤝', title: 'Poder de Aliança',                desc: 'Força Coletiva',          cat: 'Aliança', cor: '#5A8A5C' },
  { id: 'conhecimento',        icon: '📚', title: 'Pontos de Conhecimento',          desc: 'Pesquisa e Sabedoria',    cat: 'Poder',   cor: '#5C7FA3' },
  { id: 'talisma',             icon: '🧿', title: 'Pontos de Talismã',               desc: 'Magia e Objetos',         cat: 'Magia',   cor: '#8B6BAE' },
  { id: 'poder',               icon: '⚡', title: 'Torneio de Poder',                desc: 'Ranking Geral',           cat: 'Poder',   cor: '#C87A2C' },
  { id: 'treino_tropa',        icon: '⚔️', title: 'Treino de Tropa',                 desc: 'Recrutamento',            cat: 'Tropas',  cor: '#A83C2C' },
  { id: 'treinamento_dragao',  icon: '🍖', title: 'Treinamento do Dragão',           desc: 'Alimentação e Poder',     cat: 'Dragão',  cor: '#8B6BAE' },
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
};

// ── Sub-componentes visuais do Codex de Batalha ──────────────────────────────

const PHeader = ({ title, sub }) => (
  <div style={{
    background: 'linear-gradient(180deg, #E1CFA3 0%, #EDD9B0 100%)',
    border: '1.5px solid #C8A96B',
    borderRadius: 10,
    padding: '12px 16px',
    textAlign: 'center',
    position: 'relative',
    marginBottom: 12,
    boxShadow: '0 2px 8px rgba(62,47,28,0.10)',
  }}>
    <span style={{ position: 'absolute', top: 5, left: 8, color: '#C8A96B', fontSize: 12, opacity: 0.7 }}>◆</span>
    <span style={{ position: 'absolute', top: 5, right: 8, color: '#C8A96B', fontSize: 12, opacity: 0.7 }}>◆</span>
    <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 13, letterSpacing: 2, textTransform: 'uppercase', color: '#3E2F1C' }}>{title}</div>
    {sub && <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: 11, color: '#9A7D56', marginTop: 2, fontStyle: 'italic' }}>{sub}</div>}
  </div>
);

const Divider = ({ label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '10px 0' }}>
    <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, #C8A96B)' }} />
    <span style={{ color: '#B8965A', fontSize: 10 }}>◆</span>
    {label && <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 10, letterSpacing: 2.5, color: '#9A7D56', whiteSpace: 'nowrap' }}>{label}</span>}
    {label && <span style={{ color: '#B8965A', fontSize: 10 }}>◆</span>}
    <div style={{ flex: 1, height: 1, background: 'linear-gradient(270deg, transparent, #C8A96B)' }} />
  </div>
);

// ── Tela principal ─────────────────────────────────────────────────────────
const Torneios = () => {
  const [torneioAtivo, setTorneioAtivo] = useState(null);
  const [highlighted, setHighlighted]   = useState(null);

  const torneioAtual = LISTA_TORNEIOS.find(t => t.id === torneioAtivo);
  const profile = getProfile() || {};
  const offset  = getFusoOffset();
  const { horaLocal, countdown, isUrgente, faseTexto } = useTorneioTimer(offset);

  const cats = [...new Set(LISTA_TORNEIOS.map(t => t.cat))].sort();

  return (
    <Box sx={{ maxWidth: 900, margin: 'auto', pb: 2 }}>

      {/* Cronômetro de torneio */}
      <TorneioStatusCard
        horaLocal={horaLocal}
        countdown={countdown}
        isUrgente={isUrgente}
        faseTexto={faseTexto}
        fuso={profile.fuso}
        reino={profile.reino}
      />

      {torneioAtivo && torneioAtual ? (
        /* ── Módulo de cálculo ativo ── */
        <Box>
          <Box sx={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            p: 1.5, mb: 3, borderRadius: '8px',
            border: '3px solid #5a4010',
            borderLeft: `6px solid ${torneioAtual.cor}`,
            background: `linear-gradient(90deg, ${torneioAtual.cor}22 0%, #EDD9B0 100%)`,
            boxShadow: '0 4px 8px rgba(62,47,28,0.15)',
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{
                bgcolor: C.BG_CARD, p: 0.5, px: 1,
                borderRadius: '6px', border: `2px solid ${C.BORDER}`,
                fontSize: '1.6rem', lineHeight: 1,
              }}>
                {torneioAtual.icon}
              </Box>
              <Box>
                <Typography sx={{ color: C.TEXT_MUTED, fontWeight: 'bold', fontSize: '0.7rem', textTransform: 'uppercase', lineHeight: 1 }}>Torneio Ativo</Typography>
                <Typography sx={{ color: C.TEXT_PRIMARY, fontWeight: '900', fontSize: '1.1rem' }}>{torneioAtual.title}</Typography>
              </Box>
            </Box>
            <Button variant="contained" color="error" size="small" onClick={() => { setTorneioAtivo(null); setHighlighted(null); }} sx={{ border: '2px solid #3a2808' }}>
              Voltar
            </Button>
          </Box>

          {MODULOS[torneioAtual.id] ?? null}
        </Box>

      ) : (
        /* ── Codex de Batalha — lista de seleção ── */
        <div style={{ fontFamily: 'Nunito, sans-serif', padding: '0 2px' }}>

          <PHeader title="Codex de Batalha" sub="Selecione o módulo de cálculo" />

          {cats.map(cat => (
            <div key={cat}>
              <Divider label={cat.toUpperCase()} />

              {LISTA_TORNEIOS.filter(t => t.cat === cat).map(t => {
                const isHigh = highlighted === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => {
                      setHighlighted(t.id);
                      setTimeout(() => setTorneioAtivo(t.id), 120);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      background: isHigh
                        ? `linear-gradient(90deg, ${t.cor}22 0%, #F2E6C9 100%)`
                        : '#F2E6C9',
                      border: `1.5px solid ${isHigh ? t.cor : '#DDD0A8'}`,
                      borderLeft: `4px solid ${t.cor}`,
                      borderRadius: 8,
                      padding: '10px 12px',
                      marginBottom: 7,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      boxShadow: isHigh
                        ? `0 2px 12px ${t.cor}30`
                        : '0 1px 4px rgba(62,47,28,0.08)',
                    }}
                  >
                    {/* Ícone */}
                    <div style={{
                      width: 40, height: 40,
                      background: `${t.cor}18`,
                      border: `1.5px solid ${t.cor}55`,
                      borderRadius: 8,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 20, flexShrink: 0,
                    }}>
                      {t.icon}
                    </div>

                    {/* Título + descrição */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 800, fontSize: 13, color: '#3E2F1C', lineHeight: 1.2 }}>{t.title}</div>
                      <div style={{ fontSize: 11, color: '#9A7D56', fontWeight: 600, marginTop: 2 }}>{t.desc}</div>
                    </div>

                    {/* CTA */}
                    <div style={{
                      background: isHigh ? t.cor : '#B8965A',
                      color: '#FFF8EE',
                      borderRadius: 6,
                      padding: '5px 10px',
                      fontSize: 10, fontWeight: 900,
                      letterSpacing: 1.5,
                      textTransform: 'uppercase',
                      flexShrink: 0,
                      transition: 'background 0.15s',
                    }}>
                      {isHigh ? 'ABRINDO…' : 'CALCULAR ▸'}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </Box>
  );
};

export default Torneios;
