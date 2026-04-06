import React from 'react';
import { Instagram, Send, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const socialLinks = [
    { icon: Instagram, href: 'https://www.instagram.com/campussbuzz_80/#' },
    // You can add more here later
  ];

  const footerLinks = [
    {
      title: 'Platform',
      links: [
        { name: 'Events Feed', href: '/events' },
        { name: 'Organizers', href: '/organizers' },
        { name: 'Pricing', href: '/pricing' },
        { name: 'Student Dashboard', href: '/dashboard' }
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Contact Support', href: '/contact' },
        { name: 'Our Team', href: '/team' }
      ]
    },
  ];

  return (
    <footer className="relative bg-[#0b0f1a] text-white overflow-hidden border-t border-gray-800/50">
      {/* Subtle Background Glow for Modern Feel */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto py-16 px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">

          {/* Brand Section */}
          <div className="md:col-span-4 space-y-6">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="group flex items-center gap-4 cursor-pointer">
                {/* The Simplified "Wow" Icon Container */}
                <div className="relative p-2.5 
                  rounded-2xl
                  /* 1. Base Gradient Background */
                  bg-gradient-to-br from-purple-600 via-purple-500 to-blue-500
                  
                  /* 2. Simplified Hover Transformation (Scale & Rotate) */
                  transition-all duration-500 ease-out
                  group-hover:scale-110 group-hover:rotate-3
                  
                  /* 3. Simplified Glow (No Animation, Just Clean Shadow) */
                  shadow-lg shadow-purple-500/20
                  group-hover:shadow-xl group-hover:shadow-blue-500/40">

                  <img
                    src="/favicon.png"
                    alt="CampusBuzz Logo"
                    className="h-9 w-9 object-contain
                 /* Keeps subtle pop-out effect */
                 drop-shadow-[0_2px_3px_rgba(0,0,0,0.2)]"
                  />
                </div>

                {/* Typography - Keep this! It's professional for BE projects. */}
                <span className="text-3xl font-extrabold tracking-tighter bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:from-white group-hover:to-purple-200 transition-colors duration-300">
                  CampusBuzz
                </span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              The ultimate aggregator for college life. Discover events, join clubs, and stay connected with your campus community in real-time.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="p-2 bg-gray-800/50 rounded-full text-gray-400 hover:text-purple-400 hover:bg-gray-800 transition-all border border-gray-700/50"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Dynamic Links Sections */}
          {footerLinks.map((section) => (
            <div key={section.title} className="md:col-span-2">
              <h3 className="text-sm font-bold text-gray-200 uppercase tracking-widest mb-6">
                {section.title}
              </h3>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-gray-400 hover:text-white hover:translate-x-1 transition-all inline-block text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter / Contact Section - Makes it look "Live" */}
          <div className="md:col-span-4">
            <h3 className="text-sm font-bold text-gray-200 uppercase tracking-widest mb-6">
              Stay Updated
            </h3>
            <p className="text-gray-400 text-sm mb-4">Subscribe to get notified about new events at SSASIT.</p>
            <form className="flex group">
              <input
                type="email"
                placeholder="College email..."
                className="bg-gray-800/50 border border-gray-700 text-white text-sm rounded-l-lg px-4 py-2.5 w-full focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
              />
              <button className="bg-purple-600 hover:bg-purple-500 px-4 py-2.5 rounded-r-lg transition-colors flex items-center justify-center">
                <Send size={18} />
              </button>
            </form>
            <div className="mt-6 space-y-2 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <Mail size={14} /> <span>support@campussbuzz.in</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} CampusBuzz • Developed by Team DE
          </p>
          <div className="flex space-x-6 text-xs text-gray-500">
            <a href="#" className="hover:text-gray-300">Privacy Policy</a>
            <a href="#" className="hover:text-gray-300">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;