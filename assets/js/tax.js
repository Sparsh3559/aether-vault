/* ═══════════════════════════════════════
   CRYPTOCALCX — TAX.JS
   ═══════════════════════════════════════ */

const TAX_RATES = {
  us: { short: 0.37,  long: 0.20,  surcharge: 0.038 },
  uk: { short: 0.20,  long: 0.20,  surcharge: 0     },
  in: { short: 0.30,  long: 0.30,  surcharge: 0     },
  au: { short: 0.45,  long: 0.225, surcharge: 0     },
  de: { short: 0.26,  long: 0,     surcharge: 0     },
  ca: { short: 0.33,  long: 0.165, surcharge: 0     },
  sg: { short: 0,     long: 0,     surcharge: 0     },
};

function calcTax() {
  const country = document.getElementById('tx-country').value;
  const gains   = parseFloat(document.getElementById('tx-gains').value)  || 0;
  const deduct  = parseFloat(document.getElementById('tx-deduct').value) || 0;
  const period  = document.getElementById('tx-period').value;

  const net  = gains - deduct;
  const r    = TAX_RATES[country] || TAX_RATES.us;
  const rate = period === 'short' ? r.short : r.long;
  const tax       = net * rate;
  const surcharge = period === 'short' ? net * r.surcharge : 0;
  const totalTax  = tax + surcharge;
  const netProfit = net - totalTax;

  document.getElementById('tx-liability').textContent  = fmtUSD(totalTax);
  document.getElementById('tx-rate').textContent       = fmt(rate * 100, 1) + '%';
  document.getElementById('tx-net').textContent        = fmtUSD(netProfit);
  document.getElementById('tx-surcharge').textContent  = fmtUSD(surcharge);
  document.getElementById('tx-bar').style.width        = Math.min(net > 0 ? (totalTax / net) * 100 : 0, 100) + '%';
}
