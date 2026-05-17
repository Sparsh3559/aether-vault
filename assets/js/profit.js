/* ═══════════════════════════════════════
   CRYPTOCALCX — PROFIT.JS
   ═══════════════════════════════════════ */

function calcProfit() {
  const amount = parseFloat(document.getElementById('ps-amount').value) || 0;
  const buy    = parseFloat(document.getElementById('ps-buy').value)    || 0;
  const target = parseFloat(document.getElementById('ps-target').value) || 0;
  if (!buy || !target || !amount) return;

  const coins    = amount / buy;
  const profit   = (target - buy) * coins;
  const roi      = ((target - buy) / buy) * 100;
  const totalVal = coins * target;

  const el = document.getElementById('ps-result');
  el.textContent = (profit >= 0 ? '+' : '') + fmtUSD(profit);
  el.className   = 'result-big ' + (profit >= 0 ? 'positive' : 'negative');

  document.getElementById('ps-roi').textContent   = fmtPct(roi);
  document.getElementById('ps-total').textContent = fmtUSD(totalVal);

  // Scenarios
  [2, 5, 10].forEach(mult => {
    const sc = document.getElementById(`sc${mult}x`);
    if (sc) sc.textContent = fmtUSD((buy * mult - buy) * coins);
  });
}

function autofillProfitSim(prices) {
  const coin = document.getElementById('ps-coin').value;
  const p = prices[coin];
  if (p && !document.getElementById('ps-buy').value) {
    document.getElementById('ps-buy').value   = p.usd;
    document.getElementById('ps-target').value = Math.round(p.usd * 2);
    calcProfit();
  }
}

document.getElementById('ps-coin').addEventListener('change', () => {
  const coin = document.getElementById('ps-coin').value;
  const p = window.liveprices[coin];
  if (p) {
    document.getElementById('ps-buy').value   = p.usd;
    document.getElementById('ps-target').value = Math.round(p.usd * 2);
  }
  calcProfit();
});
