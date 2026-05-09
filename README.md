# ✈️ TripUgo — Beyond Maps & Miles

Premium dark glassmorphism travel app — Final Year Major Project.

## 🚀 Quick Start

```bash
# 1. Install
npm install

# 2. Add API keys (optional — app works in demo mode without them)
# Edit .env with your keys

# 3. Run
npm run dev
# Opens at http://localhost:5173/auth
```

## 🎨 UI Theme

- **Dark glassmorphism** — deep navy background (#0F1923)
- **Glass cards** — blur + transparency + inner glow on hover
- **Framer Motion** — all page transitions, card entrances, button taps
- **Hover effects** — translateY, border glow, background shift on every element
- **Animated orbs** — floating ambient background glow
- **Font** — Plus Jakarta Sans (Airbnb-style bold)

## 🔑 API Setup (All Free Tier)

| API | Free Limit | Purpose |
|-----|-----------|---------|
| [OpenWeatherMap](https://openweathermap.org/api) | 1M calls/month | Live weather |
| [ExchangeRate-API](https://www.exchangerate-api.com/) | 1,500 calls/month | Currency rates |
| [Google Maps](https://console.cloud.google.com) | $200 credit/month | Interactive map |
| [Claude API](https://console.anthropic.com) | Pay per use (~$1-2/mo) | AI assistant |

```

## Deploy

**Netlify (recommended):**
```bash
npm run build
# Drag /dist folder to app.netlify.com/drop
```
Add env vars in: Netlify → Site Settings → Environment Variables

**Vercel:**
```bash
npx vercel --prod
```
Add env vars in: Vercel → Project Settings → Environment Variables

## 📁 Structure

```
src/
├── pages/          # 11 pages (Auth + 10 app pages)
├── components/     # Layout (Sidebar, Topbar) + UI (Skeleton, CountrySelector)
├── context/        # AppContext (state) + AuthContext (auth)
├── services/       # weatherService, currencyService, aiService
├── hooks/          # useWeather, useCurrency
├── data/           # countries.json, packingRules.json
└── utils/          # formatters.js
```

## 👤 Login

- Click **"Continue as Demo User"** for instant access
- Or register your own account (stored in localStorage)
- Switch countries via **sidebar country switcher ⇅**

Built with React 18 + Vite + Tailwind CSS + Framer Motion
