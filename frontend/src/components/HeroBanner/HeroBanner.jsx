import React from 'react';

function HeroBanner({
  title = "KHIT Live Sports",
  subtitle = "Official Sports Portal of Kallam Haranadhareddy Institute of Technology. Track live branch scores, rosters, schedules, and college achievements.",
  primaryCtaText = "View Live Scores",
  primaryCtaHref = "#matches",
  secondaryCtaText = "Explore Sports",
  secondaryCtaHref = "#sports",
  bannerImage = "/founder-banner.jpg"
}) {
  return (
    <section className="khit-hero-gradient text-white py-16 md:py-24 relative overflow-hidden">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/10"></div>
      
      <div className="khit-container relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        
        {/* Left: Headline & Call to Actions */}
        <div className="space-y-6 text-left">
          <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold tracking-widest uppercase">
            College Sports Hub
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            {title}
          </h1>
          <p className="text-sm md:text-base text-white/95 max-w-md font-medium leading-relaxed">
            {subtitle}
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <a 
              href={primaryCtaHref} 
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-sm sm:text-base font-bold text-slate-900 bg-[#F2B84B] hover:bg-[#D9A441] transition-all duration-200 shadow-lg transform hover:scale-[1.02] focus:outline-none"
            >
              {primaryCtaText}
            </a>
            <a 
              href={secondaryCtaHref} 
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-sm sm:text-base font-semibold text-white border border-white/40 hover:bg-white/10 transition-all duration-150 focus:outline-none"
            >
              {secondaryCtaText}
            </a>
          </div>
        </div>

        {/* Right: College Banner Image Area */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 aspect-video md:aspect-auto md:h-80 bg-slate-900/40 flex items-center justify-center">
          <img 
            src={bannerImage} 
            alt="KHIT Sports Banner" 
            loading="eager"
            className="khit-img-cover transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
        </div>

      </div>
    </section>
  );
}

export default HeroBanner;