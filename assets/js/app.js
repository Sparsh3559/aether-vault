/* ═══════════════════════════════════════
   AETHER VAULT — APP.JS
   Main orchestrator
   ═══════════════════════════════════════ */

// ── TICKER ────────────────────────────────
function buildTicker(prices) {
  const map = [
    { id:'bitcoin',      sym:'BTC/USD' },
    { id:'ethereum',     sym:'ETH/USD' },
    { id:'solana',       sym:'SOL/USD' },
    { id:'binancecoin',  sym:'BNB/USD' },
    { id:'ripple',       sym:'XRP/USD' },
    { id:'cardano',      sym:'ADA/USD' },
    { id:'dogecoin',     sym:'DOGE/USD'},
    { id:'avalanche-2',  sym:'AVAX/USD'},
  ];

  const makeItem = ({ id, sym }) => {
    const p = prices[id];
    if (!p) return '';
    const chg = p.usd_24h_change || 0;
    const cls = chg >= 0 ? 'up' : 'down';
    const arrow = chg >= 0 ? '▲' : '▼';
    return `<span class="t-item">
      <span class="coin">${sym}</span>
      <span class="price">$${fmt(p.usd)}</span>
      <span class="${cls}">${arrow}${fmt(Math.abs(chg))}%</span>
    </span>`;
  };

  const items = map.map(makeItem).join('');
  const track = document.getElementById('tickerTrack');
  if (track) track.innerHTML = items + items; // duplicate for seamless loop
}

// ── STATS ─────────────────────────────────
function updateStats(prices, globalData) {
  const btc = prices['bitcoin'] || {};
  const g   = globalData?.data  || {};

  const mcap = g.total_market_cap?.usd || btc.usd_market_cap;
  const vol  = g.total_volume?.usd     || btc.usd_24h_vol;
  const dom  = g.market_cap_percentage?.btc;
  const chg  = btc.usd_24h_change || 0;

  const setEl = (id, txt, col) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = txt;
    if (col) el.style.color = col;
    el.classList.remove('flash');
    void el.offsetWidth;
    el.classList.add('flash');
  };

  if (mcap) setEl('s-mcap', '$' + fmtBig(mcap));
  if (vol)  setEl('s-vol',  '$' + fmtBig(vol));
  if (dom)  setEl('s-dom',  fmt(dom, 1) + '%');

  setEl('s-mcap-c', fmtPct(chg), chg >= 0 ? 'var(--green)' : 'var(--red)');
  setEl('s-vol-c',  fmtPct(chg), chg >= 0 ? 'var(--green)' : 'var(--red)');
}

// ── REVEAL ON SCROLL ──────────────────────
function initReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

// ── BACKGROUND COINS ──────────────────────
function addBgCoins() {
  ['c1','c2','c3'].forEach(cls => {
    const div = document.createElement('div');
    div.className = `coin-bg ${cls}`;
    document.body.appendChild(div);
  });
}

// ── ADSBYGOOGLE ───────────────────────────
function initAds() {
  try { (adsbygoogle = window.adsbygoogle || []).push({}); } catch(e) {}
}

// ── MAIN REFRESH ──────────────────────────
async function refresh() {
  const [prices, globalData] = await Promise.all([
    AetherAPI.getPrices(),
    AetherAPI.getGlobal(),
  ]);

  if (!prices) return;

  window.liveprices = prices;

  buildTicker(prices);
  updateStats(prices, globalData);
  autofillProfitSim(prices);
  renderPortfolio();
  convert();
  renderQuickPairs();
  calcTax();
  calcMining();
}

// ── BOOT ─────────────────────────────────
async function boot() {
  addBgCoins();
  initReveal();
  await Promise.all([ refresh(), loadSentiment() ]);
  // Auto-refresh every 60 seconds
  setInterval(refresh, 60_000);
  setInterval(loadSentiment, 300_000); // sentiment every 5 min
}

document.addEventListener('DOMContentLoaded', boot);
