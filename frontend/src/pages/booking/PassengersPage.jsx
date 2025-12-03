import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, ArrowRight, ArrowLeft } from 'lucide-react'
import ProgressBar from '../../components/booking/ProgressBar'
import FlightSummary from '../../components/booking/FlightSummary'
import { useBookingStore } from '../../store/bookingStore'
import { useSearchStore } from '../../store/searchStore'

export default function PassengersPage() {
  const navigate = useNavigate()
  const { selectedFlight, passengers, setPassengers, setContactInfo, contactInfo, nextStep } = useBookingStore()
  const { passengers: searchPassengers } = useSearchStore()

  const totalPassengers = searchPassengers.adults + searchPassengers.children + searchPassengers.infants

  const [forms, setForms] = useState(() => {
    if (passengers.length > 0) return passengers
    return Array(totalPassengers).fill(null).map((_, i) => ({
      type: i < searchPassengers.adults ? 'adult' : i < searchPassengers.adults + searchPassengers.children ? 'child' : 'infant',
      title: '',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      nationality: 'US'
    }))
  })

  const [contact, setContact] = useState(contactInfo)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!selectedFlight) {
      navigate('/search')
    }
  }, [selectedFlight, navigate])

  const updateForm = (index, field, value) => {
    const newForms = [...forms]
    newForms[index] = { ...newForms[index], [field]: value }
    setForms(newForms)
  }

  const validate = () => {
    const newErrors = {}

    forms.forEach((form, i) => {
      if (!form.firstName) newErrors[`${i}-firstName`] = 'Required'
      if (!form.lastName) newErrors[`${i}-lastName`] = 'Required'
      if (!form.dateOfBirth) newErrors[`${i}-dateOfBirth`] = 'Required'
    })

    if (!contact.email) newErrors['email'] = 'Required'
    if (!contact.phone) newErrors['phone'] = 'Required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleContinue = () => {
    if (validate()) {
      setPassengers(forms)
      setContactInfo(contact)
      nextStep()
      navigate('/booking/seats')
    }
  }

  const inputStyle = {
    width: '100%',
    height: '44px',
    padding: '0 12px',
    fontSize: '16px',
    color: '#111827',
    backgroundColor: 'white',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    outline: 'none'
  }

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '6px'
  }

  if (!selectedFlight) return null

  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <div className="container-app" style={{ padding: '24px 16px' }}>
        <ProgressBar currentStep={1} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '24px', marginTop: '24px' }}>
          {/* Main Content */}
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', marginBottom: '24px' }}>
              Passenger Details
            </h1>

            {/* Passenger Forms */}
            {forms.map((form, index) => (
              <div key={index} style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '24px',
                marginBottom: '16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#dbeafe',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <User style={{ width: '20px', height: '20px', color: '#1a365d' }} />
                  </div>
                  <div>
                    <h3 style={{ fontWeight: '600', color: '#111827' }}>
                      Passenger {index + 1}
                    </h3>
                    <span style={{ fontSize: '14px', color: '#6b7280', textTransform: 'capitalize' }}>
                      {form.type}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>Title</label>
                    <select
                      value={form.title}
                      onChange={(e) => updateForm(index, 'title', e.target.value)}
                      style={inputStyle}
                    >
                      <option value="">Select</option>
                      <option value="Mr">Mr</option>
                      <option value="Mrs">Mrs</option>
                      <option value="Ms">Ms</option>
                      <option value="Dr">Dr</option>
                    </select>
                  </div>

                  <div>
                    <label style={labelStyle}>First Name *</label>
                    <input
                      type="text"
                      value={form.firstName}
                      onChange={(e) => updateForm(index, 'firstName', e.target.value)}
                      style={{
                        ...inputStyle,
                        borderColor: errors[`${index}-firstName`] ? '#ef4444' : '#e5e7eb'
                      }}
                      placeholder="As on passport"
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>Last Name *</label>
                    <input
                      type="text"
                      value={form.lastName}
                      onChange={(e) => updateForm(index, 'lastName', e.target.value)}
                      style={{
                        ...inputStyle,
                        borderColor: errors[`${index}-lastName`] ? '#ef4444' : '#e5e7eb'
                      }}
                      placeholder="As on passport"
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>Date of Birth *</label>
                    <input
                      type="date"
                      value={form.dateOfBirth}
                      onChange={(e) => updateForm(index, 'dateOfBirth', e.target.value)}
                      style={{
                        ...inputStyle,
                        borderColor: errors[`${index}-dateOfBirth`] ? '#ef4444' : '#e5e7eb'
                      }}
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>Nationality</label>
                    <select
                      value={form.nationality}
                      onChange={(e) => updateForm(index, 'nationality', e.target.value)}
                      style={inputStyle}
                    >
                      <option value="US">United States</option>
                      <option value="GB">United Kingdom</option>
                      <option value="CA">Canada</option>
                      <option value="AU">Australia</option>
                      <option value="DE">Germany</option>
                      <option value="FR">France</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}

            {/* Contact Information */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '16px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}>
              <h3 style={{ fontWeight: '600', color: '#111827', marginBottom: '20px' }}>
                Contact Information
              </h3>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>
                We'll send your booking confirmation and updates here.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Email *</label>
                  <input
                    type="email"
                    value={contact.email}
                    onChange={(e) => setContact({ ...contact, email: e.target.value })}
                    style={{
                      ...inputStyle,
                      borderColor: errors['email'] ? '#ef4444' : '#e5e7eb'
                    }}
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label style={labelStyle}>Phone *</label>
                  <input
                    type="tel"
                    value={contact.phone}
                    onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                    style={{
                      ...inputStyle,
                      borderColor: errors['phone'] ? '#ef4444' : '#e5e7eb'
                    }}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
              <button
                onClick={() => navigate('/search')}
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
                Back to Search
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
                Continue to Seats
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
