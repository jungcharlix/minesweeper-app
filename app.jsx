// app.jsx — main app: state, modes, iOS frame, Tweaks
const { useState, useEffect, useRef, useMemo, useCallback } = React;

// ─── Header ──────────────────────────────────────────────────
function Header({ pal, mode, coins, coinDelta, onOpenMode, onOpenShop }) {
  return (
    <div style={{
      padding: '62px 14px 12px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: 6,
    }}>
      <div style={{
        fontFamily: '-apple-system, "SF Pro", Inter, system-ui',
        fontWeight: 700, fontSize: 24, letterSpacing: -0.5,
        color: pal.text, flexShrink: 0,
      }}>採地雷</div>
      <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
        <CoinPill coins={coins} delta={coinDelta} pal={pal} button={false} />
        <ShopButton pal={pal} onClick={onOpenShop} />
        <ModePill mode={mode} pal={pal} onClick={onOpenMode} />
      </div>
    </div>
  );
}

// ─── Difficulty selector (5-way segmented + detail line) ───
function DifficultySelector({ value, pal, onChange }) {
  const cur = DIFFICULTIES[value];
  return (
    <div style={{ padding: '0 16px 6px' }}>
      <div style={{
        display: 'flex', padding: 3, gap: 2,
        background: pal.panelInset, borderRadius: 12,
        border: `1.5px solid ${pal.panelBorder}`,
      }}>
        {DIFF_ORDER.map(k => {
          const active = value === k;
          return (
            <button key={k} onClick={() => onChange(k)} style={{
              flex: 1, padding: '8px 0',
              background: active ? pal.text : 'transparent',
              color: active ? pal.bg : pal.text,
              border: 'none',
              borderRadius: 9, cursor: 'pointer',
              fontSize: 13, fontWeight: 600, letterSpacing: 0.5,
              transition: 'all 0.12s',
              boxShadow: active ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
            }}>
              {DIFFICULTIES[k].name}
            </button>
          );
        })}
      </div>
      <div style={{
        textAlign: 'center', marginTop: 6,
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: 10.5, color: pal.textMuted, letterSpacing: 1.2,
      }}>
        {cur.cols}<span style={{ opacity: 0.5 }}>×</span>{cur.rows}
        <span style={{ opacity: 0.5, margin: '0 6px' }}>·</span>
        {cur.mines} 顆地雷
      </div>
    </div>
  );
}

// ─── Mode-aware HUD ──────────────────────────────────────────
function GameHUD({ mode, pal, minesLeft, time, countdown, countdownLow, lives, totalLives, score, combo, comboDecay, faceState, onReset }) {
  let left, right;
  if (mode === 'triple') {
    left = <LivesDisplay lives={lives} total={totalLives} pal={pal} />;
    right = <Counter value={time} pal={pal} />;
  } else if (mode === 'countdown') {
    left = <Counter value={minesLeft} pal={pal} />;
    right = <CountdownDisplay seconds={countdown} pal={pal} low={countdownLow} />;
  } else if (mode === 'combo') {
    left = <ScoreDisplay score={score} pal={pal} />;
    right = <ComboDisplay combo={combo} pal={pal} decay={comboDecay} />;
  } else {
    // classic, blackout
    left = <Counter value={minesLeft} pal={pal} />;
    right = <Counter value={time} pal={pal} />;
  }
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: pal.panel,
      padding: '12px 14px',
      borderRadius: 18,
      border: `1.5px solid ${pal.panelBorder}`,
      boxShadow: `inset 0 1px 0 rgba(255,255,255,0.4), 0 1px 2px rgba(0,0,0,0.05)`,
      gap: 8,
    }}>
      {left}
      <FaceButton state={faceState} pal={pal} onClick={onReset} />
      {right}
    </div>
  );
}

// ─── Counter — same component as game.jsx but inlined here for HUD compatibility ──
function Counter({ value, pal }) {
  const v = Math.max(-99, Math.min(999, value));
  let s = String(Math.abs(v)).padStart(3, '0');
  if (v < 0) s = '-' + String(Math.abs(v)).padStart(2, '0');
  return (
    <div style={{
      background: pal.hudBg, color: pal.hudText,
      fontFamily: '"JetBrains Mono", ui-monospace, monospace',
      fontWeight: 700, fontSize: 26, letterSpacing: 2,
      padding: '8px 12px', borderRadius: 10,
      border: `1.5px solid ${pal.panelBorder}`,
      boxShadow: `inset 0 1px 2px rgba(0,0,0,0.5)`,
      minWidth: 78, textAlign: 'center', lineHeight: 1,
      textShadow: `0 0 6px ${pal.hudText}55`,
      height: 42, boxSizing: 'border-box',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>{s}</div>
  );
}

// ─── Mode toggle (dig / flag) ────────────────────────────────
function ModeToggle({ mode, pal, onChange, longPressEnabled }) {
  const Tab = ({ k, label, icon }) => {
    const active = mode === k;
    return (
      <button onClick={() => onChange(k)} style={{
        flex: 1, padding: '12px 0',
        background: active ? pal.panel : 'transparent',
        color: active ? pal.text : pal.textSoft,
        border: 'none', cursor: 'pointer',
        borderRadius: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        fontSize: 14, fontWeight: 600, letterSpacing: 0.5,
        boxShadow: active ? '0 1px 2px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.4)' : 'none',
        transition: 'all 0.12s',
      }}>
        {icon}{label}
      </button>
    );
  };
  return (
    <div style={{ padding: '10px 20px 24px' }}>
      <div style={{
        background: pal.panelInset, padding: 4, borderRadius: 14,
        border: `1.5px solid ${pal.panelBorder}`,
        display: 'flex', gap: 4,
      }}>
        <Tab k="dig" label="挖掘" icon={
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M14 4 L20 10 L11 19 L4 17 L5 14 L14 4 Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            <path d="M11 7 L17 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        } />
        <Tab k="flag" label="插旗" icon={<FlagIcon size={18} flag={mode==='flag'?pal.flag:pal.textSoft} pole={mode==='flag'?pal.text:pal.textSoft} />} />
      </div>
      {longPressEnabled && (
        <div style={{
          textAlign: 'center', marginTop: 8,
          fontSize: 11, color: pal.textMuted, letterSpacing: 0.3,
        }}>長按格子也可以快速插旗</div>
      )}
    </div>
  );
}

// ─── Win/lose banner ─────────────────────────────────────────
function StatusBanner({ state, time, score, mode, pal, onReset }) {
  if (state !== 'won' && state !== 'lost') return null;
  const won = state === 'won';
  const bg = won ? pal.text : pal.cellMine;
  const fg = won ? pal.bg : '#fff';
  const title = won ? '排除完畢！' : (mode === 'countdown' ? '時間到！' : '砰！踩到地雷');
  const sub = won
    ? (mode === 'combo' ? `總分 ${score}` : `用時 ${time} 秒`)
    : (mode === 'countdown' ? '差一點點…' : '下次小心一點');
  return (
    <div style={{
      position: 'absolute', left: 20, right: 20, bottom: 140, zIndex: 30,
      background: bg, color: fg,
      padding: '16px 18px', borderRadius: 18,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      boxShadow: '0 12px 32px rgba(0,0,0,0.18)',
      animation: 'slideUp 0.36s cubic-bezier(0.34, 1.56, 0.64, 1)',
    }}>
      <div>
        <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: 0.3 }}>{title}</div>
        <div style={{ fontSize: 12, opacity: won ? 0.7 : 0.85, marginTop: 2 }}>{sub}</div>
      </div>
      <button onClick={onReset} style={{
        padding: '10px 16px', borderRadius: 10,
        background: won ? pal.bg : '#fff', color: won ? pal.text : pal.cellMine, border: 'none',
        fontSize: 13, fontWeight: 600, cursor: 'pointer', letterSpacing: 0.5,
      }}>{won ? '再來' : '重來'}</button>
    </div>
  );
}

// ─── Best-record line ─────────────────────────────────────────
function BestLine({ mode, diff, bests, pal }) {
  const key = `${mode}-${diff.id}`;
  const val = bests[key];
  if (val == null) return null;
  let label, num;
  if (mode === 'combo') { label = `${diff.name}最高分`; num = `${val}`; }
  else if (mode === 'countdown') { label = `${diff.name}剩餘`; num = `${val}s`; }
  else { label = `${diff.name}最佳`; num = `${val}s`; }
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0,
      bottom: 110, textAlign: 'center',
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: 11, color: pal.textMuted, letterSpacing: 1,
    }}>
      <span style={{ opacity: 0.6 }}>{label}　</span>
      <span style={{ color: pal.textSoft, fontWeight: 600 }}>{num}</span>
    </div>
  );
}

// ─── Main app ─────────────────────────────────────────────────
function MinesweeperApp() {
  const [t, setT] = useTweaks(window.__TWEAK_DEFAULTS__);
  const pal = PALETTES[t.palette] || PALETTES.warm;
  const diffId = t.difficulty;
  const diff = { id: diffId, ...DIFFICULTIES[diffId] };
  const modeCfg = MODE_CONFIG[t.mode] || MODE_CONFIG.classic;

  // Auto-scale device to fit viewport
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const fit = () => {
      const vh = window.innerHeight - 32;
      const vw = window.innerWidth - 32;
      const sH = Math.min(1, vh / 874);
      const sW = Math.min(1, vw / 402);
      setScale(Math.min(sH, sW));
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  // Effective mine count
  const effectiveMines = Math.floor(diff.mines * (modeCfg.mineMul || 1));

  const [board, setBoard] = useState(() => createEmptyBoard(diff.rows, diff.cols));
  const [seeded, setSeeded] = useState(false);
  const [gameState, setGameState] = useState('idle'); // idle | playing | won | lost
  const [tick, setTick] = useState(0); // forces re-render for timers
  const [mode, setMode] = useState('dig'); // dig | flag (interaction mode, not game mode)
  const [pressing, setPressing] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);

  // Inventory persisted in localStorage
  const [inv, setInv] = useState(() => {
    try {
      const v = JSON.parse(localStorage.getItem('msweeper_inv'));
      if (v && typeof v === 'object') return {
        coins: v.coins ?? 100,
        cards: { safe: 0, freeze: 0, xray: 0, shield: 0, ...(v.cards || {}) },
        owned: v.owned || ['warm', 'slate', 'mint'],
      };
    } catch {}
    return { coins: 100, cards: { safe: 2, freeze: 1, xray: 1, shield: 0 }, owned: ['warm', 'slate', 'mint'] };
  });
  useEffect(() => {
    try { localStorage.setItem('msweeper_inv', JSON.stringify(inv)); } catch {}
  }, [inv]);
  const [coinDelta, setCoinDelta] = useState(0);
  const [coinPopup, setCoinPopup] = useState(0);

  // Hint card effect states (per-game)
  const [shieldActive, setShieldActive] = useState(false);
  const [xrayUntil, setXrayUntil] = useState(0);
  const pauseEndAt = useRef(0); // ms timestamp when freeze ends

  // Mode-specific state
  const [lives, setLives] = useState(modeCfg.lives || 1);
  const [bonusSec, setBonusSec] = useState(0);   // countdown mode +bonus
  const [score, setScore] = useState(0);          // combo mode
  const [combo, setCombo] = useState(0);          // combo mode
  const [comboPopups, setComboPopups] = useState([]);

  const startedAt = useRef(0);
  const lastRevealAt = useRef(0);

  const [bestRecords, setBestRecords] = useState(() => {
    try { return JSON.parse(localStorage.getItem('msweeper_records') || '{}'); } catch { return {}; }
  });

  // Reset on difficulty/mode change
  useEffect(() => {
    doReset();
    // eslint-disable-next-line
  }, [t.difficulty, t.mode]);

  function doReset() {
    setBoard(createEmptyBoard(diff.rows, diff.cols));
    setSeeded(false);
    setGameState('idle');
    setTick(0);
    setLives(modeCfg.lives || 1);
    setBonusSec(0);
    setScore(0);
    setCombo(0);
    setComboPopups([]);
    setShieldActive(false);
    setXrayUntil(0);
    pauseEndAt.current = 0;
    startedAt.current = 0;
    lastRevealAt.current = 0;
  }
  const reset = useCallback(doReset, [diff.rows, diff.cols, t.mode]);

  // Timer tick
  useEffect(() => {
    if (gameState !== 'playing') return;
    let last = Date.now();
    const id = setInterval(() => {
      const now = Date.now();
      const dt = now - last;
      last = now;
      // If frozen, shift startedAt forward so elapsed stays put
      if (now < pauseEndAt.current) {
        startedAt.current += dt;
      }
      setTick(x => x + 1);
    }, 100);
    return () => clearInterval(id);
  }, [gameState]);

  // Combo decay
  useEffect(() => {
    if (t.mode !== 'combo' || gameState !== 'playing') return;
    if (combo === 0) return;
    const id = setInterval(() => {
      if (Date.now() - lastRevealAt.current >= 1800) {
        setCombo(0);
      } else {
        setTick(x => x + 1); // for decay bar redraw
      }
    }, 100);
    return () => clearInterval(id);
  }, [combo, t.mode, gameState]);

  // Pop expired combo popups
  useEffect(() => {
    if (comboPopups.length === 0) return;
    const id = setTimeout(() => {
      setComboPopups(prev => prev.filter(p => Date.now() - p.t < 900));
    }, 100);
    return () => clearTimeout(id);
  }, [comboPopups, tick]);

  // Derived: elapsed / countdown
  const elapsed = gameState === 'idle' ? 0 : (Date.now() - startedAt.current) / 1000;
  const timeSec = Math.min(999, Math.floor(elapsed));
  const countdownInit = (modeCfg.initTime && modeCfg.initTime[diffId]) || 60;
  const countdownRemaining = Math.max(0, countdownInit + bonusSec - elapsed);
  const countdownLow = t.mode === 'countdown' && countdownRemaining > 0 && countdownRemaining <= 10;
  const comboDecay = Math.max(0, 1 - (Date.now() - lastRevealAt.current) / 1800);

  // Countdown timeout → lose
  useEffect(() => {
    if (t.mode === 'countdown' && gameState === 'playing' && countdownRemaining <= 0) {
      const next = cloneBoard(board);
      revealAllMines(next, false);
      setBoard(next);
      setGameState('lost');
    }
  }, [t.mode, gameState, countdownRemaining]);

  // Flag count
  const flagsUsed = useMemo(() => {
    let n = 0;
    for (const row of board) for (const c of row) if (c.flagged) n++;
    return n;
  }, [board]);

  // Fog mask for blackout
  const fogMask = useMemo(() => {
    if (t.mode !== 'blackout') return null;
    if (!seeded) return null; // before first click, no fog (player picks blind anyway)
    const rows = board.length, cols = board[0].length;
    const fog = Array.from({ length: rows }, () => Array(cols).fill(true));
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (board[r][c].revealed) {
          fog[r][c] = false;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = r + dr, nc = c + dc;
              if (nr >= 0 && nc >= 0 && nr < rows && nc < cols) fog[nr][nc] = false;
            }
          }
        }
      }
    }
    return fog;
  }, [board, t.mode, seeded]);

  // Cell sizing
  const cellSize = useMemo(() => {
    const padding = 20 * 2;
    const boardPad = 10 * 2 + 1.5 * 2;
    const gap = 3;
    const maxWidth = 402 - padding - boardPad;
    const maxByW = Math.floor((maxWidth - gap * (diff.cols - 1)) / diff.cols);
    // status bar 62 + header 60 + diff selector 70 + hint row 44 + hud 92 + bottom toggle 100 ≈ 428 fixed
    const maxHeight = 874 - 62 - 60 - 70 - 44 - 92 - 100;
    const maxByH = Math.floor((maxHeight - gap * (diff.rows - 1)) / diff.rows);
    return Math.max(20, Math.min(maxByW, maxByH, 44));
  }, [diff.rows, diff.cols]);

  function pushComboPopup(r, c, text, color) {
    const gap = 3;
    const x = 10 + c * (cellSize + gap) + cellSize / 2;
    const y = 10 + r * (cellSize + gap) + cellSize / 2;
    setComboPopups(prev => [...prev, {
      id: Math.random().toString(36).slice(2),
      x, y, text, color, t: Date.now(),
    }]);
  }

  function recordBest(value) {
    setBestRecords(prev => {
      const key = `${t.mode}-${diffId}`;
      const cur = prev[key];
      const better = t.mode === 'combo'
        ? (cur == null || value > cur)
        : t.mode === 'countdown'
          ? (cur == null || value > cur)
          : (cur == null || value < cur);
      if (better) {
        const next = { ...prev, [key]: value };
        try { localStorage.setItem('msweeper_records', JSON.stringify(next)); } catch {}
        return next;
      }
      return prev;
    });
  }

  // ─── Coin reward on win ──────────────────────────────────
  function awardWinCoins(extraScore = 0) {
    const tier = diff.tier || 1;
    const modeMul = { classic: 1, countdown: 1.5, triple: 1.3, blackout: 1.7, combo: 1 }[t.mode] || 1;
    let coins = Math.floor(effectiveMines * tier * modeMul * 0.4);
    if (t.mode === 'combo') {
      const finalScore = score + extraScore;
      coins = Math.max(coins, Math.floor(finalScore / 6));
    }
    if (coins <= 0) coins = 1;
    setInv(i => ({ ...i, coins: i.coins + coins }));
    setCoinDelta(coins);
    setCoinPopup(coins);
    setTimeout(() => setCoinDelta(0), 1400);
    setTimeout(() => setCoinPopup(0), 1800);
    return coins;
  }

  // ─── Hint card actions ───────────────────────────────────
  function useHintCard(key) {
    if (gameState !== 'playing') return;
    if ((inv.cards[key] || 0) <= 0) return;
    if (key === 'safe') {
      // pick a random unrevealed, non-mine, non-flagged cell and reveal it
      const candidates = [];
      for (let r = 0; r < board.length; r++) {
        for (let c = 0; c < board[0].length; c++) {
          const cell = board[r][c];
          if (!cell.mine && !cell.revealed && !cell.flagged) candidates.push([r, c]);
        }
      }
      if (candidates.length === 0) return;
      const [r, c] = candidates[Math.floor(Math.random() * candidates.length)];
      const next = cloneBoard(board);
      floodReveal(next, r, c);
      if (checkWin(next)) {
        for (const row of next) for (const cell of row) if (cell.mine) cell.flagged = true;
        setBoard(next);
        setGameState('won');
        const earned = awardWinCoins();
        if (navigator.vibrate) navigator.vibrate([20, 30, 20, 30, 60]);
        if (t.mode === 'combo') recordBest(score);
        else if (t.mode === 'countdown') recordBest(Math.max(0, Math.ceil(countdownInit + bonusSec - elapsed)));
        else recordBest(Math.floor(elapsed));
      } else {
        setBoard(next);
      }
    } else if (key === 'freeze') {
      pauseEndAt.current = Math.max(pauseEndAt.current, Date.now()) + 10000;
    } else if (key === 'xray') {
      setXrayUntil(Date.now() + 1500);
    } else if (key === 'shield') {
      setShieldActive(true);
    }
    if (navigator.vibrate) navigator.vibrate(10);
    setInv(i => ({ ...i, cards: { ...i.cards, [key]: (i.cards[key] || 0) - 1 } }));
  }

  // ─── Shop transactions ───────────────────────────────────
  function buyHint(key) {
    const price = HINT_CARDS[key].price;
    if (inv.coins < price) return;
    setInv(i => ({
      ...i,
      coins: i.coins - price,
      cards: { ...i.cards, [key]: (i.cards[key] || 0) + 1 },
    }));
    if (navigator.vibrate) navigator.vibrate(8);
  }
  function buySkin(key) {
    const cfg = SKIN_PACKS[key];
    if (!cfg || inv.owned.includes(key)) return;
    if (inv.coins < cfg.price) return;
    setInv(i => ({
      ...i,
      coins: i.coins - cfg.price,
      owned: [...i.owned, key],
    }));
    setT('palette', key);
    if (navigator.vibrate) navigator.vibrate([8, 20, 8]);
  }
  function selectSkin(key) {
    if (!inv.owned.includes(key)) return;
    setT('palette', key);
  }

  // xray active flag
  const xrayActive = gameState === 'playing' && Date.now() < xrayUntil;
  // Re-tick when xray about to end
  useEffect(() => {
    if (!xrayActive) return;
    const id = setTimeout(() => setTick(x => x + 1), xrayUntil - Date.now() + 50);
    return () => clearTimeout(id);
  }, [xrayActive, xrayUntil]);

  // Active hint card states (for HintCardRow display)
  const activeHintStates = {
    shield: shieldActive,
    xray: xrayActive,
    freeze: Date.now() < pauseEndAt.current && gameState === 'playing',
  };

  // ─── Cell action handler ──────────────────────────────────
  const handleCellAction = useCallback((r, c, action) => {
    if (gameState === 'won' || gameState === 'lost') return;

    if (action === 'press') { setPressing(true); return; }
    if (action === 'cancel') { setPressing(false); return; }
    setPressing(false);

    const next = cloneBoard(board);
    const cur = next[r][c];

    if (action === 'long') {
      if (cur.revealed) return;
      cur.flagged = !cur.flagged;
      setBoard(next);
      return;
    }

    const countRevealed = (b) => {
      let n = 0;
      for (const row of b) for (const c of row) if (c.revealed && !c.mine) n++;
      return n;
    };

    const applyComboGain = (rr, cc, gained) => {
      if (t.mode !== 'combo' || gained <= 0) return 0;
      const now = Date.now();
      const dt = now - lastRevealAt.current;
      const inWindow = dt < 1500;
      const newCombo = inWindow ? combo + 1 : 1;
      const mult = Math.min(newCombo, 9);
      const points = gained * mult;
      setCombo(newCombo);
      setScore(s => s + points);
      lastRevealAt.current = now;
      pushComboPopup(rr, cc, `+${points}`, mult >= 3 ? '#FFD24A' : '#FFFFFF');
      return points;
    };

    const finishWin = (extraScore = 0) => {
      if (navigator.vibrate) navigator.vibrate([20, 30, 20, 30, 60]);
      const nowElapsed = (Date.now() - startedAt.current) / 1000;
      if (t.mode === 'combo') recordBest(score + extraScore);
      else if (t.mode === 'countdown') recordBest(Math.max(0, Math.ceil(countdownInit + bonusSec - nowElapsed)));
      else recordBest(Math.floor(nowElapsed));
      awardWinCoins(extraScore);
    };

    if (action === 'chord') {
      if (!seeded) return;
      const before = countRevealed(next);
      const result = chord(next, r, c);
      const after = countRevealed(next);
      const gained = after - before;
      if (result.hitMine) {
        if (shieldActive) {
          // Shield absorbs chord hit: flag all exploded mines, consume shield
          for (const row of next) for (const cell of row) {
            if (cell.exploded) {
              cell.flagged = true;
              cell.revealed = false;
              cell.exploded = false;
            }
          }
          setShieldActive(false);
          setBoard(next);
          if (navigator.vibrate) navigator.vibrate([15, 30, 15]);
          return;
        }
        if (t.mode === 'triple') {
          let exploded = 0;
          for (const row of next) for (const cell of row) if (cell.exploded) exploded++;
          for (const row of next) for (const cell of row) {
            if (cell.exploded) {
              cell.flagged = true;
              cell.revealed = false;
              cell.exploded = false;
            }
          }
          const newLives = lives - exploded;
          if (newLives <= 0) {
            revealAllMines(next, true);
            setBoard(next);
            setGameState('lost');
            setLives(0);
            if (navigator.vibrate) navigator.vibrate([30, 50, 100]);
            return;
          }
          setLives(newLives);
          setCombo(0);
          setBoard(next);
          if (navigator.vibrate) navigator.vibrate(80);
          return;
        }
        revealAllMines(next, true);
        setBoard(next);
        setGameState('lost');
        setCombo(0);
        if (navigator.vibrate) navigator.vibrate([30, 50, 100]);
        return;
      }
      if (result.changed) {
        if (t.mode === 'countdown' && gained > 0) setBonusSec(b => b + gained * modeCfg.perReveal);
        const earned = applyComboGain(r, c, gained);
        if (checkWin(next)) {
          for (const row of next) for (const cell of row) if (cell.mine) cell.flagged = true;
          setBoard(next);
          setGameState('won');
          finishWin(earned);
          return;
        }
        setBoard(next);
      }
      return;
    }

    // action === 'tap'
    if (mode === 'flag') {
      if (cur.revealed) return;
      cur.flagged = !cur.flagged;
      setBoard(next);
      return;
    }
    if (cur.flagged) return;
    if (!seeded) {
      placeMines(next, effectiveMines, r, c);
      setSeeded(true);
      startedAt.current = Date.now();
      lastRevealAt.current = Date.now();
      setGameState('playing');
    }
    const before = countRevealed(next);
    const hit = floodReveal(next, r, c);
    const after = countRevealed(next);
    const gained = after - before;

    if (hit) {
      if (shieldActive) {
        // Shield absorbs the hit: auto-flag the mine, consume shield
        next[r][c].flagged = true;
        next[r][c].revealed = false;
        next[r][c].exploded = false;
        setShieldActive(false);
        setBoard(next);
        if (navigator.vibrate) navigator.vibrate([15, 30, 15]);
        return;
      }
      if (t.mode === 'triple' && lives > 1) {
        next[r][c].flagged = true;
        next[r][c].revealed = false;
        next[r][c].exploded = false;
        setLives(l => l - 1);
        setCombo(0);
        setBoard(next);
        if (navigator.vibrate) navigator.vibrate(80);
        return;
      }
      revealAllMines(next, true);
      setBoard(next);
      setGameState('lost');
      setCombo(0);
      if (navigator.vibrate) navigator.vibrate([30, 50, 100]);
      return;
    }

    if (t.mode === 'countdown' && gained > 0) setBonusSec(b => b + gained * modeCfg.perReveal);
    const earned = applyComboGain(r, c, gained);
    if (checkWin(next)) {
      for (const row of next) for (const cell of row) if (cell.mine) cell.flagged = true;
      setBoard(next);
      setGameState('won');
      finishWin(earned);
      return;
    }
    setBoard(next);
  }, [board, gameState, mode, seeded, effectiveMines, t.mode, lives, combo, score, bonusSec, countdownInit, cellSize, modeCfg.perReveal, shieldActive, inv]);

  const minesLeft = effectiveMines - flagsUsed;
  const faceState =
    gameState === 'won' ? 'win' :
    gameState === 'lost' ? 'dead' :
    pressing ? 'oh' : 'play';

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 40, position: 'relative' }}>
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(40px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>

      <div style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}>
      <IOSDevice dark={pal.deviceDark} width={402} height={874}>
        <div style={{ position: 'relative', height: '100%', background: pal.bg, color: pal.text, overflow: 'hidden' }}>
          <Header pal={pal} mode={t.mode} coins={inv.coins} coinDelta={coinDelta}
            onOpenMode={() => setSheetOpen(true)}
            onOpenShop={() => setShopOpen(true)}
          />
          <DifficultySelector value={diffId} pal={pal} onChange={(k) => setT('difficulty', k)} />

          <HintCardRow
            inv={inv} pal={pal}
            gameState={gameState}
            activeStates={activeHintStates}
            onUse={useHintCard}
          />

          <div style={{ padding: '0 20px 14px' }}>
            <GameHUD
              mode={t.mode} pal={pal}
              minesLeft={minesLeft}
              time={timeSec}
              countdown={countdownRemaining}
              countdownLow={countdownLow}
              lives={lives}
              totalLives={modeCfg.lives || 3}
              score={score}
              combo={combo}
              comboDecay={comboDecay}
              faceState={faceState}
              onReset={reset}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 20px 0', position: 'relative' }}>
            <div style={{ position: 'relative' }}>
              <Board
                board={board}
                pal={pal}
                cellSize={cellSize}
                numberStyle={t.numberStyle}
                gameOver={gameState === 'won' || gameState === 'lost'}
                won={gameState === 'won'}
                showHints={t.showHints}
                longPressEnabled={t.longPressFlag}
                fogMask={fogMask}
                xrayActive={xrayActive}
                onCellAction={handleCellAction}
              />
              <ComboPopup entries={comboPopups} />
            </div>
          </div>

          <BestLine mode={t.mode} diff={diff} bests={bestRecords} pal={pal} />
          <StatusBanner state={gameState} time={timeSec} score={score} mode={t.mode} pal={pal} onReset={reset} />

          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 34 }}>
            <ModeToggle mode={mode} pal={pal} onChange={setMode} longPressEnabled={t.longPressFlag} />
          </div>

          <ModeSheet
            open={sheetOpen}
            mode={t.mode}
            pal={pal}
            onSelect={(k) => { setT('mode', k); setSheetOpen(false); }}
            onClose={() => setSheetOpen(false)}
          />

          <ShopSheet
            open={shopOpen}
            pal={pal}
            inv={{ ...inv, currentPalette: t.palette }}
            onClose={() => setShopOpen(false)}
            onBuyHint={buyHint}
            onBuySkin={buySkin}
            onSelectSkin={selectSkin}
          />

          <CoinPopup value={coinPopup} pal={pal} />
        </div>
      </IOSDevice>
      </div>

      <TweaksPanel title="Tweaks" noDeckControls>
        <TweakSection label="模式 & 難度">
          <TweakSelect
            label="遊戲模式"
            value={t.mode}
            options={Object.entries(MODE_CONFIG).map(([k, v]) => ({ value: k, label: v.name }))}
            onChange={(v) => setT('mode', v)}
          />
          <TweakSelect
            label="難度"
            value={t.difficulty}
            options={DIFF_ORDER.map(k => ({ value: k, label: DIFFICULTIES[k].name }))}
            onChange={(v) => setT('difficulty', v)}
          />
          <TweakButton label="重新開始" onClick={reset} />
        </TweakSection>

        <TweakSection label="外觀">
          <TweakSelect
            label="調色盤"
            value={t.palette}
            options={inv.owned.map(k => ({ value: k, label: SKIN_PACKS[k]?.name || k }))}
            onChange={(v) => setT('palette', v)}
          />
          <TweakRadio
            label="數字配色"
            value={t.numberStyle}
            options={[
              { value: 'color', label: '彩色' },
              { value: 'mono', label: '單色' },
            ]}
            onChange={(v) => setT('numberStyle', v)}
          />
        </TweakSection>

        <TweakSection label="操作">
          <TweakToggle
            label="長按插旗"
            value={t.longPressFlag}
            onChange={(v) => setT('longPressFlag', v)}
          />
          <TweakToggle
            label="作弊提示"
            value={t.showHints}
            onChange={(v) => setT('showHints', v)}
          />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<MinesweeperApp />);
