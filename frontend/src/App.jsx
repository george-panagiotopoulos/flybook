import { Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import HomePage from './pages/HomePage'
import SearchResultsPage from './pages/SearchResultsPage'
import PassengersPage from './pages/booking/PassengersPage'
import SeatsPage from './pages/booking/SeatsPage'
import ExtrasPage from './pages/booking/ExtrasPage'
import PaymentPage from './pages/booking/PaymentPage'
import ConfirmationPage from './pages/booking/ConfirmationPage'
import MyTripsPage from './pages/MyTripsPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchResultsPage />} />

          {/* Booking Flow */}
          <Route path="/booking/passengers" element={<PassengersPage />} />
          <Route path="/booking/seats" element={<SeatsPage />} />
          <Route path="/booking/extras" element={<ExtrasPage />} />
          <Route path="/booking/payment" element={<PaymentPage />} />
          <Route path="/booking/confirmation" element={<ConfirmationPage />} />

          {/* User Pages */}
          <Route path="/my-trips" element={<MyTripsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="*" element={
            <div className="min-h-[60vh] flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                <p className="text-gray-600">Page not found</p>
              </div>
            </div>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
