// game.jsx — Minesweeper core: palettes, game logic, board rendering

const PALETTES = {
  warm: {
    name: '暖灰',
    swatch: '#D4C9B6',
    deviceDark: false,
    bg: '#EDE6D7',
    panel: '#E2D9C5',
    panelInset: '#CFC3A9',
    panelBorder: '#B8AB8B',
    cellHidden: '#D4C9B6',
    cellHiddenAlt: '#CFC2AB',
    cellRevealed: '#EFE9DB',
    cellRevealedAlt: '#E8E1D0',
    cellBorder: '#BCAE93',
    cellPressed: '#C0B49C',
    cellMine: '#C6453B',
    cellMineHit: '#A33028',
    cellFog: '#8C8472',
    cellFogBorder: '#6E6753',
    text: '#2A211A',
    textSoft: '#6B5E4C',
    textMuted: '#9B8E78',
    accent: '#5A4FCF',
    flag: '#C84A3C',
    flagPole: '#3A2E22',
    hudBg: '#1F1A14',
    hudText: '#FF6B57',
    numbers: ['', '#3955C6', '#2A8255', '#C6453B', '#7B3FBF', '#8B4513', '#1B7A85', '#2A211A', '#5A4F44'],
  },
  slate: {
    name: '夜行',
    swatch: '#2A2F3A',
    deviceDark: true,
    bg: '#13161C',
    panel: '#1B1F28',
    panelInset: '#0E1116',
    panelBorder: '#2A303B',
    cellHidden: '#2A2F3A',
    cellHiddenAlt: '#262B35',
    cellRevealed: '#171A21',
    cellRevealedAlt: '#191D24',
    cellBorder: '#363D4A',
    cellPressed: '#363D4A',
    cellMine: '#E25548',
    cellMineHit: '#C13B30',
    cellFog: '#0F1217',
    cellFogBorder: '#1E232C',
    text: '#ECEDEF',
    textSoft: '#A0A6B0',
    textMuted: '#5C6470',
    accent: '#8B85FF',
    flag: '#FF6B57',
    flagPole: '#ECEDEF',
    hudBg: '#0A0C10',
    hudText: '#FF6B57',
    numbers: ['', '#7A9CFF', '#6CCB9A', '#FF7A6B', '#C39BFF', '#E0A87A', '#7AD9E0', '#ECEDEF', '#A0A6B0'],
  },
  mint: {
    name: '薄荷',
    swatch: '#BDD9C8',
    deviceDark: false,
    bg: '#E6EFE8',
    panel: '#D6E3D9',
    panelInset: '#B7CABB',
    panelBorder: '#9CB6A2',
    cellHidden: '#BDD9C8',
    cellHiddenAlt: '#B5D2C0',
    cellRevealed: '#EAF1EB',
    cellRevealedAlt: '#E3ECE5',
    cellBorder: '#9DB7A3',
    cellPressed: '#A5C0AC',
    cellMine: '#D9514A',
    cellMineHit: '#B33A33',
    cellFog: '#5C7867',
    cellFogBorder: '#3F5749',
    text: '#1F2D26',
    textSoft: '#56685F',
    textMuted: '#8AA396',
    accent: '#2D6E55',
    flag: '#D9514A',
    flagPole: '#1F2D26',
    hudBg: '#15201A',
    hudText: '#FF8275',
    numbers: ['', '#2E5BBF', '#1F7A47', '#C0463B', '#6B3FAE', '#7A4A1F', '#1B6A75', '#1F2D26', '#56685F'],
  },
  lavender: {
    name: '薰衣草',
    swatch: '#C5B5D8',
    deviceDark: false,
    bg: '#EFE9F4',
    panel: '#E2D7EB',
    panelInset: '#CBBBD9',
    panelBorder: '#B19BC1',
    cellHidden: '#C5B5D8',
    cellHiddenAlt: '#BFAFD2',
    cellRevealed: '#EFE9F4',
    cellRevealedAlt: '#E7E0EC',
    cellBorder: '#A993BD',
    cellPressed: '#B5A5C8',
    cellMine: '#C04270',
    cellMineHit: '#9A2F58',
    cellFog: '#7B6D8F',
    cellFogBorder: '#5C5070',
    text: '#2A1E3C',
    textSoft: '#5D4F72',
    textMuted: '#9389A6',
    accent: '#6A4FB5',
    flag: '#C04270',
    flagPole: '#2A1E3C',
    hudBg: '#1E1530',
    hudText: '#FF7CB0',
    numbers: ['', '#5B57CE', '#2E8B66', '#C04270', '#7B3FBF', '#8B4513', '#1B7A85', '#2A1E3C', '#5D4F72'],
  },
  rose: {
    name: '玫瑰金',
    swatch: '#DCBFAD',
    deviceDark: false,
    bg: '#F4ECE5',
    panel: '#EBDDD0',
    panelInset: '#D9C2AE',
    panelBorder: '#BF9B82',
    cellHidden: '#DCBFAD',
    cellHiddenAlt: '#D6B7A4',
    cellRevealed: '#F2EAE2',
    cellRevealedAlt: '#ECE2D9',
    cellBorder: '#BC9B82',
    cellPressed: '#C5A48A',
    cellMine: '#B84458',
    cellMineHit: '#922F40',
    cellFog: '#8C7669',
    cellFogBorder: '#6A554A',
    text: '#2F1F1A',
    textSoft: '#6E5446',
    textMuted: '#A08772',
    accent: '#C26B5E',
    flag: '#B84458',
    flagPole: '#2F1F1A',
    hudBg: '#22120F',
    hudText: '#FF8278',
    numbers: ['', '#4456B5', '#367856', '#B84458', '#7B3FBF', '#8B4513', '#1B7A85', '#2F1F1A', '#6E5446'],
  },
  ocean: {
    name: '海洋深處',
    swatch: '#1F3140',
    deviceDark: true,
    bg: '#0E1A22',
    panel: '#16242E',
    panelInset: '#0A1218',
    panelBorder: '#243646',
    cellHidden: '#1F3140',
    cellHiddenAlt: '#1B2C3A',
    cellRevealed: '#12202A',
    cellRevealedAlt: '#15232E',
    cellBorder: '#2C4254',
    cellPressed: '#324A60',
    cellMine: '#FF6E51',
    cellMineHit: '#E04B30',
    cellFog: '#070D12',
    cellFogBorder: '#14222C',
    text: '#E2EEF4',
    textSoft: '#8FA8B8',
    textMuted: '#566876',
    accent: '#5BC5D9',
    flag: '#FF6E51',
    flagPole: '#E2EEF4',
    hudBg: '#060B10',
    hudText: '#5BC5D9',
    numbers: ['', '#74B0FF', '#6BD9B5', '#FF8E76', '#C39BFF', '#E0A87A', '#5BC5D9', '#E2EEF4', '#8FA8B8'],
  },
};

const DIFFICULTIES = {
  easy:   { name: '簡單', cols: 9,  rows: 9,  mines: 10, tier: 1 },
  medium: { name: '中等', cols: 10, rows: 13, mines: 20, tier: 1.6 },
  hard:   { name: '困難', cols: 10, rows: 16, mines: 35, tier: 2.4 },
  hell:   { name: '地獄', cols: 10, rows: 18, mines: 55, tier: 3.6 },
  master: { name: '大師', cols: 11, rows: 19, mines: 75, tier: 5 },
};

const DIFF_ORDER = ['easy', 'medium', 'hard', 'hell', 'master'];

// ─── Pure board logic ────────────────────────────────────────
function createEmptyBoard(rows, cols) {
  const b = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      row.push({ mine: false, revealed: false, flagged: false, count: 0, exploded: false, wrongFlag: false });
    }
    b.push(row);
  }
  return b;
}

function neighbors(r, c, rows, cols) {
  const out = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (!dr && !dc) continue;
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nc >= 0 && nr < rows && nc < cols) out.push([nr, nc]);
    }
  }
  return out;
}

function placeMines(board, mineCount, safeR, safeC) {
  const rows = board.length, cols = board[0].length;
  const safe = new Set();
  safe.add(safeR * cols + safeC);
  for (const [nr, nc] of neighbors(safeR, safeC, rows, cols)) {
    safe.add(nr * cols + nc);
  }
  const candidates = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!safe.has(r * cols + c)) candidates.push([r, c]);
    }
  }
  // Fisher-Yates partial shuffle
  for (let i = 0; i < mineCount; i++) {
    const j = i + Math.floor(Math.random() * (candidates.length - i));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
    const [r, c] = candidates[i];
    board[r][c].mine = true;
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c].mine) continue;
      let n = 0;
      for (const [nr, nc] of neighbors(r, c, rows, cols)) {
        if (board[nr][nc].mine) n++;
      }
      board[r][c].count = n;
    }
  }
}

function cloneBoard(board) {
  return board.map(row => row.map(cell => ({ ...cell })));
}

function floodReveal(board, r, c) {
  // returns true if a mine was uncovered
  const rows = board.length, cols = board[0].length;
  const cell = board[r][c];
  if (cell.flagged || cell.revealed) return false;
  if (cell.mine) {
    cell.revealed = true;
    cell.exploded = true;
    return true;
  }
  const stack = [[r, c]];
  while (stack.length) {
    const [cr, cc] = stack.pop();
    const cur = board[cr][cc];
    if (cur.revealed || cur.flagged || cur.mine) continue;
    cur.revealed = true;
    if (cur.count === 0) {
      for (const [nr, nc] of neighbors(cr, cc, rows, cols)) {
        const nb = board[nr][nc];
        if (!nb.revealed && !nb.flagged && !nb.mine) stack.push([nr, nc]);
      }
    }
  }
  return false;
}

function chord(board, r, c) {
  // Reveal all unflagged neighbors if flag count equals number
  const rows = board.length, cols = board[0].length;
  const cell = board[r][c];
  if (!cell.revealed || cell.count === 0) return { changed: false, hitMine: false };
  let flags = 0;
  const ns = neighbors(r, c, rows, cols);
  for (const [nr, nc] of ns) if (board[nr][nc].flagged) flags++;
  if (flags !== cell.count) return { changed: false, hitMine: false };
  let hitMine = false, changed = false;
  for (const [nr, nc] of ns) {
    const nb = board[nr][nc];
    if (nb.flagged || nb.revealed) continue;
    if (floodReveal(board, nr, nc)) hitMine = true;
    changed = true;
  }
  return { changed, hitMine };
}

function checkWin(board) {
  for (const row of board) {
    for (const cell of row) {
      if (!cell.mine && !cell.revealed) return false;
    }
  }
  return true;
}

function revealAllMines(board, exploded) {
  for (const row of board) {
    for (const cell of row) {
      if (cell.mine && !cell.flagged) cell.revealed = true;
      if (!cell.mine && cell.flagged) cell.wrongFlag = true;
    }
  }
}

// ─── Smiley face button (custom SVG; no emoji) ────────────────
function FaceButton({ state, pal, onClick }) {
  // states: 'play' 'oh' 'win' 'dead'
  const stroke = '#1A1410';
  const yellow = '#F2C849';
  return (
    <button
      onClick={onClick}
      style={{
        width: 48, height: 48, borderRadius: 12,
        background: pal.panel, border: `1.5px solid ${pal.panelBorder}`,
        boxShadow: `inset 0 -2px 0 ${pal.panelBorder}, 0 1px 0 rgba(255,255,255,0.5) inset, 0 1px 2px rgba(0,0,0,0.06)`,
        padding: 0, cursor: 'pointer', display: 'grid', placeItems: 'center',
      }}
      aria-label="新局"
    >
      <svg width="32" height="32" viewBox="0 0 32 32">
        <circle cx="16" cy="16" r="13" fill={yellow} stroke={stroke} strokeWidth="1.8" />
        {state === 'dead' ? (
          <>
            <path d="M10 11 l4 4 M14 11 l-4 4" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
            <path d="M18 11 l4 4 M22 11 l-4 4" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
            <path d="M11 22 q5 -3 10 0" stroke={stroke} strokeWidth="1.8" fill="none" strokeLinecap="round" />
          </>
        ) : state === 'win' ? (
          <>
            <path d="M8 13 h7 M17 13 h7" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" />
            <path d="M10 19 q6 6 12 0" stroke={stroke} strokeWidth="1.8" fill="none" strokeLinecap="round" />
          </>
        ) : state === 'oh' ? (
          <>
            <circle cx="12" cy="13" r="1.4" fill={stroke} />
            <circle cx="20" cy="13" r="1.4" fill={stroke} />
            <circle cx="16" cy="20" r="2.2" fill="none" stroke={stroke} strokeWidth="1.6" />
          </>
        ) : (
          <>
            <circle cx="12" cy="13" r="1.4" fill={stroke} />
            <circle cx="20" cy="13" r="1.4" fill={stroke} />
            <path d="M10 18 q6 5 12 0" stroke={stroke} strokeWidth="1.8" fill="none" strokeLinecap="round" />
          </>
        )}
      </svg>
    </button>
  );
}

// ─── Seven-segment style counter ──────────────────────────────
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
    }}>{s}</div>
  );
}

// ─── HUD: mines + face + timer ────────────────────────────────
function HUD({ minesLeft, time, faceState, pal, onReset }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: pal.panel,
      padding: '12px 14px',
      borderRadius: 18,
      border: `1.5px solid ${pal.panelBorder}`,
      boxShadow: `inset 0 1px 0 rgba(255,255,255,0.4), 0 1px 2px rgba(0,0,0,0.05)`,
    }}>
      <Counter value={minesLeft} pal={pal} />
      <FaceButton state={faceState} pal={pal} onClick={onReset} />
      <Counter value={time} pal={pal} />
    </div>
  );
}

// ─── Cell ─────────────────────────────────────────────────────
function Cell({ cell, r, c, size, pal, numberStyle, gameOver, won, onAction, longPressEnabled, showHints, fogged, xrayActive }) {
  const isAlt = (r + c) % 2 === 1;
  const numColor = numberStyle === 'mono' ? pal.text : (pal.numbers[cell.count] || pal.text);
  const fontSize = Math.max(14, Math.round(size * 0.55));

  const pressTimer = React.useRef(null);
  const longPressed = React.useRef(false);

  const start = (e) => {
    if (e.cancelable) e.preventDefault();
    if (gameOver) return;
    longPressed.current = false;
    onAction('press');
    if (longPressEnabled) {
      pressTimer.current = setTimeout(() => {
        longPressed.current = true;
        onAction('long');
        if (navigator.vibrate) navigator.vibrate(15);
      }, 320);
    }
  };
  const end = (e) => {
    if (e.cancelable) e.preventDefault();
    if (pressTimer.current) { clearTimeout(pressTimer.current); pressTimer.current = null; }
    if (gameOver) { onAction('cancel'); return; }
    if (longPressed.current) { onAction('cancel'); return; }
    if (cell.revealed && cell.count > 0) onAction('chord');
    else onAction('tap');
  };
  const cancel = () => {
    if (pressTimer.current) { clearTimeout(pressTimer.current); pressTimer.current = null; }
    onAction('cancel');
  };

  let bg, content, border;

  if (cell.revealed) {
    if (cell.mine) {
      bg = cell.exploded ? pal.cellMineHit : pal.cellMine;
      content = <MineIcon size={size * 0.55} color="#fff" />;
    } else {
      bg = isAlt ? pal.cellRevealedAlt : pal.cellRevealed;
      content = cell.count > 0 ? (
        <span style={{
          fontFamily: '"JetBrains Mono", ui-monospace, monospace',
          fontWeight: 700, fontSize, color: numColor, lineHeight: 1,
        }}>{cell.count}</span>
      ) : null;
    }
    border = pal.cellBorder;
  } else if (cell.wrongFlag) {
    bg = isAlt ? pal.cellRevealedAlt : pal.cellRevealed;
    content = (
      <div style={{ position: 'relative', width: size * 0.6, height: size * 0.6 }}>
        <MineIcon size={size * 0.55} color={pal.textSoft} />
        <svg width={size * 0.7} height={size * 0.7} viewBox="0 0 24 24" style={{ position: 'absolute', inset: -size*0.05 }}>
          <path d="M4 4 L20 20 M20 4 L4 20" stroke={pal.cellMine} strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>
    );
    border = pal.cellBorder;
  } else if (cell.flagged) {
    bg = isAlt ? pal.cellHiddenAlt : pal.cellHidden;
    content = <FlagIcon size={size * 0.6} flag={pal.flag} pole={pal.flagPole} />;
    border = pal.cellBorder;
  } else {
    bg = isAlt ? pal.cellHiddenAlt : pal.cellHidden;
    border = pal.cellBorder;
    // optional hint: show a faint count for the "true" answer in dev (we keep this for showHints tweak)
    if (showHints) {
      if (cell.mine) content = <div style={{width: 4, height: 4, borderRadius: 2, background: pal.cellMine}} />;
      else if (cell.count > 0) content = <span style={{fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: pal.textMuted}}>{cell.count}</span>;
    }
    if (fogged) {
      bg = pal.cellFog;
      border = pal.cellFogBorder;
    }
    if (xrayActive && cell.mine && !cell.flagged) {
      content = (
        <div style={{ animation: 'xrayPulse 0.8s ease-in-out infinite' }}>
          <MineIcon size={size * 0.55} color={pal.cellMine} />
        </div>
      );
    }
  }

  return (
    <button
      style={{
        width: size, height: size, padding: 0,
        background: bg,
        border: `0.5px solid ${border}`,
        borderRadius: Math.max(3, Math.round(size * 0.14)),
        boxShadow: cell.revealed
          ? `inset 0 0 0 0.5px ${pal.cellBorder}55`
          : `inset 0 -1.5px 0 rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.35)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: gameOver ? 'default' : 'pointer',
        transition: 'background 0.08s',
        position: 'relative',
      }}
      onMouseDown={start}
      onMouseUp={end}
      onMouseLeave={cancel}
      onTouchStart={start}
      onTouchEnd={end}
      onTouchCancel={cancel}
      onContextMenu={(e) => { e.preventDefault(); if (!gameOver) onAction('long'); }}
    >
      {content}
    </button>
  );
}

function MineIcon({ size, color }) {
  const s = Math.round(size);
  return (
    <svg width={s} height={s} viewBox="0 0 24 24">
      <g fill={color}>
        <rect x="11" y="2" width="2" height="20" />
        <rect x="2" y="11" width="20" height="2" />
        <rect x="4.5" y="4.5" width="2" height="2" transform="rotate(45 5.5 5.5)" />
        <rect x="17.5" y="4.5" width="2" height="2" transform="rotate(45 18.5 5.5)" />
        <rect x="4.5" y="17.5" width="2" height="2" transform="rotate(45 5.5 18.5)" />
        <rect x="17.5" y="17.5" width="2" height="2" transform="rotate(45 18.5 18.5)" />
        <circle cx="12" cy="12" r="5" />
      </g>
      <circle cx="10" cy="10" r="1.4" fill="rgba(255,255,255,0.55)" />
    </svg>
  );
}

function FlagIcon({ size, flag, pole }) {
  const s = Math.round(size);
  return (
    <svg width={s} height={s} viewBox="0 0 24 24">
      <path d="M7 4 L7 20" stroke={pole} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M5 19.5 h10" stroke={pole} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M7 4 L17 7.5 L7 11 Z" fill={flag} stroke={pole} strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Board ────────────────────────────────────────────────────
function Board({ board, pal, cellSize, numberStyle, gameOver, won, showHints, longPressEnabled, fogMask, xrayActive, onCellAction }) {
  const cols = board[0].length;
  const gap = 3;
  return (
    <div style={{
      background: pal.panelInset,
      padding: 10,
      borderRadius: 16,
      border: `1.5px solid ${pal.panelBorder}`,
      boxShadow: `inset 0 2px 4px rgba(0,0,0,0.12)`,
      display: 'inline-block',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
        gap,
      }}>
        {board.flatMap((row, r) => row.map((cell, c) => (
          <Cell
            key={`${r}-${c}`}
            cell={cell} r={r} c={c} size={cellSize}
            pal={pal}
            numberStyle={numberStyle}
            gameOver={gameOver}
            won={won}
            showHints={showHints}
            longPressEnabled={longPressEnabled}
            fogged={fogMask ? fogMask[r][c] : false}
            xrayActive={xrayActive}
            onAction={(action) => onCellAction(r, c, action)}
          />
        )))}
      </div>
    </div>
  );
}

Object.assign(window, {
  PALETTES, DIFFICULTIES, DIFF_ORDER,
  createEmptyBoard, placeMines, cloneBoard, floodReveal, chord, checkWin, revealAllMines,
  HUD, Board, FaceButton, MineIcon, FlagIcon,
});
