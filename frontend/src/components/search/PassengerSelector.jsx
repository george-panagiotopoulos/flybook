import { useState, useRef, useEffect } from 'react'
import { Users, Minus, Plus } from 'lucide-react'

export default function PassengerSelector({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef(null)

  const { adults = 1, children = 0, infants = 0 } = value

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const total = adults + children + infants

  const updateCount = (type, delta) => {
    const newValue = { ...value, [type]: Math.max(0, value[type] + delta) }
    if (type === 'adults' && newValue.adults < 1) return
    if (type === 'infants' && newValue.infants > newValue.adults) return
    onChange(newValue)
  }

  const CounterRow = ({ label, description, type, count, min = 0 }) => (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 0',
      borderBottom: '1px solid #f3f4f6'
    }}>
      <div>
        <div style={{ fontWeight: '600', color: '#111827' }}>{label}</div>
        <div style={{ fontSize: '14px', color: '#6b7280' }}>{description}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={() => updateCount(type, -1)}
          disabled={count <= min}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            border: '2px solid #e5e7eb',
            backgroundColor: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: count <= min ? 'not-allowed' : 'pointer',
            opacity: count <= min ? 0.4 : 1,
            transition: 'all 0.15s ease'
          }}
        >
          <Minus style={{ width: '16px', height: '16px', color: '#374151' }} />
        </button>
        <span style={{ width: '24px', textAlign: 'center', fontWeight: '700', fontSize: '18px', color: '#111827' }}>
          {count}
        </span>
        <button
          onClick={() => updateCount(type, 1)}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            border: '2px solid #e5e7eb',
            backgroundColor: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <Plus style={{ width: '16px', height: '16px', color: '#374151' }} />
        </button>
      </div>
    </div>
  )

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
    cursor: 'pointer',
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
        Travelers
      </label>
      <div style={{ position: 'relative' }}>
        <Users
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
          value={`${total} Traveler${total !== 1 ? 's' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          readOnly
          style={inputStyles}
        />
      </div>

      {isOpen && (
        <div style={{
          position: 'absolute',
          zIndex: 50,
          marginTop: '8px',
          width: '320px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
          border: '1px solid #e5e7eb',
          padding: '16px 20px'
        }}>
          <CounterRow label="Adults" description="Age 12+" type="adults" count={adults} min={1} />
          <CounterRow label="Children" description="Age 2-11" type="children" count={children} />
          <div style={{ borderBottom: 'none' }}>
            <CounterRow label="Infants" description="Under 2" type="infants" count={infants} />
          </div>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              width: '100%',
              marginTop: '16px',
              padding: '12px',
              backgroundColor: '#1a365d',
              color: 'white',
              fontWeight: '600',
              fontSize: '16px',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease'
            }}
          >
            Done
          </button>
        </div>
      )}
    </div>
  )
}
