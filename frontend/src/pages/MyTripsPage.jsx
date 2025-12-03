import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plane, Calendar, Clock, ChevronRight, Search, Filter } from 'lucide-react'
import { useUserStore } from '../store/userStore'
import { formatDuration, formatPrice } from '../utils/formatters'

export default function MyTripsPage() {
  const { bookings, isAuthenticated } = useUserStore()
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredBookings = bookings.filter(booking => {
    const matchesFilter = filter === 'all' || booking.status === filter
    const matchesSearch = searchQuery === '' ||
      booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.flight.departure.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.flight.arrival.city.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return { bg: '#dcfce7', text: '#166534' }
      case 'completed': return { bg: '#dbeafe', text: '#1e40af' }
      case 'cancelled': return { bg: '#fee2e2', text: '#991b1b' }
      default: return { bg: '#f3f4f6', text: '#374151' }
    }
  }

  if (!isAuthenticated) {
    return (
      <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>
        <div className="container-app" style={{ padding: '48px 16px', textAlign: 'center' }}>
          <Plane style={{ width: '64px', height: '64px', color: '#9ca3af', margin: '0 auto 24px' }} />
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', marginBottom: '16px' }}>
            View Your Trips
          </h1>
          <p style={{ color: '#6b7280', marginBottom: '24px' }}>
            Sign in to view your booking history and manage your trips
          </p>
          <Link
            to="/login"
            style={{
              display: 'inline-block',
              padding: '12px 32px',
              backgroundColor: '#1a365d',
              color: 'white',
              borderRadius: '10px',
              fontWeight: '600',
              textDecoration: 'none'
            }}
          >
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <div className="container-app" style={{ padding: '24px 16px' }}>
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
            My Trips
          </h1>
          <p style={{ color: '#6b7280' }}>
            View and manage your flight bookings
          </p>
        </div>

        {/* Search & Filter */}
        <div style={{
          display: 'flex',
          gap: '16px',
          marginBottom: '24px',
          flexWrap: 'wrap'
        }}>
          <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
            <Search style={{
              width: '20px',
              height: '20px',
              color: '#9ca3af',
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)'
            }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by booking ID or city..."
              style={{
                width: '100%',
                height: '44px',
                padding: '0 12px 0 44px',
                fontSize: '16px',
                color: '#111827',
                backgroundColor: 'white',
                border: '2px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {['all', 'confirmed', 'completed', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                style={{
                  padding: '10px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: '500',
                  cursor: 'pointer',
                  backgroundColor: filter === status ? '#1a365d' : 'white',
                  color: filter === status ? 'white' : '#374151',
                  textTransform: 'capitalize'
                }}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '48px',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}>
            <Plane style={{ width: '48px', height: '48px', color: '#9ca3af', margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
              No trips found
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '24px' }}>
              {filter !== 'all' ? `No ${filter} trips yet.` : "You haven't made any bookings yet."}
            </p>
            <Link
              to="/search"
              style={{
                display: 'inline-block',
                padding: '12px 24px',
                backgroundColor: '#ed8936',
                color: 'white',
                borderRadius: '8px',
                fontWeight: '600',
                textDecoration: 'none'
              }}
            >
              Book a Flight
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredBookings.map((booking) => {
              const statusColors = getStatusColor(booking.status)

              return (
                <div
                  key={booking.id}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '24px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    cursor: 'pointer'
                  }}
                >
                  {/* Header */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '20px'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                        <span style={{ fontWeight: '700', color: '#1a365d', fontSize: '18px' }}>
                          {booking.id}
                        </span>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600',
                          backgroundColor: statusColors.bg,
                          color: statusColors.text,
                          textTransform: 'capitalize'
                        }}>
                          {booking.status}
                        </span>
                      </div>
                      <div style={{ fontSize: '14px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Calendar style={{ width: '14px', height: '14px' }} />
                        Booked on {new Date(booking.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: '700', color: '#1a365d', fontSize: '24px' }}>
                        {formatPrice(booking.pricing.total)}
                      </div>
                      <div style={{ fontSize: '14px', color: '#6b7280' }}>
                        {booking.passengers.length} passenger{booking.passengers.length > 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>

                  {/* Flight Details */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '20px',
                    backgroundColor: '#f9fafb',
                    borderRadius: '8px'
                  }}>
                    <div>
                      <div style={{ fontSize: '24px', fontWeight: '700', color: '#111827' }}>
                        {booking.flight.departure.local_time}
                      </div>
                      <div style={{ fontWeight: '600', color: '#374151' }}>
                        {booking.flight.departure.airport}
                      </div>
                      <div style={{ fontSize: '14px', color: '#6b7280' }}>
                        {booking.flight.departure.city}
                      </div>
                    </div>

                    <div style={{ textAlign: 'center', flex: 1, padding: '0 24px' }}>
                      <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
                        <Clock style={{ width: '14px', height: '14px', display: 'inline', marginRight: '4px' }} />
                        {formatDuration(booking.flight.duration_minutes)}
                      </div>
                      <div style={{
                        height: '2px',
                        backgroundColor: '#e5e7eb',
                        position: 'relative'
                      }}>
                        <Plane style={{
                          width: '18px',
                          height: '18px',
                          color: '#1a365d',
                          position: 'absolute',
                          top: '-8px',
                          left: '50%',
                          transform: 'translateX(-50%)'
                        }} />
                      </div>
                      <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px' }}>
                        {booking.flight.airline_name} {booking.flight.flight_number}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '24px', fontWeight: '700', color: '#111827' }}>
                        {booking.flight.arrival.local_time}
                      </div>
                      <div style={{ fontWeight: '600', color: '#374151' }}>
                        {booking.flight.arrival.airport}
                      </div>
                      <div style={{ fontSize: '14px', color: '#6b7280' }}>
                        {booking.flight.arrival.city}
                      </div>
                    </div>
                  </div>

                  {/* Passengers */}
                  <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {booking.passengers.map((passenger, i) => (
                      <span
                        key={i}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#f3f4f6',
                          borderRadius: '20px',
                          fontSize: '14px',
                          color: '#374151'
                        }}
                      >
                        {passenger.firstName} {passenger.lastName}
                      </span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
