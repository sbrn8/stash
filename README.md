# Stash
Stash turns screenshots and links into an organized action list. Making the restaurants, trips, and workouts you save from TikTok and Reels actually happen.

## Features

- Save anything via screenshot upload or link paste
- AI-powered extraction using Google Gemini — automatically pulls title, category, location, and summary
- Pinterest-style masonry grid organized by category
- Map view showing all saved locations as interactive pins
- Mark items as done to track what you've actually followed through on

## Tech Stack

- **Frontend:** React, TypeScript, Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router
- **Maps:** Leaflet / React Leaflet
- **AI:** Google Gemini 1.5 Flash
- **Deployment:** Vercel

## Getting Started

1. Clone the repo
```bash
   git clone https://github.com/YOURUSERNAME/stash.git
   cd stash
```

2. Install dependencies
```bash
   npm install
```

3. Add your Gemini API key — create a `.env` file in the root:
```
VITE_GEMINI_API_KEY=your-key-here
```

4. Run the dev server
```bash
   npm run dev
```

## Roadmap
- [ ] Backend + PostgreSQL database for persistent storage
- [ ] Auth with user accounts
- [ ] Social layer — see what friends have saved
- [ ] Deal scraping for saved restaurants and products
- [ ] AI trip planner chat

