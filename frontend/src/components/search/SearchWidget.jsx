import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeftRight, Search } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import AirportInput from './AirportInput'
import DateInput from './DateInput'
import PassengerSelector from './PassengerSelector'
import { useSearchStore } from '../../store/searchStore'
import { flightService } from '../../services/flightService'

export default function SearchWidget() {
  const navigate = useNavigate()
  const {
    origin,
    destination,
    departureDate,
    returnDate,
    passengers,
    tripType,
    setSearchParams,
    setResults,
    setLoading,
    swapAirports
  } = useSearchStore()

  const [localTripType, setLocalTripType] = useState(tripType)

  const handleSearch = async () => {
    if (!origin || !destination) {
      toast.error('Please select origin and destination')
      return
    }
    if (!departureDate) {
      toast.error('Please select a departure date')
      return
    }
    if (localTripType === 'roundtrip' && !returnDate) {
      toast.error('Please select a return date')
      return
    }

    setLoading(true)
    try {
      const params = {
        origin: origin.code,
        destination: destination.code,
        departure_date: format(departureDate, 'yyyy-MM-dd'),
        return_date: returnDate ? format(returnDate, 'yyyy-MM-dd') : undefined,
        passengers: `${passengers.adults},${passengers.children},${passengers.infants}`,
        cabin_class: 'economy'
      }

      const response = await flightService.search(params)
      // Extract the data from the response wrapper
      setResults(response.data || response)
      navigate('/search')
    } catch (error) {
      console.error('Search error:', error)
      toast.error('Failed to search flights. Please try again.')
      setLoading(false)
    }
  }

  const toggleButtonStyle = (isActive) => ({
    padding: '10px 20px',
    borderRadius: '24px',
    fontSize: '14px',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: isActive ? '#1a365d' : '#f3f4f6',
    color: isActive ? 'white' : '#4b5563',
    boxShadow: isActive ? '0 2px 8px rgba(26, 54, 93, 0.3)' : 'none'
  })

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '20px',
      padding: '32px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)'
    }}>
      {/* Trip Type Toggle */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '28px' }}>
        <button
          onClick={() => {
            setLocalTripType('roundtrip')
            setSearchParams({ tripType: 'roundtrip' })
          }}
          style={toggleButtonStyle(localTripType === 'roundtrip')}
        >
          Round Trip
        </button>
        <button
          onClick={() => {
            setLocalTripType('oneway')
            setSearchParams({ tripType: 'oneway', returnDate: null })
          }}
          style={toggleButtonStyle(localTripType === 'oneway')}
        >
          One Way
        </button>
      </div>

      {/* Search Form */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Row 1: Airports */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          alignItems: 'end'
        }}>
          <AirportInput
            label="From"
            placeholder="Where from?"
            value={origin}
            onChange={(airport) => setSearchParams({ origin: airport })}
          />

          {/* Swap Button - Only visible on larger screens */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end',
            paddingBottom: '4px'
          }}>
            <button
              onClick={swapAirports}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                border: '2px solid #e5e7eb',
                backgroundColor: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              title="Swap airports"
            >
              <ArrowLeftRight style={{ width: '18px', height: '18px', color: '#6b7280' }} />
            </button>
          </div>

          <AirportInput
            label="To"
            placeholder="Where to?"
            value={destination}
            onChange={(airport) => setSearchParams({ destination: airport })}
          />
        </div>

        {/* Row 2: Dates & Passengers */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: localTripType === 'roundtrip'
            ? 'repeat(auto-fit, minmax(150px, 1fr))'
            : 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          <DateInput
            label="Departure"
            value={departureDate}
            onChange={(date) => setSearchParams({ departureDate: date })}
          />

          {localTripType === 'roundtrip' && (
            <DateInput
              label="Return"
              value={returnDate}
              onChange={(date) => setSearchParams({ returnDate: date })}
              minDate={departureDate}
            />
          )}

          <PassengerSelector
            value={passengers}
            onChange={(p) => setSearchParams({ passengers: p })}
          />
        </div>
      </div>

      {/* Search Button */}
      <div style={{ marginTop: '28px' }}>
        <button
          onClick={handleSearch}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            width: '100%',
            maxWidth: '280px',
            padding: '16px 32px',
            backgroundColor: '#ed8936',
            color: 'white',
            fontSize: '18px',
            fontWeight: '600',
            border: 'none',
            borderRadius: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 14px rgba(237, 137, 54, 0.4)'
          }}
        >
          <Search style={{ width: '22px', height: '22px' }} />
          <span>Search Flights</span>
        </button>
      </div>
    </div>
  )
}
