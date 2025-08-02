import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Shield,
  Truck,
  RotateCcw,
} from "lucide-react";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Mantra</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Your ultimate destination for fashion and lifestyle. Discover the
              latest trends, premium quality products, and exceptional shopping
              experience.
            </p>

            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Phone size={16} />
                <span>+91 1800-123-4567</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Mail size={16} />
                <span>support@mantra.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <MapPin size={16} />
                <span>Bangalore, Karnataka, India</span>
              </div>
            </div>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">
              Customer Service
            </h4>
            <ul className="space-y-2">
              {[
                "Contact Us",
                "FAQ",
                "Size Guide",
                "Shipping Info",
                "Return & Exchange",
                "Track Your Order",
                "Bulk Orders",
              ].map((item) => (
                <li key={item}>
                  <Link
                    to="#"
                    className="text-gray-300 text-sm hover:text-white transition-colors duration-200"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">About</h4>
            <ul className="space-y-2">
              {[
                "About Us",
                "Careers",
                "Press",
                "Sustainability",
                "Investor Relations",
                "Corporate Information",
                "Privacy Policy",
                "Terms & Conditions",
              ].map((item) => (
                <li key={item}>
                  <Link
                    to="#"
                    className="text-gray-300 text-sm hover:text-white transition-colors duration-200"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Social */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Stay Connected</h4>

            {/* Newsletter Signup */}
            <div className="space-y-3">
              <p className="text-gray-300 text-sm">
                Subscribe to get updates on new arrivals and exclusive offers
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-md text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-r-md transition-colors duration-200">
                  <Mail size={16} />
                </button>
              </div>
            </div>

            {/* Social Media Icons */}
            <div className="space-y-3">
              <p className="text-gray-300 text-sm">Follow us on</p>
              <div className="flex space-x-4">
                {[
                  { Icon: FaFacebook, label: "Facebook" },
                  { Icon: FaInstagram, label: "Instagram" },
                  { Icon: FaTwitter, label: "Twitter" },
                  { Icon: FaYoutube, label: "YouTube" },
                ].map(({ Icon, label }) => (
                  <a
                    key={label}
                    href="#"
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors duration-200"
                    aria-label={label}
                  >
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                Icon: Truck,
                title: "Free Shipping",
                desc: "On orders above ₹999",
              },
              {
                Icon: RotateCcw,
                title: "Easy Returns",
                desc: "30-day return policy",
              },
              {
                Icon: Shield,
                title: "Secure Payment",
                desc: "100% secure transactions",
              },
              {
                Icon: CreditCard,
                title: "Multiple Payment",
                desc: "UPI, Cards, Wallets",
              },
            ].map(({ Icon, title, desc }) => (
              <div key={title} className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon size={20} />
                </div>
                <div>
                  <h5 className="text-sm font-medium text-white">{title}</h5>
                  <p className="text-xs text-gray-400">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-8 pt-6 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-300">We Accept:</span>
              <div className="flex items-center space-x-2">
                {["Visa", "Mastercard", "UPI", "Paytm", "PhonePe"].map(
                  (payment) => (
                    <div
                      key={payment}
                      className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-300"
                    >
                      {payment}
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>Trusted by 1M+ customers</span>
              <span>•</span>
              <span>4.5★ Rating</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-sm text-gray-400">
              © 2025 Mantra. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <Link to="#" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <span>•</span>
              <Link to="#" className="hover:text-white transition-colors">
                Terms
              </Link>
              <span>•</span>
              <Link to="#" className="hover:text-white transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
