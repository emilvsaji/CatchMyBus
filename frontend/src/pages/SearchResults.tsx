import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, TrendingUp, Heart, AlertCircle, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../config/api';
import { BusResult } from '../types';
import BusCard from '../components/BusCard';
import RouteMap from '../components/RouteMap';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<BusResult[]>([]);
  const [showMap, setShowMap] = useState(false);
  const [filterType, setFilterType] = useState('all');

  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';
  const type = searchParams.get('type') || 'all';

  useEffect(() => {
    fetchBusResults();
  }, [from, to, type]);

  const fetchBusResults = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/buses/search', {
        params: { from, to, type },
      });
      setResults(response.data.data || []);
    } catch (error) {
      console.error('Error fetching bus results:', error);
      toast.error('Failed to fetch bus information');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFavorite = async () => {
    try {
      await api.post('/api/favorites', { fromStop: from, toStop: to });
      toast.success('Route saved to favorites!');
    } catch (error) {
      console.error('Error saving favorite:', error);
      toast.error('Failed to save favorite');
    }
  };

  const filteredResults = filterType === 'all' 
    ? results 
    : results.filter(r => r.bus.type === filterType);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-primary-600 hover:text-primary-700 font-medium mb-4 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back to Search
        </button>

        <div className="card">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                {from} → {to}
              </h1>
              <p className="text-gray-600 flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {filteredResults.length} buses found
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleSaveFavorite}
                className="btn-secondary flex items-center"
              >
                <Heart className="h-4 w-4 mr-2" />
                Save Route
              </button>
              <button
                onClick={() => setShowMap(!showMap)}
                className="btn-primary flex items-center"
              >
                <MapPin className="h-4 w-4 mr-2" />
                {showMap ? 'Hide Map' : 'Show Map'}
              </button>
            </div>
          </div>

          {/* Filter */}
          <div className="mt-4 flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-600" />
            <select
              className="input-field py-2"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="KSRTC">KSRTC</option>
              <option value="Private">Private</option>
              <option value="Fast">Fast</option>
              <option value="Super Fast">Super Fast</option>
              <option value="Ordinary">Ordinary</option>
            </select>
          </div>
        </div>
      </div>

      {/* Map View */}
      {showMap && (
        <div className="mb-6 animate-slide-up">
          <RouteMap from={from} to={to} results={filteredResults} />
        </div>
      )}

      {/* Results */}
      <div className="space-y-6">
        {loading ? (
          <div className="card text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Searching for buses...</p>
          </div>
        ) : filteredResults.length === 0 ? (
          <div className="card text-center py-12">
            <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Buses Found</h3>
            <p className="text-gray-600 mb-4">
              We couldn't find any buses for this route. Please try a different search.
            </p>
            <button onClick={() => navigate('/')} className="btn-primary">
              New Search
            </button>
          </div>
        ) : (
          filteredResults.map((result, index) => (
            <BusCard key={index} result={result} />
          ))
        )}
      </div>

      {/* Additional Info */}
      {filteredResults.length > 0 && (
        <div className="mt-8 card bg-blue-50 border-2 border-blue-200">
          <div className="flex items-start">
            <TrendingUp className="h-6 w-6 text-blue-600 mr-3 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Travel Tips</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Arrive at the bus stop 5-10 minutes before scheduled time</li>
                <li>• Keep exact change ready for faster boarding</li>
                <li>• Check for alternative routes during peak hours</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
