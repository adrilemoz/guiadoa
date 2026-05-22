import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { C } from '../theme.js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const COR     = '#5C7FA3';
const COR_DRK = '#1A3050';

const SUGESTOES = [
  { emoji: '⚔️', texto: 'Qual tropa tem mais poder?' },
  { emoji: '🐉', texto: 'Como evoluir meu dragão rápido?' },
  { emoji: '🏆', texto: 'Qual carne vale mais no torneio?' },
  { emoji: '🧿', texto: 'Como funciona o torneio de talismã?' },
  { emoji: '🎖️', texto: 'Como treinar meus generais?' },
  { emoji: '⚡', texto: 'Como ganhar mais pontos de poder?' },
  { emoji: '☠️', texto: 'Estratégia para matar tropas?' },
  { emoji: '🌅', texto: 'O que são fósseis Crepúsculo?' },
];

const fmtHora = () => {
  const d = new Date();
  return d.getHours().toString().padStart(2,'0') + ':' + d.getMinutes().toString().padStart(2,'0');
};

/* ── Bolha de mensagem ─────────────────────────────────────────────────────── */
const Bolha = ({ msg }) => {
  const isUser = msg.role === 'user';
  return (
    <div style={{ display:'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', marginBottom: 10 }}>
      {!isUser && (
        <div style={{
          width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
          background: `linear-gradient(135deg, ${COR}, ${COR_DRK})`,
          border: `1.5px solid ${COR}55`,
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize: '0.9rem', marginRight: 7, marginTop: 2,
        }}>🤖</div>
      )}
      <div style={{ maxWidth: '78%' }}>
        <div style={{
          padding: '9px 13px',
          borderRadius: isUser ? '16px 16px 4px 16px' : '4px 16px 16px 16px',
          background: isUser
            ? `linear-gradient(135deg, ${COR} 0%, #3A5A8A 100%)`
            : C.BG_SECONDARY,
          border: isUser ? 'none' : `1px solid ${C.BORDER_SOFT}`,
          boxShadow: isUser
            ? `0 2px 10px ${COR}40`
            : '0 1px 4px rgba(0,0,0,0.1)',
        }}>
          {!isUser && (
            <p style={{
              fontFamily:'"Nunito",sans-serif', fontWeight:900,
              fontSize:'0.6rem', letterSpacing:'2px', textTransform:'uppercase',
              color: COR, margin:0, marginBottom:4,
            }}>Conselheiro</p>
          )}
          <p style={{
            fontFamily:'"Nunito",sans-serif', fontWeight:600,
            fontSize:'0.76rem', lineHeight:1.55, margin:0,
            color: isUser ? '#fff' : C.TEXT_PRIMARY,
            whiteSpace:'pre-wrap', wordBreak:'break-word',
          }}>{msg.content}</p>
        </div>
        <p style={{
          fontFamily:'"Nunito",sans-serif', fontSize:'0.55rem',
          color: C.TEXT_FAINT, margin:'3px 4px 0',
          textAlign: isUser ? 'right' : 'left',
        }}>{msg.hora}</p>
      </div>
      {isUser && (
        <div style={{
          width:28, height:28, borderRadius:'50%', flexShrink:0,
          background: C.BG_SECONDARY, border:`1.5px solid ${C.BORDER_SOFT}`,
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:'0.9rem', marginLeft:7, marginTop:2,
        }}>🎖️</div>
      )}
    </div>
  );
};

/* ── Dots loading ─────────────────────────────────────────────────────────── */
const Digitando = () => (
  <div style={{ display:'flex', justifyContent:'flex-start', marginBottom:10 }}>
    <div style={{
      width:28, height:28, borderRadius:'50%', flexShrink:0,
      background: `linear-gradient(135deg,${COR},${COR_DRK})`,
      border:`1.5px solid ${COR}55`,
      display:'flex', alignItems:'center', justifyContent:'center',
      fontSize:'0.9rem', marginRight:7,
    }}>🤖</div>
    <div style={{
      padding:'12px 16px', borderRadius:'4px 16px 16px 16px',
      background: C.BG_SECONDARY, border:`1px solid ${C.BORDER_SOFT}`,
      display:'flex', alignItems:'center', gap:5,
    }}>
      {[0,1,2].map(i => (
        <span key={i} style={{
          width:7, height:7, borderRadius:'50%', background:COR,
          display:'inline-block',
          animation:`typing-dot 1.2s ${i*0.2}s ease-in-out infinite`,
        }}/>
      ))}
    </div>
  </div>
);

/* ── Modal de tela cheia ──────────────────────────────────────────────────── */
const AssistenteModal = ({ onClose, mensagens, loading, erro, onEnviar, onLimpar }) => {
  const [input, setInput]   = useState('');
  const bottomRef           = useRef(null);
  const inputRef            = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }); }, [mensagens, loading]);
  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 150); }, []);

  const enviar = useCallback((texto) => {
    const q = (texto || input).trim();
    if (!q || loading) return;
    setInput('');
    onEnviar(q);
  }, [input, loading, onEnviar]);

  const handleKey = e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); enviar(); }
  };

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position:'fixed', inset:0, zIndex:100,
        background:'rgba(0,0,0,0.75)',
        backdropFilter:'blur(4px)',
        display:'flex', alignItems:'flex-end', justifyContent:'center',
        padding:'0',
        animation:'fade-in 0.2s ease both',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width:'100%', maxWidth:520,
          height:'92dvh',
          display:'flex', flexDirection:'column',
          borderRadius:'20px 20px 0 0',
          overflow:'hidden',
          background: C.BG_MAIN,
          border:`1.5px solid ${COR}55`,
          borderBottom:'none',
          boxShadow:`0 -8px 40px rgba(0,0,0,0.5), 0 0 0 1px ${COR}20`,
          animation:'slideUp 0.3s cubic-bezier(0.32,0.72,0,1) both',
        }}
      >

        {/* ── Cabeçalho ──────────────────────────────────────────────────── */}
        <div style={{
          background:`linear-gradient(135deg, #0A1826 0%, ${COR_DRK} 100%)`,
          padding:'14px 16px 12px',
          borderBottom:`1px solid ${COR}44`,
          flexShrink:0,
        }}>
          {/* Pill de arrastar */}
          <div style={{
            width:36, height:4, borderRadius:2,
            background:'rgba(255,255,255,0.18)', margin:'0 auto 12px',
          }}/>

          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            {/* Avatar */}
            <div style={{
              width:44, height:44, borderRadius:'50%', flexShrink:0,
              background:`linear-gradient(135deg,${COR},${COR_DRK})`,
              border:`2px solid ${COR}66`,
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:'1.4rem',
              boxShadow:`0 4px 14px ${COR}40`,
            }}>🤖</div>

            <div style={{ flex:1, minWidth:0 }}>
              <p style={{
                fontFamily:'"Cinzel",serif', fontWeight:700,
                fontSize:'0.9rem', color:'#C0D8F0', margin:0, lineHeight:1.2,
              }}>Conselheiro Tático</p>
              <div style={{ display:'flex', alignItems:'center', gap:5, marginTop:3 }}>
                <span style={{
                  width:7, height:7, borderRadius:'50%',
                  background:'#5AB45A',
                  animation:'online-pulse 3s ease-in-out infinite',
                  flexShrink:0,
                }}/>
                <p style={{
                  fontFamily:'"Nunito",sans-serif', fontWeight:600,
                  fontSize:'0.62rem', color:'rgba(140,180,210,0.7)', margin:0,
                }}>Online · Alimentado pelos dados do jogo</p>
              </div>
            </div>

            <div style={{ display:'flex', gap:8, flexShrink:0 }}>
              {mensagens.length > 0 && (
                <button onClick={onLimpar}
                  style={{
                    width:32, height:32, borderRadius:8,
                    background:'rgba(168,60,44,0.2)',
                    border:'1px solid rgba(168,60,44,0.4)',
                    color:'#E08878', cursor:'pointer', fontSize:'0.85rem',
                    display:'flex', alignItems:'center', justifyContent:'center',
                  }} title="Limpar conversa">🗑</button>
              )}
              <button onClick={onClose}
                style={{
                  width:32, height:32, borderRadius:8,
                  background:'rgba(255,255,255,0.08)',
                  border:'1px solid rgba(255,255,255,0.15)',
                  color:'rgba(200,220,240,0.7)', cursor:'pointer', fontSize:'1rem',
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}>✕</button>
            </div>
          </div>
        </div>

        {/* ── Área de mensagens ───────────────────────────────────────────── */}
        <div style={{
          flex:1, overflowY:'auto',
          padding:'14px 14px 6px',
          background: C.BG_CARD,
        }}>
          {/* Estado vazio */}
          {mensagens.length === 0 && !loading && (
            <div>
              <div style={{ textAlign:'center', padding:'16px 0 20px' }}>
                <div style={{ fontSize:'2.8rem', marginBottom:8 }}>🛡️</div>
                <p style={{
                  fontFamily:'"Cinzel",serif', fontWeight:700,
                  fontSize:'0.85rem', color:C.TEXT_PRIMARY, margin:0, marginBottom:4,
                }}>Quartel-General</p>
                <p style={{
                  fontFamily:'"Nunito",sans-serif', fontWeight:600,
                  fontSize:'0.72rem', color:C.TEXT_MUTED, margin:0, lineHeight:1.5,
                }}>
                  Olá, Comandante! Sou seu conselheiro tático.<br/>
                  Pode me perguntar sobre tropas, torneios, dragões e muito mais.
                </p>
              </div>

              {/* Divisor */}
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
                <div style={{ flex:1, height:1, background:`linear-gradient(90deg,transparent,${C.BORDER})` }}/>
                <span style={{ fontFamily:'"Nunito",sans-serif', fontWeight:700, fontSize:'0.6rem', color:C.TEXT_FAINT, letterSpacing:'2px', textTransform:'uppercase' }}>Sugestões</span>
                <div style={{ flex:1, height:1, background:`linear-gradient(270deg,transparent,${C.BORDER})` }}/>
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:7 }}>
                {SUGESTOES.map(s => (
                  <button key={s.texto} onClick={() => enviar(s.texto)}
                    style={{
                      display:'flex', alignItems:'center', gap:7,
                      padding:'9px 10px', borderRadius:10, cursor:'pointer',
                      background: C.BG_SECONDARY,
                      border:`1px solid ${C.BORDER_SOFT}`,
                      textAlign:'left', transition:'all 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = COR; e.currentTarget.style.background = `${COR}12`; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = C.BORDER_SOFT; e.currentTarget.style.background = C.BG_SECONDARY; }}
                  >
                    <span style={{ fontSize:'1.1rem', flexShrink:0 }}>{s.emoji}</span>
                    <span style={{
                      fontFamily:'"Nunito",sans-serif', fontWeight:700,
                      fontSize:'0.68rem', color:C.TEXT_SECONDARY, lineHeight:1.3,
                    }}>{s.texto}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Mensagens */}
          {mensagens.map((m, i) => <Bolha key={i} msg={m} />)}
          {loading && <Digitando />}

          {/* Erro */}
          {erro && (
            <p style={{
              fontFamily:'"Nunito",sans-serif', fontWeight:600,
              fontSize:'0.72rem', textAlign:'center',
              color:'#E07060', background:'rgba(168,60,44,0.1)',
              border:'1px solid rgba(168,60,44,0.3)',
              borderRadius:8, padding:'8px 12px', margin:'4px 0',
            }}>⚠️ {erro}</p>
          )}
          <div ref={bottomRef}/>
        </div>

        {/* ── Input ───────────────────────────────────────────────────────── */}
        <div style={{
          padding:'10px 12px 14px',
          background: C.BG_CARD,
          borderTop:`1px solid ${C.BORDER_SOFT}`,
          flexShrink:0,
        }}>
          <div style={{ display:'flex', gap:8, alignItems:'flex-end' }}>
            <textarea
              ref={inputRef}
              rows={1}
              placeholder="Faça uma pergunta sobre o jogo…"
              value={input}
              onChange={e => {
                setInput(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 96) + 'px';
              }}
              onKeyDown={handleKey}
              disabled={loading}
              style={{
                flex:1, resize:'none', overflow:'hidden',
                fontFamily:'"Nunito",sans-serif', fontWeight:600,
                fontSize:'0.8rem', lineHeight:1.4,
                padding:'9px 12px', borderRadius:12,
                background: C.BG_SECONDARY,
                border:`1.5px solid ${C.BORDER_SOFT}`,
                color: C.TEXT_PRIMARY, outline:'none',
                transition:'border-color 0.15s',
              }}
              onFocus={e  => { e.currentTarget.style.borderColor = COR; }}
              onBlur={e   => { e.currentTarget.style.borderColor = C.BORDER_SOFT; }}
            />
            <button
              onClick={() => enviar()}
              disabled={loading || !input.trim()}
              style={{
                width:42, height:42, borderRadius:12, flexShrink:0,
                background: loading || !input.trim()
                  ? C.BG_SECONDARY
                  : `linear-gradient(135deg,${COR},#3A5A8A)`,
                border:`1.5px solid ${loading || !input.trim() ? C.BORDER_SOFT : COR}`,
                color: loading || !input.trim() ? C.TEXT_FAINT : '#fff',
                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:'1.1rem', transition:'all 0.15s',
                boxShadow: loading || !input.trim() ? 'none' : `0 2px 10px ${COR}40`,
              }}
            >{loading ? '…' : '➤'}</button>
          </div>
          <p style={{
            fontFamily:'"Nunito",sans-serif', fontWeight:600,
            fontSize:'0.58rem', color:C.TEXT_FAINT,
            textAlign:'center', margin:'6px 0 0',
          }}>
            Enter para enviar · Shift+Enter para quebrar linha
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
};

/* ── Botão flutuante na Home ──────────────────────────────────────────────── */
const AssistenteTatico = () => {
  const [aberto,    setAberto]    = useState(false);
  const [mensagens, setMensagens] = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [erro,      setErro]      = useState('');

  // Bloqueia scroll da página quando modal aberto
  useEffect(() => {
    document.body.style.overflow = aberto ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [aberto]);

  const enviar = useCallback(async (pergunta) => {
    setErro('');
    const novaMsg = { role:'user', content: pergunta, hora: fmtHora() };
    setMensagens(m => [...m, novaMsg]);
    setLoading(true);

    const historico = mensagens.map(m => ({ role: m.role, content: m.content }));

    try {
      const res = await fetch(`${API_URL}/api/assistente`, {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({ pergunta, historico }),
      });
      const data = await res.json();
      if (data.erro) throw new Error(data.erro);
      setMensagens(m => [...m, { role:'assistant', content: data.resposta, hora: fmtHora() }]);
    } catch(e) {
      setErro(e.message || 'Erro ao contatar o assistente.');
    } finally {
      setLoading(false);
    }
  }, [mensagens]);

  const limpar = () => { setMensagens([]); setErro(''); };

  return (
    <>
      {/* ── Botão de entrada ─────────────────────────────────────────────── */}
      <button
        onClick={() => setAberto(true)}
        style={{
          width:'100%', display:'flex', alignItems:'center', gap:12,
          padding:'12px 14px', borderRadius:14, cursor:'pointer',
          background: C.BG_CARD,
          border:`1.5px solid rgba(200,168,74,0.22)`,
          borderLeft:`4px solid ${COR}`,
          transition:'all 0.2s',
          boxShadow:'0 1px 4px rgba(62,47,28,0.06)',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = COR; e.currentTarget.style.boxShadow = `0 4px 18px ${COR}30`; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(200,168,74,0.22)'; e.currentTarget.style.boxShadow = '0 1px 4px rgba(62,47,28,0.06)'; e.currentTarget.style.borderLeftColor = COR; }}
      >
        {/* Avatar */}
        <div style={{
          width:44, height:44, borderRadius:'50%', flexShrink:0,
          background:`linear-gradient(135deg,${COR},${COR_DRK})`,
          border:`2px solid ${COR}55`,
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:'1.3rem',
          boxShadow:`0 2px 10px ${COR}30`,
          position:'relative',
        }}>
          🤖
          <span style={{
            position:'absolute', bottom:0, right:0,
            width:11, height:11, borderRadius:'50%',
            background:'#5AB45A', border:`2px solid ${C.BG_MAIN}`,
            animation:'online-pulse 3s ease-in-out infinite',
          }}/>
        </div>

        <div style={{ flex:1, textAlign:'left', minWidth:0 }}>
          <p style={{
            fontFamily:'"Cinzel",serif', fontWeight:700,
            fontSize:'0.8rem', color:C.TEXT_PRIMARY, margin:0, lineHeight:1.2,
          }}>Conselheiro Tático</p>
          <p style={{
            fontFamily:'"Nunito",sans-serif', fontWeight:600,
            fontSize:'0.64rem', color:C.TEXT_MUTED, margin:'3px 0 0',
          }}>
            {mensagens.length > 0
              ? `${mensagens.length} mensagem${mensagens.length > 1 ? 's' : ''} · Toque para continuar`
              : 'Tire dúvidas sobre o jogo com IA'}
          </p>
        </div>

        <div style={{
          flexShrink:0, display:'flex', flexDirection:'column', alignItems:'flex-end', gap:4,
        }}>
          <span style={{
            fontFamily:'"Nunito",sans-serif', fontWeight:900,
            fontSize:'0.6rem', padding:'4px 9px', borderRadius:6,
            background:`linear-gradient(135deg,${COR},#3A5A8A)`,
            color:'#fff', letterSpacing:'0.5px',
            boxShadow:`0 2px 8px ${COR}40`,
          }}>
            {mensagens.length > 0 ? 'CONTINUAR ▸' : 'CONSULTAR ▸'}
          </span>
          {mensagens.length > 0 && (
            <span style={{
              fontFamily:'"Nunito",sans-serif', fontWeight:700,
              fontSize:'0.55rem', color: COR,
            }}>● ativo</span>
          )}
        </div>
      </button>

      {/* ── Modal tela cheia ─────────────────────────────────────────────── */}
      {aberto && (
        <AssistenteModal
          onClose={() => setAberto(false)}
          mensagens={mensagens}
          loading={loading}
          erro={erro}
          onEnviar={enviar}
          onLimpar={limpar}
        />
      )}
    </>
  );
};

export default AssistenteTatico;
