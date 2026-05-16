const COIN_IDS =
  'bitcoin,ethereum,solana,binancecoin,ripple,cardano,dogecoin,avalanche-2,litecoin,monero,ethereum-classic,tether,usd-coin';

const UPSTREAM = `https://api.coingecko.com/api/v3/simple/price?ids=${COIN_IDS}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true`;

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=30');
  try {
    const upstream = await fetch(UPSTREAM, { headers: { Accept: 'application/json' } });
    const data = await upstream.json();
    if (!upstream.ok) {
      res.status(upstream.status).json(data);
      return;
    }
    res.status(200).json(data);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
};
