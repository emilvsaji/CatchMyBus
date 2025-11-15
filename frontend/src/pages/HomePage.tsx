import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Navigation, Clock, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../config/api';
import { BusResult } from '../types';
import BusCard from '../components/BusCard';

const HomePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    busType: 'all',
  });
  const [loadingResults, setLoadingResults] = useState(false);
  const [results, setResults] = useState<BusResult[]>([]);

  const fetchBusResults = async (from: string, to: string, type: string) => {
    try {
      setLoadingResults(true);
      const resp = await api.get('/api/buses/search', { params: { from, to, type } });
      setResults(resp.data.data || []);
    } catch (err) {
      console.error('Error fetching bus results from HomePage:', err);
      toast.error('Failed to fetch bus results');
      setResults([]);
    } finally {
      setLoadingResults(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.from || !formData.to) {
      toast.error('Please select both origin and destination');
      return;
    }

    if (formData.from === formData.to) {
      toast.error('Origin and destination cannot be the same');
      return;
    }

    // Perform inline search and show results on Home
    fetchBusResults(formData.from, formData.to, formData.busType || 'all');
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      {/* Hero Section */}
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Find Your Bus in <span className="text-primary-600">Real-Time</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Get accurate bus timings, routes, and availability across Kerala.
          Never miss your bus again!
        </p>
      </div>

      {/* Search Card */}
      <div className="max-w-3xl mx-auto mb-16 animate-slide-up">
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Search className="h-6 w-6 mr-2 text-primary-600" />
            Search for Buses
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* From Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="h-4 w-4 inline mr-1" />
                From (Current Location / Bus Stop)
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="Enter starting point (e.g., Thiruvananthapuram)"
                value={formData.from}
                onChange={(e) => setFormData({ ...formData, from: e.target.value })}
              />
            </div>

            {/* To Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Navigation className="h-4 w-4 inline mr-1" />
                To (Destination Bus Stop)
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="Enter destination (e.g., Kochi)"
                value={formData.to}
                onChange={(e) => setFormData({ ...formData, to: e.target.value })}
              />
            </div>

            {/* Bus Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="h-4 w-4 inline mr-1" />
                Bus Type (Optional)
              </label>
              <select
                className="input-field"
                value={formData.busType}
                onChange={(e) => setFormData({ ...formData, busType: e.target.value })}
              >
                <option value="all">All Buses</option>
                <option value="KSRTC">KSRTC</option>
                <option value="Private">Private</option>
                <option value="Fast">Fast</option>
                <option value="Super Fast">Super Fast</option>
                <option value="Ordinary">Ordinary</option>
              </select>
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn-primary w-full">
              <Search className="h-5 w-5 inline mr-2" />
              Search Buses
            </button>
          </form>
        </div>
      </div>

      {/* Inline Results (when searched) */}
      <div className="max-w-3xl mx-auto mb-16 animate-slide-up">
        {loadingResults ? (
          <div className="card text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Searching for buses...</p>
          </div>
        ) : results.length === 0 ? null : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Search Results</h2>
              <button onClick={() => navigate(`/search?from=${encodeURIComponent(formData.from)}&to=${encodeURIComponent(formData.to)}&type=${formData.busType}`)} className="text-sm text-primary-600 hover:underline">
                View full results
              </button>
            </div>

            <div className="space-y-4">
              {results.map((r, i) => (
                <BusCard key={i} result={r} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="card text-center hover:scale-105 transition-transform">
          <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="h-8 w-8 text-primary-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Real-Time Updates</h3>
          <p className="text-gray-600">
            Get accurate arrival times and bus availability information instantly
          </p>
        </div>

        <div className="card text-center hover:scale-105 transition-transform">
          <div className="bg-accent-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="h-8 w-8 text-accent-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Route Visualization</h3>
          <p className="text-gray-600">
            View bus routes on interactive maps with stop-by-stop details
          </p>
        </div>

        <div className="card text-center hover:scale-105 transition-transform">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Save Favorites</h3>
          <p className="text-gray-600">
            Save your frequent routes for quick access anytime
          </p>
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl shadow-xl p-8 md:p-12 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Making Bus Travel Easier for Kerala</h2>
        <p className="text-lg mb-6 opacity-90 max-w-3xl mx-auto">
          CatchMyBus provides comprehensive bus timing information for routes across
          Kerala. Whether you're a daily commuter, student, or traveler, we help you
          plan your journey efficiently.
        </p>
        <div className="flex flex-wrap justify-center gap-8 text-center">
          <div>
            <div className="text-4xl font-bold mb-1">500+</div>
            <div className="text-sm opacity-90">Bus Routes</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-1">1000+</div>
            <div className="text-sm opacity-90">Bus Stops</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-1">24/7</div>
            <div className="text-sm opacity-90">Service</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
