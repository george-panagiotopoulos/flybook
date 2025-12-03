import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plane, Mail, Lock, User, Phone, Eye, EyeOff } from 'lucide-react'
import { useUserStore } from '../store/userStore'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useUserStore()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
    if (errors[field]) {
      setErrors({ ...errors, [field]: null })
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.firstName) newErrors.firstName = 'First name is required'
    if (!formData.lastName) newErrors.lastName = 'Last name is required'
    if (!formData.email) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format'
    if (!formData.password) newErrors.password = 'Password is required'
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters'
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setIsLoading(true)

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))

    const result = register({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone
    })

    if (result.success) {
      toast.success('Account created successfully!')
      navigate('/search')
    } else {
      setErrors({ email: result.error || 'Registration failed' })
    }

    setIsLoading(false)
  }

  const inputStyle = {
    width: '100%',
    height: '48px',
    padding: '0 12px 0 44px',
    fontSize: '16px',
    color: '#111827',
    backgroundColor: 'white',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    outline: 'none'
  }

  return (
    <div style={{
      backgroundColor: '#f9fafb',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '450px',
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '40px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            backgroundColor: '#1a365d',
            borderRadius: '16px',
            marginBottom: '16px'
          }}>
            <Plane style={{ width: '32px', height: '32px', color: 'white' }} />
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
            Create Account
          </h1>
          <p style={{ color: '#6b7280' }}>
            Join SkyBook and start booking flights
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Name Fields */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div style={{ position: 'relative' }}>
              <User style={{
                width: '20px',
                height: '20px',
                color: '#9ca3af',
                position: 'absolute',
                left: '12px',
                top: '14px'
              }} />
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                placeholder="First name"
                style={{
                  ...inputStyle,
                  borderColor: errors.firstName ? '#ef4444' : '#e5e7eb'
                }}
              />
            </div>
            <div style={{ position: 'relative' }}>
              <User style={{
                width: '20px',
                height: '20px',
                color: '#9ca3af',
                position: 'absolute',
                left: '12px',
                top: '14px'
              }} />
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                placeholder="Last name"
                style={{
                  ...inputStyle,
                  borderColor: errors.lastName ? '#ef4444' : '#e5e7eb'
                }}
              />
            </div>
          </div>

          {/* Email */}
          <div style={{ marginBottom: '16px', position: 'relative' }}>
            <Mail style={{
              width: '20px',
              height: '20px',
              color: '#9ca3af',
              position: 'absolute',
              left: '12px',
              top: '14px'
            }} />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="Email address"
              style={{
                ...inputStyle,
                borderColor: errors.email ? '#ef4444' : '#e5e7eb'
              }}
            />
            {errors.email && (
              <span style={{ fontSize: '12px', color: '#ef4444' }}>{errors.email}</span>
            )}
          </div>

          {/* Phone */}
          <div style={{ marginBottom: '16px', position: 'relative' }}>
            <Phone style={{
              width: '20px',
              height: '20px',
              color: '#9ca3af',
              position: 'absolute',
              left: '12px',
              top: '14px'
            }} />
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="Phone number (optional)"
              style={inputStyle}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: '16px', position: 'relative' }}>
            <Lock style={{
              width: '20px',
              height: '20px',
              color: '#9ca3af',
              position: 'absolute',
              left: '12px',
              top: '14px'
            }} />
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              placeholder="Password"
              style={{
                ...inputStyle,
                paddingRight: '44px',
                borderColor: errors.password ? '#ef4444' : '#e5e7eb'
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '14px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0
              }}
            >
              {showPassword ? (
                <EyeOff style={{ width: '20px', height: '20px', color: '#9ca3af' }} />
              ) : (
                <Eye style={{ width: '20px', height: '20px', color: '#9ca3af' }} />
              )}
            </button>
            {errors.password && (
              <span style={{ fontSize: '12px', color: '#ef4444' }}>{errors.password}</span>
            )}
          </div>

          {/* Confirm Password */}
          <div style={{ marginBottom: '24px', position: 'relative' }}>
            <Lock style={{
              width: '20px',
              height: '20px',
              color: '#9ca3af',
              position: 'absolute',
              left: '12px',
              top: '14px'
            }} />
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              placeholder="Confirm password"
              style={{
                ...inputStyle,
                borderColor: errors.confirmPassword ? '#ef4444' : '#e5e7eb'
              }}
            />
            {errors.confirmPassword && (
              <span style={{ fontSize: '12px', color: '#ef4444' }}>{errors.confirmPassword}</span>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              height: '48px',
              backgroundColor: isLoading ? '#9ca3af' : '#1a365d',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: isLoading ? 'wait' : 'pointer'
            }}
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        {/* Login link */}
        <p style={{ textAlign: 'center', marginTop: '24px', color: '#6b7280' }}>
          Already have an account?{' '}
          <Link
            to="/login"
            style={{ color: '#1a365d', fontWeight: '600', textDecoration: 'none' }}
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}
