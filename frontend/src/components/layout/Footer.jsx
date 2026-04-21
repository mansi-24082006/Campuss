import React from 'react';
import {
  Instagram,
  Send,
  Mail,
  MessageCircle,
  Youtube,
  Twitter,
  Linkedin
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const socialLinks = [
    {
      name: 'Instagram',
      icon: Instagram,
      href: 'https://www.instagram.com/campussbuzz_80/#',
      color: 'hover:text-pink-500 hover:shadow-pink-500/20'
    },
    {
      name: 'Telegram',
      icon: Send,
      href: 'https://t.me/your_telegram_link',
      color: 'hover:text-blue-400 hover:shadow-blue-400/20'
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      href: 'https://wa.me/your_whatsapp_community',
      color: 'hover:text-emerald-500 hover:shadow-emerald-500/20',
      isLive: true // Special badge for active community
    },
    {
      name: 'YouTube',
      icon: Youtube,
      href: 'https://youtube.com/your_channel',
      color: 'hover:text-red-500 hover:shadow-red-500/20'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: 'https://linkedin.com/company/your_page',
      color: 'hover:text-blue-600 hover:shadow-blue-600/20'
    }
  ];

  const footerLinks = [
    {
      title: 'Platform',
      links: [
        { name: 'Events Feed', href: '/events' },
        { name: 'Organizers', href: '/organizers' },
        { name: 'Student Dashboard', href: '/dashboard' }
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Contact Support', href: '/contact' },
        { name: 'Join the Team', href: '/team' }
      ]
    },
  ];

  return (
    <footer className="relative bg-[#0b0f1a] text-white overflow-hidden border-t border-gray-800/50">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto py-16 px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">

          {/* Brand & Social Section */}
          <div className="md:col-span-4 space-y-8">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative p-2.5 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-500 transition-all duration-500 group-hover:scale-110 shadow-lg shadow-purple-500/20">
                <img src="/favicon.png" alt="Logo" className="h-8 w-8 object-contain" />
              </div>
              <span className="text-3xl font-black tracking-tighter bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent group-hover:to-purple-200 transition-all">
                CampusBuzz
              </span>
            </Link>

            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Stay connected with your campus. Join our communities on Telegram and WhatsApp for real-time alerts.
            </p>

            {/* Social Links Grid */}
            <div className="flex flex-wrap gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`relative p-3 bg-gray-800/40 rounded-2xl text-gray-400 border border-gray-700/50 transition-all duration-300 hover:scale-110 hover:border-gray-600 group/icon ${social.color} hover:shadow-2xl`}
                  title={social.name}
                >
                  <social.icon size={20} />

                  {/* Active/Live Community Badge */}
                  {social.isLive && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Dynamic Links */}
          {footerLinks.map((section) => (
            <div key={section.title} className="md:col-span-2">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-8">
                {section.title}
              </h3>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-gray-400 hover:text-white hover:translate-x-1 transition-all inline-block text-sm font-medium"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter Section */}
          <div className="md:col-span-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-8">
              Weekly Buzz
            </h3>
            <p className="text-gray-400 text-sm mb-6">Get the top 5 events of the week delivered to your inbox.</p>
            <form className="flex group bg-gray-800/30 p-1.5 rounded-2xl border border-gray-700/50 focus-within:border-purple-500/50 transition-all">
              <input
                type="email"
                placeholder="College email..."
                className="bg-transparent border-none text-white text-sm px-4 py-2 w-full focus:outline-none focus:ring-0"
              />
              <button className="bg-purple-600 hover:bg-purple-500 p-2.5 rounded-xl transition-all flex items-center justify-center shadow-lg shadow-purple-600/20">
                <Send size={18} />
              </button>
            </form>
            <div className="mt-6 flex items-center gap-3 text-xs text-gray-500">
              <Mail size={14} className="text-purple-500" />
              <span>support@campussbuzz.in</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-gray-800/50 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">
            © {new Date().getFullYear()} CampusBuzz • Built for the student community
          </p>
          <div className="flex space-x-8 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            <a href="#" className="hover:text-purple-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-purple-400 transition-colors">Terms of Use</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;