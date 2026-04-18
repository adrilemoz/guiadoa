import React, { useState } from 'react';
import { Box, Button, Card, Divider, Grid, IconButton, MenuItem, Select, TextField, Typography } from '@mui/material';
import { dbTropas } from '../../db.js';
import { C } from '../../theme.js';


const TorneioTreinoTropa = () => {
  // A1. Simulador de Treino (Quartel) - Adicionado multi
  const [treinos, setTreinos] = useState([
    { id: 1, tropa: '', multi: 1, qtd: '' }
  ]);

  // A2. Simulador de Inventário - Adicionado multi
  const [inventario, setInventario] = useState([
    { id: 1, tropa: '', multi: 1, pacotes: '1', qtdPorPacote: '' }
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

  const multiplicadores = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  // --- Funções Quartel ---
  const handleTreinoTropa = (id, value) => setTreinos(treinos.map(t => t.id === id ? { ...t, tropa: value } : t));
  const handleTreinoMulti = (id, value) => setTreinos(treinos.map(t => t.id === id ? { ...t, multi: value } : t));
  const handleTreinoQtd = (id, value) => {
    const numericVal = value.replace(/\D/g, '');
    const formattedVal = numericVal ? parseInt(numericVal, 10).toLocaleString('pt-BR') : '';
    setTreinos(treinos.map(t => t.id === id ? { ...t, qtd: formattedVal } : t));
  };
  const adicionarTreino = () => setTreinos([...treinos, { id: Date.now(), tropa: '', multi: 1, qtd: '' }]);
  const removerTreino = (id) => { if (treinos.length > 1) setTreinos(treinos.filter(t => t.id !== id)); };

  // --- Funções Inventário (Mochila) ---
  const handleInventarioTropa = (id, value) => setInventario(inventario.map(t => t.id === id ? { ...t, tropa: value } : t));
  const handleInventarioMulti = (id, value) => setInventario(inventario.map(t => t.id === id ? { ...t, multi: value } : t));
  const handleInventarioPacotes = (id, delta) => {
    setInventario(inventario.map(t => {
      if (t.id === id) {
        const newVal = Math.max(1, (parseInt(t.pacotes) || 0) + delta);
        return { ...t, pacotes: newVal.toString() };
      }
      return t;
    }));
  };
  const handleInventarioPacotesManual = (id, value) => {
    const numericVal = value.replace(/\D/g, '');
    setInventario(inventario.map(t => t.id === id ? { ...t, pacotes: numericVal } : t));
  };
  const handleInventarioQtdPorPacote = (id, value) => {
    const numericVal = value.replace(/\D/g, '');
    const formattedVal = numericVal ? parseInt(numericVal, 10).toLocaleString('pt-BR') : '';
    setInventario(inventario.map(t => t.id === id ? { ...t, qtdPorPacote: formattedVal } : t));
  };
  const adicionarInventario = () => setInventario([...inventario, { id: Date.now(), tropa: '', multi: 1, pacotes: '1', qtdPorPacote: '' }]);
  const removerInventario = (id) => { if (inventario.length > 1) setInventario(inventario.filter(t => t.id !== id)); };

  const formatNumber = (n) => n === null || n === undefined ? "0" : n.toLocaleString("pt-BR");

  // --- 1. CÁLCULOS DE PONTOS COM MULTIPLICADOR ---
  let ptsQuartel = 0;
  treinos.forEach(t => {
    const tObj = true ? dbTropas.find(x => x.nome === t.tropa) : null;
    const pUnitario = tObj && tObj.poder !== null ? tObj.poder : 1;
    const qtd = parseInt(t.qtd.replace(/\./g, '')) || 0;
    ptsQuartel += (qtd * pUnitario * (t.multi || 1));
  });

  let ptsInventario = 0;
  inventario.forEach(t => {
    const tObj = true ? dbTropas.find(x => x.nome === t.tropa) : null;
    const pUnitario = tObj && tObj.poder !== null ? tObj.poder : 1;
    const pacotes = parseInt(t.pacotes) || 0;
    const qtdPorPacote = parseInt(t.qtdPorPacote.replace(/\./g, '')) || 0;
    ptsInventario += ((pacotes * qtdPorPacote) * pUnitario * (t.multi || 1));
  });

  const totalPontosTorneio = ptsQuartel + ptsInventario;

  // --- 2. CÁLCULOS DAS RECOMPENSAS ---
  const tropaPremioObj = true ? dbTropas.find(t => t.nome === tropaPremio) : null;
  const poderUnitarioPremio = tropaPremioObj && tropaPremioObj.poder !== null ? tropaPremioObj.poder : 0;

  const meta1Pts = 100000;
  const meta2Pts = 500000;
  const meta3Pts = 2000000;

  const totalPrinc = premios.princ.m * premios.princ.b;
  const totalM1 = totalPontosTorneio >= meta1Pts ? premios.meta1.m * premios.meta1.b : 0;
  const totalM2 = totalPontosTorneio >= meta2Pts ? premios.meta2.m * premios.meta2.b : 0;
  const totalM3 = totalPontosTorneio >= meta3Pts ? premios.meta3.m * premios.meta3.b : 0;

  const totalTropasPremio = totalPrinc + totalM1 + totalM2 + totalM3;
  const totalPoderPremio = totalTropasPremio * poderUnitarioPremio;

  const listaQtds = [10, 50, 100, 200, 300, 500, 1000, 2000, 5000, 10000];

  const RewardRow = ({ label, dataKey, reqPontos }) => {
    const disabled = totalPontosTorneio < reqPontos;
    return (
      <Box sx={{ 
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1, p: 1, 
        bgcolor: disabled ? 'transparent' : '#F2E6C9', border: '1px solid', borderColor: disabled ? 'rgba(166, 131, 77, 0.3)' : '#C8A96B', 
        borderRadius: '6px', transition: 'all 0.3s', boxShadow: disabled ? 'none' : 'inset 0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <Typography sx={{ color: disabled ? 'text.secondary' : 'text.primary', fontSize: '0.75rem', fontWeight: 900, opacity: disabled ? 0.6 : 1, width: '35%' }}>{label}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, opacity: disabled ? 0.4 : 1 }}>
           <IconButton size="small" onClick={() => handlePremioChange(dataKey, 'm', Math.max(0, premios[dataKey].m - 1))} disabled={disabled} sx={{ bgcolor: '#E1CFA3', width: '24px', height: '24px', borderRadius: '4px', border: '1px solid #5a4010' }}>
             <Typography sx={{ color: 'text.primary', fontSize: '1.2rem', lineHeight: 1, fontWeight: 'bold' }}>-</Typography>
           </IconButton>
           <Typography sx={{ color: 'primary.main', width: '24px', textAlign: 'center', fontWeight: '900', fontSize: '0.9rem' }}>{premios[dataKey].m}</Typography>
           <IconButton size="small" onClick={() => handlePremioChange(dataKey, 'm', premios[dataKey].m + 1)} disabled={disabled} sx={{ bgcolor: '#E1CFA3', width: '24px', height: '24px', borderRadius: '4px', border: '1px solid #5a4010' }}>
             <Typography sx={{ color: 'text.primary', fontSize: '1.2rem', lineHeight: 1, fontWeight: 'bold' }}>+</Typography>
           </IconButton>
           <Typography sx={{ color: 'text.secondary', fontSize: '0.8rem', mx: 0.2, fontWeight: 'bold' }}>x</Typography>
           <Select size="small" value={premios[dataKey].b} onChange={(e) => handlePremioChange(dataKey, 'b', e.target.value)} disabled={disabled} sx={{ height: '28px', bgcolor: '#E1CFA3', color: 'text.primary', fontWeight: 'bold', fontSize: '0.8rem', border: '1px solid #5a4010', '& .MuiOutlinedInput-notchedOutline': { border: 'none' } }}>
             {listaQtds.map(v => <MenuItem key={v} value={v} sx={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'text.primary' }}>{formatNumber(v)}</MenuItem>)}
           </Select>
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ textAlign: 'left', mt: 1 }}>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        
        {/* === COLUNA ESQUERDA: FONTES DE PONTOS === */}
        <Grid item xs={12} md={7} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          
          {/* A1. TREINO NO QUARTEL */}
          <Card sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #5a4010', pb: 1, mb: 2 }}>
              <Typography sx={{ color: 'primary.main', fontWeight: 900, textTransform: 'uppercase', fontSize: '1.1rem' }}>
                1. Treinar no Quartel
              </Typography>
              <Button variant="contained" color="info" size="small" onClick={adicionarTreino} sx={{ border: '2px solid #3a2808', fontWeight: '900', px: 1.5, py: 0.5, fontSize: '0.7rem' }}>
                + Tropa
              </Button>
            </Box>

            <Typography sx={{ color: 'text.secondary', fontSize: '0.8rem', mb: 2, fontWeight: 'bold' }}>Tropas treinadas gastando tempo e aceleradores.</Typography>

            {treinos.map((linha) => {
              const tObj = true ? dbTropas.find(x => x.nome === linha.tropa) : null;
              const subtotalPts = (parseInt(linha.qtd.replace(/\./g, '')) || 0) * (tObj ? tObj.poder : 1) * (linha.multi || 1);
              return (
                <Box key={linha.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, p: 1, bgcolor: '#F2E6C9', borderRadius: '6px', border: '1px solid #5a4010', boxShadow: 'inset 0 1px 2px rgba(62,47,28,0.05)' }}>
                  {/* Tropa */}
                  <TextField select label="Tropa" variant="outlined" size="small" value={linha.tropa} onChange={(e) => handleTreinoTropa(linha.id, e.target.value)} sx={{ flex: 1.1, bgcolor: '#E1CFA3', borderRadius: '4px', '& .MuiOutlinedInput-root': { fontWeight: 'bold', color: 'primary.main' } }}>
                    {[...dbTropas].sort((a, b) => a.nome.localeCompare(b.nome)).map(tropa => <MenuItem key={tropa.nome} value={tropa.nome} sx={{ fontWeight: 'bold' }}>{tropa.nome} (P: {formatNumber(tropa.poder)})</MenuItem>)}
                  </TextField>
                  
                  {/* Multiplicador Limpo (Sem "B") */}
                  <TextField select label="Multi." variant="outlined" size="small" value={linha.multi} onChange={(e) => handleTreinoMulti(linha.id, e.target.value)} sx={{ flex: 0.5, bgcolor: '#E1CFA3', borderRadius: '4px', '& .MuiOutlinedInput-root': { fontWeight: '900', color: '#B8965A' } }}>
                    {multiplicadores.map(m => <MenuItem key={m} value={m} sx={{ fontWeight: 'bold' }}>{m}x</MenuItem>)}
                  </TextField>

                  {/* Quantidade */}
                  <TextField label="Qtd" variant="outlined" type="tel" size="small" value={linha.qtd} onChange={(e) => handleTreinoQtd(linha.id, e.target.value)} inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} sx={{ flex: 1, bgcolor: '#E1CFA3', borderRadius: '4px', '& .MuiOutlinedInput-root': { fontWeight: '900', color: '#B8965A' } }} />
                  
                  {/* Subtotal */}
                  <Box sx={{ flex: 0.8, textAlign: 'right', px: 0.5, overflow: 'hidden' }}>
                    <Typography sx={{ color: 'text.secondary', fontSize: '0.6rem', fontWeight: 900, textTransform: 'uppercase' }}>Pts</Typography>
                    <Typography sx={{ color: 'primary.main', fontWeight: 900, fontSize: '0.95rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{formatNumber(subtotalPts)}</Typography>
                  </Box>
                  <IconButton onClick={() => removerTreino(linha.id)} disabled={treinos.length === 1} sx={{ p: 0.5, color: treinos.length === 1 ? 'rgba(0,0,0,0.1)' : 'error.main' }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '1.4rem', lineHeight: 1 }}>×</Typography>
                  </IconButton>
                </Box>
              );
            })}
          </Card>

          {/* A2. ABRIR DO INVENTÁRIO */}
          <Card sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #5a4010', pb: 1, mb: 2 }}>
              <Typography sx={{ color: 'success.main', fontWeight: 900, textTransform: 'uppercase', fontSize: '1.1rem' }}>
                2. Abrir do Inventário
              </Typography>
              <Button variant="contained" color="success" size="small" onClick={adicionarInventario} sx={{ border: '2px solid #1a432b', fontWeight: '900', px: 1.5, py: 0.5, fontSize: '0.7rem' }}>
                + Item
              </Button>
            </Box>

            <Typography sx={{ color: 'text.secondary', fontSize: '0.8rem', mb: 2, fontWeight: 'bold' }}>Calcule os pacotes de tropas guardados na sua mochila.</Typography>

            {inventario.map((linha) => {
              const tObj = true ? dbTropas.find(x => x.nome === linha.tropa) : null;
              const pUnitario = tObj ? tObj.poder : 1;
              const pacotes = parseInt(linha.pacotes) || 0;
              const qtdPorPacote = parseInt(linha.qtdPorPacote.replace(/\./g, '')) || 0;
              const subtotalPts = (pacotes * qtdPorPacote) * pUnitario * (linha.multi || 1);

              return (
                <Box key={linha.id} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2, p: 0.5, bgcolor: '#EAF5EA', borderRadius: '6px', border: '1px solid #5A8A5C', boxShadow: 'inset 0 1px 2px rgba(62,47,28,0.05)' }}>
                  
                  {/* Tropa */}
                  <TextField select label="Tropa" variant="outlined" size="small" value={linha.tropa} onChange={(e) => handleInventarioTropa(linha.id, e.target.value)} sx={{ flex: 1.1, bgcolor: C.BG_INPUT, borderRadius: '4px', '& .MuiOutlinedInput-root': { fontWeight: 'bold', color: 'success.main' } }}>
                    {[...dbTropas].sort((a, b) => a.nome.localeCompare(b.nome)).map(tropa => <MenuItem key={tropa.nome} value={tropa.nome} sx={{ fontWeight: 'bold' }}>{tropa.nome}</MenuItem>)}
                  </TextField>

                  {/* Multiplicador Limpo (Sem "B") */}
                  <TextField select label="Multi." variant="outlined" size="small" value={linha.multi} onChange={(e) => handleInventarioMulti(linha.id, e.target.value)} sx={{ flex: 0.5, bgcolor: C.BG_INPUT, borderRadius: '4px', '& .MuiOutlinedInput-root': { fontWeight: '900', color: '#B8965A' } }}>
                    {multiplicadores.map(m => <MenuItem key={m} value={m} sx={{ fontWeight: 'bold' }}>{m}x</MenuItem>)}
                  </TextField>

                  {/* Multiplicador +/- Pacotes */}
                  <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: C.BG_INPUT, border: '1px solid rgba(22, 163, 74, 0.4)', borderRadius: '4px' }}>
                    <IconButton size="small" onClick={() => handleInventarioPacotes(linha.id, -1)} sx={{ p: 0.2, color: 'success.main', borderRight: '1px solid rgba(22, 163, 74, 0.2)', borderRadius: 0 }}>
                      <Typography sx={{ fontWeight: '900', lineHeight: 1 }}>-</Typography>
                    </IconButton>
                    <TextField variant="standard" type="tel" value={linha.pacotes} onChange={(e) => handleInventarioPacotesManual(linha.id, e.target.value)} inputProps={{ style: { textAlign: 'center', fontWeight: '900', color: '#16a34a', width: '22px', fontSize: '0.85rem' }, inputMode: 'numeric' }} InputProps={{ disableUnderline: true }} />
                    <IconButton size="small" onClick={() => handleInventarioPacotes(linha.id, 1)} sx={{ p: 0.2, color: 'success.main', borderLeft: '1px solid rgba(22, 163, 74, 0.2)', borderRadius: 0 }}>
                      <Typography sx={{ fontWeight: '900', lineHeight: 1 }}>+</Typography>
                    </IconButton>
                  </Box>

                  <Typography sx={{ color: 'text.secondary', fontWeight: '900', fontSize: '0.7rem' }}>x</Typography>

                  {/* Quantidade por Pacote */}
                  <TextField label="Qtd" variant="outlined" type="tel" size="small" value={linha.qtdPorPacote} onChange={(e) => handleInventarioQtdPorPacote(linha.id, e.target.value)} inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} sx={{ flex: 0.9, bgcolor: C.BG_INPUT, borderRadius: '4px', '& .MuiOutlinedInput-root': { fontWeight: '900', color: '#16a34a' } }} />

                  {/* Subtotal Pts */}
                  <Box sx={{ width: '45px', textAlign: 'right', overflow: 'hidden' }}>
                    <Typography sx={{ color: 'text.secondary', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase' }}>Pts</Typography>
                    <Typography sx={{ color: 'success.main', fontWeight: 900, fontSize: '0.85rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{formatNumber(subtotalPts)}</Typography>
                  </Box>

                  {/* Remover */}
                  <IconButton onClick={() => removerInventario(linha.id)} disabled={inventario.length === 1} sx={{ p: 0.2, color: inventario.length === 1 ? 'rgba(0,0,0,0.1)' : 'error.main' }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '1.4rem', lineHeight: 1 }}>×</Typography>
                  </IconButton>
                </Box>
              );
            })}
          </Card>
        </Grid>

        {/* === COLUNA DIREITA: RECOMPENSAS & TOTAIS === */}
        <Grid item xs={12} md={5} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          
          {/* PAINEL DE PONTUAÇÃO GERAL */}
          <Card sx={{ p: 2, bgcolor: '#F2E6C9', border: '2px solid #5a4010', borderBottom: '6px solid #c8940a', textAlign: 'center', boxShadow: 'inset 0 1px 3px rgba(62,47,28,0.06)' }}>
            <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem', fontWeight: 900, textTransform: 'uppercase', mb: 0.5 }}>Pontuação Total do Evento</Typography>
            <Typography sx={{ color: 'primary.main', fontSize: '3rem', fontWeight: 900, lineHeight: 1 }}>{formatNumber(totalPontosTorneio)}</Typography>
          </Card>

          {/* RECOMPENSAS */}
          <Card sx={{ p: 3, flexGrow: 1 }}>
            <Typography sx={{ color: 'primary.main', fontWeight: 900, mb: 1, textTransform: 'uppercase', fontSize: '1.1rem', borderBottom: '2px solid #5a4010', pb: 1 }}>
              Recompensas
            </Typography>
            
            <Box sx={{ mb: 3, mt: 2 }}>
              <TextField select fullWidth label="Tropa de Prémio" variant="outlined" size="small" value={tropaPremio} onChange={(e) => setTropaPremio(e.target.value)} sx={{ bgcolor: '#F2E6C9', borderRadius: '4px', '& .MuiOutlinedInput-root': { fontWeight: 'bold', color: 'primary.main' } }}>
                {[...dbTropas].sort((a, b) => a.nome.localeCompare(b.nome)).map(tropa => <MenuItem key={tropa.nome} value={tropa.nome} sx={{ fontWeight: 'bold' }}>{tropa.nome} (Poder: {formatNumber(tropa.poder)})</MenuItem>)}
              </TextField>
            </Box>

            <Typography sx={{ color: 'text.secondary', fontSize: '0.8rem', fontWeight: 900, mb: 1 }}>METAS E PRÉMIOS</Typography>
            
            <RewardRow label="Principal" dataKey="princ" reqPontos={0} />
            <RewardRow label={`Meta ${formatNumber(meta1Pts)}`} dataKey="meta1" reqPontos={meta1Pts} />
            <RewardRow label={`Meta ${formatNumber(meta2Pts)}`} dataKey="meta2" reqPontos={meta2Pts} />
            <RewardRow label={`Meta ${formatNumber(meta3Pts)}`} dataKey="meta3" reqPontos={meta3Pts} />

            <Divider sx={{ borderColor: 'rgba(166, 131, 77, 0.4)', my: 2 }} />

            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Box sx={{ flex: 1, p: 1.5, bgcolor: '#F2E6C9', borderRadius: '6px', border: '1px solid #5a4010', textAlign: 'center' }}>
                <Typography sx={{ color: 'text.secondary', fontSize: '0.80rem', fontWeight: 900, textTransform: 'uppercase' }}>Tropas Ganhas</Typography>
                <Typography sx={{ color: 'text.primary', fontSize: '1.4rem', fontWeight: 900 }}>{formatNumber(totalTropasPremio)}</Typography>
              </Box>
              <Box sx={{ flex: 1, p: 1.5, bgcolor: '#B8965A', borderRadius: '6px', border: '2px solid #3a2808', textAlign: 'center' }}>
                <Typography sx={{ color: 'primary.contrastText', fontSize: '0.80rem', fontWeight: 900, textTransform: 'uppercase' }}>Poder Bónus</Typography>
                <Typography sx={{ color: C.TEXT_PRIMARY, fontSize: '1.4rem', fontWeight: 900 }}>{formatNumber(totalPoderPremio)}</Typography>
              </Box>
            </Box>
          </Card>
        </Grid>

      </Grid>

      {/* === CARTÃO C: ESTRATÉGIA === */}
      <Typography sx={{ color: 'primary.main', fontWeight: 900, mb: 1.5, fontSize: '1.2rem', textShadow: '1px 1px 1px rgba(255,255,255,0.5)' }}>
        Estratégia de Evolução
      </Typography>
      
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6}>
          <Card sx={{ p: 2, height: '100%', borderLeft: '6px solid #16a34a' }}>
            <Typography sx={{ color: 'success.main', fontWeight: 900, fontSize: '0.95rem', mb: 0.5 }}>
              🎒 O Segredo do Inventário
            </Typography>
            <Typography sx={{ color: 'text.primary', fontSize: '0.85rem', fontWeight: 'bold' }}>
              Nunca abra itens de tropas fora de eventos! Guarde-os sempre na mochila. Quando o Torneio de Treino começar, abra todos de uma vez usando os multiplicadores para ganhar pontos instantaneamente sem gastar aceleradores.
            </Typography>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Card sx={{ p: 2, height: '100%', borderLeft: '6px solid #c8940a' }}>
            <Typography sx={{ color: 'primary.main', fontWeight: 900, fontSize: '0.95rem', mb: 0.5 }}>
              ⏱️ Treino e Aceleradores
            </Typography>
            <Typography sx={{ color: 'text.primary', fontSize: '0.85rem', fontWeight: 'bold' }}>
              Ao treinar no quartel, espere sempre para pedir ajuda à Aliança antes de usar os seus aceleradores. O tempo base diminui significativamente, poupando recursos vitais para as metas mais altas.
            </Typography>
          </Card>
        </Grid>
      </Grid>

    </Box>
  );
};

export default TorneioTreinoTropa;
