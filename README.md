# Homestay Review Insight AI

An AI-powered web application that analyzes guest reviews, detects sentiment and themes, and generates professional management responses for homestay hosts.

---

## 🚀 Tech Stack

### Frontend
- **React.js** (built with **Vite**)
- **Tailwind CSS v4** (CSS-first UI configuration)
- **React Router v7** (browser routing layout wrapper)
- **Lucide React** (modern iconography)

### Backend & Database
- **Express.js** / **Node.js** (REST API Server)
- **CORS** (cross-origin resource sharing)
- **Dotenv** (environment variables configuration)
- **Nodemon** (hot reloading in development)
- **In-Memory Store** (simulated review analysis database)
- **MongoDB & JWT Authentication** (Planned for Week 5)

---

## 📁 Project Structure

```text
homestay-review-insight-ai/
├── backend/                  # Express.js backend application
│   ├── middleware/
│   │   └── errorHandler.js   # Global error handling middleware
│   ├── routes/
│   │   └── reviews.js        # REST API endpoints for reviews (CRUD, stats, sync)
│   ├── .env                  # Environment configurations (local only)
│   ├── .env.example          # Template for environment variables
│   ├── package.json          # Node dependencies and scripts
│   ├── server.js             # Main server entry file (Port 5000)
│   └── verify.js             # Programmatic REST API test script
├── frontend/                 # React frontend application
│   ├── public/               # Static assets & icons
│   ├── src/
│   │   ├── assets/           # React component assets
│   │   ├── components/       # Reusable UI components
│   │   │   ├── Navbar.jsx    # Sticky navigation menu (with mobile toggle drawer)
│   │   │   ├── Hero.jsx      # Welcome banner with glowing layout
│   │   │   ├── Card.jsx      # Reusable content card
│   │   │   └── Footer.jsx    # Categorized link lists & social links
│   │   ├── pages/            # Application route screens
│   │   │   ├── Home.jsx      # Home landing screen
│   │   │   ├── Dashboard.jsx # Analytical dashboard workspace (connected to backend)
│   │   │   ├── About.jsx     # Vision, values, and NLP workflow
│   │   │   └── Login.jsx     # Login page (with Google mock OAuth)
│   │   ├── App.css           # Local style exceptions
│   │   ├── App.jsx           # Main routing entry wrapper
│   │   ├── index.css         # Global styles and Tailwind configuration
│   │   └── main.jsx          # React DOM render script
│   ├── package.json          # Dependencies & script configurations
│   └── vite.config.js        # Vite configurations
└── README.md                 # Project documentation
```

---

## 💻 Getting Started (Backend)

To run the backend REST API server on your local machine:

### 1. Navigate to the backend directory:
```bash
cd homestay-review-insight-ai/backend
```

### 2. Install dependencies:
```bash
npm install
```

### 3. Run the development server:
```bash
npm run dev
```
The server will start listening on `http://localhost:5000`.

### 4. Run programmatic API verification:
```bash
node verify.js
```
This runs assertions across all 7 endpoints to ensure everything functions properly.

---

## 💻 Getting Started (Frontend)

To run the frontend skeleton on your local machine:

### 1. Navigate to the frontend directory:
```bash
cd homestay-review-insight-ai/frontend
```

### 2. Install dependencies:
```bash
npm install
```

### 3. Run the development server:
```bash
npm run dev
```
Open your browser to the local URL (usually `http://localhost:5173`) to view the application.

---

## ✨ Features Implemented (Week 4 — REST API & Full-Stack Integration)

1. **Express.js API Server**: Set up Express.js server running on port `5000` with CORS support, standard error handling middleware, logging, and environment variables.
2. **7 REST API Endpoints**:
   - `GET /api/reviews` - Fetch reviews history with search query (`q`) and sentiment filter.
   - `GET /api/reviews/stats` - Fetch computed metrics (Total, Average Rating out of 5.0, Sentiment Index, Responses Generated).
   - `GET /api/reviews/:id` - Fetch details of a single review.
   - `POST /api/reviews` - Create a review analysis report (triggers rule-based NLP AI simulation).
   - `PUT /api/reviews/:id` - Update response draft content or status.
   - `DELETE /api/reviews/:id` - Remove a review report from history.
   - `POST /api/reviews/sync` - Simulates bulk-importing external reviews from Airbnb and VRBO.
3. **Automated Verification Script**: Created `verify.js` using native `fetch` assertions to programmatically validate all endpoints, return status codes, and check JSON response integrity.
4. **Full-Stack Connection**: Connected the React frontend using `fetch` to replace all hardcoded mock data.
5. **Interactive CRUD Panel**: Implemented a "Recent Analyses History" panel in the Dashboard allowing users to search, filter by sentiment, load in editor, edit drafts inline via PUT, and delete reports via DELETE.
6. **Testing Deliverables**: Exported Postman/Thunder Client testing collection (`W4_APICollection_TBI-26100216.json`) and compiled screenshots connection PDF (`W4_FrontendBackendConnection_TBI-26100216.pdf`).

---

## ✨ Features Implemented (Week 3 — UI/UX & Component Design)

1. **Documented Component Library**: Constructed modular UI elements (`Button`, `Input`, `Modal`, `Toast`, `Loader`) under `frontend/src/components/ui/` with props documented using JSDoc styles.
2. **Theme Toggle & Persistence**: Implemented a responsive theme toggler (backed by `localStorage` persistence) allowing real-time light and dark mode switching.
3. **Layout Wireframes**:
   - Shareable Figma Board: [Figma Wireframes Board](https://www.figma.com/board/18SZKYEPnDp1EjTV2552br/W3_Wireframes_TBI-26100216?node-id=0-1&t=DmjPhSZWPQxlGo23-1)
   - Compiled PDF: `W3_Wireframes_TBI-26100216.pdf`
4. **Responsive Breaking Checks**: Compiled responsive screenshots PDF: `W3_ResponsiveScreenshots_TBI-26100216.pdf`

---

## ✨ Features Implemented (Week 2 — Frontend Foundations)

1. **Vite + React Setup**: Configured with strict production compilation capability.
2. **Tailwind CSS v4 & Fonts**: Configured Outfit and Plus Jakarta Sans Google Fonts, smooth backdrop-blur glassmorphic styles, and customized scrollbar layouts.
3. **Responsive Navbar**: Includes links mapping to all pages, showing active route states, and a hamburger drawer layout on mobile viewports.
4. **Interactive Dashboard**:
   - Simulated sentiment meter showing positive, mixed, and negative results.
   - Sample buttons that load real-world review scenarios.
   - Textarea input and simulated loading state.
   - AI Response copy-to-clipboard functionality.
5. **Modern Card Grid**: Responsive grid displaying product values with smooth transform hover state effects.
6. **Detailed Pages**: Interactive login templates, workflow process steps on the about page, and clean layout baselines on the home page.
