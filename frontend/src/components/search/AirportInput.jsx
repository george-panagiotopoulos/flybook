import { useState, useEffect, useRef } from 'react'
import { MapPin, Plane } from 'lucide-react'
import { useDebounce } from '../../hooks/useDebounce'
import { airportService } from '../../services/airportService'

export default function AirportInput({ label, placeholder, value, onChange }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const wrapperRef = useRef(null)
  const debouncedQuery = useDebounce(query, 250)

  useEffect(() => {
    async function fetchAirports() {
      if (debouncedQuery.length < 2) {
        setResults([])
        return
      }

      setLoading(true)
      try {
        const airports = await airportService.search(debouncedQuery)
        setResults(airports)
      } catch (error) {
        console.error('Failed to search airports:', error)
        setResults([])
      }
      setLoading(false)
    }

    fetchAirports()
  }, [debouncedQuery])

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (airport) => {
    onChange(airport)
    setQuery('')
    setIsOpen(false)
  }

  const inputStyles = {
    width: '100%',
    height: '48px',
    paddingLeft: '48px',
    paddingRight: '16px',
    fontSize: '16px',
    color: '#111827',
    backgroundColor: '#f9fafb',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    outline: 'none',
    transition: 'all 0.2s ease',
  }

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      <label style={{
        display: 'block',
        fontSize: '14px',
        fontWeight: '600',
        color: '#374151',
        marginBottom: '8px'
      }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <MapPin
          style={{
            position: 'absolute',
            left: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '20px',
            height: '20px',
            color: '#9ca3af',
            pointerEvents: 'none'
          }}
        />
        <input
          type="text"
          placeholder={placeholder}
          value={value ? `${value.city} (${value.code})` : query}
          onChange={(e) => {
            setQuery(e.target.value)
            if (value) onChange(null)
            setIsOpen(true)
          }}
          onFocus={(e) => {
            setIsOpen(true)
            e.target.style.backgroundColor = 'white'
            e.target.style.borderColor = '#1a365d'
          }}
          onBlur={(e) => {
            e.target.style.backgroundColor = '#f9fafb'
            e.target.style.borderColor = '#e5e7eb'
          }}
          style={inputStyles}
        />
      </div>

      {/* Dropdown */}
      {isOpen && (results.length > 0 || loading) && (
        <div style={{
          position: 'absolute',
          zIndex: 50,
          width: '100%',
          marginTop: '8px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
          border: '1px solid #e5e7eb',
          maxHeight: '280px',
          overflowY: 'auto'
        }}>
          {loading ? (
            <div style={{ padding: '16px', textAlign: 'center', color: '#6b7280' }}>
              Searching airports...
            </div>
          ) : (
            results.map((airport) => (
              <button
                key={airport.code}
                onClick={() => handleSelect(airport)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  border: 'none',
                  borderBottom: '1px solid #f3f4f6',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f9ff'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
              >
                <div style={{
                  flexShrink: 0,
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#dbeafe',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Plane style={{ width: '20px', height: '20px', color: '#1a365d' }} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: '600', color: '#111827' }}>
                    {airport.city} <span style={{ color: '#1a365d', fontWeight: '700' }}>({airport.code})</span>
                  </div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>{airport.name}</div>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}
