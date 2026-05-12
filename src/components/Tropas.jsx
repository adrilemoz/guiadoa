import React, { useEffect, useMemo, useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';

import { C } from '../theme.js';
import { dbTropas } from '../db.js';
import { STORAGE_KEYS } from '../utils/storage.js';

import GameHeader     from './shared/GameHeader.jsx';
import ExercitoBanner from './tropas/ExercitoBanner.jsx';
import TropaCard      from './tropas/TropaCard.jsx';
import { FILTROS }    from './tropas/tropaUtils.js';

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;700&display=swap');
  .tropas-list::-webkit-scrollbar { width: 4px; }
  .tropas-list::-webkit-scrollbar-track { background: ${C.BG_SECONDARY}; border-radius: 2px; }
  .tropas-list::-webkit-scrollbar-thumb { background: ${C.BORDER}; border-radius: 2px; }
`;

const Tropas = ({ setRoute }) => {
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
    let base = [...dbTropas];
    if (filtroAtivo === 'Corpo a Corpo') base = base.filter(t => t.atqPerto >= t.atqDist && t.atqPerto > 0);
    if (filtroAtivo === 'Longo Alcance') base = base.filter(t => t.atqDist > t.atqPerto);
    if (filtroAtivo === 'Maior Vida')    base = base.filter(t => t.vida   >= 10_000);
    if (filtroAtivo === 'Maior Defesa')  base = base.filter(t => t.def    >= 800);
    if (filtroAtivo === 'Alta Carga')    base = base.filter(t => t.car    >= 500);
    if (filtroAtivo === 'Mais Rápidas')  base = base.filter(t => t.vel    >= 1_000);
    return base
      .filter(t => t.nome.toLowerCase().includes(busca.toLowerCase()))
      .sort((a, b) => a.nome.localeCompare(b.nome));
  }, [busca, filtroAtivo]);

  const { totTropas, totPoder } = useMemo(() => {
    let totTropas = 0, totPoder = 0;
    dbTropas.forEach(t => {
      const qtd = quantidades[t.nome] || 0;
      if (qtd > 0) { totTropas += qtd; totPoder += qtd * (t.poder || 0); }
    });
    return { totTropas, totPoder };
  }, [quantidades]);

  const handleQuantidadeChange = (nomeTropa, value) => {
    const num = value.replace(/\D/g, '');
    setQuantidades(prev => ({ ...prev, [nomeTropa]: num ? parseInt(num, 10) : 0 }));
  };

  const fecharTeclado = () => document.activeElement?.blur();

  return (
    <Box sx={{ maxWidth: 700, margin: 'auto', pb: 4 }}>
      <style>{GLOBAL_CSS}</style>

      {/* Botão do Simulador */}
      <Button
        variant="contained" color="primary" fullWidth
        onClick={() => setRoute('calculostropas')}
        sx={{
          mb: 1, py: 1,
          fontFamily: '"Nunito", sans-serif',
          fontWeight: 700, letterSpacing: '1px', fontSize: '0.75rem',
        }}
      >
        🧮 Simulador de Batalha
      </Button>

      {/* Novos botões de Evolução e Aprimoramento */}
      <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
        <Button
          variant="outlined" fullWidth
          onClick={() => setRoute('evolucao_tropas')}
          sx={{
            py: 0.9,
            fontFamily: '"Nunito", sans-serif',
            fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.5px',
          }}
        >
          ⭐ Evolução de Tropas
        </Button>
        <Button
          variant="outlined" fullWidth
          onClick={() => setRoute('aprimoramento_tropas')}
          sx={{
            py: 0.9,
            fontFamily: '"Nunito", sans-serif',
            fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.5px',
          }}
        >
          ⚗️ Aprimoramento
        </Button>
      </Box>

      {/* Cabeçalho */}
      <GameHeader title="Central de Unidades" />

      {/* Badge de última atualização dos dados */}
      <Box sx={{
        display: 'flex', alignItems: 'center', gap: 0.8,
        px: 1.2, py: 0.7, mb: 1.2,
        border: `1px solid ${C.BORDER_SOFT}`,
        borderLeft: `3px solid ${C.ACCENT}`,
        borderRadius: '6px',
        bgcolor: 'rgba(184,150,90,0.06)',
      }}>
        <Box sx={{ fontSize: '0.8rem', lineHeight: 1 }}>📝</Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{
            fontFamily: '"Nunito", sans-serif', fontWeight: 700,
            fontSize: '0.70rem', color: C.TEXT_MUTED, letterSpacing: '0.3px',
          }}>
            {`53 unidades · dados v1.7.0`}
          </Box>
          <Box sx={{
            fontFamily: '"Nunito", sans-serif', fontWeight: 600,
            fontSize: '0.68rem', color: C.TEXT_FAINT, mt: 0.15,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            última atualização: adicionados Perseguidor das Sombras e Fantasma do Trovão
          </Box>
        </Box>
        <Box sx={{
          px: 0.8, py: 0.25,
          border: `1px solid ${C.BORDER_SOFT}`,
          borderRadius: '4px',
          bgcolor: C.BG_SECONDARY,
          fontFamily: '"IBM Plex Mono", monospace',
          fontSize: '0.62rem', fontWeight: 700,
          color: C.TEXT_MUTED, flexShrink: 0,
          letterSpacing: '0.5px',
        }}>
          #a3f9c2
        </Box>
      </Box>

      {/* Banner de totais */}
      <ExercitoBanner
        totTropas={totTropas}
        totPoder={totPoder}
        totalFiltradas={tropasFiltradas.length}
      />

      {/* Campo de busca */}
      <TextField
        fullWidth size="small"
        placeholder="Buscar unidade..."
        variant="outlined"
        value={busca}
        onChange={e => setBusca(e.target.value)}
        sx={{
          mb: 1.2,
          '& .MuiInputBase-input': { fontSize: '0.88rem', py: '8px' },
        }}
      />

      {/* Filtros — chips com estilo de selos medievais */}
      <Box sx={{
        display: 'flex', gap: 0.6, mb: 1.8,
        overflowX: 'auto', pb: 0.4,
        scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' },
      }}>
        {FILTROS.map(({ id, label }) => {
          const ativo = filtroAtivo === id;
          return (
            <Box
              key={id}
              onClick={() => setFiltroAtivo(id)}
              sx={{
                flexShrink: 0,
                px: 1.2, py: 0.45,
                border: `1.5px solid ${ativo ? C.ACCENT : C.BORDER_SOFT}`,
                borderRadius: '5px',
                bgcolor: ativo ? 'rgba(184,150,90,0.18)' : C.BG_CARD,
                color: ativo ? C.ACCENT_DEEP : C.TEXT_MUTED,
                cursor: 'pointer',
                fontFamily: '"Nunito", sans-serif',
                fontWeight: 700,
                fontSize: '0.75rem',
                letterSpacing: '0.3px',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s',
                boxShadow: ativo
                  ? '0 2px 6px rgba(168,132,74,0.2)'
                  : '0 1px 3px rgba(62,47,28,0.06)',
                '&:hover': {
                  bgcolor: 'rgba(184,150,90,0.1)',
                  borderColor: C.BORDER,
                  color: C.TEXT_SECONDARY,
                },
                '&:active': { transform: 'scale(0.97)' },
              }}
            >
              {label}
            </Box>
          );
        })}
      </Box>

      {/* Lista de tropas */}
      <Box className="tropas-list" sx={{ display: 'flex', flexDirection: 'column', gap: 0.9 }}>
        {tropasFiltradas.length === 0 ? (
          <Box sx={{
            p: 5, textAlign: 'center',
            border: `1px dashed ${C.BORDER_SOFT}`,
            borderRadius: '10px',
            bgcolor: C.BG_CARD,
          }}>
            <Typography sx={{
              color: C.TEXT_FAINT, fontSize: '1.5rem',
              mb: 1, lineHeight: 1,
            }}>
              ⚔️
            </Typography>
            <Typography sx={{
              color: C.TEXT_MUTED, fontSize: '0.75rem',
              fontFamily: '"Nunito", sans-serif', letterSpacing: '1px',
              fontStyle: 'italic',
            }}>
              Nenhuma unidade encontrada
            </Typography>
          </Box>
        ) : (
          tropasFiltradas.map(t => (
            <TropaCard
              key={t.nome}
              tropa={t}
              quantidade={quantidades[t.nome] || 0}
              onQuantidadeChange={handleQuantidadeChange}
              onFecharTeclado={fecharTeclado}
            />
          ))
        )}
      </Box>
    </Box>
  );
};

export default Tropas;
