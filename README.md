# Homestay Review Insight AI

An AI-powered web application that analyzes guest reviews, detects sentiment and themes, and generates professional management responses for homestay hosts.

---

## 🚀 Tech Stack

### Frontend
- **React.js** (built with **Vite**)
- **Tailwind CSS v4** (CSS-first UI configuration)
- **React Router v7** (browser routing layout wrapper)
- **Lucide React** (modern iconography)

### Backend & Database (Planned)
- **Express.js** / **Node.js**
- **MongoDB**
- **JWT Authentication**
- **Gemini AI API** (for sentiment analysis & response generation)

---

## 📁 Project Structure

```text
homestay-review-insight-ai/
├── frontend/                 # React frontend application
│   ├── public/               # Static assets & icons
│   ├── src/
│   │   ├── assets/           # React component assets
│   │   ├── components/       # Reusable UI components
│   │   │   ├── Navbar.jsx    # Sticky navigation menu (with mobile toggle drawer)
│   │   │   ├── Hero.jsx      # Welcome banner with glowing layout and CSS dashboard preview
│   │   │   ├── Card.jsx      # Reusable content card (supports tags, images, actions)
│   │   │   └── Footer.jsx    # Categorized link lists & social links
│   │   ├── pages/            # Application route screens
│   │   │   ├── Home.jsx      # Home landing screen listing product benefits
│   │   │   ├── Dashboard.jsx # Analytical dashboard workspace (with interactive review simulator)
│   │   │   ├── About.jsx     # Vision, values, and 3-step NLP analysis workflow
│   │   │   └── Login.jsx     # Login layout form (supports credentials & OAuth options)
│   │   ├── App.css           # Local style exceptions
│   │   ├── App.jsx           # Main routing entry wrapper
│   │   ├── index.css         # Global Tailwind v4 styles, custom scrollbars, and fonts
│   │   └── main.jsx          # React DOM render script
│   ├── package.json          # Dependencies & script configurations
│   └── vite.config.js        # Vite configurations (with Tailwind plugin integration)
└── README.md                 # Project documentation
```

---

## 💻 Getting Started (Frontend)

To run the frontend skeleton on your local machine:

### 1. Clone the repository and navigate to the frontend directory:
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

### 4. Build the application for production:
```bash
npm run build
```

---

## ✨ Features Implemented (Week 2 — Frontend Foundations)

1. **Vite + React Setup**: Configured with strict production compilation capability (tested and built successfully).
2. **Tailwind CSS v4 & Fonts**: Configured Outfit and Plus Jakarta Sans Google Fonts, smooth backdrop-blur glassmorphic styles, and customized scrollbar layouts.
3. **Responsive Navbar**: Includes links mapping to all pages, showing active route states, and a hamburger drawer layout on mobile viewports.
4. **Interactive Dashboard**:
   - Simulated sentiment meter showing positive, mixed, and negative results.
   - Sample buttons that load real-world review scenarios.
   - Textarea input and simulated loading state.
   - AI Response copy-to-clipboard functionality.
5. **Modern Card Grid**: Responsive grid displaying product values with smooth transform hover state effects.
6. **Detailed Pages**: Interactive login templates, workflow process steps on the about page, and clean layout baselines on the home page.

---

## 🎨 Features Implemented (Week 3 — UI/UX & Component Design)

1. **Documented Component Library**: Constructed modular UI elements (`Button`, `Input`, `Modal`, `Toast`, `Loader`) under `frontend/src/components/ui/` with props documented using JSDoc styles.
2. **Theme Toggle & Persistence**: Implemented a responsive theme toggler (backed by `localStorage` persistence) allowing real-time light and dark mode switching.
3. **Layout Wireframes**:
   - Shareable Figma Board: [Figma Wireframes Board](https://www.figma.com/board/18SZKYEPnDp1EjTV2552br/W3_Wireframes_TBI-26100216?node-id=0-1&t=DmjPhSZWPQxlGo23-1)
   - Compiled PDF: `W3_Wireframes_TBI-26100216.pdf`
4. **Responsive Breaking Checks**: Compiled responsive screenshots PDF: `W3_ResponsiveScreenshots_TBI-26100216.pdf`
