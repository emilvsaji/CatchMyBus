import { useState } from 'react';
import { Plus, Bus, MapPin, Clock, Save, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../config/api';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState<'buses' | 'stops'>('buses');
  const [busForm, setBusForm] = useState({
    busNumber: '',
    busName: '',
    type: 'KSRTC',
    route: '',
  });
  const [stopForm, setStopForm] = useState({
    name: '',
    district: '',
    lat: '',
    lng: '',
  });

  const handleAddBus = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/admin/buses', {
        ...busForm,
        route: busForm.route.split(',').map(s => s.trim()),
      });
      toast.success('Bus added successfully!');
      setBusForm({ busNumber: '', busName: '', type: 'KSRTC', route: '' });
    } catch (error) {
      console.error('Error adding bus:', error);
      toast.error('Failed to add bus');
    }
  };

  const handleAddStop = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/admin/stops', {
        ...stopForm,
        location: {
          lat: parseFloat(stopForm.lat),
          lng: parseFloat(stopForm.lng),
        },
      });
      toast.success('Bus stop added successfully!');
      setStopForm({ name: '', district: '', lat: '', lng: '' });
    } catch (error) {
      console.error('Error adding stop:', error);
      toast.error('Failed to add bus stop');
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
            Manage Buses
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
            Manage Stops
          </button>
        </div>

        {/* Bus Form */}
        {activeTab === 'buses' && (
          <div className="card animate-slide-up">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Plus className="h-6 w-6 mr-2 text-primary-600" />
              Add New Bus
            </h2>

            <form onSubmit={handleAddBus} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bus Number *
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g., KL-01-AB-1234"
                    value={busForm.busNumber}
                    onChange={(e) => setBusForm({ ...busForm, busNumber: e.target.value })}
                    required
                  />
                </div>

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
              </div>

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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Route (Comma-separated stops) *
                </label>
                <textarea
                  className="input-field"
                  rows={3}
                  placeholder="e.g., Thiruvananthapuram, Kollam, Alappuzha, Kochi"
                  value={busForm.route}
                  onChange={(e) => setBusForm({ ...busForm, route: e.target.value })}
                  required
                />
              </div>

              <button type="submit" className="btn-primary w-full">
                <Save className="h-5 w-5 inline mr-2" />
                Add Bus
              </button>
            </form>
          </div>
        )}

        {/* Stop Form */}
        {activeTab === 'stops' && (
          <div className="card animate-slide-up">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Plus className="h-6 w-6 mr-2 text-primary-600" />
              Add New Bus Stop
            </h2>

            <form onSubmit={handleAddStop} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stop Name *
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g., Thiruvananthapuram Central"
                  value={stopForm.name}
                  onChange={(e) => setStopForm({ ...stopForm, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  District *
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g., Thiruvananthapuram"
                  value={stopForm.district}
                  onChange={(e) => setStopForm({ ...stopForm, district: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Latitude *
                  </label>
                  <input
                    type="number"
                    step="any"
                    className="input-field"
                    placeholder="e.g., 8.5241"
                    value={stopForm.lat}
                    onChange={(e) => setStopForm({ ...stopForm, lat: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Longitude *
                  </label>
                  <input
                    type="number"
                    step="any"
                    className="input-field"
                    placeholder="e.g., 76.9366"
                    value={stopForm.lng}
                    onChange={(e) => setStopForm({ ...stopForm, lng: e.target.value })}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary w-full">
                <Save className="h-5 w-5 inline mr-2" />
                Add Bus Stop
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
