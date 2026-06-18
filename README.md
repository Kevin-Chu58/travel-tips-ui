# Travel Tips Go UI

A full-featured travel planning web application built with React, TypeScript, and Vite. Users can create and manage trips, organize itineraries, and explore destinations on an interactive map — all backed by a dedicated REST API with Auth0 authentication.

---

## Features

- **Trip management** — Create, edit, and organize trips with detailed itineraries
- **Interactive maps** — Visualize routes and destinations via Leaflet and MapTiler
- **Drag-and-drop itinerary ordering** — Powered by `@dnd-kit`
- **Rich text support** — Markdown rendering with GFM, superscript/subscript, and raw HTML
- **Image handling** — Upload and crop photos with in-browser compression
- **PDF export** — Generate downloadable trip summaries with jsPDF
- **Authentication** — Secure login and user sessions via Auth0
- **Responsive UI** — Built with Material UI v7 and SCSS

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript |
| Build tool | Vite 6 |
| Styling | Material UI v7, SCSS (Sass) |
| State management | Redux Toolkit + React Query |
| Routing | React Router v7 |
| Maps | Leaflet, MapTiler |
| Auth | Auth0 (`@auth0/auth0-react`) |
| Drag & drop | dnd-kit |
| PDF export | jsPDF |

---

## Prerequisites

- Node.js 18+
- npm or yarn
- An [Auth0](https://auth0.com) account (for authentication)
- A [MapTiler](https://www.maptiler.com) API key (for maps)
- The [Travel Tips API](https://github.com/Kevin-Chu58) running locally or deployed

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Kevin-Chu58/travel-tips-ui.git
cd travel-tips-ui
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

The repo includes a `.env` file with default values. Update it with your own credentials before running locally:

```env
VITE_AUTH0_DOMAIN=your-auth0-domain
VITE_AUTH0_CLIENT_ID=your-auth0-client-id
VITE_AUTH0_AUDIENCE=https://travel-tips
VITE_API_URL_LOCAL=http://localhost:5252/api
VITE_API_URL_PRODUCTION_US_WEST=https://your-api-url/api
VITE_MAP_TILER_API_KEY=your-maptiler-api-key
```

> **Note:** Do not commit real secrets to version control. Consider using `.env.local` for local overrides.

### 4. Start the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173` by default.

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server with hot module replacement |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across the project |

---

## Project Structure

```
travel-tips-ui/
├── public/             # Static assets
├── src/                # Application source code
├── .env                # Environment variable defaults
├── .github/workflows/  # CI/CD pipelines
├── index.html          # HTML entry point
├── vite.config.ts      # Vite configuration
└── tsconfig*.json      # TypeScript configuration files
```

---

## Deployment

The production API is hosted on Azure (US West). The `.github/workflows` directory contains CI/CD configuration for automated deployments.

To build for production:

```bash
npm run build
```

The output will be in the `dist/` directory, ready to be served by any static hosting provider (Azure Static Web Apps, Netlify, Vercel, etc.).

---

## License

This project is licensed under [CC BY-NC](./LICENSE-CC-BY-NC) — free to use for non-commercial purposes with attribution.
