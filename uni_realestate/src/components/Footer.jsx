import { MapPin, Mail, Phone, Facebook, Twitter, Linkedin } from "lucide-react";
const Footer =() => {
    return(<>
        {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-10">
          {/* Column 1 - Brand */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">PropertyPro</h3>
            <p className="text-sm leading-relaxed">
              Smart real-time property rental, maintenance, and amenity
              management platform designed for tenants, owners, and
              administrators.
            </p>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-white transition cursor-pointer">
                Home
              </li>
              <li className="hover:text-white transition cursor-pointer">
                Properties
              </li>
              <li className="hover:text-white transition cursor-pointer">
                Amenities
              </li>
              <li className="hover:text-white transition cursor-pointer">
                Contact
              </li>
            </ul>
          </div>

          {/* Column 3 - User Roles */}
          <div>
            <h4 className="text-white font-semibold mb-4">User Access</h4>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-white transition cursor-pointer">
                Admin Login
              </li>
              <li className="hover:text-white transition cursor-pointer">
                Owner Login
              </li>
              <li className="hover:text-white transition cursor-pointer">
                Tenant Login
              </li>
              <li className="hover:text-white transition cursor-pointer">
                Staff Login
              </li>
            </ul>
          </div>

          {/* Column 4 - Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-green-400" />
                <span>support@propertypro.com</span>
              </div>

              <div className="flex items-center gap-3">
                <Phone size={16} className="text-blue-400" />
                <span>+91 </span>
              </div>

              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-green-400" />
                <span>Mumbai, Maharashtra</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex gap-4 mt-6">
              <Facebook
                className="hover:text-white cursor-pointer transition"
                size={18}
              />
              <Twitter
                className="hover:text-white cursor-pointer transition"
                size={18}
              />
              <Linkedin
                className="hover:text-white cursor-pointer transition"
                size={18}
              />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-12 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} PropertyPro. All rights reserved.
        </div>
      </footer>
    </>)
}

export default Footer;