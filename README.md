# Apex Himalaya Treks

A React, Vite, Tailwind CSS and Express application for exploring and booking treks in Nepal.

## Project Structure

```text
trekking_react/
├── frontend/              # React app, static assets, Vite config and frontend dependencies
│   ├── src/
│   ├── public/
│   └── package.json
└── backend/               # Express API, PostgreSQL schema and backend dependencies
    ├── index.js
    ├── schema.sql
    └── package.json
```

## Run Locally

Install Node.js 18+ and PostgreSQL. Create a PostgreSQL database for the app.

### Backend

1. Open a terminal in `backend/` and copy `.env.example` to `.env`.
2. Set `DATABASE_URL`, a long random `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` (at least 12 characters), and `CLIENT_ORIGIN=http://localhost:5173` in `.env`.
3. Install dependencies: `npm install`.
4. Apply the schema: `psql "$env:DATABASE_URL" -f schema.sql` in PowerShell, or `psql "$DATABASE_URL" -f schema.sql` on macOS/Linux.
5. Create the admin account: `npm run db:create-admin`.
6. Start the API: `npm run dev`.

### Frontend

In a second terminal, open `frontend/`, install dependencies with `npm install`, and start Vite with `npm run dev`. The frontend is served at `http://localhost:5173` and proxies `/api` requests to the backend on port 3001.

Build the frontend for production from `frontend/` with `npm run build`; output is written to `frontend/dist`.

For production, deploy `backend/` to a Node.js host and set `VITE_API_URL` to the API origin in the frontend build environment. Set the backend's `CLIENT_ORIGIN` and database/JWT environment variables on the API host.

## Features

- Trek discovery, search, filters, details, and trip planning
- Booking requests and an admin dashboard for bookings, customers, and packages
- PostgreSQL-backed Express API with bcrypt admin authentication and JWT authorization
- Interactive maps, route profiles, packing checklists, FAQs, testimonials, and responsive layouts

## Credits

- Developer: Sabin Khatri
- Company: Apex Himalaya Treks
- Location: Belbari, Morang, Nepal
- Contact: info@apexhimalayatreks.com
