// shop-ui.jsx — coin pill, hint card row, coin popup

function CoinIcon({ size = 16, color = '#D4A017', stroke = '#7A4A0F' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill={color} stroke={stroke} strokeWidth="1.4" />
      <circle cx="12" cy="12" r="6.5" fill="none" stroke={stroke} strokeWidth="1.2" opacity="0.5" />
      <path d="M9 8.5 L9 15.5 M9 12 L13 12 M15 8.5 L15 15.5" stroke={stroke} strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function CoinPill({ coins, pal, onClick, delta, button = true }) {
  const baseStyle = {
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '6px 10px 6px 8px',
    background: pal.panel,
    color: pal.text,
    border: `1.5px solid ${pal.panelBorder}`,
    borderRadius: 999,
    fontSize: 13, fontWeight: 700, letterSpacing: 0.5,
    position: 'relative',
    fontFamily: '"JetBrains Mono", monospace',
  };
  const content = (
    <>
      <CoinIcon size={16} />
      <span>{coins}</span>
      {delta > 0 && (
        <span style={{
          position: 'absolute', top: -4, right: -4,
          fontSize: 11, fontWeight: 800,
          color: '#2A8255',
          fontFamily: '"JetBrains Mono", monospace',
          animation: 'coinPop 1.4s ease-out forwards',
          textShadow: '0 1px 2px rgba(0,0,0,0.15)',
        }}>+{delta}</span>
      )}
    </>
  );
  if (!button) return <div style={baseStyle}>{content}</div>;
  return <button onClick={onClick} style={{ ...baseStyle, cursor: 'pointer' }}>{content}</button>;
}

function ShopButton({ pal, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 6,
      padding: '6px 12px 6px 10px',
      background: pal.text,
      color: pal.bg,
      border: `1.5px solid ${pal.text}`,
      borderRadius: 999,
      cursor: 'pointer',
      fontSize: 13, fontWeight: 700, letterSpacing: 0.5,
      boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
    }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M5 7 H19 L17.5 19 H6.5 L5 7 Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M9 7 V5 a3 3 0 0 1 6 0 V7" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      </svg>
      <span>商城</span>
    </button>
  );
}

function HintCardRow({ inv, pal, gameState, onUse, activeStates }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6,
      padding: '0 20px 10px',
    }}>
      {HINT_ORDER.map(key => {
        const cfg = HINT_CARDS[key];
        const count = inv.cards[key] || 0;
        const isActive = activeStates && activeStates[key];
        const usable = count > 0 && gameState === 'playing' && !isActive;
        return (
          <button
            key={key}
            disabled={!usable}
            onClick={() => onUse(key)}
            style={{
              padding: '7px 6px',
              background: isActive ? cfg.color : pal.panel,
              color: isActive ? '#fff' : (count > 0 ? pal.text : pal.textMuted),
              border: `1.5px solid ${isActive ? cfg.color : pal.panelBorder}`,
              borderRadius: 11,
              cursor: usable ? 'pointer' : 'default',
              opacity: count === 0 ? 0.45 : 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
              fontSize: 12, fontWeight: 600,
              transition: 'all 0.15s',
              minHeight: 34,
            }}
          >
            <span style={{ display: 'inline-flex', color: isActive ? '#fff' : cfg.color }}>
              {HintIcons[key](isActive ? '#fff' : cfg.color)}
            </span>
            <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 12, letterSpacing: 0.5 }}>
              ×{count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Floating coin popup (for +N animation on win) ──────────
function CoinPopup({ value, pal }) {
  if (!value) return null;
  return (
    <div style={{
      position: 'absolute',
      left: '50%', top: '50%',
      transform: 'translate(-50%, -50%)',
      pointerEvents: 'none',
      zIndex: 80,
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '12px 18px', borderRadius: 999,
      background: '#1F1A14', color: '#FFD24A',
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: 22, fontWeight: 800,
      boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
      animation: 'coinFloat 1.8s ease-out forwards',
    }}>
      <CoinIcon size={22} />
      <span>+{value}</span>
    </div>
  );
}

Object.assign(window, { CoinIcon, CoinPill, ShopButton, HintCardRow, CoinPopup });
