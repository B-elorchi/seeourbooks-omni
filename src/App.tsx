import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

import DashboardPage from './pages/DashboardPage';
import ProcessingPage from './pages/ProcessingPage';
import LibraryPage from './pages/LibraryPage';
import MyBooksPage from './pages/MyBooksPage';

function AutoLoginHandler() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if there is a ?token= parameter in the URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    
    if (token) {
      // Save token to localStorage
      localStorage.setItem('wp_token', token);
      
      // Optionally extract email from token if provided
      const email = params.get('email') || '';
      if (email) localStorage.setItem('wp_user_email', email);
      
      // Redirect to dashboard, removing the token from the URL for security
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  return null;
}

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <Router>
      <AutoLoginHandler />
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>

        {/* Protected Dashboard Routes */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/process" element={<ProcessingPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/my-books" element={<MyBooksPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
