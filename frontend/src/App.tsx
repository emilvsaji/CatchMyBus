import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import SearchResults from './pages/SearchResults';
import AdminPage from './pages/AdminPage';
import UserDashboard from './pages/UserDashboard';
import DebugPage from './pages/DebugPage';

function App() {
  useEffect(() => {
    console.log('VITE_API_URL =', import.meta.env.VITE_API_URL);
  }, []);

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-neutral-50">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchResults />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute requireAdmin={false}>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminPage />
                </ProtectedRoute>
              }
            />
            <Route path="/debug" element={<DebugPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
