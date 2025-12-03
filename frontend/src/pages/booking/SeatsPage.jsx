import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import ProgressBar from '../../components/booking/ProgressBar'
import FlightSummary from '../../components/booking/FlightSummary'
import { useBookingStore } from '../../store/bookingStore'

// Generate seat map
const generateSeatMap = () => {
  const rows = []
  for (let row = 1; row <= 30; row++) {
    const seats = ['A', 'B', 'C', 'D', 'E', 'F'].map(col => {
      const isOccupied = Math.random() > 0.7
      const isExit = row === 10 || row === 20
      const isExtraLegroom = row <= 3 || isExit
      return {
        id: `${row}${col}`,
        row,
        col,
        isOccupied,
        isExit,
        isExtraLegroom,
        price: isExtraLegroom ? 35 : 0
      }
    })
    rows.push({ row, seats })
  }
  return rows
}

const SEAT_MAP = generateSeatMap()

export default function SeatsPage() {
  const navigate = useNavigate()
  const { passengers, seatAssignments, assignSeat, nextStep, prevStep, calculatePricing } = useBookingStore()
  const [selectedPassenger, setSelectedPassenger] = useState(0)

  const handleSeatClick = (seat) => {
    if (seat.isOccupied) return
    assignSeat(selectedPassenger, seat)
    calculatePricing()

    // Auto-advance to next passenger
    if (selectedPassenger < passengers.length - 1) {
      setSelectedPassenger(selectedPassenger + 1)
    }
  }

  const handleContinue = () => {
    nextStep()
    navigate('/booking/extras')
  }

  const getSeatColor = (seat) => {
    // Check if selected by any passenger
    const selectedBy = Object.entries(seatAssignments).find(([_, s]) => s?.id === seat.id)
    if (selectedBy) return '#22c55e'
    if (seat.isOccupied) return '#d1d5db'
    if (seat.isExtraLegroom) return '#3b82f6'
    return '#1a365d'
  }

  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <div className="container-app" style={{ padding: '24px 16px' }}>
        <ProgressBar currentStep={2} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '24px', marginTop: '24px' }}>
          {/* Main Content */}
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
              Choose Your Seats
            </h1>
            <p style={{ color: '#6b7280', marginBottom: '24px' }}>
              Select seats for each passenger (optional)
            </p>

            {/* Passenger Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
              {passengers.map((p, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedPassenger(i)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: '600',
                    cursor: 'pointer',
                    backgroundColor: selectedPassenger === i ? '#1a365d' : '#e5e7eb',
                    color: selectedPassenger === i ? 'white' : '#374151'
                  }}
                >
                  {p.firstName || `Passenger ${i + 1}`}
                  {seatAssignments[i] && (
                    <span style={{ marginLeft: '8px', opacity: 0.8 }}>
                      ({seatAssignments[i].id})
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Legend */}
            <div style={{
              display: 'flex',
              gap: '24px',
              marginBottom: '24px',
              padding: '16px',
              backgroundColor: 'white',
              borderRadius: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '24px', height: '24px', backgroundColor: '#1a365d', borderRadius: '4px' }} />
                <span style={{ fontSize: '14px', color: '#374151' }}>Available</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '24px', height: '24px', backgroundColor: '#3b82f6', borderRadius: '4px' }} />
                <span style={{ fontSize: '14px', color: '#374151' }}>Extra Legroom ($35)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '24px', height: '24px', backgroundColor: '#22c55e', borderRadius: '4px' }} />
                <span style={{ fontSize: '14px', color: '#374151' }}>Selected</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '24px', height: '24px', backgroundColor: '#d1d5db', borderRadius: '4px' }} />
                <span style={{ fontSize: '14px', color: '#374151' }}>Occupied</span>
              </div>
            </div>

            {/* Seat Map */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              maxHeight: '500px',
              overflowY: 'auto'
            }}>
              {/* Column Headers */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
                {['A', 'B', 'C', '', 'D', 'E', 'F'].map((col, i) => (
                  <div key={i} style={{
                    width: col ? '40px' : '24px',
                    textAlign: 'center',
                    fontWeight: '600',
                    color: '#6b7280',
                    fontSize: '14px'
                  }}>
                    {col}
                  </div>
                ))}
              </div>

              {/* Rows */}
              {SEAT_MAP.map(({ row, seats }) => (
                <div key={row} style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px'
                }}>
                  {seats.slice(0, 3).map(seat => (
                    <button
                      key={seat.id}
                      onClick={() => handleSeatClick(seat)}
                      disabled={seat.isOccupied}
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '6px',
                        border: 'none',
                        backgroundColor: getSeatColor(seat),
                        color: 'white',
                        fontWeight: '600',
                        fontSize: '12px',
                        cursor: seat.isOccupied ? 'not-allowed' : 'pointer',
                        transition: 'transform 0.1s'
                      }}
                    >
                      {seat.id}
                    </button>
                  ))}

                  {/* Aisle & Row Number */}
                  <div style={{
                    width: '24px',
                    textAlign: 'center',
                    fontWeight: '500',
                    color: '#9ca3af',
                    fontSize: '12px'
                  }}>
                    {row}
                  </div>

                  {seats.slice(3).map(seat => (
                    <button
                      key={seat.id}
                      onClick={() => handleSeatClick(seat)}
                      disabled={seat.isOccupied}
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '6px',
                        border: 'none',
                        backgroundColor: getSeatColor(seat),
                        color: 'white',
                        fontWeight: '600',
                        fontSize: '12px',
                        cursor: seat.isOccupied ? 'not-allowed' : 'pointer',
                        transition: 'transform 0.1s'
                      }}
                    >
                      {seat.id}
                    </button>
                  ))}
                </div>
              ))}
            </div>

            {/* Navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
              <button
                onClick={() => { prevStep(); navigate('/booking/passengers') }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  backgroundColor: 'white',
                  color: '#374151',
                  border: '2px solid #e5e7eb',
                  borderRadius: '10px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                <ArrowLeft style={{ width: '18px', height: '18px' }} />
                Back
              </button>

              <button
                onClick={handleContinue}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 32px',
                  backgroundColor: '#ed8936',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: '600',
                  fontSize: '16px',
                  cursor: 'pointer'
                }}
              >
                Continue to Extras
                <ArrowRight style={{ width: '18px', height: '18px' }} />
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <FlightSummary />
          </div>
        </div>
      </div>
    </div>
  )
}
