const UPSTREAM = 'https://api.alternative.me/fng/?limit=30';

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');
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
