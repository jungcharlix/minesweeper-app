// shop-sheet.jsx — shop bottom drawer with tabs (skins / hint cards)

function ShopSheet({ open, pal, inv, onClose, onBuyHint, onBuySkin, onSelectSkin }) {
  const [tab, setTab] = React.useState('cards'); // 'skins' | 'cards'

  return (
    <div style={{
      position: 'absolute', inset: 0,
      pointerEvents: open ? 'auto' : 'none',
      zIndex: 110,
    }}>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0,
        background: 'rgba(0,0,0,0.45)',
        opacity: open ? 1 : 0,
        transition: 'opacity 0.25s',
      }} />
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        background: pal.bg,
        borderTopLeftRadius: 28, borderTopRightRadius: 28,
        padding: '10px 0 34px',
        transform: open ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.3s cubic-bezier(0.32, 0.72, 0.34, 1)',
        boxShadow: '0 -20px 60px rgba(0,0,0,0.22)',
        maxHeight: '88%',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{
          width: 36, height: 5, borderRadius: 100,
          background: pal.textMuted, opacity: 0.4,
          margin: '6px auto 12px',
        }} />
        {/* Header row: title + coin balance */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 18px 12px',
        }}>
          <div style={{
            fontSize: 20, fontWeight: 700, color: pal.text, letterSpacing: 0.3,
          }}>商城</div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 12px', borderRadius: 999,
            background: pal.panel, border: `1.5px solid ${pal.panelBorder}`,
            fontFamily: '"JetBrains Mono", monospace',
            fontWeight: 700, fontSize: 14, color: pal.text,
          }}>
            <CoinIcon size={16} />
            <span>{inv.coins}</span>
          </div>
        </div>

        {/* Tab bar */}
        <div style={{
          display: 'flex', gap: 4,
          padding: 4, margin: '0 18px 14px',
          background: pal.panelInset, borderRadius: 12,
          border: `1.5px solid ${pal.panelBorder}`,
        }}>
          {[['cards', '提示卡'], ['skins', '主題包裝']].map(([k, label]) => {
            const active = tab === k;
            return (
              <button key={k} onClick={() => setTab(k)} style={{
                flex: 1, padding: '8px 0', borderRadius: 9, border: 'none', cursor: 'pointer',
                background: active ? pal.bg : 'transparent',
                color: active ? pal.text : pal.textSoft,
                fontSize: 14, fontWeight: 600, letterSpacing: 0.5,
                boxShadow: active ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.12s',
              }}>{label}</button>
            );
          })}
        </div>

        {/* Tab body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 18px 18px' }}>
          {tab === 'cards' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {HINT_ORDER.map(key => (
                <HintCardRowItem
                  key={key} k={key} cfg={HINT_CARDS[key]}
                  count={inv.cards[key] || 0} coins={inv.coins} pal={pal}
                  onBuy={() => onBuyHint(key)}
                />
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
              {SKIN_ORDER.map(key => (
                <SkinCard
                  key={key} k={key} cfg={SKIN_PACKS[key]}
                  palette={PALETTES[key]}
                  owned={inv.owned.includes(key)}
                  active={inv.currentPalette === key}
                  coins={inv.coins} pal={pal}
                  onBuy={() => onBuySkin(key)}
                  onSelect={() => onSelectSkin(key)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function HintCardRowItem({ k, cfg, count, coins, pal, onBuy }) {
  const canBuy = coins >= cfg.price;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 14px',
      background: pal.panel, borderRadius: 14,
      border: `1.5px solid ${pal.panelBorder}`,
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 10,
        background: cfg.color + '22', color: cfg.color,
        display: 'grid', placeItems: 'center', flexShrink: 0,
      }}>
        {HintIcons[k](cfg.color)}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: pal.text, letterSpacing: 0.3 }}>{cfg.name}</span>
          <span style={{
            fontSize: 11, fontFamily: '"JetBrains Mono", monospace',
            color: pal.textSoft, fontWeight: 600,
          }}>持有 ×{count}</span>
        </div>
        <div style={{ fontSize: 11.5, color: pal.textSoft, marginTop: 2, lineHeight: 1.3 }}>{cfg.desc}</div>
      </div>
      <button
        disabled={!canBuy}
        onClick={onBuy}
        style={{
          display: 'flex', alignItems: 'center', gap: 4,
          padding: '8px 12px', borderRadius: 10, border: 'none',
          background: canBuy ? pal.text : pal.panelInset,
          color: canBuy ? pal.bg : pal.textMuted,
          fontFamily: '"JetBrains Mono", monospace',
          fontWeight: 700, fontSize: 13, letterSpacing: 0.3,
          cursor: canBuy ? 'pointer' : 'default',
          flexShrink: 0,
        }}
      >
        <CoinIcon size={13} color={canBuy ? '#FFD24A' : '#7A6E55'} stroke={canBuy ? '#3E2A0B' : '#5A4E38'} />
        <span>{cfg.price}</span>
      </button>
    </div>
  );
}

function SkinCard({ k, cfg, palette, owned, active, coins, pal, onBuy, onSelect }) {
  const canBuy = !owned && coins >= cfg.price;
  return (
    <div style={{
      padding: 10,
      background: active ? pal.text : pal.panel,
      color: active ? pal.bg : pal.text,
      borderRadius: 14,
      border: `1.5px solid ${active ? pal.text : pal.panelBorder}`,
      display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      {/* mini preview */}
      <div style={{
        height: 56, borderRadius: 10, position: 'relative', overflow: 'hidden',
        background: palette.bg,
        border: `1px solid ${palette.panelBorder}`,
      }}>
        <div style={{
          position: 'absolute', inset: 6,
          display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 2,
        }}>
          {Array.from({ length: 18 }).map((_, i) => {
            const isMine = i === 8;
            const isRev = [4, 5, 9, 10].includes(i);
            const bg = isMine ? palette.cellMine : isRev ? palette.cellRevealed : palette.cellHidden;
            return <div key={i} style={{ background: bg, borderRadius: 2 }} />;
          })}
        </div>
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 0.3 }}>{cfg.name}</div>
        <div style={{ fontSize: 10.5, opacity: 0.7, marginTop: 1, letterSpacing: 0.2 }}>{cfg.desc}</div>
      </div>
      {owned ? (
        <button
          onClick={onSelect}
          disabled={active}
          style={{
            padding: '7px 0', borderRadius: 9, border: 'none',
            background: active ? 'transparent' : (pal.deviceDark ? '#fff' : '#1A1410'),
            color: active ? (pal.bg) : '#fff',
            fontSize: 12, fontWeight: 700, cursor: active ? 'default' : 'pointer',
            letterSpacing: 0.5,
            border: active ? `1.5px solid ${pal.bg}55` : 'none',
          }}>
          {active ? '使用中' : '套用'}
        </button>
      ) : (
        <button
          onClick={onBuy}
          disabled={!canBuy}
          style={{
            padding: '7px 0', borderRadius: 9, border: 'none',
            background: canBuy ? '#1A1410' : pal.panelInset,
            color: canBuy ? '#FFD24A' : pal.textMuted,
            fontFamily: '"JetBrains Mono", monospace',
            fontWeight: 700, fontSize: 12,
            cursor: canBuy ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
          }}>
          <CoinIcon size={12} color={canBuy ? '#FFD24A' : '#7A6E55'} stroke={canBuy ? '#3E2A0B' : '#5A4E38'} />
          <span>{cfg.price}</span>
        </button>
      )}
    </div>
  );
}

Object.assign(window, { ShopSheet });
