import { Clock, MapPin, DollarSign, Bus as BusIcon } from 'lucide-react';
import { BusResult } from '../types';

interface BusCardProps {
  result: BusResult;
}

const BusCard = ({ result }: BusCardProps) => {
  const { bus, fromTiming, toTiming, distance, estimatedTime, fare } = result;

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
    <div className="card hover:shadow-2xl transition-all duration-300 animate-slide-up">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        {/* Bus Info */}
        <div className="flex-1 mb-4 md:mb-0">
          <div className="flex items-center space-x-3 mb-3">
            <div className="bg-primary-600 p-3 rounded-lg">
              <BusIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">{bus.busName}</h3>
              <p className="text-sm text-gray-600">Bus No: {bus.busNumber}</p>
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
                <p className="text-sm font-semibold text-gray-700">{fromTiming.stopName}</p>
                <p className="text-lg font-bold text-gray-900">{fromTiming.departureTime}</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <MapPin className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-gray-700">{toTiming.stopName}</p>
                <p className="text-lg font-bold text-gray-900">{toTiming.arrivalTime}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="border-t md:border-t-0 md:border-l border-gray-200 pt-4 md:pt-0 md:pl-6 md:ml-6">
          <div className="flex md:flex-col space-x-6 md:space-x-0 md:space-y-3">
            <div className="text-center">
              <Clock className="h-5 w-5 text-gray-600 mx-auto mb-1" />
              <p className="text-xs text-gray-600">Duration</p>
              <p className="text-sm font-bold text-gray-900">{estimatedTime} min</p>
            </div>
            <div className="text-center">
              <MapPin className="h-5 w-5 text-gray-600 mx-auto mb-1" />
              <p className="text-xs text-gray-600">Distance</p>
              <p className="text-sm font-bold text-gray-900">{distance} km</p>
            </div>
            <div className="text-center">
              <DollarSign className="h-5 w-5 text-gray-600 mx-auto mb-1" />
              <p className="text-xs text-gray-600">Fare</p>
              <p className="text-sm font-bold text-green-600">₹{fare}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusCard;
