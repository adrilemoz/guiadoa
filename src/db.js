// ==========================================================
// db.js — Ponto de entrada único do banco de dados estático.
//
// Todos os dados foram migrados para módulos dedicados em
// src/data/. Este arquivo re-exporta tudo para manter
// compatibilidade total com os imports existentes no projeto.
//
// Consumidores continuam usando:
//   import { dbTropas }    from '../db.js';
//   import { dbNiveis }    from '../db.js';
//   import { dbReinos }    from '../db.js';
//   import { dbEdificios } from '../db.js';
// ==========================================================

export { dbTropasRaw, dbTropas }       from './data/tropas.js';
export { dbNiveis }                    from './data/niveis.js';
export { dbReinos }                    from './data/reinos.js';
export { dbEdificios }                 from './data/edificios.js';
export { dbDragoes, getDragaoById }    from './data/dragoes.js';
