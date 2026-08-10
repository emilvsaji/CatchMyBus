import { Bus, Mail, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-navy-800 text-white/70 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded bg-amber-400 flex items-center justify-center flex-shrink-0">
                <Bus className="w-3.5 h-3.5 text-navy-800" strokeWidth={2.5} />
              </div>
              <span className="text-white font-bold text-sm">CatchMyBus</span>
            </div>
            <p className="text-xs leading-relaxed max-w-xs">
              Bus timing information for Kerala — helping commuters, students,
              and travellers plan their journeys.
            </p>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-2">
            <p className="section-label text-white/40">Contact</p>
            <a
              href="mailto:info@catchmybus.com"
              className="flex items-center gap-2 text-xs hover:text-amber-400 transition-colors min-h-0"
            >
              <Mail className="w-3.5 h-3.5" />
              info@catchmybus.com
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs hover:text-amber-400 transition-colors min-h-0"
            >
              <Github className="w-3.5 h-3.5" />
              GitHub
            </a>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="border-t border-white/10 mt-6 pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p className="text-xs">
            &copy; {new Date().getFullYear()} CatchMyBus. Kerala, India.
          </p>
          <p className="text-xs text-white/40">
            Open source · For commuters
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
