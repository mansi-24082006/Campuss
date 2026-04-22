import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";

// Context Providers
import { AuthProvider } from "@/contexts/AuthContext";

// Public Pages
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignUp";
import FeaturesPage from "@/pages/FeaturesPage";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";

// Student Dashboard
import StudentDashboard from "@/pages/student-dashboard/StudentDashboard";
import AvailableEvents from "@/pages/student-dashboard/AvailableEvents";
import MyEvents from "@/pages/student-dashboard/MyEvents";
import ProfileSection from "@/pages/student-dashboard/ProfileSection";

// Faculty Dashboard
import FacultyDashboard from "@/pages/faculty-dashboard/FacultyDashboard";
import FacultyMyEvents from "@/pages/faculty-dashboard/MyEvents";
import FacultyStudentList from "@/pages/faculty-dashboard/StudentList";
import FacultyProfile from "@/pages/faculty-dashboard/ProfileSection";

// Admin Dashboard - UPDATED PATH
import AdminDashboard from "@/pages/AdminDashboard";

// Event Details
import EventDetails from "@/pages/EventDetails";
import CertificateVerifier from "@/pages/CertificateVerifier";

// Components
import ProtectedRoute from "@/components/ui/ProtectedRoute";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DashboardRedirect from "@/components/DashboardRedirect";
import PageTransition from "@/components/layout/PageTransition";
import ScrollProgress from "@/components/ui/ScrollProgress";
import { AnimatePresence } from "framer-motion";

// Wrapper to handle conditional Navbar/Footer
const AppContent = () => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/student") ||
    location.pathname.startsWith("/faculty") ||
    location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 transition-colors duration-300 overflow-x-hidden">
      <ScrollProgress />
      <Navbar />
      <main className="flex-grow pt-20">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* -------------------- PUBLIC ROUTES -------------------- */}
            <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />
            <Route path="/features" element={<PageTransition><FeaturesPage /></PageTransition>} />
            <Route path="/about" element={<PageTransition><AboutPage /></PageTransition>} />
            <Route path="/contact" element={<PageTransition><ContactPage /></PageTransition>} />
            <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
            <Route path="/signup" element={<PageTransition><SignupPage /></PageTransition>} />
            <Route path="/register" element={<PageTransition><SignupPage /></PageTransition>} />

            {/* -------------------- DYNAMIC DASHBOARD -------------------- */}
            <Route path="/dashboard" element={<PageTransition><DashboardRedirect /></PageTransition>} />

            {/* -------------------- STUDENT ROUTES -------------------- */}
            <Route
              path="/student"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <PageTransition><StudentDashboard /></PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/available-events"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <PageTransition><AvailableEvents /></PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/my-events"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <PageTransition><MyEvents /></PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/profile"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <PageTransition><ProfileSection /></PageTransition>
                </ProtectedRoute>
              }
            />

            {/* -------------------- FACULTY ROUTES -------------------- */}
            <Route
              path="/faculty"
              element={
                <ProtectedRoute allowedRoles={["faculty"]}>
                  <PageTransition><FacultyDashboard /></PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/faculty/my-events"
              element={
                <ProtectedRoute allowedRoles={["faculty"]}>
                  <PageTransition><FacultyMyEvents /></PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/faculty/students"
              element={
                <ProtectedRoute allowedRoles={["faculty"]}>
                  <PageTransition><FacultyStudentList /></PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/faculty/profile"
              element={
                <ProtectedRoute allowedRoles={["faculty"]}>
                  <PageTransition><FacultyProfile /></PageTransition>
                </ProtectedRoute>
              }
            />

            {/* -------------------- ADMIN ROUTES -------------------- */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <PageTransition><AdminDashboard /></PageTransition>
                </ProtectedRoute>
              }
            />

            <Route path="/event/:id" element={<PageTransition><EventDetails /></PageTransition>} />
            <Route path="/verify/:certId" element={<PageTransition><CertificateVerifier /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </main>
      {!isDashboard && <Footer />}
      <Toaster />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <HelmetProvider>
        <Router
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Helmet>
            <title>CampusBuzz - College Event Aggregator</title>
            <meta
              name="description"
              content="Discover, register, and manage college events with CampusBuzz"
            />
          </Helmet>
          <AppContent />
        </Router>
      </HelmetProvider>
    </AuthProvider>
  );
}

export default App;
