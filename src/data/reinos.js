// ==========================================================
// Módulo: Reinos e Fusos Horários
// ==========================================================

export const dbReinos = [
  { nome: "Ortson",     fuso: "UTC-3" }, { nome: "Norsenholm", fuso: "UTC+0" },
  { nome: "Sicyon",     fuso: "UTC-3" }, { nome: "Naxos",      fuso: "UTC-5" },
  { nome: "Megara",     fuso: "UTC+1" }, { nome: "Gibia",      fuso: "UTC+0" },
  { nome: "Sierra",     fuso: "UTC-7" }, { nome: "Redfern",    fuso: "UTC-7" },
  { nome: "Caelorn",    fuso: "UTC+1" }, { nome: "Eldria",     fuso: "UTC+1" },
  { nome: "Solace",     fuso: "UTC-7" }, { nome: "Dakota",     fuso: "UTC+0" },
  { nome: "Lysor",      fuso: "UTC+1" }, { nome: "Virelia",    fuso: "UTC+1" },
  { nome: "Nocturne",   fuso: "UTC+3" }, { nome: "Thalric",    fuso: "UTC+1" },
  { nome: "Rainchant",  fuso: "UTC-4" }, { nome: "Solgracia",  fuso: "UTC+1" },
  { nome: "Quetzara",   fuso: "UTC-7" }, { nome: "Mjolnheim",  fuso: "UTC+0" },
  { nome: "Raya",       fuso: "UTC+3" }, { nome: "Eoswood",    fuso: "UTC+1" },
  { nome: "Saguenay",   fuso: "UTC-7" }, { nome: "Hinode",     fuso: "UTC+9" },
  { nome: "Luz",        fuso: "UTC+1" }, { nome: "Mamre",      fuso: "UTC+1" },
  { nome: "Saba",       fuso: "UTC+0" }, { nome: "Mist",       fuso: "UTC+0" },
  { nome: "Pontus",     fuso: "UTC+1" },
].sort((a, b) => a.nome.localeCompare(b.nome));
