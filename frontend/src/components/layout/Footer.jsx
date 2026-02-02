import React from 'react';
import { Zap, Twitter, Instagram, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const socialLinks = [
    { icon: Instagram, href: 'https://www.instagram.com/campussbuzz_80/#' },
  ];

  const footerLinks = [
    { title: 'Platform', links: ['Features', 'Pricing', 'Login', 'Sign Up'] },
    { title: 'Company', links: ['About Us', 'Careers', 'Contact', 'Blog'] },
    { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'] },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
               <img
              src="/favicon.png"
              alt="CampusBuzz Logo"
              className="h-10 w-10 object-contain"
            />
              <span className="text-2xl font-bold gradient-text">CampusBuzz</span>
            </Link>
            <p className="text-gray-400 text-sm">
              Connecting campus communities through amazing events.
            </p>
            <div className="flex space-x-4 mt-6">
              {socialLinks.map((social, index) => (
                <a key={index} href={social.href} className="text-gray-400 hover:text-purple-400 transition-colors">
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>
          {footerLinks.map((section) => (
            <div key={section.title}>
              <p className="font-semibold text-gray-300 tracking-wider uppercase">{section.title}</p>
              <ul className="mt-4 space-y-2">
                {section.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} CampusBuzz. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
