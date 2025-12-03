import { Plane, Shield, Clock, CreditCard } from 'lucide-react'
import SearchWidget from '../components/search/SearchWidget'

const destinations = [
  { city: 'Paris', country: 'France', code: 'CDG', price: 299, image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop' },
  { city: 'London', country: 'UK', code: 'LHR', price: 349, image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop' },
  { city: 'Tokyo', country: 'Japan', code: 'HND', price: 699, image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop' },
  { city: 'Dubai', country: 'UAE', code: 'DXB', price: 549, image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop' },
]

const features = [
  { icon: Shield, title: 'Secure Booking', description: 'Your data is protected with bank-level security' },
  { icon: Clock, title: 'Best Prices', description: 'We compare hundreds of airlines to find you the best deals' },
  { icon: CreditCard, title: 'No Hidden Fees', description: 'Transparent pricing with no surprise charges' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1920&h=600&fit=crop')] opacity-10 bg-cover bg-center" />
        <div className="relative container-app py-16 md:py-24">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Find Your Perfect Flight
            </h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Search hundreds of airlines to find the best deals. No hidden fees, ever.
            </p>
          </div>

          {/* Search Widget */}
          <div className="max-w-5xl mx-auto">
            <SearchWidget />
          </div>
        </div>

        {/* Wave Decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#f9fafb"/>
          </svg>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-16 bg-gray-50">
        <div className="container-app">
          <h2 className="text-3xl font-bold text-center mb-3">Popular Destinations</h2>
          <p className="text-gray-600 text-center mb-10">Explore our most searched destinations</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((dest) => (
              <div key={dest.code} className="card overflow-hidden group cursor-pointer">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={dest.image}
                    alt={dest.city}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">{dest.city}</h3>
                    <p className="text-sm text-white/80">{dest.country}</p>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <span className="text-sm text-gray-500">From</span>
                  <span className="text-xl font-bold text-primary-500">${dest.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container-app">
          <h2 className="text-3xl font-bold text-center mb-3">Why Choose SkyBook?</h2>
          <p className="text-gray-600 text-center mb-10">We make booking flights simple and affordable</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary-500 mb-4">
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-accent-500 text-white">
        <div className="container-app text-center">
          <Plane className="h-12 w-12 mx-auto mb-4 opacity-80" />
          <h2 className="text-3xl font-bold mb-4">Ready to Explore?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-xl mx-auto">
            Start your journey today. Search for flights and discover amazing destinations.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="btn bg-white text-accent-600 hover:bg-gray-100"
          >
            Search Flights Now
          </button>
        </div>
      </section>
    </div>
  )
}
