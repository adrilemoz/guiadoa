import React, { useState } from 'react';
import { Alert, Box, Button, Card, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, List, ListItem, ListItemIcon, ListItemText, Snackbar, Typography } from '@mui/material';
import GameHeader from './shared/GameHeader.jsx';
import { C } from '../theme.js';

const Sobre = () => {
  const [openApoio, setOpenApoio] = useState(false);
  const [openContato, setOpenContato] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const showToast = (message, severity = 'success') => setToast({ open: true, message, severity });
  const closeToast = () => setToast({ ...toast, open: false });

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    showToast(`${type} copiado com sucesso!`, 'success');
  };

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', pb: 4 }}>

      {/* Toast */}
      <Snackbar open={toast.open} autoHideDuration={3000} onClose={closeToast} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} sx={{ mt: 7 }}>
        <Alert onClose={closeToast} severity={toast.severity} variant="filled" sx={{ width: '100%', fontWeight: 'bold' }}>
          {toast.message}
        </Alert>
      </Snackbar>

      {/* Pop-up: Apoiar Projeto (PIX) */}
      <Dialog open={openApoio} onClose={() => setOpenApoio(false)} PaperProps={{ sx: { bgcolor: C.BG_CARD, borderRadius: '8px', border: '3px solid #c8940a', p: 1, textAlign: 'center' } }}>
        <DialogTitle sx={{ color: '#B8965A', fontWeight: 900, fontSize: '1.3rem', pb: 0 }}>💎 Apoiar o Projeto</DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem', fontWeight: 'bold', mb: 2 }}>
            Este Quartel-General é mantido com esforço e dedicação. Se este guia ajudou nas suas batalhas, considere pagar um café ao desenvolvedor!
          </Typography>
          <Box sx={{ p: 2, bgcolor: C.BG_CARD, borderRadius: '6px', border: `2px dashed ${C.BORDER}` }}>
            <Typography sx={{ color: 'text.primary', fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', mb: 0.5 }}>Chave PIX:</Typography>
            <Typography sx={{ color: 'primary.main', fontSize: '1.3rem', fontWeight: 900, fontFamily: 'monospace', letterSpacing: '1px' }}>
              37991260524
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button onClick={() => setOpenApoio(false)} sx={{ color: 'text.secondary', fontWeight: 900 }}>Fechar</Button>
          <Button variant="contained" color="success" onClick={() => handleCopy('37991260524', 'Chave PIX')} sx={{ fontWeight: 900 }}>Copiar PIX</Button>
        </DialogActions>
      </Dialog>

      {/* Pop-up: Contato */}
      <Dialog open={openContato} onClose={() => setOpenContato(false)} PaperProps={{ sx: { bgcolor: C.BG_CARD, borderRadius: '8px', border: '3px solid #c8940a', p: 1, textAlign: 'center' } }}>
        <DialogTitle sx={{ color: 'primary.main', fontWeight: 900, fontSize: '1.3rem', pb: 0 }}>📬 Linha Direta</DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem', fontWeight: 'bold', mb: 2 }}>
            Encontrou algum erro nos cálculos? Tem uma sugestão tática? Envie uma mensagem diretamente para a engenharia central.
          </Typography>
          <Box sx={{ p: 2, bgcolor: C.BG_CARD, borderRadius: '6px', border: '2px dashed #c8940a' }}>
            <Typography sx={{ color: 'text.primary', fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', mb: 0.5 }}>E-mail de Suporte:</Typography>
            <Typography sx={{ color: 'primary.main', fontSize: '1.1rem', fontWeight: 900, fontFamily: 'monospace' }}>
              suporte@guiadoa.com
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button onClick={() => setOpenContato(false)} sx={{ color: 'text.secondary', fontWeight: 900 }}>Fechar</Button>
          <Button variant="contained" color="info" onClick={() => handleCopy('suporte@guiadoa.com', 'E-mail')} sx={{ fontWeight: 900 }}>Copiar E-mail</Button>
        </DialogActions>
      </Dialog>

      {/* 1. INFORMAÇÕES GERAIS */}
      <Card sx={{ mb: 3, p: 0, overflow: 'hidden' }}>
        <GameHeader title="Guia Tático DOA" />
        <Box sx={{ p: 3, bgcolor: C.BG_CARD, textAlign: 'center' }}>
          <Typography sx={{ fontSize: '4rem', filter: 'drop-shadow(1px 2px 3px rgba(62,47,28,0.2))', lineHeight: 1, mb: 1 }}>
            🛡️
          </Typography>
          <Typography sx={{ fontWeight: 900, color: 'primary.main', fontSize: '1.5rem', textTransform: 'uppercase' }}>
            Versão 2.2.0
          </Typography>
          <Typography sx={{ fontWeight: 'bold', color: 'text.secondary', fontSize: '0.9rem', mb: 2 }}>
            Codinome: "Torre do Grande Dragão"
          </Typography>
          <Divider sx={{ borderColor: '#C8A96B', opacity: 0.5, mb: 2 }} />
          <Typography sx={{ fontSize: '0.85rem', color: 'text.primary', textAlign: 'justify', fontWeight: 'bold' }}>
            Este aplicativo foi forjado para auxiliar os Comandantes a otimizarem os seus recursos, planearem os seus ataques e dominarem os torneios com precisão matemática.
          </Typography>
        </Box>
      </Card>

      {/* 2. CHANGELOG */}
      <Card sx={{ mb: 3, p: 0, overflow: 'hidden' }}>
        <GameHeader title="Últimas Atualizações" />
        <Box sx={{ p: 2, bgcolor: C.BG_CARD }}>
          <List disablePadding>

            {/* v2.2 — TORRE DO GRANDE DRAGÃO */}
            <ListItem sx={{ alignItems: 'flex-start', px: 0, pb: 2 }}>
              <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}><Typography sx={{ fontSize: '1.5rem' }}>🏰</Typography></ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Chip label="v2.2.0" size="small" sx={{ bgcolor: '#5a1a0a', color: '#ffb080', fontWeight: 'bold', border: '1px solid #c84020' }} />
                    <Typography sx={{ fontWeight: 900, color: 'primary.main' }}>Torre do Grande Dragão — Dados Completos</Typography>
                  </Box>
                }
                secondary={<Typography component="span" sx={{ fontSize: '0.8rem', color: 'text.secondary', fontWeight: 'bold' }}>Página do Grande Dragão expandida com dados reais do jogo: Atributos Base (Vida, Defesa, Ataque, Alcance, Velocidade), 5 Habilidades reais (Disparo de Fogo, Fortaleza Inexpugnável, Grande Inferno, Proteção, Orbe de Proteção) com painel Nível atual vs Nível máx. interativo (toque para expandir), XP bar, badges de Efeito de Batalha e Efeito em Campo. Itens de Alimentação (Touro Vermelho, Ossos Roxos, Chamado do Dragão, Transformar). DragaoDetalhe.jsx agora é totalmente modular e suporta dragões com dados parciais.</Typography>}
              />
            </ListItem>
            <Divider sx={{ borderColor: '#C8A96B', opacity: 0.3, mb: 2 }} />

            {/* v2.1 — BESTIÁRIO DRACÔNICO */}
            <ListItem sx={{ alignItems: 'flex-start', px: 0, pb: 2 }}>
              <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}><Typography sx={{ fontSize: '1.5rem' }}>🐉</Typography></ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Chip label="v2.1.0" size="small" sx={{ bgcolor: '#3a1a5c', color: '#d4a0ff', fontWeight: 'bold', border: '1px solid #7b35c0' }} />
                    <Typography sx={{ fontWeight: 900, color: 'primary.main' }}>Bestiário Dracônico — Módulo Dragões</Typography>
                  </Box>
                }
                secondary={<Typography component="span" sx={{ fontSize: '0.8rem', color: 'text.secondary', fontWeight: 'bold' }}>Novo módulo de Dragões adicionado ao Arsenal. Tela de listagem com todos os dragões disponíveis, página de detalhe individual com Lore, Habilidades e Dicas Táticas. Novo banco de dados modular src/data/dragoes.js para fácil manutenção futura. Correção do caminho do favicon para path absoluto. Novos dragões serão adicionados progressivamente.</Typography>}
              />
            </ListItem>
            <Divider sx={{ borderColor: '#C8A96B', opacity: 0.3, mb: 2 }} />

            {/* v2.0 — ARSENAL MODULAR */}
            <ListItem sx={{ alignItems: 'flex-start', px: 0, pb: 2 }}>
              <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}><Typography sx={{ fontSize: '1.5rem' }}>🗂️</Typography></ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Chip label="v2.0.0" size="small" sx={{ bgcolor: '#1a3a5c', color: '#90caf9', fontWeight: 'bold', border: '1px solid #1565c0' }} />
                    <Typography sx={{ fontWeight: 900, color: 'primary.main' }}>Arsenal Modular — Refatoração do Core</Typography>
                  </Box>
                }
                secondary={<Typography component="span" sx={{ fontSize: '0.8rem', color: 'text.secondary', fontWeight: 'bold' }}>Banco de dados dividido em módulos especializados (tropas, níveis, reinos, edifícios) dentro de src/data/. O db.js virou barrel re-export — todos os imports existentes continuam funcionando sem alteração. Correção crítica no workflow de build do APK: ícones não eram copiados por checagem de arquivo inexistente (ic_launcher_round.png). Agora todos os PNGs e o XML adaptativo são aplicados corretamente para Android legacy e Android 8+.</Typography>}
              />
            </ListItem>
            <Divider sx={{ borderColor: '#C8A96B', opacity: 0.3, mb: 2 }} />

            {/* v1.9 */}
            <ListItem sx={{ alignItems: 'flex-start', px: 0, pb: 2 }}>
              <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}><Typography sx={{ fontSize: '1.5rem' }}>🏗️</Typography></ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Chip label="v1.9.0" size="small" sx={{ bgcolor: '#5a3a0a', color: '#FFF8EE', fontWeight: 'bold', border: '1px solid #8C6830' }} />
                    <Typography sx={{ fontWeight: 900, color: 'primary.main' }}>Grimório em Abas — Construções</Typography>
                  </Box>
                }
                secondary={<Typography component="span" sx={{ fontSize: '0.8rem', color: 'text.secondary', fontWeight: 'bold' }}>Página de Construções reformulada com o layout Grimório em Abas: banner escuro imersivo, seleção por ícones grandes em scroll horizontal e painel dividido entre Tabela de Evolução e Calculadora de Efeitos. Edifícios descritivos ocultam a calculadora automaticamente.</Typography>}
              />
            </ListItem>
            <Divider sx={{ borderColor: '#C8A96B', opacity: 0.3, mb: 2 }} />

            {/* v1.8 */}
            <ListItem sx={{ alignItems: 'flex-start', px: 0, pb: 2 }}>
              <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}><Typography sx={{ fontSize: '1.5rem' }}>🎨</Typography></ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Chip label="v1.8.0" size="small" sx={{ bgcolor: '#7a5a18', color: '#f0c030', fontWeight: 'bold', border: '1px solid #c8940a' }} />
                    <Typography sx={{ fontWeight: 900, color: 'primary.main' }}>Forja das Sombras Douradas</Typography>
                  </Box>
                }
                secondary={<Typography component="span" sx={{ fontSize: '0.8rem', color: 'text.secondary', fontWeight: 'bold' }}>Renovação visual completa: tema escuro/dourado medieval unificado em todas as telas. Novo AppBar com identidade GUIA DOA, ícone do app, fonte Cinzel. Cronômetro hero aplicado também na tela de Torneios. Tela inicial simplificada com informações de hora e fase numa linha compacta. Bordas afinadas e fundo mais quente.</Typography>}
              />
            </ListItem>
            <Divider sx={{ borderColor: '#C8A96B', opacity: 0.3, mb: 2 }} />

            {/* v1.7 */}
            <ListItem sx={{ alignItems: 'flex-start', px: 0, pb: 2 }}>
              <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}><Typography sx={{ fontSize: '1.5rem' }}>⚔️</Typography></ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Chip label="v1.7.0" size="small" sx={{ bgcolor: 'error.main', color: C.TEXT_PRIMARY, fontWeight: 'bold' }} />
                    <Typography sx={{ fontWeight: 900, color: 'primary.main' }}>Simulador de Guerra Completo</Typography>
                  </Box>
                }
                secondary={<Typography component="span" sx={{ fontSize: '0.8rem', color: 'text.secondary', fontWeight: 'bold' }}>Expansão da base de dados para 53 tropas com 10 atributos detalhados. Criação do Dossiê Militar, Duelos 1v1 visuais e do novo Construtor de Marchas.</Typography>}
              />
            </ListItem>
            <Divider sx={{ borderColor: '#C8A96B', opacity: 0.3, mb: 2 }} />

            {/* v1.6 */}
            <ListItem sx={{ alignItems: 'flex-start', px: 0, pb: 2 }}>
              <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}><Typography sx={{ fontSize: '1.5rem' }}>📈</Typography></ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Chip label="v1.6.0" size="small" sx={{ bgcolor: 'success.main', color: C.TEXT_PRIMARY, fontWeight: 'bold' }} />
                    <Typography sx={{ fontWeight: 900, color: 'primary.main' }}>Níveis & Ilhas Pro</Typography>
                  </Box>
                }
                secondary={<Typography component="span" sx={{ fontSize: '0.8rem', color: 'text.secondary', fontWeight: 'bold' }}>Módulos reformulados com tabelas inteligentes, colorimetria de recursos e sistema de salvamento contínuo com avisos de segurança.</Typography>}
              />
            </ListItem>
            <Divider sx={{ borderColor: '#C8A96B', opacity: 0.3, mb: 2 }} />

            {/* v1.5 */}
            <ListItem sx={{ alignItems: 'flex-start', px: 0 }}>
              <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}><Typography sx={{ fontSize: '1.5rem' }}>⏰</Typography></ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Chip label="v1.5.0" size="small" sx={{ bgcolor: 'info.main', color: C.TEXT_PRIMARY, fontWeight: 'bold' }} />
                    <Typography sx={{ fontWeight: 900, color: 'primary.main' }}>Cronômetro Sincronizado</Typography>
                  </Box>
                }
                secondary={<Typography component="span" sx={{ fontSize: '0.8rem', color: 'text.secondary', fontWeight: 'bold' }}>Sincronização automática com a Data e Hora Universal (UTC) baseada no fuso do Reino.</Typography>}
              />
            </ListItem>

          </List>
        </Box>
      </Card>

      {/* 3. ENGENHARIA DO SISTEMA */}
      <Card sx={{ mb: 3, p: 0, overflow: 'hidden' }}>
        <GameHeader title="Engenharia do Sistema" />
        <Box sx={{ p: 2, bgcolor: C.BG_CARD }}>
          <Typography sx={{ fontSize: '0.85rem', color: 'text.primary', mb: 2, fontWeight: 'bold', textAlign: 'center' }}>
            Construído para ser rápido, portátil e funcionar offline após o primeiro carregamento.
          </Typography>
          <Grid container spacing={1}>
            {[
              { t: "React JS",       d: "Motor de Interface UI" },
              { t: "Material UI v5", d: "Design Visual Tático" },
              { t: "Vite",           d: "Build & Dev Server" },
              { t: "Capacitor",      d: "Empacotamento Android" },
              { t: "LocalStorage",   d: "Persistência de Perfil" },
              { t: "Módulos ES",     d: "Dados em src/data/" },
              { t: "src/data/dragoes.js", d: "BD Modular de Dragões" },
            ].map((tech, i) => (
              <Grid item xs={6} key={i}>
                <Box sx={{ p: 1.5, bgcolor: C.BG_CARD, borderRadius: '6px', border: '1px solid #5a4010', textAlign: 'center', height: '100%', boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.4)' }}>
                  <Typography sx={{ fontWeight: 900, color: 'primary.main', fontSize: '0.9rem' }}>{tech.t}</Typography>
                  <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', fontWeight: 'bold' }}>{tech.d}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Card>

      {/* 4. BOTÕES DE SUPORTE E CONTATO */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6}>
          <Card elevation={0} sx={{ height: '100%', bgcolor: C.BG_CARD, border: '2px solid #c8940a', borderRadius: '8px', cursor: 'pointer', transition: 'transform 0.1s', '&:active': { transform: 'scale(0.95)' } }} onClick={() => setOpenApoio(true)}>
            <Box sx={{ p: 2, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography sx={{ fontSize: '2rem', mb: 0.5, lineHeight: 1 }}>💎</Typography>
              <Typography sx={{ color: '#B8965A', fontWeight: 900, fontSize: '0.9rem', textTransform: 'uppercase' }}>Apoiar Projeto</Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card elevation={0} sx={{ height: '100%', bgcolor: C.BG_CARD, border: '2px solid #c8940a', borderRadius: '8px', cursor: 'pointer', transition: 'transform 0.1s', '&:active': { transform: 'scale(0.95)' } }} onClick={() => setOpenContato(true)}>
            <Box sx={{ p: 2, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography sx={{ fontSize: '2rem', mb: 0.5, lineHeight: 1 }}>📬</Typography>
              <Typography sx={{ color: '#B8965A', fontWeight: 900, fontSize: '0.9rem', textTransform: 'uppercase' }}>Fale Conosco</Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* 5. AVISO LEGAL */}
      <Box sx={{ p: 2, bgcolor: C.BG_CARD, border: '2px dashed #A83C2C', borderRadius: '8px', textAlign: 'center', boxShadow: '0 3px 6px rgba(62,47,28,0.1)' }}>
        <Typography sx={{ color: '#e05030', fontWeight: 900, fontSize: '1rem', mb: 1, textTransform: 'uppercase' }}>
          ⚠️ Aviso Legal Oficial
        </Typography>
        <Typography sx={{ color: 'text.secondary', fontSize: '0.75rem', fontWeight: 'bold', lineHeight: 1.5 }}>
          Este aplicativo é uma ferramenta <b>não oficial</b> desenvolvida por e para a comunidade de jogadores. Não tem qualquer afiliação, patrocínio ou aprovação da <b>Deca Games</b>. Todas as imagens, nomes e lógicas matemáticas são interpretações da comunidade destinadas apenas a auxílio estratégico.
        </Typography>
      </Box>

    </Box>
  );
};

export default Sobre;
