import { Clock, MapPin, Bus as BusIcon, ChevronDown, ChevronUp, Navigation, ArrowRight } from 'lucide-react';
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

  const getBusTypeStyles = (type: string) => {
    switch (type) {
      case 'KSRTC': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Private': return 'bg-purple-50 text-purple-700 border-purple-100';
      case 'Fast': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Super Fast': return 'bg-rose-50 text-rose-700 border-rose-100';
      default: return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Partial Match Banner */}
      {partial && (
        <div className="bg-amber-50 border-b border-amber-100 px-4 py-1.5 flex items-center justify-center">
          <span className="text-xs font-medium text-amber-700 flex items-center">
            ⚠️ Partial Route Match
          </span>
        </div>
      )}

      <div className="p-5">
        {/* Header: Bus Info & Price */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-start space-x-3">
            <div className={`p-2.5 rounded-xl ${getBusTypeStyles(bus.type).split(' ')[0]}`}>
              <BusIcon className={`h-6 w-6 ${getBusTypeStyles(bus.type).split(' ')[1]}`} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 leading-tight">{bus.busName}</h3>
              <div className="flex items-center mt-1 space-x-2">
                <span className="text-xs text-gray-500 font-medium tracking-wide">#{bus.busNumber}</span>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getBusTypeStyles(bus.type)}`}>
                  {bus.type}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-gray-900">
              {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(fare || 0)}
            </div>
            <div className="text-xs text-gray-500 font-medium">per person</div>
          </div>
        </div>

        {/* Journey Timeline */}
        <div className="flex items-center justify-between mb-6 relative">
          {/* From */}
          <div className="flex-1">
            <div className="text-2xl font-bold text-gray-900 mb-0.5">{fromTiming?.departureTime || '--:--'}</div>
            <div className="flex items-center text-gray-500 text-sm font-medium">
              <MapPin className="h-3.5 w-3.5 mr-1 text-gray-400" />
              <span className="truncate max-w-[100px] md:max-w-[140px]">{fromTiming?.stopName}</span>
            </div>
          </div>

          {/* Duration / Connector */}
          <div className="flex flex-col items-center px-4 w-1/3">
            <div className="text-xs font-medium text-gray-400 mb-1">{estimatedTime} min</div>
            <div className="w-full h-px bg-gray-200 relative flex items-center justify-center">
              <div className="absolute w-2 h-2 bg-gray-300 rounded-full -left-1"></div>
              <div className="absolute w-2 h-2 bg-gray-300 rounded-full -right-1"></div>
              <BusIcon className="h-4 w-4 text-gray-300 absolute bg-white px-0.5" />
            </div>
            <div className="text-[10px] text-gray-400 mt-1">{distance} km</div>
          </div>

          {/* To */}
          <div className="flex-1 text-right">
            <div className="text-2xl font-bold text-gray-900 mb-0.5">{toTiming?.arrivalTime || '--:--'}</div>
            <div className="flex items-center justify-end text-gray-500 text-sm font-medium">
              <span className="truncate max-w-[100px] md:max-w-[140px]">{toTiming?.stopName}</span>
              <MapPin className="h-3.5 w-3.5 ml-1 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
          {!compact && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-sm font-medium text-gray-500 hover:text-primary-600 flex items-center transition-colors"
            >
              {expanded ? 'Hide Stops' : 'View Stops'}
              {expanded ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
            </button>
          )}
          
          {compact ? (
             <div className="w-full flex justify-between items-center">
                <span className="text-xs text-gray-400 font-medium">
                  {result.timingSource === 'estimated' ? 'Estimated Timings' : 'Actual Timings'}
                </span>
                <button className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center">
                  View Details <ArrowRight className="h-4 w-4 ml-1" />
                </button>
             </div>
          ) : (
            <div className="flex space-x-3 ml-auto">
               <button className="px-4 py-2 rounded-lg bg-primary-50 text-primary-700 text-sm font-semibold hover:bg-primary-100 transition-colors">
                Track Live
              </button>
              <button className="px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 shadow-sm hover:shadow transition-all">
                Book Seat
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Expanded Route View */}
      {!compact && expanded && (
        <div className="bg-gray-50 p-5 border-t border-gray-100 animate-slide-down">
          <div className="relative pl-4 space-y-6">
            <div className="absolute left-[23px] top-2 bottom-2 w-0.5 bg-gray-200"></div>
            {bus.route && bus.route.map((stop: any, idx: number) => {
              const stopName = typeof stop === 'string' ? stop : stop?.name || stop?.stopName || 'Unknown';
              const isStart = idx === 0;
              const isEnd = idx === bus.route.length - 1;
              const isFromStop = stopName.toLowerCase().includes(fromTiming.stopName.toLowerCase()) || fromTiming.stopName.toLowerCase().includes(stopName.toLowerCase());
              const isToStop = stopName.toLowerCase().includes(toTiming.stopName.toLowerCase()) || toTiming.stopName.toLowerCase().includes(stopName.toLowerCase());
              
              return (
                <div key={idx} className="relative flex items-center z-10">
                  <div className={`w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm ${
                    isStart || isEnd ? 'bg-primary-600 w-3.5 h-3.5' : 
                    isFromStop || isToStop ? 'bg-blue-500 w-3.5 h-3.5 ring-2 ring-blue-100' : 'bg-gray-400'
                  }`}></div>
                  <div className="ml-4 flex-1">
                    <p className={`text-sm ${isStart || isEnd || isFromStop || isToStop ? 'font-bold text-gray-900' : 'font-medium text-gray-600'}`}>
                      {stopName}
                      {isFromStop && <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">Boarding</span>}
                      {isToStop && <span className="ml-2 text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">Dropping</span>}
                    </p>
                    {(isFromStop || isToStop) && bus.timings && bus.timings[idx] && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        {bus.timings[idx].arrivalTime} - {bus.timings[idx].departureTime}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default BusCard;
