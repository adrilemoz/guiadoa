import React, { useEffect, useRef, useState } from 'react';
import { dbNiveis, carregarNiveis } from '../db.js';
import { C } from '../theme.js';
import GameHeader from './shared/GameHeader.jsx';
import Modal from '../ui/Modal.jsx';
import Toast from '../ui/Toast.jsx';

const unformat = v => Number(String(v).replace(/\D/g, '')) || 0;
const formatNumber = n =>
  n === null || n === undefined || n === '' ? '—' : Number(n).toLocaleString('pt-BR');
const formatarSufixo = num => {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace('.0', '') + 'M';
  if (num >= 1_000)     return (num / 1_000).toFixed(1).replace('.0', '') + 'K';
  return String(num);
};

const Niveis = () => {
  const poderAtualRef = useRef(null);

  const [todosNiveis, setTodosNiveis] = useState(dbNiveis);
  useEffect(() => {
    carregarNiveis().then(setTodosNiveis);
  }, []);

  const [promptAberto,    setPromptAberto]    = useState(true);
  const [resultadoDialog, setResultadoDialog] = useState({ open: false, titulo: '', mensagem: '', tipo: 'success' });
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const [poderAtualText, setPoderAtualText] = useState(() => {
    const saved = localStorage.getItem('doa_poder_niveis');
    return saved ? formatNumber(saved) : '';
  });
  const [poderAntigoText, setPoderAntigoText] = useState(() => {
    const saved = localStorage.getItem('doa_poder_antigo');
    return saved ? formatNumber(saved) : '';
  });
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    window.temAlteracoesNaoSalvas = isDirty;
    const handler = e => { if (isDirty) { e.preventDefault(); e.returnValue = ''; } };
    window.addEventListener('beforeunload', handler);
    return () => { window.temAlteracoesNaoSalvas = false; window.removeEventListener('beforeunload', handler); };
  }, [isDirty]);

  const showToast  = (msg, sev = 'success') => setToast({ open: true, message: msg, severity: sev });
  const closeToast = () => setToast(t => ({ ...t, open: false }));

  const handleInputPower  = e => { const n = Number(e.target.value.replace(/\D/g, '')); setPoderAtualText(n === 0 ? '' : formatNumber(n)); setIsDirty(true); };
  const handleInputAntigo = e => { const n = Number(e.target.value.replace(/\D/g, '')); setPoderAntigoText(n === 0 ? '' : formatNumber(n)); setIsDirty(true); };

  const handleSave = () => {
    const numAtual  = unformat(poderAtualText);
    const numAntigo = unformat(poderAntigoText);
    localStorage.setItem('doa_poder_niveis', numAtual);
    localStorage.setItem('doa_poder_antigo', numAntigo);
    setIsDirty(false);
    const diff = numAtual - numAntigo;
    if (diff > 0 && numAntigo > 0) {
      setResultadoDialog({ open: true, titulo: '🎖️ Relatório de Progresso', mensagem: `Parabéns, Comandante! O seu poder aumentou ${formatarSufixo(diff)}!`, tipo: 'success' });
    } else if (diff < 0 && numAntigo > 0) {
      setResultadoDialog({ open: true, titulo: '⚠️ Alerta de Baixas', mensagem: `Atenção: O seu poder diminuiu ${formatarSufixo(Math.abs(diff))}. Reorganize as suas defesas!`, tipo: 'warning' });
    } else {
      showToast('Progresso salvo com sucesso!', 'success');
    }
  };

  const handleAtualizarSim = () => {
    if (poderAtualText) { setPoderAntigoText(poderAtualText); setPoderAtualText(''); setIsDirty(true); }
    setPromptAberto(false);
    setTimeout(() => poderAtualRef.current?.focus(), 300);
  };

  const currentPowerNum = unformat(poderAtualText);
  const oldPowerNum     = unformat(poderAntigoText);
  const diferencaPoder  = currentPowerNum - oldPowerNum;
  const isPositivo      = diferencaPoder > 0;

  const maxNivelDB  = todosNiveis.length > 0 ? todosNiveis[todosNiveis.length - 1][0] : 'MAX';
  let nivelExato = 0;
  todosNiveis.forEach(n => { if (n[1] !== null && currentPowerNum >= n[1]) nivelExato = n[0]; });
  const proximaMeta  = todosNiveis.find(n => n[1] !== null && n[1] > currentPowerNum);
  const faltamParaMeta = proximaMeta ? proximaMeta[1] - currentPowerNum : 0;
  const proximoMarco   = todosNiveis.find(n => n[1] !== null && n[1] > currentPowerNum && n[0] % 5 === 0);
  const faltamParaMarco = proximoMarco ? proximoMarco[1] - currentPowerNum : 0;

  return (
    <div className="max-w-2xl mx-auto pb-4">
      <Toast {...toast} onClose={closeToast} />

      {/* Modal prompt inicial */}
      <Modal open={promptAberto} onClose={() => setPromptAberto(false)} maxWidth={320}>
        <div className="p-4 text-center">
          <p className="text-3xl mb-2 m-0">⚠️</p>
          <p className="font-cinzel font-bold text-sm tracking-wide uppercase m-0 mb-2" style={{ color: C.WARNING }}>
            Atualização de Inteligência
          </p>
          <p className="font-nunito font-semibold text-sm leading-relaxed m-0 mb-4" style={{ color: C.TEXT_SECONDARY }}>
            Comandante, o seu poder ou nível alterou desde o último registo?
          </p>
          <div className="flex gap-2">
            <button className="btn-ghost flex-1" onClick={() => setPromptAberto(false)}>Não</button>
            <button className="btn-success flex-1" onClick={handleAtualizarSim}>Sim, Atualizar</button>
          </div>
        </div>
      </Modal>

      {/* Modal resultado */}
      <Modal open={resultadoDialog.open} onClose={() => setResultadoDialog(d => ({ ...d, open: false }))} maxWidth={320}>
        <div className="p-4 text-center">
          <p className="font-cinzel font-bold text-sm uppercase tracking-wide m-0 mb-1"
            style={{ color: resultadoDialog.tipo === 'success' ? C.SUCCESS : C.WARNING }}>
            {resultadoDialog.titulo}
          </p>
          <div className="gold-stripe my-2 opacity-40" />
          <p className="font-nunito font-black text-base m-0 mb-1" style={{ color: C.TEXT_PRIMARY }}>
            {resultadoDialog.mensagem}
          </p>
          <p className="font-nunito font-semibold text-xs m-0 mb-3" style={{ color: C.TEXT_MUTED }}>
            O relatório foi actualizado na base de dados.
          </p>
          <button
            className={resultadoDialog.tipo === 'success' ? 'btn-success w-full' : 'btn-gold w-full'}
            onClick={() => setResultadoDialog(d => ({ ...d, open: false }))}
          >
            Continuar
          </button>
        </div>
      </Modal>

      {/* Cabeçalho */}
      <div className="tw-card mb-3">
        <GameHeader title="Progresso da Cidade" />
        <p className="font-nunito font-semibold text-sm text-center py-2 px-3 m-0 bg-aoe-card" style={{ color: C.TEXT_SECONDARY }}>
          Acompanhe a sua evolução em todos os níveis e guarde o seu progresso.
        </p>
      </div>

      {/* Painel de controle */}
      <div className="flex gap-2 mb-3">
        {/* Inputs */}
        <div className="tw-card flex-1 p-3">
          <label className="font-nunito font-bold text-[0.68rem] tracking-widest uppercase block mb-1" style={{ color: C.TEXT_MUTED }}>
            Poder Anterior
          </label>
          <input
            className="tw-input text-center font-mono mb-2.5"
            placeholder="Ex: 50.000"
            value={poderAntigoText}
            onChange={handleInputAntigo}
            inputMode="numeric"
          />
          <div className="gold-stripe mb-2.5 opacity-30" />
          <div className="flex items-center justify-between mb-1">
            <label className="font-nunito font-bold text-[0.68rem] tracking-widest uppercase" style={{ color: C.ACCENT_DEEP }}>
              Poder Atual
            </label>
            {diferencaPoder !== 0 && poderAntigoText && poderAtualText && (
              <span
                className="font-nunito font-black text-[0.65rem] px-1.5 py-0.5 rounded"
                style={{
                  color: isPositivo ? C.SUCCESS : C.ERROR,
                  background: isPositivo ? `${C.SUCCESS}15` : `${C.ERROR}15`,
                  border: `1px solid ${isPositivo ? C.SUCCESS : C.ERROR}`,
                }}
              >
                {isPositivo ? '📈 +' : '📉 '}{formatarSufixo(diferencaPoder)}
              </span>
            )}
          </div>
          <div className="flex gap-1.5">
            <input
              ref={poderAtualRef}
              className="tw-input text-center font-mono flex-1"
              placeholder="Digite..."
              value={poderAtualText}
              onChange={handleInputPower}
              inputMode="numeric"
            />
            <button
              className={isDirty ? 'btn-success btn-sm shrink-0' : 'btn-ghost btn-sm shrink-0'}
              onClick={handleSave}
              disabled={!isDirty}
            >
              Salvar
            </button>
          </div>
          {isDirty && (
            <p className="font-nunito font-bold text-[0.68rem] mt-1 m-0" style={{ color: C.WARNING }}>
              ⚠️ Alterações não salvas!
            </p>
          )}
        </div>

        {/* Stats cards (vertical) */}
        <div className="flex flex-col gap-1.5" style={{ minWidth: 88 }}>
          {[
            { label: 'Nível Atual', value: nivelExato || '—', color: C.ACCENT_DEEP, border: C.BORDER },
            { label: `Prox Nível ${proximaMeta?.[0] ?? maxNivelDB}`, value: proximaMeta ? formatNumber(faltamParaMeta) : 'MÁXIMO', color: C.ACCENT_DEEP, border: C.BORDER },
            { label: `Marco Nível ${proximoMarco?.[0] ?? maxNivelDB}`, value: proximoMarco ? formatNumber(faltamParaMarco) : 'MÁXIMO', color: C.POWER, border: C.POWER + '80' },
          ].map(s => (
            <div key={s.label} className="tw-card flex-1 flex flex-col items-center justify-center text-center py-2 px-1.5">
              <p className="font-nunito font-bold text-[0.6rem] uppercase tracking-wide m-0 mb-0.5 leading-tight" style={{ color: C.TEXT_MUTED }}>{s.label}</p>
              <p className="font-nunito font-black text-sm leading-none m-0" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabela de níveis */}
      <div className="tw-card overflow-hidden">
        <div className="overflow-auto" style={{ maxHeight: 420 }}>
          <table className="w-full text-left">
            <thead className="sticky top-0">
              <tr>
                <th className="tw-th text-center">Nível</th>
                <th className="tw-th text-center">Poder Necessário</th>
                <th className="tw-th text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {todosNiveis.map(([nivel, poderNivel], idx) => {
                const isUnknown  = poderNivel === null;
                const concluido  = !isUnknown && currentPowerNum >= poderNivel;
                const isProxima  = proximaMeta && proximaMeta[0] === nivel;
                const isMarco    = nivel % 5 === 0;

                const rowBg = concluido
                  ? 'rgba(90,138,92,0.1)'
                  : isProxima
                  ? 'rgba(200,122,44,0.12)'
                  : idx % 2 === 0 ? C.BG_SECONDARY : C.BG_CARD;

                const statusText  = concluido ? '✓ Concluído' : isProxima ? '🎯 Próximo Alvo' : isUnknown ? 'Em Breve' : 'Pendente';
                const statusColor = concluido ? C.SUCCESS : isProxima ? C.WARNING : isUnknown ? C.TEXT_FAINT : C.TEXT_MUTED;

                return (
                  <tr key={nivel} style={{ background: rowBg }}>
                    <td className="tw-td text-center font-bold" style={{ color: isMarco ? C.ACCENT_DEEP : C.TEXT_PRIMARY, fontWeight: isMarco ? 900 : 700 }}>
                      {isMarco ? `⭐ ${nivel}` : nivel}
                    </td>
                    <td className="tw-td text-center font-mono" style={{ color: isUnknown ? C.TEXT_FAINT : C.TEXT_SECONDARY }}>
                      {formatNumber(poderNivel)}
                    </td>
                    <td className="tw-td text-center font-bold text-xs" style={{ color: statusColor }}>
                      {statusText}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Niveis;
