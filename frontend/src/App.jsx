import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

// Layout Components
import Navbar from './components/Navbar/Navbar.jsx';
import Footer from './components/Footer/Footer.jsx';

// Page Components
import Home from './pages/Home/Home.jsx';
import AboutCollege from './pages/AboutCollege/AboutCollege.jsx';
import Sports from './pages/Sports/Sports.jsx';
import Teams from './pages/Teams/Teams.jsx';
import Players from './pages/Players/Players.jsx';
import Matches from './pages/Matches/Matches.jsx';
import Achievements from './pages/Achievements/Achievements.jsx';
import Events from './pages/Events/Events.jsx';
import Gallery from './pages/Gallery/Gallery.jsx';
import Notices from './pages/Notices/Notices.jsx';
import Contact from './pages/Contact/Contact.jsx';

// Auth Components
import Login from './pages/Auth/Login.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';

// Admin Components
import AdminDashboard from './pages/Admin/AdminDashboard.jsx';
import ManagePlayers from './pages/Admin/ManagePlayers.jsx';
import ManageTeams from './pages/Admin/ManageTeams.jsx';
import ManageMatches from './pages/Admin/ManageMatches.jsx';
import ManageEvents from './pages/Admin/ManageEvents.jsx';
import ManageNotices from './pages/Admin/ManageNotices.jsx';
import ManageGallery from './pages/Admin/ManageGallery.jsx';

// Scroll Management helper to reset window position upon navigation
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      {/* Scroll restoration listener */}
      <ScrollToTop />

      <div className="min-h-screen flex flex-col bg-[#F8FAFC] scroll-smooth antialiased">
        {/* Header with Fixed Navbar */}
        <header className="fixed top-0 left-0 right-0 z-50 shadow-sm">
          <Navbar />
        </header>

        {/* Main Content Area */}
        <main className="flex-grow pt-20 lg:pt-32">
          <Routes>
            {/* Customer-Facing Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutCollege />} />
            <Route path="/sports" element={<Sports />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/players" element={<Players />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/events" element={<Events />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/notices" element={<Notices />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Login Route */}
            <Route path="/login" element={<Login />} />

            {/* Protected Administrative Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/players" element={<ManagePlayers />} />
              <Route path="/admin/teams" element={<ManageTeams />} />
              <Route path="/admin/matches" element={<ManageMatches />} />
              <Route path="/admin/events" element={<ManageEvents />} />
              <Route path="/admin/notices" element={<ManageNotices />} />
              <Route path="/admin/gallery" element={<ManageGallery />} />
            </Route>
          </Routes>
        </main>

        {/* Footer Area */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;