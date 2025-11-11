import { Github, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">CatchMyBus</h3>
            <p className="text-sm mb-4">
              Intelligent bus time information system for Kerala. Making public
              transportation more accessible and reliable for everyone.
            </p>
            <div className="flex items-center space-x-2 text-sm">
              <MapPin className="h-4 w-4" />
              <span>Kerala, India</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="hover:text-primary-400 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-primary-400 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="/favorites" className="hover:text-primary-400 transition-colors">
                  Favorites
                </a>
              </li>
              <li>
                <a href="/admin" className="hover:text-primary-400 transition-colors">
                  Admin Panel
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <a href="mailto:info@catchmybus.com" className="hover:text-primary-400 transition-colors">
                  info@catchmybus.com
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+91 1234567890</span>
              </li>
              <li className="flex items-center space-x-2">
                <Github className="h-4 w-4" />
                <a href="https://github.com" className="hover:text-primary-400 transition-colors" target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm">
          <p>
            &copy; {new Date().getFullYear()} CatchMyBus. All rights reserved.
            Made with ❤️ for Kerala
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
