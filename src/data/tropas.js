// ==========================================================
// Módulo: Tropas (Treináveis + Especiais)
// ==========================================================

export const dbTropasRaw = [
  // --- TROPAS DE EVENTOS ESPECIAIS ---
  { nome: "Condenadores", vida: 20000, def: 850, atqDist: 0, alcance: 0, vel: 450, atqPerto: 3000, car: 600, gestao: 0, poder: 40, desc: "Estes terríveis habitantes do abismo possuem um espírito tenaz. +20% de Ataque e -20% de Dano recebido na Dominação do Dragão, Campo de..." },
  { nome: "Cavaleiros Espectrais", vida: 15000, def: 650, atqDist: 0, alcance: 0, vel: 1200, atqPerto: 4000, car: 300, gestao: 0, poder: 40, desc: "Capazes de se moverem com uma velocidade incrível, realizando um golpe paralisante. +20% de Ataque e -20% de Dano recebido na Dominação." },
  { nome: "Guerreiro do Magma", vida: 32000, def: 500, atqDist: 0, alcance: 0, vel: 300, atqPerto: 5000, car: 600, gestao: 0, poder: 40, desc: "Esses guerreiros ardentes causam dano extra de acordo com o nível do dragão ao marcharem com o Dragão da Espinha Negra. +20% de ataque e..." },
  { nome: "Megalibgwilia", vida: 30000, def: 2850, atqDist: 0, alcance: 0, vel: 400, atqPerto: 2000, car: 800, gestao: 0, poder: 40, desc: "Ao defender, eles vão à frente para atrair o fogo inimigo no início da batalha. +20% de ataque e -20% de dano recebido na Dominação do." },
  { nome: "Medusa", vida: 8500, def: 600, atqDist: 4000, alcance: 2800, vel: 435, atqPerto: 480, car: 300, gestao: 0, poder: 40, desc: "Causa +50% de dano aos inimigos mais rápidos. +20% de dano e -20% de dano recebido na Dominação do Dragão, Campo de Batalha Antigo e Guerra do." },
  { nome: "Gatuno Alado", vida: 18500, def: 900, atqDist: 1500, alcance: 1000, vel: 750, atqPerto: 3650, car: 400, gestao: 0, poder: 40, desc: "Ganha +100% de velocidade e +50% de PV ao defender. +20% de dano causado e -20% de dano recebido na Dominação do Dragão, Campo de." },
  { nome: "Sapo Tóxico", vida: 6500, def: 450, atqDist: 4800, alcance: 3000, vel: 500, atqPerto: 300, car: 265, gestao: 0, poder: 40, desc: "O Sapo Tóxico normalmente ataca o inimigo à longa distância. +20% de ataque em combates contra o Zyrvorthian." },
  { nome: "Lorde do Inverno", vida: 18000, def: 5000, atqDist: 0, alcance: 0, vel: 800, atqPerto: 3300, car: 1000, gestao: 0, poder: 50, desc: "Convocados de muito além da tundra. -75% de dano recebido de ataques à distância e +50% de Confronto Elemental." },
  { nome: "Entidade Espectral", vida: 8000, def: 500, atqDist: 3500, alcance: 2000, vel: 1000, atqPerto: 2500, car: 500, gestao: 0, poder: 40, desc: "Habitantes das sombras, estes seres enigmáticos aumentam o ataque à distância e o Bombardeio Elemental, condicionado ao nível do Dragão." },
  { nome: "Caçador de Almas", vida: 5000, def: 500, atqDist: 4500, alcance: 3500, vel: 750, atqPerto: 100, car: 300, gestao: 0, poder: 40, desc: "Ressonando entre si, estas misteriosas criaturas aumentam o ataque distante e defesa. Condicionado ao nível do Dragão Paradisiaco." },
  { nome: "Guerreiro Sagrado", vida: 8000, def: 600, atqDist: 100, alcance: 800, vel: 650, atqPerto: 4300, car: 300, gestao: 0, poder: 40, desc: "Em sintonia um com o outro, estas misteriosas criaturas aumentam o ataque de perto e defesa. Condicionado ao nível do Dragão Dourado." },
  { nome: "Caçadores de Dragão Bárbaro", vida: 5600, def: 400, atqDist: 0, alcance: 0, vel: 1200, atqPerto: 4554, car: 500, gestao: 0, poder: 40, desc: "Caçadores de dragão bárbaro empunhando um grande machado, dragões são seus alvos principais de ataque, até mesmo a defesa do dragão." },
  { nome: "Mago Lagarto", vida: 3500, def: 600, atqDist: 4830, alcance: 1400, vel: 400, atqPerto: 100, car: 100, gestao: 0, poder: 40, desc: "Ele libera o poder misterioso da raça dos lagartos. 35% de chance de causar dano dobrado em batalha." },
  { nome: "Quimera", vida: 14180, def: 3720, atqDist: 0, alcance: 0, vel: 1000, atqPerto: 5230, car: 1000, gestao: 0, poder: 40, desc: "Ressoa com o Dragão Tirano, Quimera aumentará o ataque corpo a corpo e vida. Condicionado ao nível do Dragão Tirano." },
  { nome: "Fada da Selva", vida: 5000, def: 360, atqDist: 5050, alcance: 3000, vel: 1200, atqPerto: 155, car: 400, gestao: 0, poder: 40, desc: "Em ressonância com o Dragão Fada, a Fada da Selva aumentará o ataque à distância e a vida. Condicionado ao nível do Dragão Fada." },
  { nome: "Centauros Infernais", vida: 10000, def: 500, atqDist: 5000, alcance: 2000, vel: 600, atqPerto: 500, car: 200, gestao: 0, poder: 40, desc: "Possuindo uma natureza dupla, esses arqueiros mestres são muito habilidosos. +20% de ataque e -20% de dano na Dominação do Dragão, Campo." },
  { nome: "Golem do Trovão", vida: 15000, def: 1000, atqDist: 0, alcance: 0, vel: 500, atqPerto: 1500, car: 1000, gestao: 0, poder: 25, desc: "Mestres da proteção, possuem 2x seus atributos quando estão defendendo. -50% nos ataques de Canhões Elétricos, Magmassauros e Leviatãs." },
  { nome: "Escaravelho de Guerra", vida: 15000, def: 450, atqDist: 0, alcance: 0, vel: 500, atqPerto: 2200, car: 650, gestao: 0, poder: 50, desc: "Provocando os inimigos, se atingidos por ataques a distância ou corpo a corpo, seus espinhos afiados devolvem 50% da sua vida em dano recebido." },
  { nome: "Esmagadores Colossais", vida: 4500, def: 500, atqDist: 4750, alcance: 3500, vel: 800, atqPerto: 10, car: 300, gestao: 0, poder: 40, desc: "Destrutivos, eles são peritos em combate de grandes inimigos usando seu ataque à distância. +200% de dano a unidades com vida maior do que." },
  { nome: "Fantasma do Trovão", vida: 8000, def: 500, atqDist: 0, alcance: 0, vel: 1800, atqPerto: 5000, car: 500, gestao: 0, poder: 50, desc: "Aliado ao Dragão do Trovão, esta terrível criatura aumentará o ataque de perto, defesa, vida e velocidade, conforme o nível do Dragão do Trovão." },
  { nome: "Lordes da Lava", vida: 20000, def: 2000, atqDist: 0, alcance: 0, vel: 800, atqPerto: 3500, car: 1000, gestao: 0, poder: 50, desc: "Estes lordes excepcionais portam armaduras extremamente poderosas forjadas nas profundezas da terra. -75% de DANO recebido de ataques a." },
  { nome: "Assassino Real", vida: 6000, def: 250, atqDist: 0, alcance: 0, vel: 1500, atqPerto: 5750, car: 500, gestao: 0, poder: 40, desc: "+50% de dano de perto e +50% de Bombardeio Elemental. Ativado apenas se for mais rápido do que as tropas inimigas." },
  { nome: "Gigantes do Gelo", vida: 10000, def: 2000, atqDist: 0, alcance: 0, vel: 200, atqPerto: 2000, car: 1000, gestao: 0, poder: 40, desc: "Conhecidos por sua habilidade de criar itens de gelo e neve. -90% da dano de fogo. Inclui Espelhos de Fogo, Bigas de Fogo e Magmassauros." },
  { nome: "Arruinador Dimensional", vida: 6999, def: 999, atqDist: 0, alcance: 0, vel: 999, atqPerto: 5999, car: 999, gestao: 0, poder: 40, desc: "São convocados apenas para destruir. Se atacados, -75% de dano de Espelhos de Fogo e Magmassauros e -50% de dano de Canhões Elétricos." },
  { nome: "Perseguidor das Sombras", vida: 4300, def: 450, atqDist: 0, alcance: 0, vel: 2100, atqPerto: 4750, car: 500, gestao: 0, poder: 50, desc: "O Perseguidor das Sombras é um mestre da velocidade e da furtividade. Seu primeiro ataque dá o DOBRO DE DANO." },

  // --- TROPAS TREINÁVEIS ---
  { nome: "Milicianos", vida: 75, def: 10, atqDist: 0, alcance: 0, vel: 200, atqPerto: 10, car: 20, gestao: 0, poder: 1, desc: "Cidadãos semitreinados são baratos e abundantes. Não são páreos para tropas profissionais, mas lutam com honra." },
  { nome: "Carregadores", vida: 45, def: 10, atqDist: 0, alcance: 0, vel: 100, atqPerto: 1, car: 200, gestao: 0, poder: 1, desc: "A unidade de transporte mais barata, Carregadores levam recursos entre cidades e dos campos de batalha." },
  { nome: "Espiões", vida: 10, def: 5, atqDist: 0, alcance: 0, vel: 3000, atqPerto: 5, car: 0, gestao: 0, poder: 2, desc: "Espiões usam habilidades psíquicas para obter informações sobre inimigos. Eles são rápidos e de difícil detecção como fantasmas no vento." },
  { nome: "Alabardeiros", vida: 150, def: 40, atqDist: 0, alcance: 0, vel: 300, atqPerto: 40, car: 40, gestao: 0, poder: 2, desc: "Alabardeiros são agressores furtivos e rápidos, usando suas alabardas com graça e precisão." },
  { nome: "Minotauros", vida: 244, def: 49, atqDist: 0, alcance: 0, vel: 279, atqPerto: 76, car: 30, gestao: 0, poder: 3, desc: "Minotauros foram criados pelos Antigos como infantarias pesadas. Inteligente mas selvagem, sua fúria mortífera é apavorante." },
  { nome: "Arqueiros", vida: 75, def: 30, atqDist: 80, alcance: 1200, vel: 250, atqPerto: 5, car: 25, gestao: 0, poder: 4, desc: "Treinados desde muito novos, os Arqueiros são tropas de longo alcance eficazes. Seu alcance aumenta com avanços em Calibração de Armas." },
  { nome: "Dragões de Ataque Rápido", vida: 300, def: 60, atqDist: 0, alcance: 0, vel: 1000, atqPerto: 150, car: 100, gestao: 0, poder: 5, desc: "Dragões de Ataque Rápido são ligeiros e ágeis. Apesar de sua baforada de curto alcance, é mortal se bem treinado." },
  { nome: "Dragões de Combate", vida: 1500, def: 300, atqDist: 0, alcance: 0, vel: 750, atqPerto: 300, car: 80, gestao: 0, poder: 7, desc: "Dragões de combate com armaduras e menores que os Grandes Dragões. Seu voo é ágil e seu poder de ataque é devastador." },
  { nome: "Transportes Blindados", vida: 750, def: 200, atqDist: 0, alcance: 0, vel: 150, atqPerto: 5, car: 5000, gestao: 0, poder: 7, desc: "Transportes Blindados carregam pesadas cargas, deslocando recursos entre cidades e trazendo espólios de batalhas." },
  { nome: "Gigantes", vida: 4000, def: 400, atqDist: 0, alcance: 0, vel: 120, atqPerto: 1000, car: 45, gestao: 0, poder: 9, desc: "Esse povo de grandes proporções vem de mais um experimento dos antigos. Gigantes podem destruir cidades e exércitos com muita facilidade." },
  { nome: "Abissal", vida: 3000, def: 300, atqDist: 800, alcance: 600, vel: 500, atqPerto: 1600, car: 45, gestao: 0, poder: 10, desc: "Os ferozes Abissais são terrores venenosos das profundezas de Atlântida." },
  { nome: "Terror do Pântano", vida: 5000, def: 500, atqDist: 0, alcance: 0, vel: 150, atqPerto: 2000, car: 60, gestao: 0, poder: 10, desc: "Estas plantas gigantes e mortíferas são ótimas guerreiras de curto alcance e atacam os inimigos com seus membros afiados e mordidas venenosas." },
  { nome: "Ogros de Granito", vida: 15000, def: 900, atqDist: 0, alcance: 0, vel: 350, atqPerto: 650, car: 30, gestao: 0, poder: 9, desc: "Ogro de Granito são seres de rocha sólida cujos corpos resistem a quase todos os ataques." },
  { nome: "Bigas de Fogo", vida: 3000, def: 150, atqDist: 1600, alcance: 900, vel: 600, atqPerto: 1200, car: 100, gestao: 0, poder: 10, desc: "Queimando o campo de batalha com disparos mortíferos, as Bigas de Fogo são combatentes letais que suportam as batalhas mais ferventes." },
  { nome: "Serpente Vingativa", vida: 250, def: 400, atqDist: 0, alcance: 0, vel: 900, atqPerto: 3100, car: 0, gestao: 0, poder: 10, desc: "A Serpente Vingativa é uma agressora aérea com um ataque inicial devastador. Ela não tem medo e destrói seus inimigos." },
  { nome: "Canhões Elétricos", vida: 1100, def: 250, atqDist: 900, alcance: 1600, vel: 50, atqPerto: 100, car: 100, gestao: 0, poder: 10, desc: "Este canhão de longo alcance pode criar arcos de eletricidade sobre o campo de batalha. Dano de +25% a Abissais e de +100% em modo defesa." },
  { nome: "Dragonetes da Tempestade", vida: 3100, def: 300, atqDist: 0, alcance: 0, vel: 675, atqPerto: 1350, car: 500, gestao: 0, poder: 10, desc: "Suas armaduras leves fornecem proteção contra ataques e permitem grande velocidade. +50% de dano contra as unidades de Longo Alcance." },
  { nome: "Magmassauros", vida: 1000, def: 150, atqDist: 2000, alcance: 1600, vel: 400, atqPerto: 500, car: 10, gestao: 0, poder: 9, desc: "Das profundezas vulcânicas de Atlântida, estes répteis podem disparar lava, derretendo tudo em seu caminho." },
  { nome: "Titã Petrificado", vida: 7500, def: 1500, atqDist: 0, alcance: 0, vel: 50, atqPerto: 5000, car: 0, gestao: 0, poder: 20, desc: "Quando estes poderosos protetores da natureza são provocados são imbatíveis. +75% de dano contra Magmassauros, Arqueiros e Espelhos." },
  { nome: "Espelhos de Fogo", vida: 1500, def: 30, atqDist: 1200, alcance: 1500, vel: 50, atqPerto: 20, car: 75, gestao: 0, poder: 10, desc: "Esta máquina da morte focaliza os raios solares com energia azul e cria um raio de altíssimo calor que espalha o pânico e a destruição." },
  { nome: "Cavaleiro Dragão", vida: 6000, def: 800, atqDist: 0, alcance: 0, vel: 1100, atqPerto: 2900, car: 500, gestao: 0, poder: 25, desc: "Rápido e forte, o Cavaleiro Dragão é o senhor dos céus. +75% de dano a unidades de longo alcance." },
  { nome: "Leviatã Ártico", vida: 1000, def: 999, atqDist: 2200, alcance: 1700, vel: 450, atqPerto: 750, car: 100, gestao: 0, poder: 20, desc: "A tropa de longo alcance mais poderosa, pode disparar mais e mais forte, superando até o poderoso Magmassauro." },
  { nome: "Dragão do Veneno", vida: 5400, def: 850, atqDist: 1800, alcance: 700, vel: 600, atqPerto: 2000, car: 50, gestao: 0, poder: 20, desc: "Com uma aura tóxica capaz de desintegrar fortes armaduras, os Dragões do Veneno causam +200% de dano ao atacar Ogros de Granito." },
  { nome: "Andarilhos da Areia", vida: 1500, def: 300, atqDist: 600, alcance: 1200, vel: 1000, atqPerto: 800, car: 200, gestao: 0, poder: 8, desc: "Unidades supremas de ataque rápido, com a habilidade de contra-atacar inimigos de longo e curto alcance. Recuperam-se no Hospital na metade." },
  { nome: "Hoplita", vida: 1513, def: 900, atqDist: 600, alcance: 600, vel: 460, atqPerto: 800, car: 50, gestao: 0, poder: 5, desc: "Com uma defesa sólida, são uma força poderosa quando estão em um grupo grande. Cada 2000 Hoplitas podem reduzir o dano em 1%, até o máximo." },
  { nome: "Serpentes Arsênicas", vida: 2000, def: 400, atqDist: 1000, alcance: 1600, vel: 100, atqPerto: 10, car: 100, gestao: 0, poder: 10, desc: "Alimentados com arsênio desde pequenos, eles adoram compartilhar seu veneno com os inimigos. Eles atacam e envenenam qualquer inimigo." },
  { nome: "Amarande", vida: 3000, def: 350, atqDist: 0, alcance: 0, vel: 751, atqPerto: 3000, car: 500, gestao: 0, poder: 10, desc: "Amarande pode atacar à noite com um ataque preciso. Adiciona 50% de ataque corpo a corpo das 22h00 UCT às 6h00 do dia seguinte." },
  { nome: "Escevóforo", vida: 45, def: 10, atqDist: 0, alcance: 0, vel: 20, atqPerto: 1, car: 200, gestao: 0, poder: 1, desc: "Uma unidade de transporte lenta, o escevóforo leva recursos entre cidades e carrega de volta espólios de batalhas lentamente." },
];

/**
 * Mapeador Inteligente: adiciona `atq` (ataque principal) e `efi` (eficiência de carga).
 * Mantém total compatibilidade com os consumidores existentes de dbTropas.
 */
export const dbTropas = dbTropasRaw.map(t => {
  const ataquePrincipal = Math.max(t.atqDist, t.atqPerto);
  const cargaFiltrada = t.car === 0 ? null : t.car;
  return {
    ...t,
    atq: ataquePrincipal,
    car: cargaFiltrada,
    efi: cargaFiltrada ? (t.vel * cargaFiltrada) / 100 : 0,
  };
});
