// shop.jsx — coins, hint cards, skin packs, shop sheet

// ─── Hint card configs ───────────────────────────────────────
const HintIcons = {
  safe: (c) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="10" cy="10" r="6" stroke={c} strokeWidth="1.8" />
      <path d="M14.5 14.5 L20 20" stroke={c} strokeWidth="2" strokeLinecap="round" />
      <path d="M7 10 L9 12 L13 8" stroke={c} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  xray: (c) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M2 12 C4 7 7 5 12 5 C17 5 20 7 22 12 C20 17 17 19 12 19 C7 19 4 17 2 12 Z" stroke={c} strokeWidth="1.8" fill="none" />
      <circle cx="12" cy="12" r="3" fill={c} />
    </svg>
  ),
  shield: (c) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M12 2 L20 5 V11 C20 16 16 20 12 22 C8 20 4 16 4 11 V5 L12 2 Z" fill={c} />
      <path d="M8 12 L11 15 L16 9" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  freeze: (c) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <g stroke={c} strokeWidth="1.8" strokeLinecap="round">
        <line x1="12" y1="2" x2="12" y2="22" />
        <line x1="3" y1="7" x2="21" y2="17" />
        <line x1="3" y1="17" x2="21" y2="7" />
        <path d="M9 4 L12 7 L15 4" fill="none" />
        <path d="M9 20 L12 17 L15 20" fill="none" />
      </g>
    </svg>
  ),
};

const HINT_CARDS = {
  safe:   { name: '安全格探測', short: '安全', desc: '揭開一個隨機安全的格子',           price: 30, color: '#2A8255' },
  freeze: { name: '時間凍結',   short: '凍結', desc: '計時器或倒數暫停 10 秒',           price: 40, color: '#5BC5D9' },
  xray:   { name: '透視眼',     short: '透視', desc: '短暫顯示所有地雷位置 1.5 秒',       price: 50, color: '#D4A017' },
  shield: { name: '護心鏡',     short: '護心', desc: '本局下一次踩雷自動插旗免死一次',     price: 80, color: '#C6453B' },
};

const HINT_ORDER = ['safe', 'freeze', 'xray', 'shield'];

// ─── Skin packs ──────────────────────────────────────────────
const SKIN_PACKS = {
  warm:     { name: '暖灰',     desc: '經典中性暖色',     price: 0,   default: true },
  slate:    { name: '夜行',     desc: '深色高對比',       price: 0,   default: true },
  mint:     { name: '薄荷',     desc: '清新綠調',         price: 0,   default: true },
  lavender: { name: '薰衣草',   desc: '柔和紫調',         price: 120 },
  rose:     { name: '玫瑰金',   desc: '溫暖玫瑰',         price: 160 },
  ocean:    { name: '海洋深處', desc: '深海冷藍',         price: 200 },
};

const SKIN_ORDER = ['warm', 'slate', 'mint', 'lavender', 'rose', 'ocean'];

Object.assign(window, { HINT_CARDS, HINT_ORDER, HintIcons, SKIN_PACKS, SKIN_ORDER });
