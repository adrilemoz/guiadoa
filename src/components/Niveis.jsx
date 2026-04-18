import GameHeader from './shared/GameHeader.jsx';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Box, Button, Card, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, Paper, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { dbNiveis } from '../db.js';
import { C } from '../theme.js';



const Niveis = () => {
  // Funções de formatação - Aceitando apenas NÚMEROS
  const unformat = (v) => Number(String(v).replace(/\D/g, "")) || 0;
  const formatNumber = (n) => n === null || n === undefined || n === "" ? "—" : Number(n).toLocaleString("pt-BR");

  // Formatar para K (Milhares) ou M (Milhões)
  const formatarSufixo = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace('.0', '') + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1).replace('.0', '') + 'K';
    }
    return num;
  };

  // Referência para focar no campo de Poder Atual
  const poderAtualRef = useRef(null);

  // Estados dos Pop-ups
  const [promptAberto, setPromptAberto] = useState(true);
  const [resultadoDialog, setResultadoDialog] = useState({ open: false, titulo: '', mensagem: '', tipo: 'success' });
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  // Carrega os poderes salvos (se existirem)
  const [poderAtualText, setPoderAtualText] = useState(() => {
    const saved = localStorage.getItem('doa_poder_niveis');
    return saved ? formatNumber(saved) : "";
  });

  const [poderAntigoText, setPoderAntigoText] = useState(() => {
    const saved = localStorage.getItem('doa_poder_antigo');
    return saved ? formatNumber(saved) : "";
  });

  const [isDirty, setIsDirty] = useState(false);

  // Proteção contra saída acidental sem salvar
  useEffect(() => {
    window.temAlteracoesNaoSalvas = isDirty;
    
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.temAlteracoesNaoSalvas = false;
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDirty]);

  const showToast = (message, severity = 'success') => setToast({ open: true, message, severity });
  const closeToast = () => setToast({ ...toast, open: false });

  const handleInputPower = (e) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    const num = Number(rawValue);
    setPoderAtualText(num === 0 ? "" : formatNumber(num));
    setIsDirty(true);
  };

  const handleInputAntigo = (e) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    const num = Number(rawValue);
    setPoderAntigoText(num === 0 ? "" : formatNumber(num));
    setIsDirty(true);
  };

  // 🚀 NOVA LÓGICA DE SALVAMENTO COM MODAL DE RESULTADO
  const handleSave = () => {
    const numAtual = unformat(poderAtualText);
    const numAntigo = unformat(poderAntigoText);
    
    localStorage.setItem('doa_poder_niveis', numAtual);
    localStorage.setItem('doa_poder_antigo', numAntigo);
    
    setIsDirty(false);
    
    const diferenca = numAtual - numAntigo;
    
    // Mostra o Modal de Confirmação se houver uma diferença real e se já havia um poder antigo
    if (diferenca > 0 && numAntigo > 0) {
      setResultadoDialog({
        open: true,
        titulo: '🎖️ RELATÓRIO DE PROGRESSO',
        mensagem: `Parabéns, Comandante! O seu poder aumentou ${formatarSufixo(diferenca)}!`,
        tipo: 'success'
      });
    } else if (diferenca < 0 && numAntigo > 0) {
      setResultadoDialog({
        open: true,
        titulo: '⚠️ ALERTA DE BAIXAS',
        mensagem: `Atenção: O seu poder diminuiu ${formatarSufixo(Math.abs(diferenca))}. Reorganize as suas defesas!`,
        tipo: 'warning'
      });
    } else {
      // Se não houver mudança de poder ou for a primeira vez, apenas um toast discreto
      showToast("Progresso salvo com sucesso!", "success");
    }
  };

  const handleAtualizarSim = () => {
    if (poderAtualText) {
      setPoderAntigoText(poderAtualText);
      setPoderAtualText(""); 
      setIsDirty(true);
    }
    
    setPromptAberto(false);
    
    setTimeout(() => {
      if (poderAtualRef.current) {
        poderAtualRef.current.focus();
      }
    }, 300);
  };

  const currentPowerNum = unformat(poderAtualText);
  const oldPowerNum = unformat(poderAntigoText);

  // Cálculo da Diferença de Poder
  const diferencaPoder = currentPowerNum - oldPowerNum;
  const isPositivo = diferencaPoder > 0;

  // 1. Carrega TODOS os níveis do db.js sem limite
  const todosNiveis = dbNiveis;
  const maxNivelDB = todosNiveis.length > 0 ? todosNiveis[todosNiveis.length - 1][0] : "MAX";

  // 2. Calcular o nível EXATO
  let nivelExato = 0;
  todosNiveis.forEach(n => {
    if (n[1] !== null && currentPowerNum >= n[1]) {
      nivelExato = n[0];
    }
  });

  // 3. Descobrir qual é a PRÓXIMA META imediata (ignora níveis com poder null)
  let proximaMeta = todosNiveis.find(n => n[1] !== null && n[1] > currentPowerNum);
  const faltamParaMeta = proximaMeta ? proximaMeta[1] - currentPowerNum : 0;

  // 4. Descobrir o PRÓXIMO MARCO (Múltiplos de 5)
  let proximoMarco = todosNiveis.find(n => n[1] !== null && n[1] > currentPowerNum && n[0] % 5 === 0);
  const faltamParaMarco = proximoMarco ? proximoMarco[1] - currentPowerNum : 0;

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', pb: 4 }}>
      
      <Snackbar open={toast.open} autoHideDuration={3000} onClose={closeToast} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} sx={{ mt: 7 }}>
        <Alert onClose={closeToast} severity={toast.severity} variant="filled" sx={{ width: '100%', fontWeight: 'bold' }}>
          {toast.message}
        </Alert>
      </Snackbar>

      {/* POP-UP DE ALERTA DE INÍCIO */}
      <Dialog 
        open={promptAberto} 
        onClose={() => setPromptAberto(false)}
        PaperProps={{ sx: { bgcolor: '#E1CFA3', border: '3px solid #c8940a', borderRadius: '8px' } }}
      >
        <DialogTitle sx={{ color: 'primary.main', fontWeight: '900', textAlign: 'center', borderBottom: '2px solid rgba(17, 138, 139, 0.3)' }}>
          ⚠️ ATUALIZAÇÃO DE INTELIGÊNCIA
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', mt: 2, p: 3 }}>
          <Typography sx={{ color: 'text.primary', fontWeight: 'bold', fontSize: '1rem' }}>
            Comandante, o seu poder ou nível alterou desde o seu último registo? Mantenha os seus dados atualizados!
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: 'center', gap: 2, bgcolor: '#F2E6C9' }}>
          <Button onClick={() => setPromptAberto(false)} variant="contained" sx={{ bgcolor: '#475569', color: 'white', fontWeight: 900 }}>NÃO</Button>
          <Button onClick={handleAtualizarSim} variant="contained" color="success" sx={{ fontWeight: 900 }}>SIM, ATUALIZAR</Button>
        </DialogActions>
      </Dialog>

      {/* 🚀 NOVO POP-UP DE RESULTADO (PARABÉNS OU AVISO) */}
      <Dialog 
        open={resultadoDialog.open} 
        onClose={() => setResultadoDialog({ ...resultadoDialog, open: false })}
        PaperProps={{ 
          sx: { 
            bgcolor: '#E1CFA3', 
            border: `3px solid ${resultadoDialog.tipo === 'success' ? '#2e7d32' : '#B8965A'}`, 
            borderRadius: '8px' 
          } 
        }}
      >
        <DialogTitle sx={{ color: resultadoDialog.tipo === 'success' ? '#2e7d32' : '#B8965A', fontWeight: '900', textAlign: 'center', borderBottom: `2px solid ${resultadoDialog.tipo === 'success' ? 'rgba(46, 125, 50, 0.3)' : 'rgba(180, 83, 9, 0.3)'}` }}>
          {resultadoDialog.titulo}
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', mt: 2, p: 3 }}>
          <Typography sx={{ color: 'text.primary', fontWeight: '900', fontSize: '1.2rem', mb: 1 }}>
            {resultadoDialog.mensagem}
          </Typography>
          <Typography sx={{ color: 'text.secondary', fontWeight: 'bold', fontSize: '0.85rem' }}>
            O seu relatório foi atualizado na base de dados com sucesso.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: 'center', bgcolor: '#F2E6C9' }}>
          <Button 
            onClick={() => setResultadoDialog({ ...resultadoDialog, open: false })} 
            variant="contained" 
            color={resultadoDialog.tipo === 'success' ? 'success' : 'warning'}
            sx={{ fontWeight: 900, px: 4, py: 1 }}
          >
            CONTINUAR
          </Button>
        </DialogActions>
      </Dialog>

      <Card sx={{ mb: 3, p: 0, overflow: 'hidden', border: 'none', bgcolor: 'transparent' }}>
        <GameHeader title="Progresso da Cidade" />
        <Box sx={{ p: 2, bgcolor: '#F2E6C9', textAlign: 'center', border: '3px solid #5a4010', borderTop: 'none', borderRadius: '0 0 8px 8px' }}>
          <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem', fontWeight: 'bold' }}>
            Acompanhe a sua evolução em todos os níveis e guarde o seu progresso.
          </Typography>
        </Box>
      </Card>

      {/* PAINEL DE CONTROLE SUPERIOR */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} md={5}>
          <Card elevation={0} sx={{ p: 2, bgcolor: '#E1CFA3', borderRadius: '8px', border: '3px solid #5a4010', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: '0 3px 6px rgba(62,47,28,0.1)' }}>
            
            {/* Campo Poder Antigo */}
            <Typography sx={{ color: 'text.secondary', fontWeight: 900, mb: 0.5, textTransform: 'uppercase', fontSize: '0.75rem' }}>
              Poder Anterior (Opcional)
            </Typography>
            <TextField 
              fullWidth placeholder="Ex: 50.000" variant="outlined" type="text" size="small"
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
              value={poderAntigoText} onChange={handleInputAntigo}
              sx={{ 
                bgcolor: '#F2E6C9', borderRadius: '4px', mb: 2,
                '& .MuiOutlinedInput-root': {
                  color: 'text.secondary', fontWeight: 'bold', fontSize: '1rem', fontFamily: 'monospace',
                  '& fieldset': { borderColor: 'rgba(166,131,77,0.3)' },
                  '&:hover fieldset': { borderColor: '#C8A96B' },
                  '&.Mui-focused fieldset': { borderColor: 'primary.main', borderWidth: '2px' },
                }
              }}
            />

            <Divider sx={{ borderColor: 'rgba(166,131,77,0.3)', mb: 2 }} />

            {/* Campo Poder Atual */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography sx={{ color: 'primary.main', fontWeight: 900, textTransform: 'uppercase', fontSize: '0.85rem' }}>
                Seu Poder Atual
              </Typography>
              
              {/* Badge Dinâmica de Diferença */}
              {diferencaPoder !== 0 && poderAntigoText && poderAtualText && (
                 <Typography sx={{ 
                   fontSize: '0.7rem', fontWeight: 900, 
                   color: isPositivo ? '#2e7d32' : '#e05030',
                   bgcolor: isPositivo ? 'rgba(46, 125, 50, 0.1)' : 'rgba(148, 24, 24, 0.1)',
                   px: 1, py: 0.2, borderRadius: '4px', border: `1px solid ${isPositivo ? '#2e7d32' : '#e05030'}`
                 }}>
                   {isPositivo ? '📈 +' : '📉 '}{formatarSufixo(diferencaPoder)}
                 </Typography>
              )}
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField 
                inputRef={poderAtualRef}
                fullWidth placeholder="Digite..." variant="outlined" type="text" size="small"
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                value={poderAtualText} onChange={handleInputPower}
                sx={{ 
                  bgcolor: '#F2E6C9', borderRadius: '4px',
                  '& .MuiOutlinedInput-root': {
                    color: 'text.primary', fontWeight: 'bold', fontSize: '1.1rem', fontFamily: 'monospace',
                    '& fieldset': { borderColor: 'rgba(166,131,77,0.5)' },
                    '&:hover fieldset': { borderColor: '#C8A96B' },
                    '&.Mui-focused fieldset': { borderColor: 'primary.main', borderWidth: '2px' },
                  }
                }}
              />
              <Button 
                variant="contained" 
                color={isDirty ? "success" : "info"}
                onClick={handleSave}
                disabled={!isDirty}
                sx={{ fontWeight: 900, minWidth: '80px' }}
              >
                Salvar
              </Button>
            </Box>
            
            {isDirty && (
              <Typography sx={{ color: '#B8965A', fontSize: '0.80rem', fontWeight: 'bold', mt: 0.5 }}>
                ⚠️ Alterações não salvas!
              </Typography>
            )}
          </Card>
        </Grid>

        <Grid item xs={12} md={7}>
          <Box sx={{ display: 'flex', gap: 1, height: '100%' }}>
            
            {/* Cartão do Nível Exato */}
            <Card elevation={0} sx={{ flex: 1, p: 1.5, bgcolor: '#E1CFA3', borderRadius: '8px', border: '3px solid #5a4010', borderBottom: '5px solid #c8940a', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', boxShadow: '0 3px 6px rgba(62,47,28,0.1)' }}>
              <Typography sx={{ color: 'text.secondary', fontSize: '0.80rem', fontWeight: 900, textTransform: 'uppercase', mb: 1, whiteSpace: 'nowrap' }}>Nível Atual</Typography>
              <Typography sx={{ color: 'primary.main', fontSize: '1.8rem', fontWeight: 900, lineHeight: 1, fontFamily: 'monospace' }}>
                {nivelExato || "—"}
              </Typography>
            </Card>

            {/* Cartão da Próxima Meta */}
            <Card elevation={0} sx={{ flex: 1, p: 1.5, bgcolor: '#E1CFA3', borderRadius: '8px', border: '3px solid #5a4010', borderBottom: '5px solid #c8940a', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', boxShadow: '0 3px 6px rgba(62,47,28,0.1)' }}>
              <Typography sx={{ color: 'text.secondary', fontSize: '0.80rem', fontWeight: 900, textTransform: 'uppercase', mb: 1, whiteSpace: 'nowrap' }}>
                Próximo: Lvl {proximaMeta ? proximaMeta[0] : maxNivelDB}
              </Typography>
              <Typography sx={{ color: '#B8965A', fontSize: '0.75rem', fontWeight: 900, lineHeight: 1.2, textTransform: 'uppercase' }}>
                {proximaMeta ? "Faltam:" : "Parabéns:"}
              </Typography>
              <Typography sx={{ color: '#B8965A', fontSize: '1.1rem', fontWeight: 900, lineHeight: 1, fontFamily: 'monospace' }}>
                {proximaMeta ? formatNumber(faltamParaMeta) : "MÁXIMO"}
              </Typography>
            </Card>

            {/* Cartão do Próximo Marco (5 em 5) */}
            <Card elevation={0} sx={{ flex: 1, p: 1.5, bgcolor: '#E1CFA3', borderRadius: '8px', border: '3px solid #5a4010', borderBottom: '5px solid #581c87', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', boxShadow: '0 3px 6px rgba(62,47,28,0.1)' }}>
              <Typography sx={{ color: 'text.secondary', fontSize: '0.80rem', fontWeight: 900, textTransform: 'uppercase', mb: 1, whiteSpace: 'nowrap' }}>
                Marco: Lvl {proximoMarco ? proximoMarco[0] : maxNivelDB}
              </Typography>
              <Typography sx={{ color: C.POWER, fontSize: '0.75rem', fontWeight: 900, lineHeight: 1.2, textTransform: 'uppercase' }}>
                {proximoMarco ? "Faltam:" : "Parabéns:"}
              </Typography>
              <Typography sx={{ color: C.POWER, fontSize: '1.1rem', fontWeight: 900, lineHeight: 1, fontFamily: 'monospace' }}>
                {proximoMarco ? formatNumber(faltamParaMarco) : "MÁXIMO"}
              </Typography>
            </Card>

          </Box>
        </Grid>
      </Grid>

      {/* TABELA COMPLETA (LÊ TODOS OS NÍVEIS DO DB) */}
      <TableContainer component={Paper} elevation={0} sx={{ bgcolor: '#E1CFA3', borderRadius: '8px', border: '3px solid #5a4010', boxShadow: '0 3px 6px rgba(62,47,28,0.1)', maxHeight: '450px', overflowY: 'auto' }}>
        <Table size="small" stickyHeader sx={{ tableLayout: 'auto' }}>
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ whiteSpace: 'nowrap', bgcolor: '#F2E6C9', color: 'primary.main', fontWeight: 900, borderBottom: '3px solid #5a4010', borderRight: '1px solid rgba(166,131,77,0.3)', px: { xs: 1, sm: 2 }, fontSize: { xs: '0.80rem', sm: '0.85rem' } }}>
                NÍVEL
              </TableCell>
              <TableCell align="center" sx={{ whiteSpace: 'nowrap', bgcolor: '#F2E6C9', color: 'text.primary', fontWeight: 900, borderBottom: '3px solid #5a4010', borderRight: '1px solid rgba(166,131,77,0.3)', px: { xs: 1, sm: 2 }, fontSize: { xs: '0.80rem', sm: '0.85rem' } }}>
                PODER NECESSÁRIO
              </TableCell>
              <TableCell align="center" sx={{ whiteSpace: 'nowrap', bgcolor: '#F2E6C9', color: 'text.primary', fontWeight: 900, borderBottom: '3px solid #5a4010', px: { xs: 1, sm: 2 }, fontSize: { xs: '0.80rem', sm: '0.85rem' } }}>
                STATUS
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {todosNiveis.map((n, idx) => {
              const [nivel, poderNivel] = n;
              
              const isUnknown = poderNivel === null;
              const concluido = !isUnknown && currentPowerNum >= poderNivel;
              const isProxima = proximaMeta && proximaMeta[0] === nivel;
              
              let statusText = isUnknown ? "Em Breve" : "Pendente";
              let statusColor = isUnknown ? "rgba(110, 84, 54, 0.5)" : "text.secondary"; 
              let rowBg = idx % 2 === 0 ? '#E1CFA3' : '#F2E6C9';
              let fontWeightNivel = 700;
              
              if (concluido) {
                statusText = "✓ Concluído";
                statusColor = "#2e7d32"; 
                rowBg = 'rgba(46, 125, 50, 0.1)'; 
              } else if (isProxima) {
                statusText = "Próximo Alvo";
                statusColor = "#B8965A"; 
                rowBg = 'rgba(180, 83, 9, 0.15)'; 
                fontWeightNivel = 900;
              }

              // Destaque visual para múltiplos de 5 (Marcos principais)
              const isMarco = nivel % 5 === 0;

              return (
                <TableRow key={nivel} sx={{ 
                  bgcolor: rowBg,
                  '&:last-child td, &:last-child th': { border: 0 } 
                }}>
                  <TableCell align="center" component="th" scope="row" sx={{ whiteSpace: 'nowrap', fontWeight: isMarco ? 900 : fontWeightNivel, fontSize: { xs: '0.8rem', sm: '0.95rem' }, color: isMarco ? 'primary.main' : 'text.primary', borderBottom: '1px solid rgba(166,131,77,0.2)', borderRight: '1px solid rgba(166,131,77,0.2)', px: { xs: 1, sm: 2 }, py: 0.8 }}>
                    {isMarco ? `⭐ Nível ${nivel}` : `Nível ${nivel}`}
                  </TableCell>
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap', fontWeight: 700, fontSize: { xs: '0.75rem', sm: '0.9rem' }, color: isUnknown ? 'rgba(110, 84, 54, 0.5)' : 'text.secondary', borderBottom: '1px solid rgba(166,131,77,0.2)', borderRight: '1px solid rgba(166,131,77,0.2)', fontFamily: 'monospace', px: { xs: 1, sm: 2 }, py: 0.8 }}>
                    {formatNumber(poderNivel)}
                  </TableCell>
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap', fontWeight: 900, fontSize: { xs: '0.7rem', sm: '0.85rem' }, color: statusColor, borderBottom: '1px solid rgba(166,131,77,0.2)', px: { xs: 1, sm: 2 }, py: 0.8 }}>
                    {statusText}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

    </Box>
  );
};

export default Niveis;
