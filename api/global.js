const UPSTREAM = 'https://api.coingecko.com/api/v3/global';

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
