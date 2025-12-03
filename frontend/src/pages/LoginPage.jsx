import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plane, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useUserStore } from '../store/userStore'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useUserStore()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
    if (!formData.email) newErrors.email = 'Email is required'
    if (!formData.password) newErrors.password = 'Password is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setIsLoading(true)

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))

    const result = login(formData.email, formData.password)

    if (result.success) {
      toast.success('Welcome back!')
      navigate('/search')
    } else {
      setErrors({ password: result.error })
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
        maxWidth: '400px',
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
            Welcome Back
          </h1>
          <p style={{ color: '#6b7280' }}>
            Sign in to your SkyBook account
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div style={{ marginBottom: '16px', position: 'relative' }}>
            <Mail style={{
              width: '20px',
              height: '20px',
              color: '#9ca3af',
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)'
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

          {/* Password */}
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
                top: '50%',
                transform: 'translateY(-50%)',
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

          {/* Demo credentials hint */}
          <div style={{
            padding: '12px',
            backgroundColor: '#fef3c7',
            borderRadius: '8px',
            marginBottom: '24px',
            fontSize: '14px',
            color: '#92400e'
          }}>
            <strong>Demo credentials:</strong><br />
            Email: demo@skybook.com<br />
            Password: demo123
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
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Register link */}
        <p style={{ textAlign: 'center', marginTop: '24px', color: '#6b7280' }}>
          Don't have an account?{' '}
          <Link
            to="/register"
            style={{ color: '#1a365d', fontWeight: '600', textDecoration: 'none' }}
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}
