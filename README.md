# AETHER VAULT 🔷
### Institutional Crypto Intelligence Platform

A premium, fully functional crypto dashboard with AdSense monetization built in.

---

## 📁 PROJECT STRUCTURE

```
aether-vault/
├── index.html          ← Main page (all tools + SEO content)
├── robots.txt          ← Tells Google to index everything
├── sitemap.xml         ← Update with your domain before deploying
├── manifest.json       ← Makes site installable (PWA)
├── netlify.toml        ← CDN caching for scale
└── assets/
    ├── css/
    │   ├── main.css        ← Core styles, layout, components
    │   ├── animations.css  ← Scroll reveals, floating coins
    │   ├── background.css  ← Dark background, grid lines
    │   └── responsive.css  ← Mobile & tablet breakpoints
    └── js/
        ├── api.js          ← Cached price fetching (CoinGecko)
        ├── profit.js       ← Profit simulator logic
        ├── portfolio.js    ← Portfolio tracker logic
        ├── converter.js    ← Coin converter logic
        ├── tax.js          ← Tax calculator logic
        ├── mining.js       ← Mining profitability logic
        ├── sentiment.js    ← Fear & Greed AI sentiment
        ├── seo.js          ← Collapsible SEO sections + FAQ
        └── app.js          ← Main orchestrator, boot sequence
```

---

## 🚀 DEPLOYMENT (Step by Step)

### Step 1 — Buy a Domain
Go to **namecheap.com** and search for a domain like:
- `aethervault.io`
- `cryptovault.tools`
- `coinoracle.io`
Cost: ~$10-15/year

### Step 2 — Deploy on Netlify
1. Go to **netlify.com** → Sign up free
2. Click **"Add new site"** → **"Deploy manually"**
3. Drag and drop your entire `aether-vault/` folder
4. Netlify gives you a free URL like `aether-vault.netlify.app`

### Step 3 — Connect Your Domain
1. In Netlify: Site Settings → Domain Management → Add custom domain
2. In Namecheap: Update DNS nameservers to Netlify's nameservers
3. Wait 24-48 hours for DNS propagation
4. Netlify auto-adds SSL certificate (HTTPS) for free

### Step 4 — Update sitemap.xml
Replace `https://yourdomain.com` with your actual domain in `sitemap.xml`

### Step 5 — Apply for Google AdSense
1. Go to **adsense.google.com**
2. Sign up → Add your site URL
3. Paste the AdSense verification code in `<head>` of `index.html`
4. Wait for approval (usually 1-2 weeks)
5. Once approved, replace placeholder ad slots in index.html with your real ad unit codes

---

## 💰 ADSENSE AD SLOTS
Three ad placements already built in:
- **Leaderboard 1** — After stats section (high visibility)
- **Leaderboard 2** — After converter section (mid-page)
- **Leaderboard 3** — Before footer (bottom of content)

Replace `ca-pub-XXXXXXXXXXXXXXXX` and `data-ad-slot="XXXXXXXXXX"` with your real AdSense values.

Also add this script in `<head>`:
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>
```

---

## 🔧 CUSTOMIZATION

### Change Site Name
Search and replace `AETHER VAULT` with your brand name in `index.html`

### Add Google Analytics
Add in `<head>` of index.html:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Submit to Google Search Console
1. Go to **search.google.com/search-console**
2. Add your domain property
3. Verify ownership via Netlify DNS record
4. Submit your sitemap URL: `https://yourdomain.com/sitemap.xml`

---

## ⚡ PERFORMANCE & SCALE
- Netlify CDN serves from 100+ global edge locations
- CSS/JS assets cached for 1 year (immutable)
- HTML served fresh each request for live data
- CoinGecko API calls cached client-side for 60 seconds
- No database, no server — scales to unlimited users for free

---

## 📊 EXPECTED LIGHTHOUSE SCORES
| Category      | Score  |
|--------------|--------|
| Performance  | 90-96  |
| Accessibility| 88-94  |
| Best Practices| 95-100|
| SEO          | 95-100 |

---

## 🌐 APIs USED (All Free)
- **CoinGecko** — Live crypto prices (no API key needed for basic use)
- **Alternative.me** — Fear & Greed Index

---

Built for passive income via Google AdSense. Set it up once, earn forever.
