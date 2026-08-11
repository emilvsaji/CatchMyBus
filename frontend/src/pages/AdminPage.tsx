import { useState, useEffect } from 'react';
import { Plus, Bus, Save, AlertCircle, X, Edit2, Trash2, Search, Copy, Inbox, Check, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../config/api';
import { useAuth } from '../contexts/AuthContext';
import { BusRequest } from '../types';

interface StopTiming {
  stopName: string;
  times: { arrivalTime: string; period: 'AM' | 'PM' }[];
}

interface BusData {
  id: string;
  busNumber?: string;
  busName: string;
  from: string;
  via: string;
  to: string;
  type: string;
  route: string[];
  timings: Array<{ stop?: string; stopName?: string; time?: string; arrivalTime?: string; departureTime?: string }>;
}

const getBadgeClass = (type: string): string => {
  switch (type) {
    case 'KSRTC':      return 'badge-ksrtc';
    case 'Private':    return 'badge-private';
    case 'Fast':       return 'badge-fast';
    case 'Super Fast': return 'badge-superfast';
    default:           return 'badge-ordinary';
  }
};

const normalizeStop = (s: string) =>
  (s || '')
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const isStopMatch = (stopCandidate: string, targetQuery: string): boolean => {
  const normCandidate = normalizeStop(stopCandidate);
  const normTarget = normalizeStop(targetQuery);
  if (!normCandidate || !normTarget) return false;
  if (normCandidate === normTarget) return true;
  const wordRegex = new RegExp(`(^|\\s)${normTarget}(\\s|$)`, 'i');
  if (wordRegex.test(normCandidate)) return true;
  const reverseWordRegex = new RegExp(`(^|\\s)${normCandidate}(\\s|$)`, 'i');
  if (reverseWordRegex.test(normTarget)) return true;
  return false;
};

const AdminPage = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'buses' | 'stops' | 'requests'>('buses');
  const [busForm, setBusForm] = useState({
    busName: '',
    busNumber: '',
    from: '',
    via: '',
    to: '',
    type: 'Private',
  });
  const [stopTimings, setStopTimings] = useState<StopTiming[]>([
    { stopName: '', times: [{ arrivalTime: '', period: 'AM' }] }
  ]);
  const [pasteStopsText, setPasteStopsText] = useState('');
  
  const [allBuses, setAllBuses] = useState<BusData[]>([]);
  const [editingBus, setEditingBus] = useState<BusData | null>(null);
  const [isLoadingBuses, setIsLoadingBuses] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Route Import Picker State
  const [showRoutePicker, setShowRoutePicker] = useState(false);
  const [routePickerMatches, setRoutePickerMatches] = useState<BusData[]>([]);

  // Bus Requests State
  const [busRequests, setBusRequests] = useState<BusRequest[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [expandedRequestId, setExpandedRequestId] = useState<string | null>(null);

  // Fetch all buses and pending requests on mount
  useEffect(() => {
    fetchAllBuses();
    fetchBusRequests();
  }, []);

  // Refresh when switching tabs
  useEffect(() => {
    if (activeTab === 'stops') {
      fetchAllBuses();
    } else if (activeTab === 'requests') {
      fetchBusRequests();
    }
  }, [activeTab]);

  const fetchBusRequests = async () => {
    setIsLoadingRequests(true);
    try {
      const response = await api.get('/api/bus-requests?status=pending');
      setBusRequests(response.data.data || []);
    } catch (error) {
      console.error('Error fetching bus requests:', error);
    } finally {
      setIsLoadingRequests(false);
    }
  };

  const handleApproveRequest = async (requestId: string) => {
    setApprovingId(requestId);
    try {
      await api.put(`/api/bus-requests/${requestId}/approve`, {
        adminEmail: currentUser?.email || 'admin@catchmybus.com',
      });
      toast.success('Bus approved and published to live listings!');
      setBusRequests(prev => prev.filter(r => r.id !== requestId));
      fetchAllBuses();
    } catch (error: any) {
      console.error('Error approving request:', error);
      toast.error(error.response?.data?.error || 'Failed to approve request');
    } finally {
      setApprovingId(null);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      await api.put(`/api/bus-requests/${requestId}/reject`, {
        rejectionReason: rejectReason.trim(),
        adminEmail: currentUser?.email || 'admin@catchmybus.com',
      });
      toast.success('Bus suggestion rejected');
      setBusRequests(prev => prev.filter(r => r.id !== requestId));
      setRejectingId(null);
      setRejectReason('');
    } catch (error: any) {
      console.error('Error rejecting request:', error);
      toast.error(error.response?.data?.error || 'Failed to reject request');
    }
  };

  const fetchAllBuses = async () => {
    setIsLoadingBuses(true);
    try {
      const response = await api.get('/api/admin/buses');
      setAllBuses(response.data.data || []);
    } catch (error) {
      console.error('Error fetching buses:', error);
      toast.error('Failed to load buses');
    } finally {
      setIsLoadingBuses(false);
    }
  };

  const handleEditBus = (bus: BusData) => {
    setEditingBus(bus);
    
    // Parse timings back into form format
    const grouped: Record<string, { arrivalTime: string; period: 'AM' | 'PM' }[]> = {};
    for (const timing of bus.timings || []) {
      const stopKey = (timing.stop || timing.stopName || '').trim();
      const timeRaw = timing.time || timing.arrivalTime || timing.departureTime || '';
      const parts = (timeRaw || '').trim().split(/\s+/);
      const time = parts[0] || '';
      const period = (parts[1] || 'AM') as 'AM' | 'PM';
      if (!grouped[stopKey]) grouped[stopKey] = [];
      grouped[stopKey].push({ arrivalTime: time, period });
    }
    const parsedTimings: StopTiming[] = (bus.route || []).map(stop => {
      const stopStr = typeof stop === 'string' ? stop : (stop as any)?.name || (stop as any)?.stopName || '';
      return {
        stopName: stopStr,
        times: grouped[stopStr] && grouped[stopStr].length > 0
          ? grouped[stopStr]
          : [{ arrivalTime: '', period: 'AM' as 'AM' | 'PM' }]
      };
    });
    
    setBusForm({
      busName: (bus.busName || '').toUpperCase(),
      busNumber: (bus as any).busNumber || '',
      from: bus.from,
      via: bus.via || '',
      to: bus.to,
      type: bus.type,
    });
    setStopTimings(parsedTimings.length > 0 ? parsedTimings : [{ stopName: '', times: [{ arrivalTime: '', period: 'AM' }] }]);
    setPasteStopsText('');
  };

  const handleUpdateBus = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingBus) return;
    
    if (!busForm.busName.trim()) {
      toast.error('Please enter a bus name');
      return;
    }
    if (!busForm.from.trim() || !busForm.to.trim()) {
      toast.error('Please enter From and To stops');
      return;
    }

    const validStops = stopTimings.map(st => st.stopName.trim()).filter(Boolean);
    if (validStops.length < 2) {
      toast.error('Please provide at least 2 stops for the route');
      return;
    }

    // Optional timings: only include non-empty times
    const formattedTimings = stopTimings.flatMap(st => {
      const sName = st.stopName.trim();
      if (!sName) return [];
      return st.times
        .filter(t => t.arrivalTime && t.arrivalTime.trim())
        .map(t => ({
          stopName: sName,
          arrivalTime: `${t.arrivalTime.trim()} ${t.period}`,
          departureTime: `${t.arrivalTime.trim()} ${t.period}`,
        }));
    });

    const busData = {
      busName: busForm.busName.toUpperCase().trim(),
      busNumber: busForm.busNumber.trim(),
      from: busForm.from.trim(),
      via: busForm.via.trim(),
      to: busForm.to.trim(),
      type: busForm.type,
      route: validStops,
      timings: formattedTimings,
    };
    
    try {
      await api.put(`/api/admin/buses/${editingBus.id}`, busData);
      toast.success('Bus updated successfully!');
      setEditingBus(null);
      setBusForm({ busName: '', busNumber: '', from: '', via: '', to: '', type: 'Private' });
      setStopTimings([{ stopName: '', times: [{ arrivalTime: '', period: 'AM' }] }]);
      setPasteStopsText('');
      fetchAllBuses();
    } catch (error: any) {
      console.error('Error updating bus:', error);
      toast.error(error.response?.data?.error || 'Failed to update bus');
    }
  };

  const handleDeleteBus = async (busId: string, busName: string) => {
    if (!confirm(`Are you sure you want to delete "${busName}"?`)) {
      return;
    }
    
    try {
      await api.delete(`/api/admin/buses/${busId}`);
      toast.success('Bus deleted successfully!');
      fetchAllBuses();
    } catch (error) {
      console.error('Error deleting bus:', error);
      toast.error('Failed to delete bus');
    }
  };

  const handleDuplicateBus = (bus: BusData) => {
    // Prefill the Add Bus form with a copy of the selected bus (do not set editingBus)
    const grouped: Record<string, { arrivalTime: string; period: 'AM' | 'PM' }[]> = {};
    for (const timing of bus.timings || []) {
      const stopKey = (timing.stop || timing.stopName || '').trim();
      const timeRaw = timing.time || timing.arrivalTime || timing.departureTime || '';
      const parts = (timeRaw || '').trim().split(/\s+/);
      const time = parts[0] || '';
      const period = (parts[1] || 'AM') as 'AM' | 'PM';
      if (!grouped[stopKey]) grouped[stopKey] = [];
      grouped[stopKey].push({ arrivalTime: time, period });
    }
    const parsedTimings: StopTiming[] = (bus.route || []).map(stop => {
      const stopStr = typeof stop === 'string' ? stop : (stop as any)?.name || (stop as any)?.stopName || '';
      return {
        stopName: stopStr,
        times: grouped[stopStr] && grouped[stopStr].length > 0
          ? grouped[stopStr]
          : [{ arrivalTime: '', period: 'AM' as 'AM' | 'PM' }]
      };
    });

    setEditingBus(null);
    setActiveTab('buses');
    setBusForm({
      busName: `${(bus.busName || '').toUpperCase()} (COPY)`,
      busNumber: (bus as any).busNumber || '',
      from: bus.from,
      via: bus.via || '',
      to: bus.to,
      type: bus.type,
    });
    setStopTimings(parsedTimings.length > 0 ? parsedTimings : [{ stopName: '', times: [{ arrivalTime: '', period: 'AM' }] }]);
    setPasteStopsText('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingBus(null);
    setBusForm({ busName: '', busNumber: '', from: '', via: '', to: '', type: 'Private' });
    setStopTimings([{ stopName: '', times: [{ arrivalTime: '', period: 'AM' }] }]);
    setPasteStopsText('');
  };

  // Import stops from an existing route based on From / Via / To
  const handleImportRouteStops = () => {
    const fromQuery = busForm.from.trim();
    const toQuery = busForm.to.trim();
    const viaQuery = busForm.via.trim();

    if (!fromQuery || !toQuery) {
      toast.error('Please enter From and To stops to search for existing routes');
      return;
    }

    const matches = allBuses.filter(bus => {
      const route = Array.isArray(bus.route) ? bus.route : [];
      const busFrom = bus.from || (route.length > 0 ? route[0] : '');
      const busTo = bus.to || (route.length > 0 ? route[route.length - 1] : '');

      const matchFrom = isStopMatch(busFrom, fromQuery) || route.some(s => isStopMatch(s, fromQuery));
      const matchTo = isStopMatch(busTo, toQuery) || route.some(s => isStopMatch(s, toQuery));
      if (!matchFrom || !matchTo) return false;

      if (viaQuery) {
        const matchVia = (bus.via && isStopMatch(bus.via, viaQuery)) || route.some(s => isStopMatch(s, viaQuery));
        if (!matchVia) return false;
      }

      return route.length >= 2;
    });

    if (matches.length === 0) {
      toast.error('No existing route found for these stops');
      return;
    }

    if (matches.length === 1) {
      selectImportedRoute(matches[0]);
      return;
    }

    // Multiple matches: show picker modal
    setRoutePickerMatches(matches);
    setShowRoutePicker(true);
  };

  const selectImportedRoute = (bus: BusData) => {
    const route = Array.isArray(bus.route) ? bus.route : [];
    if (route.length === 0) {
      toast.error('Selected bus has no stops defined');
      setShowRoutePicker(false);
      return;
    }

    const newStopTimings: StopTiming[] = route.map(s => {
      const stopName = typeof s === 'string' ? s : (s as any)?.name || (s as any)?.stopName || String(s);
      return {
        stopName,
        times: [{ arrivalTime: '', period: 'AM' }]
      };
    });

    setStopTimings(newStopTimings);
    setShowRoutePicker(false);
    toast.success(`Imported ${newStopTimings.length} stops from "${bus.busName}"`);
  };

  // Filter buses based on search query
  const filteredBuses = allBuses.filter(bus => {
    const query = searchQuery.toLowerCase();
    return (
      bus.busName.toLowerCase().includes(query) ||
      (bus.busNumber || '').toLowerCase().includes(query) ||
      bus.from.toLowerCase().includes(query) ||
      bus.to.toLowerCase().includes(query) ||
      (bus.via && bus.via.toLowerCase().includes(query)) ||
      bus.route.some(stop => stop.toLowerCase().includes(query))
    );
  });

  const addStopTimingField = () => {
    setStopTimings([...stopTimings, { stopName: '', times: [{ arrivalTime: '', period: 'AM' }] }]);
  };

  const importPastedStops = () => {
    if (!pasteStopsText || !pasteStopsText.trim()) return;
    const parts = pasteStopsText.split(/[,;\n\r]+/).map(s => s.trim()).filter(Boolean);
    if (parts.length === 0) return;

    const newRows: StopTiming[] = parts.map(p => ({ stopName: p, times: [{ arrivalTime: '', period: 'AM' }] }));
    setStopTimings(newRows);
    setPasteStopsText('');
  };

  const removeStopTimingField = (index: number) => {
    if (stopTimings.length > 1) {
      const updated = stopTimings.filter((_, i) => i !== index);
      setStopTimings(updated);
    }
  };

  const updateStopName = (index: number, value: string) => {
    const updated = [...stopTimings];
    updated[index].stopName = value;
    setStopTimings(updated);
  };

  const updateStopTime = (stopIndex: number, timeIndex: number, field: 'arrivalTime' | 'period', value: string) => {
    const updated = [...stopTimings];
    const times = updated[stopIndex].times;
    if (!times[timeIndex]) return;
    if (field === 'period') {
      times[timeIndex].period = value as 'AM' | 'PM';
    } else {
      times[timeIndex].arrivalTime = value;
    }
    updated[stopIndex].times = times;
    setStopTimings(updated);
  };

  const addTimeForStop = (stopIndex: number) => {
    const updated = [...stopTimings];
    updated[stopIndex].times.push({ arrivalTime: '', period: 'AM' });
    setStopTimings(updated);
  };

  const removeTimeForStop = (stopIndex: number, timeIndex: number) => {
    const updated = [...stopTimings];
    if (updated[stopIndex].times.length <= 1) return;
    updated[stopIndex].times = updated[stopIndex].times.filter((_, i) => i !== timeIndex);
    setStopTimings(updated);
  };

  const handleAddBus = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!busForm.busName.trim()) {
      toast.error('Please enter a bus name');
      return;
    }
    if (!busForm.from.trim() || !busForm.to.trim()) {
      toast.error('Please enter From and To stops');
      return;
    }

    const validStops = stopTimings.map(st => st.stopName.trim()).filter(Boolean);
    if (validStops.length < 2) {
      toast.error('Please provide at least 2 stops for the route');
      return;
    }

    // Optional timings: only include non-empty times
    const formattedTimings = stopTimings.flatMap(st => {
      const sName = st.stopName.trim();
      if (!sName) return [];
      return st.times
        .filter(t => t.arrivalTime && t.arrivalTime.trim())
        .map(t => ({
          stopName: sName,
          arrivalTime: `${t.arrivalTime.trim()} ${t.period}`,
          departureTime: `${t.arrivalTime.trim()} ${t.period}`,
        }));
    });

    const busData = {
      busName: busForm.busName.toUpperCase().trim(),
      busNumber: busForm.busNumber.trim(),
      from: busForm.from.trim(),
      via: busForm.via.trim(),
      to: busForm.to.trim(),
      type: busForm.type,
      route: validStops,
      timings: formattedTimings,
    };
    
    try {
      await api.post('/api/admin/buses', busData);
      toast.success('Bus added successfully!');
      setBusForm({ busName: '', busNumber: '', from: '', via: '', to: '', type: 'Private' });
      setStopTimings([{ stopName: '', times: [{ arrivalTime: '', period: 'AM' }] }]);
      setPasteStopsText('');
      fetchAllBuses();
    } catch (error: any) {
      console.error('❌ Error adding bus:', error);
      if (error.code === 'ERR_NETWORK') {
        toast.error('Network Error: Cannot connect to backend server');
      } else if (error.response) {
        toast.error(error.response?.data?.error || `Server error: ${error.response.status}`);
      } else {
        toast.error(error.message || 'Failed to add bus');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Panel</h1>
          <p className="text-gray-600">Manage buses and stops in the system</p>
        </div>

        {/* Warning */}
        <div className="card bg-yellow-50 border-2 border-yellow-300 mb-6">
          <div className="flex items-start">
            <AlertCircle className="h-6 w-6 text-yellow-600 mr-3 mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Admin Access</h3>
              <p className="text-sm text-gray-700">
                This panel is for administrators only. All changes will be immediately
                visible to users.
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <button
            onClick={() => {
              setEditingBus(null);
              setActiveTab('buses');
            }}
            className={`flex items-center px-4 py-2.5 rounded-lg font-medium transition-colors text-sm min-h-0 ${
              activeTab === 'buses'
                ? 'bg-navy-800 text-white'
                : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Add Bus
          </button>
          <button
            onClick={() => {
              setEditingBus(null);
              setActiveTab('stops');
            }}
            className={`flex items-center px-4 py-2.5 rounded-lg font-medium transition-colors text-sm min-h-0 ${
              activeTab === 'stops'
                ? 'bg-navy-800 text-white'
                : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            <Bus className="h-4 w-4 mr-1.5" />
            Manage Buses
          </button>
          <button
            onClick={() => {
              setEditingBus(null);
              setActiveTab('requests');
              fetchBusRequests();
            }}
            className={`flex items-center px-4 py-2.5 rounded-lg font-medium transition-colors text-sm min-h-0 ${
              activeTab === 'requests'
                ? 'bg-navy-800 text-white'
                : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            <Inbox className="h-4 w-4 mr-1.5" />
            New bus requests
            {busRequests.length > 0 && (
              <span className="ml-2 px-1.5 py-0.5 text-2xs font-bold rounded-full bg-amber-400 text-navy-800">
                {busRequests.length}
              </span>
            )}
          </button>
        </div>

        {/* Bus Form */}
        {activeTab === 'buses' && (
          <div className="transit-card p-6 animate-slide-up">
            <form onSubmit={handleAddBus} className="space-y-6">
              {/* Bus Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bus Name *
                </label>
                <input
                  type="text"
                  className="input-field uppercase tracking-wide"
                  placeholder="e.g., TRIVANDRUM - KOCHI EXPRESS"
                  value={busForm.busName}
                  onChange={(e) => setBusForm({ ...busForm, busName: e.target.value.toUpperCase() })}
                  required
                />
              </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Number</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g., KL-05-AB-1234"
                    value={busForm.busNumber}
                    onChange={(e) => setBusForm({ ...busForm, busNumber: e.target.value })}
                  />
                </div>
              

              {/* From → Via → To */}
              <div>
                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Route Details *
                  </label>
                  <button
                    type="button"
                    onClick={handleImportRouteStops}
                    className="btn-ghost text-xs py-1 px-2.5 min-h-0 flex items-center gap-1.5 text-neutral-600 hover:text-navy-800 border-neutral-200"
                    title="Import stops from an existing route matching these corridor endpoints"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Import stops from existing route
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Enter starting stop"
                      value={busForm.from}
                      onChange={(e) => setBusForm({ ...busForm, from: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Enter via stop (optional)"
                      value={busForm.via}
                      onChange={(e) => setBusForm({ ...busForm, via: e.target.value })}
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Enter destination stop"
                      value={busForm.to}
                      onChange={(e) => setBusForm({ ...busForm, to: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  From → Via → To (Via is optional)
                </p>
              </div>

              {/* Bus Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bus Type *
                </label>
                <select
                  className="input-field"
                  value={busForm.type}
                  onChange={(e) => setBusForm({ ...busForm, type: e.target.value })}
                  required
                >
                  <option value="Private">Private</option>
                  <option value="KSRTC">KSRTC</option>
                  <option value="Fast">Fast</option>
                  <option value="Super Fast">Super Fast</option>
                  <option value="Ordinary">Ordinary</option>
                </select>
              </div>

              {/* Stop Name and Time Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Stops and Timings <span className="text-xs font-normal text-neutral-400">(timings optional)</span>
                </label>
                
                <div className="mb-3">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Paste stops (comma / newline separated)</label>
                  <div className="flex gap-2">
                    <input
                      value={pasteStopsText}
                      onChange={(e) => setPasteStopsText(e.target.value)}
                      placeholder="e.g., Pala, Pravithanam, Kollapally"
                      className="input-field flex-1"
                    />
                    <button type="button" onClick={importPastedStops} className="btn-primary px-3">Add</button>
                  </div>
                </div>

                <div className="space-y-3">
                  {stopTimings.map((stopTiming, index) => (
                    <div key={index} className="flex gap-3 items-start">
                      <div className="flex-1">
                        <input
                          type="text"
                          className="input-field"
                          placeholder="Enter stop name"
                          value={stopTiming.stopName}
                          onChange={(e) => updateStopName(index, e.target.value)}
                          required
                        />

                        <div className="mt-2 space-y-2">
                          {stopTiming.times.map((t, ti) => (
                            <div key={ti} className="flex items-center gap-2">
                              <input
                                type="text"
                                className="input-field w-32"
                                placeholder="HH:MM"
                                value={t.arrivalTime}
                                onChange={(e) => {
                                  let value = e.target.value.replace(/[^0-9]/g, '');
                                  if (value.length >= 2) {
                                    value = value.slice(0, 2) + ':' + value.slice(2, 4);
                                  }
                                  updateStopTime(index, ti, 'arrivalTime', value);
                                }}
                                maxLength={5}
                              />
                              <select
                                className="input-field w-24"
                                value={t.period}
                                onChange={(e) => updateStopTime(index, ti, 'period', e.target.value)}
                              >
                                <option value="AM">AM</option>
                                <option value="PM">PM</option>
                              </select>
                              {stopTiming.times.length > 1 && (
                                <button type="button" onClick={() => removeTimeForStop(index, ti)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Remove time">
                                  <X className="h-5 w-5" />
                                </button>
                              )}
                            </div>
                          ))}

                          <button type="button" onClick={() => addTimeForStop(index)} className="text-sm text-primary-600">
                            + Add time
                          </button>
                        </div>
                      </div>

                      {stopTimings.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeStopTimingField(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove stop"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add Stop Button */}
                <button
                  type="button"
                  onClick={addStopTimingField}
                  className="mt-3 flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
                >
                  <Plus className="h-5 w-5" />
                  Add Another Stop
                </button>
              </div>

              {/* Submit Button */}
              <button type="submit" className="btn-primary w-full">
                <Save className="h-5 w-5 inline mr-2" />
                Add Bus
              </button>
            </form>
          </div>
        )}

        {/* Stop Form */}
        {activeTab === 'stops' && (
          <div className="space-y-6 animate-slide-up">
            {/* Edit Form (if editing) */}
            {editingBus && (
              <div className="card">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Edit Bus</h2>
                  <button
                    onClick={handleCancelEdit}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleUpdateBus} className="space-y-6">
                  {/* Bus Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bus Name *
                    </label>
                    <input
                      type="text"
                      className="input-field uppercase tracking-wide"
                      placeholder="e.g., TRIVANDRUM - KOCHI EXPRESS"
                      value={busForm.busName}
                      onChange={(e) => setBusForm({ ...busForm, busName: e.target.value.toUpperCase() })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Number</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="e.g., KL-05-AB-1234"
                      value={busForm.busNumber}
                      onChange={(e) => setBusForm({ ...busForm, busNumber: e.target.value })}
                    />
                  </div>

                  {/* From → Via → To */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Route Details *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <input
                          type="text"
                          className="input-field"
                          placeholder="Enter starting stop"
                          value={busForm.from}
                          onChange={(e) => setBusForm({ ...busForm, from: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          className="input-field"
                          placeholder="Enter via stop (optional)"
                          value={busForm.via}
                          onChange={(e) => setBusForm({ ...busForm, via: e.target.value })}
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          className="input-field"
                          placeholder="Enter destination stop"
                          value={busForm.to}
                          onChange={(e) => setBusForm({ ...busForm, to: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bus Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bus Type *
                    </label>
                    <select
                      className="input-field"
                      value={busForm.type}
                      onChange={(e) => setBusForm({ ...busForm, type: e.target.value })}
                      required
                    >
                      <option value="Private">Private</option>
                      <option value="KSRTC">KSRTC</option>
                      <option value="Fast">Fast</option>
                      <option value="Super Fast">Super Fast</option>
                      <option value="Ordinary">Ordinary</option>
                    </select>
                  </div>

                  {/* Stop Name and Time Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Stops and Timings <span className="text-xs font-normal text-neutral-400">(timings optional)</span>
                    </label>
                    
                    <div className="mb-3">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Paste stops (comma / newline separated)</label>
                      <div className="flex gap-2">
                        <input
                          value={pasteStopsText}
                          onChange={(e) => setPasteStopsText(e.target.value)}
                          placeholder="e.g., Pala, Pravithanam, Kollapally"
                          className="input-field flex-1"
                        />
                        <button type="button" onClick={importPastedStops} className="btn-primary px-3">Add</button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {stopTimings.map((stopTiming, index) => (
                        <div key={index} className="flex gap-3 items-start">
                          <div className="flex-1">
                            <input
                              type="text"
                              className="input-field"
                              placeholder="Enter stop name"
                              value={stopTiming.stopName}
                              onChange={(e) => updateStopName(index, e.target.value)}
                              required
                            />

                            <div className="mt-2 space-y-2">
                              {stopTiming.times.map((t, ti) => (
                                <div key={ti} className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    className="input-field w-32"
                                    placeholder="HH:MM"
                                    value={t.arrivalTime}
                                    onChange={(e) => {
                                      let value = e.target.value.replace(/[^0-9]/g, '');
                                      if (value.length >= 2) {
                                        value = value.slice(0, 2) + ':' + value.slice(2, 4);
                                      }
                                      updateStopTime(index, ti, 'arrivalTime', value);
                                    }}
                                    maxLength={5}
                                  />
                                  <select
                                    className="input-field w-24"
                                    value={t.period}
                                    onChange={(e) => updateStopTime(index, ti, 'period', e.target.value)}
                                  >
                                    <option value="AM">AM</option>
                                    <option value="PM">PM</option>
                                  </select>
                                  {stopTiming.times.length > 1 && (
                                    <button type="button" onClick={() => removeTimeForStop(index, ti)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Remove time">
                                      <X className="h-5 w-5" />
                                    </button>
                                  )}
                                </div>
                              ))}

                              <button type="button" onClick={() => addTimeForStop(index)} className="text-sm text-primary-600">
                                + Add time
                              </button>
                            </div>
                          </div>

                          {stopTimings.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeStopTimingField(index)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Remove stop"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={addStopTimingField}
                      className="mt-3 flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
                    >
                      <Plus className="h-5 w-5" />
                      Add Another Stop
                    </button>
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-3">
                    <button type="submit" className="btn-primary flex-1">
                      <Save className="h-5 w-5 inline mr-2" />
                      Update Bus
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* List All Buses */}
            {!editingBus && (
              <div className="transit-card p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Manage Buses</h2>
                    <p className="text-xs text-neutral-500 mt-0.5">View and edit configured bus schedules</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingBus(null);
                      setActiveTab('buses');
                    }}
                    className="btn-amber text-xs py-2 px-3 flex items-center gap-1.5 min-h-0"
                  >
                    <Plus className="h-4 w-4" />
                    Add Bus
                  </button>
                </div>
                
                {/* Search Bar */}
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      className="input-field pl-10"
                      placeholder="Search by bus name, route, or stops..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  {searchQuery && (
                    <p className="text-sm text-gray-600 mt-2">
                      Found {filteredBuses.length} bus{filteredBuses.length !== 1 ? 'es' : ''}
                    </p>
                  )}
                </div>
                
                {isLoadingBuses ? (
                  <div className="text-center py-8 text-gray-600">Loading buses...</div>
                ) : allBuses.length === 0 ? (
                  <div className="text-center py-8 text-gray-600">No buses added yet.</div>
                ) : filteredBuses.length === 0 ? (
                  <div className="text-center py-8 text-gray-600">
                    No buses match your search.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredBuses.map((bus) => (
                      <div
                        key={bus.id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-navy-400 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2 uppercase tracking-wide">
                              {bus.busName}
                            </h3>
                            <div className="text-sm text-gray-600 space-y-1">
                              <p>
                                <span className="font-medium">Route:</span> {bus.from}
                                {bus.via && ` → ${bus.via}`} → {bus.to}
                              </p>
                              <p>
                                <span className="font-medium">Vehicle No:</span> {bus.busNumber || '—'}
                              </p>
                              <p>
                                <span className="font-medium">Type:</span> {bus.type}
                              </p>
                              <p>
                                <span className="font-medium">Stops:</span> {bus.route.length} stops
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => handleEditBus(bus)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit bus"
                            >
                              <Edit2 className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDuplicateBus(bus)}
                              className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                              title="Duplicate bus"
                            >
                              <Copy className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteBus(bus.id, bus.busName)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete bus"
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
            )}
          </div>
        )}

        {/* Bus Requests Tab */}
        {activeTab === 'requests' && (
          <div className="space-y-6 animate-slide-up">
            <div className="transit-card p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">New Bus Requests</h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Review and verify community-submitted bus schedules before publishing live
                  </p>
                </div>
                <button
                  onClick={fetchBusRequests}
                  className="btn-ghost text-xs py-2 px-3 flex items-center gap-1.5 min-h-0"
                >
                  Refresh
                </button>
              </div>

              {isLoadingRequests ? (
                <div className="text-center py-10 text-neutral-500">
                  <div className="inline-block w-7 h-7 border-2 border-navy-800/20 border-t-navy-800 rounded-full animate-spin mb-2" />
                  <p className="text-xs">Loading requests…</p>
                </div>
              ) : busRequests.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-neutral-200 rounded-lg">
                  <Inbox className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-neutral-700">No pending bus requests</p>
                  <p className="text-xs text-neutral-400 mt-1">
                    All community suggestions have been reviewed. New suggestions will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {busRequests.map((req) => {
                    const isExpanded = expandedRequestId === req.id;
                    const isRejecting = rejectingId === req.id;
                    const isApproving = approvingId === req.id;
                    const formattedDate = req.createdAt?.toDate
                      ? req.createdAt.toDate().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                      : req.createdAt
                        ? new Date(req.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                        : 'Recent';

                    return (
                      <div
                        key={req.id}
                        className="border border-neutral-200 rounded-lg overflow-hidden bg-white shadow-transit hover:border-neutral-300 transition-all"
                      >
                        <div className="p-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          {/* Left: Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                              <span className={`transit-badge ${getBadgeClass(req.type)}`}>
                                {req.type}
                              </span>
                              {req.busNumber && (
                                <span className="text-2xs text-neutral-400 tabular-nums font-mono">
                                  {req.busNumber}
                                </span>
                              )}
                              <span className="text-2xs text-neutral-400">
                                Submitted {formattedDate}
                              </span>
                            </div>

                            <h3 className="text-base font-bold text-neutral-800 uppercase tracking-wide leading-tight mb-1">
                              {req.busName}
                            </h3>

                            <div className="text-xs text-neutral-600 space-y-1">
                              <p>
                                <span className="font-medium text-neutral-500">Route:</span>{' '}
                                <span className="font-semibold text-neutral-800">{req.from}</span>
                                {req.via && ` → ${req.via}`} →{' '}
                                <span className="font-semibold text-neutral-800">{req.to}</span>
                              </p>
                              <p>
                                <span className="font-medium text-neutral-500">Submitted by:</span>{' '}
                                <span className="text-neutral-700">
                                  {req.submittedByName ? `${req.submittedByName} (${req.submittedByEmail || 'No email'})` : (req.submittedByEmail || 'Anonymous user')}
                                  {req.submittedByPhone && <span className="text-neutral-500 ml-1.5 font-mono">· 📞 {req.submittedByPhone}</span>}
                                </span>
                              </p>
                            </div>
                          </div>

                          {/* Right: Actions */}
                          <div className="flex flex-row sm:flex-col items-end gap-2 flex-shrink-0">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleApproveRequest(req.id)}
                                disabled={isApproving}
                                className="btn-amber text-xs px-3.5 py-1.5 min-h-0 flex items-center gap-1 shadow-sm"
                                title="Publish this bus to live listings"
                              >
                                {isApproving ? (
                                  <div className="w-3.5 h-3.5 border-2 border-navy-800 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <Check className="w-3.5 h-3.5" />
                                )}
                                <span>Approve</span>
                              </button>

                              <button
                                onClick={() => {
                                  setRejectingId(isRejecting ? null : req.id);
                                  setRejectReason('');
                                }}
                                className="btn-ghost text-xs px-3 py-1.5 min-h-0 text-neutral-600 hover:text-red-700 hover:bg-red-50 hover:border-red-200"
                                title="Reject this suggestion"
                              >
                                Reject
                              </button>
                            </div>

                            <button
                              onClick={() => setExpandedRequestId(isExpanded ? null : req.id)}
                              className="text-2xs text-neutral-500 hover:text-navy-800 flex items-center gap-1 mt-1 min-h-0"
                            >
                              <span>{req.route?.length || 0} stops & timings</span>
                              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>

                        {/* Inline Reject Reason Drawer */}
                        {isRejecting && (
                          <div className="px-4 py-3 bg-red-50/50 border-t border-red-100 flex flex-col sm:flex-row items-center gap-2 animate-slide-down">
                            <input
                              type="text"
                              placeholder="Optional rejection reason (e.g. Duplicate route or invalid timings)"
                              value={rejectReason}
                              onChange={(e) => setRejectReason(e.target.value)}
                              className="input-field text-xs flex-1 bg-white"
                            />
                            <div className="flex gap-2 w-full sm:w-auto">
                              <button
                                onClick={() => handleRejectRequest(req.id)}
                                className="px-3 py-2 bg-red-600 text-white rounded text-xs font-semibold hover:bg-red-700 transition-colors flex-1 sm:flex-none"
                              >
                                Confirm Reject
                              </button>
                              <button
                                onClick={() => setRejectingId(null)}
                                className="px-3 py-2 bg-white border border-neutral-200 text-neutral-600 rounded text-xs hover:bg-neutral-50 flex-1 sm:flex-none"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Expandable Stops and Timings Breakdown */}
                        {isExpanded && (
                          <div className="border-t border-neutral-100 px-4 py-3 bg-neutral-50/50 text-xs">
                            <p className="font-semibold text-neutral-700 mb-2">Configured Stops & Scheduled Times:</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                              {req.route.map((stopName, idx) => {
                                const stopTiming = req.timings?.find((t: any) => (t.stopName || t.stop) === stopName) || req.timings?.[idx];
                                const timeStr = stopTiming?.arrivalTime || stopTiming?.time || stopTiming?.departureTime || '—';
                                return (
                                  <div key={idx} className="bg-white border border-neutral-200 rounded p-2 flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-1.5 min-w-0">
                                      <span className="w-4 h-4 rounded-full bg-navy-800/10 text-navy-800 text-2xs font-bold flex items-center justify-center flex-shrink-0">
                                        {idx + 1}
                                      </span>
                                      <span className="truncate font-medium text-neutral-800">{stopName}</span>
                                    </div>
                                    <span className="tabular-nums font-semibold text-neutral-600 flex-shrink-0 text-2xs">
                                      {timeStr}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Route Picker Modal (when multiple existing routes match) */}
        {showRoutePicker && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-xl shadow-transit-md border border-neutral-200 max-w-lg w-full p-6 animate-slide-up">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-neutral-800">Select Route to Import</h3>
                  <p className="text-xs text-neutral-500">Multiple existing buses match this corridor. Choose which stops list to copy.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowRoutePicker(false)}
                  className="p-1 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors min-h-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {routePickerMatches.map(bus => (
                  <button
                    key={bus.id}
                    type="button"
                    onClick={() => selectImportedRoute(bus)}
                    className="w-full text-left p-3 rounded-lg border border-neutral-200 hover:border-navy-800 hover:bg-neutral-50 transition-colors flex items-center justify-between gap-3 min-h-0"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm text-neutral-800 truncate uppercase">
                          {bus.busName}
                        </span>
                        <span className={`transit-badge ${getBadgeClass(bus.type)}`}>
                          {bus.type}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 truncate">
                        {Array.isArray(bus.route) ? bus.route.join(' → ') : `${bus.from} → ${bus.to}`}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-navy-800 flex-shrink-0 bg-neutral-100 px-2 py-1 rounded">
                      {Array.isArray(bus.route) ? bus.route.length : 0} stops
                    </span>
                  </button>
                ))}
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowRoutePicker(false)}
                  className="btn-ghost text-xs py-2 px-4"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
