# 🏔️ Apex Himalaya Treks

A premium, modern, and highly interactive travel & trekking portal built for exploring the majesty of the Himalayas in Nepal. The application is built using **React 19**, **Vite**, **Tailwind CSS v4**, and **Framer Motion** to deliver a visually stunning, responsive, and fluid user experience.

---

##  Key Features

- ** Plan My Trek Quiz Finder**: A 3-step interactive quiz matching user preferences (budget, time duration, difficulty/fitness) against the Himalayan database using an equal-weighted (~33.3% each) matching algorithm with detail matching breakdowns.
- ** Trip Cost Calculator**: Real-time cost estimator allowing trekkers to customize route, traveler count (auto-applied group discount), local transit (flights/jeeps), high-altitude gear rentals, porter/guide tips, and daily personal expenses.
- ** Packing List Generator & Downloader**: Interactive checklists customized by season and altitude threshold (above/below 4,000m) with persistent user ticks and client-side `.txt` checklist downloading.
- ** Interactive SVG Nepal Map**: Topographic visual overlay displaying plotted pins for all treks. Hovering/clicking pins reveals glassmorphic cards with trek information and direct page links.
- ** Difficulty & Metrics Comparison Charts**: Responsive Recharts bar charts comparing altitudes, durations, and pricing variables across multiple user-selected treks.
- ** FAQ Searchable Accordion**: Accordion support for searchable and category-filtered (General, Safety, Gear, Booking) support resource center.
- ** Animated Stats Counters & Confetti**: Scroll-triggered numeric counting in stats panels, triggering a colorful confetti spray upon reaching milestone achievements.
- ** Achievement Badges (Gamification)**: Achievements locks/unlocks synced to user interactions, wishlist size, checked checklists, and calculator/booking submissions.
- ** Live Booking Notification Toasts**: Real-time simulated user booking toasts sliding in smoothly from bottom-left to keep the web application feeling alive and active.
- ** Custom SVG Route Elevation Profile (`RouteMap`)**: An interactive, lightweight SVG elevation chart that parses day-by-day altitudes, rendering a smooth cubic-bezier elevation curve. Users can tap milestone nodes to view altitude stats and itinerary descriptions.
- ** Advanced Trek Browser & Filters**: Complete search panels enabling text queries, difficulty categorization (Easy, Moderate, Challenging), sorting parameters (price, duration, popularity), list/grid layout toggle, and smooth pagination.
- ** Global Wishlist System**: React Context-driven wishlist context synced with `localStorage`, letting users save, preview, and organize desired trekking routes.
- ** Glassmorphic Admin Dashboard Portal**: Fully functional analytics and administration portal featuring:
  - Metric trackers (Revenue, Active Bookings, Customers, Active Treks).
  - Searchable **Bookings** tab with detailed overlays and status badges (Paid, Pending, Refunded).
  - **Customers** registry detailing trip history, contact information, and statuses.
  - **Packages** & **Settings** panels to adjust operational parameters.
- ** WhatsApp Chat Integration & Toast System**: Repositioned float widget connecting customers to WhatsApp, plus custom sliding toast alerts.
- ** SEO Management**: Meta tags managed per page using `react-helmet-async` for search engine visibility.

---

##  Technology Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 7](https://vite.dev/)
- **Routing**: [React Router Dom v7](https://reactrouter.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [motion/react (Framer Motion v12)](https://motion.dev/)
- **Data Visualization**: [Recharts v2](https://recharts.org/)
- **Special Effects**: [Canvas-Confetti v1](https://github.com/catdad/canvas-confetti)
- **Icons**: [Lucide React](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/)
- **SEO Management**: [React Helmet Async](https://github.com/staylor/react-helmet-async)
- **Pagination**: [React Paginate](https://github.com/AdeleD/react-paginate)
- **State/Storage**: Context API & local storage hooks for wishlist and checklists.

---

##  Directory Structure

```text
trekking_react/
├── public/                 # Static assets
├── src/
│   ├── assets/             # Brand logos and general media assets
│   ├── components/         # Shared & reusable components
│   │   ├── admin/          # Admin dashboard sub-components
│   │   ├── common/         # Common layout blocks (SEO, Toast, etc.)
│   │   ├── features/       # Features (FAQ, Testimonials, WeatherWidget, InteractiveMap, LiveBookingNotifier, Stats)
│   │   ├── Footer.jsx
│   │   ├── Navbar.jsx
│   │   ├── ScrollProgress.jsx
│   │   ├── ToastContext.jsx
│   │   ├── WishlistContext.jsx
│   │   └── WhatsAppButton.jsx
│   ├── config/             # Config files (company contact details, image mapping)
│   │   ├── company.js
│   │   └── images.js
│   ├── data/               # Mock data (treks, bookings, customers, packages)
│   │   ├── dummyBookings.js
│   │   ├── dummyCustomers.js
│   │   ├── dummyPackages.js
│   │   ├── galleryData.js
│   │   └── treks.js
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Main routing views
│   │   ├── About.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── Contact.jsx
│   │   ├── Gallery.jsx
│   │   ├── Home.jsx
│   │   ├── NotFound.jsx
│   │   ├── Packages.jsx
│   │   ├── Planner.jsx
│   │   └── TrekDetail.jsx
│   ├── services/           # API and integrations
│   ├── App.jsx             # Main Application routing and setup
│   ├── index.css           # Tailwind CSS directives and custom animations
│   └── main.jsx            # React root entry point
├── package.json            # Scripts & project dependencies
└── vite.config.js          # Vite custom configuration
```

---

##  Setup and Installation

Follow these steps to run the project locally on your machine:

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18.0.0 or higher) and `npm` installed.

### 2. Clone the Repository
```bash
git clone <repository-url>
cd trekking_react
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173` to see the live application!

### 5. Build for Production
```bash
npm run build
```
The compiled build output will be generated inside the `dist` directory, optimized and ready for hosting.

---

##  Author & Credits

- **Developer**: Sabin Khatri
- **Company**: Apex Himalaya Treks
- **Location**: Belbari, Morang, Nepal
- **Contact**: info@apexhimalayatreks.com
