import React, { useState, useRef, useEffect } from 'react';
import { C } from '../theme.js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const COR     = '#5C7FA3';

const SUGESTOES = [
  'Qual tropa tem mais poder?',
  'Como funciona o torneio de talismã?',
  'Qual carne vale mais pontos?',
  'Como treinar dragões rápido?',
  'O que é o torneio de matar tropas?',
  'Como ganhar mais pontos de poder?',
];

const AssistenteTatico = () => {
  const [aberto,    setAberto]    = useState(false);
  const [input,     setInput]     = useState('');
  const [mensagens, setMensagens] = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [erro,      setErro]      = useState('');
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  // Scroll automático ao final
  useEffect(() => {
    if (aberto) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensagens, loading, aberto]);

  // Foca input ao abrir
  useEffect(() => {
    if (aberto) setTimeout(() => inputRef.current?.focus(), 200);
  }, [aberto]);

  const enviar = async (texto) => {
    const q = (texto || input).trim();
    if (!q || loading) return;

    setInput('');
    setErro('');
    setMensagens(m => [...m, { role: 'user', content: q }]);
    setLoading(true);

    // Histórico para contexto (exclui a mensagem que acabou de ser adicionada)
    const historico = mensagens.map(m => ({ role: m.role, content: m.content }));

    try {
      const res = await fetch(`${API_URL}/api/assistente`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pergunta: q, historico }),
      });
      const data = await res.json();
      if (data.erro) throw new Error(data.erro);
      setMensagens(m => [...m, { role: 'assistant', content: data.resposta }]);
    } catch (e) {
      setErro(e.message || 'Erro ao contatar o assistente.');
    } finally {
      setLoading(false);
    }
  };

  const handleKey = e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); enviar(); }
  };

  const limpar = () => { setMensagens([]); setErro(''); };

  return (
    <div style={{ padding: '0 8px', animation: 'reveal-up 0.4s 0.22s ease both' }}>

      {/* ── Botão de abertura ──────────────────────────────────────────────── */}
      <button
        onClick={() => setAberto(a => !a)}
        className="w-full flex items-center gap-3 rounded-xl"
        style={{
          padding: '11px 14px',
          background: aberto
            ? `linear-gradient(90deg, ${COR}22, ${C.BG_CARD})`
            : C.BG_CARD,
          border: `1.5px solid ${aberto ? COR : 'rgba(200,168,74,0.22)'}`,
          borderLeft: `4px solid ${COR}`,
          cursor: 'pointer',
          transition: 'all 0.2s',
          boxShadow: aberto ? `0 2px 12px ${COR}25` : '0 1px 4px rgba(62,47,28,0.06)',
        }}
      >
        {/* Ícone animado */}
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          background: `${COR}18`, border: `1.5px solid ${COR}45`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.35rem', flexShrink: 0,
          boxShadow: `0 2px 8px ${COR}25`,
        }}>
          🤖
        </div>

        <div className="flex-1 text-left min-w-0">
          <p className="font-cinzel font-bold m-0 leading-tight"
            style={{ fontSize: '0.78rem', color: C.TEXT_PRIMARY }}>
            Conselheiro Tático
          </p>
          <p className="font-nunito font-semibold m-0 mt-0.5"
            style={{ fontSize: '0.62rem', color: C.TEXT_MUTED }}>
            {aberto ? 'Clique para fechar' : 'Tire dúvidas sobre o jogo com IA'}
          </p>
        </div>

        {/* Badge */}
        <span
          className="font-nunito font-black shrink-0"
          style={{
            fontSize: '0.58rem', padding: '3px 8px', borderRadius: 6,
            background: COR, color: '#fff',
            letterSpacing: '0.5px',
          }}
        >
          {aberto ? '▲ FECHAR' : 'IA ▸'}
        </span>
      </button>

      {/* ── Painel do chat ─────────────────────────────────────────────────── */}
      {aberto && (
        <div
          className="rounded-xl overflow-hidden mt-2"
          style={{
            border: `1px solid ${COR}55`,
            borderTop: `3px solid ${COR}`,
            animation: 'reveal-up 0.25s ease both',
          }}
        >
          {/* Cabeçalho do chat */}
          <div className="flex items-center justify-between px-3 py-2"
            style={{
              background: `linear-gradient(135deg, #0A1A2E, #1A3050)`,
              borderBottom: `1px solid ${COR}44`,
            }}>
            <div className="flex items-center gap-2">
              <span style={{ fontSize: '1rem' }}>🤖</span>
              <div>
                <p className="font-nunito font-black text-[0.72rem] m-0 leading-tight"
                  style={{ color: '#90B8D8' }}>
                  Conselheiro Tático DOA
                </p>
                <p className="font-nunito font-semibold text-[0.58rem] m-0"
                  style={{ color: 'rgba(140,180,210,0.6)' }}>
                  Alimentado pelo banco de dados do jogo
                </p>
              </div>
            </div>
            {mensagens.length > 0 && (
              <button
                onClick={limpar}
                className="font-nunito font-bold text-[0.6rem] px-2 py-1 rounded"
                style={{
                  background: 'rgba(168,60,44,0.2)',
                  border: '1px solid rgba(168,60,44,0.4)',
                  color: '#E08878', cursor: 'pointer',
                }}>
                🗑 Limpar
              </button>
            )}
          </div>

          {/* Área de mensagens */}
          <div
            style={{
              background: C.BG_CARD,
              minHeight: 180, maxHeight: 320,
              overflowY: 'auto',
              padding: '10px 12px',
              display: 'flex', flexDirection: 'column', gap: 10,
            }}
          >
            {/* Estado vazio — sugestões */}
            {mensagens.length === 0 && !loading && (
              <div>
                <p className="font-nunito font-semibold text-[0.72rem] text-center mb-3"
                  style={{ color: C.TEXT_MUTED }}>
                  Olá, Comandante! Sobre o que quer saber?
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
                  {SUGESTOES.map(s => (
                    <button key={s} onClick={() => enviar(s)}
                      className="font-nunito font-semibold text-[0.65rem] rounded-lg"
                      style={{
                        padding: '5px 10px',
                        background: `${COR}12`,
                        border: `1px solid ${COR}40`,
                        color: C.TEXT_SECONDARY,
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = `${COR}25`; }}
                      onMouseLeave={e => { e.currentTarget.style.background = `${COR}12`; }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Mensagens */}
            {mensagens.map((m, i) => (
              <div key={i}
                style={{
                  display: 'flex',
                  justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div style={{
                  maxWidth: '85%',
                  padding: '8px 11px',
                  borderRadius: m.role === 'user'
                    ? '12px 12px 3px 12px'
                    : '12px 12px 12px 3px',
                  background: m.role === 'user'
                    ? `linear-gradient(135deg, ${COR}, #3A5A8A)`
                    : C.BG_SECONDARY,
                  border: m.role === 'user'
                    ? 'none'
                    : `1px solid ${C.BORDER_SOFT}`,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
                }}>
                  {m.role === 'assistant' && (
                    <p className="font-nunito font-black text-[0.6rem] uppercase tracking-wider m-0 mb-1"
                      style={{ color: COR }}>
                      🤖 Conselheiro
                    </p>
                  )}
                  <p className="font-nunito font-semibold text-[0.74rem] leading-relaxed m-0"
                    style={{
                      color: m.role === 'user' ? '#fff' : C.TEXT_PRIMARY,
                      whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                    }}>
                    {m.content}
                  </p>
                </div>
              </div>
            ))}

            {/* Loading */}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{
                  padding: '10px 14px', borderRadius: '12px 12px 12px 3px',
                  background: C.BG_SECONDARY, border: `1px solid ${C.BORDER_SOFT}`,
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  {[0, 1, 2].map(j => (
                    <span key={j} style={{
                      width: 7, height: 7, borderRadius: '50%',
                      background: COR,
                      display: 'inline-block',
                      animation: `typing-dot 1.2s ${j * 0.2}s ease-in-out infinite`,
                    }} />
                  ))}
                </div>
              </div>
            )}

            {/* Erro */}
            {erro && (
              <p className="font-nunito font-semibold text-[0.72rem] text-center rounded-lg px-3 py-2"
                style={{
                  color: '#E07060',
                  background: 'rgba(168,60,44,0.1)',
                  border: '1px solid rgba(168,60,44,0.3)',
                }}>
                ⚠️ {erro}
              </p>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 px-3 py-2.5"
            style={{
              background: C.BG_CARD,
              borderTop: `1px solid ${C.BORDER_SOFT}`,
            }}>
            <input
              ref={inputRef}
              className="flex-1 min-w-0 font-nunito font-semibold rounded-lg"
              style={{
                padding: '8px 12px', fontSize: '0.78rem',
                background: C.BG_SECONDARY,
                border: `1px solid ${C.BORDER_SOFT}`,
                color: C.TEXT_PRIMARY,
                outline: 'none',
              }}
              placeholder="Faça uma pergunta sobre o jogo…"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              disabled={loading}
              onFocus={e  => { e.currentTarget.style.borderColor = COR; }}
              onBlur={e   => { e.currentTarget.style.borderColor = C.BORDER_SOFT; }}
            />
            <button
              onClick={() => enviar()}
              disabled={loading || !input.trim()}
              style={{
                width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                background: loading || !input.trim()
                  ? C.BG_SECONDARY
                  : `linear-gradient(135deg, ${COR}, #3A5A8A)`,
                border: `1px solid ${loading || !input.trim() ? C.BORDER_SOFT : COR}`,
                color: loading || !input.trim() ? C.TEXT_FAINT : '#fff',
                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1rem', transition: 'all 0.15s',
              }}
            >
              {loading ? '…' : '➤'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssistenteTatico;
