import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, ArrowLeft, Shield, Luggage, Utensils, Check } from 'lucide-react'
import ProgressBar from '../../components/booking/ProgressBar'
import FlightSummary from '../../components/booking/FlightSummary'
import { useBookingStore } from '../../store/bookingStore'

const EXTRAS = {
  insurance: {
    id: 'insurance',
    name: 'Travel Insurance',
    description: 'Cancel for any reason, medical coverage, baggage protection',
    price: 49,
    icon: Shield
  },
  priorityBoarding: {
    id: 'priorityBoarding',
    name: 'Priority Boarding',
    description: 'Be among the first to board and secure overhead bin space',
    price: 15,
    icon: ArrowRight
  }
}

const BAGGAGE_OPTIONS = [
  { kg: 0, label: 'No extra baggage', price: 0 },
  { kg: 15, label: '+15 kg checked bag', price: 35 },
  { kg: 23, label: '+23 kg checked bag', price: 50 },
  { kg: 32, label: '+32 kg checked bag', price: 75 }
]

const MEAL_OPTIONS = [
  { id: 'standard', name: 'Standard Meal', price: 0 },
  { id: 'vegetarian', name: 'Vegetarian', price: 12 },
  { id: 'vegan', name: 'Vegan', price: 12 },
  { id: 'halal', name: 'Halal', price: 15 },
  { id: 'kosher', name: 'Kosher', price: 15 },
  { id: 'gluten-free', name: 'Gluten Free', price: 12 }
]

export default function ExtrasPage() {
  const navigate = useNavigate()
  const { extras, setExtras, passengers, nextStep, prevStep, calculatePricing } = useBookingStore()

  const [selectedMeals, setSelectedMeals] = useState(
    extras.meals.length > 0 ? extras.meals : passengers.map(() => 'standard')
  )

  const toggleExtra = (extraId) => {
    setExtras({ [extraId]: !extras[extraId] })
    calculatePricing()
  }

  const handleBaggageChange = (value) => {
    setExtras({ extraBaggage: parseInt(value) })
    calculatePricing()
  }

  const handleMealChange = (passengerIndex, mealId) => {
    const newMeals = [...selectedMeals]
    newMeals[passengerIndex] = mealId
    setSelectedMeals(newMeals)
    setExtras({ meals: newMeals })
    calculatePricing()
  }

  const handleContinue = () => {
    nextStep()
    navigate('/booking/payment')
  }

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
  }

  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <div className="container-app" style={{ padding: '24px 16px' }}>
        <ProgressBar currentStep={3} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '24px', marginTop: '24px' }}>
          {/* Main Content */}
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
              Enhance Your Trip
            </h1>
            <p style={{ color: '#6b7280', marginBottom: '24px' }}>
              Add extras to make your journey more comfortable
            </p>

            {/* Insurance & Priority */}
            <div style={cardStyle}>
              <h3 style={{ fontWeight: '600', color: '#111827', marginBottom: '20px' }}>
                Travel Protection & Convenience
              </h3>

              {Object.values(EXTRAS).map((extra) => {
                const Icon = extra.icon
                const isSelected = extras[extra.id]

                return (
                  <div
                    key={extra.id}
                    onClick={() => toggleExtra(extra.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px',
                      borderRadius: '8px',
                      border: `2px solid ${isSelected ? '#22c55e' : '#e5e7eb'}`,
                      backgroundColor: isSelected ? '#f0fdf4' : 'white',
                      marginBottom: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        backgroundColor: isSelected ? '#dcfce7' : '#dbeafe',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Icon style={{ width: '24px', height: '24px', color: isSelected ? '#22c55e' : '#1a365d' }} />
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', color: '#111827' }}>{extra.name}</div>
                        <div style={{ fontSize: '14px', color: '#6b7280' }}>{extra.description}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span style={{ fontWeight: '700', color: '#1a365d', fontSize: '18px' }}>
                        ${extra.price}
                      </span>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '4px',
                        border: `2px solid ${isSelected ? '#22c55e' : '#d1d5db'}`,
                        backgroundColor: isSelected ? '#22c55e' : 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {isSelected && <Check style={{ width: '16px', height: '16px', color: 'white' }} />}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Extra Baggage */}
            <div style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <Luggage style={{ width: '24px', height: '24px', color: '#1a365d' }} />
                <h3 style={{ fontWeight: '600', color: '#111827' }}>
                  Extra Baggage
                </h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                {BAGGAGE_OPTIONS.map((option) => (
                  <div
                    key={option.kg}
                    onClick={() => handleBaggageChange(option.kg)}
                    style={{
                      padding: '16px',
                      borderRadius: '8px',
                      border: `2px solid ${extras.extraBaggage === option.kg ? '#1a365d' : '#e5e7eb'}`,
                      backgroundColor: extras.extraBaggage === option.kg ? '#eff6ff' : 'white',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
                      {option.label}
                    </div>
                    <div style={{ fontWeight: '700', color: '#1a365d' }}>
                      {option.price === 0 ? 'Included' : `+$${option.price}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Meal Selection */}
            <div style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <Utensils style={{ width: '24px', height: '24px', color: '#1a365d' }} />
                <h3 style={{ fontWeight: '600', color: '#111827' }}>
                  In-Flight Meals
                </h3>
              </div>

              {passengers.map((passenger, index) => (
                <div key={index} style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    {passenger.firstName || `Passenger ${index + 1}`}
                  </label>
                  <select
                    value={selectedMeals[index] || 'standard'}
                    onChange={(e) => handleMealChange(index, e.target.value)}
                    style={{
                      width: '100%',
                      height: '44px',
                      padding: '0 12px',
                      fontSize: '16px',
                      color: '#111827',
                      backgroundColor: 'white',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    {MEAL_OPTIONS.map((meal) => (
                      <option key={meal.id} value={meal.id}>
                        {meal.name} {meal.price > 0 ? `(+$${meal.price})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            {/* Navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
              <button
                onClick={() => { prevStep(); navigate('/booking/seats') }}
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
                Continue to Payment
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
