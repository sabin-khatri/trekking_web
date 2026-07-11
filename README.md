# 🏔️ Apex Himalaya Treks

A premium, modern, and highly interactive travel & trekking portal built for exploring the majesty of the Himalayas in Nepal. The application is built using **React 19**, **Vite**, **Tailwind CSS v4**, and **Framer Motion** to deliver a visually stunning, responsive, and fluid user experience.

---

## 🚀 Key Features

- **Dynamic Parallax Hero Landing Page**: Impressive landing page featuring smooth scroll-linked background parallax animations, real-time weather widgets, and seasonal trekking guides.
- **Trek Packages Browser**: Interactive search and filter panel allowing users to explore different trails. Supports search queries, category filters (challenging, moderate, easy), sorting options, grid/list view toggles, and responsive pagination.
- **Detailed Itineraries & Interactive Map**: Dedicated detail page for each trek offering day-by-day itineraries, difficulty ratings, pricing, maximum altitudes, and custom animated maps.
- **Admin Dashboard Portal**: A fully-fledged admin suite tracking booking metrics, customer details, packages, and application settings with modern glassmorphism dashboards.
- **Rich Micro-interactions & Animations**: Subtle float animations, progress bars, scroll animations, dynamic toast notifications, and interactive elements.
- **SEO Ready**: Automatically sets optimized title tags, meta descriptions, and semantic headers using `react-helmet-async`.
- **Direct WhatsApp Chat Integration**: Instantly connect customers with representatives for quick inquiries.

---

## 🛠️ Technology Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 7](https://vite.dev/)
- **Routing**: [React Router Dom v7](https://reactrouter.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [motion/react (Framer Motion v12)](https://motion.dev/)
- **Icons**: [Lucide React](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/)
- **SEO Management**: [React Helmet Async](https://github.com/staylor/react-helmet-async)
- **Pagination**: [React Paginate](https://github.com/AdeleD/react-paginate)

---

## 📁 Directory Structure

```text
trekking_react/
├── public/                 # Static assets
├── src/
│   ├── assets/             # Brand logos and general media assets
│   ├── components/         # Shared & reusable components
│   │   ├── admin/          # Admin dashboard sub-components
│   │   ├── common/         # Common layout blocks (SEO, Toast, etc.)
│   │   ├── features/       # Features (FAQ, Testimonials, WeatherWidget, Maps)
│   │   ├── Footer.jsx
│   │   ├── Navbar.jsx
│   │   ├── ScrollProgress.jsx
│   │   ├── ToastContext.jsx
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
│   │   └── TrekDetail.jsx
│   ├── services/           # API and integrations
│   ├── App.jsx             # Main Application routing and setup
│   ├── index.css           # Tailwind CSS directives and custom animations
│   └── main.jsx            # React root entry point
├── package.json            # Scripts & project dependencies
└── vite.config.js          # Vite custom configuration
```

---

## ⚙️ Setup and Installation

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

## ✍️ Author & Credits

- **Developer**: Sabin Khatri
- **Company**: Apex Himalaya Treks
- **Location**: Belbari, Morang, Nepal
- **Contact**: info@apexhimalayatreks.com
