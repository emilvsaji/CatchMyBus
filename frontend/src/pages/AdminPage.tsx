import { useState, useEffect } from 'react';
import { Plus, Bus, MapPin, Save, AlertCircle, X, Edit2, Trash2, Search, Copy } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../config/api';

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

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState<'buses' | 'stops'>('buses');
  const [busForm, setBusForm] = useState({
    busName: '',
    busNumber: '',
    from: '',
    via: '',
    to: '',
    type: 'KSRTC',
  });
  const [stopTimings, setStopTimings] = useState<StopTiming[]>([
    { stopName: '', times: [{ arrivalTime: '', period: 'AM' }] }
  ]);
  const [pasteStopsText, setPasteStopsText] = useState('');
  
  const [allBuses, setAllBuses] = useState<BusData[]>([]);
  const [editingBus, setEditingBus] = useState<BusData | null>(null);
  const [isLoadingBuses, setIsLoadingBuses] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch all buses when "Manage Bus" tab is active
  useEffect(() => {
    if (activeTab === 'stops') {
      fetchAllBuses();
    }
  }, [activeTab]);

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
    // Group timings by stop (a bus may have multiple times per stop)
    const grouped: Record<string, { arrivalTime: string; period: 'AM' | 'PM' }[]> = {};
    for (const timing of bus.timings) {
      // Support legacy {stop, time} and newer {stopName, arrivalTime, departureTime}
      const stopKey = (timing.stop || timing.stopName || '').trim();
      const timeRaw = timing.time || timing.arrivalTime || timing.departureTime || '';
      const parts = (timeRaw || '').trim().split(/\s+/);
      const time = parts[0] || '';
      const period = (parts[1] || 'AM') as 'AM' | 'PM';
      if (!grouped[stopKey]) grouped[stopKey] = [];
      grouped[stopKey].push({ arrivalTime: time, period });
    }
    const parsedTimings: StopTiming[] = Object.keys(grouped).map(stop => ({ stopName: stop, times: grouped[stop] }));
    
    setBusForm({
      busName: bus.busName,
      busNumber: (bus as any).busNumber || '',
      from: bus.from,
      via: bus.via || '',
      to: bus.to,
      type: bus.type,
    });
    setStopTimings(parsedTimings);
    setPasteStopsText('');
  };

  const handleUpdateBus = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingBus) return;
    
    const hasEmptyFields = stopTimings.some(st => !st.stopName.trim() || st.times.some(t => !t.arrivalTime.trim()));
    if (hasEmptyFields) {
      toast.error('Please fill all stop names and times');
      return;
    }

    const busData = {
      busName: busForm.busName,
      busNumber: busForm.busNumber,
      from: busForm.from,
      via: busForm.via,
      to: busForm.to,
      type: busForm.type,
      route: stopTimings.map(st => st.stopName.trim()),
      timings: stopTimings.flatMap(st => st.times.map(t => ({ stopName: st.stopName.trim(), arrivalTime: `${t.arrivalTime} ${t.period}`, departureTime: `${t.arrivalTime} ${t.period}` })))
    };
    
    try {
      await api.put(`/api/admin/buses/${editingBus.id}`, busData);
      toast.success('Bus updated successfully!');
      setEditingBus(null);
      setBusForm({ busName: '', busNumber: '', from: '', via: '', to: '', type: 'KSRTC' });
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
    // Group timings by stop
    const grouped: Record<string, { arrivalTime: string; period: 'AM' | 'PM' }[]> = {};
    for (const timing of bus.timings) {
      const stopKey = (timing.stop || timing.stopName || '').trim();
      const timeRaw = timing.time || timing.arrivalTime || timing.departureTime || '';
      const parts = (timeRaw || '').trim().split(/\s+/);
      const time = parts[0] || '';
      const period = (parts[1] || 'AM') as 'AM' | 'PM';
      if (!grouped[stopKey]) grouped[stopKey] = [];
      grouped[stopKey].push({ arrivalTime: time, period });
    }
    const parsedTimings: StopTiming[] = Object.keys(grouped).map(stop => ({ stopName: stop, times: grouped[stop] }));

    setEditingBus(null);
    setActiveTab('buses');
    setBusForm({
      busName: `${bus.busName} (copy)`,
      busNumber: (bus as any).busNumber || '',
      from: bus.from,
      via: bus.via || '',
      to: bus.to,
      type: bus.type,
    });
    setStopTimings(parsedTimings.length > 0 ? parsedTimings : [{ stopName: '', times: [{ arrivalTime: '', period: 'AM' }] }]);
    setPasteStopsText('');
    // Scroll to top so admin can see the Add Bus form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingBus(null);
    setBusForm({ busName: '', busNumber: '', from: '', via: '', to: '', type: 'KSRTC' });
    setStopTimings([{ stopName: '', times: [{ arrivalTime: '', period: 'AM' }] }]);
    setPasteStopsText('');
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

  const importPastedStops = (replace = true) => {
    if (!pasteStopsText || !pasteStopsText.trim()) return;
    // Split on commas, newlines, semicolons
    const parts = pasteStopsText.split(/[,;\n\r]+/).map(s => s.trim()).filter(Boolean);
    if (parts.length === 0) return;

    const newRows: StopTiming[] = parts.map(p => ({ stopName: p, times: [{ arrivalTime: '', period: 'AM' }] }));
    if (replace) setStopTimings(newRows);
    else setStopTimings([...stopTimings, ...newRows]);
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
    
    // Validate that all stops have names and times
    const hasEmptyFields = stopTimings.some(st => !st.stopName.trim() || st.times.some(t => !t.arrivalTime.trim()));
    if (hasEmptyFields) {
      toast.error('Please fill all stop names and times');
      return;
    }

    const busData = {
      busName: busForm.busName,
      busNumber: busForm.busNumber,
      from: busForm.from,
      via: busForm.via,
      to: busForm.to,
      type: busForm.type,
      route: stopTimings.map(st => st.stopName.trim()),
      timings: stopTimings.flatMap(st => st.times.map(t => ({ stopName: st.stopName.trim(), arrivalTime: `${t.arrivalTime} ${t.period}`, departureTime: `${t.arrivalTime} ${t.period}` })))
    };
    
    console.log('Attempting to add bus with data:', busData);
    console.log('API base URL:', api.defaults.baseURL);
    
    try {
      const response = await api.post('/api/admin/buses', busData);
      console.log('✅ Bus added successfully:', response.data);
      toast.success('Bus added successfully!');
      setBusForm({ busName: '', busNumber: '', from: '', via: '', to: '', type: 'KSRTC' });
      setStopTimings([{ stopName: '', times: [{ arrivalTime: '', period: 'AM' }] }]);
      setPasteStopsText('');
    } catch (error: any) {
      console.error('❌ Error adding bus:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response,
        request: error.request,
        config: error.config
      });
      
      if (error.code === 'ERR_NETWORK') {
        toast.error('Network Error: Cannot connect to backend server');
      } else if (error.response) {
        const errorMessage = error.response?.data?.error || `Server error: ${error.response.status}`;
        toast.error(errorMessage);
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
        <div className="flex space-x-2 mb-6">
          <button
            onClick={() => setActiveTab('buses')}
            className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'buses'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Bus className="h-5 w-5 mr-2" />
            Add Bus
          </button>
          <button
            onClick={() => setActiveTab('stops')}
            className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'stops'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <MapPin className="h-5 w-5 mr-2" />
            Manage Bus
          </button>
        </div>

        {/* Bus Form */}
        {activeTab === 'buses' && (
          <div className="card animate-slide-up">
            <form onSubmit={handleAddBus} className="space-y-6">
              {/* Bus Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bus Name *
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g., Trivandrum - Kochi Express"
                  value={busForm.busName}
                  onChange={(e) => setBusForm({ ...busForm, busName: e.target.value })}
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
                      placeholder="From (e.g., Trivandrum)"
                      value={busForm.from}
                      onChange={(e) => setBusForm({ ...busForm, from: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Via (e.g., Kollam)"
                      value={busForm.via}
                      onChange={(e) => setBusForm({ ...busForm, via: e.target.value })}
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="To (e.g., Kochi)"
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

              {/* Vehicle Number in Edit/Add */}

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
                  <option value="KSRTC">KSRTC</option>
                  <option value="Private">Private</option>
                  <option value="Fast">Fast</option>
                  <option value="Super Fast">Super Fast</option>
                  <option value="Ordinary">Ordinary</option>
                </select>
              </div>

              {/* Stop Name and Time Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Stops and Timings *
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
                    <button type="button" onClick={() => importPastedStops(true)} className="btn-primary px-3">Import</button>
                    <button type="button" onClick={() => importPastedStops(false)} className="px-3 bg-gray-100 rounded-lg">Append</button>
                  </div>
                </div>

                <div className="space-y-3">
                  {stopTimings.map((stopTiming, index) => (
                    <div key={index} className="flex gap-3 items-start">
                      <div className="flex-1">
                        <input
                          type="text"
                          className="input-field"
                          placeholder="e.g., Thiruvananthapuram Central"
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
                                required
                              />
                              <select
                                className="input-field w-24"
                                value={t.period}
                                onChange={(e) => updateStopTime(index, ti, 'period', e.target.value)}
                                required
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
                      className="input-field"
                      placeholder="e.g., Trivandrum - Kochi Express"
                      value={busForm.busName}
                      onChange={(e) => setBusForm({ ...busForm, busName: e.target.value })}
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
                          placeholder="From (e.g., Trivandrum)"
                          value={busForm.from}
                          onChange={(e) => setBusForm({ ...busForm, from: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          className="input-field"
                          placeholder="Via (e.g., Kollam)"
                          value={busForm.via}
                          onChange={(e) => setBusForm({ ...busForm, via: e.target.value })}
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          className="input-field"
                          placeholder="To (e.g., Kochi)"
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
                      <option value="KSRTC">KSRTC</option>
                      <option value="Private">Private</option>
                      <option value="Fast">Fast</option>
                      <option value="Super Fast">Super Fast</option>
                      <option value="Ordinary">Ordinary</option>
                    </select>
                  </div>

                  {/* Stop Name and Time Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Stops and Timings *
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
                        <button type="button" onClick={() => importPastedStops(true)} className="btn-primary px-3">Import</button>
                        <button type="button" onClick={() => importPastedStops(false)} className="px-3 bg-gray-100 rounded-lg">Append</button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {stopTimings.map((stopTiming, index) => (
                        <div key={index} className="flex gap-3 items-start">
                          <div className="flex-1">
                            <input
                              type="text"
                              className="input-field"
                              placeholder="e.g., Thiruvananthapuram Central"
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
                                    required
                                  />
                                  <select
                                    className="input-field w-24"
                                    value={t.period}
                                    onChange={(e) => updateStopTime(index, ti, 'period', e.target.value)}
                                    required
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
              <div className="card">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">All Buses</h2>
                
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
                        className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
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
      </div>
    </div>
  );
};

export default AdminPage;
