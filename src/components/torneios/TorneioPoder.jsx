import React, { useState } from 'react';
import { Box, Button, Card, Chip, Divider, Grid, IconButton, MenuItem, Select, TextField, Typography } from '@mui/material';
import { dbTropas } from '../../db.js';
import { C } from '../../theme.js';


const TorneioPoder = () => {
  // A. Estado para gerir múltiplas linhas de treino
  const [treinos, setTreinos] = useState([
    { id: 1, tropa: '', qtd: '' },
    { id: 2, tropa: '', qtd: '' }
  ]);

  // B. Estado da Tropa de Recompensa
  const [tropaPremio, setTropaPremio] = useState('');

  // C. Estados das Recompensas (Multiplicador e Base)
  const [premios, setPremios] = useState({
    princ: { m: 10, b: 1000 },
    meta1: { m: 2,  b: 1000 },
    meta2: { m: 5,  b: 1000 },
    meta3: { m: 10, b: 1000 },
  });

  const handlePremioChange = (key, field, val) => {
    setPremios(prev => ({ ...prev, [key]: { ...prev[key], [field]: val } }));
  };

  // Atualiza a Tropa na linha de treino
  const handleTreinoTropa = (id, value) => {
    setTreinos(treinos.map(t => t.id === id ? { ...t, tropa: value } : t));
  };

  // Atualiza a Quantidade na linha de treino (COM FORMATAÇÃO DE PONTOS)
  const handleTreinoQtd = (id, value) => {
    // Remove tudo o que não for número
    const numericVal = value.replace(/\D/g, '');
    // Formata com pontos
    const formattedVal = numericVal ? parseInt(numericVal, 10).toLocaleString('pt-BR') : '';
    setTreinos(treinos.map(t => t.id === id ? { ...t, qtd: formattedVal } : t));
  };

  const adicionarLinha = () => {
    setTreinos([...treinos, { id: Date.now(), tropa: '', qtd: '' }]);
  };

  const removerLinha = (id) => {
    if (treinos.length > 1) setTreinos(treinos.filter(t => t.id !== id));
  };

  // --- 1. CÁLCULOS DO TREINO (PONTOS DO TORNEIO) ---
  let poderTreino = 0;
  treinos.forEach(t => {
    const tObj = true ? dbTropas.find(x => x.nome === t.tropa) : null;
    const pUnitario = tObj && tObj.poder !== null ? tObj.poder : 0;
    // Remove os pontos para conseguir fazer a matemática
    const qtd = parseInt(t.qtd.replace(/\./g, '')) || 0;
    poderTreino += qtd * pUnitario;
  });

  // No Torneio de Poder, 1 de Poder Ganho = 1 Ponto
  const totalPontosTorneio = poderTreino; 

  // --- 2. CÁLCULOS DAS RECOMPENSAS ---
  const tropaPremioObj = true ? dbTropas.find(t => t.nome === tropaPremio) : null;
  const poderUnitarioPremio = tropaPremioObj && tropaPremioObj.poder !== null ? tropaPremioObj.poder : 0;

  // Metas genéricas de Poder (Ex: 1M, 5M, 15M). Ajusta se o teu reino usar outras!
  const meta1Pts = 1000000;
  const meta2Pts = 5000000;
  const meta3Pts = 15000000;

  const totalPrinc = premios.princ.m * premios.princ.b;
  const totalM1 = totalPontosTorneio >= meta1Pts ? premios.meta1.m * premios.meta1.b : 0;
  const totalM2 = totalPontosTorneio >= meta2Pts ? premios.meta2.m * premios.meta2.b : 0;
  const totalM3 = totalPontosTorneio >= meta3Pts ? premios.meta3.m * premios.meta3.b : 0;

  const totalTropasPremio = totalPrinc + totalM1 + totalM2 + totalM3;
  const totalPoderPremio = totalTropasPremio * poderUnitarioPremio;

  const formatNumber = (n) => n === null || n === undefined ? "0" : n.toLocaleString("pt-BR");
  const listaQtds = [10, 50, 100, 200, 300, 500, 1000, 2000, 5000, 10000];

  // Componente Reutilizável: Linha de Prémio
  const RewardRow = ({ label, dataKey, reqPontos }) => {
    const disabled = totalPontosTorneio < reqPontos;
    return (
      <Box sx={{ 
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1, p: 1, 
        bgcolor: disabled ? 'transparent' : '#F2E6C9', 
        border: '1px solid', borderColor: disabled ? 'rgba(166, 131, 77, 0.3)' : '#C8A96B', 
        borderRadius: '6px', transition: 'all 0.3s',
        boxShadow: disabled ? 'none' : 'inset 0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <Typography sx={{ color: disabled ? 'text.secondary' : 'text.primary', fontSize: '0.75rem', fontWeight: 900, opacity: disabled ? 0.6 : 1, width: '35%' }}>
          {label}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, opacity: disabled ? 0.4 : 1 }}>
           <IconButton size="small" onClick={() => handlePremioChange(dataKey, 'm', Math.max(0, premios[dataKey].m - 1))} disabled={disabled} sx={{ bgcolor: '#E1CFA3', width: '24px', height: '24px', borderRadius: '4px', border: '1px solid #5a4010' }}>
             <Typography sx={{ color: 'text.primary', fontSize: '1.2rem', lineHeight: 1, fontWeight: 'bold' }}>-</Typography>
           </IconButton>
           
           <Typography sx={{ color: 'primary.main', width: '24px', textAlign: 'center', fontWeight: '900', fontSize: '0.9rem' }}>
             {premios[dataKey].m}
           </Typography>
           
           <IconButton size="small" onClick={() => handlePremioChange(dataKey, 'm', premios[dataKey].m + 1)} disabled={disabled} sx={{ bgcolor: '#E1CFA3', width: '24px', height: '24px', borderRadius: '4px', border: '1px solid #5a4010' }}>
             <Typography sx={{ color: 'text.primary', fontSize: '1.2rem', lineHeight: 1, fontWeight: 'bold' }}>+</Typography>
           </IconButton>
           
           <Typography sx={{ color: 'text.secondary', fontSize: '0.8rem', mx: 0.2, fontWeight: 'bold' }}>x</Typography>
           
           <Select
             size="small" value={premios[dataKey].b} onChange={(e) => handlePremioChange(dataKey, 'b', e.target.value)} disabled={disabled}
             sx={{ height: '28px', bgcolor: '#E1CFA3', color: 'text.primary', fontWeight: 'bold', fontSize: '0.8rem', border: '1px solid #5a4010', '& .MuiOutlinedInput-notchedOutline': { border: 'none' } }}
           >
             {listaQtds.map(v => (
               <MenuItem key={v} value={v} sx={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'text.primary' }}>{formatNumber(v)}</MenuItem>
             ))}
           </Select>
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ textAlign: 'left', mt: 1 }}>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        
        {/* === CARTÃO A: SIMULADOR DE TREINO === */}
        <Grid item xs={12} md={7}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #5a4010', pb: 1, mb: 2 }}>
              <Typography sx={{ color: 'primary.main', fontWeight: 900, textTransform: 'uppercase', fontSize: '1.1rem' }}>
                A. Aumento de Poder (Pontos)
              </Typography>
              <Button 
                variant="contained" color="info" size="small" onClick={adicionarLinha}
                sx={{ border: '2px solid #3a2808', fontWeight: '900', px: 1.5, py: 0.5, fontSize: '0.7rem' }}
              >
                + Tropa
              </Button>
            </Box>

            <Typography sx={{ color: 'text.secondary', fontSize: '0.8rem', mb: 3, fontWeight: 'bold' }}>
              Selecione as tropas e quantidades a treinar. O poder gerado equivale aos pontos do torneio.
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

                  {/* Quantidade (Agora mais larga e formatada) */}
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

            {/* Resultado do Poder/Pontos */}
            <Box sx={{ mt: 3, p: 1.5, bgcolor: '#F2E6C9', borderRadius: '6px', border: '1px solid #5a4010', borderBottom: '4px solid #c8940a', textAlign: 'center', boxShadow: 'inset 0 1px 3px rgba(62,47,28,0.06)' }}>
              <Typography sx={{ color: 'text.secondary', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase' }}>Poder Total Ganho (Pontuação)</Typography>
              <Typography sx={{ color: 'primary.main', fontSize: '2.5rem', fontWeight: 900, lineHeight: 1 }}>{formatNumber(totalPontosTorneio)}</Typography>
            </Box>
          </Card>
        </Grid>

        {/* === CARTÃO B: RECOMPENSAS === */}
        <Grid item xs={12} md={5}>
          <Card sx={{ p: 3, height: '100%' }}>
            
            <Typography sx={{ color: 'primary.main', fontWeight: 900, mb: 1, textTransform: 'uppercase', fontSize: '1.1rem', borderBottom: '2px solid #5a4010', pb: 1 }}>
              B. Recompensas (Bónus)
            </Typography>
            
            <Box sx={{ mb: 3, mt: 2 }}>
              <TextField 
                select fullWidth label="Tropa de Prémio" variant="outlined" size="small"
                value={tropaPremio} onChange={(e) => setTropaPremio(e.target.value)}
                sx={{ bgcolor: '#F2E6C9', borderRadius: '4px', '& .MuiOutlinedInput-root': { fontWeight: 'bold', color: 'primary.main' }, '& .MuiInputLabel-root': { color: 'primary.main', fontWeight: 'bold' } }}
              >
                {[...dbTropas].sort((a, b) => a.nome.localeCompare(b.nome)).map((tropa) => (
                  <MenuItem key={tropa.nome} value={tropa.nome} sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                    {tropa.nome} (Poder: {formatNumber(tropa.poder)})
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <Typography sx={{ color: 'text.secondary', fontSize: '0.8rem', fontWeight: 900, mb: 1 }}>METAS E PRÉMIOS</Typography>
            
            <RewardRow label="Principal" dataKey="princ" reqPontos={0} />
            <RewardRow label={`Meta ${formatNumber(meta1Pts)}`} dataKey="meta1" reqPontos={meta1Pts} />
            <RewardRow label={`Meta ${formatNumber(meta2Pts)}`} dataKey="meta2" reqPontos={meta2Pts} />
            <RewardRow label={`Meta ${formatNumber(meta3Pts)}`} dataKey="meta3" reqPontos={meta3Pts} />

            <Divider sx={{ borderColor: 'rgba(166, 131, 77, 0.4)', my: 2 }} />

            {/* Resultados Finais das Recompensas */}
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Box sx={{ flex: 1, p: 1.5, bgcolor: '#F2E6C9', borderRadius: '6px', border: '1px solid #5a4010', textAlign: 'center', boxShadow: 'inset 0 1px 3px rgba(62,47,28,0.06)' }}>
                <Typography sx={{ color: 'text.secondary', fontSize: '0.80rem', fontWeight: 900, textTransform: 'uppercase' }}>Total Tropas</Typography>
                <Typography sx={{ color: 'text.primary', fontSize: '1.4rem', fontWeight: 900 }}>{formatNumber(totalTropasPremio)}</Typography>
              </Box>
              <Box sx={{ flex: 1, p: 1.5, bgcolor: '#B8965A', borderRadius: '6px', border: '2px solid #3a2808', textAlign: 'center', boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.2)' }}>
                <Typography sx={{ color: 'primary.contrastText', fontSize: '0.80rem', fontWeight: 900, textTransform: 'uppercase' }}>Poder Bónus</Typography>
                <Typography sx={{ color: C.TEXT_PRIMARY, fontSize: '1.4rem', fontWeight: 900, textShadow: '1px 1px 2px rgba(62,47,28,0.2)' }}>{formatNumber(totalPoderPremio)}</Typography>
              </Box>
            </Box>
          </Card>
        </Grid>

      </Grid>

      {/* === CARTÃO C: REGRAS === */}
      <Typography sx={{ color: 'primary.main', fontWeight: 900, mb: 1.5, fontSize: '1.2rem', textShadow: '1px 1px 1px rgba(255,255,255,0.5)' }}>
        Regras do Torneio de Poder
      </Typography>
      <Card sx={{ p: 3, mb: 4, borderLeft: '6px solid #c8940a' }}>
        <Typography sx={{ color: 'text.primary', fontSize: '0.95rem', mb: 2, fontWeight: 'bold' }}>
          O objetivo central é <span style={{color: '#B8965A'}}>aumentar o seu Poder Geral permanentemente</span>. Principais fontes de pontos:
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
          {["Pesquisas", "Construções", "Treinar Tropas", "Evolução de Tropas", "Aprimoramento de Tropas", "Evolução de Dragões", "Abrir Tropas", "Invocar Generais"].map(regra => (
            <Chip key={regra} label={regra} sx={{ bgcolor: '#E1CFA3', color: 'text.primary', fontWeight: 'bold', border: '1px solid #5a4010', borderRadius: '4px' }} />
          ))}
        </Box>

        <Box sx={{ p: 1.5, bgcolor: '#F2E6C9', borderRadius: '6px', border: '1px solid #5a4010' }}>
          <Typography sx={{ color: 'error.main', fontWeight: 900, fontSize: '0.8rem', textTransform: 'uppercase', mb: 0.5 }}>Atenção Comandante</Typography>
          <Typography sx={{ color: 'text.primary', fontSize: '0.8rem', fontWeight: 'bold' }}>
            Poder ganho temporariamente (como bónus de itens de Ataque/Defesa) NÃO contabiliza para o torneio. O sistema exige a criação real de estatísticas.
          </Typography>
        </Box>
      </Card>

    </Box>
  );
};

export default TorneioPoder;
