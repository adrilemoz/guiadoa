import React, { useState } from 'react';
import { Box, Card, Chip, Divider, Grid, IconButton, MenuItem, Select, TextField, Typography } from '@mui/material';
import { dbTropas } from '../../db.js';
import { C } from '../../theme.js';


const TreinamentoDoDragao = () => {
  // A. Estados das quantidades de alimento
  const [qtdCarneiro, setQtdCarneiro] = useState('');
  const [qtdBoi, setQtdBoi] = useState('');
  const [qtdFrango, setQtdFrango] = useState('');
  const [qtdVeado, setQtdVeado] = useState('');
  const [qtdSalmao, setQtdSalmao] = useState('');
  const [qtdLagosta, setQtdLagosta] = useState('');

  // B. Estado da Tropa de Recompensa
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

  // --- Cálculos de Pontos (Poder do Dragão) ---
  const pCarneiro = (parseInt(qtdCarneiro) || 0) * 100;
  const pBoi = (parseInt(qtdBoi) || 0) * 200;
  const pFrango = (parseInt(qtdFrango) || 0) * 500;
  const pVeado = (parseInt(qtdVeado) || 0) * 1000;
  const pSalmao = (parseInt(qtdSalmao) || 0) * 2000;
  const pLagosta = (parseInt(qtdLagosta) || 0) * 5000;
  
  // No torneio do dragão, o poder ganho é igual à pontuação do torneio
  const totalPontos = pCarneiro + pBoi + pFrango + pVeado + pSalmao + pLagosta;

  // --- Cálculos das Recompensas ---
  const tropaObj = true ? dbTropas.find(t => t.nome === tropaSelecionada) : null;
  const poderUnitario = tropaObj && tropaObj.poder !== null ? tropaObj.poder : 0;

  // Metas do torneio (ajuste estes valores conforme as metas reais do seu jogo)
  const meta1Pts = 100000;
  const meta2Pts = 500000;
  const meta3Pts = 2000000;

  const totalPrinc = premios.princ.m * premios.princ.b;
  const totalM1 = totalPontos >= meta1Pts ? premios.meta1.m * premios.meta1.b : 0;
  const totalM2 = totalPontos >= meta2Pts ? premios.meta2.m * premios.meta2.b : 0;
  const totalM3 = totalPontos >= meta3Pts ? premios.meta3.m * premios.meta3.b : 0;

  const totalTropas = totalPrinc + totalM1 + totalM2 + totalM3;
  const totalPoderGerado = totalTropas * poderUnitario;

  const formatNumber = (n) => n === null || n === undefined ? "0" : n.toLocaleString("pt-BR");

  const listaQtds = [10, 50, 100, 200, 300, 500, 1000, 2000, 5000, 10000];

  // Componente Reutilizável: Linha de Prémio
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
        
        {/* === CARTÃO A: INPUT DE ALIMENTOS === */}
        <Grid item xs={12} md={5}>
          <Card sx={{ p: 3, height: '100%', border: '3px solid #5a4010', bgcolor: '#E1CFA3' }}>
            <Typography sx={{ color: 'primary.main', fontWeight: 900, mb: 1, textTransform: 'uppercase', fontSize: '1.1rem', borderBottom: '2px solid #5a4010', pb: 1 }}>
              🍖 Alimentação do Dragão
            </Typography>
            <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem', mb: 3, mt: 1, fontWeight: 'bold' }}>
              Insira o total de carnes acumuladas no seu inventário para calcular a pontuação.
            </Typography>

            <Grid container spacing={1.5} sx={{ mb: 3 }}>
              {/* Carneiro */}
              <Grid item xs={6}>
                <TextField fullWidth label="🐑 Carneiro (100)" variant="outlined" type="number" size="small" value={qtdCarneiro} onChange={(e) => setQtdCarneiro(e.target.value)} 
                  sx={{ bgcolor: '#f3f4f6', borderRadius: '4px', '& .MuiOutlinedInput-root': { fontWeight: '900', color: '#374151' }, '& .MuiInputLabel-root': { color: '#4b5563', fontWeight: 'bold' } }} />
              </Grid>
              {/* Boi */}
              <Grid item xs={6}>
                <TextField fullWidth label="🐂 Boi (200)" variant="outlined" type="number" size="small" value={qtdBoi} onChange={(e) => setQtdBoi(e.target.value)} 
                  sx={{ bgcolor: '#ffedd5', borderRadius: '4px', '& .MuiOutlinedInput-root': { fontWeight: '900', color: '#9a3412' }, '& .MuiInputLabel-root': { color: C.ATTACK, fontWeight: 'bold' } }} />
              </Grid>
              {/* Frango */}
              <Grid item xs={6}>
                <TextField fullWidth label="🍗 Frango (500)" variant="outlined" type="number" size="small" value={qtdFrango} onChange={(e) => setQtdFrango(e.target.value)} 
                  sx={{ bgcolor: '#fef3c7', borderRadius: '4px', '& .MuiOutlinedInput-root': { fontWeight: '900', color: '#B8965A' }, '& .MuiInputLabel-root': { color: '#d97706', fontWeight: 'bold' } }} />
              </Grid>
              {/* Veado */}
              <Grid item xs={6}>
                <TextField fullWidth label="🦌 Veado (1k)" variant="outlined" type="number" size="small" value={qtdVeado} onChange={(e) => setQtdVeado(e.target.value)} 
                  sx={{ bgcolor: '#dcfce7', borderRadius: '4px', '& .MuiOutlinedInput-root': { fontWeight: '900', color: '#15803d' }, '& .MuiInputLabel-root': { color: '#16a34a', fontWeight: 'bold' } }} />
              </Grid>
              {/* Salmão */}
              <Grid item xs={6}>
                <TextField fullWidth label="🐟 Salmão (2k)" variant="outlined" type="number" size="small" value={qtdSalmao} onChange={(e) => setQtdSalmao(e.target.value)} 
                  sx={{ bgcolor: '#dbeafe', borderRadius: '4px', '& .MuiOutlinedInput-root': { fontWeight: '900', color: C.DEFENSE }, '& .MuiInputLabel-root': { color: '#2563eb', fontWeight: 'bold' } }} />
              </Grid>
              {/* Lagosta */}
              <Grid item xs={6}>
                <TextField fullWidth label="🦞 Lagosta (5k)" variant="outlined" type="number" size="small" value={qtdLagosta} onChange={(e) => setQtdLagosta(e.target.value)} 
                  sx={{ bgcolor: '#fee2e2', borderRadius: '4px', '& .MuiOutlinedInput-root': { fontWeight: '900', color: '#b91c1c' }, '& .MuiInputLabel-root': { color: '#dc2626', fontWeight: 'bold' } }} />
              </Grid>
            </Grid>

            {/* Resultado de Pontos */}
            <Box sx={{ p: 1.5, bgcolor: '#F2E6C9', borderRadius: '6px', border: '1px solid #5a4010', borderBottom: '4px solid #c8940a', textAlign: 'center', boxShadow: 'inset 0 1px 3px rgba(62,47,28,0.06)' }}>
              <Typography sx={{ color: 'text.secondary', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase' }}>Pontuação do Torneio / Poder</Typography>
              <Typography sx={{ color: 'primary.main', fontSize: '2.5rem', fontWeight: 900, lineHeight: 1 }}>{formatNumber(totalPontos)}</Typography>
            </Box>
          </Card>
        </Grid>

        {/* === CARTÃO B: TROPAS E PODER GERADO (RECOMPENSAS) === */}
        <Grid item xs={12} md={7}>
          <Card sx={{ p: 3, height: '100%' }}>
            
            <Typography sx={{ color: 'primary.main', fontWeight: 900, mb: 1, textTransform: 'uppercase', fontSize: '1.1rem', borderBottom: '2px solid #5a4010', pb: 1 }}>
              B. Tropas e Bónus Ganhos
            </Typography>
            
            <Box sx={{ mb: 3, mt: 2 }}>
              <TextField 
                select fullWidth label="1º Selecione a Tropa do Prémio" variant="outlined" size="small"
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

            <Typography sx={{ color: 'text.secondary', fontSize: '0.8rem', fontWeight: 900, mb: 1, ml: 1 }}>2º CONFIGURE OS PRÉMIOS</Typography>
            
            <RewardRow label="Principal (Sem meta)" dataKey="princ" reqPontos={0} />
            <RewardRow label={`Bónus (${formatNumber(meta1Pts)} pts)`} dataKey="meta1" reqPontos={meta1Pts} />
            <RewardRow label={`Bónus (${formatNumber(meta2Pts)} pts)`} dataKey="meta2" reqPontos={meta2Pts} />
            <RewardRow label={`Bónus (${formatNumber(meta3Pts)} pts)`} dataKey="meta3" reqPontos={meta3Pts} />

            <Divider sx={{ borderColor: 'rgba(166, 131, 77, 0.4)', my: 2 }} />

            {/* Resultados Finais das Recompensas */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ flex: 1, p: 1.5, bgcolor: '#F2E6C9', borderRadius: '6px', border: '1px solid #5a4010', textAlign: 'center', boxShadow: 'inset 0 1px 3px rgba(62,47,28,0.06)' }}>
                <Typography sx={{ color: 'text.secondary', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase' }}>Total de Tropas</Typography>
                <Typography sx={{ color: 'text.primary', fontSize: '1.6rem', fontWeight: 900 }}>{formatNumber(totalTropas)}</Typography>
              </Box>
              <Box sx={{ flex: 1, p: 1.5, bgcolor: '#B8965A', borderRadius: '6px', border: '2px solid #3a2808', textAlign: 'center', boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.2)' }}>
                <Typography sx={{ color: 'primary.contrastText', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase' }}>Poder Bónus</Typography>
                <Typography sx={{ color: C.TEXT_PRIMARY, fontSize: '1.6rem', fontWeight: 900, textShadow: '1px 1px 2px rgba(62,47,28,0.2)' }}>{formatNumber(totalPoderGerado)}</Typography>
              </Box>
            </Box>
          </Card>
        </Grid>

      </Grid>

      {/* === CARTÃO C: REGRAS E ESTRATÉGIA === */}
      <Typography sx={{ color: 'primary.main', fontWeight: 900, mb: 1.5, fontSize: '1.2rem', textShadow: '1px 1px 1px rgba(255,255,255,0.5)' }}>
        Estratégia de Caça
      </Typography>
      <Card sx={{ p: 3, mb: 4, borderLeft: '6px solid #A83C2C', bgcolor: '#E1CFA3' }}>
        <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem', mb: 3, fontWeight: 'bold' }}>
          Alimentar o seu Dragão é fundamental para dominar o reino. Aqui está a pontuação gerada por cada item:
        </Typography>
        
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} sm={4} md={2}><Chip label="🦞 Lagosta: 5k" sx={{ bgcolor: '#fee2e2', color: '#b91c1c', fontWeight: 'bold', width: '100%', borderRadius: '6px', border: '1px solid #fca5a5' }} /></Grid>
          <Grid item xs={6} sm={4} md={2}><Chip label="🐟 Salmão: 2k" sx={{ bgcolor: '#dbeafe', color: C.DEFENSE, fontWeight: 'bold', width: '100%', borderRadius: '6px', border: '1px solid #93c5fd' }} /></Grid>
          <Grid item xs={6} sm={4} md={2}><Chip label="🦌 Veado: 1k" sx={{ bgcolor: '#dcfce7', color: '#15803d', fontWeight: 'bold', width: '100%', borderRadius: '6px', border: '1px solid #86efac' }} /></Grid>
          <Grid item xs={6} sm={4} md={2}><Chip label="🍗 Frango: 500" sx={{ bgcolor: '#fef3c7', color: '#B8965A', fontWeight: 'bold', width: '100%', borderRadius: '6px', border: '1px solid #fcd34d' }} /></Grid>
          <Grid item xs={6} sm={4} md={2}><Chip label="🐂 Boi: 200" sx={{ bgcolor: '#ffedd5', color: '#9a3412', fontWeight: 'bold', width: '100%', borderRadius: '6px', border: '1px solid #fdba74' }} /></Grid>
          <Grid item xs={6} sm={4} md={2}><Chip label="🐑 Carneiro: 100" sx={{ bgcolor: '#f3f4f6', color: '#374151', fontWeight: 'bold', width: '100%', borderRadius: '6px', border: '1px solid #d1d5db' }} /></Grid>
        </Grid>

        <Divider sx={{ borderColor: 'rgba(166, 131, 77, 0.4)', my: 2 }} />

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ flex: '1 1 300px', p: 1.5, bgcolor: '#F2E6C9', borderRadius: '6px', border: '1px solid #5a4010' }}>
            <Typography sx={{ color: '#e05030', fontWeight: 900, fontSize: '0.8rem', textTransform: 'uppercase', mb: 0.5 }}>📍 Onde Encontrar</Typography>
            <Typography sx={{ color: 'text.primary', fontSize: '0.8rem', fontWeight: 'bold' }}>
              Pode caçar estas recompensas participando ativamente nas <b>Savanas</b>, completando <b>Torneios</b> semanais e explorando o covil do <b>Dragão Voador</b>.
            </Typography>
          </Box>
          <Box sx={{ flex: '1 1 300px', p: 1.5, bgcolor: '#EAF5EA', borderRadius: '6px', border: '1px solid #5A8A5C' }}>
            <Typography sx={{ color: '#3A6A3C', fontWeight: 900, fontSize: '0.8rem', textTransform: 'uppercase', mb: 0.5 }}>⚠️ Acumulação Estratégica</Typography>
            <Typography sx={{ color: 'text.primary', fontSize: '0.8rem', fontWeight: 'bold' }}>
              Guarde os seus alimentos na mochila! Alimente o dragão durante os eventos de Habilidade e Poder para maximizar as recompensas (Bónus) do torneio.
            </Typography>
          </Box>
        </Box>
      </Card>

    </Box>
  );
};

export default TreinamentoDoDragao;
