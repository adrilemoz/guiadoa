import React, { useState } from 'react';
import { dbReinos } from '../../db.js';
import { saveProfile } from '../../utils/storage.js';
import GameHeader from '../shared/GameHeader.jsx';
import Toast from '../../ui/Toast.jsx';
import { useTorneioTimer } from '../../hooks/useTorneioTimer.js';

const ProfileForm = ({ onSave }) => {
  const [nome,  setNome]  = useState('');
  const [reino, setReino] = useState('');
  const [fuso,  setFuso]  = useState('');
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const match  = fuso ? fuso.match(/UTC([+-]?\d+)/) : null;
  const offset = match ? parseInt(match[1], 10) : 0;
  const { horaLocal } = useTorneioTimer(fuso ? offset : null);

  const showToast  = (msg, sev = 'success') => setToast({ open: true, message: msg, severity: sev });
  const closeToast = () => setToast(t => ({ ...t, open: false }));

  const handleSave = () => {
    if (!nome.trim() || !reino.trim() || !fuso) {
      showToast('Preencha todos os dados antes de continuar!', 'warning');
      return;
    }
    const p = { nome, reino, fuso };
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

        <div className="p-4 text-center bg-aoe-card">
          <p className="text-5xl mb-3 m-0" style={{ filter: 'drop-shadow(1px 2px 3px rgba(62,47,28,0.2))' }}>🛡️</p>

          <input
            className="tw-input mb-3"
            placeholder="Nome do Comandante"
            value={nome}
            onChange={e => setNome(e.target.value)}
          />

          <select
            className="tw-select mb-3"
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

          <p className="font-nunito font-black text-sm text-aoe-mid mb-4 m-0">
            Relógio:{' '}
            <span className="font-black" style={{ color: '#B8965A' }}>
              {fuso ? horaLocal : 'Aguardando...'}
            </span>
          </p>

          <button onClick={handleSave} className="btn-navy btn-lg w-full">
            Aceder ao Quartel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
