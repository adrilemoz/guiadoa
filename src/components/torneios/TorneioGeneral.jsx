import React, { useState } from 'react';
import { Box, Card, Grid, IconButton, MenuItem, Select, TextField, Typography } from '@mui/material';
import { dbTropas } from '../../db.js';
import { C } from '../../theme.js';


const TorneioGeneral = () => {
  const [poderGanho, setPoderGanho] = useState('');
  const [tropaPremio, setTropaPremio] = useState('');
  const [premios, setPremios] = useState({
    princ: { m: 10, b: 1000 }, meta1: { m: 2,  b: 1000 },
    meta2: { m: 5,  b: 1000 }, meta3: { m: 10, b: 1000 },
  });

  const handlePremioChange = (key, field, val) => setPremios(prev => ({ ...prev, [key]: { ...prev[key], [field]: val } }));
  
  const handlePoderChange = (value) => {
    const numericVal = value.replace(/\D/g, '');
    setPoderGanho(numericVal ? parseInt(numericVal, 10).toLocaleString('pt-BR') : '');
  };

  // Cálculos Base (1 Poder de General = 1 Ponto)
  const totalPontosTorneio = parseInt(poderGanho.replace(/\./g, '')) || 0;
  
  const tropaPremioObj = true ? dbTropas.find(t => t.nome === tropaPremio) : null;
  const poderUnitarioPremio = tropaPremioObj && tropaPremioObj.poder !== null ? tropaPremioObj.poder : 0;

  const meta1Pts = 50000; const meta2Pts = 150000; const meta3Pts = 500000;

  const totalTropasPremio = (premios.princ.m * premios.princ.b) + 
    (totalPontosTorneio >= meta1Pts ? premios.meta1.m * premios.meta1.b : 0) +
    (totalPontosTorneio >= meta2Pts ? premios.meta2.m * premios.meta2.b : 0) +
    (totalPontosTorneio >= meta3Pts ? premios.meta3.m * premios.meta3.b : 0);
  const totalPoderPremio = totalTropasPremio * poderUnitarioPremio;

  const formatNumber = (n) => n ? n.toLocaleString("pt-BR") : "0";
  const listaQtds = [10, 50, 100, 200, 300, 500, 1000, 2000, 5000, 10000];

  const RewardRow = ({ label, dataKey, reqPontos }) => {
    const disabled = totalPontosTorneio < reqPontos;
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1, p: 1, bgcolor: disabled ? 'transparent' : '#F2E6C9', border: '1px solid', borderColor: disabled ? 'rgba(166, 131, 77, 0.3)' : '#C8A96B', borderRadius: '6px' }}>
        <Typography sx={{ color: disabled ? 'text.secondary' : 'text.primary', fontSize: '0.75rem', fontWeight: 900, opacity: disabled ? 0.6 : 1 }}>{label}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, opacity: disabled ? 0.4 : 1 }}>
           <IconButton size="small" onClick={() => handlePremioChange(dataKey, 'm', Math.max(0, premios[dataKey].m - 1))} disabled={disabled} sx={{ bgcolor: '#E1CFA3', width: '24px', height: '24px', border: '1px solid #5a4010' }}><Typography sx={{ fontWeight: 'bold' }}>-</Typography></IconButton>
           <Typography sx={{ color: 'primary.main', width: '24px', textAlign: 'center', fontWeight: '900', fontSize: '0.9rem' }}>{premios[dataKey].m}</Typography>
           <IconButton size="small" onClick={() => handlePremioChange(dataKey, 'm', premios[dataKey].m + 1)} disabled={disabled} sx={{ bgcolor: '#E1CFA3', width: '24px', height: '24px', border: '1px solid #5a4010' }}><Typography sx={{ fontWeight: 'bold' }}>+</Typography></IconButton>
           <Select size="small" value={premios[dataKey].b} onChange={(e) => handlePremioChange(dataKey, 'b', e.target.value)} disabled={disabled} sx={{ height: '28px', bgcolor: '#E1CFA3', fontWeight: 'bold', fontSize: '0.8rem', border: '1px solid #5a4010' }}>
             {listaQtds.map(v => <MenuItem key={v} value={v} sx={{ fontWeight: 'bold' }}>{formatNumber(v)}</MenuItem>)}
           </Select>
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ textAlign: 'left', mt: 1 }}>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography sx={{ color: 'primary.main', fontWeight: 900, mb: 2, textTransform: 'uppercase', fontSize: '1.1rem', borderBottom: '2px solid #5a4010', pb: 1 }}>A. Aumento de Poder</Typography>
            <TextField fullWidth label="Poder de General Ganho" variant="outlined" type="tel" size="small" value={poderGanho} onChange={(e) => handlePoderChange(e.target.value)} inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} sx={{ mb: 3, bgcolor: '#E1CFA3', borderRadius: '4px', '& .MuiOutlinedInput-root': { fontWeight: '900', color: '#B8965A' } }} />
            <Box sx={{ p: 2, bgcolor: '#F2E6C9', borderRadius: '6px', borderBottom: '4px solid #c8940a', textAlign: 'center', boxShadow: 'inset 0 1px 3px rgba(62,47,28,0.06)' }}>
              <Typography sx={{ color: 'text.secondary', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase' }}>Pontuação Torneio</Typography>
              <Typography sx={{ color: 'primary.main', fontSize: '2.5rem', fontWeight: 900 }}>{formatNumber(totalPontosTorneio)}</Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography sx={{ color: 'primary.main', fontWeight: 900, mb: 1, textTransform: 'uppercase', fontSize: '1.1rem', borderBottom: '2px solid #5a4010', pb: 1 }}>B. Recompensas</Typography>
            <TextField select fullWidth label="Tropa de Prémio" variant="outlined" size="small" value={tropaPremio} onChange={(e) => setTropaPremio(e.target.value)} sx={{ mb: 2, mt: 1, bgcolor: '#F2E6C9', '& .MuiOutlinedInput-root': { fontWeight: 'bold', color: 'primary.main' } }}>
              {[...dbTropas].sort((a,b) => a.nome.localeCompare(b.nome)).map(t => <MenuItem key={t.nome} value={t.nome} sx={{fontWeight: 'bold'}}>{t.nome} (P: {formatNumber(t.poder)})</MenuItem>)}
            </TextField>
            <RewardRow label="Principal" dataKey="princ" reqPontos={0} />
            <RewardRow label={`Meta ${formatNumber(meta1Pts)}`} dataKey="meta1" reqPontos={meta1Pts} />
            <RewardRow label={`Meta ${formatNumber(meta2Pts)}`} dataKey="meta2" reqPontos={meta2Pts} />
            <RewardRow label={`Meta ${formatNumber(meta3Pts)}`} dataKey="meta3" reqPontos={meta3Pts} />
            <Box sx={{ display: 'flex', gap: 1.5, mt: 2 }}>
              <Box sx={{ flex: 1, p: 1, bgcolor: '#F2E6C9', borderRadius: '4px', textAlign: 'center' }}><Typography sx={{ fontSize: '0.80rem', fontWeight: 900 }}>Tropas: {formatNumber(totalTropasPremio)}</Typography></Box>
              <Box sx={{ flex: 1, p: 1, bgcolor: '#B8965A', color: C.TEXT_PRIMARY, borderRadius: '4px', textAlign: 'center' }}><Typography sx={{ fontSize: '0.80rem', fontWeight: 900 }}>Bónus Pts: {formatNumber(totalPoderPremio)}</Typography></Box>
            </Box>
          </Card>
        </Grid>
      </Grid>
      <Card sx={{ p: 3, borderLeft: '6px solid #eab308' }}>
        <Typography sx={{ color: 'text.primary', fontWeight: 900, fontSize: '1rem', mb: 1 }}>🎖️ Como dominar o Aprimoramento de General</Typography>
        <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem', fontWeight: 'bold' }}>
          O poder do General provém de <b>Níveis de Experiência (XP)</b>, <b>Equipamentos (Forja)</b> e <b>Habilidades passivas</b>. A estratégia de ouro é guardar todos os manuais de XP e materiais de forja obtidos em monstros e eventos ao longo da semana, para usar tudo de uma vez quando o torneio estiver ativo. 
        </Typography>
      </Card>
    </Box>
  );
};

export default TorneioGeneral;
