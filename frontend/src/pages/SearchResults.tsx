import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Map, AlertCircle, Filter, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../config/api';
import { BusResult } from '../types';
import BusCard from '../components/BusCard';
import RouteMap from '../components/RouteMap';

const BUS_TYPES = ['all', 'KSRTC', 'Private', 'Fast', 'Super Fast', 'Ordinary'] as const;

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading,      setLoading]      = useState(true);
  const [results,      setResults]      = useState<BusResult[]>([]);
  const [showMap,      setShowMap]      = useState(false);
  const [filterType,   setFilterType]   = useState('all');

  const from = searchParams.get('from') || '';
  const to   = searchParams.get('to')   || '';
  const type = searchParams.get('type') || 'all';

  useEffect(() => {
    fetchBusResults();
    // reset filter when params change
    setFilterType('all');
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

  const filteredResults = filterType === 'all'
    ? results
    : results.filter(r => r.bus.type === filterType);

  return (
    <div className="max-w-4xl mx-auto px-4 pt-6 pb-8">

      {/* ── Back + route header ──────────────────────────────────────────────── */}
      <div className="mb-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-800 transition-colors mb-3 min-h-0"
          aria-label="Back to search"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-lg font-bold text-neutral-800 leading-tight">
              {from} → {to}
            </h1>
            <p className="text-xs text-neutral-400 mt-0.5">
              {loading ? 'Searching…' : `${filteredResults.length} result${filteredResults.length !== 1 ? 's' : ''}`}
            </p>
          </div>
          <button
            id="toggle-map-button"
            onClick={() => setShowMap(v => !v)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors min-h-0 ${
              showMap
                ? 'bg-navy-800 text-white border-navy-800'
                : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300'
            }`}
            aria-pressed={showMap}
          >
            <Map className="w-4 h-4" />
            {showMap ? 'Hide map' : 'Show map'}
          </button>
        </div>
      </div>

      {/* ── Sticky filter bar ────────────────────────────────────────────────── */}
      <div className="sticky-filter-bar -mx-4 px-4 py-2.5 mb-4 flex items-center gap-3">
        <Filter className="w-4 h-4 text-white/50 flex-shrink-0" aria-hidden="true" />
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar flex-1">
          {BUS_TYPES.map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`flex-shrink-0 px-3 py-1 rounded text-xs font-medium transition-colors min-h-0 ${
                filterType === t
                  ? 'bg-amber-400 text-navy-800'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              {t === 'all' ? 'All types' : t}
            </button>
          ))}
        </div>
        {filterType !== 'all' && (
          <button
            onClick={() => setFilterType('all')}
            className="flex-shrink-0 text-white/50 hover:text-white transition-colors min-h-0"
            aria-label="Clear filter"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ── Map view ─────────────────────────────────────────────────────────── */}
      {showMap && !loading && (
        <div className="mb-5 animate-fade-in">
          <RouteMap from={from} to={to} results={filteredResults} />
        </div>
      )}

      {/* ── Results grid ─────────────────────────────────────────────────────── */}
      {loading ? (
        <div className="transit-card px-6 py-12 text-center animate-fade-in">
          <div className="inline-block w-8 h-8 border-2 border-navy-800/20 border-t-navy-800 rounded-full animate-spin mb-3" />
          <p className="text-sm text-neutral-500">Searching for buses…</p>
        </div>
      ) : filteredResults.length === 0 ? (
        <div className="transit-card px-6 py-12 text-center animate-fade-in">
          <AlertCircle className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-neutral-700 mb-1">No buses found</p>
          <p className="text-xs text-neutral-400 mb-4">
            {filterType !== 'all'
              ? `No ${filterType} buses on this route. Try a different bus type.`
              : 'We couldn\'t find buses for this route. Check the stop names or try "Show all buses".'}
          </p>
          <button onClick={() => navigate('/')} className="btn-navy text-sm">
            New search
          </button>
        </div>
      ) : (
        /* Responsive grid: 1-col mobile → 2-col tablet+ */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          {filteredResults.map((result, index) => (
            <BusCard key={index} result={result} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
