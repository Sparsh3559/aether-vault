/* ═══════════════════════════════════════
   CRYPTOCALCX — MINING.JS
   ═══════════════════════════════════════ */

function calcMining() {
  const coin     = document.getElementById('mn-coin').value;
  const hashTHs  = parseFloat(document.getElementById('mn-hash').value)  || 140;
  const powerW   = parseFloat(document.getElementById('mn-power').value) || 3250;
  const elecCost = parseFloat(document.getElementById('mn-elec').value)  || 0.10;
  const hwCost   = parseFloat(document.getElementById('mn-hw').value)    || 8500;

  // Get live coin price
  const price = window.liveprices[coin]?.usd || window.liveprices['bitcoin']?.usd || 60000;

  // BTC Mining approximation (post-halving 2024: 3.125 BTC reward)
  // Network hashrate ~600 EH/s = 600,000,000 TH/s
  const networkHashTHs = 600_000_000;
  const blocksPerDay   = 144;
  const reward         = 3.125;

  const dailyCoins   = (hashTHs / networkHashTHs) * blocksPerDay * reward;
  const dailyRevenue = dailyCoins * price;
  const dailyPower   = (powerW / 1000) * 24 * elecCost;
  const dailyProfit  = dailyRevenue - dailyPower;

  const breakEven = dailyProfit > 0 ? Math.ceil(hwCost / dailyProfit) : Infinity;
  const yearProfit = dailyProfit * 365;
  const roi        = hwCost > 0 ? (yearProfit / hwCost) * 100 : 0;

  const posColor = dailyProfit >= 0 ? 'var(--green)' : 'var(--red)';

  const set = (id, val, color) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent  = val;
    if (color) el.style.color = color;
  };

  set('mn-1h',   fmtUSD(dailyProfit / 24), posColor);
  set('mn-1d',   fmtUSD(dailyProfit),       posColor);
  set('mn-1w',   fmtUSD(dailyProfit * 7),   posColor);
  set('mn-1m',   fmtUSD(dailyProfit * 30),  posColor);
  set('mn-1y',   fmtUSD(yearProfit),         posColor);
  set('mn-be',   isFinite(breakEven) ? breakEven + ' days' : 'Unprofitable');
  set('mn-pcost', fmtUSD(dailyPower));
  set('mn-roi',   fmtPct(roi, 1));
}
