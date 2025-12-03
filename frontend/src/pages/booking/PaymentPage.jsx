import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, ArrowLeft, CreditCard, Lock, Tag } from 'lucide-react'
import ProgressBar from '../../components/booking/ProgressBar'
import FlightSummary from '../../components/booking/FlightSummary'
import { useBookingStore } from '../../store/bookingStore'
import { useUserStore } from '../../store/userStore'

export default function PaymentPage() {
  const navigate = useNavigate()
  const {
    selectedFlight,
    passengers,
    seatAssignments,
    extras,
    contactInfo,
    pricing,
    fareClass,
    nextStep,
    prevStep,
    setBookingId,
    reset
  } = useBookingStore()
  const { addBooking, isAuthenticated } = useUserStore()

  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  })
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [errors, setErrors] = useState({})
  const [isProcessing, setIsProcessing] = useState(false)

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    return parts.length ? parts.join(' ') : value
  }

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  const handleCardChange = (field, value) => {
    let formattedValue = value
    if (field === 'number') {
      formattedValue = formatCardNumber(value)
    } else if (field === 'expiry') {
      formattedValue = formatExpiry(value)
    } else if (field === 'cvv') {
      formattedValue = value.replace(/[^0-9]/g, '').substring(0, 4)
    }
    setCardData({ ...cardData, [field]: formattedValue })
  }

  const applyPromoCode = () => {
    if (promoCode.toUpperCase() === 'SKYBOOK10') {
      setPromoApplied(true)
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!cardData.number || cardData.number.replace(/\s/g, '').length < 16) {
      newErrors.number = 'Valid card number required'
    }
    if (!cardData.name) newErrors.name = 'Cardholder name required'
    if (!cardData.expiry || cardData.expiry.length < 5) newErrors.expiry = 'Valid expiry required'
    if (!cardData.cvv || cardData.cvv.length < 3) newErrors.cvv = 'Valid CVV required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePayment = async () => {
    if (!validate()) return

    setIsProcessing(true)

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Generate booking reference
    const bookingId = 'BK-' + Math.random().toString(36).substring(2, 8).toUpperCase()
    setBookingId(bookingId)

    // Create booking record
    const booking = {
      id: bookingId,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      flight: selectedFlight,
      fareClass,
      passengers,
      seatAssignments,
      extras,
      contactInfo,
      pricing
    }

    // Add to user's bookings if authenticated
    if (isAuthenticated) {
      addBooking(booking)
    }

    nextStep()
    navigate('/booking/confirmation')
    setIsProcessing(false)
  }

  const inputStyle = {
    width: '100%',
    height: '48px',
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

  const finalTotal = promoApplied ? pricing?.total * 0.9 : pricing?.total

  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <div className="container-app" style={{ padding: '24px 16px' }}>
        <ProgressBar currentStep={4} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '24px', marginTop: '24px' }}>
          {/* Main Content */}
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
              Payment Details
            </h1>
            <p style={{ color: '#6b7280', marginBottom: '24px' }}>
              Complete your booking securely
            </p>

            {/* Promo Code */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '16px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <Tag style={{ width: '20px', height: '20px', color: '#1a365d' }} />
                <span style={{ fontWeight: '600', color: '#111827' }}>Promo Code</span>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  placeholder="Enter promo code"
                  disabled={promoApplied}
                  style={{
                    ...inputStyle,
                    flex: 1,
                    backgroundColor: promoApplied ? '#f0fdf4' : 'white',
                    borderColor: promoApplied ? '#22c55e' : '#e5e7eb'
                  }}
                />
                <button
                  onClick={applyPromoCode}
                  disabled={promoApplied || !promoCode}
                  style={{
                    padding: '0 24px',
                    backgroundColor: promoApplied ? '#22c55e' : '#1a365d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: promoApplied ? 'default' : 'pointer',
                    opacity: !promoCode ? 0.5 : 1
                  }}
                >
                  {promoApplied ? 'Applied!' : 'Apply'}
                </button>
              </div>
              {promoApplied && (
                <p style={{ fontSize: '14px', color: '#22c55e', marginTop: '8px' }}>
                  10% discount applied! You save ${(pricing?.total * 0.1).toFixed(2)}
                </p>
              )}
              <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px' }}>
                Try: SKYBOOK10 for 10% off
              </p>
            </div>

            {/* Card Details */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '16px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <CreditCard style={{ width: '24px', height: '24px', color: '#1a365d' }} />
                <h3 style={{ fontWeight: '600', color: '#111827' }}>Card Information</h3>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Card Number</label>
                <input
                  type="text"
                  value={cardData.number}
                  onChange={(e) => handleCardChange('number', e.target.value)}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  style={{
                    ...inputStyle,
                    borderColor: errors.number ? '#ef4444' : '#e5e7eb'
                  }}
                />
                {errors.number && (
                  <span style={{ fontSize: '12px', color: '#ef4444' }}>{errors.number}</span>
                )}
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Cardholder Name</label>
                <input
                  type="text"
                  value={cardData.name}
                  onChange={(e) => handleCardChange('name', e.target.value)}
                  placeholder="JOHN DOE"
                  style={{
                    ...inputStyle,
                    borderColor: errors.name ? '#ef4444' : '#e5e7eb'
                  }}
                />
                {errors.name && (
                  <span style={{ fontSize: '12px', color: '#ef4444' }}>{errors.name}</span>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Expiry Date</label>
                  <input
                    type="text"
                    value={cardData.expiry}
                    onChange={(e) => handleCardChange('expiry', e.target.value)}
                    placeholder="MM/YY"
                    maxLength={5}
                    style={{
                      ...inputStyle,
                      borderColor: errors.expiry ? '#ef4444' : '#e5e7eb'
                    }}
                  />
                  {errors.expiry && (
                    <span style={{ fontSize: '12px', color: '#ef4444' }}>{errors.expiry}</span>
                  )}
                </div>

                <div>
                  <label style={labelStyle}>CVV</label>
                  <input
                    type="text"
                    value={cardData.cvv}
                    onChange={(e) => handleCardChange('cvv', e.target.value)}
                    placeholder="123"
                    maxLength={4}
                    style={{
                      ...inputStyle,
                      borderColor: errors.cvv ? '#ef4444' : '#e5e7eb'
                    }}
                  />
                  {errors.cvv && (
                    <span style={{ fontSize: '12px', color: '#ef4444' }}>{errors.cvv}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px',
              backgroundColor: '#f0fdf4',
              borderRadius: '8px',
              marginBottom: '24px'
            }}>
              <Lock style={{ width: '20px', height: '20px', color: '#22c55e' }} />
              <div>
                <div style={{ fontWeight: '600', color: '#166534', fontSize: '14px' }}>
                  Secure Payment
                </div>
                <div style={{ fontSize: '12px', color: '#166534' }}>
                  Your payment information is encrypted and secure
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button
                onClick={() => { prevStep(); navigate('/booking/extras') }}
                disabled={isProcessing}
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
                  cursor: 'pointer',
                  opacity: isProcessing ? 0.5 : 1
                }}
              >
                <ArrowLeft style={{ width: '18px', height: '18px' }} />
                Back
              </button>

              <button
                onClick={handlePayment}
                disabled={isProcessing}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 32px',
                  backgroundColor: isProcessing ? '#9ca3af' : '#22c55e',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: '600',
                  fontSize: '16px',
                  cursor: isProcessing ? 'wait' : 'pointer'
                }}
              >
                {isProcessing ? (
                  <>Processing...</>
                ) : (
                  <>
                    Pay ${finalTotal?.toFixed(2)}
                    <Lock style={{ width: '18px', height: '18px' }} />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <FlightSummary />
            {promoApplied && (
              <div style={{
                marginTop: '16px',
                padding: '16px',
                backgroundColor: '#f0fdf4',
                borderRadius: '8px',
                border: '1px solid #22c55e'
              }}>
                <div style={{ fontWeight: '600', color: '#166534', marginBottom: '8px' }}>
                  Promo Discount Applied
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#166534' }}>Your savings</span>
                  <span style={{ fontWeight: '700', color: '#166534' }}>
                    -${(pricing?.total * 0.1).toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
