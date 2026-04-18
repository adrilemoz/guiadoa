import React, { useState } from 'react';
import { Box, Card, Chip, Divider, Grid, IconButton, MenuItem, Select, TextField, Typography } from '@mui/material';
import { dbTropas } from '../../db.js';
import { C } from '../../theme.js';


const PontosTalisma = () => {
  // A. Estados das quantidades
  const [qtdVerde, setQtdVerde] = useState('');
  const [qtdAzul, setQtdAzul] = useState('');
  const [qtdRoxo, setQtdRoxo] = useState('');
  const [qtdLaranja, setQtdLaranja] = useState('');

  // B. Estado da Tropa
  const [tropaSelecionada, setTropaSelecionada] = useState('');

  // C. Estados das Recompensas
  const [premios, setPremios] = useState({
    princ: { m: 10, b: 1000 },
    meta1: { m: 2,  b: 1000 },
    meta2: { m: 5,  b: 1000 },
    meta3: { m: 10, b: 1000 },
  });

  const handlePremioChange = (key, field, val) => {
    setPremios(prev => ({ ...prev, [key]: { ...prev[key], [field]: val } }));
  };

  // Cálculos de Pontos
  const ptsVerde = (parseInt(qtdVerde) || 0) * 20;
  const ptsAzul = (parseInt(qtdAzul) || 0) * 30;
  const ptsRoxo = (parseInt(qtdRoxo) || 0) * 800;
  const ptsLaranja = (parseInt(qtdLaranja) || 0) * 12000;
  const totalPontos = ptsVerde + ptsAzul + ptsRoxo + ptsLaranja;

  // Extrair o poder
  const tropaObj = true ? dbTropas.find(t => t.nome === tropaSelecionada) : null;
  const poderUnitario = tropaObj && tropaObj.poder !== null ? tropaObj.poder : 0;

  const meta1Pts = 100;
  const meta2Pts = 200;
  const meta3Pts = 400;

  // Soma de Recompensas
  const totalPrinc = premios.princ.m * premios.princ.b;
  const totalM1 = totalPontos >= meta1Pts ? premios.meta1.m * premios.meta1.b : 0;
  const totalM2 = totalPontos >= meta2Pts ? premios.meta2.m * premios.meta2.b : 0;
  const totalM3 = totalPontos >= meta3Pts ? premios.meta3.m * premios.meta3.b : 0;

  const totalTropas = totalPrinc + totalM1 + totalM2 + totalM3;
  const totalPoder = totalTropas * poderUnitario;

  const formatNumber = (n) => n === null || n === undefined ? "—" : n.toLocaleString("pt-BR");

  const listaQtds = [10, 50, 100, 200, 300, 500, 1000, 2000, 5000, 10000];

  // Componente Reutilizável: Linha de Prémio (Estilo Jogo)
  const RewardRow = ({ label, dataKey, reqPontos }) => {
    const disabled = totalPontos < reqPontos;
    return (
      <Box sx={{ 
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1, p: 1, 
        bgcolor: disabled ? 'transparent' : '#F2E6C9', 
        border: '1px solid', borderColor: disabled ? 'rgba(166, 131, 77, 0.3)' : '#C8A96B', 
        borderRadius: '6px', transition: 'all 0.3s',
        boxShadow: disabled ? 'none' : 'inset 0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <Typography sx={{ color: disabled ? 'text.secondary' : 'text.primary', fontSize: '0.85rem', fontWeight: 900, opacity: disabled ? 0.6 : 1 }}>
          {label}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, opacity: disabled ? 0.4 : 1 }}>
           <IconButton size="small" onClick={() => handlePremioChange(dataKey, 'm', Math.max(0, premios[dataKey].m - 1))} disabled={disabled} sx={{ bgcolor: '#E1CFA3', width: '26px', height: '26px', borderRadius: '4px', border: '1px solid #5a4010' }}>
             <Typography sx={{ color: 'text.primary', fontSize: '1.2rem', lineHeight: 1, fontWeight: 'bold' }}>-</Typography>
           </IconButton>
           
           <Typography sx={{ color: 'primary.main', width: '28px', textAlign: 'center', fontWeight: '900', fontSize: '1rem' }}>
             {premios[dataKey].m}
           </Typography>
           
           <IconButton size="small" onClick={() => handlePremioChange(dataKey, 'm', premios[dataKey].m + 1)} disabled={disabled} sx={{ bgcolor: '#E1CFA3', width: '26px', height: '26px', borderRadius: '4px', border: '1px solid #5a4010' }}>
             <Typography sx={{ color: 'text.primary', fontSize: '1.2rem', lineHeight: 1, fontWeight: 'bold' }}>+</Typography>
           </IconButton>
           
           <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem', mx: 0.5, fontWeight: 'bold' }}>x</Typography>
           
           <Select
             size="small"
             value={premios[dataKey].b}
             onChange={(e) => handlePremioChange(dataKey, 'b', e.target.value)}
             disabled={disabled}
             sx={{ height: '30px', bgcolor: '#E1CFA3', color: 'text.primary', fontWeight: 'bold', fontSize: '0.85rem', border: '1px solid #5a4010', '& .MuiOutlinedInput-notchedOutline': { border: 'none' } }}
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
        
        {/* === CARTÃO A: INPUT DE TALISMÃS === */}
        <Grid item xs={12} md={5}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography sx={{ color: 'primary.main', fontWeight: 900, mb: 1, textTransform: 'uppercase', fontSize: '1.1rem', borderBottom: '2px solid #5a4010', pb: 1 }}>
              A. Cálculo de Talismãs
            </Typography>
            <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem', mb: 2, mt: 1, fontWeight: 'bold' }}>
              Insira a quantidade de cada Talismã para calcular os pontos.
            </Typography>

            <Grid container spacing={1.5} sx={{ mb: 3 }}>
              {/* Verde */}
              <Grid item xs={6}>
                <TextField fullWidth label="Verdes (20 pts)" variant="outlined" type="number" size="small" value={qtdVerde} onChange={(e) => setQtdVerde(e.target.value)} 
                  sx={{ bgcolor: '#F2E6C9', borderRadius: '4px', '& .MuiOutlinedInput-root': { fontWeight: 'bold', color: '#3A6A3C' }, '& .MuiInputLabel-root': { color: '#3A6A3C', fontWeight: 'bold' } }} />
              </Grid>
              {/* Azul */}
              <Grid item xs={6}>
                <TextField fullWidth label="Azuis (30 pts)" variant="outlined" type="number" size="small" value={qtdAzul} onChange={(e) => setQtdAzul(e.target.value)} 
                  sx={{ bgcolor: '#F2E6C9', borderRadius: '4px', '& .MuiOutlinedInput-root': { fontWeight: 'bold', color: C.DEFENSE }, '& .MuiInputLabel-root': { color: C.DEFENSE, fontWeight: 'bold' } }} />
              </Grid>
              {/* Roxo */}
              <Grid item xs={6}>
                <TextField fullWidth label="Roxos (800 pts)" variant="outlined" type="number" size="small" value={qtdRoxo} onChange={(e) => setQtdRoxo(e.target.value)} 
                  sx={{ bgcolor: '#F2E6C9', borderRadius: '4px', '& .MuiOutlinedInput-root': { fontWeight: 'bold', color: C.POWER }, '& .MuiInputLabel-root': { color: C.POWER, fontWeight: 'bold' } }} />
              </Grid>
              {/* Laranja */}
              <Grid item xs={6}>
                <TextField fullWidth label="Laranjas (12k pts)" variant="outlined" type="number" size="small" value={qtdLaranja} onChange={(e) => setQtdLaranja(e.target.value)} 
                  sx={{ bgcolor: '#F2E6C9', borderRadius: '4px', '& .MuiOutlinedInput-root': { fontWeight: 'bold', color: C.ATTACK }, '& .MuiInputLabel-root': { color: C.ATTACK, fontWeight: 'bold' } }} />
              </Grid>
            </Grid>

            {/* Resultado de Pontos */}
            <Box sx={{ p: 1.5, bgcolor: '#F2E6C9', borderRadius: '6px', border: '1px solid #5a4010', borderBottom: '4px solid #c8940a', textAlign: 'center', boxShadow: 'inset 0 1px 3px rgba(62,47,28,0.06)' }}>
              <Typography sx={{ color: 'text.secondary', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase' }}>Pontuação Total</Typography>
              <Typography sx={{ color: 'primary.main', fontSize: '2.5rem', fontWeight: 900, lineHeight: 1 }}>{formatNumber(totalPontos)}</Typography>
            </Box>
          </Card>
        </Grid>

        {/* === CARTÃO B: TROPAS E PODER === */}
        <Grid item xs={12} md={7}>
          <Card sx={{ p: 3, height: '100%' }}>
            
            <Typography sx={{ color: 'primary.main', fontWeight: 900, mb: 1, textTransform: 'uppercase', fontSize: '1.1rem', borderBottom: '2px solid #5a4010', pb: 1 }}>
              B. Tropas e Poder Ganhos
            </Typography>
            
            <Box sx={{ mb: 3, mt: 2 }}>
              <TextField 
                select fullWidth label="1º Selecione a Tropa do Prêmio" variant="outlined" size="small"
                value={tropaSelecionada} onChange={(e) => setTropaSelecionada(e.target.value)}
                sx={{ bgcolor: '#F2E6C9', borderRadius: '4px', '& .MuiOutlinedInput-root': { fontWeight: 'bold', color: 'primary.main' }, '& .MuiInputLabel-root': { color: 'primary.main', fontWeight: 'bold' } }}
              >
                {[...dbTropas].sort((a, b) => a.nome.localeCompare(b.nome)).map((tropa) => (
                  <MenuItem key={tropa.nome} value={tropa.nome} sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                    {tropa.nome} (Poder: {formatNumber(tropa.poder)})
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <Typography sx={{ color: 'text.secondary', fontSize: '0.8rem', fontWeight: 900, mb: 1, ml: 1 }}>2º CONFIGURE OS PRÊMIOS</Typography>
            
            <RewardRow label="Principal (Sem meta)" dataKey="princ" reqPontos={0} />
            <RewardRow label={`Bônus (${formatNumber(meta1Pts)} pts)`} dataKey="meta1" reqPontos={meta1Pts} />
            <RewardRow label={`Bônus (${formatNumber(meta2Pts)} pts)`} dataKey="meta2" reqPontos={meta2Pts} />
            <RewardRow label={`Bônus (${formatNumber(meta3Pts)} pts)`} dataKey="meta3" reqPontos={meta3Pts} />

            <Divider sx={{ borderColor: 'rgba(166, 131, 77, 0.4)', my: 2 }} />

            {/* Resultados Finais */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ flex: 1, p: 1.5, bgcolor: '#F2E6C9', borderRadius: '6px', border: '1px solid #5a4010', textAlign: 'center', boxShadow: 'inset 0 1px 3px rgba(62,47,28,0.06)' }}>
                <Typography sx={{ color: 'text.secondary', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase' }}>Total de Tropas</Typography>
                <Typography sx={{ color: 'text.primary', fontSize: '1.6rem', fontWeight: 900 }}>{formatNumber(totalTropas)}</Typography>
              </Box>
              <Box sx={{ flex: 1, p: 1.5, bgcolor: '#B8965A', borderRadius: '6px', border: '2px solid #3a2808', textAlign: 'center', boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.2)' }}>
                <Typography sx={{ color: 'primary.contrastText', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase' }}>Poder Gerado</Typography>
                <Typography sx={{ color: C.TEXT_PRIMARY, fontSize: '1.6rem', fontWeight: 900, textShadow: '1px 1px 2px rgba(62,47,28,0.2)' }}>{formatNumber(totalPoder)}</Typography>
              </Box>
            </Box>
          </Card>
        </Grid>

      </Grid>

      {/* === CARTÃO C: REGRAS DO TORNEIO === */}
      <Typography sx={{ color: 'primary.main', fontWeight: 900, mb: 1.5, fontSize: '1.2rem', textShadow: '1px 1px 1px rgba(255,255,255,0.5)' }}>
        Regras do Torneio
      </Typography>
      <Card sx={{ p: 3, mb: 4, borderLeft: '6px solid #eab308' }}>
        <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem', mb: 3, fontWeight: 'bold' }}>
          O objetivo é obter Talismãs para ganhar pontos e subir de nível no ranking. A pontuação é dividida pela raridade do item:
        </Typography>
        
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} sm={3}><Chip label="Laranja: 12.000 pts" sx={{ bgcolor: '#ffedd5', color: C.ATTACK, fontWeight: 'bold', width: '100%', borderRadius: '6px', border: '1px solid #fdba74' }} /></Grid>
          <Grid item xs={6} sm={3}><Chip label="Roxo: 800 pts" sx={{ bgcolor: '#f3e8ff', color: C.POWER, fontWeight: 'bold', width: '100%', borderRadius: '6px', border: '1px solid #d8b4fe' }} /></Grid>
          <Grid item xs={6} sm={3}><Chip label="Azul: 30 pts" sx={{ bgcolor: '#dbeafe', color: C.DEFENSE, fontWeight: 'bold', width: '100%', borderRadius: '6px', border: '1px solid #93c5fd' }} /></Grid>
          <Grid item xs={6} sm={3}><Chip label="Verde: 20 pts" sx={{ bgcolor: '#dcfce7', color: '#15803d', fontWeight: 'bold', width: '100%', borderRadius: '6px', border: '1px solid #86efac' }} /></Grid>
        </Grid>

        <Box sx={{ p: 1.5, bgcolor: '#F2E6C9', borderRadius: '6px', border: '1px solid #5a4010' }}>
          <Typography sx={{ color: 'error.main', fontWeight: 900, fontSize: '0.8rem', textTransform: 'uppercase', mb: 0.5 }}>Critério de Desempate</Typography>
          <Typography sx={{ color: 'text.primary', fontSize: '0.8rem', fontWeight: 'bold' }}>
            Jogadores com a mesma pontuação serão classificados de acordo com a ordem em que os pontos foram conquistados.
          </Typography>
        </Box>
      </Card>

    </Box>
  );
};

export default PontosTalisma;
