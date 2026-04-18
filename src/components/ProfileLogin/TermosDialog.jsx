import React from 'react';
import { Box, Button, Dialog, Typography } from '@mui/material';
import { setTermoAceito } from '../../utils/storage.js';

/**
 * Modal de aceite dos termos de uso exibido na primeira visita.
 */
const TermosDialog = ({ open, onAceitar }) => {
  const handleAceitar = () => {
    setTermoAceito();
    onAceitar();
  };

  return (
    <Dialog
      open={open}
      disableEscapeKeyDown
      PaperProps={{ sx: { bgcolor: '#F2E6C9', border: '4px solid #5a4010', borderRadius: '8px', boxShadow: '0 8px 24px rgba(0,0,0,0.8)', p: 1, m: 2 } }}
    >
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography sx={{ fontSize: '3rem', lineHeight: 1, mb: 1 }}>📜</Typography>
        <Typography sx={{ color: '#e05030', fontWeight: 900, fontSize: '1.3rem', mb: 2, textTransform: 'uppercase', borderBottom: '2px solid #5a4010', pb: 1 }}>
          Contrato de Acesso
        </Typography>
        <Typography sx={{ color: 'text.primary', fontWeight: 'bold', fontSize: '0.9rem', mb: 2, textAlign: 'justify', lineHeight: 1.5 }}>
          Bem-vindo ao Guia Tático DOA. Este aplicativo é uma ferramenta <b>não oficial</b> criada pela comunidade de fãs e não possui qualquer vínculo com a desenvolvedora <b>Deca Games</b>.
        </Typography>
        <Typography sx={{ color: 'text.secondary', fontWeight: 'bold', fontSize: '0.85rem', mb: 3, textAlign: 'justify', lineHeight: 1.5 }}>
          Os resultados das calculadoras são baseados em lógicas estudadas por jogadores. Pequenas variações nos cálculos podem ocorrer. Ao entrar, você concorda que o uso desta ferramenta é apenas para auxílio estratégico.
        </Typography>
        <Button variant="contained" color="success" size="large" onClick={handleAceitar}
          sx={{ fontWeight: 900, fontSize: '1rem', border: '2px solid #1a432b', width: '100%', py: 1.5 }}>
          LI E ACEITO OS TERMOS
        </Button>
      </Box>
    </Dialog>
  );
};

export default TermosDialog;
