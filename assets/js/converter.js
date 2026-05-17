/* ═══════════════════════════════════════
   CRYPTOCALCX — CONVERTER.JS
   ═══════════════════════════════════════ */

function convert() {
  const amount   = parseFloat(document.getElementById('cv-amount').value) || 1;
  const fromCoin = document.getElementById('cv-from').value;
  const toCoin   = document.getElementById('cv-to').value;
  const prices   = window.liveprices;

  const fromP = prices[fromCoin]?.usd || 1;
  const toP   = toCoin === 'usd' ? 1 : (prices[toCoin]?.usd || 1);
  const result = (amount * fromP) / toP;

  const toLabel   = toCoin === 'usd' ? 'USD' : (COIN_SYMBOLS[toCoin]   || toCoin.toUpperCase());
  const fromLabel = COIN_SYMBOLS[fromCoin] || fromCoin.toUpperCase();

  document.getElementById('cv-result').textContent =
    toCoin === 'usd' ? fmtUSD(result, 2) : fmt(result, 6);

  document.getElementById('cv-rate').innerHTML =
    `<span style="color:var(--text3)">1 ${fromLabel} = </span>` +
    `<span style="color:var(--blue)">${toCoin === 'usd' ? fmtUSD(fromP) : fmt(fromP / toP, 6)} ${toLabel}</span>` +
    `<span style="color:var(--text3)"> &nbsp;|&nbsp; Updated: ${new Date().toLocaleTimeString()}</span>`;
}

function swapConverter() {
  const f = document.getElementById('cv-from');
  const t = document.getElementById('cv-to');
  const fOpts = [...f.options].map(o => o.value);
  const tOpts = [...t.options].map(o => o.value);
  if (tOpts.includes(f.value) && fOpts.includes(t.value)) {
    const tmp = f.value;
    f.value = t.value;
    t.value = tmp;
  }
  convert();
}

function renderQuickPairs() {
  const pairs = [
    { from:'bitcoin',  to:'usd',      fl:'BTC', tl:'USD' },
    { from:'ethereum', to:'usd',      fl:'ETH', tl:'USD' },
    { from:'bitcoin',  to:'ethereum', fl:'BTC', tl:'ETH' },
    { from:'solana',   to:'usd',      fl:'SOL', tl:'USD' },
  ];
  const prices = window.liveprices;
  document.getElementById('quick-pairs').innerHTML = pairs.map(p => {
    const fp = prices[p.from]?.usd || 0;
    const tp = p.to === 'usd' ? 1 : (prices[p.to]?.usd || 1);
    const rate = fp / tp;
    return `<div class="quick-card" onclick="setConverter('${p.from}','${p.to}')">
      <div class="quick-label">${p.fl} → ${p.tl}</div>
      <div class="quick-rate">${p.to === 'usd' ? fmtUSD(rate, 2) : fmt(rate, 4)}</div>
    </div>`;
  }).join('');
}

function setConverter(from, to) {
  document.getElementById('cv-from').value = from;
  document.getElementById('cv-to').value   = to;
  convert();
}
