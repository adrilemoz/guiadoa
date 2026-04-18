import React, { useState } from 'react';
import { Alert, Box, Button, Card, MenuItem, Snackbar, TextField, Typography } from '@mui/material';
import { dbReinos } from '../../db.js';
import { saveProfile } from '../../utils/storage.js';
import GameHeader from '../shared/GameHeader.jsx';
import { useTorneioTimer } from '../../hooks/useTorneioTimer.js';

/**
 * Formulário de criação/edição de perfil do jogador.
 * Desmembrado do Home.jsx para facilitar manutenção e reutilização.
 */
const ProfileForm = ({ onSave }) => {
  const [nome,  setNome]  = useState('');
  const [reino, setReino] = useState('');
  const [fuso,  setFuso]  = useState('');
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  // Offset derivado do fuso selecionado
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
    <Box sx={{ maxWidth: 450, margin: 'auto', mt: 4, px: 2 }}>
      <Snackbar open={toast.open} autoHideDuration={3000} onClose={closeToast} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity={toast.severity} variant="filled" sx={{ fontSize: '1rem', fontWeight: 'bold' }}>{toast.message}</Alert>
      </Snackbar>

      <Box sx={{ mb: 3, p: 2, bgcolor: '#F2E6C9', border: '2px dashed #5a4010', borderRadius: '8px' }}>
        <Typography sx={{ color: '#e05030', fontWeight: 900, fontSize: '0.9rem', mb: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
          <span style={{ fontSize: '1.2rem' }}>⚠️</span> Ferramenta Não Oficial
        </Typography>
        <Typography sx={{ color: 'text.secondary', fontSize: '0.75rem', fontWeight: 'bold', lineHeight: 1.4, textAlign: 'justify' }}>
          Os cálculos são aproximações comunitárias, sem ligação com os servidores oficiais da Deca Games.
        </Typography>
      </Box>

      <Card sx={{ p: 0, overflow: 'hidden' }}>
        <GameHeader title="Recrutamento" />
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h2" sx={{ mb: 3, filter: 'drop-shadow(1px 2px 3px rgba(62,47,28,0.2))' }}>🛡️</Typography>

          <TextField
            fullWidth label="Nome do Comandante" variant="outlined"
            sx={{ mb: 3, bgcolor: '#F2E6C9', borderRadius: '4px' }}
            value={nome} onChange={(e) => setNome(e.target.value)}
          />

          <TextField
            select fullWidth label="Reino Atual" variant="outlined"
            sx={{ mb: 3, bgcolor: '#F2E6C9', borderRadius: '4px' }}
            value={reino || ''}
            onChange={(e) => {
              const rNome = e.target.value;
              setReino(rNome);
              const r = dbReinos.find(x => x.nome === rNome);
              if (r) setFuso(r.fuso);
            }}
          >
            {dbReinos.map(r => (
              <MenuItem key={r.nome} value={r.nome}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <Typography sx={{ fontWeight: 'bold' }}>{r.nome}</Typography>
                  <Typography sx={{ color: 'text.secondary', fontWeight: 900, fontSize: '0.8rem' }}>({r.fuso})</Typography>
                </Box>
              </MenuItem>
            ))}
          </TextField>

          <Typography sx={{ color: 'text.secondary', fontWeight: '900', mb: 3, fontSize: '1rem' }}>
            Relógio: <span style={{ color: '#B8965A' }}>{fuso ? horaLocal : 'Aguardando...'}</span>
          </Typography>

          <Button fullWidth variant="contained" color="success" size="large" onClick={handleSave}
            sx={{ fontSize: '1.1rem', py: 1.5, fontWeight: 900 }}>
            Aceder ao Quartel
          </Button>
        </Box>
      </Card>
    </Box>
  );
};

export default ProfileForm;
