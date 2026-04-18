import React, { useState } from 'react';
import { Box, Button, Card, Grid, IconButton, MenuItem, TextField, Typography } from '@mui/material';
import { dbTropas } from '../../db.js';
import { C } from '../../theme.js';


const TorneioAlianca = () => {
  // A. Estado para gerir múltiplas linhas de treino
  const [treinos, setTreinos] = useState([
    { id: 1, tropa: '', qtd: '' },
    { id: 2, tropa: '', qtd: '' }
  ]);

  const handleTreinoTropa = (id, value) => {
    setTreinos(treinos.map(t => t.id === id ? { ...t, tropa: value } : t));
  };

  const handleTreinoQtd = (id, value) => {
    const numericVal = value.replace(/\D/g, '');
    const formattedVal = numericVal ? parseInt(numericVal, 10).toLocaleString('pt-BR') : '';
    setTreinos(treinos.map(t => t.id === id ? { ...t, qtd: formattedVal } : t));
  };

  const adicionarLinha = () => {
    setTreinos([...treinos, { id: Date.now(), tropa: '', qtd: '' }]);
  };

  const removerLinha = (id) => {
    if (treinos.length > 1) setTreinos(treinos.filter(t => t.id !== id));
  };

  // --- CÁLCULOS DO TREINO (CONTRIBUIÇÃO PARA A ALIANÇA) ---
  let poderTreino = 0;
  let tropasTotais = 0;

  treinos.forEach(t => {
    const tObj = true ? dbTropas.find(x => x.nome === t.tropa) : null;
    const pUnitario = tObj && tObj.poder !== null ? tObj.poder : 0;
    const qtd = parseInt(t.qtd.replace(/\./g, '')) || 0;
    
    poderTreino += qtd * pUnitario;
    tropasTotais += qtd;
  });

  const formatNumber = (n) => n === null || n === undefined ? "0" : n.toLocaleString("pt-BR");

  return (
    <Box sx={{ textAlign: 'left', mt: 1 }}>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        
        {/* === CARTÃO A: SIMULADOR DE CONTRIBUIÇÃO === */}
        <Grid item xs={12} md={7}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #5a4010', pb: 1, mb: 2 }}>
              <Typography sx={{ color: 'primary.main', fontWeight: 900, textTransform: 'uppercase', fontSize: '1.1rem' }}>
                A. Simulador de Contribuição
              </Typography>
              <Button 
                variant="contained" color="info" size="small" onClick={adicionarLinha}
                sx={{ border: '2px solid #3a2808', fontWeight: '900', px: 1.5, py: 0.5, fontSize: '0.7rem' }}
              >
                + Tropa
              </Button>
            </Box>

            <Typography sx={{ color: 'text.secondary', fontSize: '0.8rem', mb: 3, fontWeight: 'bold' }}>
              Se o Torneio de Aliança ativo for de <span style={{color: '#B8965A'}}>Poder</span>, calcule aqui quantos pontos vai gerar para a sua equipa através do treino de tropas.
            </Typography>

            {treinos.map((linha) => {
              const tObj = true ? dbTropas.find(x => x.nome === linha.tropa) : null;
              const pUnitario = tObj ? tObj.poder : 0;
              const linhaQtdFormatada = parseInt(linha.qtd.replace(/\./g, '')) || 0;
              const subtotal = linhaQtdFormatada * pUnitario;

              return (
                <Box key={linha.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, p: 1, bgcolor: '#F2E6C9', borderRadius: '6px', border: '1px solid #5a4010', boxShadow: 'inset 0 1px 2px rgba(62,47,28,0.05)' }}>
                  
                  {/* Tropa */}
                  <TextField 
                    select label="Tropa" variant="outlined" size="small"
                    value={linha.tropa} onChange={(e) => handleTreinoTropa(linha.id, e.target.value)}
                    sx={{ flex: 1.2, bgcolor: '#E1CFA3', borderRadius: '4px', '& .MuiOutlinedInput-root': { fontWeight: 'bold', color: 'primary.main' } }}
                  >
                    {[...dbTropas].sort((a, b) => a.nome.localeCompare(b.nome)).map((tropa) => (
                      <MenuItem key={tropa.nome} value={tropa.nome} sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                        {tropa.nome}
                      </MenuItem>
                    ))}
                  </TextField>

                  {/* Quantidade */}
                  <TextField 
                    label="Quantidade" variant="outlined" type="text" size="small"
                    value={linha.qtd} onChange={(e) => handleTreinoQtd(linha.id, e.target.value)}
                    sx={{ flex: 1.3, bgcolor: '#E1CFA3', borderRadius: '4px', '& .MuiOutlinedInput-root': { fontWeight: '900', color: '#B8965A' } }}
                  />

                  {/* Poder Subtotal */}
                  <Box sx={{ flex: 0.9, textAlign: 'right', px: 0.5, overflow: 'hidden' }}>
                    <Typography sx={{ color: 'text.secondary', fontSize: '0.6rem', fontWeight: 900, textTransform: 'uppercase' }}>Poder</Typography>
                    <Typography sx={{ color: 'primary.main', fontWeight: 900, fontSize: '1rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                      {formatNumber(subtotal)}
                    </Typography>
                  </Box>

                  {/* Botão Remover */}
                  <IconButton onClick={() => removerLinha(linha.id)} disabled={treinos.length === 1} sx={{ p: 0.5, color: treinos.length === 1 ? 'rgba(0,0,0,0.1)' : 'error.main' }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '1.4rem', lineHeight: 1 }}>×</Typography>
                  </IconButton>
                </Box>
              );
            })}
          </Card>
        </Grid>

        {/* === CARTÃO B: PROJEÇÃO FINAL (Foco Coletivo) === */}
        <Grid item xs={12} md={5}>
          <Card sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography sx={{ color: 'primary.main', fontWeight: 900, mb: 1, textTransform: 'uppercase', fontSize: '1.1rem', borderBottom: '2px solid #5a4010', pb: 1 }}>
              B. A Sua Contribuição
            </Typography>
            
            <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem', mb: 2, fontWeight: 'bold', lineHeight: 1.5 }}>
              Embora existam recompensas ao cumprir as metas do torneio, elas são muito fracas e não exigem planeamento complexo. O seu foco principal deve ser maximizar a pontuação para a glória do grupo!
            </Typography>
            
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 2 }}>
              <Box sx={{ p: 2, bgcolor: '#F2E6C9', borderRadius: '6px', border: '1px solid #5a4010', borderLeft: '6px solid #5a4010', textAlign: 'center', boxShadow: 'inset 0 1px 3px rgba(62,47,28,0.06)' }}>
                <Typography sx={{ color: 'text.secondary', fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase' }}>Tropas Treinadas</Typography>
                <Typography sx={{ color: 'text.primary', fontSize: '2rem', fontWeight: 900 }}>{formatNumber(tropasTotais)}</Typography>
              </Box>

              <Box sx={{ p: 2, bgcolor: '#B8965A', borderRadius: '6px', border: '2px solid #3a2808', borderLeft: '6px solid #3a2808', textAlign: 'center', boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.2)' }}>
                <Typography sx={{ color: C.TEXT_PRIMARY, fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', textShadow: '1px 1px 2px rgba(62,47,28,0.2)' }}>Pontos para a Aliança</Typography>
                <Typography sx={{ color: C.TEXT_PRIMARY, fontSize: '2.5rem', fontWeight: 900, textShadow: '1px 1px 3px rgba(62,47,28,0.25)', lineHeight: 1.1 }}>{formatNumber(poderTreino)}</Typography>
              </Box>
            </Box>
          </Card>
        </Grid>

      </Grid>

      {/* === CARTÃO C: GUIA DA ALIANÇA === */}
      <Typography sx={{ color: 'primary.main', fontWeight: 900, mb: 1.5, fontSize: '1.2rem', textShadow: '1px 1px 1px rgba(255,255,255,0.5)' }}>
        Guia Tático: Torneios de Aliança
      </Typography>
      
      <Grid container spacing={2} sx={{ mb: 4 }}>
        
        {/* Variedade de Torneios */}
        <Grid item xs={12} sm={6}>
          <Card sx={{ p: 2, height: '100%', borderLeft: '6px solid #c8940a' }}>
            <Typography sx={{ color: 'text.primary', fontWeight: 900, fontSize: '0.95rem', mb: 0.5 }}>1. Variedade de Eventos</Typography>
            <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem', mb: 1.5, fontWeight: 'bold' }}>
              No formato de Aliança, podem ocorrer <b>versões em grupo de quase todos os torneios normais</b> do jogo (Ganhar Poder, Treinar Tropas, Matar Inimigos, etc.). A única diferença é que a pontuação é a soma do progresso de todos os membros.
            </Typography>
          </Card>
        </Grid>
        
        {/* Recompensas e Foco */}
        <Grid item xs={12} sm={6}>
          <Card sx={{ p: 2, height: '100%', borderLeft: '6px solid #c8940a' }}>
            <Typography sx={{ color: 'text.primary', fontWeight: 900, fontSize: '0.95rem', mb: 0.5 }}>2. Foco nas Recompensas</Typography>
            <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem', mb: 1, fontWeight: 'bold' }}>
              Esqueça as metas individuais medíocres! O verdadeiro objetivo deste torneio é a <span style={{color: '#B8965A'}}>Classificação Final da Aliança no Servidor</span>. São as recompensas de ranking global que trazem o lucro pesado para si e para os seus companheiros de armas.
            </Typography>
          </Card>
        </Grid>

        {/* Alerta Importante */}
        <Grid item xs={12}>
          <Card sx={{ p: 2, borderLeft: '6px solid #e05030', bgcolor: '#E1CFA3' }}>
            <Typography sx={{ color: 'error.main', fontWeight: 900, fontSize: '0.95rem', mb: 0.5, textTransform: 'uppercase' }}>⚠️ Regras de Segurança da Aliança</Typography>
            <Typography sx={{ color: 'text.primary', fontSize: '0.85rem', fontWeight: 'bold' }}>
              <b>Nunca saia da sua Aliança durante um torneio ativo!</b> Abandonar o grupo geralmente faz com que toda a sua pontuação individual seja apagada do total coletivo, prejudicando gravemente o esforço da equipa. Se for um evento de Poder, não use itens de ataque/defesa temporários, pois não contabilizam para o torneio.
            </Typography>
          </Card>
        </Grid>

      </Grid>

    </Box>
  );
};

export default TorneioAlianca;
