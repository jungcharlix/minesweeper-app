// modes.jsx — game mode configs, mode picker, mode-specific HUD widgets

const MODE_CONFIG = {
  classic: {
    name: '經典',
    short: '經典',
    desc: '原汁原味的踩地雷',
    accent: '#5A4FCF',
    icon: (color) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="8" height="8" rx="1.5" stroke={color} strokeWidth="1.8" />
        <rect x="13" y="3" width="8" height="8" rx="1.5" stroke={color} strokeWidth="1.8" />
        <rect x="3" y="13" width="8" height="8" rx="1.5" stroke={color} strokeWidth="1.8" />
        <rect x="13" y="13" width="8" height="8" rx="1.5" fill={color} />
      </svg>
    ),
  },
  countdown: {
    name: '倒數計時',
    short: '倒數',
    desc: '時限內排除完畢，每挖一格 +0.4 秒',
    accent: '#E2671B',
    initTime: { easy: 45, medium: 90, hard: 180 },
    perReveal: 0.4,
    icon: (color) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M7 2 L17 2 M7 22 L17 22" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M7 2 L7 7 Q12 11 17 7 L17 2" stroke={color} strokeWidth="1.8" fill="none" strokeLinejoin="round" />
        <path d="M7 22 L7 17 Q12 13 17 17 L17 22" stroke={color} strokeWidth="1.8" fill="none" strokeLinejoin="round" />
        <path d="M10 5 L14 5 L12 9 Z" fill={color} />
      </svg>
    ),
  },
  triple: {
    name: '三條命',
    short: '三命',
    desc: '可踩 3 次雷，但地雷增加 60%',
    accent: '#C6453B',
    mineMul: 1.6,
    lives: 3,
    icon: (color) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 20 C5 14 3 11 3 8 A4 4 0 0 1 12 6 A4 4 0 0 1 21 8 C21 11 19 14 12 20 Z" fill={color} />
      </svg>
    ),
  },
  blackout: {
    name: '暗夜模式',
    short: '暗夜',
    desc: '視野受限，只看得到已開附近的格子',
    accent: '#3A4B7A',
    icon: (color) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M20 14 A8 8 0 1 1 10 4 A6 6 0 0 0 20 14 Z" fill={color} />
      </svg>
    ),
  },
  combo: {
    name: '連擊得分',
    short: '連擊',
    desc: '快速連挖累積倍率，挑戰高分',
    accent: '#D4A017',
    icon: (color) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M14 2 L5 13 L11 13 L9 22 L19 10 L13 10 L14 2 Z" fill={color} />
      </svg>
    ),
  },
};

// ─── Heart for Triple mode ────────────────────────────────────
function Heart({ filled, color, dim, size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ opacity: filled ? 1 : 0.25, transition: 'opacity 0.3s' }}>
      <path d="M12 20 C5 14 3 11 3 8 A4 4 0 0 1 12 6 A4 4 0 0 1 21 8 C21 11 19 14 12 20 Z"
        fill={filled ? color : dim} />
    </svg>
  );
}

function LivesDisplay({ lives, total, pal }) {
  return (
    <div style={{
      background: pal.hudBg,
      padding: '8px 12px', borderRadius: 10,
      border: `1.5px solid ${pal.panelBorder}`,
      boxShadow: `inset 0 1px 2px rgba(0,0,0,0.5)`,
      display: 'flex', alignItems: 'center', gap: 4,
      minWidth: 78, justifyContent: 'center', height: 42, boxSizing: 'border-box',
    }}>
      {Array.from({ length: total }).map((_, i) => (
        <Heart key={i} filled={i < lives} color={pal.hudText} dim="#3a2c2c" size={18} />
      ))}
    </div>
  );
}

// ─── Combo counter ────────────────────────────────────────────
function ComboDisplay({ combo, pal, decay }) {
  const active = combo > 1;
  return (
    <div style={{
      background: pal.hudBg, color: active ? '#FFD24A' : pal.hudText,
      fontFamily: '"JetBrains Mono", ui-monospace, monospace',
      fontWeight: 700, fontSize: 22, letterSpacing: 1,
      padding: '8px 12px', borderRadius: 10,
      border: `1.5px solid ${pal.panelBorder}`,
      boxShadow: `inset 0 1px 2px rgba(0,0,0,0.5)`,
      minWidth: 78, textAlign: 'center', lineHeight: 1,
      textShadow: active ? '0 0 8px #FFD24A88' : `0 0 6px ${pal.hudText}55`,
      position: 'relative', overflow: 'hidden',
      height: 42, boxSizing: 'border-box',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <span>{active ? `×${Math.min(combo, 9)}` : '×1'}</span>
      {active && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, height: 2,
          width: `${decay * 100}%`,
          background: '#FFD24A',
          transition: 'width 0.1s linear',
        }} />
      )}
    </div>
  );
}

function ScoreDisplay({ score, pal }) {
  const s = String(Math.min(99999, score)).padStart(5, '0');
  return (
    <div style={{
      background: pal.hudBg, color: pal.hudText,
      fontFamily: '"JetBrains Mono", ui-monospace, monospace',
      fontWeight: 700, fontSize: 22, letterSpacing: 1,
      padding: '8px 10px', borderRadius: 10,
      border: `1.5px solid ${pal.panelBorder}`,
      boxShadow: `inset 0 1px 2px rgba(0,0,0,0.5)`,
      minWidth: 92, textAlign: 'center', lineHeight: 1,
      textShadow: `0 0 6px ${pal.hudText}55`,
      height: 42, boxSizing: 'border-box',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>{s}</div>
  );
}

// ─── Countdown timer (red when low) ───────────────────────────
function CountdownDisplay({ seconds, pal, low }) {
  const v = Math.max(0, Math.ceil(seconds));
  const s = String(Math.min(999, v)).padStart(3, '0');
  const color = low ? '#FF4A3A' : pal.hudText;
  return (
    <div style={{
      background: pal.hudBg, color,
      fontFamily: '"JetBrains Mono", ui-monospace, monospace',
      fontWeight: 700, fontSize: 26, letterSpacing: 2,
      padding: '8px 12px', borderRadius: 10,
      border: `1.5px solid ${pal.panelBorder}`,
      boxShadow: `inset 0 1px 2px rgba(0,0,0,0.5)`,
      minWidth: 78, textAlign: 'center', lineHeight: 1,
      textShadow: `0 0 8px ${color}88`,
      height: 42, boxSizing: 'border-box',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: low ? 'pulse 0.7s ease-in-out infinite' : 'none',
    }}>{s}</div>
  );
}

// ─── Mode pill in header ──────────────────────────────────────
function ModePill({ mode, pal, onClick }) {
  const cfg = MODE_CONFIG[mode];
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 6,
      padding: '6px 10px 6px 8px',
      background: pal.panel,
      color: pal.text,
      border: `1.5px solid ${pal.panelBorder}`,
      borderRadius: 999,
      cursor: 'pointer',
      fontSize: 13, fontWeight: 600, letterSpacing: 0.5,
    }}>
      <span style={{ display: 'inline-flex', color: cfg.accent }}>{cfg.icon(cfg.accent)}</span>
      <span>{cfg.short}</span>
      <svg width="10" height="10" viewBox="0 0 10 10">
        <path d="M2 4 L5 7 L8 4" stroke={pal.textSoft} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

// ─── Bottom sheet for picking a mode ──────────────────────────
function ModeSheet({ open, mode, pal, onSelect, onClose }) {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      pointerEvents: open ? 'auto' : 'none',
      zIndex: 100,
    }}>
      {/* backdrop */}
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0,
        background: 'rgba(0,0,0,0.4)',
        opacity: open ? 1 : 0,
        transition: 'opacity 0.25s',
      }} />
      {/* sheet */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        background: pal.bg,
        borderTopLeftRadius: 28, borderTopRightRadius: 28,
        padding: '10px 16px 34px',
        transform: open ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.3s cubic-bezier(0.32, 0.72, 0.34, 1)',
        boxShadow: '0 -20px 60px rgba(0,0,0,0.18)',
        maxHeight: '80%',
        overflowY: 'auto',
      }}>
        <div style={{
          width: 36, height: 5, borderRadius: 100,
          background: pal.textMuted, opacity: 0.4,
          margin: '6px auto 14px',
        }} />
        <div style={{
          fontSize: 13, color: pal.textMuted, textTransform: 'uppercase',
          letterSpacing: 1.5, marginBottom: 10, fontWeight: 600,
          fontFamily: '"JetBrains Mono", monospace',
        }}>選擇模式</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {Object.entries(MODE_CONFIG).map(([key, cfg]) => {
            const active = mode === key;
            return (
              <button key={key} onClick={() => onSelect(key)} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 14px',
                background: active ? pal.text : pal.panel,
                color: active ? pal.bg : pal.text,
                border: `1.5px solid ${active ? pal.text : pal.panelBorder}`,
                borderRadius: 16, cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s',
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: active ? pal.bg : cfg.accent + '20',
                  color: cfg.accent,
                  display: 'grid', placeItems: 'center',
                  flexShrink: 0,
                }}>
                  {cfg.icon(cfg.accent)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: 0.3 }}>{cfg.name}</div>
                  <div style={{ fontSize: 12, opacity: 0.7, marginTop: 2, letterSpacing: 0.2 }}>{cfg.desc}</div>
                </div>
                {active && (
                  <svg width="22" height="22" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                    <path d="M5 12 L10 17 L19 7" stroke={pal.bg} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Floating combo popup ─────────────────────────────────────
function ComboPopup({ entries }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none',
      zIndex: 50, overflow: 'hidden',
    }}>
      {entries.map(e => (
        <div key={e.id} style={{
          position: 'absolute',
          left: e.x, top: e.y,
          transform: 'translate(-50%, -50%)',
          color: e.color, fontWeight: 800,
          fontSize: 22, letterSpacing: 1,
          fontFamily: '"JetBrains Mono", monospace',
          textShadow: '0 2px 4px rgba(0,0,0,0.25)',
          animation: 'comboFloat 0.9s cubic-bezier(0.2, 0.7, 0.4, 1) forwards',
          whiteSpace: 'nowrap',
        }}>{e.text}</div>
      ))}
    </div>
  );
}

Object.assign(window, {
  MODE_CONFIG,
  LivesDisplay, ComboDisplay, ScoreDisplay, CountdownDisplay,
  ModePill, ModeSheet, ComboPopup, Heart,
});
