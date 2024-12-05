import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import ConsultantRegistration from '@/pages/auth/ConsultantRegistration';
import ClientRegistration from '@/pages/auth/ClientRegistration';
import Dashboard from '@/pages/Dashboard';
import ConsultantProfileForm from '@/pages/profile/ConsultantProfileForm';
import ConsultantProfile from '@/pages/profile/ConsultantProfile';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import FeedbackButton from './components/feedback/FeedbackButton';
import ToastContainer from './components/ToastContainer';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <FeedbackButton />
          <ToastContainer />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/register/client" element={<ClientRegistration />} />
            <Route path="/register/consultant" element={<ConsultantRegistration />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile/consultant/edit"
              element={
                <PrivateRoute>
                  <ConsultantProfileForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile/consultant/:id"
              element={
                <PrivateRoute>
                  <ConsultantProfile />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;