import { useState, useRef, useEffect } from 'react'
import { Calendar } from 'lucide-react'
import { DayPicker } from 'react-day-picker'
import { format } from 'date-fns'
import 'react-day-picker/dist/style.css'

export default function DateInput({ label, value, onChange, minDate }) {
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (date) => {
    onChange(date)
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
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <Calendar
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
          placeholder="Select date"
          value={value ? format(value, 'EEE, MMM d') : ''}
          onClick={() => setIsOpen(true)}
          readOnly
          style={inputStyles}
        />
      </div>

      {isOpen && (
        <div style={{
          position: 'absolute',
          zIndex: 50,
          marginTop: '8px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
          border: '1px solid #e5e7eb',
          padding: '12px'
        }}>
          <DayPicker
            mode="single"
            selected={value}
            onSelect={handleSelect}
            disabled={{ before: minDate || new Date() }}
            modifiersStyles={{
              selected: { backgroundColor: '#1a365d', color: 'white' },
              today: { color: '#ed8936', fontWeight: 'bold' }
            }}
          />
        </div>
      )}
    </div>
  )
}
