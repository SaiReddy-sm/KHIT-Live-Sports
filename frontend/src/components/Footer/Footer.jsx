import React from 'react';

function Footer() {
  const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Sports', href: '#sports' },
    { name: 'Matches', href: '#matches' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Achievements', href: '#achievements' },
    { name: 'About', href: '#about' },
  ];

  const sportsList = [
    'Cricket',
    'Volleyball',
    'Basketball',
    'Kabaddi',
    'Chess',
    'Carroms',
    'Table Tennis'
  ];

  return (
    <footer className="bg-white border-t-4 border-[#7A1E2D] text-slate-700 pt-12 pb-6" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 pb-8 border-b border-slate-100">
          
          {/* Section 1: Logo & Description */}
          <div className="space-y-4">
            <div className="flex items-center">
              <img 
                src="/logo-full.jpg" 
                alt="KHIT College Logo" 
                className="h-14 w-auto object-contain"
                onError={(e) => {
                  // Fallback handling if logo-full.jpg fails to load
                  e.target.style.display = 'none';
                }}
              />
            </div>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Official Sports Portal of Kallam Haranadhareddy Institute of Technology. Celebrate athletic spirit and achievements.
            </p>
          </div>

          {/* Section 2: Quick Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#7A1E2D] border-b border-[#F2B84B]/40 pb-2 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href} 
                    className="text-xs sm:text-sm text-slate-600 hover:text-[#D9A441] transition-colors duration-150 block"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 3: Sports Disciplines */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#7A1E2D] border-b border-[#F2B84B]/40 pb-2 mb-4">
              Sports List
            </h3>
            <ul className="space-y-2">
              {sportsList.map((sport) => (
                <li key={sport}>
                  <span className="text-xs sm:text-sm text-slate-600 block">
                    {sport}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 4: Contact Info */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#7A1E2D] border-b border-[#F2B84B]/40 pb-2 mb-4">
              Contact
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-600">
              <li className="flex items-start space-x-2">
                <span className="font-semibold text-[#7A1E2D]">Email:</span>
                <a href="mailto:sports@khit.edu" className="hover:text-[#D9A441] transition-colors">
                  sports@khit.edu
                </a>
              </li>
              <li className="flex items-start space-x-2">
                <span className="font-semibold text-[#7A1E2D]">Phone:</span>
                <span>+91 XXXXX XXXXX</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="font-semibold text-[#7A1E2D]">Location:</span>
                <span>Guntur, Andhra Pradesh</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] sm:text-xs text-slate-400 text-center sm:text-left">
            &copy; 2026 KHIT Live Sports. All Rights Reserved.
          </p>
          <p className="text-[11px] sm:text-xs text-slate-400 text-center sm:text-right">
            Designed for Kallam Haranadhareddy Institute of Technology.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;