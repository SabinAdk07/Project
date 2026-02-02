import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-transparent text-gray-700 mt-auto" role="contentinfo">
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About Us</h3>
            <p className="text-gray-300 text-sm">
              Campus Lost & Found Portal helps students and staff reunite with their lost belongings. 
              Our platform makes it easy to report and find lost items across campus.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/browse" className="text-gray-300 hover:text-white transition-colors">
                  Browse Items
                </Link>
              </li>
              <li>
                <Link to="/matches" className="text-gray-300 hover:text-white transition-colors">
                  Find Matches
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>Email: support@campus.edu</li>
              <li>Phone: (555) 123-4567</li>
              <li>Campus Security Office</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
          <p>&copy; {currentYear} Campus Lost & Found Portal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
