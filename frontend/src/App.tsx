import { Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import SearchResults from './pages/SearchResults';
import FavoritesPage from './pages/FavoritesPage';
import AdminPage from './pages/AdminPage';
import AboutPage from './pages/AboutPage';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
