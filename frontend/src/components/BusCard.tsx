import { Clock, MapPin, Bus as BusIcon, ChevronDown, ChevronUp, Navigation } from 'lucide-react';
import { BusResult } from '../types';
import { useState } from 'react';
import BusProgress from './BusProgress';

interface BusCardProps {
  result: BusResult;
  compact?: boolean;
}

const BusCard = ({ result, compact = false }: BusCardProps) => {
  const { bus, fromTiming, toTiming, distance, estimatedTime, fare, partial } = result;
  const [expanded, setExpanded] = useState(false);

  const extractStopNameFromRouteItem = (item: any) => {
    if (!item && item !== 0) return '';
    if (typeof item === 'string') return item;
    return item?.name || item?.stopName || item?.stop || '';
  };

  const displayFromName = (fromTiming?.stopName) || bus.from || (Array.isArray(bus.route) && extractStopNameFromRouteItem(bus.route[0])) || 'N/A';
  const displayToName = (toTiming?.stopName) || bus.to || (Array.isArray(bus.route) && extractStopNameFromRouteItem(bus.route[bus.route.length - 1])) || 'N/A';
  const isPlaceholderTime = (s?: string) => {
    if (!s) return true;
    const v = String(s).trim();
    if (!v) return true;
    if (/^tbd$/i.test(v)) return true;
    const norm = v.replace(/\s+/g, '').toLowerCase();
    return /^0{1,2}(:0{2})?(am|pm)?$/.test(norm);
  };

  const sanitizeTime = (t?: string) => {
    if (!t) return '—';
    if (isPlaceholderTime(t)) return '—';
    return t;
  };

  const displayFromTime = sanitizeTime(fromTiming?.departureTime || fromTiming?.arrivalTime);
  const displayToTime = sanitizeTime(toTiming?.arrivalTime || toTiming?.departureTime);

  const getBusTypeColor = (type: string) => {
    switch (type) {
      case 'KSRTC':
        return 'bg-blue-100 text-blue-800';
      case 'Private':
        return 'bg-purple-100 text-purple-800';
      case 'Fast':
        return 'bg-green-100 text-green-800';
      case 'Super Fast':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="card hover:shadow-2xl transition-all duration-300 animate-slide-up relative overflow-hidden">
      {/* Show badge when timings are estimated */}
      {result.timingSource === 'estimated' && (
        <div className="absolute left-4 top-4 bg-yellow-50 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium z-20">
          Estimated times
        </div>
      )}
      {/* Partial Match Banner */}
      {partial && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 px-4 py-2 mb-4">
          <p className="text-sm text-yellow-800 font-medium">
            ⚠️ Partial Match - This bus passes through one of your searched stops
          </p>
        </div>
      )}
      
      {/* Animated Bus Icon */}
      <div className="absolute top-4 right-4 opacity-10">
        <BusIcon className="h-24 w-24 text-primary-600 animate-pulse" />
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between relative z-10">
        {/* Bus Info */}
        <div className="flex-1 mb-4 md:mb-0">
          <div className="flex items-center space-x-3 mb-3">
            <div className="bg-primary-600 p-3 rounded-lg">
              <BusIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">{bus.busName}</h3>
              <p className="text-sm text-gray-600">Bus No: {bus.busNumber}</p>
              {(result.requestedFrom || result.requestedTo) && (
                <p className="text-xs text-gray-500 mt-1">
                  Search: {result.requestedFrom || ''} → {result.requestedTo || ''} {result.requestedTime ? `at ${result.requestedTime}` : ''}
                </p>
              )}
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getBusTypeColor(bus.type)}`}>
              {bus.type}
            </span>
          </div>

          {/* Timing Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-2">
              <MapPin className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-gray-700">{displayFromName}</p>
                <p className="text-lg font-bold text-gray-900">{displayFromTime}</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <MapPin className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-gray-700">{displayToName}</p>
                <p className="text-lg font-bold text-gray-900">{displayToTime}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="border-t md:border-t-0 md:border-l border-gray-200 pt-4 md:pt-0 md:pl-6 md:ml-6 w-full md:w-auto">
          <div className="flex md:flex-col space-x-6 md:space-x-0 md:space-y-3">
            <div className="text-center">
              <Clock className="h-5 w-5 text-gray-600 mx-auto mb-1" />
              <p className="text-xs text-gray-600">Duration</p>
              <p className="text-sm font-bold text-gray-900">{estimatedTime ?? 'N/A'} min</p>
            </div>
            <div className="text-center">
              <MapPin className="h-5 w-5 text-gray-600 mx-auto mb-1" />
              <p className="text-xs text-gray-600">Distance</p>
              <p className="text-sm font-bold text-gray-900">{distance ?? 'N/A'} km</p>
            </div>
            <div className="text-center">
              <div className="text-gray-600 mx-auto mb-1 text-xl font-medium">₹</div>
              <p className="text-xs text-gray-600">Fare</p>
              <p className="text-sm font-bold text-green-600">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(fare || 0)}</p>
            </div>
          </div>
          {/* 3D Bus Animation - hide in compact mode to save perf */}
          {!compact && (
            <div className="mt-3 w-full min-w-[260px]">
              <BusProgress height={80} />
            </div>
          )}
        </div>
      </div>

      {/* Expandable Route Details */}
      {!compact && bus.route && Array.isArray(bus.route) && bus.route.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
          >
            <span className="flex items-center">
              <Navigation className="h-4 w-4 mr-2" />
              View Full Route ({bus.route.length} stops)
            </span>
            {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>

          {expanded && (
            <div className="mt-4 animate-slide-up">
              <div className="relative">
                {/* Route Line */}
                <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-500 via-blue-500 to-red-500"></div>
                
                {/* Stops List */}
                <div className="space-y-4">
                  {bus.route.map((stop: any, idx: number) => {
                    const stopName = extractStopNameFromRouteItem(stop) || 'Unknown';
                    const isFirst = idx === 0;
                    const isLast = idx === bus.route.length - 1;
                    const fromCmp = (fromTiming?.stopName || displayFromName).toLowerCase();
                    const toCmp = (toTiming?.stopName || displayToName).toLowerCase();
                    const isFromStop = stopName.toLowerCase().includes(fromCmp) || fromCmp.includes(stopName.toLowerCase());
                    const isToStop = stopName.toLowerCase().includes(toCmp) || toCmp.includes(stopName.toLowerCase());
                    
                    return (
                      <div key={idx} className="flex items-center relative">
                        {/* Stop Marker */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                          isFirst ? 'bg-green-500 animate-bounce' : 
                          isLast ? 'bg-red-500 animate-pulse' : 
                          isFromStop || isToStop ? 'bg-blue-500 ring-4 ring-blue-200' :
                          'bg-gray-300'
                        }`}>
                          {isFirst || isLast ? (
                            <MapPin className="h-5 w-5 text-white" />
                          ) : (
                            <div className="w-3 h-3 bg-white rounded-full"></div>
                          )}
                        </div>
                        
                        {/* Stop Info */}
                        <div className="ml-4 flex-1">
                          <p className={`font-medium ${
                            isFromStop || isToStop ? 'text-blue-700 text-lg' : 'text-gray-700'
                          }`}>
                            {stopName}
                            {isFirst && ' (Start)'}
                            {isLast && ' (End)'}
                            {isFromStop && !isFirst && ' (Your From)'}
                            {isToStop && !isLast && ' (Your To)'}
                          </p>
                          {(isFromStop || isToStop) && bus.timings && bus.timings[idx] && (
                            <p className="text-sm text-gray-600">
                              Arrival: {sanitizeTime(bus.timings[idx].arrivalTime)} | 
                              Departure: {sanitizeTime(bus.timings[idx].departureTime)}
                            </p>
                          )}
                        </div>
                        
                        {/* Animated Bus Icon for current position */}
                        {idx < bus.route.length - 1 && idx % 3 === 1 && (
                          <div className="absolute left-3 animate-bus-move">
                            <BusIcon className="h-6 w-6 text-primary-600" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BusCard;
