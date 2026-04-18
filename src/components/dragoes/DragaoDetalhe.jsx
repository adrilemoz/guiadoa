import React, { useState } from 'react';
import { Box } from '@mui/material';
import { getDragaoById } from '../../data/dragoes.js';
import { C } from '../../theme.js';

// ─────────────────────────────────────────────────────────
// DIVISOR ORNAMENTADO
// ─────────────────────────────────────────────────────────
const ParchmentDivider = ({ label }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, my: 1.2 }}>
    <Box sx={{ flex: 1, height: '1px', background: `linear-gradient(90deg, transparent, ${C.BORDER})` }} />
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
      <Box component="span" sx={{ color: C.ACCENT, fontSize: '0.72rem' }}>◆</Box>
      <Box sx={{
        fontFamily: '"Nunito", sans-serif', fontWeight: 700,
        fontSize: '0.72rem', letterSpacing: '2px', color: C.TEXT_MUTED, whiteSpace: 'nowrap',
      }}>{label}</Box>
      <Box component="span" sx={{ color: C.ACCENT, fontSize: '0.72rem' }}>◆</Box>
    </Box>
    <Box sx={{ flex: 1, height: '1px', background: `linear-gradient(270deg, transparent, ${C.BORDER})` }} />
  </Box>
);

// ─────────────────────────────────────────────────────────
// BADGE TIPO EFEITO
// ─────────────────────────────────────────────────────────
const TipoBadge = ({ campo }) => (
  <Box sx={{
    display: 'inline-flex', alignItems: 'center', gap: 0.5,
    px: 0.9, py: 0.25, mb: 0.7,
    borderRadius: '4px 10px 10px 4px',
    bgcolor: campo ? '#7B1C1C' : '#1B5E20',
    border: `1px solid ${campo ? '#A52020' : '#2E7D32'}`,
  }}>
    <Box sx={{ fontSize: '0.6rem' }}>{campo ? '🏅' : '⚔️'}</Box>
    <Box sx={{
      fontFamily: '"Nunito", sans-serif', fontWeight: 800,
      fontSize: '0.62rem', letterSpacing: '0.5px',
      color: campo ? '#FFCDD2' : '#C8E6C9',
    }}>{campo ? 'Efeito em Campo' : 'Efeito de Batalha'}</Box>
  </Box>
);

// ─────────────────────────────────────────────────────────
// CARD DE HABILIDADE — Nível atual / Nível máx.
// ─────────────────────────────────────────────────────────
const HabilidadeCard = ({ hab, cor, index }) => {
  const [expandido, setExpandido] = useState(false);
  const isCampo = hab.tipo && hab.tipo.toLowerCase().includes('campo');

  const xpPercent = (() => {
    if (!hab.nivelAtual?.xp) return 0;
    const parts = hab.nivelAtual.xp.split('/');
    if (parts.length !== 2) return 0;
    return Math.min(100, (parseFloat(parts[0]) / parseFloat(parts[1])) * 100);
  })();

  return (
    <Box
      onClick={() => setExpandido(!expandido)}
      sx={{
        borderRadius: '10px', border: `1.5px solid ${C.BORDER_SOFT}`,
        overflow: 'hidden', mb: 1.2, cursor: 'pointer',
        animation: `reveal-up 0.35s ${0.08 + index * 0.07}s ease both`,
        transition: 'box-shadow 0.2s',
        '&:hover': { boxShadow: `0 4px 16px ${cor}22` },
      }}
    >
      {/* CABEÇALHO */}
      <Box sx={{
        display: 'flex', alignItems: 'center', gap: 1.2, px: 1.5, py: 1,
        background: `linear-gradient(135deg, rgba(62,47,28,0.92) 0%, ${cor}55 100%)`,
        borderBottom: `1px solid ${cor}44`,
      }}>
        <Box sx={{
          width: 42, height: 42, flexShrink: 0, borderRadius: '8px',
          background: `linear-gradient(135deg, ${cor}33, ${cor}66)`,
          border: `1.5px solid ${cor}88`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.3rem', boxShadow: `0 2px 8px ${cor}44`,
        }}>{hab.emoji}</Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{
            fontFamily: '"Nunito", sans-serif', fontWeight: 900,
            fontSize: '0.92rem', color: '#FFF8EE', letterSpacing: '0.3px', lineHeight: 1.1,
          }}>
            {hab.nome}
            {hab.nivelAtual?.nivel != null && (
              <Box component="span" sx={{ ml: 0.7, fontSize: '0.68rem', fontWeight: 700, color: 'rgba(255,248,238,0.55)' }}>
                Nv.{hab.nivelAtual.nivel}
              </Box>
            )}
          </Box>

          {hab.nivelAtual?.xp && (
            <Box sx={{ mt: 0.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.15 }}>
                <Box sx={{ fontSize: '0.58rem', color: 'rgba(255,248,238,0.45)', fontFamily: '"Nunito", sans-serif' }}>
                  {hab.nivelAtual.xp}
                </Box>
              </Box>
              <Box sx={{ height: '4px', borderRadius: '2px', bgcolor: 'rgba(255,255,255,0.15)', overflow: 'hidden' }}>
                <Box sx={{ height: '100%', width: `${xpPercent}%`, background: `linear-gradient(90deg, ${cor}, #FFD700)`, borderRadius: '2px' }} />
              </Box>
            </Box>
          )}

          {hab.nivelAtual?.duracao && (
            <Box sx={{ mt: 0.3, fontSize: '0.63rem', color: 'rgba(255,248,238,0.6)', fontFamily: '"Nunito", sans-serif', fontWeight: 600 }}>
              ⏱ Duração: {hab.nivelAtual.duracao}
            </Box>
          )}
        </Box>

        <Box sx={{
          fontSize: '1.1rem', color: 'rgba(255,248,238,0.45)',
          transition: 'transform 0.25s',
          transform: expandido ? 'rotate(90deg)' : 'rotate(0deg)',
        }}>›</Box>
      </Box>

      {/* PAINEIS LADO A LADO */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        {/* Nível atual */}
        <Box sx={{ px: 1.2, py: 1, bgcolor: C.BG_CARD, borderRight: `1px solid ${C.BORDER_SOFT}` }}>
          <Box sx={{ fontFamily: '"Nunito", sans-serif', fontWeight: 900, fontSize: '0.70rem', color: C.TEXT_PRIMARY, mb: 0.5 }}>
            Nível atual
          </Box>
          {hab.nivelAtual?.defesa && (
            <Box sx={{ fontSize: '0.66rem', fontWeight: 700, color: C.DEFENSE, fontFamily: '"Nunito", sans-serif', mb: 0.4 }}>
              🛡 {hab.nivelAtual.defesa}
            </Box>
          )}
          <TipoBadge campo={isCampo} />
          <Box sx={{
            fontFamily: '"Nunito", sans-serif', fontWeight: 600, fontSize: '0.74rem',
            color: C.TEXT_SECONDARY, lineHeight: 1.55, whiteSpace: 'pre-line',
            display: expandido ? 'block' : '-webkit-box',
            WebkitLineClamp: expandido ? 'unset' : 4,
            WebkitBoxOrient: 'vertical',
            overflow: expandido ? 'visible' : 'hidden',
          }}>
            {hab.nivelAtual.descricao}
          </Box>
        </Box>

        {/* Nível máx. */}
        <Box sx={{ px: 1.2, py: 1, background: `linear-gradient(180deg, ${C.BG_CARD_TOP} 0%, ${C.BG_CARD} 100%)`, position: 'relative' }}>
          <Box sx={{
            position: 'absolute', left: -8, top: '50%', transform: 'translateY(-50%)',
            fontSize: '0.9rem', color: cor, opacity: 0.6, pointerEvents: 'none',
          }}>›</Box>
          <Box sx={{ fontFamily: '"Nunito", sans-serif', fontWeight: 900, fontSize: '0.70rem', color: '#A05820', mb: 0.5 }}>
            Nível máx.
          </Box>
          {hab.nivelMax?.defesa && (
            <Box sx={{ fontSize: '0.66rem', fontWeight: 700, color: C.ENERGY, fontFamily: '"Nunito", sans-serif', mb: 0.4 }}>
              🛡 {hab.nivelMax.defesa}
            </Box>
          )}
          <TipoBadge campo={isCampo} />
          <Box sx={{
            fontFamily: '"Nunito", sans-serif', fontWeight: 600, fontSize: '0.74rem',
            color: C.TEXT_SECONDARY, lineHeight: 1.55, whiteSpace: 'pre-line',
            display: expandido ? 'block' : '-webkit-box',
            WebkitLineClamp: expandido ? 'unset' : 4,
            WebkitBoxOrient: 'vertical',
            overflow: expandido ? 'visible' : 'hidden',
          }}>
            {hab.nivelMax.descricao}
          </Box>
        </Box>
      </Box>

      {!expandido && (
        <Box sx={{
          textAlign: 'center', py: 0.35,
          bgcolor: 'rgba(184,150,90,0.06)', borderTop: `1px solid ${C.BORDER_SOFT}`,
          fontFamily: '"Nunito", sans-serif', fontWeight: 600,
          fontSize: '0.62rem', color: C.TEXT_FAINT, letterSpacing: '0.4px',
        }}>
          toque para expandir
        </Box>
      )}
    </Box>
  );
};

// ─────────────────────────────────────────────────────────
// ATRIBUTO ROW
// ─────────────────────────────────────────────────────────
const AtributoRow = ({ label, valor, icone, cor }) => (
  <Box sx={{
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    py: 0.75, px: 0.5,
    borderBottom: `1px solid ${C.BORDER_SOFT}`,
    '&:last-child': { borderBottom: 'none' },
  }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
      <Box sx={{ fontSize: '1rem', lineHeight: 1, width: 20, textAlign: 'center' }}>{icone}</Box>
      <Box sx={{ fontFamily: '"Nunito", sans-serif', fontWeight: 700, fontSize: '0.82rem', color: C.TEXT_SECONDARY }}>
        {label}
      </Box>
    </Box>
    <Box sx={{
      fontFamily: '"Nunito", sans-serif', fontWeight: 900, fontSize: '0.88rem',
      color: valor > 0 ? (cor || C.ACCENT) : C.TEXT_FAINT,
      px: 1, py: 0.2, borderRadius: '5px',
      bgcolor: valor > 0 ? `${cor || C.ACCENT}15` : 'transparent',
    }}>
      {valor > 0 ? valor.toLocaleString('pt-BR') : '—'}
    </Box>
  </Box>
);

// ─────────────────────────────────────────────────────────
// ITEM ALIMENTAÇÃO
// ─────────────────────────────────────────────────────────
const ItemAlimentacao = ({ item }) => (
  <Box sx={{
    display: 'flex', alignItems: 'center', gap: 1.2,
    px: 1.4, py: 1, borderRadius: '8px',
    border: `1px solid ${C.BORDER_SOFT}`, bgcolor: C.BG_CARD, mb: 0.8,
    position: 'relative', overflow: 'hidden',
    '&::before': {
      content: '""', position: 'absolute',
      left: 0, top: 0, bottom: 0, width: '3px',
      background: item.cor, borderRadius: '8px 0 0 8px',
    },
  }}>
    <Box sx={{
      width: 38, height: 38, flexShrink: 0, borderRadius: '8px',
      background: `${item.cor}22`, border: `1.5px solid ${item.cor}44`,
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem',
    }}>{item.emoji}</Box>
    <Box sx={{ flex: 1 }}>
      <Box sx={{ fontFamily: '"Nunito", sans-serif', fontWeight: 800, fontSize: '0.85rem', color: C.TEXT_PRIMARY, mb: 0.2 }}>
        {item.nome}
      </Box>
      <Box sx={{ fontFamily: '"Nunito", sans-serif', fontWeight: 600, fontSize: '0.76rem', color: C.TEXT_SECONDARY, lineHeight: 1.4 }}>
        {item.desc}
      </Box>
    </Box>
  </Box>
);

// ─────────────────────────────────────────────────────────
// STAT BADGE (hero)
// ─────────────────────────────────────────────────────────
const StatBadge = ({ label, value, cor }) => (
  <Box sx={{
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    px: 1.2, py: 0.9, borderRadius: '8px',
    border: `1.5px solid ${cor}44`,
    background: `linear-gradient(135deg, ${cor}10 0%, ${cor}20 100%)`, flex: 1,
  }}>
    <Box sx={{ fontFamily: '"Nunito", sans-serif', fontWeight: 900, fontSize: '1.0rem', color: cor, lineHeight: 1 }}>
      {value}
    </Box>
    <Box sx={{
      fontFamily: '"Nunito", sans-serif', fontWeight: 700, fontSize: '0.62rem',
      color: C.TEXT_MUTED, letterSpacing: '0.8px', mt: 0.3, textAlign: 'center', textTransform: 'uppercase',
    }}>
      {label}
    </Box>
  </Box>
);

// ─────────────────────────────────────────────────────────
// DICA TÁTICA
// ─────────────────────────────────────────────────────────
const DicaCard = ({ dica, index, cor }) => (
  <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start', mb: 0.8, animation: `reveal-up 0.35s ${0.1 + index * 0.07}s ease both` }}>
    <Box sx={{
      width: 22, height: 22, flexShrink: 0, borderRadius: '50%',
      background: `${cor}22`, border: `1.5px solid ${cor}55`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '0.65rem', fontWeight: 900, color: cor, fontFamily: '"Nunito", sans-serif', mt: 0.1,
    }}>{index + 1}</Box>
    <Box sx={{ fontFamily: '"Nunito", sans-serif', fontWeight: 600, fontSize: '0.82rem', color: C.TEXT_SECONDARY, lineHeight: 1.55, flex: 1 }}>
      {dica}
    </Box>
  </Box>
);

// ─────────────────────────────────────────────────────────
// TELA PRINCIPAL
// ─────────────────────────────────────────────────────────
const DragaoDetalhe = ({ dragaoId }) => {
  const dragao = getDragaoById(dragaoId);

  if (!dragao) return (
    <Box sx={{ textAlign: 'center', mt: 6, color: C.TEXT_SECONDARY }}>
      <Box sx={{ fontSize: '3rem', mb: 1 }}>🐉</Box>
      <Box sx={{ fontFamily: '"Nunito", sans-serif', fontWeight: 700 }}>Dragão não encontrado.</Box>
    </Box>
  );

  const temAtributos   = !!dragao.atributosBase;
  const temItens       = dragao.itensAlimentacao?.length > 0;
  const temHabilidades = dragao.habilidades?.length > 0 && dragao.habilidades[0]?.nivelAtual;

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', pb: 5, animation: 'fade-in 0.3s ease both' }}>

      {/* ══ HERO BANNER ══ */}
      <Box sx={{
        borderRadius: '14px',
        background: `linear-gradient(140deg, rgba(62,47,28,0.97) 0%, ${dragao.corSecundaria}CC 50%, ${dragao.cor}99 100%)`,
        border: `2px solid ${dragao.cor}88`,
        boxShadow: `0 8px 32px ${dragao.cor}33, 0 2px 8px rgba(62,47,28,0.4)`,
        p: 2.5, mb: 2, position: 'relative', overflow: 'hidden',
        '&::after': {
          content: `"${dragao.emojiDragao}"`,
          position: 'absolute', fontSize: '9rem', opacity: 0.07,
          right: '-1.5rem', bottom: '-2rem', lineHeight: 1, pointerEvents: 'none', filter: 'blur(2px)',
        },
        '&::before': {
          content: '""', position: 'absolute',
          top: 0, left: '15%', right: '15%', height: '1px',
          background: `linear-gradient(90deg, transparent, ${dragao.cor}88, transparent)`,
        },
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, position: 'relative', zIndex: 1 }}>
          <Box sx={{
            width: 70, height: 70, flexShrink: 0, borderRadius: '14px',
            background: `linear-gradient(135deg, ${dragao.cor}33 0%, ${dragao.cor}66 100%)`,
            border: `2px solid ${dragao.cor}99`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2.4rem', boxShadow: `0 4px 16px ${dragao.cor}44`,
          }}>{dragao.emojiDragao}</Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', gap: 0.7, mb: 0.6, flexWrap: 'wrap' }}>
              <Box sx={{
                fontSize: '0.62rem', fontWeight: 800, fontFamily: '"Nunito", sans-serif',
                px: 0.8, py: 0.25, borderRadius: '4px',
                bgcolor: `${dragao.corRaridade}22`, border: `1px solid ${dragao.corRaridade}66`, color: dragao.corRaridade, letterSpacing: '0.6px',
              }}>✦ {dragao.raridade}</Box>
              <Box sx={{
                fontSize: '0.62rem', fontWeight: 800, fontFamily: '"Nunito", sans-serif',
                px: 0.8, py: 0.25, borderRadius: '4px',
                bgcolor: `${dragao.cor}22`, border: `1px solid ${dragao.cor}66`, color: dragao.cor, letterSpacing: '0.6px',
              }}>{dragao.emoji} {dragao.elemento}</Box>
            </Box>
            <Box sx={{
              fontFamily: '"Nunito", sans-serif', fontWeight: 900, fontSize: '1.4rem',
              color: '#FFF8EE', letterSpacing: '0.5px',
              textShadow: '0 2px 8px rgba(0,0,0,0.4)', lineHeight: 1.1,
            }}>{dragao.nome}</Box>
          </Box>
        </Box>
      </Box>

      {/* ══ STATS RÁPIDOS ══ */}
      <Box sx={{
        display: 'flex', gap: 1, mb: 2, p: 1.5,
        borderRadius: '10px', border: `1.5px solid ${C.BORDER_SOFT}`,
        background: `linear-gradient(135deg, ${C.BG_CARD} 0%, ${C.BG_CARD_TOP} 100%)`,
        boxShadow: '0 2px 8px rgba(62,47,28,0.1)',
      }}>
        <StatBadge label="Atributo"  value={dragao.atributo}                   cor={dragao.cor} />
        <StatBadge label="% / Nível" value={`+${dragao.porcentagemPorNivel}%`} cor={C.ENERGY} />
        <StatBadge label="Tropas"    value={dragao.tropasAfetadas.length}       cor={C.DEFENSE} />
        {temHabilidades && <StatBadge label="Hab." value={dragao.habilidades.length} cor={C.POWER} />}
      </Box>

      {/* ══ BÔNUS DE MARCHA ══ */}
      <ParchmentDivider label="BÔNUS DE MARCHA" />
      <Box sx={{
        p: 1.8, borderRadius: '10px', mb: 2,
        background: `linear-gradient(135deg, ${dragao.corFundo} 0%, ${C.BG_CARD} 100%)`,
        border: `1.5px solid ${dragao.cor}44`, boxShadow: `0 2px 12px ${dragao.cor}22`,
        position: 'relative', overflow: 'hidden',
        '&::before': {
          content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
          background: `linear-gradient(90deg, transparent, ${dragao.cor}, transparent)`,
        },
      }}>
        <Box sx={{ display: 'flex', gap: 0.6, flexWrap: 'wrap', mb: 1 }}>
          {dragao.tropasAfetadas.map((t) => (
            <Box key={t} sx={{
              fontSize: '0.72rem', fontWeight: 700, fontFamily: '"Nunito", sans-serif',
              px: 1, py: 0.3, borderRadius: '5px',
              bgcolor: `${dragao.cor}18`, border: `1px solid ${dragao.cor}44`, color: dragao.cor,
            }}>⚔️ {t}</Box>
          ))}
        </Box>
        <Box sx={{ fontFamily: '"Nunito", sans-serif', fontWeight: 700, fontSize: '0.88rem', color: C.TEXT_PRIMARY, lineHeight: 1.6 }}>
          {dragao.bonusMarcha}
        </Box>
      </Box>

      {/* ══ ATRIBUTOS BASE ══ */}
      {temAtributos && (
        <>
          <ParchmentDivider label="ATRIBUTOS BASE" />
          <Box sx={{
            borderRadius: '10px', border: `1.5px solid ${C.BORDER_SOFT}`,
            bgcolor: C.BG_CARD, overflow: 'hidden', mb: 2,
            boxShadow: '0 2px 8px rgba(62,47,28,0.08)',
          }}>
            <Box sx={{
              display: 'flex', justifyContent: 'space-between',
              px: 1.5, py: 0.8, bgcolor: C.BG_SECONDARY, borderBottom: `1px solid ${C.BORDER_SOFT}`,
            }}>
              <Box sx={{ fontFamily: '"Nunito", sans-serif', fontWeight: 800, fontSize: '0.72rem', color: C.TEXT_MUTED, letterSpacing: '1px' }}>ATRIBUTOS</Box>
              <Box sx={{ fontFamily: '"Nunito", sans-serif', fontWeight: 800, fontSize: '0.72rem', color: C.TEXT_MUTED, letterSpacing: '1px' }}>DRAGÃO</Box>
            </Box>
            <Box sx={{ px: 1.5, py: 0.5 }}>
              <AtributoRow label="Vida"             valor={dragao.atributosBase.vida}           icone="❤️" cor={C.HEALTH} />
              <AtributoRow label="Defesa"           valor={dragao.atributosBase.defesa}         icone="🛡️" cor={C.DEFENSE} />
              <AtributoRow label="Ataque de Perto"  valor={dragao.atributosBase.ataquePerto}    icone="⚔️" cor={C.ATTACK} />
              <AtributoRow label="Ataque Distante"  valor={dragao.atributosBase.ataqueDistante} icone="🏹" cor={C.ATTACK} />
              <AtributoRow label="Alcance"          valor={dragao.atributosBase.alcance}        icone="🎯" cor={C.ACCENT} />
              <AtributoRow label="Velocidade"       valor={dragao.atributosBase.velocidade}     icone="⚡" cor={C.ENERGY} />
            </Box>
          </Box>
        </>
      )}

      {/* ══ HABILIDADES ══ */}
      {temHabilidades && (
        <>
          <ParchmentDivider label="HABILIDADES" />
          <Box sx={{ mb: 2 }}>
            {dragao.habilidades.map((hab, i) => (
              <HabilidadeCard key={hab.id || hab.nome} hab={hab} cor={dragao.cor} index={i} />
            ))}
          </Box>
        </>
      )}

      {/* ══ ITENS DE ALIMENTAÇÃO ══ */}
      {temItens && (
        <>
          <ParchmentDivider label="ITENS DE ALIMENTAÇÃO" />
          <Box sx={{ mb: 2 }}>
            {dragao.itensAlimentacao.map((item) => (
              <ItemAlimentacao key={item.id} item={item} />
            ))}
          </Box>
        </>
      )}

      {/* ══ LORE ══ */}
      <ParchmentDivider label="LORE" />
      <Box sx={{
        p: 1.8, mb: 2, borderRadius: '10px',
        border: `1px solid ${C.BORDER_SOFT}`, bgcolor: C.BG_CARD, position: 'relative',
        '&::before': {
          content: '"❝"', position: 'absolute', top: 6, left: 10,
          fontSize: '1.6rem', color: C.BORDER_STRONG, opacity: 0.3,
          fontFamily: 'Georgia, serif', lineHeight: 1,
        },
      }}>
        <Box sx={{
          fontFamily: '"Nunito", sans-serif', fontWeight: 600, fontSize: '0.86rem',
          color: C.TEXT_SECONDARY, lineHeight: 1.7, pt: 0.5, fontStyle: 'italic',
        }}>{dragao.descricao}</Box>
      </Box>

      {/* ══ DICAS TÁTICAS ══ */}
      {dragao.dicas?.length > 0 && (
        <>
          <ParchmentDivider label="DICAS TÁTICAS" />
          <Box sx={{
            p: 1.8, mb: 2, borderRadius: '10px',
            border: `1px solid ${C.BORDER_SOFT}`,
            background: `linear-gradient(135deg, ${C.BG_CARD} 0%, rgba(184,150,90,0.08) 100%)`,
          }}>
            {dragao.dicas.map((dica, i) => <DicaCard key={i} dica={dica} index={i} cor={dragao.cor} />)}
          </Box>
        </>
      )}

      {/* ══ BOTÃO TRACKER ══ */}
      {dragao.habilidades?.some((h) => h.nivelAtual) && (
        <>
          <ParchmentDivider label="PROGRESSO PESSOAL" />
          <Box
            onClick={() => {
              // Navegar para tracker — o setRoute está disponível via prop
              if (typeof window !== 'undefined') {
                window.__setRoute?.(`dragao_tracker_${dragao.id}`);
              }
            }}
            sx={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              p: 1.8, borderRadius: '10px', cursor: 'pointer', mb: 1,
              background: `linear-gradient(135deg, rgba(62,47,28,0.85) 0%, ${dragao.cor}55 100%)`,
              border: `2px solid ${dragao.cor}66`,
              boxShadow: `0 4px 16px ${dragao.cor}22`,
              transition: 'all 0.2s',
              '&:hover': { transform: 'translateY(-2px)', boxShadow: `0 8px 24px ${dragao.cor}33` },
              '&:active': { transform: 'scale(0.98)' },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
              <Box sx={{ fontSize: '1.6rem', lineHeight: 1 }}>📊</Box>
              <Box>
                <Box sx={{ fontFamily: '"Nunito", sans-serif', fontWeight: 900, fontSize: '0.95rem', color: '#FFF8EE', mb: 0.2 }}>
                  Meu Progresso
                </Box>
                <Box sx={{ fontFamily: '"Nunito", sans-serif', fontWeight: 600, fontSize: '0.72rem', color: 'rgba(255,248,238,0.6)' }}>
                  Acompanhe o nível e XP de cada habilidade
                </Box>
              </Box>
            </Box>
            <Box sx={{ fontSize: '1.2rem', color: dragao.cor, opacity: 0.8 }}>›</Box>
          </Box>
        </>
      )}

    </Box>
  );
};

export default DragaoDetalhe;
