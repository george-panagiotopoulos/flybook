import { Link } from 'react-router-dom'
import { Plane, User, Menu, X, LogOut } from 'lucide-react'
import { useState } from 'react'
import { useUserStore } from '../../store/userStore'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, isAuthenticated, logout } = useUserStore()

  const handleLogout = () => {
    logout()
    setMobileMenuOpen(false)
  }

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container-app">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-primary-500 text-white p-2 rounded-lg">
              <Plane className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold text-primary-500">SkyBook</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-600 hover:text-primary-500 font-medium transition-colors">
              Flights
            </Link>
            <Link to="/my-trips" className="text-gray-600 hover:text-primary-500 font-medium transition-colors">
              My Trips
            </Link>
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-gray-700 font-medium">
                  {user?.firstName}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-gray-600 hover:text-red-500 font-medium transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-2 text-gray-600 hover:text-primary-500 font-medium transition-colors">
                <User className="h-5 w-5" />
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-600"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col gap-4">
              <Link
                to="/"
                className="text-gray-600 hover:text-primary-500 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Flights
              </Link>
              <Link
                to="/my-trips"
                className="text-gray-600 hover:text-primary-500 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                My Trips
              </Link>
              {isAuthenticated ? (
                <>
                  <span className="text-gray-700 font-medium">
                    Welcome, {user?.firstName}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-gray-600 hover:text-red-500 font-medium"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 text-gray-600 hover:text-primary-500 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="h-5 w-5" />
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
