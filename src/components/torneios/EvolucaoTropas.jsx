import React, { useState } from 'react';
import { Alert, Box, Button, Card, Divider, Grid, IconButton, MenuItem, Select, Snackbar, TextField, Typography } from '@mui/material';
import { dbTropas } from '../../db.js';
import { C } from '../../theme.js';


const EvolucaoTropas = () => {
  // ==========================================
  // A. ESTADOS DA PONTUAÇÃO (FÓSSEIS COM MEMÓRIA)
  // ==========================================
  const [qtdAnciao1, setQtdAnciao1] = useState(localStorage.getItem('doa_fossil_a1') || '');
  const [qtdCrep1, setQtdCrep1] = useState(localStorage.getItem('doa_fossil_c1') || '');
  const [qtdAnciao2, setQtdAnciao2] = useState(localStorage.getItem('doa_fossil_a2') || '');
  const [qtdCrep2, setQtdCrep2] = useState(localStorage.getItem('doa_fossil_c2') || '');
  
  // Estado para os Alertas Visuais
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const closeToast = () => setToast({ ...toast, open: false });

  // ==========================================
  // B. ESTADOS DA PREMIAÇÃO
  // ==========================================
  const [tropaSelecionada, setTropaSelecionada] = useState(localStorage.getItem('doa_evo_tropa') || '');
  const [premios, setPremios] = useState({
    princ: { m: 10, b: 1000 },
    b5:    { m: 2,  b: 1000 },
    b10:   { m: 5,  b: 1000 },
    b20:   { m: 10, b: 1000 },
  });

  const handlePremioChange = (key, field, val) => {
    setPremios(prev => ({ ...prev, [key]: { ...prev[key], [field]: val } }));
  };

  // --- FUNÇÃO PARA SALVAR O INVENTÁRIO ---
  const handleSaveFosseis = () => {
    localStorage.setItem('doa_fossil_a1', qtdAnciao1);
    localStorage.setItem('doa_fossil_c1', qtdCrep1);
    localStorage.setItem('doa_fossil_a2', qtdAnciao2);
    localStorage.setItem('doa_fossil_c2', qtdCrep2);
    localStorage.setItem('doa_evo_tropa', tropaSelecionada);
    
    setToast({ open: true, message: 'Inventário guardado no Quartel-General com sucesso!', severity: 'success' });
  };

  // --- CÁLCULOS DA PONTUAÇÃO ---
  const qA1 = parseInt(qtdAnciao1) || 0;
  const qC1 = parseInt(qtdCrep1) || 0;
  const qA2 = parseInt(qtdAnciao2) || 0;
  const qC2 = parseInt(qtdCrep2) || 0;

  const totalItens = qA1 + qC1 + qA2 + qC2;
  const pontos = Math.floor(totalItens / 10);
  const itensSobra = totalItens % 10;

  // --- CÁLCULOS DA PREMIAÇÃO ---
  const tropaObj = true ? dbTropas.find(t => t.nome === tropaSelecionada) : null;
  const poderUnitario = tropaObj && tropaObj.poder !== null ? tropaObj.poder : 0;

  const totalPrinc = premios.princ.m * premios.princ.b;
  const total5 = pontos >= 5 ? premios.b5.m * premios.b5.b : 0;
  const total10 = pontos >= 10 ? premios.b10.m * premios.b10.b : 0;
  const total20 = pontos >= 20 ? premios.b20.m * premios.b20.b : 0;

  const totalTropas = totalPrinc + total5 + total10 + total20;
  const totalPoder = totalTropas * poderUnitario;

  const formatNumber = (n) => n === null || n === undefined ? "—" : n.toLocaleString("pt-BR");
  const listaQtds = [10, 50, 100, 200, 300, 500, 1000, 2000, 5000, 10000];

  // Componente de Linha de Prêmio
  const RewardRow = ({ label, dataKey, reqPontos }) => {
    const disabled = pontos < reqPontos; 
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

  const categoriasDeTropas = [
    { cat: 1, itens: "Fóssil do Ancião 1 & Relíquia Diabólica 1", tropas: "Minotauros, Arqueiros e Dragões de Ataque Rápido." },
    { cat: 2, itens: "Fóssil do Ancião 1 & Relíquia Diabólica 1", tropas: "Dragões de Combate." },
    { cat: 3, itens: "Fóssil do Ancião 1 & Relíquia Diabólica 1", tropas: "Andarilhos da Areia e Hoplitas." },
    { cat: 4, itens: "Fóssil do Ancião 1 & Relíquia Diabólica 1", tropas: "Gigantes, Abissais e Terrores do Pântano." },
    { cat: 5, itens: "Fóssil Crepúsculo 1", tropas: "Espelhos de Fogo, Bigas de Fogo, Serpente Vingativa, Canhão Elétrico e Amarande." },
    { cat: 6, itens: "Fóssil Crepúsculo 1", tropas: "Ogro de Granito, Serpente Arsênica, Dragonete da Tempestade, Magmassauros e Guerreiro do Magma." },
  ];

  return (
    <Box sx={{ textAlign: 'left', mt: 1 }}>
      
      {/* Alerta de Sucesso ao Salvar */}
      <Snackbar open={toast.open} autoHideDuration={3000} onClose={closeToast} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} sx={{ mt: 7 }}>
        <Alert onClose={closeToast} severity={toast.severity} variant="filled" sx={{ width: '100%', fontWeight: 'bold' }}>
          {toast.message}
        </Alert>
      </Snackbar>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        
        {/* === CARTÃO A: PONTOS E FÓSSEIS === */}
        <Grid item xs={12} md={5}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography sx={{ color: 'primary.main', fontWeight: 900, mb: 0.5, textTransform: 'uppercase', fontSize: '1.1rem', borderBottom: '2px solid #5a4010', pb: 1 }}>
              A. Cálculo de Pontuação
            </Typography>
            <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem', mb: 2, mt: 1, fontWeight: 'bold' }}>
              1 Aperfeiçoamento = 1 Ponto. (Custo: 10 Fósseis/Itens).
            </Typography>

            <Grid container spacing={1.5} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <TextField 
                  fullWidth label="Fóssil Ancião 1" variant="outlined" type="number" size="small"
                  value={qtdAnciao1} onChange={(e) => setQtdAnciao1(e.target.value)}
                  sx={{ bgcolor: '#F2E6C9', borderRadius: '4px', '& .MuiOutlinedInput-root': { fontWeight: 'bold', color: 'text.primary' } }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField 
                  fullWidth label="Fóssil Crepúsculo 1" variant="outlined" type="number" size="small"
                  value={qtdCrep1} onChange={(e) => setQtdCrep1(e.target.value)}
                  sx={{ bgcolor: '#F2E6C9', borderRadius: '4px', '& .MuiOutlinedInput-root': { fontWeight: 'bold', color: 'text.primary' } }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField 
                  fullWidth label="Fóssil Ancião 2" variant="outlined" type="number" size="small"
                  value={qtdAnciao2} onChange={(e) => setQtdAnciao2(e.target.value)}
                  sx={{ bgcolor: '#F2E6C9', borderRadius: '4px', '& .MuiOutlinedInput-root': { fontWeight: 'bold', color: 'text.primary' } }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField 
                  fullWidth label="Fóssil Crepúsculo 2" variant="outlined" type="number" size="small"
                  value={qtdCrep2} onChange={(e) => setQtdCrep2(e.target.value)}
                  sx={{ bgcolor: '#F2E6C9', borderRadius: '4px', '& .MuiOutlinedInput-root': { fontWeight: 'bold', color: 'text.primary' } }}
                />
              </Grid>
            </Grid>

            {/* BOTÃO DE SALVAR INVENTÁRIO */}
            <Button 
              variant="contained" color="success" fullWidth 
              onClick={handleSaveFosseis}
              sx={{ mb: 2, py: 1, fontWeight: 900, borderRadius: '4px', border: '2px solid #1a432b' }}
            >
              💾 SALVAR INVENTÁRIO
            </Button>

            <Typography align="center" sx={{ color: 'text.secondary', fontWeight: 900, mb: 1, fontSize: '0.85rem', textTransform: 'uppercase' }}>
              Total de Fósseis: <span style={{ color: '#B8965A' }}>{formatNumber(totalItens)}</span>
            </Typography>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ flex: 1, p: 1.5, bgcolor: '#F2E6C9', borderRadius: '6px', border: '1px solid #5a4010', borderBottom: '4px solid #c8940a', textAlign: 'center', boxShadow: 'inset 0 1px 3px rgba(62,47,28,0.06)' }}>
                <Typography sx={{ color: 'text.secondary', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase' }}>Pontos (Meta)</Typography>
                <Typography sx={{ color: 'primary.main', fontSize: '2rem', fontWeight: 900, lineHeight: 1 }}>{formatNumber(pontos)}</Typography>
              </Box>
              <Box sx={{ flex: 1, p: 1.5, bgcolor: '#F2E6C9', borderRadius: '6px', border: '1px solid #5a4010', borderBottom: '4px solid #A83C2C', textAlign: 'center', boxShadow: 'inset 0 1px 3px rgba(62,47,28,0.06)' }}>
                <Typography sx={{ color: 'text.secondary', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase' }}>Itens Sobra</Typography>
                <Typography sx={{ color: 'error.main', fontSize: '2rem', fontWeight: 900, lineHeight: 1 }}>{formatNumber(itensSobra)}</Typography>
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* === CARTÃO B: PREMIAÇÃO === */}
        <Grid item xs={12} md={7}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography sx={{ color: 'primary.main', fontWeight: 900, mb: 1, textTransform: 'uppercase', fontSize: '1.1rem', borderBottom: '2px solid #5a4010', pb: 1 }}>
              B. Calcule a Premiação do Prêmio
            </Typography>
            
            <Box sx={{ mb: 3, mt: 2 }}>
              <TextField 
                select fullWidth label="1º Selecione a Tropa do Prêmio" variant="outlined" size="small"
                value={tropaSelecionada} onChange={(e) => setTropaSelecionada(e.target.value)}
                sx={{ bgcolor: '#F2E6C9', borderRadius: '4px', '& .MuiOutlinedInput-root': { fontWeight: 'bold', color: 'primary.main' } }}
              >
                {[...dbTropas].sort((a, b) => a.nome.localeCompare(b.nome)).map((tropa) => (
                  <MenuItem key={tropa.nome} value={tropa.nome} sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                    {tropa.nome} (Poder: {formatNumber(tropa.poder)})
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <Typography sx={{ color: 'text.secondary', fontSize: '0.8rem', fontWeight: 900, mb: 1, ml: 1 }}>2º CONFIGURE OS PRÊMIOS</Typography>
            <RewardRow label="Principal" dataKey="princ" reqPontos={0} />
            <RewardRow label="Bônus 5 pts" dataKey="b5" reqPontos={5} />
            <RewardRow label="Bônus 10 pts" dataKey="b10" reqPontos={10} />
            <RewardRow label="Bônus 20 pts" dataKey="b20" reqPontos={20} />

            <Divider sx={{ borderColor: 'rgba(166, 131, 77, 0.4)', my: 2 }} />

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

      {/* 2. EXPLICAÇÃO RÁPIDA E NOTAS IMPORTANTES */}
      <Typography sx={{ color: 'primary.main', fontWeight: 900, mb: 1.5, fontSize: '1.2rem', textShadow: '1px 1px 1px rgba(255,255,255,0.5)' }}>
        Regras de Batalha e Forja
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6}>
          <Card sx={{ p: 2, height: '100%', borderLeft: '6px solid #c8940a', bgcolor: '#E1CFA3' }}>
            <Typography sx={{ color: 'text.primary', fontWeight: 900, fontSize: '0.9rem', mb: 0.5 }}>1. Aperfeiçoamento</Typography>
            <Typography sx={{ color: 'text.secondary', fontSize: '0.8rem', mb: 1.5, fontWeight: 'bold', textAlign: 'justify' }}>
              O aperfeiçoamento fortalece a Vida, o Ataque Elemental, o Impulso e a Barreira da sua unidade. A cada 5 níveis, você pode promover a raridade da tropa.
            </Typography>
            <Box sx={{ bgcolor: 'rgba(148, 24, 24, 0.1)', p: 1, border: '1px dashed #e05030', borderRadius: '4px' }}>
              <Typography sx={{ color: '#e05030', fontSize: '0.75rem', fontWeight: 900, textAlign: 'center' }}>
                ⚠️ NOTA CRÍTICA:<br/>O poder do aperfeiçoamento aumenta o seu poder, mas também pode perder no ranking global. Deve sempre salvar no Arsenal!
              </Typography>
            </Box>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Card sx={{ p: 2, height: '100%', borderLeft: '6px solid #c8940a', bgcolor: '#E1CFA3' }}>
            <Typography sx={{ color: 'text.primary', fontWeight: 900, fontSize: '0.9rem', mb: 0.5 }}>2. Loja de Surpresas</Typography>
            <Typography sx={{ color: 'text.secondary', fontSize: '0.8rem', fontWeight: 'bold', textAlign: 'justify' }}>
              Utilize <span style={{color:'#c8a030', fontWeight: 900}}>Lembranças Antigas</span> (obtidas derrotando Antropos) para forjar itens.<br/><br/>
              Por dia pode obter no máximo <b>300 lembranças antigas</b>.<br/>
              - Fóssil Ancião 1 = 20 Lemb. + 100k Comida<br/>
              - Fóssil Ancião 2 = 25 Lemb. + 250k Comida<br/>
              - Fóssil Crepúsculo 1 = 30 Lemb. + 200k Comida<br/>
              - Fóssil Crepúsculo 2 = 35 Lemb. + 500k Comida
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* 3. GUIA DE CATEGORIAS */}
      <Typography sx={{ color: 'primary.main', fontWeight: 900, mb: 1.5, fontSize: '1.2rem', textShadow: '1px 1px 1px rgba(255,255,255,0.5)' }}>
        Itens por Categoria de Tropa
      </Typography>
      <Grid container spacing={1.5}>
        {categoriasDeTropas.map((cat, idx) => (
          <Grid item xs={12} md={6} key={idx}>
            <Card sx={{ p: 1.5, border: '1px solid rgba(166,131,77,0.3)', bgcolor: '#E1CFA3' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography sx={{ color: 'primary.main', fontWeight: 900, fontSize: '0.85rem' }}>CATEGORIA {cat.cat}</Typography>
                <Typography sx={{ color: '#B8965A', fontSize: '0.7rem', fontWeight: 900, bgcolor: '#E1CFA3', px: 1, py: 0.5, borderRadius: '4px', border: '1px solid #5a4010', textAlign: 'right' }}>
                  {cat.itens}
                </Typography>
              </Box>
              <Typography sx={{ color: 'text.secondary', fontSize: '0.8rem', fontWeight: 'bold', lineHeight: 1.4 }}>{cat.tropas}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
      
    </Box>
  );
};

export default EvolucaoTropas;
