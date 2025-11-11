import { useState, useEffect } from 'react';
import { Heart, Trash2, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../config/api';
import { UserFavorite } from '../types';

const FavoritesPage = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<UserFavorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await api.get('/favorites');
      setFavorites(response.data.data || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast.error('Failed to fetch favorites');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/favorites/${id}`);
      setFavorites(favorites.filter((f) => f.id !== id));
      toast.success('Favorite removed');
    } catch (error) {
      console.error('Error deleting favorite:', error);
      toast.error('Failed to delete favorite');
    }
  };

  const handleSearch = (from: string, to: string) => {
    navigate(`/search?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&type=all`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
            <Heart className="h-8 w-8 mr-3 text-red-500" />
            Favorite Routes
          </h1>
          <p className="text-gray-600">
            Quick access to your frequently searched routes
          </p>
        </div>

        {loading ? (
          <div className="card text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading favorites...</p>
          </div>
        ) : favorites.length === 0 ? (
          <div className="card text-center py-12">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No Favorites Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Save your frequently used routes for quick access
            </p>
            <button onClick={() => navigate('/')} className="btn-primary">
              Start Searching
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {favorites.map((favorite) => (
              <div
                key={favorite.id}
                className="card hover:shadow-xl transition-shadow animate-slide-up"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex items-center space-x-2 text-gray-700">
                        <span className="font-semibold">{favorite.fromStop}</span>
                        <span className="text-primary-600">→</span>
                        <span className="font-semibold">{favorite.toStop}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">
                      Saved on {new Date(favorite.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleSearch(favorite.fromStop, favorite.toStop)}
                      className="btn-primary flex items-center"
                    >
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </button>
                    <button
                      onClick={() => handleDelete(favorite.id)}
                      className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove from favorites"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
