import React from 'react';
import { Box, Button, Card, Typography } from '@mui/material';


const Itens = ({ setRoute }) => {
  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', pb: 4 }}>
      
      <Box sx={{ mb: 3 }}>
        <Button 
          variant="outlined" color="primary" size="small" onClick={() => setRoute('home')}
          sx={{ fontWeight: 900, bgcolor: '#E1CFA3', borderWidth: '2px', borderRadius: '4px' }}
        >
          <span className="material-icons" style={{ fontSize: '1.2rem', marginRight: '6px' }}>arrow_back</span>
          Voltar à Base
        </Button>
      </Box>

      <Card sx={{ p: 4, textAlign: 'center', bgcolor: '#E1CFA3', border: '3px dashed #5a4010', borderRadius: '8px' }}>
        <Typography sx={{ fontSize: '4rem', mb: 2, filter: 'drop-shadow(1px 2px 2px rgba(62,47,28,0.2))' }}>🎒</Typography>
        <Typography sx={{ color: 'primary.main', fontWeight: 900, fontSize: '1.5rem', textTransform: 'uppercase', mb: 2 }}>
          Armazém de Itens em Construção
        </Typography>
        <Typography sx={{ color: 'text.secondary', fontWeight: 'bold', fontSize: '1rem' }}>
          Comandante, envie o relatório de inteligência com o banco de dados dos Itens para que eu possa carregar as prateleiras deste armazém!
        </Typography>
      </Card>

    </Box>
  );
};

export default Itens;
