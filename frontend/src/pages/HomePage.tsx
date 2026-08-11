import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Navigation, Clock, Map, Bookmark } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../config/api';
import { BusResult } from '../types';
import BusCard from '../components/BusCard';
import AutocompleteInput from '../components/AutocompleteInput';

const FEATURE_ITEMS = [
  {
    icon: <Clock className="w-5 h-5 text-amber-400" strokeWidth={1.8} />,
    title: 'Arrival times',
    description: 'See departure and arrival times for any route between two Kerala bus stops.',
  },
  {
    icon: <Map className="w-5 h-5 text-amber-400" strokeWidth={1.8} />,
    title: 'Route on map',
    description: 'View the full route — origin, intermediate stops, and destination — on a live map.',
  },
  {
    icon: <Bookmark className="w-5 h-5 text-amber-400" strokeWidth={1.8} />,
    title: 'Save routes',
    description: 'Bookmark any result directly from the card so you can re-search it in one tap.',
  },
] as const;

const HomePage = () => {
  const navigate = useNavigate();
  const resultsRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    from:     '',
    to:       '',
    busType:  'all',
    time:     new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
    showAll:  false,
  });
  const [loadingResults, setLoadingResults] = useState(false);
  const [results,        setResults]        = useState<BusResult[]>([]);
  const [stops,          setStops]          = useState<string[]>([]);
  const [loadingStops,   setLoadingStops]   = useState(true);
  const [hasSearched,    setHasSearched]    = useState(false);

  // Fetch stops for autocomplete
  useEffect(() => {
    setLoadingStops(true);
    api.get('/api/buses/stops')
      .then(res => {
        if (res.data.success && Array.isArray(res.data.data)) {
          const names: string[] = Array.from(
            new Set(
              res.data.data
                .map((s: any) => (typeof s === 'string' ? s : s.name || s.stopName || s.stop || ''))
                .map((s: string) => s.trim())
                .filter(Boolean)
            )
          );
          setStops(names);
        }
      })
      .catch((err) => {
        console.warn('Could not fetch stops for autocomplete:', err);
      })
      .finally(() => {
        setLoadingStops(false);
      });
  }, []);

  const scrollToResults = () => {
    setTimeout(() => {
      if (resultsRef.current) {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        resultsRef.current.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          block: 'start',
        });
      }
    }, 100);
  };

  const fetchBusResults = async (from: string, to: string, type: string) => {
    try {
      setLoadingResults(true);
      setHasSearched(true);
      const resp = await api.get('/api/buses/search', {
        params: { from, to, type, time: formData.time, showAll: formData.showAll },
      });
      setResults(resp.data.data || []);
      scrollToResults();
    } catch (err: any) {
      if (err.response) {
        toast.error(`Search failed: ${err.response.status}`);
      } else {
        toast.error('Cannot reach backend — check your connection.');
      }
      setResults([]);
      scrollToResults();
    } finally {
      setLoadingResults(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.from || !formData.to) {
      toast.error('Enter both an origin and a destination');
      return;
    }
    if (formData.from === formData.to) {
      toast.error('Origin and destination cannot be the same');
      return;
    }
    fetchBusResults(formData.from, formData.to, formData.busType);
  };

  const viewAllResults = () => {
    navigate(
      `/search?from=${encodeURIComponent(formData.from)}&to=${encodeURIComponent(formData.to)}&type=${formData.busType}&time=${encodeURIComponent(formData.time)}&showAll=${formData.showAll}`
    );
  };

  return (
    <div className="pb-6 sm:pb-0">
      {/* ── Hero band ─────────────────────────────────────────────────────────── */}
      <section className="bg-navy-800 pt-10 pb-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <p className="section-label text-amber-400/80 mb-3">Kerala Bus Timings</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
            Find buses between{' '}
            <span className="text-amber-400">any two stops</span>
          </h1>
          <p className="mt-3 text-sm text-white/60 leading-relaxed max-w-md mx-auto">
            Timings, fares, and route maps for KSRTC, private, fast, and ordinary bus services
            across Kerala.
          </p>
        </div>
      </section>

      {/* ── Search card (overlapping hero) ────────────────────────────────────── */}
      <section className="max-w-2xl mx-auto px-4 -mt-12">
        <div className="transit-card p-5 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AutocompleteInput
                id="search-from"
                label="From"
                placeholder="Enter starting stop"
                value={formData.from}
                onChange={val => setFormData(f => ({ ...f, from: val }))}
                suggestions={stops}
                isLoading={loadingStops}
                icon={<MapPin className="w-3.5 h-3.5" />}
              />
              <AutocompleteInput
                id="search-to"
                label="To"
                placeholder="Enter destination stop"
                value={formData.to}
                onChange={val => setFormData(f => ({ ...f, to: val }))}
                suggestions={stops}
                isLoading={loadingStops}
                icon={<Navigation className="w-3.5 h-3.5" />}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Time */}
              <div>
                <label
                  htmlFor="search-time"
                  className="block text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-1.5"
                >
                  <Clock className="w-3.5 h-3.5 inline mr-1 opacity-70" />
                  Depart after
                </label>
                <input
                  id="search-time"
                  type="time"
                  className="input-field"
                  value={formData.time}
                  onChange={e => setFormData(f => ({ ...f, time: e.target.value }))}
                />
              </div>

              {/* Bus type */}
              <div>
                <label
                  htmlFor="search-type"
                  className="block text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-1.5"
                >
                  Bus type
                </label>
                <select
                  id="search-type"
                  className="input-field"
                  value={formData.busType}
                  onChange={e => setFormData(f => ({ ...f, busType: e.target.value }))}
                >
                  <option value="all">All buses</option>
                  <option value="KSRTC">KSRTC</option>
                  <option value="Private">Private</option>
                  <option value="Fast">Fast</option>
                  <option value="Super Fast">Super Fast</option>
                  <option value="Ordinary">Ordinary</option>
                </select>
              </div>
            </div>

            {/* Show all toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none min-h-0">
              <input
                id="search-show-all"
                type="checkbox"
                checked={formData.showAll}
                onChange={e => setFormData(f => ({ ...f, showAll: e.target.checked }))}
                className="w-4 h-4 accent-amber-400"
              />
              <span className="text-xs text-neutral-500">
                Show all buses (ignore time)
              </span>
            </label>

            <button
              id="search-submit"
              type="submit"
              className="btn-amber w-full justify-center"
            >
              <Search className="w-4 h-4" />
              Search buses
            </button>
          </form>
        </div>
      </section>

      {/* ── Inline results ─────────────────────────────────────────────────────── */}
      <section ref={resultsRef} className="max-w-2xl mx-auto px-4 mt-6 mb-6">
        {loadingResults && (
          <div className="transit-card px-6 py-10 text-center animate-fade-in">
            <div className="inline-block w-8 h-8 border-2 border-navy-800/20 border-t-navy-800 rounded-full animate-spin mb-3" />
            <p className="text-sm text-neutral-500">Searching…</p>
          </div>
        )}

        {!loadingResults && hasSearched && results.length === 0 && (
          <div className="transit-card px-6 py-10 text-center animate-fade-in">
            <p className="text-sm font-medium text-neutral-700 mb-1">No buses found</p>
            <p className="text-xs text-neutral-400">
              Try adjusting the departure time or bus type filter, or check your stop names.
            </p>
          </div>
        )}

        {!loadingResults && results.length > 0 && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-neutral-700">
                {results.length} bus{results.length !== 1 ? 'es' : ''} found
              </p>
              {results.length > 3 && (
                <button
                  onClick={viewAllResults}
                  className="text-xs font-medium text-navy-800 hover:text-amber-500 transition-colors min-h-0"
                >
                  View all {results.length} →
                </button>
              )}
            </div>

            <div className="space-y-2">
              {results.slice(0, 3).map((r, i) => (
                <BusCard key={i} result={r} />
              ))}
            </div>

            {results.length > 3 && (
              <button
                onClick={viewAllResults}
                className="mt-3 w-full btn-ghost text-sm justify-center"
              >
                View all {results.length} results →
              </button>
            )}
          </div>
        )}
      </section>

      {/* ── Feature strip (Desktop only) ───────────────────────────────────────── */}
      <section
        className="hidden sm:block max-w-2xl mx-auto px-4 mt-12 mb-10"
        aria-label="What CatchMyBus does"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {FEATURE_ITEMS.map(({ icon, title, description }) => (
            <div
              key={title}
              className="flex flex-row sm:flex-col gap-3 sm:gap-2 p-4 border border-neutral-200 rounded-lg bg-white"
            >
              <div className="flex-shrink-0 mt-0.5 sm:mt-0">
                {icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-800 leading-tight">{title}</p>
                <p className="text-xs text-neutral-500 mt-1 leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
