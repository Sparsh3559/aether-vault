/* ═══════════════════════════════════════
   AETHER VAULT — SENTIMENT.JS
   ═══════════════════════════════════════ */

async function loadSentiment() {
  try {
    const data = await AetherAPI.getFearGreed();
    const arr  = data?.data || [];
    if (!arr.length) return;

    const now   = arr[0];
    const val   = parseInt(now.value || 50);
    const label = now.value_classification || 'Neutral';

    const color =
      val < 25 ? 'var(--red)' :
      val < 45 ? '#ff8c00'    :
      val < 55 ? 'var(--gold)':
      val < 75 ? '#7fff00'    :
                 'var(--green)';

    const setEl = (id, txt, col) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.textContent = txt;
      if (col) el.style.color = col;
    };

    setEl('fg-num',   val,              color);
    setEl('fg-label', label.toUpperCase(), color);
    setEl('s-fg',     val);
    setEl('s-fg-label', label.toUpperCase(), val < 50 ? 'var(--red)' : 'var(--green)');

    const needle = document.getElementById('fg-needle');
    if (needle) needle.style.left = val + '%';

    // Historical
    if (arr[1])  setEl('fg-yesterday', `${arr[1].value} — ${arr[1].value_classification}`);
    if (arr[7])  setEl('fg-week',      `${arr[7].value} — ${arr[7].value_classification}`);
    if (arr[29]) setEl('fg-month',     `${arr[29].value} — ${arr[29].value_classification}`);

    // Trading signal
    const signals = {
      extreme_fear: { txt: 'STRONG BUY SIGNAL',         col: 'var(--green)' },
      fear:         { txt: 'CAUTIOUS ACCUMULATE',        col: 'var(--green)' },
      neutral:      { txt: 'HOLD / NEUTRAL',             col: 'var(--gold)'  },
      greed:        { txt: 'TAKE PARTIAL PROFITS',       col: 'var(--gold)'  },
      extreme_greed:{ txt: 'EXTREME CAUTION — CONSIDER EXIT', col: 'var(--red)' },
    };
    const sigKey =
      val < 25 ? 'extreme_fear' :
      val < 45 ? 'fear'         :
      val < 55 ? 'neutral'      :
      val < 75 ? 'greed'        : 'extreme_greed';
    const sig = signals[sigKey];
    setEl('fg-signal', sig.txt, sig.col);

    // AI Analysis
    const analyses = {
      extreme_fear: `Extreme fear detected (${val}/100). Historically, this level has represented optimal long-term accumulation zones for Bitcoin. Markets tend to bottom when retail capitulation peaks. Consider DCA entries into high-conviction positions. Monitor on-chain accumulation by long-term holders as a confirmation signal.`,
      fear:         `Fear is elevated in the market (${val}/100). Weak hands are exiting positions creating selling pressure. Smart money typically accumulates during fear phases. Watch BTC dominance — if rising, altcoin rotation is likely pausing. Spot buying with defined risk is appropriate for patient investors.`,
      neutral:      `Market sentiment is balanced (${val}/100). No strong directional conviction. Price action is likely range-bound. Focus on technical support/resistance levels and volume analysis. Await a clear break above resistance or below support before sizing up positions significantly.`,
      greed:        `Greed is building (${val}/100). Rally momentum remains intact but risk is increasing incrementally. Late-cycle altcoin performance typically peaks here. Consider setting trailing stop-losses on leveraged positions and taking partial profits on altcoins while maintaining BTC/ETH core.`,
      extreme_greed:`Extreme greed detected (${val}/100). Market euphoria phase — historically precedes corrections of 20-40%. Reduce leverage immediately, take profits on high-risk altcoins, and avoid FOMO entries. Maintain only high-conviction core positions (BTC, ETH). Cash or stablecoin allocation should be elevated.`,
    };
    setEl('ai-analysis', analyses[sigKey]);
    setEl('fg-desc', `Index of ${val}/100 based on volatility, momentum, social media, surveys, dominance, and search trends.`);

  } catch (e) {
    console.warn('[Sentiment] Failed:', e.message);
  }
}
