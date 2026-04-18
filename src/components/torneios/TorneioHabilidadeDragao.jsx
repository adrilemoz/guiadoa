import React, { useEffect, useState } from 'react';
import { Box, Card, Divider, Grid, IconButton, InputAdornment, MenuItem, TextField, Typography } from '@mui/material';
import { dbTropas } from '../../db.js';
import { C } from '../../theme.js';


const TorneioHabilidadeDragao = () => {
  // ==========================================
  // 1. ESTADOS COM AUTO-SAVE (LOCAL STORAGE)
  // ==========================================
  const [qtdEssencia, setQtdEssencia] = useState(() => localStorage.getItem('doa_dragao_essencias') || '');
  const [tropaPremio, setTropaPremio] = useState(() => localStorage.getItem('doa_dragao_tropa') || '');
  
  const defaultPremios = {
    princ: { m: 10, b: 1000 },
    meta1: { m: 2,  b: 1000 },
    meta2: { m: 5,  b: 1000 },
    meta3: { m: 10, b: 1000 },
  };
  const [premios, setPremios] = useState(() => {
    const saved = localStorage.getItem('doa_dragao_premios');
    return saved ? JSON.parse(saved) : defaultPremios;
  });

  useEffect(() => { localStorage.setItem('doa_dragao_essencias', qtdEssencia); }, [qtdEssencia]);
  useEffect(() => { localStorage.setItem('doa_dragao_tropa', tropaPremio); }, [tropaPremio]);
  useEffect(() => { localStorage.setItem('doa_dragao_premios', JSON.stringify(premios)); }, [premios]);

  // ==========================================
  // 2. LÓGICA E CÁLCULOS
  // ==========================================
  const handlePremioChange = (key, field, val) => {
    setPremios(prev => ({ ...prev, [key]: { ...prev[key], [field]: val } }));
  };

  const handleEssenciaChange = (value) => {
    const numericVal = value.replace(/\D/g, '');
    const formattedVal = numericVal ? parseInt(numericVal, 10).toLocaleString('pt-BR') : '';
    setQtdEssencia(formattedVal);
  };

  const essenciasReais = parseInt(qtdEssencia.replace(/\./g, '')) || 0;
  const totalPontos = essenciasReais * 100;

  const tropaPremioObj = true ? dbTropas.find(t => t.nome === tropaPremio) : null;
  const poderUnitarioPremio = tropaPremioObj && tropaPremioObj.poder !== null ? tropaPremioObj.poder : 0;

  const meta1Pts = 10;
  const meta2Pts = 50;
  const meta3Pts = 100;

  const totalPrinc = premios.princ.m * premios.princ.b;
  const totalM1 = premios.meta1.m * premios.meta1.b;
  const totalM2 = premios.meta2.m * premios.meta2.b;
  const totalM3 = premios.meta3.m * premios.meta3.b;

  const totalTropasPremio = totalPrinc + totalM1 + totalM2 + totalM3;
  const totalPoderPremio = totalTropasPremio * poderUnitarioPremio;

  const formatNumber = (n) => n === null || n === undefined ? "0" : n.toLocaleString("pt-BR");

  // COMPONENTE DA LINHA DE PRÉMIO
  const RewardRow = ({ label, dataKey }) => {
    const currentM = premios[dataKey].m;
    const currentB = premios[dataKey].b;
    const rowTotal = currentM * currentB;

    // Controlos do Multiplicador (+-)
    const handleMMinus = () => {
      if (currentM > 0) handlePremioChange(dataKey, 'm', currentM - 1);
    };
    const handleMPlus = () => {
      if (currentM < 50) handlePremioChange(dataKey, 'm', currentM + 1);
    };

    // Controlos do Valor Base (+- de 100 em 100)
    const handleBMinus = () => {
      if (currentB >= 100) handlePremioChange(dataKey, 'b', currentB - 100);
    };
    const handleBPlus = () => {
      handlePremioChange(dataKey, 'b', currentB + 100);
    };

    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1, p: 1, bgcolor: '#F2E6C9', border: '1px solid', borderColor: '#C8A96B', borderRadius: '6px', transition: 'all 0.3s', boxShadow: 'inset 0 1px 2px rgba(62,47,28,0.05)' }}>
        <Typography sx={{ color: 'text.primary', fontSize: '0.7rem', fontWeight: 900, width: '22%' }}>{label}</Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
           
           {/* MULTIPLICADOR: Apenas Texto com Botões +- */}
           <IconButton size="small" onClick={handleMMinus} disabled={currentM === 0} sx={{ bgcolor: '#E1CFA3', width: '22px', height: '22px', borderRadius: '4px', border: '1px solid #5a4010' }}>
             <Typography sx={{ color: 'text.primary', fontSize: '1.2rem', lineHeight: 1, fontWeight: 'bold' }}>-</Typography>
           </IconButton>

           <Typography sx={{ color: 'primary.main', width: '26px', textAlign: 'center', fontWeight: '900', fontSize: '0.9rem' }}>
             {currentM}
           </Typography>

           <IconButton size="small" onClick={handleMPlus} disabled={currentM === 50} sx={{ bgcolor: '#E1CFA3', width: '22px', height: '22px', borderRadius: '4px', border: '1px solid #5a4010' }}>
             <Typography sx={{ color: 'text.primary', fontSize: '1.2rem', lineHeight: 1, fontWeight: 'bold' }}>+</Typography>
           </IconButton>

           <Typography sx={{ color: 'text.secondary', fontSize: '0.8rem', mx: 0.2, fontWeight: 'bold' }}>x</Typography>
           
           {/* VALOR BASE: Botões +- de 100 em 100 */}
           <IconButton size="small" onClick={handleBMinus} disabled={currentB === 0} sx={{ bgcolor: '#E1CFA3', width: '22px', height: '22px', borderRadius: '4px', border: '1px solid #5a4010' }}>
             <Typography sx={{ color: 'text.primary', fontSize: '1.2rem', lineHeight: 1, fontWeight: 'bold' }}>-</Typography>
           </IconButton>
           
           <Typography sx={{ color: 'primary.main', width: '40px', textAlign: 'center', fontWeight: '900', fontSize: '0.85rem' }}>
             {formatNumber(currentB)}
           </Typography>
           
           <IconButton size="small" onClick={handleBPlus} sx={{ bgcolor: '#E1CFA3', width: '22px', height: '22px', borderRadius: '4px', border: '1px solid #5a4010' }}>
             <Typography sx={{ color: 'text.primary', fontSize: '1.2rem', lineHeight: 1, fontWeight: 'bold' }}>+</Typography>
           </IconButton>

           {/* TOTAL DA LINHA */}
           <Typography sx={{ color: '#e05030', fontSize: '0.75rem', fontWeight: 900, ml: 0.5, minWidth: '60px', textAlign: 'right' }}>
              = {formatNumber(rowTotal)}
           </Typography>
        </Box>
      </Box>
    );
  };

  // ==========================================
  // 3. INTERFACE VISUAL
  // ==========================================
  return (
    <Box sx={{ textAlign: 'left', mt: 1 }}>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        
        {/* CARTÃO A: INPUT DE ESSÊNCIAS */}
        <Grid item xs={12} md={5}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography sx={{ color: 'primary.main', fontWeight: 900, mb: 1, textTransform: 'uppercase', fontSize: '1.1rem', borderBottom: '2px solid #5a4010', pb: 1 }}>
              A. Uso de Essências
            </Typography>
            <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem', mb: 3, mt: 1, fontWeight: 'bold' }}>
              Cada <span style={{color: '#e05030'}}>Essência de Fúria</span> gera <b>100 Pontos</b>. Insira a quantidade abaixo:
            </Typography>

            <TextField 
              fullWidth 
              label="Digite a Quantidade..." 
              variant="outlined" 
              type="tel" 
              value={qtdEssencia} 
              onChange={(e) => handleEssenciaChange(e.target.value)} 
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
              InputProps={{
                endAdornment: <InputAdornment position="end"><Typography sx={{ fontSize: '1.5rem' }}>🔮</Typography></InputAdornment>,
              }}
              sx={{ 
                mb: 3, 
                bgcolor: '#fafafa', 
                borderRadius: '6px', 
                boxShadow: 'inset 0 3px 6px rgba(0,0,0,0.1)', 
                '& .MuiOutlinedInput-root': { 
                  fontWeight: '900', 
                  color: '#e05030', 
                  fontSize: '1.3rem', 
                  '& fieldset': { border: '2px solid #5a4010' }, 
                  '&:hover fieldset': { border: '2px solid #c8940a' }, 
                  '&.Mui-focused fieldset': { border: '3px solid #c8940a' } 
                }, 
                '& .MuiInputLabel-root': { color: '#8a6420', fontWeight: '900', fontSize: '0.9rem' },
                '& .MuiInputLabel-shrink': { transform: 'translate(14px, -9px) scale(0.85)', bgcolor: '#fafafa', px: 0.5 }
              }}
            />

            <Box sx={{ p: 1.5, bgcolor: '#F2E6C9', borderRadius: '6px', border: '1px solid #5a4010', borderBottom: '4px solid #c8940a', textAlign: 'center', boxShadow: 'inset 0 1px 3px rgba(62,47,28,0.06)' }}>
              <Typography sx={{ color: 'text.secondary', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase' }}>Pontuação Gerada</Typography>
              <Typography sx={{ color: 'primary.main', fontSize: '2.5rem', fontWeight: 900, lineHeight: 1 }}>{formatNumber(totalPontos)}</Typography>
            </Box>
          </Card>
        </Grid>

        {/* CARTÃO B: RECOMPENSAS */}
        <Grid item xs={12} md={7}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography sx={{ color: 'primary.main', fontWeight: 900, mb: 1, textTransform: 'uppercase', fontSize: '1.1rem', borderBottom: '2px solid #5a4010', pb: 1 }}>
              B. Recompensas (Bónus)
            </Typography>
            
            <Box sx={{ mb: 3, mt: 2 }}>
              <TextField 
                select fullWidth label="Tropa de Prémio" variant="outlined" size="small" 
                value={tropaPremio} 
                onChange={(e) => setTropaPremio(e.target.value)} 
                sx={{ 
                  bgcolor: '#F2E6C9', borderRadius: '4px', 
                  '& .MuiOutlinedInput-root': { fontWeight: 'bold', color: 'primary.main' }, 
                  '& .MuiInputLabel-root': { color: 'primary.main', fontWeight: 'bold' } 
                }}
              >
                {/* Agora usamos um select nativo que não quebra o código e mapeamos as opções corretamente */}
                {[...dbTropas].sort((a, b) => a.nome.localeCompare(b.nome)).map((tropa) => (
                  <MenuItem key={tropa.nome} value={tropa.nome} sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                    {tropa.nome} (Poder: {formatNumber(tropa.poder)})
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <Typography sx={{ color: 'text.secondary', fontSize: '0.8rem', fontWeight: 900, mb: 1 }}>METAS E BÓNUS</Typography>
            <RewardRow label="Princ." dataKey="princ" />
            <RewardRow label={`M. ${formatNumber(meta1Pts)}`} dataKey="meta1" />
            <RewardRow label={`M. ${formatNumber(meta2Pts)}`} dataKey="meta2" />
            <RewardRow label={`M. ${formatNumber(meta3Pts)}`} dataKey="meta3" />

            <Divider sx={{ borderColor: 'rgba(166, 131, 77, 0.4)', my: 2 }} />

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

      {/* CARTÃO C: GUIA */}
      <Typography sx={{ color: 'primary.main', fontWeight: 900, mb: 1.5, fontSize: '1.2rem', textShadow: '1px 1px 1px rgba(255,255,255,0.5)' }}>
        Guia Completo: Habilidades de Dragão
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6}>
          <Card sx={{ p: 2, height: '100%', borderLeft: '6px solid #c8940a' }}>
            <Typography sx={{ color: 'text.primary', fontWeight: 900, fontSize: '0.95rem', mb: 0.5 }}>1. Como funciona o Torneio?</Typography>
            <Typography sx={{ color: 'text.secondary', fontSize: '0.8rem', mb: 1.5, fontWeight: 'bold' }}>
              O objetivo é fortalecer o seu exército através das <span style={{color: '#B8965A'}}>habilidades dos seus dragões</span>. Para fazer upgrade a estas habilidades, precisa de usar o item <b>Essência de Fúria</b>.
            </Typography>
            <Box sx={{ bgcolor: '#E1CFA3', p: 1, borderRadius: '4px', border: '1px dashed #5a4010', textAlign: 'center' }}>
              <Typography sx={{ color: '#e05030', fontSize: '0.8rem', fontWeight: 900 }}>1 Essência de Fúria usada = 100 Pontos</Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card sx={{ p: 2, height: '100%', borderLeft: '6px solid #c8940a' }}>
            <Typography sx={{ color: 'text.primary', fontWeight: 900, fontSize: '0.95rem', mb: 0.5 }}>2. O Segredo das Metas</Typography>
            <Typography sx={{ color: 'text.secondary', fontSize: '0.8rem', mb: 1, fontWeight: 'bold' }}>
              As metas de recompensa bónus deste torneio são extremamente baixas (10, 50 e 100 pontos). Isto significa que:
            </Typography>
            <Box sx={{ bgcolor: '#dbeafe', p: 1, borderRadius: '4px', border: '1px solid #1d4ed8' }}>
              <Typography sx={{ color: C.DEFENSE, fontSize: '0.8rem', fontWeight: 900, textAlign: 'center' }}>
                ⭐ Usar APENAS 1 ESSÊNCIA garante 100 pontos e permite-lhe planear e resgatar metas instantaneamente!
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TorneioHabilidadeDragao;
