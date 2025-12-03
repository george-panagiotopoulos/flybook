import { Plane, Clock } from 'lucide-react'
import { useBookingStore } from '../../store/bookingStore'
import { formatDuration, formatPrice } from '../../utils/formatters'

export default function FlightSummary() {
  const { selectedFlight, fareClass, pricing, calculatePricing } = useBookingStore()

  if (!selectedFlight) return null

  const currentPricing = pricing || calculatePricing()

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      border: '1px solid #e5e7eb'
    }}>
      <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
        Flight Summary
      </h3>

      {/* Flight Info */}
      <div style={{
        padding: '16px',
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
        marginBottom: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Plane style={{ width: '18px', height: '18px', color: '#1a365d' }} />
          <span style={{ fontWeight: '600', color: '#111827' }}>
            {selectedFlight.airline_name} {selectedFlight.flight_number}
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#111827' }}>
              {selectedFlight.departure.local_time}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>
              {selectedFlight.departure.airport}
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <Clock style={{ width: '16px', height: '16px', color: '#9ca3af', margin: '0 auto' }} />
            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
              {formatDuration(selectedFlight.duration_minutes)}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#111827' }}>
              {selectedFlight.arrival.local_time}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>
              {selectedFlight.arrival.airport}
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Breakdown */}
      {currentPricing && (
        <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: '#6b7280' }}>
              Base fare ({currentPricing.passengerCount} passenger{currentPricing.passengerCount > 1 ? 's' : ''})
            </span>
            <span style={{ color: '#111827' }}>{formatPrice(currentPricing.baseTotal)}</span>
          </div>

          {currentPricing.extrasTotal > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#6b7280' }}>Extras</span>
              <span style={{ color: '#111827' }}>{formatPrice(currentPricing.extrasTotal)}</span>
            </div>
          )}

          {currentPricing.seatFees > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#6b7280' }}>Seat selection</span>
              <span style={{ color: '#111827' }}>{formatPrice(currentPricing.seatFees)}</span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ color: '#6b7280' }}>Taxes & fees</span>
            <span style={{ color: '#111827' }}>{formatPrice(currentPricing.taxes)}</span>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            paddingTop: '12px',
            borderTop: '2px solid #e5e7eb'
          }}>
            <span style={{ fontWeight: '700', color: '#111827', fontSize: '18px' }}>Total</span>
            <span style={{ fontWeight: '700', color: '#1a365d', fontSize: '24px' }}>
              {formatPrice(currentPricing.total)}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
