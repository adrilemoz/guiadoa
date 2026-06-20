/**
 * Locale base PT-BR — fonte da verdade
 * Todas as chaves da Home estão aqui.
 * Para adicionar uma nova chave: adicione aqui e rode /api/traducoes/seed no admin.
 */
const ptBR = {
  // ── Saudação / header ──────────────────────────────────────────────────────
  'home.saudacao.bom_dia':    'Bom dia',
  'home.saudacao.boa_tarde':  'Boa tarde',
  'home.saudacao.boa_noite':  'Boa noite',
  'home.saudacao.comandante': 'Comandante',
  'home.saudacao.aviso':      'Sua aliança conta com você.',

  // ── Arsenal (grade de ferramentas) ────────────────────────────────────────
  'home.arsenal.titulo':      'Arsenal',
  'home.botao.torneios':      'Torneios',
  'home.botao.torneios.sub':  'Metas & rankings',
  'home.botao.tropas':        'Tropas',
  'home.botao.tropas.sub':    'Enciclopédia',
  'home.botao.dragoes':       'Dragões',
  'home.botao.dragoes.sub':   'Evolução & poder',
  'home.botao.edificios':     'Construções',
  'home.botao.edificios.sub': 'Níveis & efeitos',
  'home.botao.itens':         'Itens',
  'home.botao.itens.sub':     'Armazém',
  'home.botao.niveis':        'Níveis',
  'home.botao.niveis.sub':    'Tabela de XP',
  'home.botao.ilhas':         'Cidade',
  'home.botao.ilhas.sub':     'Sua ilha',
  'home.botao.pesquisas':     'Pesquisas',
  'home.botao.pesquisas.sub': 'Centro de Ciência',
  'home.botao.sobre':         'Info',
  'home.botao.sobre.sub':     'Sobre o app',
  'home.botao.dicas':         'Dicas',
  'home.botao.dicas.sub':     'Guias e tutoriais',
  'home.botao.texto_colorido':     'Texto Colorido',
  'home.botao.texto_colorido.sub': 'Builder de cores',

  // ── Conselheiro Tático ────────────────────────────────────────────────────
  'home.conselheiro.titulo':  'Conselheiro Tático',

  // ── Hora do servidor ──────────────────────────────────────────────────────
  'home.hora.servidor':       'Hora do servidor',
  'home.hora.local':          'Hora local',

  // ── Perfil ────────────────────────────────────────────────────────────────
  'home.perfil.editar':       'Editar perfil',
  'home.perfil.sair':         'Sair',
  'home.perfil.reino':        'Reino',
  'home.perfil.alianca':      'Aliança',
  'home.perfil.poder':        'Poder',
};

export default ptBR;

// Array pronto para enviar ao endpoint /api/traducoes/seed
export const CHAVES_SEED = Object.entries(ptBR).map(([chave, textoPT]) => ({ chave, textoPT }));
