import React, { useState, useEffect, useRef, useCallback } from 'react';
import { C } from '../theme.js';

// ─── Paleta 70 cores ─────────────────────────────────────────────────────────
const PRESETS = [
  '#FF0000','#FF3333','#FF6666','#FF9999','#FF1493','#FF69B4','#FFB6C1','#DC143C','#C71585','#B22222',
  '#FF4500','#FF6600','#FF8C00','#FFA500','#FFB347','#FFD700','#FFEC8B','#FFF44F',
  '#ADFF2F','#7FFF00','#39FF14','#32CD32','#00FF00','#228B22','#006400',
  '#00FA9A','#00FF7F','#3CB371','#2E8B57','#008000',
  '#00CED1','#00BFFF','#87CEEB','#1E90FF','#4169E1','#0080FF','#0000FF','#0000CD','#000080',
  '#40E0D0','#48D1CC','#20B2AA','#008B8B',
  '#7B68EE','#6A5ACD','#8A2BE2','#9400D3','#9932CC','#800080',
  '#BA55D3','#DA70D6','#EE82EE','#DDA0DD','#FF00FF','#FF77FF',
  '#D2691E','#8B4513','#A0522D','#CD853F','#DEB887','#F4A460',
  '#FFFFFF','#F0F0F0','#DCDCDC','#C0C0C0','#A9A9A9','#808080','#696969','#404040','#1C1C1C','#000000',
];

// ─── Kaomoji & Símbolos ───────────────────────────────────────────────────────
const KAOMOJI = [
  {l:'｡♡‿♡｡',t:'｡♡‿♡｡'},{l:'(◕‿◕)',t:'(◕‿◕)'},{l:'(✿◡‿◡)',t:'(✿◡‿◡)'},
  {l:'ʕ•ᴥ•ʔ',t:'ʕ•ᴥ•ʔ'},{l:'(≧◡≦)',t:'(≧◡≦)'},{l:'(╥﹏╥)',t:'(╥﹏╥)'},
  {l:'✧˖°',t:'✧˖°'},{l:'°•✦•°',t:'°•✦•°'},{l:'★~(◠‿◕✿)',t:'★~(◠‿◕✿)'},
  {l:'(っ˘ω˘ς)',t:'(っ˘ω˘ς)'},{l:'¯\\_(ツ)_/¯',t:'¯\\_(ツ)_/¯'},
  {l:'(ﾉ◕ヮ◕)ﾉ',t:'(ﾉ◕ヮ◕)ﾉ'},{l:'(ง •̀_•́)ง',t:'(ง •̀_•́)ง'},
  {l:'(＾▽＾)',t:'(＾▽＾)'},{l:'( ˘ ³˘)♥',t:'( ˘ ³˘)♥'},
  {l:'ฅ^•ﻌ•^ฅ',t:'ฅ^•ﻌ•^ฅ'},{l:'(ʘᗩʘ)',t:'(ʘᗩʘ)'},
  {l:'UwU',t:'UwU'},{l:'OwO',t:'OwO'},{l:'^w^',t:'^w^'},
];

const SYM_CATS = [
  {name:'Corações', s:['♡','♥','❤','❥','❣','❦','💗','💓','💞','💝','🖤','🤍','💛','🧡','💜','💙','💚','❧']},
  {name:'Estrelas',  s:['★','☆','✦','✧','✩','✪','✫','✬','✭','✮','✯','✰','⭐','💫','✨','🌟','⚡']},
  {name:'Flores',    s:['✿','❀','❁','✾','☘','🌸','🌺','🌻','🌹','🌷','🌼','🍀','🍃','🌿','🍂','🍁','🌱']},
  {name:'Especiais', s:['•','·','‿','~','–','—','…','°','♪','♫','♬','♩','✓','✗','∞','§','†','‡','™','©','®']},
  {name:'Formas',    s:['▲','△','▼','▽','◆','◇','●','○','■','□','▪','▫','◉','◎','⬟','⬡','⬢','⬣']},
  {name:'Setas',     s:['→','←','↑','↓','↗','↘','↙','↖','↔','↕','⇒','⇐','⇑','⇓','»','«','›','‹']},
];

const SUGGEST_PALETTES = [
  ['FF1493','00FF00','1E90FF','FFD700','FF4500','8A2BE2'],
  ['FF1493','FF1493','00FF00','00FF00','1E90FF','1E90FF'],
  ['FF0080','FF4040','FF8000','FFD700','80FF00','00FF80'],
  ['8A2BE2','9932CC','DA70D6','FF69B4','FFB6C1','FFFFFF'],
  ['1E90FF','00BFFF','00FA9A','7FFF00','FFD700','FF4500'],
];
const SUGGEST_NAMES = ['Arco-íris','Pares','Gradiente','Roxo ✦','Oceano'];

// ─── Estilos temáticos (navy/gold/cream) ──────────────────────────────────────
const T = {
  overlay: {
    position: 'fixed', inset: 0, zIndex: 9999,
    background: 'rgba(15,25,45,0.82)',
    backdropFilter: 'blur(4px)',
    display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
    padding: '0',
    overflowY: 'auto',
  },
  modal: {
    width: '100%', maxWidth: 520,
    background: C.BG_CARD,
    borderRadius: 0,
    minHeight: '100dvh',
    display: 'flex', flexDirection: 'column',
    position: 'relative',
  },
  header: {
    background: 'linear-gradient(135deg,#1C3A5E,#2A4C72)',
    borderBottom: `1px solid rgba(200,168,74,0.4)`,
    padding: '10px 16px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    position: 'sticky', top: 0, zIndex: 10,
  },
  headerTitle: {
    fontFamily: "'Cinzel', serif",
    fontWeight: 700,
    fontSize: '0.82rem',
    color: 'rgba(200,168,74,0.9)',
    letterSpacing: '2px',
    textTransform: 'uppercase',
  },
  closeBtn: {
    width: 30, height: 30,
    background: 'transparent',
    border: '1px solid rgba(200,168,74,0.3)',
    borderRadius: 6,
    color: 'rgba(248,242,224,0.5)',
    fontSize: '1rem', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  body: {
    flex: 1, padding: '12px 14px 80px',
    overflowY: 'auto',
  },
  sectionLabel: {
    fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.13em',
    color: C.TEXT_MUTED, marginBottom: 6, marginTop: 4,
    display: 'flex', alignItems: 'center', gap: 6,
  },
  card: {
    background: C.BG_CARD,
    border: `1.5px solid rgba(200,168,74,0.25)`,
    borderRadius: 12,
    padding: '12px 14px',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.14em',
    color: C.TEXT_MUTED, marginBottom: 10,
    display: 'flex', alignItems: 'center', gap: 6,
  },
  input: {
    flex: 1,
    background: C.BG_INPUT,
    border: `1.5px solid rgba(200,168,74,0.3)`,
    borderRadius: 8, color: C.TEXT_PRIMARY,
    fontFamily: 'inherit', fontSize: '0.9rem',
    padding: '10px 12px', outline: 'none',
    resize: 'none', minHeight: 44, maxHeight: 110,
    transition: 'border-color 0.2s',
  },
  btnSolid: {
    background: 'linear-gradient(135deg,#2A4C72,#1C3A5E)',
    color: 'rgba(200,168,74,0.95)',
    border: '1.5px solid rgba(200,168,74,0.45)',
    borderRadius: 8, cursor: 'pointer',
    fontSize: '0.72rem', letterSpacing: '0.06em', textTransform: 'uppercase',
    padding: '0 14px', height: 36,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 5,
    fontFamily: 'inherit', transition: 'all 0.14s',
  },
  btnOutline: {
    background: C.BG_INPUT,
    color: C.TEXT_SECONDARY,
    border: `1.5px solid rgba(200,168,74,0.3)`,
    borderRadius: 8, cursor: 'pointer',
    fontSize: '0.72rem', letterSpacing: '0.06em', textTransform: 'uppercase',
    padding: '0 12px', height: 34,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 4,
    fontFamily: 'inherit', transition: 'all 0.14s',
  },
  catTab: (active) => ({
    background: active ? 'linear-gradient(135deg,#2A4C72,#1C3A5E)' : 'transparent',
    border: active ? '1.5px solid rgba(200,168,74,0.5)' : `1.5px solid rgba(200,168,74,0.2)`,
    borderRadius: 5, color: active ? 'rgba(200,168,74,0.95)' : C.TEXT_MUTED,
    fontSize: '0.6rem', padding: '3px 9px', cursor: 'pointer',
    letterSpacing: '0.07em', textTransform: 'uppercase',
    fontFamily: 'inherit', transition: 'all 0.12s',
  }),
  exBtn: {
    background: C.BG_INPUT, border: `1.5px solid rgba(200,168,74,0.25)`,
    borderRadius: 6, color: C.TEXT_SECONDARY,
    fontFamily: 'inherit', fontSize: '0.78rem',
    padding: '3px 8px', cursor: 'pointer', whiteSpace: 'nowrap', userSelect: 'none',
    transition: 'all 0.12s',
  },
  exSym: {
    width: 30, height: 30, padding: 0, fontSize: '1rem',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    background: C.BG_INPUT, border: `1.5px solid rgba(200,168,74,0.25)`,
    borderRadius: 6, color: C.TEXT_PRIMARY, cursor: 'pointer', userSelect: 'none',
    flexShrink: 0, transition: 'all 0.12s',
  },
  modeTabs: {
    display: 'flex', gap: 4, marginBottom: 12,
    background: C.BG_SECONDARY, borderRadius: 8, padding: 3,
    border: `1.5px solid rgba(200,168,74,0.2)`,
  },
  modeTab: (active) => ({
    flex: 1, background: active ? 'linear-gradient(135deg,#2A4C72,#1C3A5E)' : 'none',
    border: 'none', borderRadius: 6,
    color: active ? 'rgba(200,168,74,0.9)' : C.TEXT_MUTED,
    fontFamily: 'inherit', fontSize: '0.7rem', padding: '8px 6px',
    cursor: 'pointer', letterSpacing: '0.05em', textTransform: 'uppercase',
    transition: 'all 0.14s',
  }),
  codeBox: {
    background: '#0F1E35',
    border: '1.5px solid rgba(200,168,74,0.2)',
    borderRadius: 9, color: '#8ee88e',
    fontFamily: 'monospace', fontSize: '0.79rem',
    padding: '12px 42px 12px 13px',
    wordBreak: 'break-all', lineHeight: 1.8, minHeight: 44,
    whiteSpace: 'pre-wrap',
  },
  divider: {
    height: 1,
    background: `linear-gradient(90deg,transparent,rgba(200,168,74,0.25),transparent)`,
    margin: '12px 0',
  },
};

// ─── Utilitário mk ──────────────────────────────────────────────────────────
function safeCopy(text, onSuccess) {
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).then(onSuccess).catch(() => fallbackCopy(text, onSuccess));
  } else {
    fallbackCopy(text, onSuccess);
  }
}
function fallbackCopy(text, onSuccess) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:fixed;top:-999px;left:-999px;opacity:0';
  document.body.appendChild(ta);
  ta.focus(); ta.select();
  try { if (document.execCommand('copy') && onSuccess) onSuccess(); } catch {}
  document.body.removeChild(ta);
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════
export default function ColorTextBuilder({ onClose }) {
  // ── State ──────────────────────────────────────────────────────────────────
  const [tokens,      setTokens]      = useState([]);
  const [selected,    setSelected]    = useState(new Set());
  const [mode,        setMode]        = useState('select');
  const [activeColor, setActiveColor] = useState('C4A9FF');
  const [savedColors, setSavedColors] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ctb_saved') || '[]'); } catch { return []; }
  });
  const [symCat,   setSymCat]   = useState(0);
  const [flagReg,  setFlagReg]  = useState(0);
  const [toast,    setToast]    = useState('');
  const [toastVis, setToastVis] = useState(false);
  const [hexInput, setHexInput] = useState('C4A9FF');
  const [cpicker,  setCpicker]  = useState('#c4a9ff');
  const [codeCopied, setCodeCopied] = useState(false);
  const toastTimer = useRef(null);
  const inputRef   = useRef(null);
  const [inputVal, setInputVal] = useState('');

  // ── Toast ──────────────────────────────────────────────────────────────────
  const showToast = useCallback((msg) => {
    setToast(msg); setToastVis(true);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastVis(false), 2000);
  }, []);

  // ── Persistir cores salvas ─────────────────────────────────────────────────
  useEffect(() => {
    try { localStorage.setItem('ctb_saved', JSON.stringify(savedColors)); } catch {}
  }, [savedColors]);

  // ── Fechar com ESC ─────────────────────────────────────────────────────────
  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose]);

  // ── Cor ativa ──────────────────────────────────────────────────────────────
  const setActive = (hex6) => {
    const h = hex6.replace('#', '').toUpperCase();
    setActiveColor(h);
    setHexInput(h);
    setCpicker('#' + h.toLowerCase());
  };

  // ── Parse texto → tokens ──────────────────────────────────────────────────
  const parseText = () => {
    if (!inputVal.trim()) return;
    setTokens([...inputVal].map(c => ({ char: c, color: null })));
    setSelected(new Set());
  };

  // ── Gerar código de saída ─────────────────────────────────────────────────
  const getCode = () => {
    if (!tokens.length) return '';
    let result = '', i = 0;
    while (i < tokens.length) {
      const tk = tokens[i];
      if (!tk.color) { result += tk.char; i++; }
      else {
        const col = tk.color; let run = '';
        while (i < tokens.length && tokens[i].color === col) { run += tokens[i].char; i++; }
        result += '[' + col + ']' + run;
      }
    }
    return result;
  };

  // ── Selecionar tokens ─────────────────────────────────────────────────────
  const toggleToken = (i) => {
    setSelected(prev => {
      const n = new Set(prev);
      n.has(i) ? n.delete(i) : n.add(i);
      return n;
    });
  };
  const selectAll  = () => setSelected(new Set(tokens.map((_, i) => i)));
  const selectNone = () => setSelected(new Set());
  const invertSel  = () => setSelected(new Set(tokens.map((_, i) => i).filter(i => !selected.has(i))));

  // ── Aplicar cor ───────────────────────────────────────────────────────────
  const applyColor = () => {
    if (!selected.size) { showToast('Selecione ao menos um caractere'); return; }
    const n = selected.size;
    setTokens(prev => prev.map((tk, i) => selected.has(i) ? { ...tk, color: activeColor } : tk));
    setSelected(new Set());
    showToast(`#${activeColor} aplicado a ${n} caractere(s)`);
  };

  const paintToken = (i) => {
    setTokens(prev => prev.map((tk, j) => j === i ? { ...tk, color: activeColor } : tk));
  };

  // ── Sugestões ────────────────────────────────────────────────────────────
  const applySuggest = (pi) => {
    if (!tokens.length) {
      if (!inputVal.trim()) return;
      const tks = [...inputVal].map(c => ({ char: c, color: null }));
      setTokens(tks.map((tk, i) => ({ ...tk, color: SUGGEST_PALETTES[pi][i % SUGGEST_PALETTES[pi].length] })));
    } else {
      setTokens(prev => prev.map((tk, i) => ({ ...tk, color: SUGGEST_PALETTES[pi][i % SUGGEST_PALETTES[pi].length] })));
    }
    setSelected(new Set());
    showToast(`Estilo "${SUGGEST_NAMES[pi]}" aplicado!`);
  };

  // ── Inserir no input ──────────────────────────────────────────────────────
  const insertInInput = (text) => {
    const el = inputRef.current;
    if (!el) return;
    const pos = el.selectionStart ?? inputVal.length;
    const next = inputVal.slice(0, pos) + text + inputVal.slice(pos);
    setInputVal(next);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(pos + text.length, pos + text.length);
    }, 0);
  };

  const code = getCode();
  const coloredCount = tokens.filter(t => t.color).length;

  // ══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════════════════════
  return (
    <div style={T.overlay} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={T.modal}>

        {/* ── HEADER ─────────────────────────────────────────────────────── */}
        <div style={T.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '1.1rem' }}>🎨</span>
            <span style={T.headerTitle}>◆ Construtor de Texto Colorido ◆</span>
          </div>
          <button style={T.closeBtn} onClick={onClose} title="Fechar (ESC)">✕</button>
        </div>

        {/* Linha dourada ornamental */}
        <div style={{ height: 2, background: `linear-gradient(90deg,transparent,${C.ACCENT},transparent)`, opacity: 0.5 }} />

        {/* ── BODY ───────────────────────────────────────────────────────── */}
        <div style={T.body}>

          {/* ① COMPOR */}
          <div style={T.card}>
            <div style={T.cardTitle}>
              <span style={{ color: C.ACCENT }}>①</span> Componha seu texto
            </div>

            {/* Sugestões de estilo */}
            <div style={T.sectionLabel}>Sugestões de cor automática</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 10 }}>
              {SUGGEST_PALETTES.map((pal, pi) => (
                <button key={pi}
                  style={{ ...T.exBtn, display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 9px', borderRadius: 7 }}
                  onClick={() => applySuggest(pi)}
                  title={`Aplicar: ${SUGGEST_NAMES[pi]}`}
                >
                  <span style={{ fontSize: '0.9rem' }}>
                    {'｡♡‿♡｡'.split('').map((ch, i) => (
                      <span key={i} style={{ color: '#' + pal[i % pal.length] }}>{ch}</span>
                    ))}
                  </span>
                  <span style={{ fontSize: '0.72rem' }}>{SUGGEST_NAMES[pi]}</span>
                </button>
              ))}
            </div>

            {/* Kaomoji */}
            <div style={T.sectionLabel}>Kaomoji & emoticons</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
              {KAOMOJI.map((e, i) => (
                <button key={i} style={T.exBtn} onClick={() => insertInInput(e.t)}>{e.l}</button>
              ))}
            </div>

            {/* Símbolos por categoria */}
            <div style={T.sectionLabel}>Símbolos</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginBottom: 7 }}>
              {SYM_CATS.map((cat, i) => (
                <button key={i} style={T.catTab(symCat === i)} onClick={() => setSymCat(i)}>
                  {cat.name}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
              {SYM_CATS[symCat].s.map((s, i) => (
                <button key={i} style={T.exSym} onClick={() => insertInInput(s)}>{s}</button>
              ))}
            </div>

            {/* Textarea + botão */}
            <div style={{ display: 'flex', gap: 8, alignItems: 'stretch' }}>
              <textarea
                ref={inputRef}
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); parseText(); } }}
                placeholder="Clique nos símbolos acima ou escreva aqui..."
                rows={1}
                style={T.input}
              />
              <button style={{ ...T.btnSolid, height: 44, paddingLeft: 16, paddingRight: 16 }} onClick={parseText}>
                → Montar
              </button>
            </div>
            <p style={{ fontSize: '0.67rem', color: C.TEXT_MUTED, marginTop: 6, letterSpacing: '0.02em' }}>
              Cada caractere vira um bloco colorável — Enter também monta.
            </p>
          </div>

          {/* ② EDITOR DE TOKENS */}
          {tokens.length > 0 && (
            <div style={T.card}>
              <div style={{ ...T.cardTitle, justifyContent: 'space-between' }}>
                <span><span style={{ color: C.ACCENT }}>②</span> Selecione e pinte</span>
                <span style={{ fontSize: '0.65rem', color: C.TEXT_MUTED, textTransform: 'none', letterSpacing: 0 }}>
                  {tokens.length} chars · {coloredCount} coloridos
                </span>
              </div>

              {/* Mode tabs */}
              <div style={T.modeTabs}>
                <button style={T.modeTab(mode === 'select')} onClick={() => setMode('select')}>
                  ✦ Selecionar & aplicar
                </button>
                <button style={T.modeTab(mode === 'paint')} onClick={() => setMode('paint')}>
                  🖌 Pintar letra a letra
                </button>
              </div>

              {/* Helpers de seleção */}
              {mode === 'select' && (
                <div style={{ display: 'flex', gap: 5, marginBottom: 10, flexWrap: 'wrap' }}>
                  <button style={T.btnOutline} onClick={selectAll}>Todos</button>
                  <button style={T.btnOutline} onClick={selectNone}>Nenhum</button>
                  <button style={T.btnOutline} onClick={invertSel}>Inverter</button>
                </div>
              )}

              {/* Info do pincel */}
              {mode === 'paint' && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 9,
                  padding: '8px 12px',
                  background: 'rgba(42,76,114,0.15)',
                  border: '1.5px solid rgba(200,168,74,0.25)',
                  borderRadius: 9, marginBottom: 10, fontSize: '0.73rem', color: C.TEXT_SECONDARY,
                }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#' + activeColor, border: '2px solid rgba(200,168,74,0.3)', flexShrink: 0 }} />
                  <span style={{ fontWeight: 600 }}>#{activeColor}</span>
                  <span style={{ opacity: 0.7 }}>— clique em qualquer caractere para pintar</span>
                </div>
              )}

              {/* Grid de tokens */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, minHeight: 44, padding: '2px 0 6px' }}>
                {tokens.map((tk, i) => {
                  const isSel = selected.has(i);
                  return (
                    <div
                      key={i}
                      onClick={() => mode === 'paint' ? paintToken(i) : toggleToken(i)}
                      style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                        background: isSel ? 'rgba(42,76,114,0.25)' : C.BG_SECONDARY,
                        border: isSel ? `2px solid ${C.ACCENT}` : `2px solid rgba(200,168,74,0.2)`,
                        borderRadius: 7, padding: '6px 6px 4px',
                        cursor: 'pointer', userSelect: 'none', minWidth: 32,
                        transition: 'all 0.1s', position: 'relative',
                        boxShadow: isSel ? `0 0 0 3px rgba(200,168,74,0.18)` : 'none',
                        transform: isSel ? 'translateY(-2px)' : 'none',
                      }}
                    >
                      {isSel && (
                        <span style={{
                          position: 'absolute', top: -7, right: -7,
                          width: 14, height: 14, background: C.ACCENT,
                          color: '#fff', borderRadius: '50%',
                          fontSize: 7, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 700, lineHeight: '14px', textAlign: 'center',
                        }}>✓</span>
                      )}
                      <span style={{ fontSize: '1.1rem', lineHeight: 1, color: tk.color ? '#' + tk.color : C.TEXT_PRIMARY }}>
                        {tk.char === ' ' ? '·' : tk.char}
                      </span>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: tk.color ? '#' + tk.color : 'rgba(200,168,74,0.2)', flexShrink: 0 }} />
                    </div>
                  );
                })}
              </div>

              <div style={T.divider} />

              {/* Cor ativa + aplicar */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 12px',
                background: C.BG_SECONDARY,
                border: `1.5px solid rgba(200,168,74,0.2)`,
                borderRadius: 9, marginBottom: 12, flexWrap: 'wrap',
              }}>
                <div style={{ width: 24, height: 24, borderRadius: 6, background: '#' + activeColor, border: '2px solid rgba(200,168,74,0.4)', flexShrink: 0 }} />
                <span style={{ fontSize: '0.83rem', color: C.TEXT_PRIMARY, fontWeight: 500, flex: 1 }}>#{activeColor}</span>
                {mode === 'select' && (
                  <button style={T.btnSolid} onClick={applyColor}>Aplicar selecionados</button>
                )}
              </div>

              {/* Paleta */}
              <div style={T.sectionLabel}>Paleta de cores — clique para ativar</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 12, alignItems: 'center' }}>
                {[...PRESETS, ...savedColors].map((hex, i) => {
                  const isSaved = i >= PRESETS.length;
                  const isActive = hex.replace('#', '').toUpperCase() === activeColor;
                  return (
                    <div
                      key={i}
                      onClick={() => { setActive(hex); showToast('Cor ' + hex.toUpperCase() + ' ativa'); }}
                      onContextMenu={isSaved ? (e) => {
                        e.preventDefault();
                        setSavedColors(prev => prev.filter(c => c.toLowerCase() !== hex.toLowerCase()));
                        showToast('Cor removida');
                      } : undefined}
                      title={hex + (isSaved ? ' (clique dir p/ remover)' : '')}
                      style={{
                        width: 24, height: 24, borderRadius: 6,
                        background: hex, flexShrink: 0, cursor: 'pointer',
                        border: isActive ? `2.5px solid ${C.ACCENT}` : '2.5px solid transparent',
                        boxShadow: isActive ? `0 0 0 2px rgba(200,168,74,0.5)` : 'none',
                        outline: isSaved ? '2px dashed rgba(200,168,74,0.4)' : 'none',
                        outlineOffset: 2,
                        transition: 'all 0.1s',
                        transform: isActive ? 'scale(1.1)' : 'scale(1)',
                      }}
                    />
                  );
                })}
              </div>

              {/* Cor personalizada */}
              <div style={T.sectionLabel}>Cor personalizada</div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <input type="color" value={cpicker}
                  onChange={e => setActive(e.target.value.replace('#', ''))}
                  style={{ width: 38, height: 32, border: `1.5px solid rgba(200,168,74,0.3)`, borderRadius: 6, cursor: 'pointer', padding: 2, background: C.BG_INPUT }}
                />
                <input
                  type="text" value={hexInput} maxLength={7}
                  placeholder="C4A9FF"
                  onChange={e => {
                    const v = e.target.value.replace(/[^0-9a-fA-F]/g, '').toUpperCase();
                    setHexInput(v);
                    if (v.length === 6) setActive(v);
                  }}
                  style={{ ...T.input, width: 100, minHeight: 32, fontSize: '0.82rem', flex: 'none' }}
                />
                <button style={T.btnOutline} onClick={() => { if (hexInput.length === 6) { setActive(hexInput); showToast('Cor #' + hexInput + ' ativa'); } else showToast('Hex inválido — 6 dígitos'); }}>
                  Definir ativa
                </button>
                <button
                  title="Salvar na paleta"
                  onClick={() => {
                    const hex = '#' + activeColor;
                    if (savedColors.map(c => c.toUpperCase()).includes(hex.toUpperCase())) { showToast('Já está na paleta!'); return; }
                    if (savedColors.length >= 20) { showToast('Máximo 20 cores salvas'); return; }
                    setSavedColors(prev => [...prev, hex.toUpperCase()]);
                    showToast('Cor salva ✦');
                  }}
                  style={{ ...T.btnOutline, width: 32, padding: 0, fontSize: '1.1rem' }}
                >+</button>
              </div>
            </div>
          )}

          {/* ③ RESULTADO */}
          {tokens.length > 0 && (
            <div style={T.card}>
              <div style={T.cardTitle}>
                <span style={{ color: C.ACCENT }}>③</span> Resultado
              </div>

              {/* Preview colorido */}
              <div style={{ fontSize: '1.3rem', lineHeight: 2, minHeight: 40, wordBreak: 'break-all', padding: '2px 0 4px' }}>
                {tokens.map((tk, i) => (
                  <span key={i} style={{ color: tk.color ? '#' + tk.color : C.TEXT_SECONDARY, fontWeight: tk.color ? 600 : 400 }}>
                    {tk.char}
                  </span>
                ))}
              </div>

              <div style={T.divider} />

              {/* Código gerado */}
              <div style={T.sectionLabel}>Código gerado</div>
              <div style={{ position: 'relative', marginBottom: 10 }}>
                <div style={T.codeBox}>{code}</div>
                <button
                  onClick={() => safeCopy(code, () => { setCodeCopied(true); setTimeout(() => setCodeCopied(false), 1800); })}
                  style={{
                    position: 'absolute', top: 8, right: 8,
                    background: '#1A2E4A', border: '1.5px solid rgba(200,168,74,0.3)',
                    borderRadius: 6, color: codeCopied ? '#8ee88e' : 'rgba(200,168,74,0.6)',
                    fontSize: '0.9rem', width: 28, height: 28,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.15s',
                  }}
                  title="Copiar código"
                >
                  {codeCopied ? '✓' : '⎘'}
                </button>
              </div>

              {/* Ações */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, alignItems: 'center' }}>
                <button style={T.btnSolid} onClick={() => safeCopy(code, () => showToast('Código copiado!'))}>
                  ⎘ Copiar código
                </button>
                <button style={T.btnOutline} onClick={() => safeCopy(tokens.map(t => t.char).join(''), () => showToast('Texto puro copiado!'))}>
                  ⎘ Texto puro
                </button>
                <button style={T.btnOutline} onClick={() => { setTokens(prev => prev.map(tk => ({ ...tk, color: null }))); setSelected(new Set()); showToast('Cores removidas'); }}>
                  ✦ Limpar cores
                </button>
                <button
                  style={{ ...T.btnOutline, color: C.ERROR, borderColor: 'rgba(168,60,44,0.35)' }}
                  onClick={() => { setTokens([]); setSelected(new Set()); setInputVal(''); setMode('select'); showToast('Recomeçado'); }}
                >
                  ✕ Recomeçar
                </button>
              </div>
            </div>
          )}

        </div>{/* /body */}

        {/* ── TOAST ──────────────────────────────────────────────────────── */}
        <div style={{
          position: 'fixed', bottom: 28, left: '50%',
          transform: `translateX(-50%) translateY(${toastVis ? '0' : '12px'})`,
          background: 'linear-gradient(135deg,#1C3A5E,#2A4C72)',
          color: 'rgba(200,168,74,0.95)',
          border: '1px solid rgba(200,168,74,0.4)',
          fontFamily: 'inherit', fontSize: '0.75rem',
          padding: '8px 20px', borderRadius: 100,
          opacity: toastVis ? 1 : 0,
          transition: 'opacity 0.2s, transform 0.2s',
          pointerEvents: 'none', zIndex: 10001,
          letterSpacing: '0.05em',
          boxShadow: '0 4px 18px rgba(15,30,53,0.4)',
        }}>
          {toast}
        </div>

      </div>
    </div>
  );
}
