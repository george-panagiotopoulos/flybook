import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { CheckCircle, Plane, Calendar, Users, Download, Home, List } from 'lucide-react'
import ProgressBar from '../../components/booking/ProgressBar'
import { useBookingStore } from '../../store/bookingStore'
import { formatDuration, formatPrice } from '../../utils/formatters'

export default function ConfirmationPage() {
  const navigate = useNavigate()
  const {
    bookingId,
    selectedFlight,
    passengers,
    seatAssignments,
    extras,
    contactInfo,
    pricing,
    resetBooking
  } = useBookingStore()

  useEffect(() => {
    if (!bookingId) {
      navigate('/search')
    }
  }, [bookingId, navigate])

  const handleNewBooking = () => {
    resetBooking()
    navigate('/search')
  }

  if (!bookingId || !selectedFlight) return null

  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <div className="container-app" style={{ padding: '24px 16px' }}>
        <ProgressBar currentStep={5} />

        <div style={{ maxWidth: '800px', margin: '0 auto', marginTop: '24px' }}>
          {/* Success Header */}
          <div style={{
            backgroundColor: '#f0fdf4',
            borderRadius: '16px',
            padding: '40px',
            textAlign: 'center',
            marginBottom: '24px'
          }}>
            <CheckCircle style={{
              width: '64px',
              height: '64px',
              color: '#22c55e',
              margin: '0 auto 16px'
            }} />
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#166534', marginBottom: '8px' }}>
              Booking Confirmed!
            </h1>
            <p style={{ color: '#166534', marginBottom: '16px' }}>
              Your flight has been successfully booked
            </p>
            <div style={{
              display: 'inline-block',
              backgroundColor: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              border: '2px solid #22c55e'
            }}>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Booking Reference</div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#1a365d', letterSpacing: '2px' }}>
                {bookingId}
              </div>
            </div>
          </div>

          {/* Confirmation sent notice */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}>
            <p style={{ color: '#374151', textAlign: 'center' }}>
              A confirmation email has been sent to <strong>{contactInfo.email}</strong>
            </p>
          </div>

          {/* Flight Details */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <Plane style={{ width: '24px', height: '24px', color: '#1a365d' }} />
              <h3 style={{ fontWeight: '600', color: '#111827' }}>Flight Details</h3>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '20px',
              backgroundColor: '#f9fafb',
              borderRadius: '8px'
            }}>
              <div>
                <div style={{ fontSize: '32px', fontWeight: '700', color: '#111827' }}>
                  {selectedFlight.departure.local_time}
                </div>
                <div style={{ fontSize: '18px', fontWeight: '600', color: '#374151' }}>
                  {selectedFlight.departure.airport}
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>
                  {selectedFlight.departure.city}
                </div>
              </div>

              <div style={{ textAlign: 'center', flex: 1, padding: '0 24px' }}>
                <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
                  {formatDuration(selectedFlight.duration_minutes)}
                </div>
                <div style={{
                  height: '2px',
                  backgroundColor: '#e5e7eb',
                  position: 'relative'
                }}>
                  <Plane style={{
                    width: '20px',
                    height: '20px',
                    color: '#1a365d',
                    position: 'absolute',
                    top: '-9px',
                    left: '50%',
                    transform: 'translateX(-50%)'
                  }} />
                </div>
                <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px' }}>
                  {selectedFlight.airline_name} {selectedFlight.flight_number}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '32px', fontWeight: '700', color: '#111827' }}>
                  {selectedFlight.arrival.local_time}
                </div>
                <div style={{ fontSize: '18px', fontWeight: '600', color: '#374151' }}>
                  {selectedFlight.arrival.airport}
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>
                  {selectedFlight.arrival.city}
                </div>
              </div>
            </div>
          </div>

          {/* Passengers & Seats */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <Users style={{ width: '24px', height: '24px', color: '#1a365d' }} />
              <h3 style={{ fontWeight: '600', color: '#111827' }}>Passengers</h3>
            </div>

            {passengers.map((passenger, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  marginBottom: '8px'
                }}
              >
                <div>
                  <div style={{ fontWeight: '600', color: '#111827' }}>
                    {passenger.title} {passenger.firstName} {passenger.lastName}
                  </div>
                  <div style={{ fontSize: '14px', color: '#6b7280', textTransform: 'capitalize' }}>
                    {passenger.type}
                  </div>
                </div>
                {seatAssignments[index] && (
                  <div style={{
                    padding: '6px 12px',
                    backgroundColor: '#1a365d',
                    color: 'white',
                    borderRadius: '4px',
                    fontWeight: '600'
                  }}>
                    Seat {seatAssignments[index].id}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Extras */}
          {(extras.insurance || extras.priorityBoarding || extras.extraBaggage > 0) && (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '24px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}>
              <h3 style={{ fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
                Extras Included
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {extras.insurance && (
                  <span style={{
                    padding: '6px 12px',
                    backgroundColor: '#dbeafe',
                    color: '#1e40af',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    Travel Insurance
                  </span>
                )}
                {extras.priorityBoarding && (
                  <span style={{
                    padding: '6px 12px',
                    backgroundColor: '#dbeafe',
                    color: '#1e40af',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    Priority Boarding
                  </span>
                )}
                {extras.extraBaggage > 0 && (
                  <span style={{
                    padding: '6px 12px',
                    backgroundColor: '#dbeafe',
                    color: '#1e40af',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    +{extras.extraBaggage}kg Baggage
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Total Paid */}
          <div style={{
            backgroundColor: '#1a365d',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ color: 'white', fontSize: '18px', fontWeight: '600' }}>
              Total Paid
            </span>
            <span style={{ color: 'white', fontSize: '32px', fontWeight: '700' }}>
              {formatPrice(pricing?.total)}
            </span>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button
              onClick={() => window.print()}
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
              <Download style={{ width: '18px', height: '18px' }} />
              Download Itinerary
            </button>

            <Link
              to="/my-trips"
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
                textDecoration: 'none'
              }}
            >
              <List style={{ width: '18px', height: '18px' }} />
              View My Trips
            </Link>

            <button
              onClick={handleNewBooking}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                backgroundColor: '#ed8936',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              <Home style={{ width: '18px', height: '18px' }} />
              Book Another Flight
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
