/* ═══════════════════════════════════════
   CRYPTOCALCX — APP.JS
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

// ── NAV BTC WIDGET ────────────────────────
function updateNavBTC(prices) {
  const btc = prices['bitcoin'];
  if (!btc) return;
  const priceEl  = document.getElementById('nav-btc-price');
  const changeEl = document.getElementById('nav-btc-change');
  if (priceEl)  priceEl.textContent  = '$' + fmt(btc.usd);
  if (changeEl) {
    const chg = btc.usd_24h_change || 0;
    changeEl.textContent   = (chg >= 0 ? '▲' : '▼') + fmt(Math.abs(chg), 2) + '%';
    changeEl.style.color   = chg >= 0 ? 'var(--green)' : 'var(--red)';
  }
}

// ── TOAST ─────────────────────────────────
let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2800);
}

// ── MODAL ─────────────────────────────────
function showModal(icon, title, body, btnLabel = 'GOT IT') {
  document.getElementById('modalIcon').textContent  = icon;
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalBody').innerHTML    = body;
  document.getElementById('modalBtn').textContent   = btnLabel;
  document.getElementById('modalOverlay').classList.add('show');
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('show');
}

// ── HERO BUTTON ACTIONS ───────────────────
function launchTerminal() {
  // Scroll to profit section
  document.querySelector('#profit').scrollIntoView({ behavior: 'smooth' });
  // Show toast after short delay
  setTimeout(() => showToast('⚡ TERMINAL ACTIVE — All tools loaded with live data'), 600);
}

function viewMarkets() {
  // Get top movers from live prices
  const prices = window.liveprices;
  const coins = [
    { name:'Bitcoin',  id:'bitcoin',     sym:'BTC' },
    { name:'Ethereum', id:'ethereum',    sym:'ETH' },
    { name:'Solana',   id:'solana',      sym:'SOL' },
    { name:'BNB',      id:'binancecoin', sym:'BNB' },
    { name:'XRP',      id:'ripple',      sym:'XRP' },
  ];

  const rows = coins.map(c => {
    const p   = prices[c.id];
    if (!p) return '';
    const chg = p.usd_24h_change || 0;
    const col = chg >= 0 ? 'var(--green)' : 'var(--red)';
    const arr = chg >= 0 ? '▲' : '▼';
    return `<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--border);font-family:var(--mono);font-size:12px;">
      <span style="color:var(--text3);width:60px;">${c.sym}</span>
      <span style="color:var(--gold);flex:1;text-align:right;padding-right:16px;">$${fmt(p.usd)}</span>
      <span style="color:${col};width:70px;text-align:right;">${arr}${fmt(Math.abs(chg),2)}%</span>
    </div>`;
  }).join('');

  showModal(
    '📊',
    'LIVE MARKET SNAPSHOT',
    `<div style="margin-bottom:12px;font-size:11px;color:var(--text3);letter-spacing:1px;">REAL-TIME PRICES · UPDATED EVERY 60s</div>${rows}<div style="margin-top:16px;font-size:11px;color:var(--text3);">Data sourced from CoinGecko · ${new Date().toLocaleTimeString()}</div>`,
    'VIEW FULL DASHBOARD'
  );

  // Override button to scroll to converter
  document.getElementById('modalBtn').onclick = () => {
    closeModal();
    setTimeout(() => document.querySelector('#converter').scrollIntoView({ behavior:'smooth' }), 200);
  };
}

// ── MAIN REFRESH ──────────────────────────
async function refresh() {
  const [prices, globalData] = await Promise.all([
    CryptoCalcxAPI.getPrices(),
    CryptoCalcxAPI.getGlobal(),
  ]);

  if (!prices) return;

  window.liveprices = prices;

  buildTicker(prices);
  updateStats(prices, globalData);
  updateNavBTC(prices);
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