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

## Screenshots

### Itinerary View
<img width="1918" height="965" alt="Screenshot 2026-04-22 093515" src="https://github.com/user-attachments/assets/335ce908-7cd7-42c6-992d-d752938fb68c" />
<img width="1918" height="972" alt="Screenshot 2026-04-22 145105" src="https://github.com/user-attachments/assets/6cd64143-9bb1-4a4a-ad9c-f205677817b6" />
<img width="1918" height="971" alt="Screenshot 2026-04-22 084331" src="https://github.com/user-attachments/assets/204baf20-7d08-4142-8f51-9e13aa05e3c8" />

### Banner Editing UI
<img width="1917" height="965" alt="Screenshot 2026-04-22 093658" src="https://github.com/user-attachments/assets/ce133d1e-4327-4287-afff-fb26d22c5ea8" />
<img width="1919" height="966" alt="Screenshot 2026-04-22 093713" src="https://github.com/user-attachments/assets/46b31348-dc34-4773-8253-8bb5fc6472a6" />

### Self-serving Ads Portal
<img width="1916" height="971" alt="Screenshot 2026-04-22 092328" src="https://github.com/user-attachments/assets/14f9a0f9-2c91-4fbb-b42a-f60b6ea1e483" />
<img width="1915" height="968" alt="Screenshot 2026-04-22 092822" src="https://github.com/user-attachments/assets/0820817a-b862-47a2-ae68-f16619ad81e2" />
<img width="1914" height="970" alt="Screenshot 2026-04-22 092846" src="https://github.com/user-attachments/assets/89d86b3a-9d83-4f8b-9e8d-1578ef459bf9" />


---

## Prerequisites

- Node.js 18+
- npm or yarn
- An [Auth0](https://auth0.com) account (for authentication)
- A [MapTiler](https://www.maptiler.com) API key (for maps)
- The [Travel Tips API](https://github.com/Kevin-Chu58/travel-tips-api) running locally or deployed

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
