import React from 'react';

function TournamentBanner({
  title = "ANNUAL SPORTS MEET 2026",
  subtitle = "Register teams across indoor and outdoor games. Show off your branch's athletic skills.",
  buttonText = "Register Now",
  buttonHref = "#register",
  onButtonClick = null, // Future-proof prop for routing or dynamic clicks
  bannerImage = ""
}) {
  return (
    <div className="bg-[#7A1E2D] text-white rounded-2xl overflow-hidden shadow-md border-b-4 border-[#F2B84B] transition-all duration-300 hover:shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-12 items-center">
        
        {/* Content Section */}
        <div className={`p-6 sm:p-8 ${bannerImage ? 'md:col-span-7 lg:col-span-8' : 'md:col-span-12'} space-y-4`}>
          <div className="flex items-center space-x-2">
            <span className="bg-[#F2B84B]/20 text-[#F2B84B] text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-[#F2B84B]/30">
              Tournament Announcement
            </span>
            <span className="text-[#F2B84B] font-bold text-[10px] sm:text-xs">
              ● Registration Open
            </span>
          </div>
          
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white uppercase">
              {title}
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-slate-200 font-medium">
              {subtitle}
            </p>
          </div>

          <div className="pt-2 flex flex-wrap gap-3">
            {/* Conditional dynamic CTA rendering */}
            {onButtonClick ? (
              <button
                onClick={onButtonClick}
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-xs sm:text-sm font-bold text-slate-900 bg-[#F2B84B] hover:bg-[#D9A441] transition-colors duration-200 shadow-sm focus:outline-none"
              >
                {buttonText}
              </button>
            ) : (
              <a 
                href={buttonHref}
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-xs sm:text-sm font-bold text-slate-900 bg-[#F2B84B] hover:bg-[#D9A441] transition-colors duration-200 shadow-sm focus:outline-none"
              >
                {buttonText}
              </a>
            )}
            
            <a 
              href="#details"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold text-white border border-white/20 hover:bg-white/10 transition-colors duration-150 focus:outline-none"
            >
              View Details
            </a>
          </div>
        </div>

        {/* Optional Image Section (Desktop Only) */}
        {bannerImage && (
          <div className="hidden md:block md:col-span-5 lg:col-span-4 h-full min-h-[180px] relative">
            <img
              src={bannerImage}
              alt={`${title} Tournament Banner`}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                // Suppress missing image container gracefully
                e.target.parentElement.style.display = 'none';
              }}
            />
            {/* Elegant horizontal vignette overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#7A1E2D] via-transparent to-transparent"></div>
          </div>
        )}

      </div>
    </div>
  );
}

export default TournamentBanner;