import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import About from './pages/About'
import Login from './pages/Login'
import './App.css'

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-[#f8fafc] dark:bg-[#070a13] text-slate-900 dark:text-gray-100 font-sans selection:bg-sky-500/30 selection:text-sky-300 transition-colors duration-300">
        {/* Navigation Bar */}
        <Navbar />
        
        {/* Main Content Area */}
        <main className="flex-grow pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        
        {/* Footer */}
        <Footer />
      </div>
    </Router>
  )
}

export default App
