import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, SlidersHorizontal, ArrowUpDown, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import FlightCard from '../components/flights/FlightCard'
import { useSearchStore } from '../store/searchStore'
import { useBookingStore } from '../store/bookingStore'
import { formatPrice } from '../utils/formatters'

const sortOptions = [
  { value: 'best', label: 'Best' },
  { value: 'cheapest', label: 'Cheapest' },
  { value: 'fastest', label: 'Fastest' },
  { value: 'earliest', label: 'Earliest' },
]

export default function SearchResultsPage() {
  const navigate = useNavigate()
  const { origin, destination, departureDate, returnDate, results, loading, passengers } = useSearchStore()
  const { selectFlight } = useBookingStore()
  const [sortBy, setSortBy] = useState('best')
  const [showFilters, setShowFilters] = useState(false)
  const [stopsFilter, setStopsFilter] = useState('any')

  const totalPassengers = passengers.adults + passengers.children

  // Redirect if no search results
  useEffect(() => {
    if (!results && !loading) {
      navigate('/')
    }
  }, [results, loading, navigate])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary-500 mx-auto mb-4" />
          <p className="text-gray-600">Searching for the best flights...</p>
        </div>
      </div>
    )
  }

  if (!results) {
    return null
  }

  const { outbound = [], return: returnFlights = [] } = results

  // Filter flights
  let filteredFlights = [...outbound]
  if (stopsFilter !== 'any') {
    const maxStops = stopsFilter === 'nonstop' ? 0 : parseInt(stopsFilter)
    filteredFlights = filteredFlights.filter(f => f.stops <= maxStops)
  }

  // Sort flights
  filteredFlights.sort((a, b) => {
    switch (sortBy) {
      case 'cheapest':
        return a.fares.economy_basic.price - b.fares.economy_basic.price
      case 'fastest':
        return a.duration_minutes - b.duration_minutes
      case 'earliest':
        return a.departure.scheduled.localeCompare(b.departure.scheduled)
      default: // 'best' - balance of price and duration
        const scoreA = a.fares.economy_basic.price + a.duration_minutes * 0.5
        const scoreB = b.fares.economy_basic.price + b.duration_minutes * 0.5
        return scoreA - scoreB
    }
  })

  const handleSelectFlight = (flight, fareClass = 'economy_standard') => {
    selectFlight(flight, fareClass)
    navigate('/booking/passengers')
  }

  const lowestPrice = outbound.length > 0
    ? Math.min(...outbound.map(f => f.fares.economy_basic.price))
    : 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Summary Header */}
      <div className="bg-primary-500 text-white">
        <div className="container-app py-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-primary-100 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            New Search
          </button>

          <div className="flex flex-wrap items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold">
                {origin?.city} → {destination?.city}
              </h1>
              <p className="text-primary-100">
                {departureDate && format(departureDate, 'EEE, MMM d')}
                {returnDate && ` - ${format(returnDate, 'EEE, MMM d')}`}
                {' · '}
                {totalPassengers} traveler{totalPassengers > 1 ? 's' : ''}
              </p>
            </div>
            <div className="ml-auto text-right">
              <div className="text-sm text-primary-100">Prices from</div>
              <div className="text-2xl font-bold">{formatPrice(lowestPrice)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-app py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <aside className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="card p-4 sticky top-20">
              <h3 className="font-semibold mb-4">Filters</h3>

              {/* Stops Filter */}
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Stops</label>
                <div className="space-y-2">
                  {[
                    { value: 'any', label: 'Any' },
                    { value: 'nonstop', label: 'Non-stop only' },
                    { value: '1', label: '1 stop or fewer' },
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="stops"
                        value={option.value}
                        checked={stopsFilter === option.value}
                        onChange={(e) => setStopsFilter(e.target.value)}
                        className="text-primary-500 focus:ring-primary-500"
                      />
                      <span className="text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range could go here */}
            </div>
          </aside>

          {/* Results */}
          <main className="flex-1">
            {/* Sort & Filter Controls */}
            <div className="flex items-center justify-between mb-4">
              <div className="text-gray-600">
                {filteredFlights.length} flight{filteredFlights.length !== 1 ? 's' : ''} found
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-2 px-3 py-2 rounded-lg border hover:bg-gray-50"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </button>
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4 text-gray-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border rounded-lg px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        Sort by: {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Flight Cards */}
            <div className="space-y-4">
              {filteredFlights.length > 0 ? (
                filteredFlights.map((flight) => (
                  <FlightCard
                    key={flight.id}
                    flight={flight}
                    onSelect={handleSelectFlight}
                  />
                ))
              ) : (
                <div className="card p-8 text-center">
                  <p className="text-gray-500">No flights match your filters. Try adjusting your search.</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
