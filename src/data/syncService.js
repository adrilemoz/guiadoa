/**
 * syncService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Sincronização automática entre a API e o localStorage.
 *
 * Fluxo:
 *  1. App abre → syncTodos() roda em background (não bloqueia a UI)
 *  2. Se APP_VERSION mudou desde o último sync → força re-sync imediato
 *  3. Cada módulo lê do cache (síncrono, instantâneo) e depois atualiza
 *     quando o fetch termina
 *  4. Sem internet + cache existente → app funciona normalmente
 *  5. Sem internet + sem cache → estado "precisa sincronizar" por módulo
 */

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// ─── VERSÃO DO APP ───────────────────────────────────────────────────────────
// Mude este valor a cada release que altere dados. Força re-sync nos
// dispositivos que já têm o app instalado ao abrir pela primeira vez.
export const APP_VERSION = '1.0.1';

// ─── CHAVES DO CACHE ────────────────────────────────────────────────────────
export const SYNC_KEYS = {
  ITENS:      'doa_cache_itens_v2',
  EDIFICIOS:  'doa_cache_edificios_v2',
  PESQUISAS:  'doa_cache_pesquisas_v2',
  SYNC_TS:    'doa_ultima_sync',
  APP_VER:    'doa_sync_app_version',
  SYNC_STATUS:'doa_sync_status',   // 'ok' | 'parcial' | 'erro'
};

// ─── LEITORES DE CACHE (síncronos, sem await) ────────────────────────────────
export const getCachedItens = () => {
  try { return JSON.parse(localStorage.getItem(SYNC_KEYS.ITENS) || '[]'); }
  catch { return []; }
};

export const getCachedEdificios = () => {
  try { return JSON.parse(localStorage.getItem(SYNC_KEYS.EDIFICIOS) || '[]'); }
  catch { return []; }
};

export const getCachedPesquisas = () => {
  try { return JSON.parse(localStorage.getItem(SYNC_KEYS.PESQUISAS) || '[]'); }
  catch { return []; }
};

// ─── INFO DO ÚLTIMO SYNC ────────────────────────────────────────────────────
export const getSyncInfo = () => ({
  ts:     localStorage.getItem(SYNC_KEYS.SYNC_TS)    || null,
  ver:    localStorage.getItem(SYNC_KEYS.APP_VER)    || null,
  status: localStorage.getItem(SYNC_KEYS.SYNC_STATUS)|| null,
});

/** True se o app nunca sincronizou ou se é uma versão nova */
export const precisaSincronizar = () => {
  const { ver } = getSyncInfo();
  return ver !== APP_VERSION;
};

/** True se pelo menos um módulo tem dados em cache */
export const temAlgumCache = () =>
  getCachedItens().length > 0 ||
  getCachedEdificios().length > 0 ||
  getCachedPesquisas().length > 0;

// ─── SYNC INTERNO ───────────────────────────────────────────────────────────
async function fetchEndpoint(path, chave, dataKey, timeout = 10000) {
  const ctrl = new AbortController();
  const tid  = setTimeout(() => ctrl.abort(), timeout);
  try {
    const r = await fetch(`${API}/api/${path}`, { signal: ctrl.signal });
    clearTimeout(tid);
    if (!r.ok) return false;
    const d   = await r.json();
    const arr = d[dataKey] || [];
    if (arr.length > 0) {
      localStorage.setItem(chave, JSON.stringify(arr));
      return true;
    }
    return false;
  } catch {
    clearTimeout(tid);
    return false;
  }
}

// ─── SYNC PRINCIPAL ─────────────────────────────────────────────────────────
/**
 * Sincroniza todos os módulos com a API.
 * Retorna { ok: number, total: number, sucesso: boolean }
 */
export async function syncTodos() {
  const resultados = await Promise.allSettled([
    fetchEndpoint('itens?limite=500',  SYNC_KEYS.ITENS,      'itens'),
    fetchEndpoint('edificios',         SYNC_KEYS.EDIFICIOS,  'edificios'),
    fetchEndpoint('pesquisas',         SYNC_KEYS.PESQUISAS,  'pesquisas'),
  ]);

  const ok    = resultados.filter(r => r.status === 'fulfilled' && r.value === true).length;
  const total = resultados.length;

  const status = ok === total ? 'ok' : ok > 0 ? 'parcial' : 'erro';

  localStorage.setItem(SYNC_KEYS.SYNC_TS,    new Date().toISOString());
  localStorage.setItem(SYNC_KEYS.SYNC_STATUS, status);

  // Só marca a versão como sincronizada se pelo menos um endpoint respondeu
  if (ok > 0) {
    localStorage.setItem(SYNC_KEYS.APP_VER, APP_VERSION);
  }

  return { ok, total, sucesso: ok > 0 };
}

// ─── FORMATA TIMESTAMP ──────────────────────────────────────────────────────
export function formatarUltimaSyncPt(isoString) {
  if (!isoString) return 'Nunca sincronizado';
  try {
    const d = new Date(isoString);
    return d.toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch { return 'Data inválida'; }
}
