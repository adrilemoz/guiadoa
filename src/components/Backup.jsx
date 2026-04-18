import React, { useState } from 'react';
import GameHeader from './shared/GameHeader.jsx';
import { Alert, Box, Button, Card, Divider, Snackbar, TextField, Typography } from '@mui/material';


const Backup = () => {
  const [backupCode, setBackupCode] = useState('');
  const [restoreCode, setRestoreCode] = useState('');
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  
  const showToast = (message, severity = 'success') => setToast({ open: true, message, severity });
  const closeToast = () => setToast({ ...toast, open: false });

  // ==========================================
  // LÓGICA DE BACKUP E RESTAURAÇÃO
  // ==========================================
  const handleGenerateBackup = () => {
    const keys = Object.keys(localStorage).filter(k => k.startsWith('doa_'));
    const backupObj = {};
    keys.forEach(k => { backupObj[k] = localStorage.getItem(k); });
    const encrypted = btoa(unescape(encodeURIComponent(JSON.stringify(backupObj))));
    setBackupCode(encrypted);
    showToast("Cópia de segurança gerada com sucesso!", "success");
  };

  const handleCopyBackup = () => {
    if(!backupCode) return showToast("Gere o backup primeiro!", "warning");
    navigator.clipboard.writeText(backupCode);
    showToast("Código de backup copiado para a área de transferência.", "info");
  };

  const handleRestoreBackup = () => {
    if(!restoreCode) return showToast("Cole o código de backup primeiro!", "warning");
    try {
      const decoded = JSON.parse(decodeURIComponent(escape(atob(restoreCode))));
      Object.keys(decoded).forEach(k => {
        localStorage.setItem(k, decoded[k]);
      });
      showToast("Sucesso! Dados restaurados. A reiniciar o sistema...", "success");
      setTimeout(() => window.location.reload(), 2000);
    } catch(e) {
      showToast("Erro! Código de backup inválido ou corrompido.", "error");
    }
  };

  // Cabeçalho Padrão do Jogo
  const GameHeader = ({ title, fontSize = '1.1rem' }) => (
    <Box sx={{ bgcolor: 'primary.main', borderBottom: '3px solid secondary.main', p: 1, textAlign: 'center', boxShadow: 'inset 0 -2px 4px rgba(62,47,28,0.12)' }}>
      <Typography sx={{ color: 'primary.contrastText', fontWeight: '900', fontSize: fontSize, textShadow: '1px 2px 2px rgba(62,47,28,0.25)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
        {title}
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ maxWidth: 500, margin: 'auto', pb: 4 }}>
      
      {/* ALERTA FLUTUANTE */}
      <Snackbar open={toast.open} autoHideDuration={3000} onClose={closeToast} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} sx={{ mt: 7 }}>
        <Alert onClose={closeToast} severity={toast.severity} variant="filled" sx={{ width: '100%', fontWeight: 'bold' }}>
          {toast.message}
        </Alert>
      </Snackbar>

      <Card sx={{ mb: 3, p: 0, overflow: 'hidden' }}>
        <GameHeader title="💾 Backup e Restauração" />
        
        <Box sx={{ p: 3, bgcolor: '#F2E6C9' }}>
          
          {/* SEÇÃO 1: GERAR BACKUP */}
          <Box sx={{ mb: 1 }}>
            <Typography sx={{ color: 'primary.main', fontWeight: 900, fontSize: '1.1rem', mb: 0.5, textTransform: 'uppercase' }}>
              1. Criar Cópia de Segurança
            </Typography>
            <Typography sx={{ color: 'text.secondary', fontWeight: 'bold', fontSize: '0.85rem', mb: 2, lineHeight: 1.4, textAlign: 'justify' }}>
              Gere um código criptografado contendo todo o seu progresso atual (Perfil, Fuso Horário e Preferências) para guardar num local seguro.
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="contained" color="success" onClick={handleGenerateBackup} sx={{ flex: 1, fontSize: '0.9rem' }}>
                Gerar Backup
              </Button>
              <Button variant="contained" color="info" onClick={handleCopyBackup} disabled={!backupCode} sx={{ fontSize: '0.9rem' }}>
                Copiar
              </Button>
            </Box>

            {backupCode && (
              <TextField 
                fullWidth size="small" value={backupCode} InputProps={{ readOnly: true }} 
                sx={{ 
                  mt: 2, 
                  bgcolor: '#E1CFA3', 
                  borderRadius: '4px',
                  '& .MuiOutlinedInput-root': { 
                    fontWeight: 'bold',
                    color: 'primary.main',
                    '& fieldset': { borderColor: '#C8A96B' },
                    '&:hover fieldset': { borderColor: 'primary.main' }
                  } 
                }} 
              />
            )}
          </Box>

          <Divider sx={{ my: 3, borderColor: '#C8A96B', opacity: 0.4 }} />

          {/* SEÇÃO 2: RESTAURAR DADOS */}
          <Box>
            <Typography sx={{ color: 'error.main', fontWeight: 900, fontSize: '1.1rem', mb: 0.5, textTransform: 'uppercase' }}>
              2. Restaurar Dados
            </Typography>
            <Typography sx={{ color: 'text.secondary', fontWeight: 'bold', fontSize: '0.85rem', mb: 2, lineHeight: 1.4, textAlign: 'justify' }}>
              Cole o código de backup abaixo para recuperar os seus dados. <strong style={{ color: '#e05030' }}>Aviso:</strong> Isto irá substituir o progresso atual gravado neste dispositivo.
            </Typography>
            
            <TextField 
              fullWidth size="small" placeholder="Cole o código aqui..." 
              value={restoreCode} onChange={(e) => setRestoreCode(e.target.value)} 
              sx={{ 
                mb: 2, 
                bgcolor: '#E1CFA3', 
                borderRadius: '4px',
                '& .MuiOutlinedInput-root': { 
                  fontWeight: 'bold',
                  '& fieldset': { borderColor: '#C8A96B' },
                  '&.Mui-focused fieldset': { borderColor: 'error.main', borderWidth: '2px' }
                } 
              }} 
            />
            
            <Button fullWidth variant="contained" color="error" onClick={handleRestoreBackup} sx={{ fontSize: '0.9rem' }}>
              Restaurar Backup
            </Button>
          </Box>

        </Box>
      </Card>
      
      {/* Dica de Segurança */}
      <Box sx={{ p: 2, bgcolor: 'rgba(17, 138, 139, 0.1)', border: '2px dashed #c8940a', borderRadius: '8px', textAlign: 'center' }}>
        <Typography sx={{ color: 'primary.main', fontWeight: 900, fontSize: '0.85rem', mb: 0.5 }}>
          🛡️ Dica do Comandante
        </Typography>
        <Typography sx={{ color: 'text.secondary', fontSize: '0.75rem', fontWeight: 'bold' }}>
          Guarde o código de backup gerado nas suas anotações do telemóvel ou envie para si mesmo por e-mail para não o perder!
        </Typography>
      </Box>

    </Box>
  );
};

export default Backup;
