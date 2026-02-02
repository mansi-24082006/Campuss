import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Helmet } from "react-helmet";
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

// Components
import ProtectedRoute from "@/components/ui/ProtectedRoute";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Helmet>
          <title>CampusBuzz - College Event Aggregator</title>
          <meta
            name="description"
            content="Discover, register, and manage college events with CampusBuzz"
          />
        </Helmet>

        {/* GLOBAL WRAPPER 
            Added dark:bg-slate-950 to ensure the entire screen background 
            changes when the theme toggles.
          */}
        <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300">
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

              {/* -------------------- EVENT DETAILS -------------------- */}
              <Route path="/event/:id" element={<EventDetails />} />
            </Routes>
          </main>

          <Footer />
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
