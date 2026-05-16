import React, { useMemo, useState, useEffect } from 'react';
import { getProfile, clearProfile, getTermoAceito } from '../utils/storage.js';
import { useToast } from '../hooks/useToast.js';
import TermosDialog from './ProfileLogin/TermosDialog.jsx';
import ProfileForm  from './ProfileLogin/ProfileForm.jsx';
import AlertaModal  from './shared/AlertaModal.jsx';
import Toast        from '../ui/Toast.jsx';
import { C } from '../theme.js';

const useServerClock = () => {
  const [hora, setHora] = useState(() => {
    const n = new Date();
    return [n.getUTCHours(), n.getUTCMinutes(), n.getUTCSeconds()]
      .map(x => String(x).padStart(2, '0')).join(':');
  });
  useEffect(() => {
    const id = setInterval(() => {
      const n = new Date();
      setHora([n.getUTCHours(), n.getUTCMinutes(), n.getUTCSeconds()]
        .map(x => String(x).padStart(2, '0')).join(':'));
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return hora;
};

const FERRAMENTAS = [
  { id: 'torneios',  icon: '🏆', title: 'Torneios'    },
  { id: 'tropas',    icon: '⚔️',  title: 'Tropas'      },
  { id: 'dragoes',   icon: '🐉',  title: 'Dragões'     },
  { id: 'edificios', icon: '🏗️',  title: 'Construções' },
  { id: 'itens',     icon: '🎒',  title: 'Itens'       },
  { id: 'niveis',    icon: '🏰',  title: 'Níveis'      },
  { id: 'ilhas',     icon: '🏝️',  title: 'Cidade'      },
  { id: 'backup',    icon: '📜',  title: 'Nuvem'       },
  { id: 'sobre',     icon: 'ℹ️',  title: 'Info'        },
];

const Divider = ({ label }) => (
  <div style={{ display:'flex', alignItems:'center', gap:6, padding:'5px 0 3px' }}>
    <div style={{ flex:1, height:1, background:`linear-gradient(90deg,transparent,${C.BORDER})`, opacity:0.3 }} />
    <span style={{ color:C.ACCENT, fontSize:'0.65rem' }}>◆</span>
    <span style={{ fontFamily:'"Nunito",sans-serif', fontWeight:900, fontSize:'0.56rem', letterSpacing:'2.5px', color:C.TEXT_MUTED }}>
      {label}
    </span>
    <span style={{ color:C.ACCENT, fontSize:'0.65rem' }}>◆</span>
    <div style={{ flex:1, height:1, background:`linear-gradient(270deg,transparent,${C.BORDER})`, opacity:0.3 }} />
  </div>
);

const Home = ({ setRoute }) => {
  const [profile,     setProfile]     = useState(() => getProfile());
  const [termoAceito, setTermoAceito] = useState(() => getTermoAceito());
  const [alertaModal, setAlertaModal] = useState({ open:false, msg:'' });
  const { toast, closeToast }         = useToast();
  const horaServidor                  = useServerClock();

  const userId = useMemo(() => {
    if (!profile) return '00000';
    let hash = 0;
    for (let i = 0; i < profile.nome.length; i++) {
      hash = profile.nome.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash).toString().substring(0, 5).padEnd(5, '0');
  }, [profile]);

  if (!profile) {
    return (
      <>
        <TermosDialog open={!termoAceito} onAceitar={() => setTermoAceito(true)} />
        {termoAceito && <ProfileForm onSave={p => setProfile(p)} />}
      </>
    );
  }

  return (
    <div style={{ maxWidth:480, margin:'0 auto', paddingBottom:12 }}>
      <Toast {...toast} onClose={closeToast} />
      <AlertaModal open={alertaModal.open} message={alertaModal.msg}
        onClose={() => setAlertaModal({ open:false, msg:'' })} />

      {/* ── FAIXA: PERFIL + HORA DO SERVIDOR ─────────────────────── */}
      <div style={{
        background: C.BG_CARD_TOP,
        borderBottom: `1px solid rgba(200,168,74,0.28)`,
        padding: '6px 10px',
        display: 'flex', alignItems: 'center', gap: 8,
        animation: 'reveal-up 0.4s 0.08s ease both',
      }}>
        {/* Avatar */}
        <div style={{
          width:32, height:32, borderRadius:7, flexShrink:0,
          background: C.BG_SECONDARY,
          border: `1px solid rgba(200,168,74,0.38)`,
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:16, position:'relative',
        }}>
          🎖️
          <span style={{
            position:'absolute', bottom:-2, right:-2,
            width:8, height:8, borderRadius:'50%',
            background: C.ENERGY,
            border: `1.5px solid ${C.BG_MAIN}`,
            animation:'online-pulse 3s ease-in-out infinite',
          }} />
        </div>

        {/* Nome + tags */}
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontFamily:'"Nunito",sans-serif', fontWeight:900, fontSize:'0.84rem', color:C.TEXT_PRIMARY, lineHeight:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
            {profile.nome}
          </div>
          <div style={{ display:'flex', gap:4, marginTop:3 }}>
            {[`Reino: ${profile.reino}`, `ID: ${userId}`].map(tag => (
              <span key={tag} style={{
                fontFamily:'"Nunito",sans-serif', fontWeight:700, fontSize:'0.6rem',
                padding:'1px 5px', borderRadius:4,
                border:`1px solid rgba(200,168,74,0.3)`,
                color:C.TEXT_SECONDARY, background:'rgba(184,150,90,0.08)',
              }}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Divisor vertical */}
        <div style={{ width:1, height:28, background:`linear-gradient(180deg,transparent,${C.BORDER},transparent)`, opacity:0.4, flexShrink:0 }} />

        {/* Hora do servidor */}
        <div style={{ textAlign:'right', flexShrink:0 }}>
          <div style={{
            fontFamily:'"Nunito",sans-serif', fontWeight:900,
            fontSize:'0.98rem', letterSpacing:'0.06em',
            fontVariantNumeric:'tabular-nums',
            color:C.TEXT_PRIMARY, lineHeight:1,
          }}>
            {horaServidor}
          </div>
          <div style={{ fontFamily:'"Nunito",sans-serif', fontWeight:800, fontSize:'0.5rem', letterSpacing:'1.5px', color:C.TEXT_MUTED, marginTop:2 }}>
            SERVIDOR UTC+0
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={() => { clearProfile(); setProfile(null); }}
          style={{
            width:28, height:28, borderRadius:6, flexShrink:0,
            background:'transparent', cursor:'pointer',
            border:`1px solid rgba(200,168,74,0.28)`,
            color:C.TEXT_FAINT, fontSize:'0.8rem',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}
        >
          ⎋
        </button>
      </div>

      {/* Fio dourado */}
      <div style={{ height:1, background:`linear-gradient(90deg,transparent,${C.BORDER},transparent)`, opacity:0.22, margin:'0 10px' }} />

      {/* ── ARSENAL ───────────────────────────────────────────── */}
      <div style={{ padding:'0 8px', animation:'reveal-up 0.4s 0.14s ease both' }}>
        <Divider label="ARSENAL DO QUARTEL" />

        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:5 }}>
          {FERRAMENTAS.map((tool, i) => (
            <button
              key={tool.id}
              onClick={() => setRoute(tool.id)}
              style={{
                background: C.BG_CARD,
                border:`1px solid rgba(200,168,74,0.26)`,
                borderRadius:10,
                padding:'14px 4px 11px',
                textAlign:'center', cursor:'pointer',
                display:'flex', flexDirection:'column', alignItems:'center',
                animation:`tool-in 0.3s ${0.16 + i*0.04}s ease both`,
                transition:'transform 0.12s',
              }}
              onMouseDown={e=>e.currentTarget.style.transform='scale(0.95)'}
              onMouseUp={e=>e.currentTarget.style.transform='scale(1)'}
              onTouchStart={e=>e.currentTarget.style.transform='scale(0.95)'}
              onTouchEnd={e=>e.currentTarget.style.transform='scale(1)'}
            >
              <span style={{ fontSize:'2.2rem', lineHeight:1, marginBottom:4, filter:'drop-shadow(0 1px 2px rgba(62,47,28,0.18))' }}>
                {tool.icon}
              </span>
              <span style={{ fontFamily:'"Nunito",sans-serif', fontWeight:700, fontSize:'0.8rem', color:C.TEXT_SECONDARY, lineHeight:1.15 }}>
                {tool.title}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
