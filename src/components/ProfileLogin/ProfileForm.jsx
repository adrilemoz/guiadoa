import React, { useState } from 'react';
import { dbReinos } from '../../db.js';
import { saveProfile } from '../../utils/storage.js';
import GameHeader from '../shared/GameHeader.jsx';
import Toast from '../../ui/Toast.jsx';
import { useTorneioTimer } from '../../hooks/useTorneioTimer.js';
import { C } from '../../theme.js';

const ProfileForm = ({ onSave, perfilAtual }) => {
  const [nome,     setNome]     = useState(perfilAtual?.nome     || '');
  const [reino,    setReino]    = useState(perfilAtual?.reino    || '');
  const [fuso,     setFuso]     = useState(perfilAtual?.fuso     || '');
  const [playerId, setPlayerId] = useState(perfilAtual?.playerId || '');
  const [toast,    setToast]    = useState({ open: false, message: '', severity: 'success' });

  const match  = fuso ? fuso.match(/UTC([+-]?\d+)/) : null;
  const offset = match ? parseInt(match[1], 10) : 0;
  const { horaLocal } = useTorneioTimer(fuso ? offset : null);

  const showToast  = (msg, sev = 'success') => setToast({ open: true, message: msg, severity: sev });
  const closeToast = () => setToast(t => ({ ...t, open: false }));

  const handleSave = () => {
    if (!nome.trim() || !reino.trim() || !fuso) {
      showToast('Preencha nome e reino antes de continuar!', 'warning');
      return;
    }
    const p = { nome: nome.trim(), reino, fuso, playerId: playerId.trim() };
    saveProfile(p);
    onSave(p);
  };

  return (
    <div className="max-w-sm mx-auto mt-4 px-3">
      <Toast {...toast} onClose={closeToast} />

      {/* Banner não oficial */}
      <div className="mb-3 p-2.5 rounded-lg border-2 border-dashed border-aoe-gold2 bg-aoe-bg2">
        <p className="font-nunito font-black text-xs text-aoe-red mb-1 flex items-center gap-1.5 m-0">
          <span className="text-base">⚠️</span> Ferramenta Não Oficial
        </p>
        <p className="font-nunito font-bold text-xs text-aoe-mid leading-snug text-justify m-0">
          Os cálculos são aproximações comunitárias, sem ligação com os servidores oficiais da Deca Games.
        </p>
      </div>

      <div className="tw-card">
        <GameHeader title="Recrutamento" />

        <div className="p-4 bg-aoe-card">
          {/* Avatar central */}
          <p className="text-5xl mb-4 m-0 text-center"
            style={{ filter: 'drop-shadow(1px 2px 3px rgba(62,47,28,0.2))' }}>
            🛡️
          </p>

          {/* Nome */}
          <div className="mb-3">
            <label className="font-nunito font-black text-[0.65rem] tracking-widest uppercase block mb-1.5"
              style={{ color: C.TEXT_MUTED }}>
              Nome do Comandante
            </label>
            <input
              className="tw-input"
              placeholder="Como você é conhecido..."
              value={nome}
              onChange={e => setNome(e.target.value)}
            />
          </div>

          {/* ID do Jogador */}
          <div className="mb-3">
            <label className="font-nunito font-black text-[0.65rem] tracking-widest uppercase block mb-1.5"
              style={{ color: C.TEXT_MUTED }}>
              ID do Jogador <span style={{ color: C.TEXT_FAINT, fontWeight: 600, textTransform: 'none', letterSpacing: 0 }}>(opcional)</span>
            </label>
            <input
              className="tw-input font-mono"
              placeholder="Ex: 12345678"
              inputMode="numeric"
              value={playerId}
              onChange={e => setPlayerId(e.target.value.replace(/\D/g, ''))}
              style={{ letterSpacing: '0.08em' }}
            />
            <p className="font-nunito font-semibold text-[0.62rem] mt-1 m-0" style={{ color: C.TEXT_FAINT }}>
              Encontre o ID no perfil do seu personagem no jogo.
            </p>
          </div>

          {/* Reino */}
          <div className="mb-3">
            <label className="font-nunito font-black text-[0.65rem] tracking-widest uppercase block mb-1.5"
              style={{ color: C.TEXT_MUTED }}>
              Reino
            </label>
            <select
              className="tw-select"
              value={reino}
              onChange={e => {
                const rNome = e.target.value;
                setReino(rNome);
                const r = dbReinos.find(x => x.nome === rNome);
                if (r) setFuso(r.fuso);
              }}
            >
              <option value="">— Selecionar Reino —</option>
              {dbReinos.map(r => (
                <option key={r.nome} value={r.nome}>{r.nome} ({r.fuso})</option>
              ))}
            </select>
          </div>

          {/* Preview do relógio */}
          {fuso && (
            <div className="mb-4 py-2 px-3 rounded-lg text-center"
              style={{
                background: 'rgba(184,150,90,0.1)',
                border: '1px solid rgba(200,168,74,0.3)',
              }}>
              <span className="font-nunito font-semibold text-[0.68rem]" style={{ color: C.TEXT_MUTED }}>
                Relógio do servidor: {' '}
              </span>
              <span className="font-nunito font-black text-sm" style={{ color: C.ACCENT }}>
                {horaLocal}
              </span>
              <span className="font-nunito font-semibold text-[0.62rem] ml-1" style={{ color: C.TEXT_FAINT }}>
                {fuso}
              </span>
            </div>
          )}

          <button onClick={handleSave} className="btn-navy btn-lg w-full">
            Aceder ao Quartel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
