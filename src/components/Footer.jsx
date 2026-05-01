import React from "react";
import { Link } from "react-router-dom";
import { UtensilsCrossed, Instagram, Twitter, Facebook, Youtube, Mail, Phone, MapPin, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="hidden md:block bg-white text-gray-950 mt-0">
      {/* Top strip */}
      <div className="bg-linear-to-r from-orange-500 to-amber-400 px-8 py-5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-white font-black text-lg">Get ₹100 off your first order! 🎉</h3>
            <p className="text-white/80 text-sm mt-0.5">Subscribe to our newsletter for exclusive deals</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <input placeholder="Enter your email" className="flex-1 sm:w-56 px-4 py-2.5 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-white/50 bg-white/90" />
            <button className="bg-orange-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-orange-800 transition shrink-0">Subscribe</button>
          </div>          
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <Link to="/" className="flex items-center mb-4">
              <img
                src="/Logo.png"
                alt="FoodieZone"
                className="h-12 w-auto object-contain"
                loading="lazy"
              />
            </Link>
            <p className="text-gray-950 text-sm leading-relaxed mb-5 max-w-xs">
              Bringing restaurant-quality food to your doorstep. Fresh ingredients, expert chefs, unforgettable meals.
            </p>
            {/* Contact */}
            <div className="space-y-2">
              <a href="tel:+911800XXXXXXX" className="flex items-center gap-2.5 text-sm text-gray-400 hover:text-orange-400 transition-colors">
                <div className="w-7 h-7 bg-gray-800 rounded-lg flex items-center justify-center shrink-0 "><Phone className="w-3.5 h-3.5" /></div>
                <span className="text-gray-950">+91 1800-XXX-XXXX</span>
              </a>
              <a href="mailto:hello@foodiezone.com" className="flex items-center gap-2.5 text-sm text-gray-400 hover:text-orange-400 transition-colors">
                <div className="w-7 h-7 bg-gray-800 rounded-lg flex items-center justify-center shrink-0"><Mail className="w-3.5 h-3.5" /></div>
                <span className="text-gray-950">
                  hello@ServeMyMeal.com
                </span>
              </a>
              <div className="flex items-center gap-2.5 text-sm text-gray-400">
                <div className="w-7 h-7 bg-gray-800 rounded-lg flex items-center justify-center shrink-0"><MapPin className="w-3.5 h-3.5" /></div>
                <span className="text-gray-950">
                  Ahmedabad, Gujarat, India
                </span>
              </div>
            </div>
            {/* Social */}
            <div className="flex gap-2 mt-5">
              {[
                { icon: Instagram, href: "#", color: "hover:bg-pink-600" },
                { icon: Twitter, href: "#", color: "hover:bg-sky-500" },
                { icon: Facebook, href: "#", color: "hover:bg-blue-600" },
                { icon: Youtube, href: "#", color: "hover:bg-red-600" },
              ].map(({ icon: Icon, href, color }) => (
                <a key={href + color} href={href}
                  className={`w-9 h-9 bg-gray-800 ${color} rounded-xl flex items-center justify-center transition-all hover:scale-110`}>
                  <Icon className="w-4 h-4 text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Menu</h4>
            <ul className="space-y-2.5">
              {[
                { to: "/menu/Starters", label: "Starters" },
                { to: "/menu/Main Course", label: "Main Course" },
                { to: "/menu/South Indian", label: "South Indian" },
                { to: "/menu/Indo Chinese", label: "Indo Chinese" },
                { to: "/menu/Dessert", label: "Desserts" },
                { to: "/menu/Beverages", label: "Beverages" },
                { to: "/veg", label: "Only Veg" },
              ].map(({ to, label }) => (
                <li key={to}><Link to={to} className="text-sm hover:text-orange-400 transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Services</h4>
            <ul className="space-y-2.5">
              {[
                { to: "/cook-booking", label: "Book a Cook " },
                { to: "/orders", label: "Track Order" },
                { to: "/cart", label: "My Cart" },
                { to: "/profile", label: "My Account" },
              ].map(({ to, label }) => (
                <li key={to}><Link to={to} className="text-sm hover:text-orange-400 transition-colors">{label}</Link></li>
              ))}
              <li><a href="#" className="text-sm hover:text-orange-400 transition-colors">Partner With Us</a></li>
              <li><a href="#" className="text-sm hover:text-orange-400 transition-colors">Become a Chef </a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Support</h4>
            <ul className="space-y-2.5">
              {["Help & FAQs", "Contact Us", "Refund Policy", "Privacy Policy", "Terms of Service", "Careers", "About Us"].map((l) => (
                <li key={l}><a href="#" className="text-sm hover:text-orange-400 transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800 px-8 py-5  flex items-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs ">
            © 2026 ServeMyMeal. Made with  in Ahmedabad, India.
          </p>
          
        
        </div>
      </div>
    </footer>
  );
}
