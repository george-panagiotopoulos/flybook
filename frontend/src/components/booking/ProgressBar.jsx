import { Check } from 'lucide-react'

const steps = [
  { number: 1, label: 'Passengers' },
  { number: 2, label: 'Seats' },
  { number: 3, label: 'Extras' },
  { number: 4, label: 'Payment' },
  { number: 5, label: 'Confirmation' }
]

export default function ProgressBar({ currentStep }) {
  return (
    <div style={{ padding: '24px 0' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        {steps.map((step, index) => (
          <div key={step.number} style={{ display: 'flex', alignItems: 'center' }}>
            {/* Step Circle */}
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '600',
              fontSize: '14px',
              backgroundColor: currentStep > step.number ? '#22c55e' :
                             currentStep === step.number ? '#1a365d' : '#e5e7eb',
              color: currentStep >= step.number ? 'white' : '#6b7280',
              transition: 'all 0.3s ease'
            }}>
              {currentStep > step.number ? (
                <Check style={{ width: '20px', height: '20px' }} />
              ) : (
                step.number
              )}
            </div>

            {/* Step Label */}
            <span style={{
              marginLeft: '8px',
              fontSize: '14px',
              fontWeight: currentStep === step.number ? '600' : '400',
              color: currentStep >= step.number ? '#111827' : '#9ca3af',
              display: index < steps.length - 1 ? 'none' : 'block'
            }}>
              {step.label}
            </span>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div style={{
                flex: 1,
                height: '2px',
                margin: '0 8px',
                backgroundColor: currentStep > step.number ? '#22c55e' : '#e5e7eb',
                minWidth: '40px',
                transition: 'background-color 0.3s ease'
              }} />
            )}
          </div>
        ))}
      </div>

      {/* Current Step Label (Mobile) */}
      <div style={{
        textAlign: 'center',
        marginTop: '16px',
        fontSize: '16px',
        fontWeight: '600',
        color: '#1a365d'
      }}>
        Step {currentStep}: {steps.find(s => s.number === currentStep)?.label}
      </div>
    </div>
  )
}
