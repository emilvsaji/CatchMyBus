import { useState, useEffect } from 'react';
import { Plus, Bus, Send, AlertCircle, CheckCircle2, X, User, Phone, MapPin, Mail, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../config/api';
import { useAuth } from '../contexts/AuthContext';

interface StopTiming {
  stopName: string;
  times: { arrivalTime: string; period: 'AM' | 'PM' }[];
}

const KERALA_DISTRICTS = [
  'Alappuzha',
  'Ernakulam',
  'Idukki',
  'Kannur',
  'Kasaragod',
  'Kollam',
  'Kottayam',
  'Kozhikode',
  'Malappuram',
  'Palakkad',
  'Pathanamthitta',
  'Thiruvananthapuram',
  'Thrissur',
  'Wayanad',
];

const UserDashboard = () => {
  const { currentUser } = useAuth();

  // Basic Commuter Details state
  const [profile, setProfile] = useState({
    fullName: '',
    phoneNumber: '',
    district: '',
    homeTown: '',
  });
  const [profileSaved, setProfileSaved] = useState(false);

  // Toggle for Add Bus Form
  const [showAddBusForm, setShowAddBusForm] = useState(false);

  // Bus Form state (DEFAULT BUS TYPE IS 'Private')
  const [busForm, setBusForm] = useState({
    busName: '',
    busNumber: '',
    from: '',
    via: '',
    to: '',
    type: 'Private', // Default bus type set to Private as requested
  });

  const [stopTimings, setStopTimings] = useState<StopTiming[]>([
    { stopName: '', times: [{ arrivalTime: '', period: 'AM' }] }
  ]);

  const [pasteStopsText, setPasteStopsText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<{
    busName: string;
    from: string;
    to: string;
    stopsCount: number;
  } | null>(null);

  // Load saved profile details from localStorage
  useEffect(() => {
    if (currentUser?.uid) {
      const saved = localStorage.getItem(`cmb_profile_${currentUser.uid}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setProfile(parsed);
          setProfileSaved(true);
        } catch (e) {
          console.error('Failed to parse saved profile:', e);
        }
      }
    }
  }, [currentUser?.uid]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile.fullName.trim()) {
      toast.error('Please enter your full name');
      return;
    }
    if (currentUser?.uid) {
      localStorage.setItem(`cmb_profile_${currentUser.uid}`, JSON.stringify(profile));
      setProfileSaved(true);
      toast.success('Details saved successfully!');
    }
  };

  const addStopTimingField = () => {
    setStopTimings([...stopTimings, { stopName: '', times: [{ arrivalTime: '', period: 'AM' }] }]);
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

  const importPastedStops = () => {
    if (!pasteStopsText || !pasteStopsText.trim()) return;
    const parts = pasteStopsText.split(/[,;\n\r]+/).map(s => s.trim()).filter(Boolean);
    if (parts.length === 0) return;

    const newRows: StopTiming[] = parts.map(p => ({
      stopName: p,
      times: [{ arrivalTime: '', period: 'AM' }]
    }));

    setStopTimings(newRows);
    setPasteStopsText('');
  };

  const handleResetForm = () => {
    setBusForm({
      busName: '',
      busNumber: '',
      from: '',
      via: '',
      to: '',
      type: 'Private', // Default to Private
    });
    setStopTimings([{ stopName: '', times: [{ arrivalTime: '', period: 'AM' }] }]);
    setPasteStopsText('');
    setErrorMessage(null);
    setSubmittedData(null);
  };

  const handleSubmitBus = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validate that all stops have names and times
    const hasEmptyFields = stopTimings.some(
      st => !st.stopName.trim() || st.times.some(t => !t.arrivalTime.trim())
    );
    if (hasEmptyFields) {
      const msg = 'Please fill all stop names and their departure/arrival times.';
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    setIsSubmitting(true);

    const payload = {
      busName: busForm.busName.toUpperCase().trim(),
      busNumber: busForm.busNumber.trim(),
      from: busForm.from.trim(),
      via: busForm.via.trim(),
      to: busForm.to.trim(),
      type: busForm.type,
      route: stopTimings.map(st => st.stopName.trim()),
      timings: stopTimings.flatMap(st =>
        st.times.map(t => ({
          stopName: st.stopName.trim(),
          arrivalTime: `${t.arrivalTime} ${t.period}`,
          departureTime: `${t.arrivalTime} ${t.period}`,
        }))
      ),
      submittedBy: currentUser?.uid || 'anonymous',
      submittedByEmail: currentUser?.email || '',
      submittedByName: profile.fullName.trim() || '',
      submittedByPhone: profile.phoneNumber.trim() || '',
    };

    try {
      await api.post('/api/bus-requests', payload);
      toast.success('Bus suggestion submitted for review!');
      setSubmittedData({
        busName: payload.busName,
        from: payload.from,
        to: payload.to,
        stopsCount: payload.route.length,
      });
    } catch (error: any) {
      console.error('Error submitting bus request:', error);
      const msg = error.response?.data?.error || error.message || 'Failed to submit bus suggestion.';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-20 space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center flex-shrink-0 shadow-sm">
            <User className="w-4 h-4 text-navy-800" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-neutral-800">My Dashboard</h1>
            <p className="text-xs text-neutral-500">
              Manage your commuter details and contribute missing bus schedules
            </p>
          </div>
        </div>
      </div>

      {/* ─── 1. USER BASIC DETAILS SECTION ───────────────────────────── */}
      <div className="transit-card p-6 bg-white animate-slide-up">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-navy-800 text-white flex items-center justify-center text-xs font-bold">
              1
            </div>
            <h2 className="text-base font-bold text-neutral-800">Basic Details</h2>
          </div>
          {profileSaved && (
            <span className="inline-flex items-center gap-1 text-2xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <CheckCircle2 className="w-3 h-3" />
              Saved
            </span>
          )}
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-1.5">
                <User className="w-3.5 h-3.5 inline mr-1 opacity-70" />
                Full Name *
              </label>
              <input
                type="text"
                required
                className="input-field"
                placeholder="e.g., Rahul S."
                value={profile.fullName}
                onChange={(e) => {
                  setProfile({ ...profile, fullName: e.target.value });
                  setProfileSaved(false);
                }}
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-1.5">
                <Phone className="w-3.5 h-3.5 inline mr-1 opacity-70" />
                Phone Number
              </label>
              <input
                type="tel"
                className="input-field"
                placeholder="e.g., +91 9400 4310"
                value={profile.phoneNumber}
                onChange={(e) => {
                  setProfile({ ...profile, phoneNumber: e.target.value });
                  setProfileSaved(false);
                }}
              />
            </div>

            {/* District */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-1.5">
                <MapPin className="w-3.5 h-3.5 inline mr-1 opacity-70" />
                District
              </label>
              <select
                className="input-field text-sm"
                value={profile.district}
                onChange={(e) => {
                  setProfile({ ...profile, district: e.target.value });
                  setProfileSaved(false);
                }}
              >
                <option value="">Select District</option>
                {KERALA_DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Home Town / City */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-1.5">
                <MapPin className="w-3.5 h-3.5 inline mr-1 opacity-70" />
                Home Town / Stop
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g., Pala, Aluva, Vytilla"
                value={profile.homeTown}
                onChange={(e) => {
                  setProfile({ ...profile, homeTown: e.target.value });
                  setProfileSaved(false);
                }}
              />
            </div>
          </div>

          {/* Email Address (Read-only from Auth) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-1.5">
              <Mail className="w-3.5 h-3.5 inline mr-1 opacity-70" />
              Registered Email
            </label>
            <input
              type="email"
              disabled
              className="input-field bg-neutral-100 text-neutral-500 cursor-not-allowed"
              value={currentUser?.email || ''}
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="btn-navy text-xs py-2 px-4 flex items-center gap-1.5 min-h-0"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save details</span>
            </button>
          </div>
        </form>
      </div>

      {/* ─── 2. ADD BUS / SUGGEST A BUS SECTION ─────────────────────── */}
      <div className="transit-card p-6 bg-white animate-slide-up">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100 mb-5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-amber-400 text-navy-800 flex items-center justify-center text-xs font-bold">
              2
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-800">Suggest a Bus</h2>
              <p className="text-xs text-neutral-500">
                Submit missing bus routes or updated timings for our team to review
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowAddBusForm(!showAddBusForm)}
            className="btn-amber text-xs py-2 px-4 flex items-center justify-center gap-1.5 min-h-0 shadow-sm self-start sm:self-auto"
          >
            {showAddBusForm ? (
              <>
                <X className="w-4 h-4" />
                <span>Close form</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Add Bus</span>
              </>
            )}
          </button>
        </div>

        {/* When collapsed and not submitted */}
        {!showAddBusForm && !submittedData && (
          <div className="py-6 text-center border border-dashed border-neutral-200 rounded-lg bg-neutral-50/50">
            <Bus className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-neutral-700">Know a bus route or timing?</p>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1 mb-4">
              Help fellow commuters by adding private or KSRTC bus schedules across Kerala.
            </p>
            <button
              onClick={() => setShowAddBusForm(true)}
              className="btn-amber text-xs py-2 px-4 inline-flex items-center gap-1.5 min-h-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Bus</span>
            </button>
          </div>
        )}

        {/* Persistent Success Confirmation View */}
        {submittedData ? (
          <div className="p-6 text-center border border-amber-400/40 rounded-lg bg-amber-50/30 animate-slide-up">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#1B7F4C] border border-[#1B7F4C]/30 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-neutral-800 mb-1">
              Suggestion Received!
            </h3>
            <p className="text-sm text-neutral-600 max-w-md mx-auto mb-5 leading-relaxed">
              Thanks — this will be added after our team verifies it.
            </p>

            {/* Submission Summary Card */}
            <div className="bg-white border border-neutral-200 rounded-lg p-4 max-w-md mx-auto text-left mb-5 space-y-1.5 text-xs text-neutral-600 shadow-sm">
              <p>
                <span className="font-semibold text-neutral-800 uppercase tracking-wide">Bus:</span>{' '}
                <span className="font-bold text-navy-800 uppercase">{submittedData.busName}</span>
              </p>
              <p>
                <span className="font-semibold text-neutral-800">Route:</span>{' '}
                {submittedData.from} → {submittedData.to}
              </p>
              <p>
                <span className="font-semibold text-neutral-800">Stops:</span>{' '}
                {submittedData.stopsCount} stop{submittedData.stopsCount !== 1 ? 's' : ''} configured
              </p>
              <p>
                <span className="font-semibold text-neutral-800">Status:</span>{' '}
                <span className="inline-block px-1.5 py-0.5 rounded text-2xs font-semibold bg-amber-400/20 text-amber-800 border border-amber-400/40">
                  Pending verification
                </span>
              </p>
            </div>

            <button
              onClick={() => {
                handleResetForm();
                setShowAddBusForm(true);
              }}
              className="btn-amber text-xs px-5 py-2 inline-flex items-center gap-1.5 min-h-0"
            >
              <Plus className="w-4 h-4" />
              <span>Submit another bus</span>
            </button>
          </div>
        ) : (
          showAddBusForm && (
            /* Suggest a Bus Form View */
            <div className="animate-slide-up pt-2">
              {/* Inline Error Alert */}
              {errorMessage && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-xs text-red-800 animate-slide-down">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmitBus} className="space-y-6">
                {/* Bus Name */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-1.5">
                    Bus Name *
                  </label>
                  <input
                    type="text"
                    className="input-field uppercase tracking-wide"
                    placeholder="e.g., ST JUDE EXPRESS"
                    value={busForm.busName}
                    onChange={(e) => setBusForm({ ...busForm, busName: e.target.value.toUpperCase() })}
                    required
                  />
                </div>

                {/* Vehicle Number */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-1.5">
                    Vehicle Number (Optional)
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g., KL-05-AB-1234"
                    value={busForm.busNumber}
                    onChange={(e) => setBusForm({ ...busForm, busNumber: e.target.value })}
                  />
                </div>

                {/* Route Termini: From → Via → To */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-1.5">
                    Route Details *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="From (e.g., Pala)"
                        value={busForm.from}
                        onChange={(e) => setBusForm({ ...busForm, from: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="Via (e.g., Panackapalam)"
                        value={busForm.via}
                        onChange={(e) => setBusForm({ ...busForm, via: e.target.value })}
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="To (e.g., Pravithanam)"
                        value={busForm.to}
                        onChange={(e) => setBusForm({ ...busForm, to: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <p className="text-2xs text-neutral-400 mt-1">
                    From → Via → To (Via is optional)
                  </p>
                </div>

                {/* Bus Type — Defaults to 'Private' */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-1.5">
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
                    <option value="Fast">Fast Passenger</option>
                    <option value="Super Fast">Super Fast</option>
                    <option value="Ordinary">Ordinary</option>
                  </select>
                </div>

                {/* Stops and Timings */}
                <div className="pt-2 border-t border-neutral-100">
                  <label className="block text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-2">
                    Stops and Timings *
                  </label>

                  {/* Smart Paste */}
                  <div className="mb-4 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                    <label className="block text-xs font-medium text-neutral-600 mb-1.5">
                      Smart Paste stops (comma, newline, or tab separated)
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        value={pasteStopsText}
                        onChange={(e) => setPasteStopsText(e.target.value)}
                        placeholder="e.g., Pala, Pravithanam, Kollapally"
                        className="input-field flex-1 text-xs"
                      />
                      <button
                        type="button"
                        onClick={importPastedStops}
                        className="btn-navy text-xs px-3 py-2 flex-1 sm:flex-none justify-center"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Stop Row List */}
                  <div className="space-y-3">
                    {stopTimings.map((stopTiming, index) => (
                      <div key={index} className="flex gap-2 sm:gap-3 items-start p-3 rounded-lg border border-neutral-200 bg-white">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="w-5 h-5 rounded-full bg-navy-800 text-white text-2xs font-bold flex items-center justify-center flex-shrink-0">
                              {index + 1}
                            </span>
                            <input
                              type="text"
                              className="input-field text-sm"
                              placeholder="Stop name (e.g., Pala Bus Stand)"
                              value={stopTiming.stopName}
                              onChange={(e) => updateStopName(index, e.target.value)}
                              required
                            />
                          </div>

                          {/* Times */}
                          <div className="space-y-2 pl-7">
                            {stopTiming.times.map((t, ti) => (
                              <div key={ti} className="flex items-center gap-2">
                                <input
                                  type="text"
                                  className="input-field w-28 text-sm tabular-nums"
                                  placeholder="08:30"
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
                                  className="input-field w-20 text-xs font-semibold"
                                  value={t.period}
                                  onChange={(e) => updateStopTime(index, ti, 'period', e.target.value)}
                                  required
                                >
                                  <option value="AM">AM</option>
                                  <option value="PM">PM</option>
                                </select>
                                {stopTiming.times.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeTimeForStop(index, ti)}
                                    className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors min-h-0"
                                    title="Remove time"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                )}
                              </div>
                            ))}

                            <button
                              type="button"
                              onClick={() => addTimeForStop(index)}
                              className="text-xs text-navy-800 hover:text-amber-500 font-medium transition-colors min-h-0 block"
                            >
                              + Add another time for this stop
                            </button>
                          </div>
                        </div>

                        {stopTimings.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeStopTimingField(index)}
                            className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors min-h-0"
                            title="Remove stop"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={addStopTimingField}
                    className="mt-3 flex items-center gap-1.5 text-xs text-navy-800 hover:text-amber-500 font-semibold transition-colors min-h-0"
                  >
                    <Plus className="h-4 w-4" />
                    Add another stop
                  </button>
                </div>

                {/* Submit Button */}
                <div className="pt-4 border-t border-neutral-100 flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-amber flex-1 justify-center text-sm font-semibold py-3"
                  >
                    {isSubmitting ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-navy-800 border-t-transparent" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit for review</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddBusForm(false)}
                    className="btn-ghost text-xs px-4 py-3 min-h-0"
                  >
                    Cancel
                  </button>
                </div>
                <p className="text-2xs text-neutral-400 text-center">
                  Submissions are reviewed by administrators before being published live.
                </p>
              </form>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
