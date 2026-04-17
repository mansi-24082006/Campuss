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

// Wrapper to handle conditional Navbar/Footer
const AppContent = () => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/student") ||
    location.pathname.startsWith("/faculty") ||
    location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 transition-colors duration-300">
      <Navbar />
      <main className="flex-grow pt-20">
        <Routes>
          {/* -------------------- PUBLIC ROUTES -------------------- */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* -------------------- DYNAMIC DASHBOARD -------------------- */}
          <Route path="/dashboard" element={<DashboardRedirect />} />

          {/* -------------------- STUDENT ROUTES -------------------- */}
          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/available-events"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <AvailableEvents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/my-events"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <MyEvents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/profile"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <ProfileSection />
              </ProtectedRoute>
            }
          />

          {/* -------------------- FACULTY ROUTES -------------------- */}
          <Route
            path="/faculty"
            element={
              <ProtectedRoute allowedRoles={["faculty"]}>
                <FacultyDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/faculty/my-events"
            element={
              <ProtectedRoute allowedRoles={["faculty"]}>
                <FacultyMyEvents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/faculty/students"
            element={
              <ProtectedRoute allowedRoles={["faculty"]}>
                <FacultyStudentList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/faculty/profile"
            element={
              <ProtectedRoute allowedRoles={["faculty"]}>
                <FacultyProfile />
              </ProtectedRoute>
            }
          />

          {/* -------------------- ADMIN ROUTES -------------------- */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="/event/:id" element={<EventDetails />} />
          <Route path="/verify/:certId" element={<CertificateVerifier />} />
        </Routes>
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
