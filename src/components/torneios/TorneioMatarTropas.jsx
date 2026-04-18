import React, { useState } from 'react';
import { Box, Button, Card, Divider, Grid, IconButton, MenuItem, Select, TextField, Typography } from '@mui/material';
import { dbTropas } from '../../db.js';
import { C } from '../../theme.js';


const TorneioMatarTropas = () => {
  // A. Simulador de Inimigos Abatidos
  const [abates, setAbates] = useState([
    { id: 1, tropa: '', qtd: '' }
  ]);

  // B. Estado da Tropa de Recompensa
  const [tropaPremio, setTropaPremio] = useState('');

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

  const handleAbateTropa = (id, value) => {
    setAbates(abates.map(t => t.id === id ? { ...t, tropa: value } : t));
  };

  const handleAbateQtd = (id, value) => {
    const numericVal = value.replace(/\D/g, '');
    const formattedVal = numericVal ? parseInt(numericVal, 10).toLocaleString('pt-BR') : '';
    setAbates(abates.map(t => t.id === id ? { ...t, qtd: formattedVal } : t));
  };

  const adicionarLinha = () => {
    setAbates([...abates, { id: Date.now(), tropa: '', qtd: '' }]);
  };

  const removerLinha = (id) => {
    if (abates.length > 1) setAbates(abates.filter(t => t.id !== id));
  };

  const formatNumber = (n) => n === null || n === undefined ? "0" : n.toLocaleString("pt-BR");

  // --- 1. CÁLCULOS DE PONTOS (ABATES) ---
  let totalPontosTorneio = 0;
  let inimigosMortos = 0;

  abates.forEach(t => {
    const tObj = true ? dbTropas.find(x => x.nome === t.tropa) : null;
    const pUnitario = tObj && tObj.poder !== null ? tObj.poder : 1; // Assume poder 1 se não encontrar
    const qtd = parseInt(t.qtd.replace(/\./g, '')) || 0;
    
    // Nova Fórmula Exata: Quantidade de Tropas Mortas x Poder da Tropa Inimiga
    const pontosDestaLinha = qtd * pUnitario;
    
    totalPontosTorneio += pontosDestaLinha;
    inimigosMortos += qtd;
  });

  // --- 2. CÁLCULOS DAS RECOMPENSAS ---
  const tropaPremioObj = true ? dbTropas.find(t => t.nome === tropaPremio) : null;
  const poderUnitarioPremio = tropaPremioObj && tropaPremioObj.poder !== null ? tropaPremioObj.poder : 0;

  // Metas do Torneio (Valores equilibrados sugeridos)
  const meta1Pts = 10000;
  const meta2Pts = 50000;
  const meta3Pts = 200000;

  const totalPrinc = premios.princ.m * premios.princ.b;
  const totalM1 = totalPontosTorneio >= meta1Pts ? premios.meta1.m * premios.meta1.b : 0;
  const totalM2 = totalPontosTorneio >= meta2Pts ? premios.meta2.m * premios.meta2.b : 0;
  const totalM3 = totalPontosTorneio >= meta3Pts ? premios.meta3.m * premios.meta3.b : 0;

  const totalTropasPremio = totalPrinc + totalM1 + totalM2 + totalM3;
  const totalPoderPremio = totalTropasPremio * poderUnitarioPremio;

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
        
        {/* === CARTÃO A: SIMULADOR DE ABATES === */}
        <Grid item xs={12} md={7}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #5a4010', pb: 1, mb: 2 }}>
              <Typography sx={{ color: 'error.main', fontWeight: 900, textTransform: 'uppercase', fontSize: '1.1rem' }}>
                A. Simulador de Abates
              </Typography>
              <Button 
                variant="contained" color="error" size="small" onClick={adicionarLinha}
                sx={{ border: '2px solid #c8a030', fontWeight: '900', px: 1.5, py: 0.5, fontSize: '0.7rem' }}
              >
                + Inimigo
              </Button>
            </Box>

            <Typography sx={{ color: 'text.secondary', fontSize: '0.8rem', mb: 3, fontWeight: 'bold' }}>
              Insira o tipo e a quantidade de tropas inimigas derrotadas. Os pontos gerados são iguais ao poder base de cada tropa abatida.
            </Typography>

            {abates.map((linha) => {
              const tObj = true ? dbTropas.find(x => x.nome === linha.tropa) : null;
              const pUnitario = tObj ? tObj.poder : 1;
              const linhaQtdFormatada = parseInt(linha.qtd.replace(/\./g, '')) || 0;
              const subtotalPts = linhaQtdFormatada * pUnitario;

              return (
                <Box key={linha.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, p: 1, bgcolor: '#E1CFA3', borderRadius: '6px', border: '1px solid #5a4010', boxShadow: 'inset 0 1px 2px rgba(62,47,28,0.05)' }}>
                  
                  {/* Tropa Inimiga com Informação de Poder no Dropdown */}
                  <TextField 
                    select label="Tropa Inimiga" variant="outlined" size="small"
                    value={linha.tropa} onChange={(e) => handleAbateTropa(linha.id, e.target.value)}
                    sx={{ flex: 1.2, bgcolor: '#E1CFA3', borderRadius: '4px', '& .MuiOutlinedInput-root': { fontWeight: 'bold', color: 'error.main' } }}
                  >
                    {[...dbTropas].sort((a, b) => a.nome.localeCompare(b.nome)).map((tropa) => (
                      <MenuItem key={tropa.nome} value={tropa.nome} sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                        {tropa.nome} (Poder: {formatNumber(tropa.poder)})
                      </MenuItem>
                    ))}
                  </TextField>

                  {/* Quantidade (Agora abre o teclado numérico no telemóvel!) */}
                  <TextField 
                    label="Abates" variant="outlined" type="tel" size="small"
                    value={linha.qtd} onChange={(e) => handleAbateQtd(linha.id, e.target.value)}
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                    sx={{ flex: 1.3, bgcolor: '#E1CFA3', borderRadius: '4px', '& .MuiOutlinedInput-root': { fontWeight: '900', color: '#e05030' } }}
                  />

                  <Box sx={{ flex: 0.9, textAlign: 'right', px: 0.5, overflow: 'hidden' }}>
                    <Typography sx={{ color: 'text.secondary', fontSize: '0.6rem', fontWeight: 900, textTransform: 'uppercase' }}>Pts</Typography>
                    <Typography sx={{ color: 'primary.main', fontWeight: 900, fontSize: '1rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                      {formatNumber(subtotalPts)}
                    </Typography>
                  </Box>

                  <IconButton onClick={() => removerLinha(linha.id)} disabled={abates.length === 1} sx={{ p: 0.5, color: abates.length === 1 ? 'rgba(0,0,0,0.1)' : 'error.main' }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '1.4rem', lineHeight: 1 }}>×</Typography>
                  </IconButton>
                </Box>
              );
            })}

            {/* Resultado do Poder/Pontos */}
            <Box sx={{ mt: 3, p: 1.5, bgcolor: '#F2E6C9', borderRadius: '6px', border: '1px solid #5a4010', borderBottom: '4px solid #A83C2C', textAlign: 'center', boxShadow: 'inset 0 1px 3px rgba(62,47,28,0.06)' }}>
              <Typography sx={{ color: 'text.secondary', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase' }}>Pontuação Total do Evento</Typography>
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
                <Typography sx={{ color: 'text.secondary', fontSize: '0.80rem', fontWeight: 900, textTransform: 'uppercase' }}>Tropas Ganhas</Typography>
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

      {/* === CARTÃO C: ALERTAS E REGRAS DE GUERRA === */}
      <Typography sx={{ color: 'error.main', fontWeight: 900, mb: 1.5, fontSize: '1.2rem', textShadow: '1px 1px 1px rgba(255,255,255,0.5)' }}>
        Estratégia e Alertas Táticos
      </Typography>
      
      <Grid container spacing={2} sx={{ mb: 4 }}>
        
        {/* Alerta de Hospital */}
        <Grid item xs={12} sm={6}>
          <Card sx={{ p: 2, height: '100%', borderLeft: '6px solid #eab308', bgcolor: '#E1CFA3' }}>
            <Typography sx={{ color: 'text.primary', fontWeight: 900, fontSize: '0.95rem', mb: 0.5, textTransform: 'uppercase' }}>
              🏥 Atenção ao Limite do Hospital
            </Typography>
            <Typography sx={{ color: 'text.secondary', fontSize: '0.8rem', fontWeight: 'bold' }}>
              Enquanto o seu Hospital tiver espaço, as suas tropas feridas podem ser recuperadas. <b>Quando o hospital encher, qualquer tropa extra que caia em combate MORRE PERMANENTEMENTE.</b> Verifique a capacidade do seu hospital antes de lançar ataques pesados!
            </Typography>
          </Card>
        </Grid>
        
        {/* Alerta de Poder Total */}
        <Grid item xs={12} sm={6}>
          <Card sx={{ p: 2, height: '100%', borderLeft: '6px solid #e05030', bgcolor: '#E1CFA3' }}>
            <Typography sx={{ color: 'error.main', fontWeight: 900, fontSize: '0.95rem', mb: 0.5, textTransform: 'uppercase' }}>
              📉 Risco de Queda de Poder
            </Typography>
            <Typography sx={{ color: 'text.secondary', fontSize: '0.8rem', fontWeight: 'bold' }}>
              Qualquer tropa perdida definitivamente em combate (fora do hospital) será <b>descontada diretamente do seu Poder Total da conta</b>. Um torneio agressivo mal calculado pode destruir semanas de evolução e progresso. Lute com estratégia!
            </Typography>
          </Card>
        </Grid>

        {/* Dica de Tropas a Usar */}
        <Grid item xs={12}>
          <Card sx={{ p: 2, borderLeft: '6px solid #c8940a' }}>
            <Typography sx={{ color: 'primary.main', fontWeight: 900, fontSize: '0.95rem', mb: 0.5, textTransform: 'uppercase' }}>
              🛡️ Dica de Ouro: Tropas Recuperáveis
            </Typography>
            <Typography sx={{ color: 'text.primary', fontSize: '0.85rem', fontWeight: 'bold' }}>
              Para minimizar os danos permanentes, utilize táticas de "hit and run" (bater e correr) e certifique-se de que envia para a linha da frente tropas que <b>tem os recursos necessários para curar</b> na enfermaria. Não exponha as suas tropas de elite se não tiver como as recuperar financeiramente!
            </Typography>
          </Card>
        </Grid>

      </Grid>

    </Box>
  );
};

export default TorneioMatarTropas;
