/* ═══════════════════════════════════════
   AETHER VAULT — PORTFOLIO.JS
   ═══════════════════════════════════════ */

let portfolio = [];

function togglePortForm() {
  const f = document.getElementById('port-form-wrap');
  f.style.display = f.style.display === 'none' ? 'block' : 'none';
}

function addCoin() {
  const coin   = document.getElementById('pf-coin').value;
  const amount = parseFloat(document.getElementById('pf-amount').value) || 0;
  const buy    = parseFloat(document.getElementById('pf-buy').value)    || 0;
  if (!amount || !buy) { alert('Please enter amount and buy price.'); return; }
  portfolio.push({ coin, amount, buy });
  document.getElementById('pf-amount').value = '';
  document.getElementById('pf-buy').value    = '';
  renderPortfolio();
}

function removeCoin(i) {
  portfolio.splice(i, 1);
  renderPortfolio();
}

function renderPortfolio() {
  const body = document.getElementById('port-body');
  if (!portfolio.length) {
    body.innerHTML = '<tr><td colspan="6" class="empty-state">Add coins to track your portfolio</td></tr>';
    document.getElementById('port-total').textContent  = '$0.00';
    document.getElementById('port-change').textContent = '+$0.00 (0%)';
    document.getElementById('port-alloc').innerHTML    = '';
    return;
  }

  let totalVal = 0, totalCost = 0;
  const rows = portfolio.map((item, i) => {
    const p   = window.liveprices[item.coin];
    const cur = p ? p.usd : item.buy;
    const val = cur * item.amount;
    const cost = item.buy * item.amount;
    const pl  = val - cost;
    const plp = (pl / cost) * 100;
    totalVal  += val;
    totalCost += cost;
    const color = pl >= 0 ? 'var(--green)' : 'var(--red)';
    return `<tr>
      <td><span class="coin-dot" style="background:${COIN_COLORS[item.coin]||'#fff'}"></span>${COIN_SYMBOLS[item.coin]||item.coin}</td>
      <td>${item.amount}</td>
      <td>${fmtUSD(item.buy)}</td>
      <td>${fmtUSD(val)}</td>
      <td style="color:${color}">${fmtPct(plp)}</td>
      <td><button class="remove-btn" onclick="removeCoin(${i})">×</button></td>
    </tr>`;
  });

  body.innerHTML = rows.join('');

  const totalPL   = totalVal - totalCost;
  const totalPLpct = (totalPL / totalCost) * 100;
  document.getElementById('port-total').textContent = fmtUSD(totalVal);
  const chgEl = document.getElementById('port-change');
  chgEl.textContent = `${totalPL >= 0 ? '+' : ''}${fmtUSD(totalPL)} (${fmtPct(totalPLpct)})`;
  chgEl.style.color  = totalPL >= 0 ? 'var(--green)' : 'var(--red)';

  // Allocation bars
  document.getElementById('port-alloc').innerHTML = portfolio.map(item => {
    const p   = window.liveprices[item.coin];
    const val = (p ? p.usd : item.buy) * item.amount;
    const pct = (val / totalVal) * 100;
    return `<div style="margin-bottom:14px;">
      <div style="display:flex;justify-content:space-between;font-family:var(--mono);font-size:11px;margin-bottom:5px;">
        <span style="color:${COIN_COLORS[item.coin]}">${COIN_SYMBOLS[item.coin]||item.coin}</span>
        <span style="color:var(--text2)">${fmt(pct,1)}%</span>
      </div>
      <div style="height:4px;background:var(--border);border-radius:2px;overflow:hidden;">
        <div style="width:${pct}%;height:100%;background:${COIN_COLORS[item.coin]};border-radius:2px;transition:width .5s;"></div>
      </div>
    </div>`;
  }).join('');
}
