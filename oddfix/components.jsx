/* ────────────────────────────────────────────────────────────
   Oddfix · Shared components & icons
   Globals: window.OFX = { Icon, Logo, BookmakerLogo, Chip, Badge,
                            Sparkline, Segmented, Slider, OPPORTUNITIES,
                            BOOKMAKERS, fmtBRL }
   ──────────────────────────────────────────────────────────── */

// ── Formatters ──────────────────────────────────────────────
const fmtBRL = (n, { withSymbol = true, digits = 2 } = {}) => {
  const v = Math.abs(n).toLocaleString('pt-BR', {
    minimumFractionDigits: digits, maximumFractionDigits: digits,
  });
  return (withSymbol ? 'R$\u00A0' : '') + (n < 0 ? '-' : '') + v;
};
const fmtPct = (n, digits = 2) =>
  (n > 0 ? '+' : '') + n.toFixed(digits) + '%';

// ── Icons (24px viewBox) ────────────────────────────────────
const _i = (paths, vb = '0 0 24 24') => ({ size = 16, color = 'currentColor', stroke = 1.6, style }) => (
  <svg width={size} height={size} viewBox={vb} fill="none"
       stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"
       style={style} aria-hidden="true">
    {paths}
  </svg>
);

const Icon = {
  search:    _i(<path d="M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Zm10 2-4.3-4.3" />),
  bell:      _i(<><path d="M6 8a6 6 0 1 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9Z"/><path d="M10 21a2 2 0 0 0 4 0"/></>),
  history:   _i(<><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l3 2"/></>),
  settings:  _i(<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/></>),
  user:      _i(<><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>),
  chevDown:  _i(<path d="m6 9 6 6 6-6"/>),
  chevRight: _i(<path d="m9 6 6 6-6 6"/>),
  chevLeft:  _i(<path d="m15 6-6 6 6 6"/>),
  copy:      _i(<><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></>),
  external:  _i(<><path d="M14 4h6v6"/><path d="M10 14 20 4"/><path d="M20 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5"/></>),
  filter:    _i(<path d="M3 5h18l-7 9v6l-4-2v-4L3 5Z"/>),
  flame:     _i(<path d="M12 3s4 4 4 9a4 4 0 0 1-8 0c0-2 1-3 1-3s-1 5 2 5c2 0 2-2 2-3 0-3-1-8-1-8Z"/>),
  star:      _i(<path d="m12 3 2.7 5.7 6.3.9-4.6 4.4 1.1 6.3L12 17.3 6.5 20.3l1.1-6.3L3 9.6l6.3-.9L12 3Z"/>),
  clock:     _i(<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>),
  trend:     _i(<><path d="M3 17 9 11l4 4 8-8"/><path d="M14 7h7v7"/></>),
  wallet:    _i(<><rect x="2" y="6" width="20" height="14" rx="3"/><path d="M16 13h3"/><path d="M2 10h20"/></>),
  zap:       _i(<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/>),
  check:     _i(<path d="m5 12 4 4 10-10"/>),
  checkCirc: _i(<><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/></>),
  shield:    _i(<><path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3Z"/><path d="m9 12 2 2 4-4"/></>),
  grid:      _i(<><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>),
  list:      _i(<><path d="M8 6h13M8 12h13M8 18h13"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/></>),
  sliders:   _i(<><path d="M4 6h10M18 6h2M4 12h2M10 12h10M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="8" cy="12" r="2"/><circle cx="18" cy="18" r="2"/></>),
  logout:    _i(<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/></>),
  radar:     _i(<><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/><path d="M12 12 19 5"/></>),
  ball:      _i(<><circle cx="12" cy="12" r="9"/><path d="m12 3 2 4-2 5-2-5 2-4Z"/><path d="m3 12 4 2 5-2-5-2-4 2Z"/><path d="M21 12l-4 2-5-2 5-2 4 2Z"/><path d="m12 21-2-4 2-5 2 5-2 4Z"/></>),
  signal:    _i(<><path d="M2 12h3l3 9 4-18 3 12 3-6h4"/></>),
  arrowUp:   _i(<path d="m6 15 6-6 6 6"/>),
  arrowDown: _i(<path d="m6 9 6 6 6-6"/>),
  menu:      _i(<path d="M3 6h18M3 12h18M3 18h18"/>),
  close:     _i(<path d="M18 6 6 18M6 6l12 12"/>),
  refresh:   _i(<><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/></>),
  plus:      _i(<><path d="M12 5v14M5 12h14"/></>),
  download:  _i(<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/></>),
};

// ── Brand Logo ──────────────────────────────────────────────
function Logo({ size = 32 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: 8,
      background: 'linear-gradient(135deg, #8DFFC7 0%, #20E69A 100%)',
      display: 'grid', placeItems: 'center',
      boxShadow: '0 0 0 1px rgba(141,255,199,0.45), 0 0 12px rgba(32,230,154,0.35)',
      color: '#070A0F', fontWeight: 800, fontSize: size * 0.42,
      letterSpacing: -0.5,
      fontFamily: 'var(--f-sans)',
    }}>OF</div>
  );
}

// ── Full Oddfix Wordmark (mark + DDFIX letters from brand SVG) ──
function Wordmark({ height = 22, color = 'var(--mint)' }) {
  return (
    <svg height={height} viewBox="0 0 148 36" fill={color} xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
      {/* O — circular mark + arrow */}
      <path d="M15.1617 3.79044C17.267 3.79044 19.2718 4.22005 21.094 4.99556C21.0388 5.86789 21.0937 6.69359 21.1254 7.29171C21.1466 7.69367 21.1594 8.02078 21.1584 8.30289L19.2003 10.3782C17.9751 9.80013 16.6063 9.47622 15.1617 9.47622C9.92824 9.47626 5.68583 13.7187 5.68579 18.9522C5.68579 24.1856 9.92824 28.4285 15.1617 28.4285C20.3952 28.4285 24.638 24.1857 24.638 18.9522C24.638 18.1018 24.5254 17.2779 24.3154 16.4938C24.4249 16.3643 24.5321 16.2375 24.6368 16.1145C25.3219 15.3103 25.9311 14.6286 26.5268 14.0832C26.8072 14.0785 27.139 14.0913 27.5848 14.1097C28.1043 14.1311 28.8039 14.1586 29.5245 14.0824C30.0426 15.6108 30.3234 17.2487 30.3234 18.9522C30.3234 27.3258 23.5353 34.1139 15.1617 34.1139C6.78812 34.1138 0 27.3258 0 18.9522C1.89218e-05 10.5786 6.78812 3.79046 15.1617 3.79044Z"/>
      <path d="M28.5975 6.0618C28.5759 6.0618 28.2431 5.91391 28.2134 5.88546C27.9816 5.66568 28.0935 4.74867 28.076 4.40411C28.0059 3.00421 28.0342 1.57444 27.9331 0.179949C27.9251 0.0754972 27.9871 -0.023528 27.8294 0.00495877L22.8611 5.0064C22.6792 6.51758 23.0646 8.04773 22.8153 9.53988L17.5115 14.8601C16.8525 14.5305 16.1101 14.3447 15.3245 14.3447C14.9081 14.3447 14.5038 14.3976 14.1184 14.4952C14.1117 14.4966 14.1063 14.4979 14.0996 14.4993C14.0955 14.4993 14.0928 14.5006 14.0888 14.502C13.8651 14.5563 13.6481 14.6295 13.4406 14.7204C11.6552 15.4651 10.398 17.2367 10.398 19.3027C10.398 22.0415 12.6038 24.2621 15.3245 24.2621C18.0451 24.2621 20.251 22.0415 20.251 19.3027C20.251 18.4562 20.0394 17.66 19.6688 16.9627C21.3182 15.3322 22.8395 13.292 24.5374 11.9056C24.8109 11.6832 24.939 11.5869 25.3055 11.5529C26.4563 11.4444 27.7459 11.6696 28.9101 11.519L34.125 6.2734L34.2301 6.0618H28.5975Z"/>
      {/* DDFIX — shifted right of mark, vertically centered to mark */}
      <g transform="translate(40, 5)">
        <path d="M10.9635 3.53064e-06C12.9723 3.53064e-06 14.7995 0.314629 16.4452 0.943881C18.1152 1.54893 19.5431 2.4202 20.729 3.55769C21.9391 4.67098 22.8709 6.00209 23.5243 7.55102C24.1778 9.09994 24.5045 10.8183 24.5045 12.706C24.5045 14.618 24.1657 16.3484 23.488 17.8974C22.8346 19.4463 21.9028 20.7895 20.6927 21.927C19.4826 23.0645 18.0305 23.9358 16.3363 24.5408C14.6422 25.1458 12.7665 25.4484 10.7094 25.4484H3.8147e-06V3.53064e-06H10.9635ZM11.145 20.1481C12.1131 20.1481 12.9965 19.9787 13.7951 19.6399C14.5938 19.2769 15.2835 18.7686 15.8644 18.1152C16.4694 17.4617 16.9293 16.6873 17.2439 15.7918C17.5585 14.8721 17.7158 13.8677 17.7158 12.7786C17.7158 11.6654 17.5464 10.661 17.2076 9.7655C16.8688 8.84582 16.3847 8.05926 15.7555 7.40581C15.1504 6.72815 14.4244 6.21991 13.5773 5.88108C12.7544 5.51805 11.8348 5.33654 10.8183 5.33654H6.64344V20.1481H11.145Z"/>
        <path d="M37.2453 0C39.2541 0 41.0813 0.314626 42.7271 0.943878C44.397 1.54893 45.8249 2.4202 47.0108 3.55769C48.2209 4.67098 49.1527 6.00209 49.8061 7.55101C50.4596 9.09994 50.7863 10.8183 50.7863 12.706C50.7863 14.618 50.4475 16.3484 49.7698 17.8974C49.1164 19.4463 48.1846 20.7895 46.9745 21.927C45.7644 23.0645 44.3123 23.9357 42.6181 24.5408C40.924 25.1458 39.0484 25.4484 36.9912 25.4484H26.2818V0H37.2453ZM37.4268 20.1481C38.3949 20.1481 39.2783 19.9787 40.0769 19.6399C40.8756 19.2769 41.5654 18.7686 42.1462 18.1152C42.7513 17.4617 43.2111 16.6873 43.5257 15.7918C43.8404 14.8721 43.9977 13.8677 43.9977 12.7786C43.9977 11.6654 43.8283 10.661 43.4894 9.7655C43.1506 8.84582 42.6666 8.05926 42.0373 7.4058C41.4323 6.72815 40.7062 6.21991 39.8591 5.88108C39.0363 5.51805 38.1166 5.33654 37.1001 5.33654H32.9253V20.1481H37.4268Z"/>
        <path d="M52.5636 0H71.5864L71.5501 5.22763H59.2071V10.9998H70.6062V16.1911H59.2071V25.4484H52.5636V0Z"/>
        <path d="M73.1022 0H79.7456V25.4484H73.1022V0Z"/>
        <path d="M81.4399 0H89.1724L93.9281 7.2969L98.7201 0H106.562L98.1756 12.1615L107.288 25.4484H99.3373L93.9281 17.498L88.6279 25.4484H80.8591L89.8985 12.4882L81.4399 0Z"/>
      </g>
    </svg>
  );
}

// ── Bookmaker logos (text-mark in a chip) ───────────────────
const BOOKMAKER_TINTS = {
  Blaze:       { bg: '#FF4D2D', glyph: '◉' },
  Bet365:      { bg: '#0F7C3A', glyph: '365' },
  Betano:      { bg: '#FF6A00', glyph: 'B' },
  Stake:       { bg: '#1B2330', glyph: 'S' },
  Pinnacle:    { bg: '#D4202A', glyph: 'P' },
  Betfair:     { bg: '#FFB80C', glyph: 'BF' },
  Novibet:     { bg: '#1C2F6F', glyph: 'N' },
  Superbet:    { bg: '#E11D48', glyph: 'SB' },
  Bet7k:       { bg: '#7C5CFF', glyph: '7k' },
  BetNacional: { bg: '#FACC15', glyph: 'bN' },
  KTO:         { bg: '#0EA5E9', glyph: 'K' },
  ParliMatch:  { bg: '#FACC15', glyph: 'P' },
  SportingBet: { bg: '#FACC15', glyph: 'SB' },
  EstrelaBet:  { bg: '#1F3A8A', glyph: '★' },
  VaideBet:    { bg: '#10B981', glyph: 'V' },
  EsportesDaSorte: { bg: '#16A34A', glyph: 'ES' },
  '1xBet':     { bg: '#1E3A8A', glyph: '1x' },
};

function BookmakerLogo({ name, size = 22 }) {
  const t = BOOKMAKER_TINTS[name] || { bg: '#374151', glyph: name.slice(0, 1) };
  return (
    <div style={{
      width: size, height: size, borderRadius: 5,
      background: t.bg,
      color: t.bg === '#FACC15' || t.bg === '#FFB80C' ? '#1B1B1B' : '#fff',
      display: 'grid', placeItems: 'center',
      fontSize: size * 0.45, fontWeight: 800, letterSpacing: -0.3,
      fontFamily: 'var(--f-sans)',
      flexShrink: 0,
      boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.25)',
    }}>{t.glyph}</div>
  );
}

// ── Atoms ───────────────────────────────────────────────────
function Chip({ children, active, onClick, leading, trailing, size = 'md', tone = 'default', style }) {
  const sizes = {
    sm: { pad: '4px 8px', fs: 11, gap: 4 },
    md: { pad: '6px 10px', fs: 12, gap: 6 },
    lg: { pad: '8px 12px', fs: 13, gap: 8 },
  };
  const s = sizes[size];
  const tones = {
    default: {
      bg: active ? 'rgba(141,255,199,0.10)' : 'rgba(255,255,255,0.02)',
      bd: active ? 'rgba(141,255,199,0.35)' : 'var(--border)',
      c:  active ? 'var(--mint)' : 'var(--t1)',
    },
    ghost: {
      bg: 'transparent',
      bd: 'transparent',
      c:  active ? 'var(--mint)' : 'var(--t2)',
    },
    success: { bg: 'var(--green-soft)', bd: 'var(--green-rim)', c: 'var(--green)' },
    odds:    { bg: 'rgba(217,248,117,0.08)', bd: 'rgba(217,248,117,0.20)', c: 'var(--odds)' },
    amber:   { bg: 'var(--amber-soft)', bd: 'rgba(246,199,107,0.30)', c: 'var(--amber)' },
  };
  const t = tones[tone];
  return (
    <button onClick={onClick}
      className="ofx-focus"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: s.gap,
        padding: s.pad, fontSize: s.fs, fontWeight: 500,
        fontFamily: 'var(--f-sans)',
        background: t.bg, color: t.c,
        border: '1px solid ' + t.bd,
        borderRadius: 999, cursor: onClick ? 'pointer' : 'default',
        whiteSpace: 'nowrap',
        transition: 'all 140ms ease',
        letterSpacing: 0.1,
        ...style,
      }}>
      {leading}{children}{trailing}
    </button>
  );
}

function Badge({ children, tone = 'mint', size = 'md', leading, style }) {
  const tones = {
    mint:    { bg: 'var(--green-soft)', c: 'var(--green)', bd: 'var(--green-rim)' },
    amber:   { bg: 'var(--amber-soft)', c: 'var(--amber)', bd: 'rgba(246,199,107,0.28)' },
    neutral: { bg: 'rgba(148,163,184,0.08)', c: 'var(--t2)', bd: 'var(--border)' },
    odds:    { bg: 'rgba(217,248,117,0.06)', c: 'var(--odds)', bd: 'rgba(217,248,117,0.18)' },
  };
  const sizes = {
    sm: { pad: '2px 6px', fs: 10, gap: 4, r: 4 },
    md: { pad: '3px 8px', fs: 11, gap: 5, r: 5 },
    lg: { pad: '5px 10px', fs: 12, gap: 6, r: 6 },
  };
  const t = tones[tone];
  const s = sizes[size];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: s.gap,
      padding: s.pad, fontSize: s.fs, fontWeight: 600,
      letterSpacing: 0.3, textTransform: 'uppercase',
      background: t.bg, color: t.c,
      border: '1px solid ' + t.bd,
      borderRadius: s.r,
      fontFamily: 'var(--f-sans)',
      ...style,
    }}>{leading}{children}</span>
  );
}

// ── Sparkline (mini odds trend) ─────────────────────────────
function Sparkline({ data, width = 64, height = 18, color = 'var(--green)', filled = true }) {
  const min = Math.min(...data), max = Math.max(...data);
  const span = max - min || 1;
  const step = width / (data.length - 1);
  const pts = data.map((v, i) => [i * step, height - ((v - min) / span) * (height - 2) - 1]);
  const d = pts.map(([x, y], i) => (i ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1)).join(' ');
  const dFill = d + ` L ${width} ${height} L 0 ${height} Z`;
  return (
    <svg width={width} height={height} style={{ overflow: 'visible' }}>
      {filled && <path d={dFill} fill={color} opacity={0.12} />}
      <path d={d} fill="none" stroke={color} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="2" fill={color} />
    </svg>
  );
}

// ── Segmented control ───────────────────────────────────────
function Segmented({ value, onChange, options, size = 'md', style }) {
  const sizes = { sm: { h: 28, fs: 11, px: 10 }, md: { h: 34, fs: 12, px: 12 }, lg: { h: 40, fs: 13, px: 14 } };
  const s = sizes[size];
  return (
    <div style={{
      display: 'inline-flex', padding: 3,
      background: 'var(--inner)', border: '1px solid var(--border)',
      borderRadius: 8,
      ...style,
    }}>
      {options.map((o) => {
        const v = o.value ?? o;
        const label = o.label ?? o;
        const active = value === v;
        return (
          <button key={v} onClick={() => onChange && onChange(v)}
            className="ofx-focus"
            style={{
              height: s.h - 6, padding: '0 ' + s.px + 'px',
              fontSize: s.fs, fontWeight: 600, letterSpacing: 0.2,
              background: active ? 'var(--card-2)' : 'transparent',
              color: active ? 'var(--mint)' : 'var(--t2)',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontFamily: 'var(--f-sans)',
              boxShadow: active ? '0 1px 0 rgba(141,255,199,0.10) inset, 0 0 0 1px rgba(141,255,199,0.18)' : 'none',
              transition: 'all 140ms ease',
            }}>
            {label}
          </button>
        );
      })}
    </div>
  );
}

// ── Slider (track + dual track or single) ───────────────────
function RangeSlider({ value = [0, 30], min = 0, max = 100, onChange }) {
  // Render-only; controls fake-interactive visual
  const [lo, hi] = value;
  const loPct = ((lo - min) / (max - min)) * 100;
  const hiPct = ((hi - min) / (max - min)) * 100;
  return (
    <div style={{ position: 'relative', height: 24 }}>
      <div style={{
        position: 'absolute', left: 0, right: 0, top: 11,
        height: 4, borderRadius: 2,
        background: 'rgba(148,163,184,0.10)',
      }}/>
      <div style={{
        position: 'absolute', top: 11, height: 4, borderRadius: 2,
        left: loPct + '%', right: (100 - hiPct) + '%',
        background: 'linear-gradient(90deg, var(--green) 0%, var(--mint) 100%)',
        boxShadow: '0 0 12px rgba(32,230,154,0.45)',
      }}/>
      <div style={thumbStyle(loPct)} />
      <div style={thumbStyle(hiPct)} />
    </div>
  );
}
const thumbStyle = (pct) => ({
  position: 'absolute', top: 4, left: `calc(${pct}% - 9px)`,
  width: 18, height: 18, borderRadius: 50,
  background: '#F4F7FA',
  border: '3px solid var(--green)',
  boxShadow: '0 2px 6px rgba(0,0,0,0.4), 0 0 0 4px rgba(32,230,154,0.10)',
});

// ── Sample data ─────────────────────────────────────────────
const BOOKMAKERS = [
  'Bet365','Bet7k','Betano','Betfair','BetNacional','Blaze',
  'EsportesDaSorte','EstrelaBet','EstrelaBet','Novibet','ParliMatch',
  'Pinnacle','ParliMatch','SportingBet','Stake','Superbet','VaideBet','KTO','1xBet',
];

const OPPORTUNITIES = [
  {
    id: 'gre-cor', match: 'Grêmio FB Porto Alegrense RS vs. SC Corinthians SP',
    home: 'Grêmio', away: 'Corinthians',
    league: 'Brasileirão · Série A', country: 'BR',
    date: '30/05', time: '17:30',
    profit: 0.96, profitBRL: 28.80,
    stake: 3000, retorno: 3028.80,
    margem: 0.12, freshness: 4,
    confidence: 'high', tag: 'Maior lucro',
    trend: [1.99, 2.02, 2.00, 2.04, 2.03, 2.06, 2.06],
    legs: [
      { book: 'Blaze',  market: 'Total Over (2.25)', breadcrumb: 'Soccer › Brasileirão › Total Over',  odd: 2.06, stake: 1470.30, isNew: true },
      { book: 'Bet365', market: 'Total Under (2.25)', breadcrumb: 'Soccer › Brasileirão › Total Under', odd: 1.98, stake: 1529.70 },
    ],
  },
  {
    id: 'bah-bot', match: 'EC Bahia BA vs. Botafogo RJ',
    home: 'Bahia', away: 'Botafogo',
    league: 'Brasileirão · Série A', country: 'BR',
    date: '30/05', time: '17:30',
    profit: 0.91, profitBRL: 27.36,
    stake: 3000, retorno: 3027.36,
    margem: 0.11, freshness: 3,
    confidence: 'high',
    trend: [1.62, 1.64, 1.65, 1.66, 1.66, 1.67, 1.67],
    legs: [
      { book: 'Betano', market: 'Total Over (4.5) — Corners',  breadcrumb: 'Soccer › Brasileirão › Corners', odd: 1.67, stake: 1812.80 },
      { book: 'Stake',  market: 'Total Under (4.5) — Corners', breadcrumb: 'Soccer › Brasileirão › Corners', odd: 2.55, stake: 1187.20 },
    ],
  },
  {
    id: 'vas-atl', match: 'Vasco da Gama RJ vs. Clube Atlético MG',
    home: 'Vasco', away: 'Atlético MG',
    league: 'Brasileirão · Série A', country: 'BR',
    date: '31/05', time: '16:00',
    profit: 0.91, profitBRL: 27.36,
    stake: 3000, retorno: 3027.36,
    margem: 0.11, freshness: 5,
    confidence: 'high',
    trend: [1.60, 1.62, 1.64, 1.65, 1.66, 1.67, 1.67],
    legs: [
      { book: 'Betano', market: 'Total Over (4.5) — Corners',  breadcrumb: 'Soccer › Brasileirão › Corners', odd: 1.67, stake: 1812.80 },
      { book: 'Stake',  market: 'Total Under (4.5) — Corners', breadcrumb: 'Soccer › Brasileirão › Corners', odd: 2.55, stake: 1187.20 },
    ],
  },
  {
    id: 'sao-nov', match: 'São Bernardo vs. Grêmio Novorizontino',
    home: 'São Bernardo', away: 'Novorizontino',
    league: 'Brasileirão · Série B', country: 'BR',
    date: '31/05', time: '11:00',
    profit: 0.85, profitBRL: 25.56,
    stake: 3000, retorno: 3025.56,
    margem: 0.09, freshness: 6,
    confidence: 'mid',
    trend: [2.80, 2.78, 2.81, 2.82, 2.82, 2.82, 2.82],
    legs: [
      { book: 'Pinnacle', market: '1',                          breadcrumb: 'Soccer › Série B › 1X2',           odd: 2.82, stake: 1072.89 },
      { book: 'Stake',    market: 'Asian Handicap 2 (0.5)',     breadcrumb: 'Soccer › Série B › Asian Handicap', odd: 1.57, stake: 1927.11 },
    ],
  },
  {
    id: 'san-vit', match: 'Santos SP vs. Vitória BA',
    home: 'Santos', away: 'Vitória',
    league: 'Brasileirão · Série A', country: 'BR',
    date: '30/05', time: '21:00',
    profit: 0.85, profitBRL: 25.47,
    stake: 3000, retorno: 3025.47,
    margem: 0.10, freshness: 7,
    confidence: 'mid',
    trend: [2.04, 2.02, 2.05, 2.05, 2.06, 2.06, 2.06],
    legs: [
      { book: 'Bet365', market: 'Total Over (2.25)',  breadcrumb: 'Soccer › Brasileirão › Total Over',  odd: 2.06, stake: 1470.30 },
      { book: 'Blaze',  market: 'Total Under (2.25)', breadcrumb: 'Soccer › Brasileirão › Total Under', odd: 1.98, stake: 1529.70 },
    ],
  },
  {
    id: 'cru-flu', match: 'Cruzeiro MG vs. Fluminense RJ',
    home: 'Cruzeiro', away: 'Fluminense',
    league: 'Brasileirão · Série A', country: 'BR',
    date: '31/05', time: '20:30',
    profit: 0.72, profitBRL: 21.60,
    stake: 3000, retorno: 3021.60,
    margem: 0.08, freshness: 8,
    confidence: 'mid',
    trend: [1.93, 1.94, 1.96, 1.96, 1.97, 1.97, 1.97],
    legs: [
      { book: 'Betano', market: 'Total Over (2.5)',  breadcrumb: 'Soccer › Brasileirão › Total Over',  odd: 1.97, stake: 1522.00 },
      { book: 'Stake',  market: 'Total Under (2.5)', breadcrumb: 'Soccer › Brasileirão › Total Under', odd: 2.05, stake: 1478.00 },
    ],
  },
];

window.OFX = {
  Icon, Logo, Wordmark, BookmakerLogo, BOOKMAKER_TINTS,
  Chip, Badge, Sparkline, Segmented, RangeSlider,
  OPPORTUNITIES, BOOKMAKERS,
  fmtBRL, fmtPct,
};
