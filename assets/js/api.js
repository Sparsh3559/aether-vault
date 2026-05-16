/* ═══════════════════════════════════════
   AETHER VAULT — API.JS
   Centralized, cached price fetching
   ═══════════════════════════════════════ */

const AetherAPI = (() => {
  const CACHE_TTL = 60000; // 1 minute
  const cache = {};

  const COIN_IDS = 'bitcoin,ethereum,solana,binancecoin,ripple,cardano,dogecoin,avalanche-2,litecoin,monero,ethereum-classic,tether,usd-coin';

  async function fetchWithCache(key, url) {
    const now = Date.now();
    if (cache[key] && (now - cache[key].ts) < CACHE_TTL) {
      return cache[key].data;
    }
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      cache[key] = { data, ts: now };
      return data;
    } catch (err) {
      console.warn(`[AetherAPI] ${key} fetch failed:`, err.message);
      return cache[key]?.data || null;
    }
  }

  async function getPrices() {
    return fetchWithCache(
      'prices',
      `https://api.coingecko.com/api/v3/simple/price?ids=${COIN_IDS}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true`
    );
  }

  async function getGlobal() {
    return fetchWithCache(
      'global',
      'https://api.coingecko.com/api/v3/global'
    );
  }

  async function getFearGreed() {
    return fetchWithCache(
      'feargreed',
      'https://api.alternative.me/fng/?limit=30'
    );
  }

  return { getPrices, getGlobal, getFearGreed };
})();

// Global prices store — updated by app.js
window.liveprices = {};

// Formatting helpers — available to all modules
window.fmt = (n, d = 2) => n == null ? '--' : new Intl.NumberFormat('en-US', { minimumFractionDigits: d, maximumFractionDigits: d }).format(n);
window.fmtUSD = (n, d = 2) => n == null ? '$--' : '$' + fmt(n, d);
window.fmtPct = (n, d = 2) => n == null ? '--%' : (n >= 0 ? '+' : '') + fmt(n, d) + '%';
window.fmtBig = (n) => {
  if (n >= 1e12) return fmt(n / 1e12, 2) + 'T';
  if (n >= 1e9)  return fmt(n / 1e9,  2) + 'B';
  if (n >= 1e6)  return fmt(n / 1e6,  2) + 'M';
  return fmt(n, 0);
};

window.smoothScroll = (selector) => {
  const el = document.querySelector(selector);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
};

window.COIN_COLORS  = { bitcoin:'#f7931a', ethereum:'#627eea', solana:'#9945ff', binancecoin:'#f0b90b', ripple:'#346aa9', cardano:'#0033ad', dogecoin:'#c2a633', 'avalanche-2':'#e84142', litecoin:'#bfbbbb', monero:'#ff6600', 'ethereum-classic':'#328432' };
window.COIN_SYMBOLS = { bitcoin:'BTC', ethereum:'ETH', solana:'SOL', binancecoin:'BNB', ripple:'XRP', cardano:'ADA', dogecoin:'DOGE', 'avalanche-2':'AVAX', litecoin:'LTC', monero:'XMR', 'ethereum-classic':'ETC', tether:'USDT', 'usd-coin':'USDC' };
