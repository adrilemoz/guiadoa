import GameHeader from './shared/GameHeader.jsx';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert, Box, Button, Card, Chip, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle, Divider,
  FormControlLabel, Grid, IconButton, MenuItem, Paper,
  Select, Slide, Snackbar, Switch, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Typography
} from '@mui/material';
import { dbEdificios } from '../db.js';
import { C } from '../theme.js';

// ─── Transição ─────────────────────────────────────────────────────────────
const SlideTransition = (props) => <Slide {...props} direction="down" />;

// ─── Dados de identidade por ilha ──────────────────────────────────────────
const ILHA_META = {
  PRINC: { icon: '🏰', label: 'Principal', color: C.ACCENT,   lightBg: '#FDF5E6' },
  FOGO:  { icon: '🔥', label: 'Fogo',      color: C.ATTACK,   lightBg: '#FFF3E0' },
  ÁGUA:  { icon: '💧', label: 'Água',      color: C.DEFENSE,  lightBg: '#EFF6FF' },
  BELLA: { icon: '🌸', label: 'Bella',     color: C.HEALTH,   lightBg: '#FFF0F0' },
  TERRA: { icon: '🌿', label: 'Terra',     color: C.ENERGY,   lightBg: '#F0FAF0' },
};

// ─── Cores por tipo de edifício ────────────────────────────────────────────
const TIPO_COR = {
  fazendas:  { accent: '#2E7D32', bg: '#F1F8E9', label: '🌾' },
  minas:     { accent: '#6A1B9A', bg: '#F3E5F5', label: '⛏️' },
  pedreiras: { accent: '#5D4037', bg: '#EFEBE9', label: '🪨' },
  serrarias: { accent: '#E65100', bg: '#FFF3E0', label: '🪵' },
  perolas:   { accent: '#1565C0', bg: '#E3F2FD', label: '🔮' },
};

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════
const Ilhas = () => {
  const ilhasNomes = ['PRINC', 'FOGO', 'ÁGUA', 'BELLA', 'TERRA'];

  // ── Estado: Expansões ───────────────────────────────────────────────────
  const [expansoes, setExpansoes] = useState(() => {
    const saved = localStorage.getItem('doa_ilhas_expansoes');
    return saved ? JSON.parse(saved) : { FOGO: false, BELLA: false, TERRA: false };
  });

  const rowsDefault = [
    { id: 'r1', type: 'casas',      name: 'Casas',      values: ['', '', '', '', ''] },
    { id: 'r2', type: 'fontes',     name: 'Fontes',     values: ['', '', '', '', ''] },
    { id: 'r3', type: 'guarnicoes', name: 'Guarnições', values: ['', '', '', '', ''] },
    { id: 'r4', type: 'fazendas',   name: 'Fazendas',   values: ['', '', '', '', ''] },
    { id: 'r5', type: 'minas',      name: 'Minas',      values: ['', '', '', '', ''] },
    { id: 'r6', type: 'pedreiras',  name: 'Pedreiras',  values: ['', '', '', '', ''] },
    { id: 'r7', type: 'serrarias',  name: 'Serrarias',  values: ['', '', '', '', ''] },
    { id: 'r8', type: 'perolas',    name: 'F. Pérolas', values: ['', '', '', '', ''] },
  ];

  const fixos = ['Viveiro', 'Forja', 'Fábrica', 'Cofre', 'Sentinela'];

  // ── Estado: Dados, Níveis, Territórios ─────────────────────────────────
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('doa_islands_data_react_v5');
    if (saved) {
      const parsed = JSON.parse(saved);
      return rowsDefault.map(br => parsed.find(p => p.type === br.type) || br);
    }
    return rowsDefault;
  });

  const [niveis, setNiveis] = useState(() => {
    const saved = localStorage.getItem('doa_islands_niveis_v5');
    return saved ? JSON.parse(saved) : {
      fortaleza: 1, casas: 1, fontes: 1, fazendas: 1,
      minas: 1, pedreiras: 1, serrarias: 1, perolas: 1,
    };
  });

  const [territorios, setTerritorios] = useState(() => {
    const saved = localStorage.getItem('doa_islands_territorios_v5');
    return saved ? JSON.parse(saved) : { fazendas: 0, minas: 0, pedreiras: 0, serrarias: 0 };
  });

  const [isEditing, setIsEditing] = useState(() => {
    const saved = localStorage.getItem('doa_islands_editing');
    return saved ? JSON.parse(saved) : true;
  });

  const [dialogConfig, setDialogConfig] = useState({ open: false, type: '', title: '', text: '' });
  const [toast, setToast] = useState({ open: false, message: '', severity: 'error' });

  // ── Efeitos ─────────────────────────────────────────────────────────────
  useEffect(() => {
    window.temAlteracoesNaoSalvas = isEditing;
    return () => { window.temAlteracoesNaoSalvas = false; };
  }, [isEditing]);

  useEffect(() => {
    localStorage.setItem('doa_islands_data_react_v5', JSON.stringify(data));
    localStorage.setItem('doa_ilhas_expansoes', JSON.stringify(expansoes));
    localStorage.setItem('doa_islands_niveis_v5', JSON.stringify(niveis));
    localStorage.setItem('doa_islands_territorios_v5', JSON.stringify(territorios));
    localStorage.setItem('doa_islands_editing', JSON.stringify(isEditing));
  }, [data, expansoes, niveis, territorios, isEditing]);

  // ── Helpers de UI ───────────────────────────────────────────────────────
  const showToast = (message, severity = 'error') => setToast({ open: true, message, severity });
  const closeToast = () => setToast({ ...toast, open: false });

  const requestAction = (type) => {
    if (type === 'clear') {
      setDialogConfig({ open: true, type: 'clear', title: 'Limpar Sistema', text: 'Tem a certeza que deseja apagar todos os edifícios e territórios? Ação irreversível.' });
    } else if (type === 'save') {
      setDialogConfig({ open: true, type: 'save', title: 'Travar Dados', text: 'Isto irá guardar as alterações e bloquear a tabela para evitar edições acidentais.' });
    }
  };

  const confirmAction = () => {
    if (dialogConfig.type === 'clear') {
      setData(rowsDefault);
      setTerritorios({ fazendas: 0, minas: 0, pedreiras: 0, serrarias: 0 });
      setIsEditing(true);
      showToast('Sistema reiniciado com sucesso.', 'success');
    } else if (dialogConfig.type === 'save') {
      setIsEditing(false);
      showToast('Dados travados e salvos.', 'success');
    }
    setDialogConfig({ ...dialogConfig, open: false });
  };

  // ── Cálculos: Limites ───────────────────────────────────────────────────
  const dbFortalezaAtual = dbEdificios.Fortaleza.find(f => f.nivel === niveis.fortaleza) || dbEdificios.Fortaleza[0];

  const limiteSipioPrinc = useMemo(() => {
    let limite = 11;
    for (let i = 1; i <= niveis.fortaleza; i++) {
      const dbFort = dbEdificios.Fortaleza.find(f => f.nivel === i);
      if (dbFort) limite += dbFort.areas;
    }
    return limite;
  }, [niveis.fortaleza]);

  const maxTerritorios = dbFortalezaAtual.territorios;
  const terrUsados = territorios.fazendas + territorios.minas + territorios.pedreiras + territorios.serrarias;
  const terrLivres = maxTerritorios - terrUsados;

  // ── Handlers: Território ────────────────────────────────────────────────
  const alteraTerritorio = (tipo, delta) => {
    if (!isEditing) return;
    const atual = territorios[tipo] || 0;
    const novo = atual + delta;
    if (novo < 0) return;
    if (delta > 0 && terrLivres <= 0) {
      showToast(`LIMITE ATINGIDO: Máximo de ${maxTerritorios} territórios.`, 'warning');
      return;
    }
    setTerritorios({ ...territorios, [tipo]: novo });
  };

  // ── Constantes de lógica ────────────────────────────────────────────────
  const limCidPrinc = 25; const limSitioAgua = 8; const limCidAgua = 4;
  const tiposRecursoTerrestre = ['fazendas', 'minas', 'pedreiras', 'serrarias'];
  const tiposCidade = ['casas', 'fontes', 'guarnicoes'];

  const isAllowed = (type, colIndex) => {
    if (tiposRecursoTerrestre.includes(type)) return colIndex === 0;
    if (type === 'perolas') return colIndex === 2;
    return true;
  };

  // ── Handler: Mudança de edifício ────────────────────────────────────────
  const handleChange = (rowIndex, colIndex, val) => {
    if (!isEditing) return;
    if (!/^\d*$/.test(val)) return;

    const rowType = data[rowIndex].type;
    if (!isAllowed(rowType, colIndex)) return;

    const valNum = parseInt(val) || 0;
    const isRecursoTerrestre = tiposRecursoTerrestre.includes(rowType);
    const isRecursoAgua = rowType === 'perolas';
    const isCidade = tiposCidade.includes(rowType);
    let novoTotalSimulado = 0;

    if (colIndex === 0) {
      if (isRecursoTerrestre) {
        data.forEach((row, i) => {
          if (tiposRecursoTerrestre.includes(row.type))
            novoTotalSimulado += (i === rowIndex ? valNum : (parseInt(row.values[0]) || 0));
        });
        if (novoTotalSimulado > limiteSipioPrinc) {
          showToast(`SÍTIO CHEIO: Limite de ${limiteSipioPrinc} atingido.`, 'warning'); return;
        }
      } else if (isCidade) {
        novoTotalSimulado = 5;
        data.forEach((row, i) => {
          if (tiposCidade.includes(row.type))
            novoTotalSimulado += (i === rowIndex ? valNum : (parseInt(row.values[0]) || 0));
        });
        if (novoTotalSimulado > limCidPrinc) {
          showToast(`CIDADE PRINCIPAL LOTADA: Máx ${limCidPrinc}.`, 'error'); return;
        }
      }
    } else if (colIndex === 2) {
      if (isRecursoAgua) {
        data.forEach((row, i) => {
          if (row.type === 'perolas')
            novoTotalSimulado += (i === rowIndex ? valNum : (parseInt(row.values[2]) || 0));
        });
        if (novoTotalSimulado > limSitioAgua) {
          showToast(`ILHA DE ÁGUA LOTADA: Máx ${limSitioAgua} Pérolas.`, 'error'); return;
        }
      } else if (isCidade) {
        data.forEach((row, i) => {
          if (tiposCidade.includes(row.type))
            novoTotalSimulado += (i === rowIndex ? valNum : (parseInt(row.values[2]) || 0));
        });
        if (novoTotalSimulado > limCidAgua) {
          showToast(`CIDADE NA ÁGUA LOTADA: Máx ${limCidAgua}.`, 'error'); return;
        }
      }
    } else {
      const limiteDaIlha =
        colIndex === 1 ? (expansoes.FOGO  ? 12 : 6) :
        colIndex === 3 ? (expansoes.BELLA ? 12 : 6) :
                         (expansoes.TERRA ? 12 : 6);
      data.forEach((row, i) => {
        novoTotalSimulado += (i === rowIndex ? valNum : (parseInt(row.values[colIndex]) || 0));
      });
      if (novoTotalSimulado > limiteDaIlha) {
        showToast(`LIMITE ILHA ${ilhasNomes[colIndex]} ATINGIDO: ${limiteDaIlha}.`, 'error'); return;
      }
    }

    const newData = [...data];
    newData[rowIndex].values[colIndex] = val;
    setData(newData);
  };

  // ── Handler: Expansão ───────────────────────────────────────────────────
  const toggleExpansao = (ilha) => {
    if (!isEditing) return;
    const cIdx = ilhasNomes.indexOf(ilha);
    let totalAtual = 0;
    data.forEach(r => totalAtual += parseInt(r.values[cIdx]) || 0);
    if (expansoes[ilha] && totalAtual > 6) {
      showToast(`ERRO: A ilha já tem ${totalAtual} edifícios.`, 'error'); return;
    }
    setExpansoes({ ...expansoes, [ilha]: !expansoes[ilha] });
  };

  const handleNivelChange = (tipo, valor) => {
    if (!isEditing) return;
    setNiveis({ ...niveis, [tipo]: valor });
  };

  // ── Totais ──────────────────────────────────────────────────────────────
  let totais = { casas: 0, fontes: 0, guarnicoes: 0, fazendas: 0, minas: 0, pedreiras: 0, serrarias: 0, perolas: 0 };
  let cidPrinc = 5; let sitPrinc = 0; let cidAgua = 0; let sitAgua = 0;
  let totFogo = 0;  let totBella = 0; let totTerra = 0;

  data.forEach(row => {
    const isRT = tiposRecursoTerrestre.includes(row.type);
    const isRA = row.type === 'perolas';
    const isCid = tiposCidade.includes(row.type);
    row.values.forEach((val, i) => {
      const num = parseInt(val) || 0;
      if (i === 0) { if (isRT) sitPrinc += num; if (isCid) cidPrinc += num; }
      else if (i === 1) totFogo  += num;
      else if (i === 2) { if (isRA) sitAgua += num; if (isCid) cidAgua += num; }
      else if (i === 3) totBella += num;
      else if (i === 4) totTerra += num;
    });
  });

  data.forEach(row => {
    row.values.forEach(val => { totais[row.type] += parseInt(val) || 0; });
  });

  // ── DB refs ─────────────────────────────────────────────────────────────
  const dbCasa = dbEdificios.Casa.find(e => e.nivel === niveis.casas)            || dbEdificios.Casa[0];
  const dbFonte = dbEdificios.FonteDaCura.find(e => e.nivel === niveis.fontes)   || dbEdificios.FonteDaCura[0];
  const dbFaz   = dbEdificios.Fazenda.find(e => e.nivel === niveis.fazendas)     || dbEdificios.Fazenda[0];
  const dbMin   = dbEdificios.Mina.find(e => e.nivel === niveis.minas)           || dbEdificios.Mina[0];
  const dbPed   = dbEdificios.Pedra.find(e => e.nivel === niveis.pedreiras)      || dbEdificios.Pedra[0];
  const dbSer   = dbEdificios.Serraria.find(e => e.nivel === niveis.serrarias)   || dbEdificios.Serraria[0];
  const dbPer   = dbEdificios.FazendaPerolas.find(e => e.nivel === niveis.perolas) || dbEdificios.FazendaPerolas[0];

  // ── Cálculos finais ─────────────────────────────────────────────────────
  const popTotal   = totais.casas * dbCasa.popAumento;
  const popUsada   = (totais.fazendas * dbFaz.pop) + (totais.minas * dbMin.pop) + (totais.pedreiras * dbPed.pop) + (totais.serrarias * dbSer.pop) + (totais.perolas * dbPer.pop);
  const popLivre   = popTotal - popUsada;
  const totalCura  = totais.fontes * dbFonte.maxTropas;
  const prodComida = (totais.fazendas  * dbFaz.prodHora) + (territorios.fazendas  * 2750);
  const prodFerro  = (totais.minas     * dbMin.prodHora) + (territorios.minas     * 2750);
  const prodPedra  = (totais.pedreiras * dbPed.prodHora) + (territorios.pedreiras * 2750);
  const prodMadeira= (totais.serrarias * dbSer.prodHora) + (territorios.serrarias * 2750);
  const prodPerolas= totais.perolas * dbPer.prodHora;

  const formatNumber = (n) => n.toLocaleString('pt-BR');

  // ─────────────────────────────────────────────────────────────────────────
  // SUB-COMPONENTE: Linha de Produção (redesign parchment)
  // ─────────────────────────────────────────────────────────────────────────
  const ProdRow = ({ titulo, qtd, nivel, setNivel, maxNivel, ganhoLable, ganhoValor, cor, terrQtd, onTerrAdd, onTerrSub }) => (
    <Box sx={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      mb: 1, p: '10px 12px',
      bgcolor: C.BG_CARD,
      borderRadius: '8px',
      border: `1px solid ${C.BORDER_SOFT}`,
      borderLeft: `4px solid ${cor}`,
      boxShadow: '0 1px 3px rgba(62,47,28,0.08)',
    }}>
      {/* Esquerda: nome + nível */}
      <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: '110px' }}>
        <Typography sx={{ color: C.TEXT_PRIMARY, fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.3px' }}>
          {titulo.toUpperCase()} <span style={{ color: cor, fontWeight: 900 }}>({qtd})</span>
        </Typography>
        <Select
          size="small"
          value={nivel}
          onChange={(e) => setNivel(e.target.value)}
          disabled={!isEditing}
          sx={{
            height: '22px', mt: 0.4,
            color: C.TEXT_SECONDARY, fontSize: '0.7rem', fontWeight: 700,
            bgcolor: isEditing ? C.BG_INPUT : 'transparent',
            '& .MuiOutlinedInput-notchedOutline': { borderColor: isEditing ? C.BORDER : 'transparent' },
          }}
        >
          {[...Array(maxNivel)].map((_, i) => (
            <MenuItem key={i + 1} value={i + 1}>Nível {i + 1}</MenuItem>
          ))}
        </Select>
      </Box>

      {/* Centro: territórios */}
      <Box sx={{ display: 'flex', justifyContent: 'center', flex: 1 }}>
        {terrQtd !== undefined && (
          <Box sx={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            bgcolor: C.BG_SECONDARY, px: 1.5, py: 0.5, borderRadius: '6px',
            border: `1px solid ${C.BORDER_SOFT}`,
          }}>
            <Typography sx={{ color: C.TEXT_MUTED, fontSize: '0.5rem', fontWeight: 900, textTransform: 'uppercase', mb: 0.3, letterSpacing: '0.8px' }}>
              TERRIT.
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
              <IconButton
                size="small"
                onClick={onTerrSub}
                disabled={!isEditing || terrQtd === 0}
                sx={{
                  width: 20, height: 20, borderRadius: '4px',
                  bgcolor: C.BG_CARD, border: `1px solid ${C.BORDER_SOFT}`,
                  color: C.ERROR, opacity: (!isEditing || terrQtd === 0) ? 0.3 : 1,
                  '&:hover': { bgcolor: '#FDECEA' },
                }}
              >
                <Typography sx={{ fontWeight: 900, fontSize: '0.9rem', lineHeight: 1 }}>−</Typography>
              </IconButton>
              <Typography sx={{ color: C.TEXT_PRIMARY, fontSize: '0.85rem', fontWeight: 900, minWidth: '14px', textAlign: 'center', fontFamily: 'monospace' }}>
                {terrQtd}
              </Typography>
              <IconButton
                size="small"
                onClick={onTerrAdd}
                disabled={!isEditing || terrLivres === 0}
                sx={{
                  width: 20, height: 20, borderRadius: '4px',
                  bgcolor: C.BG_CARD, border: `1px solid ${C.BORDER_SOFT}`,
                  color: C.SUCCESS, opacity: (!isEditing || terrLivres === 0) ? 0.3 : 1,
                  '&:hover': { bgcolor: '#F0FAF0' },
                }}
              >
                <Typography sx={{ fontWeight: 900, fontSize: '0.9rem', lineHeight: 1 }}>+</Typography>
              </IconButton>
            </Box>
          </Box>
        )}
      </Box>

      {/* Direita: produção */}
      <Box sx={{ textAlign: 'right', minWidth: '90px' }}>
        <Typography sx={{ color: C.TEXT_MUTED, fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
          {ganhoLable}
        </Typography>
        <Typography sx={{ color: cor, fontSize: '1rem', fontWeight: 900, lineHeight: 1.1, fontFamily: 'monospace' }}>
          {formatNumber(ganhoValor)}
          <span style={{ fontSize: '0.6rem', color: C.TEXT_MUTED }}> /h</span>
        </Typography>
        <Typography sx={{ color: C.TEXT_MUTED, fontSize: '0.6rem', fontWeight: 700 }}>
          {formatNumber(ganhoValor * 24)} /dia
        </Typography>
      </Box>
    </Box>
  );

  // ─────────────────────────────────────────────────────────────────────────
  // SUB-COMPONENTE: Card de Infra (Fortaleza, Casas, Fontes)
  // ─────────────────────────────────────────────────────────────────────────
  const InfraRow = ({ label, qtd, tipo, maxNivel, children }) => (
    <Box sx={{
      mb: 1.5, p: '10px 14px',
      bgcolor: C.BG_CARD,
      borderRadius: '8px',
      border: `1px solid ${C.BORDER_SOFT}`,
      boxShadow: '0 1px 3px rgba(62,47,28,0.07)',
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography sx={{ color: C.TEXT_PRIMARY, fontWeight: 700, fontSize: '0.82rem' }}>
          {label}{qtd !== undefined && <span style={{ color: C.ACCENT, marginLeft: 4 }}>({qtd})</span>}
        </Typography>
        <Select
          size="small"
          value={niveis[tipo]}
          onChange={(e) => handleNivelChange(tipo, e.target.value)}
          disabled={!isEditing}
          sx={{
            height: '22px',
            color: C.ACCENT, fontSize: '0.7rem', fontWeight: 700,
            bgcolor: isEditing ? C.BG_INPUT : 'transparent',
            '& .MuiOutlinedInput-notchedOutline': { borderColor: isEditing ? C.BORDER : 'transparent' },
          }}
        >
          {[...Array(maxNivel)].map((_, i) => (
            <MenuItem key={i + 1} value={i + 1}>Nível {i + 1}</MenuItem>
          ))}
        </Select>
      </Box>
      {children}
    </Box>
  );

  // ═══════════════════════════════════════════════════════════════════════
  // RENDER PRINCIPAL
  // ═══════════════════════════════════════════════════════════════════════
  return (
    <Box sx={{ maxWidth: 900, margin: 'auto', pb: 4, px: 0.5 }}>

      {/* ── Toast ──────────────────────────────────────────────────────── */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={closeToast}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        TransitionComponent={SlideTransition}
        sx={{ mt: 7 }}
      >
        <Alert onClose={closeToast} severity={toast.severity} variant="filled"
          sx={{ fontWeight: 800, border: `2px solid ${C.BORDER_SOFT}` }}>
          {toast.message}
        </Alert>
      </Snackbar>

      {/* ── Dialog de confirmação ───────────────────────────────────────── */}
      <Dialog
        open={dialogConfig.open}
        onClose={() => setDialogConfig({ ...dialogConfig, open: false })}
        PaperProps={{
          sx: {
            bgcolor: C.BG_CARD, borderRadius: '10px',
            border: `2px solid ${C.BORDER_STRONG}`,
            p: 1, minWidth: '300px',
          },
        }}
      >
        <DialogTitle sx={{
          color: dialogConfig.type === 'clear' ? C.ERROR : C.TEXT_PRIMARY,
          fontWeight: 900, fontSize: '1rem', letterSpacing: '1px',
          fontFamily: '"Nunito", sans-serif',
        }}>
          {dialogConfig.title}
        </DialogTitle>
        <DialogContent sx={{ mt: 0.5 }}>
          <DialogContentText sx={{ color: C.TEXT_SECONDARY, fontSize: '0.9rem', fontWeight: 500 }}>
            {dialogConfig.text}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1.5 }}>
          <Button
            onClick={() => setDialogConfig({ ...dialogConfig, open: false })}
            sx={{ color: C.TEXT_MUTED, fontWeight: 700 }}
          >
            CANCELAR
          </Button>
          <Button
            onClick={confirmAction}
            variant="contained"
            color={dialogConfig.type === 'clear' ? 'error' : 'info'}
            sx={{ fontWeight: 900, borderRadius: '6px' }}
          >
            CONFIRMAR
          </Button>
        </DialogActions>
      </Dialog>

      {/* ══════════════════════════════════════════════════════════════════
          SECÇÃO 1 — CABEÇALHO + CONTROLO DE EDIÇÃO
          ══════════════════════════════════════════════════════════════════ */}
      <Card sx={{
        mb: 2, p: 0, overflow: 'hidden',
        border: `1.5px solid ${C.BORDER}`,
        bgcolor: C.BG_CARD,
        boxShadow: '0 2px 8px rgba(62,47,28,0.12)',
      }}>
        <GameHeader title="Gestão de Ilhas e Recursos" />

        {/* Barra de modo */}
        <Box sx={{
          px: 2, py: 1.5,
          bgcolor: C.BG_SECONDARY,
          borderTop: `1px solid ${C.BORDER_SOFT}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography sx={{ fontSize: '1.6rem' }}>🏝️</Typography>
            <Box>
              <Typography sx={{ color: C.TEXT_MUTED, fontSize: '0.6rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>
                STATUS
              </Typography>
              <Box sx={{
                display: 'inline-flex', alignItems: 'center', gap: 0.5,
                px: 1, py: 0.25, borderRadius: '4px',
                bgcolor: isEditing ? 'rgba(200,148,10,0.12)' : 'rgba(90,138,92,0.12)',
                border: `1px solid ${isEditing ? C.WARNING : C.SUCCESS}`,
              }}>
                <Box sx={{
                  width: 6, height: 6, borderRadius: '50%',
                  bgcolor: isEditing ? C.WARNING : C.SUCCESS,
                  boxShadow: `0 0 4px ${isEditing ? C.WARNING : C.SUCCESS}`,
                }} />
                <Typography sx={{
                  color: isEditing ? C.WARNING : C.SUCCESS,
                  fontWeight: 900, fontSize: '0.7rem', fontFamily: '"Nunito", sans-serif',
                  letterSpacing: '0.5px',
                }}>
                  {isEditing ? 'EDIÇÃO ATIVA' : 'DADOS TRAVADOS'}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            {isEditing ? (
              <Button variant="contained" color="primary" onClick={() => requestAction('save')}
                sx={{ fontWeight: 900, fontSize: '0.7rem', height: '32px', px: 1.5 }}>
                ⚔ Travar
              </Button>
            ) : (
              <Button variant="outlined" color="primary" onClick={() => setIsEditing(true)}
                sx={{ fontWeight: 900, fontSize: '0.7rem', height: '32px', px: 1.5, bgcolor: C.BG_INPUT }}>
                ✏ Editar
              </Button>
            )}
            <Button variant="outlined" color="error" onClick={() => requestAction('clear')}
              sx={{ fontWeight: 900, fontSize: '0.7rem', height: '32px', px: 1.5, bgcolor: C.BG_INPUT }}>
              🗑 Limpar
            </Button>
          </Box>
        </Box>
      </Card>

      {/* ══════════════════════════════════════════════════════════════════
          SECÇÃO 2 — EXPANSÕES
          ══════════════════════════════════════════════════════════════════ */}
      <Card sx={{
        mb: 2, p: '12px 14px',
        bgcolor: C.BG_CARD,
        border: `1.5px solid ${C.BORDER}`,
        boxShadow: '0 2px 6px rgba(62,47,28,0.08)',
      }}>
        <Typography sx={{
          color: C.TEXT_MUTED, fontWeight: 900, fontSize: '0.80rem',
          textTransform: 'uppercase', letterSpacing: '1.5px', mb: 1.5,
          fontFamily: '"Nunito", sans-serif',
        }}>
          ◆ Expansões de Ilhas
        </Typography>

        <Box sx={{
          display: 'flex', gap: 1.5, flexWrap: 'nowrap',
          overflowX: 'auto', pb: 0.5,
          '&::-webkit-scrollbar': { height: '4px' },
          '&::-webkit-scrollbar-thumb': { backgroundColor: C.BORDER, borderRadius: '4px' },
        }}>
          {['FOGO', 'BELLA', 'TERRA'].map(ilha => {
            const meta = ILHA_META[ilha];
            const ativo = expansoes[ilha];
            return (
              <Box
                key={ilha}
                onClick={() => toggleExpansao(ilha)}
                sx={{
                  flexShrink: 0,
                  display: 'flex', alignItems: 'center', gap: 1,
                  px: 1.5, py: 0.8,
                  borderRadius: '8px',
                  cursor: isEditing ? 'pointer' : 'default',
                  border: `1.5px solid ${ativo ? meta.color : C.BORDER_SOFT}`,
                  bgcolor: ativo ? meta.lightBg : C.BG_SECONDARY,
                  opacity: isEditing ? 1 : 0.75,
                  transition: 'all 0.15s ease',
                  boxShadow: ativo ? `0 0 8px ${meta.color}30` : 'none',
                }}
              >
                <Typography sx={{ fontSize: '1rem' }}>{meta.icon}</Typography>
                <Box>
                  <Typography sx={{
                    color: ativo ? meta.color : C.TEXT_MUTED,
                    fontWeight: 900, fontSize: '0.7rem',
                    fontFamily: '"Nunito", sans-serif', lineHeight: 1,
                  }}>
                    ILHA DE {ilha}
                  </Typography>
                  <Typography sx={{
                    color: ativo ? meta.color : C.TEXT_FAINT,
                    fontSize: '0.75rem', fontWeight: 700, mt: 0.2,
                  }}>
                    {ativo ? '✓ Desbloqueada' : '✗ Bloqueada'}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Card>

      {/* ══════════════════════════════════════════════════════════════════
          SECÇÃO 3 — INDICADORES DE LIMITE
          ══════════════════════════════════════════════════════════════════ */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, mb: 2 }}>
        {[
          { label: 'CID. PRINC', val: cidPrinc,  max: limCidPrinc,      icon: '🏙' },
          { label: 'SÍTIO PRINC', val: sitPrinc, max: limiteSipioPrinc, icon: '🌾' },
          { label: 'CID. ÁGUA',   val: cidAgua,  max: limCidAgua,       icon: '🌊' },
          { label: 'SÍTIO ÁGUA',  val: sitAgua,  max: limSitioAgua,     icon: '🔮' },
        ].map(({ label, val, max, icon }) => {
          const cheio = val >= max;
          return (
            <Box key={label} sx={{
              display: 'flex', alignItems: 'center', gap: 0.8,
              px: 1.2, py: 0.6,
              borderRadius: '6px',
              bgcolor: cheio ? 'rgba(200,148,10,0.08)' : C.BG_CARD,
              border: `1px solid ${cheio ? C.WARNING : C.BORDER_SOFT}`,
              boxShadow: cheio ? `0 0 6px ${C.WARNING}30` : 'none',
            }}>
              <Typography sx={{ fontSize: '0.7rem' }}>{icon}</Typography>
              <Box>
                <Typography sx={{ color: C.TEXT_MUTED, fontSize: '0.5rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.6px', lineHeight: 1 }}>
                  {label}
                </Typography>
                <Typography sx={{
                  color: cheio ? C.WARNING : C.TEXT_PRIMARY,
                  fontSize: '0.75rem', fontWeight: 900, fontFamily: 'monospace', lineHeight: 1.1,
                }}>
                  {val}/{max}
                  {cheio && <span style={{ fontSize: '0.75rem', marginLeft: 3, color: C.WARNING }}>CHEIO</span>}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* ══════════════════════════════════════════════════════════════════
          SECÇÃO 4 — TABELA DE EDIFÍCIOS
          ══════════════════════════════════════════════════════════════════ */}
      <Card sx={{
        mb: 3, overflow: 'hidden',
        border: `1.5px solid ${C.BORDER}`,
        bgcolor: C.BG_CARD,
        boxShadow: '0 2px 10px rgba(62,47,28,0.1)',
        opacity: isEditing ? 1 : 0.85,
      }}>
        <GameHeader title="Distribuição de Edifícios" fontSize="0.85rem" />

        <TableContainer sx={{
          overflowX: 'auto',
          '&::-webkit-scrollbar': { height: '6px' },
          '&::-webkit-scrollbar-thumb': { backgroundColor: C.BORDER, borderRadius: '4px' },
          '&::-webkit-scrollbar-track': { backgroundColor: C.BG_SECONDARY },
        }}>
          <Table size="small" sx={{ minWidth: 380, tableLayout: 'fixed' }}>

            {/* Cabeçalho */}
            <TableHead>
              <TableRow sx={{ bgcolor: C.BG_SECONDARY }}>
                <TableCell sx={{
                  position: 'sticky', left: 0, zIndex: 2,
                  bgcolor: C.BG_SECONDARY,
                  color: C.TEXT_MUTED, fontWeight: 900, fontSize: '0.6rem',
                  letterSpacing: '1px', textTransform: 'uppercase',
                  borderBottom: `2px solid ${C.BORDER}`,
                  borderRight: `1px solid ${C.BORDER_SOFT}`,
                  py: 1.2, px: 1, width: '22%',
                  fontFamily: '"Nunito", sans-serif',
                }}>
                  EDIFÍCIO
                </TableCell>

                {ilhasNomes.map((ilha, idx) => {
                  const meta = ILHA_META[ilha];
                  const totIlha = [totFogo, totBella, totTerra];
                  const limIlha =
                    idx === 1 ? (expansoes.FOGO  ? 12 : 6) :
                    idx === 3 ? (expansoes.BELLA ? 12 : 6) :
                    idx === 4 ? (expansoes.TERRA ? 12 : 6) : null;

                  return (
                    <TableCell align="center" key={ilha} sx={{
                      bgcolor: C.BG_SECONDARY,
                      borderBottom: `2px solid ${C.BORDER}`,
                      borderLeft: idx === 0 ? 'none' : `1px solid ${C.BORDER_SOFT}`,
                      py: 1, px: 0.5, width: `${78 / 5}%`,
                    }}>
                      <Typography sx={{ fontSize: '0.9rem', lineHeight: 1 }}>{meta.icon}</Typography>
                      <Typography sx={{
                        color: meta.color, fontWeight: 900, fontSize: '0.6rem',
                        fontFamily: '"Nunito", sans-serif', lineHeight: 1.1,
                        letterSpacing: '0.5px',
                      }}>
                        {ilha}
                      </Typography>
                      {limIlha !== null && (
                        <Typography sx={{ color: C.TEXT_FAINT, fontSize: '0.5rem', fontWeight: 700 }}>
                          {limIlha === 12 ? '12' : '6'} lotes
                        </Typography>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>

            {/* Corpo */}
            <TableBody>
              {data.map((row, rIdx) => {
                const tipoCor = TIPO_COR[row.type];
                const isRecurso = !!tipoCor;

                return (
                  <TableRow key={row.id} sx={{
                    bgcolor: isRecurso ? tipoCor.bg : (rIdx % 2 === 0 ? C.BG_CARD : C.BG_SECONDARY),
                    '&:hover': { bgcolor: isRecurso ? tipoCor.bg : C.BG_CARD_TOP },
                  }}>
                    {/* Nome */}
                    <TableCell component="th" scope="row" sx={{
                      position: 'sticky', left: 0, zIndex: 1,
                      bgcolor: isRecurso ? tipoCor.bg : (rIdx % 2 === 0 ? C.BG_CARD : C.BG_SECONDARY),
                      color: isRecurso ? tipoCor.accent : C.TEXT_PRIMARY,
                      fontWeight: 700, fontSize: '0.80rem',
                      borderBottom: `1px solid ${C.BORDER_SOFT}`,
                      borderRight: `1px solid ${C.BORDER_SOFT}`,
                      borderLeft: isRecurso ? `4px solid ${tipoCor.accent}` : `4px solid transparent`,
                      py: 1, px: 1,
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                      {isRecurso && <span style={{ marginRight: 4 }}>{tipoCor.label}</span>}
                      {row.name}
                    </TableCell>

                    {/* Células */}
                    {row.values.map((val, cIdx) => (
                      <TableCell align="center" key={cIdx} sx={{
                        borderBottom: `1px solid ${C.BORDER_SOFT}`,
                        borderLeft: `1px solid ${C.BORDER_SOFT}`,
                        p: '4px 3px',
                      }}>
                        {isAllowed(row.type, cIdx) ? (
                          <input
                            type="text"
                            inputMode="numeric"
                            value={val}
                            onChange={(e) => handleChange(rIdx, cIdx, e.target.value)}
                            disabled={!isEditing}
                            style={{
                              width: '100%', minWidth: '28px', maxWidth: '40px',
                              backgroundColor: isEditing ? C.BG_INPUT : 'transparent',
                              border: isEditing
                                ? `1px solid ${isRecurso ? tipoCor.accent : C.BORDER}`
                                : 'none',
                              color: isRecurso ? tipoCor.accent : C.TEXT_PRIMARY,
                              borderRadius: '4px',
                              padding: '5px 2px',
                              textAlign: 'center',
                              outline: 'none',
                              fontWeight: 700,
                              fontFamily: 'monospace',
                              fontSize: '0.85rem',
                              cursor: isEditing ? 'text' : 'default',
                            }}
                          />
                        ) : (
                          <Typography sx={{ color: C.TEXT_FAINT, fontWeight: 700, fontSize: '0.75rem' }}>—</Typography>
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}

              {/* Edifícios Fixos */}
              {fixos.map((nome, idx) => (
                <TableRow key={nome} sx={{
                  bgcolor: C.BG_SECONDARY, opacity: 0.75,
                }}>
                  <TableCell component="th" scope="row" sx={{
                    position: 'sticky', left: 0, zIndex: 1,
                    bgcolor: C.BG_SECONDARY,
                    color: C.TEXT_MUTED,
                    fontWeight: 700, fontSize: '0.78rem', fontStyle: 'italic',
                    borderBottom: idx === fixos.length - 1 ? 'none' : `1px solid ${C.BORDER_SOFT}`,
                    borderRight: `1px solid ${C.BORDER_SOFT}`,
                    borderLeft: '4px solid transparent',
                    py: 0.8, px: 1,
                  }}>
                    {nome}
                  </TableCell>
                  {ilhasNomes.map((ilha, cIdx) => (
                    <TableCell align="center" key={ilha} sx={{
                      borderBottom: idx === fixos.length - 1 ? 'none' : `1px solid ${C.BORDER_SOFT}`,
                      borderLeft: `1px solid ${C.BORDER_SOFT}`,
                      p: '3px',
                    }}>
                      <Typography sx={{
                        color: cIdx === 0 ? C.ACCENT : C.TEXT_FAINT,
                        fontWeight: 900, fontFamily: 'monospace', fontSize: '0.8rem',
                      }}>
                        {cIdx === 0 ? '1' : '—'}
                      </Typography>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* ══════════════════════════════════════════════════════════════════
          SECÇÃO 5 — PAINÉIS INFERIORES
          ══════════════════════════════════════════════════════════════════ */}
      <Grid container spacing={2}>

        {/* ── Infraestrutura ─────────────────────────────────────────── */}
        <Grid item xs={12} md={5}>
          <Card sx={{
            p: 0, bgcolor: C.BG_CARD, height: '100%',
            border: `1.5px solid ${C.BORDER}`,
            boxShadow: '0 2px 8px rgba(62,47,28,0.1)',
          }}>
            <GameHeader title="Infraestrutura" fontSize="0.85rem" />
            <Box sx={{ p: 1.5 }}>

              <InfraRow label="Fortaleza" tipo="fortaleza" maxNivel={20}>
                <Typography sx={{ color: C.TEXT_MUTED, fontSize: '0.78rem', mt: 0.5, fontWeight: 600 }}>
                  Sítio: <span style={{ color: C.ACCENT, fontWeight: 900 }}>{limiteSipioPrinc}</span> lotes
                  &nbsp;·&nbsp; Territórios: <span style={{ color: C.ACCENT, fontWeight: 900 }}>{maxTerritorios}</span>
                </Typography>
              </InfraRow>

              <InfraRow label="Casas" qtd={totais.casas} tipo="casas" maxNivel={30}>
                <Typography sx={{ color: C.TEXT_MUTED, fontSize: '0.78rem', mt: 0.5, fontWeight: 600 }}>
                  +<span style={{ color: C.ACCENT_DEEP, fontWeight: 900 }}>{dbCasa.popAumento}</span> hab./edifício
                </Typography>
              </InfraRow>

              <InfraRow label="Fontes de Cura" qtd={totais.fontes} tipo="fontes" maxNivel={35}>
                <Typography sx={{ color: C.TEXT_MUTED, fontSize: '0.78rem', mt: 0.5, fontWeight: 600 }}>
                  Cura total: <span style={{ color: C.HEALTH, fontWeight: 900 }}>{formatNumber(totalCura)}</span> tropas
                </Typography>
              </InfraRow>

              <Divider sx={{ borderColor: C.BORDER_SOFT, my: 1.5 }} />

              {/* Pop + Territórios */}
              {[
                { label: 'Pop. ativa',        val: `${formatNumber(popUsada)} / ${formatNumber(popTotal)}`, color: C.TEXT_PRIMARY },
                { label: 'Territórios usados', val: `${terrUsados} / ${maxTerritorios}`,                    color: terrUsados >= maxTerritorios ? C.ERROR : C.TEXT_PRIMARY },
              ].map(({ label, val, color }) => (
                <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8, px: 0.5 }}>
                  <Typography sx={{ color: C.TEXT_MUTED, fontSize: '0.80rem', fontWeight: 700 }}>{label}</Typography>
                  <Typography sx={{ color, fontSize: '0.8rem', fontWeight: 900, fontFamily: 'monospace' }}>{val}</Typography>
                </Box>
              ))}

              {/* Pop livre */}
              <Box sx={{
                display: 'flex', justifyContent: 'space-between', mt: 1.5, p: '10px 14px',
                bgcolor: popLivre < 0 ? 'rgba(168,60,44,0.08)' : 'rgba(90,138,92,0.08)',
                borderRadius: '8px',
                border: `1px solid ${popLivre < 0 ? C.ERROR : C.SUCCESS}`,
              }}>
                <Typography sx={{ color: popLivre < 0 ? C.ERROR : C.SUCCESS, fontSize: '0.78rem', fontWeight: 900 }}>
                  👥 Pop. livre
                </Typography>
                <Typography sx={{ color: popLivre < 0 ? C.ERROR : C.SUCCESS, fontSize: '1rem', fontWeight: 900, fontFamily: 'monospace' }}>
                  {formatNumber(popLivre)}
                </Typography>
              </Box>

            </Box>
          </Card>
        </Grid>

        {/* ── Produção ───────────────────────────────────────────────── */}
        <Grid item xs={12} md={7}>
          <Card sx={{
            p: 0, bgcolor: C.BG_CARD, height: '100%',
            border: `1.5px solid ${C.BORDER}`,
            boxShadow: '0 2px 8px rgba(62,47,28,0.1)',
          }}>
            <GameHeader title="Produção de Recursos" fontSize="0.85rem" />
            <Box sx={{ p: 1.5 }}>
              <ProdRow titulo="Fazendas"  qtd={totais.fazendas}  nivel={niveis.fazendas}  setNivel={v => handleNivelChange('fazendas', v)}  maxNivel={35} ganhoLable="COMIDA"  ganhoValor={prodComida}  cor={TIPO_COR.fazendas.accent}  terrQtd={territorios.fazendas}  onTerrAdd={() => alteraTerritorio('fazendas', 1)}  onTerrSub={() => alteraTerritorio('fazendas', -1)} />
              <ProdRow titulo="Minas"     qtd={totais.minas}     nivel={niveis.minas}     setNivel={v => handleNivelChange('minas', v)}     maxNivel={35} ganhoLable="FERRO"   ganhoValor={prodFerro}   cor={TIPO_COR.minas.accent}     terrQtd={territorios.minas}     onTerrAdd={() => alteraTerritorio('minas', 1)}     onTerrSub={() => alteraTerritorio('minas', -1)} />
              <ProdRow titulo="Pedreiras" qtd={totais.pedreiras} nivel={niveis.pedreiras} setNivel={v => handleNivelChange('pedreiras', v)} maxNivel={35} ganhoLable="PEDRA"   ganhoValor={prodPedra}   cor={TIPO_COR.pedreiras.accent} terrQtd={territorios.pedreiras} onTerrAdd={() => alteraTerritorio('pedreiras', 1)} onTerrSub={() => alteraTerritorio('pedreiras', -1)} />
              <ProdRow titulo="Serrarias" qtd={totais.serrarias} nivel={niveis.serrarias} setNivel={v => handleNivelChange('serrarias', v)} maxNivel={35} ganhoLable="MADEIRA" ganhoValor={prodMadeira} cor={TIPO_COR.serrarias.accent} terrQtd={territorios.serrarias} onTerrAdd={() => alteraTerritorio('serrarias', 1)} onTerrSub={() => alteraTerritorio('serrarias', -1)} />
              <ProdRow titulo="F. Pérolas" qtd={totais.perolas}  nivel={niveis.perolas}   setNivel={v => handleNivelChange('perolas', v)}   maxNivel={20} ganhoLable="PÉROLAS" ganhoValor={prodPerolas} cor={TIPO_COR.perolas.accent} />
            </Box>
          </Card>
        </Grid>

      </Grid>
    </Box>
  );
};

export default Ilhas;
