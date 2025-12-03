import { Plane } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-primary-500 text-white mt-auto">
      <div className="container-app py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-white text-primary-500 p-2 rounded-lg">
                <Plane className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold">SkyBook</span>
            </div>
            <p className="text-primary-100 text-sm max-w-md">
              Find the best flight deals with transparent pricing. No hidden fees, no surprises.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-primary-100 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Search Flights</a></li>
              <li><a href="#" className="hover:text-white transition-colors">My Bookings</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Price Alerts</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-primary-100 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-400 mt-8 pt-8 text-center text-primary-200 text-sm">
          <p>&copy; {new Date().getFullYear()} SkyBook. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
