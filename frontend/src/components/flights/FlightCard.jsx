import { Plane, Wifi, Tv, UtensilsCrossed } from 'lucide-react'
import { formatDuration, formatPrice } from '../../utils/formatters'

export default function FlightCard({ flight, onSelect }) {
  const lowestPrice = flight.fares.economy_basic.price

  return (
    <div className="card p-4 md:p-6 animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Airline Info */}
        <div className="flex items-center gap-3 lg:w-36">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <Plane className="h-5 w-5 text-primary-500" />
          </div>
          <div>
            <div className="font-medium text-sm">{flight.airline_name}</div>
            <div className="text-xs text-gray-500">{flight.flight_number}</div>
          </div>
        </div>

        {/* Flight Times */}
        <div className="flex-1 flex items-center gap-4">
          {/* Departure */}
          <div className="text-center">
            <div className="text-2xl font-bold">{flight.departure.local_time}</div>
            <div className="text-sm text-gray-500">{flight.departure.airport}</div>
          </div>

          {/* Duration Line */}
          <div className="flex-1 flex flex-col items-center px-4">
            <div className="text-xs text-gray-500 mb-1">
              {formatDuration(flight.duration_minutes)}
            </div>
            <div className="w-full relative">
              <div className="h-px bg-gray-300 w-full" />
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gray-400" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary-500" />
              {flight.stops > 0 && (
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-accent-500 border-2 border-white" />
              )}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {flight.stops === 0 ? (
                <span className="text-green-600 font-medium">Non-stop</span>
              ) : (
                <span className="text-accent-600">{flight.stops} stop{flight.stops > 1 ? 's' : ''}</span>
              )}
            </div>
          </div>

          {/* Arrival */}
          <div className="text-center">
            <div className="text-2xl font-bold">{flight.arrival.local_time}</div>
            <div className="text-sm text-gray-500">{flight.arrival.airport}</div>
          </div>
        </div>

        {/* Amenities */}
        <div className="hidden md:flex items-center gap-2 text-gray-400">
          {flight.amenities.wifi && <Wifi className="h-4 w-4" title="WiFi available" />}
          {flight.amenities.entertainment && <Tv className="h-4 w-4" title="Entertainment" />}
          {flight.amenities.meals !== 'Buy on board' && <UtensilsCrossed className="h-4 w-4" title="Meals included" />}
        </div>

        {/* Price & Select */}
        <div className="flex items-center justify-between lg:flex-col lg:items-end gap-2 pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l lg:pl-6">
          <div className="text-right">
            <div className="text-2xl font-bold text-primary-500">
              {formatPrice(lowestPrice)}
            </div>
            <div className="text-xs text-gray-500">per person</div>
          </div>
          <button
            onClick={() => onSelect(flight)}
            className="btn-accent text-sm px-6 py-2"
          >
            Select
          </button>
        </div>
      </div>

      {/* Expandable Details */}
      <div className="mt-4 pt-4 border-t flex flex-wrap gap-4 text-sm text-gray-600">
        <span className="flex items-center gap-1">
          <Plane className="h-4 w-4" />
          {flight.aircraft}
        </span>
        <span>{flight.departure.city} → {flight.arrival.city}</span>
      </div>
    </div>
  )
}
